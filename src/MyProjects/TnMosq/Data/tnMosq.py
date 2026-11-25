"""
Tunisian mosques scraper
------------------------
Collects mosques in Tunisia from several open sources, merges duplicates, and adds
analysis columns.

Sources (each can be switched off below):
  1. OpenStreetMap  - tagged mosques, places of worship with no religion tag,
                      and anything *named* جامع / مسجد / mosquée / masjid / jamaa
  2. Overture Maps  - open places dataset (Meta, Microsoft, …), via DuckDB
  3. Foursquare OS Places - optional; skipped automatically if not reachable
  4. Wikidata       - founding dates, photos, capacity (joined, not a source of rows)

Outputs (saved next to this file):
  tn_mosques.csv            one row per mosque after merging duplicates
  tn_mosques.geojson        same, as points for the map
  tn_biggest_by_gov.csv     largest mapped footprint in each governorate
  tn_mosque_name_words.csv  most common words in mosque names
  tn_raw_<source>.csv       every raw record per source, before merging
  tn_merge_groups.csv       which raw records were merged into which mosque

Run:
  Press ▶ in VS Code / F5, or: python tnMosq.py
  Missing packages install themselves.
"""
import json, os, re, sys, time, math, subprocess, threading
from collections import Counter
from difflib import SequenceMatcher

# --- VS Code friendly setup ---------------------------------------------------
os.chdir(os.path.dirname(os.path.abspath(__file__)))   # outputs go next to this file

REQUIRED = {"requests": "requests", "pandas": "pandas", "shapely": "shapely",
            "pyproj": "pyproj", "scipy": "scipy", "tqdm": "tqdm", "duckdb": "duckdb"}
missing = []
for mod, pkg in REQUIRED.items():
    try:
        __import__(mod)
    except ImportError:
        missing.append(pkg)
if missing:
    print(f"Installing {missing} into {sys.executable} …")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "--user", *missing])

import requests
import pandas as pd
from shapely.geometry import Polygon, Point, LineString
from shapely.ops import unary_union, transform, polygonize
from shapely.prepared import prep
from shapely import wkt as shp_wkt
from pyproj import Transformer
from scipy.spatial import cKDTree
from tqdm import tqdm

# ============================================================================
# Settings
# ============================================================================
USE_OSM = True
USE_OVERTURE = True
USE_FOURSQUARE = True          # skipped with a message if the bucket isn't reachable
OVERTURE_MIN_CONFIDENCE = 0.3  # Overture gives each place a 0-1 confidence score

UA = {"User-Agent": "tn-mosques-atlas/0.2 (contact: you@example.com)"}  # put your email

OVERPASS_SERVERS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.private.coffee/api/interpreter",
    "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
]
WIKIDATA = "https://query.wikidata.org/sparql"
OVERTURE_FALLBACK_RELEASE = "2026-10-21.0"
FSQ_FALLBACK_PATH = "s3://fsq-os-places-us-east-1/release/dt=2025-04-08/places/parquet/*.parquet"
TN_BBOX = dict(xmin=7.4, xmax=11.7, ymin=30.2, ymax=37.6)

# Merge rules (metres)
MERGE_ALWAYS_M = 25        # two records this close are the same mosque
MERGE_NONAME_M = 50        # …or this close if one of them has no name
MERGE_SIMILAR_NAME_M = 120 # …or this close if their names match

# ============================================================================
# Name helpers
# ============================================================================
# "جامع"/"مسجد" as whole words (so "جامعة" = university does not match),
# plus Latin spellings. Used by Python and DuckDB (RE2) - same syntax works in both.
NAME_RE = r"(^|\s)(ال)?(جامع|مسجد)(\s|$)|(?i:mosqu|masj|\bd?j[ae]m[aâ]a\b)"
NAME_RX = re.compile(NAME_RE)
# Names that mention a mosque but are something else (streets, cafés, schools…)
NOT_A_MOSQUE_RX = re.compile(
    r"^\s*(rue|avenue|av\.?|bd|boulevard|impasse|route|cit[ée]|caf[ée]|[ée]cole|lyc[ée]e|"
    r"coll[èe]ge|h[ôo]tel|pharmacie|station|arr[êe]t|parking|boulangerie|librairie|"
    r"نهج|شارع|زنقة|طريق|مقهى|مدرسة|معهد|صيدلية|محطة|حي|سوق|مخبزة|مكتبة|مطعم)\b",
    re.I)

AR_DIACRITICS = re.compile(r"[ً-ٰٟـ]")
NAME_STOPWORDS = {"جامع", "مسجد", "الجامع", "المسجد", "mosquee", "mosquée", "mosque",
                  "masjid", "masjed", "jamaa", "jemaa", "djamaa", "djemaa", "jamaâ",
                  "de", "du", "la", "le", "el", "al", "of", "the"}


def norm_name(n):
    """Normalise a name for comparison: drop diacritics, unify letters, drop 'mosque' words."""
    if not isinstance(n, str) or not n.strip():
        return ""
    n = AR_DIACRITICS.sub("", n.lower())
    n = (n.replace("أ", "ا").replace("إ", "ا").replace("آ", "ا")
          .replace("ة", "ه").replace("ى", "ي"))
    words = re.findall(r"\w+", n)
    return " ".join(w for w in words if w not in NAME_STOPWORDS)


def names_similar(a, b):
    a, b = norm_name(a), norm_name(b)
    if not a or not b:
        return False
    if a == b or (len(a) >= 4 and a in b) or (len(b) >= 4 and b in a):
        return True
    return SequenceMatcher(None, a, b).ratio() >= 0.75


def looks_like_mosque_name(n):
    return isinstance(n, str) and bool(NAME_RX.search(n)) and not NOT_A_MOSQUE_RX.search(n)


# ============================================================================
# Overpass (OpenStreetMap)
# ============================================================================
OSM_MOSQUES_Q = """
[out:json][timeout:900];
area["ISO3166-1"="TN"][admin_level=2]->.tn;
rel(area.tn)["boundary"="administrative"]["admin_level"="4"];
map_to_area->.govs;
foreach.govs->.g(
  .g out tags;
  (
    nwr["amenity"="place_of_worship"]["religion"="muslim"](area.g);
    nwr["building"="mosque"](area.g);
    nwr["amenity"="place_of_worship"][!"religion"](area.g);
    nwr["name"~"(^| )(ال)?(جامع|مسجد)( |$)|mosqu|masj|d?j[ae]m[aâ]a",i]
       [!"highway"][!"shop"][!"place"][!"railway"][!"public_transport"](area.g);
  );
  out tags geom;
);
"""

OSM_GOVERNORATES_Q = """
[out:json][timeout:300];
area["ISO3166-1"="TN"][admin_level=2]->.tn;
rel(area.tn)["boundary"="administrative"]["admin_level"="4"];
out tags geom;
"""


def _post_with_timer(desc, url, query):
    """Overpass sends nothing until the query finishes, so show a timer, then a download bar."""
    result = {}

    def work():
        try:
            result["r"] = requests.post(url, data={"data": query}, headers=UA,
                                        timeout=1200, stream=True)
        except Exception as e:
            result["err"] = e

    t = threading.Thread(target=work, daemon=True)
    t.start()
    with tqdm(desc=desc, bar_format="{desc}: {elapsed} elapsed") as bar:
        while t.is_alive():
            t.join(0.5)
            bar.refresh()
    if "err" in result:
        raise result["err"]
    r = result["r"]
    if r.status_code != 200:
        return r, None
    total = int(r.headers.get("Content-Length", 0)) or None
    chunks = []
    with tqdm(total=total, unit="B", unit_scale=True, desc="Downloading") as bar:
        for chunk in r.iter_content(chunk_size=1 << 16):
            chunks.append(chunk)
            bar.update(len(chunk))
    return r, json.loads(b"".join(chunks))


def fetch_overpass(query, label):
    attempts = [u for _ in range(2) for u in OVERPASS_SERVERS]
    for i, url in enumerate(attempts, 1):
        host = url.split("/")[2]
        try:
            r, data = _post_with_timer(f"{label} via {host} (try {i}/{len(attempts)})", url, query)
        except requests.RequestException as e:
            tqdm.write(f"  {host}: connection problem ({e.__class__.__name__}), trying next…")
            continue
        if data is not None:
            return data
        body = r.text[:400].replace("\n", " ")
        tqdm.write(f"  {host}: HTTP {r.status_code} — {body}")
        if r.status_code == 400:
            sys.exit("Overpass rejected the query (HTTP 400). Message above says why.")
        wait = 60 if r.status_code in (429, 504) else 10
        for _ in tqdm(range(wait), desc="Waiting before next try", unit="s", leave=False):
            time.sleep(1)
    sys.exit("All Overpass servers failed. Try again later (they are busiest in European daytime).")


# --- geometry helpers ----------------------------------------------------------
to_m = Transformer.from_crs("EPSG:4326", "EPSG:32632", always_xy=True).transform  # metres


def ring(coords):
    pts = [(c["lon"], c["lat"]) for c in coords if c]
    return Polygon(pts) if len(pts) >= 4 and pts[0] == pts[-1] else None


def footprint(el):
    """Shapely polygon (lon/lat) for closed ways and multipolygon relations, else None."""
    if el["type"] == "way" and "geometry" in el:
        p = ring(el["geometry"])
        return p if p is not None and p.is_valid else None
    if el["type"] == "relation":
        outers = [ring(m.get("geometry", [])) for m in el.get("members", [])
                  if m.get("role") == "outer" and m.get("type") == "way"]
        inners = [ring(m.get("geometry", [])) for m in el.get("members", [])
                  if m.get("role") == "inner" and m.get("type") == "way"]
        outers = [p for p in outers if p and p.is_valid]
        if not outers:
            return None
        shape = unary_union(outers)
        for p in inners:
            if p and p.is_valid:
                shape = shape.difference(p)
        return shape
    return None


def orientation(poly_m):
    """Axis of the minimum rotated rectangle (0-90°) and how rectangular the shape is."""
    mrr = poly_m.minimum_rotated_rectangle
    if mrr.geom_type != "Polygon" or mrr.area == 0:
        return None, None
    (x0, y0), (x1, y1) = list(mrr.exterior.coords)[:2]
    ang = (math.degrees(math.atan2(x1 - x0, y1 - y0)) + 360) % 90
    return round(ang, 1), round(poly_m.area / mrr.area, 3)


EXCLUDE_TAGS = {"highway", "shop", "office", "tourism", "place", "landuse", "railway",
                "public_transport", "leisure", "craft", "healthcare", "historic:railway"}


def classify_osm(t):
    """How did this OSM element get in? Returns None if it's probably not a mosque."""
    if t.get("religion") == "muslim" or t.get("building") == "mosque":
        return "tag"
    if t.get("amenity") == "place_of_worship":
        if t.get("religion"):          # christian / jewish
            return None
        return "worship_no_religion"   # in Tunisia almost always a mosque or zawiya
    # name-only matches: drop streets, shops, schools…
    if any(k in t for k in EXCLUDE_TAGS):
        return None
    if t.get("amenity") and t.get("amenity") != "place_of_worship":
        return None
    if t.get("building") not in (None, "yes", "mosque", "religious", "public"):
        return None
    names = [t.get("name"), t.get("name:ar"), t.get("name:fr")]
    return "name" if any(looks_like_mosque_name(n) for n in names) else None


def parse_osm(osm):
    rows, gov, seen = [], None, set()
    for el in tqdm(osm["elements"], desc="Parsing OSM elements", unit="el"):
        if el["type"] == "area":
            t = el.get("tags", {})
            gov = {"gov": t.get("name:en") or t.get("name:fr") or t.get("name"),
                   "gov_ar": t.get("name:ar")}
            continue
        key = (el["type"], el["id"])
        if key in seen:
            continue
        seen.add(key)
        t = el.get("tags", {})
        match = classify_osm(t)
        if match is None:
            continue
        poly = footprint(el)
        if el["type"] == "node":
            lat, lon = el["lat"], el["lon"]
        elif poly is not None and not poly.is_empty:
            c = poly.representative_point()
            lat, lon = c.y, c.x
        elif el.get("bounds"):
            b = el["bounds"]
            lat, lon = (b["minlat"] + b["maxlat"]) / 2, (b["minlon"] + b["maxlon"]) / 2
        elif el.get("geometry"):
            pts = [g for g in el["geometry"] if g]
            lat = sum(g["lat"] for g in pts) / len(pts)
            lon = sum(g["lon"] for g in pts) / len(pts)
        else:
            continue
        poly_m = transform(to_m, poly) if poly is not None and not poly.is_empty else None
        axis, rect = orientation(poly_m) if poly_m is not None else (None, None)
        rows.append({
            "source": "osm",
            "source_id": f"{el['type']}/{el['id']}",
            "match_type": match,
            "name": t.get("name"),
            "name_ar": t.get("name:ar") or (t.get("name") if re.search(r"[؀-ۿ]", t.get("name") or "") else None),
            "name_fr": t.get("name:fr"),
            "name_en": t.get("name:en"),
            "governorate": gov and gov["gov"],
            "governorate_ar": gov and gov["gov_ar"],
            "lat": lat, "lon": lon,
            "footprint_m2": round(poly_m.area, 1) if poly_m is not None else None,
            "axis_deg": axis,
            "rectangularity": rect,
            "outline_wkt": poly.wkt if poly is not None else None,
            "denomination": t.get("denomination"),
            "building": t.get("building"),
            "start_date": t.get("start_date"),
            "wikidata": t.get("wikidata"),
            "wikipedia": t.get("wikipedia"),
            "heritage": t.get("heritage"),
            "url": f"https://www.openstreetmap.org/{el['type']}/{el['id']}",
        })
    return pd.DataFrame(rows)


def parse_governorates(osm):
    """Build governorate polygons from admin boundary relations (for non-OSM sources)."""
    govs = []
    for el in osm["elements"]:
        if el["type"] != "relation":
            continue
        t = el.get("tags", {})
        outer, inner = [], []
        for m in el.get("members", []):
            if m.get("type") != "way" or not m.get("geometry"):
                continue
            line = LineString([(g["lon"], g["lat"]) for g in m["geometry"] if g])
            (inner if m.get("role") == "inner" else outer).append(line)
        polys = list(polygonize(unary_union(outer))) if outer else []
        if not polys:
            continue
        shape = unary_union(polys)
        holes = list(polygonize(unary_union(inner))) if inner else []
        for h in holes:
            shape = shape.difference(h)
        govs.append({"gov": t.get("name:en") or t.get("name:fr") or t.get("name"),
                     "gov_ar": t.get("name:ar"), "shape": shape, "prep": prep(shape)})
    return govs


def assign_governorate(df, govs, osm_df=None):
    """Label points with their governorate; drop points outside Tunisia."""
    if df.empty:
        return df
    g_en, g_ar, keep = [], [], []
    if govs:
        for lat, lon in tqdm(zip(df.lat, df.lon), total=len(df), desc="Assigning governorates"):
            p = Point(lon, lat)
            hit = next((g for g in govs if g["prep"].contains(p)), None)
            if hit is None:   # just offshore / on the border line: nearest within ~1 km
                near = min(govs, key=lambda g: g["shape"].distance(p))
                hit = near if near["shape"].distance(p) < 0.01 else None
            g_en.append(hit and hit["gov"]); g_ar.append(hit and hit["gov_ar"]); keep.append(hit is not None)
    elif osm_df is not None and len(osm_df):
        # fallback: governorate of the nearest OSM mosque, if within 10 km
        tqdm.write("  (no governorate polygons - using nearest OSM mosque instead)")
        tree = cKDTree([to_m(x, y) for x, y in zip(osm_df.lon, osm_df.lat)])
        d, i = tree.query([to_m(x, y) for x, y in zip(df.lon, df.lat)])
        for dist, idx in zip(d, i):
            ok = dist < 10_000
            g_en.append(osm_df.governorate.iloc[idx] if ok else None)
            g_ar.append(osm_df.governorate_ar.iloc[idx] if ok else None)
            keep.append(ok)
    else:
        return df
    df = df.assign(governorate=g_en, governorate_ar=g_ar)
    dropped = len(df) - sum(keep)
    if dropped:
        tqdm.write(f"  dropped {dropped} points outside Tunisia")
    return df[keep].reset_index(drop=True)


# ============================================================================
# Overture Maps & Foursquare (DuckDB reads only the Tunisia part of the files)
# ============================================================================
def duck():
    import duckdb
    con = duckdb.connect()
    con.execute("INSTALL httpfs; LOAD httpfs;")
    return con


def _map_get(m, key):
    """DuckDB MAP comes back as a dict - in either {k: v} or {'key': [...], 'value': [...]} form."""
    if m is None:
        return None
    if isinstance(m, dict):
        if "key" in m and "value" in m and isinstance(m["key"], list):
            return dict(zip(m["key"], m["value"])).get(key)
        return m.get(key)
    try:
        return dict(m).get(key)
    except Exception:
        return None


def overture_release():
    for url, k in [("https://stac.overturemaps.org/catalog.json", "latest"),
                   ("https://labs.overturemaps.org/data/releases.json", "latest")]:
        try:
            v = requests.get(url, headers=UA, timeout=30).json().get(k)
            if v:
                return v
        except Exception:
            pass
    return OVERTURE_FALLBACK_RELEASE


OTHER_FAITHS = ("church", "synagogue", "temple", "christian", "jewish", "hindu",
                "buddhist", "cathedral", "chapel")


def fetch_overture(path=None):
    if path is None:
        rel = overture_release()
        tqdm.write(f"  Overture release {rel}")
        path = f"s3://overturemaps-us-west-2/release/{rel}/theme=places/type=place/*"
    con = duck()
    if path.startswith("s3://"):
        con.execute("SET s3_region='us-west-2';")
    q = f"""
    SELECT id, names.primary AS name, names.common AS common,
           taxonomy.primary AS category, taxonomy.hierarchy AS hierarchy,
           basic_category, confidence,
           (bbox.xmin + bbox.xmax) / 2 AS lon, (bbox.ymin + bbox.ymax) / 2 AS lat
    FROM read_parquet('{path}', hive_partitioning=1)
    WHERE bbox.xmin BETWEEN {TN_BBOX['xmin']} AND {TN_BBOX['xmax']}
      AND bbox.ymin BETWEEN {TN_BBOX['ymin']} AND {TN_BBOX['ymax']}
      AND ( list_contains(taxonomy.hierarchy, 'mosque')
            OR taxonomy.primary ILIKE '%mosque%'
            OR basic_category ILIKE '%mosque%'
            OR basic_category ILIKE '%worship%'
            OR basic_category ILIKE '%relig%'
            OR regexp_matches(coalesce(names.primary, ''), '{NAME_RE}') )
    """
    with tqdm(desc="Overture query (reads only Tunisia's slice)",
              bar_format="{desc}: {elapsed} elapsed") as bar:
        out = {}
        t = threading.Thread(target=lambda: out.update(df=con.execute(q).df()), daemon=True)
        t.start()
        while t.is_alive():
            t.join(0.5); bar.refresh()
    if "df" not in out:
        raise RuntimeError("Overture query failed (see error above)")
    raw = out["df"]
    rows = []
    for r in raw.itertuples(index=False):
        hier = [str(h).lower() for h in (r.hierarchy if r.hierarchy is not None else [])]
        cat_text = " ".join(hier + [str(r.category or ""), str(r.basic_category or "")]).lower()
        if any(f in cat_text for f in OTHER_FAITHS):
            continue
        if "mosque" in cat_text:
            match = "category"
        elif looks_like_mosque_name(r.name):
            match = "name"
        elif "worship" in cat_text or "relig" in cat_text:
            match = "worship_generic"
        else:
            continue
        if r.confidence is not None and r.confidence < OVERTURE_MIN_CONFIDENCE:
            continue
        ar = _map_get(r.common, "ar")
        if not ar and isinstance(r.name, str) and re.search(r"[؀-ۿ]", r.name):
            ar = r.name
        rows.append({"source": "overture", "source_id": r.id, "match_type": match,
                     "name": r.name, "name_ar": ar,
                     "name_fr": _map_get(r.common, "fr"), "name_en": _map_get(r.common, "en"),
                     "lat": r.lat, "lon": r.lon, "confidence": r.confidence,
                     "category": r.category,
                     "url": f"https://explore.overturemaps.org/#16/{r.lat}/{r.lon}"})
    return pd.DataFrame(rows)


def fetch_foursquare(path=None):
    con = duck()
    if path is None or path.startswith("s3://"):
        con.execute("SET s3_region='us-east-1';")
    if path is None:
        try:
            files = con.execute("SELECT file FROM glob('s3://fsq-os-places-us-east-1/release/dt=*/places/parquet/*.parquet')").df()
            latest = sorted({re.search(r"dt=([\d-]+)", f).group(1) for f in files.file})[-1]
            path = f"s3://fsq-os-places-us-east-1/release/dt={latest}/places/parquet/*.parquet"
        except Exception:
            path = FSQ_FALLBACK_PATH
    tqdm.write(f"  Foursquare path {path}")
    q = f"""
    SELECT fsq_place_id, name, latitude AS lat, longitude AS lon,
           array_to_string(coalesce(fsq_category_labels, []), ' | ') AS category
    FROM read_parquet('{path}')
    WHERE country = 'TN' AND date_closed IS NULL
      AND ( array_to_string(coalesce(fsq_category_labels, []), '|') ILIKE '%mosque%'
            OR regexp_matches(coalesce(name, ''), '{NAME_RE}') )
    """
    with tqdm(desc="Foursquare query", bar_format="{desc}: {elapsed} elapsed") as bar:
        out = {}
        def run():
            try:
                out["df"] = con.execute(q).df()
            except Exception as e:
                out["err"] = e
        t = threading.Thread(target=run, daemon=True)
        t.start()
        while t.is_alive():
            t.join(0.5); bar.refresh()
    if "err" in out:
        raise out["err"]
    raw = out["df"]
    rows = []
    for r in raw.itertuples(index=False):
        if "mosque" in (r.category or "").lower():
            match = "category"
        elif looks_like_mosque_name(r.name):
            match = "name"
        else:
            continue
        rows.append({"source": "foursquare", "source_id": r.fsq_place_id, "match_type": match,
                     "name": r.name,
                     "name_ar": r.name if isinstance(r.name, str) and re.search(r"[؀-ۿ]", r.name) else None,
                     "lat": r.lat, "lon": r.lon, "category": r.category,
                     "url": f"https://foursquare.com/v/{r.fsq_place_id}"})
    return pd.DataFrame(rows)


# ============================================================================
# Merging duplicates
# ============================================================================
SOURCE_RANK = {"osm": 0, "overture": 1, "foursquare": 2}
MATCH_RANK = {"tag": 0, "category": 1, "worship_no_religion": 2, "name": 3, "worship_generic": 4}
FILL_COLS = ["name", "name_ar", "name_fr", "name_en", "governorate", "governorate_ar",
             "wikidata", "wikipedia", "start_date", "heritage", "denomination"]


def merge_duplicates(df):
    """Group records that describe the same mosque, keep the best one, fill gaps from the rest."""
    df = df.dropna(subset=["lat", "lon"]).reset_index(drop=True)
    n = len(df)
    xy = [to_m(lon, lat) for lon, lat in zip(df.lon, df.lat)]
    polys = [transform(to_m, shp_wkt.loads(w)) if isinstance(w, str) else None
             for w in df.get("outline_wkt", pd.Series([None] * n))]
    pts = [Point(p) for p in xy]
    best_name = df["name_ar"].fillna(df["name"])

    parent = list(range(n))
    def find(i):
        while parent[i] != i:
            parent[i] = parent[parent[i]]
            i = parent[i]
        return i

    pairs = cKDTree(xy).query_pairs(r=MERGE_SIMILAR_NAME_M, output_type="ndarray")
    for i, j in tqdm(pairs, desc="Checking possible duplicates"):
        d = math.dist(xy[i], xy[j])
        pi, pj = polys[i], polys[j]
        # two separate building outlines are different mosques unless they overlap or share a name
        if pi is not None and pj is not None and not pi.intersects(pj) \
                and not names_similar(best_name[i], best_name[j]):
            continue
        inside = (pi is not None and pi.buffer(10).contains(pts[j])) or \
                 (pj is not None and pj.buffer(10).contains(pts[i]))
        no_name = not norm_name(best_name[i]) or not norm_name(best_name[j])
        if (d <= MERGE_ALWAYS_M or inside
                or (no_name and d <= MERGE_NONAME_M)
                or names_similar(best_name[i], best_name[j])):
            parent[find(i)] = find(j)

    df["group"] = [find(i) for i in range(n)]
    df["_has_outline"] = df.get("footprint_m2", pd.Series([None] * n)).notna()
    df["_rank"] = list(zip(~df["_has_outline"],
                           df.source.map(SOURCE_RANK).fillna(9),
                           df.match_type.map(MATCH_RANK).fillna(9),
                           -df.get("footprint_m2", pd.Series([0] * n)).fillna(0),
                           -df.get("confidence", pd.Series([0] * n)).fillna(0)))

    merged = []
    for g, grp in tqdm(df.groupby("group"), desc="Merging groups"):
        grp = grp.sort_values("_rank")
        best = grp.iloc[0].copy()
        for c in FILL_COLS:
            if c in grp and pd.isna(best.get(c)):
                vals = grp[c].dropna()
                if len(vals):
                    best[c] = vals.iloc[0]
        best["sources"] = "|".join(sorted(grp.source.unique(), key=SOURCE_RANK.get))
        best["n_sources"] = grp.source.nunique()
        best["n_records"] = len(grp)
        best["member_ids"] = "|".join(grp.source + ":" + grp.source_id.astype(str))
        merged.append(best)
    out = pd.DataFrame(merged).drop(columns=["_rank", "_has_outline"])
    groups = df[["group", "source", "source_id", "name", "lat", "lon"]]
    return out.reset_index(drop=True), groups


# ============================================================================
# Analysis columns
# ============================================================================
KAABA = (21.4225, 39.8262)


def bearing(lat1, lon1, lat2, lon2):
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dl = math.radians(lon2 - lon1)
    x = math.sin(dl) * math.cos(p2)
    y = math.cos(p1) * math.sin(p2) - math.sin(p1) * math.cos(p2) * math.cos(dl)
    return (math.degrees(math.atan2(x, y)) + 360) % 360


def deviation(axis, target):
    """A rectangle can face 4 ways (axis + k*90). Pick the one nearest the qibla; signed gap."""
    if axis is None or target is None or pd.isna(axis) or pd.isna(target):
        return None
    best = min((axis + k * 90 for k in range(4)),
               key=lambda d: abs((d - target + 180) % 360 - 180))
    return round((best - target + 180) % 360 - 180, 1)


def add_orientation(df):
    df["target_bearing"] = [round(bearing(la, lo, *KAABA), 1) for la, lo in zip(df.lat, df.lon)]
    df["deviation_deg"] = [deviation(a, t) for a, t in tqdm(
        zip(df.axis_deg, df.target_bearing), total=len(df), desc="Qibla deviation")]
    df["orientation_reliable"] = (df.rectangularity >= 0.85) & (df.footprint_m2 >= 60)
    return df


def add_nearest(df):
    df = df.dropna(subset=["lat", "lon"]).reset_index(drop=True)
    if len(df) < 2:
        return df.assign(nearest_m=None, nearest_name=None)
    xy = [to_m(lon, lat) for lon, lat in tqdm(zip(df.lon, df.lat), total=len(df),
                                              desc="Nearest-mosque distances")]
    dist, idx = cKDTree(xy).query(xy, k=2)
    df["nearest_m"] = dist[:, 1].round(0)
    df["nearest_name"] = df["name_ar"].fillna(df["name"]).iloc[idx[:, 1]].values
    return df


def name_words(df):
    words = Counter()
    for n in df["name_ar"].fillna(df["name"]).dropna():
        for w in re.findall(r"\w+", AR_DIACRITICS.sub("", n.lower())):
            if w not in NAME_STOPWORDS and not w.isdigit():
                words[w] += 1
    return pd.DataFrame(words.most_common(300), columns=["word", "count"])


WIKIDATA_Q = """
SELECT ?item ?itemLabel ?ar ?fr ?inception ?image ?capacity WHERE {
  ?item wdt:P31/wdt:P279* wd:Q32815; wdt:P17 wd:Q948.
  OPTIONAL { ?item wdt:P571 ?inception. }
  OPTIONAL { ?item wdt:P18 ?image. }
  OPTIONAL { ?item wdt:P1083 ?capacity. }
  OPTIONAL { ?item rdfs:label ?ar FILTER(lang(?ar)="ar") }
  OPTIONAL { ?item rdfs:label ?fr FILTER(lang(?fr)="fr") }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
"""


def fetch_wikidata():
    tqdm.write("Querying Wikidata…")
    r = requests.get(WIKIDATA, params={"query": WIKIDATA_Q, "format": "json"},
                     headers=UA, timeout=120)
    r.raise_for_status()
    out = []
    for b in r.json()["results"]["bindings"]:
        g = lambda k: b.get(k, {}).get("value")
        out.append({"wikidata": g("item").rsplit("/", 1)[-1], "wd_label": g("itemLabel"),
                    "inception": (g("inception") or "")[:10] or None,
                    "image": g("image"), "capacity": g("capacity")})
    wd = pd.DataFrame(out)
    return wd.sort_values("inception").drop_duplicates("wikidata") if len(wd) else wd


# ============================================================================
# Main
# ============================================================================
def run_source(name, fn):
    try:
        df = fn()
        tqdm.write(f"  {name}: {len(df)} records")
        return df
    except Exception as e:
        tqdm.write(f"  {name} skipped: {e.__class__.__name__}: {str(e)[:300]}")
        return pd.DataFrame()


def main():
    frames = []
    osm_df, govs = pd.DataFrame(), []

    if USE_OSM:
        print("\n[1] OpenStreetMap")
        osm_df = parse_osm(fetch_overpass(OSM_MOSQUES_Q, "OSM mosques"))
        print(f"  osm: {len(osm_df)} records  ({osm_df.match_type.value_counts().to_dict()})")
        frames.append(osm_df)
    if USE_OVERTURE or USE_FOURSQUARE:
        try:
            govs = parse_governorates(fetch_overpass(OSM_GOVERNORATES_Q, "Governorate borders"))
            print(f"  {len(govs)} governorate polygons")
        except SystemExit as e:
            print(f"  governorate borders unavailable ({e}); using nearest OSM mosque")
    if USE_OVERTURE:
        print("\n[2] Overture Maps")
        ov = assign_governorate(run_source("overture", fetch_overture), govs, osm_df)
        frames.append(ov)
    if USE_FOURSQUARE:
        print("\n[3] Foursquare OS Places")
        fsq = assign_governorate(run_source("foursquare", fetch_foursquare), govs, osm_df)
        frames.append(fsq)

    frames = [f for f in frames if len(f)]
    for f in frames:
        f.to_csv(f"tn_raw_{f.source.iloc[0]}.csv", index=False, encoding="utf-8-sig")
    combined = pd.concat(frames, ignore_index=True)
    for c in ["footprint_m2", "axis_deg", "rectangularity", "outline_wkt", "confidence"]:
        if c not in combined:
            combined[c] = None
    print(f"\n[4] Merging duplicates across {len(combined)} raw records")
    df, groups = merge_duplicates(combined)
    groups.to_csv("tn_merge_groups.csv", index=False, encoding="utf-8-sig")

    print("\n[5] Analysis")
    df = add_orientation(df)
    df = add_nearest(df)
    try:
        df = df.merge(fetch_wikidata(), on="wikidata", how="left")
    except Exception as e:
        print("  Wikidata step skipped:", e)
    name_words(df).to_csv("tn_mosque_name_words.csv", index=False, encoding="utf-8-sig")

    df = df.drop(columns=["group"], errors="ignore")
    df.insert(0, "mosque_id", range(1, len(df) + 1))
    df.to_csv("tn_mosques.csv", index=False, encoding="utf-8-sig")

    feats = [{"type": "Feature",
              "geometry": {"type": "Point", "coordinates": [r.lon, r.lat]},
              "properties": {k: (None if (not isinstance(v, (list, dict)) and pd.isna(v)) else v)
                             for k, v in r._asdict().items()
                             if k not in ("lat", "lon", "outline_wkt")}}
             for r in tqdm(df.itertuples(index=False), total=len(df), desc="Writing GeoJSON")]
    with open("tn_mosques.geojson", "w", encoding="utf-8") as f:
        json.dump({"type": "FeatureCollection", "features": feats}, f,
                  ensure_ascii=False, default=str)

    big = (df.dropna(subset=["footprint_m2"]).sort_values("footprint_m2", ascending=False)
             .groupby("governorate").head(1))
    big[["governorate", "name", "name_ar", "footprint_m2", "url"]].to_csv(
        "tn_biggest_by_gov.csv", index=False, encoding="utf-8-sig")

    print("\nSaved to:", os.getcwd())
    print("\nSummary")
    print(f"  raw records: {len(combined)}  →  mosques after merging: {len(df)}")
    print("  found by source combination:")
    print(df.sources.value_counts().to_string())
    print("  how they matched (best record):", df.match_type.value_counts().to_dict())
    print("  with footprint:", df.footprint_m2.notna().sum())
    print("  median distance to nearest mosque:", int(df.nearest_m.median()), "m")
    ok = df[df.orientation_reliable == True]
    print(f"  reliable orientation: {len(ok)}, median |qibla deviation|:",
          ok.deviation_deg.abs().median(), "°")
    print("\n  mosques per governorate:")
    print(df.groupby("governorate").size().sort_values(ascending=False).to_string())


if __name__ == "__main__":
    main()