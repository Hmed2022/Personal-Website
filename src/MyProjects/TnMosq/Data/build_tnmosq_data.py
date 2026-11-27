"""Build the small JSON files the TunMosq page reads, from the scraper's output.

    python3 build_tnmosq_data.py

Reads  tn_mosques.csv (from tnMosq.py) and the governorate outlines of the TunInfo map.
Writes
  tnCount.json   governorate outlines + every mosque as [lon, lat, governorate]       (section 01)
  tnNames.json   most common name, name words grouped into themes, mix by governorate (section 03)
  tnQibla.json   spread of qibla deviations + a few mosques with their outlines      (section 04)
  tnAtlas.json   every mosque with a simplified outline, for the searchable atlas      (atlas)
"""
import csv
import json
import math
import os
import re
from collections import Counter, defaultdict

from pyproj import Transformer
from shapely import wkt as shp_wkt
from shapely.ops import transform

HERE = os.path.dirname(os.path.abspath(__file__))
OUTLINES = os.path.join(HERE, '..', '..', 'TunInfo', 'Data Viz', 'Map', 'Data', 'Tunisia.geojson.json')

DISPLAY = {
    'Tunis': 'Tunis', 'Ben Arous': 'Ben Arous', 'Ariana': 'Ariana', 'Nabeul': 'Nabeul', 'Manouba': 'Manouba',
    'Bizerte': 'Bizerte', 'Zaghouan': 'Zaghouan', 'Jendouba': 'Jendouba', 'Beja': 'Béja', 'Tataouine': 'Tataouine',
    'Medenine': 'Médenine', 'Gabes': 'Gabès', 'Kebili': 'Kébili', 'Tozeur': 'Tozeur', 'Gafsa': 'Gafsa',
    'Sousse': 'Sousse', 'Monastir': 'Monastir', 'Mahdia': 'Mahdia', 'Sfax': 'Sfax', 'Kairouan': 'Kairouan',
    'Kasserine': 'Kasserine', 'Sidi Bouzid': 'Sidi Bouzid', 'El Kef': 'Le Kef', 'Siliana': 'Siliana',
}


def strip_accents(s):
    return (s.lower().replace('é', 'e').replace('è', 'e').replace('ê', 'e').replace('â', 'a')
            .replace('à', 'a').replace('ï', 'i').replace('î', 'i').replace('ô', 'o').replace('û', 'u'))


def outline_key(name):
    """Match OSM governorate names (any spelling) to the outline file's names."""
    k = strip_accents(name or '')
    k = re.sub(r'\b(governorate|gouvernorat|de|of|wilayat|ولاية)\b', ' ', k)
    k = re.sub(r'[^a-z ]', ' ', k).strip()
    k = re.sub(r'\s+', ' ', k)
    aliases = {'al kaf': 'el kef', 'le kef': 'el kef', 'kef': 'el kef', 'beja': 'beja', 'manubah': 'manouba',
               'la manouba': 'manouba', 'bin arus': 'ben arous', 'ben arous': 'ben arous', 'aryanah': 'ariana',
               'l ariana': 'ariana', 'qabis': 'gabes', 'qafsah': 'gafsa', 'tawzar': 'tozeur', 'qibili': 'kebili',
               'madanin': 'medenine', 'tatawin': 'tataouine', 'safaqis': 'sfax', 'susah': 'sousse',
               'al munastir': 'monastir', 'al mahdiyah': 'mahdia', 'al qayrawan': 'kairouan', 'al qasrayn': 'kasserine',
               'sidi bu zayd': 'sidi bouzid', 'silyanah': 'siliana', 'jundubah': 'jendouba', 'banzart': 'bizerte',
               'nabul': 'nabeul', 'zaghwan': 'zaghouan', 'tunis': 'tunis'}
    return aliases.get(k, k)


# ---------------------------------------------------------------------------- names
AR_DIAC = re.compile(r'[ً-ٰـ]')
AR_PREFIX = re.compile(r'^(ال)?(جامع|مسجد)\s+')
LAT_STOP = {'mosquee', 'mosque', 'masjid', 'masjed', 'jamaa', 'jemaa', 'djamaa', 'djemaa', 'jamaâ', 'jama',
            'grande', 'de', 'du', 'la', 'le', 'des', 'el', 'al', 'of', 'the', 'mosquée'}

# themes for the words in mosque names; Arabic words and their usual French/Latin spellings
THEMES = {
    'virtues': {
        'label': 'Virtues & faith',
        'ar': ['الرحمة', 'الرحمان', 'الرحمن', 'النور', 'الهداية', 'الهدى', 'التقوى', 'الغفران', 'المغفرة', 'السلام',
               'التوبة', 'الإيمان', 'الايمان', 'الفتح', 'البركة', 'الإحسان', 'الاحسان', 'الصبر', 'الأمان', 'الامان',
               'الفلاح', 'الإخلاص', 'الاخلاص', 'اليقين', 'الفرقان', 'التوحيد', 'الصفاء', 'الرضوان', 'الفردوس',
               'الجنة', 'الخير', 'الحق', 'الإسلام', 'الاسلام', 'النصر', 'الرشاد', 'الوفاء', 'الأخوة', 'الاخوة',
               'الوحدة', 'البر', 'الطاعة', 'الذكر', 'الرحمه', 'الهدايه', 'الأمل', 'الامل', 'العرفان', 'الصلاح',
               'الرضا', 'السعادة', 'المحبة', 'الصدق', 'الإستقامة', 'الاستقامة', 'العزة', 'الكرامة', 'القدس'],
        'lat': ['rahma', 'errahma', 'rahman', 'nour', 'ennour', 'hidaya', 'hedaya', 'houda', 'takwa', 'ettakwa',
                'taqwa', 'ghofrane', 'ghofran', 'salem', 'salam', 'essalem', 'tawba', 'ettawba', 'iman', 'imen',
                'fath', 'baraka', 'ihsan', 'sabr', 'amen', 'amane', 'falah', 'ikhlas', 'tawhid', 'safa', 'ridha',
                'redouane', 'firdaws', 'jannah', 'khir', 'nasr', 'wafa', 'quds'],
    },
    'saints': {
        'label': 'Saints & shrines',
        'ar': ['سيدي', 'الولي', 'مقام', 'زاوية', 'الزاوية', 'لالة', 'للا', 'المرابط'],
        'lat': ['sidi', 'zaouia', 'zawiya', 'lalla', 'marabout', 'mausolee', 'mausolée'],
    },
    'people': {
        'label': 'Companions, prophets & scholars',
        'ar': ['عمر', 'علي', 'عثمان', 'بكر', 'بلال', 'خالد', 'حمزة', 'عقبة', 'أنس', 'انس', 'مالك', 'سحنون',
               'الإمام', 'الامام', 'الصحابة', 'معاذ', 'سعد', 'الزبير', 'طلحة', 'عمار', 'صلاح', 'إبراهيم', 'ابراهيم',
               'موسى', 'عيسى', 'يوسف', 'نوح', 'إسماعيل', 'اسماعيل', 'الفاروق', 'الصديق', 'ذر', 'الفرات', 'عائشة',
               'خديجة', 'فاطمة', 'الحسن', 'الحسين', 'جعفر', 'سلمان', 'هريرة', 'الخطاب', 'عفان', 'طالب', 'محمد',
               'المصطفى', 'الرسول', 'النبي', 'عرفة', 'زيد', 'الأرقم', 'مصعب', 'سفيان', 'الشافعي', 'حنيفة', 'البخاري'],
        'lat': ['omar', 'ali', 'othman', 'bakr', 'bilal', 'khaled', 'hamza', 'okba', 'oqba', 'anas', 'malek',
                'malik', 'sahnoun', 'imam', 'sahaba', 'saad', 'ibrahim', 'moussa', 'youssef', 'farouk', 'aicha',
                'khadija', 'fatma', 'hassan', 'hussein', 'mohamed', 'mustapha', 'abou', 'abi', 'ibn', 'ben'],
    },
    'places': {
        'label': 'Places & descriptions',
        'ar': ['الكبير', 'الجديد', 'العتيق', 'الأعظم', 'حي', 'أولاد', 'اولاد', 'القصر', 'البلد', 'المدينة', 'السوق',
               'الغربي', 'الشرقي', 'القبلي', 'الجوفي', 'الحي', 'مركز', 'دوار', 'المحطة', 'القرية', 'العين', 'الواد',
               'الوادي', 'الجبل', 'البحر', 'الربض', 'الحومة', 'الصغير', 'الأوسط', 'الاوسط', 'الفوقاني', 'التحتاني',
               'بني', 'بئر', 'برج', 'هنشير', 'منزل', 'قصر', 'الشمالي', 'الجنوبي'],
        'lat': ['kebir', 'kbir', 'grande', 'jedid', 'jdid', 'atik', 'cite', 'cité', 'ouled', 'ksar', 'souk', 'medina',
                'centre', 'douar', 'gare', 'ain', 'oued', 'jebel', 'bni', 'beni', 'bir', 'borj', 'menzel', 'henchir',
                'nouvelle', 'ancienne', 'centrale', 'quartier'],
    },
}
THEME_ORDER = ['virtues', 'saints', 'people', 'places']

# common full names: Tunisian-style spelling and meaning, for the street-sign reveal
TRANSLIT = {
    'الرحمة': ('Errahma', 'Mercy'), 'النور': ('Ennour', 'The Light'), 'الكبير': ('El Kebir', 'The Great Mosque'),
    'التقوى': ('Ettakwa', 'Piety'), 'الهداية': ('El Hidaya', 'Guidance'), 'الغفران': ('El Ghofrane', 'Forgiveness'),
    'السلام': ('Essalem', 'Peace'), 'التوبة': ('Ettawba', 'Repentance'), 'الفتح': ('El Fath', 'The Opening'),
    'الإيمان': ('El Imen', 'Faith'), 'الايمان': ('El Imen', 'Faith'), 'الهدى': ('El Houda', 'Right Guidance'),
    'الرحمان': ('Errahmen', 'The Merciful'), 'الرحمن': ('Errahmen', 'The Merciful'), 'البركة': ('El Baraka', 'Blessing'),
    'الجديد': ('El Jedid', 'The New Mosque'), 'الإحسان': ('El Ihsen', 'Excellence'), 'الفرقان': ('El Forkane', 'The Criterion'),
    'التوحيد': ('Ettawhid', 'Oneness of God'), 'الفردوس': ('El Firdaws', 'Paradise'), 'السوق': ('Essouk', 'The Market'),
    'المركزي': ('El Markazi', 'The Central Mosque'), 'الريان': ('Errayen', 'The Gate of Heaven'),
    'الصحابة': ('Essahaba', 'The Companions'), 'العتيق': ('El Atik', 'The Old Mosque'), 'الأعظم': ('El Aadham', 'The Great Mosque'),
    'فاطمة الزهراء': ('Fatma Ezzahra', None), 'عمر بن الخطاب': ('Omar Ibn El Khattab', None), 'أبو بكر الصديق': ('Abou Bakr Essedik', None), 'الصبر': ('Essabr', 'Patience'), 'الفلاح': ('El Falah', 'Success'),
    'الأمان': ('El Amen', 'Safety'), 'الإخلاص': ('El Ikhlas', 'Sincerity'),
}


def norm_ar(n):
    n = AR_DIAC.sub('', n).strip()
    n = AR_PREFIX.sub('', n)
    return re.sub(r'\s+', ' ', n).strip()


def words_of(name):
    """Arabic words if the name is Arabic, else lower-case Latin words, without mosque/jamaa words."""
    if re.search(r'[؀-ۿ]', name):
        return [w for w in re.findall(r'[؀-ۿ]+', norm_ar(name)) if w not in ('جامع', 'مسجد', 'الجامع', 'المسجد')]
    return [w for w in re.findall(r"[a-zà-ÿ]+", name.lower()) if w not in LAT_STOP and len(w) > 1]


def theme_of(name):
    ws = words_of(name)
    ar = bool(re.search(r'[؀-ۿ]', name))
    for t in THEME_ORDER:
        lst = THEMES[t]['ar' if ar else 'lat']
        for w in ws:
            if w in lst or (not ar and any(w == x or w == 'el' + x or w == 'e' + x for x in lst)):
                return t, w
    return None, None


# ---------------------------------------------------------------------------- geometry
to_m = Transformer.from_crs('EPSG:4326', 'EPSG:32632', always_xy=True).transform


def local_outline(wkt_text, max_pts=24):
    """Outline in metres around its centre (x east, y north), simplified."""
    try:
        g = shp_wkt.loads(wkt_text)
    except Exception:
        return None
    if g.is_empty:
        return None
    if g.geom_type == 'MultiPolygon':
        g = max(g.geoms, key=lambda p: p.area)
    if g.geom_type != 'Polygon':
        return None
    gm = transform(to_m, g)
    c = gm.centroid
    tol = 0.3
    s = gm.simplify(tol)
    while len(s.exterior.coords) > max_pts and tol < 20:
        tol *= 1.6
        s = gm.simplify(tol)
    return [[round(x - c.x, 1), round(y - c.y, 1)] for x, y in list(s.exterior.coords)[:-1]]


def f(v):
    try:
        x = float(v)
        return x if math.isfinite(x) else None
    except (TypeError, ValueError):
        return None


def main():
    geo = json.load(open(OUTLINES, encoding='utf-8'))
    govs, index = [], {}
    for feat in geo['features']:
        name = feat['properties']['gouv_fr']
        g = feat['geometry']
        polys = [g['coordinates']] if g['type'] == 'Polygon' else g['coordinates']
        index[outline_key(name)] = len(govs)
        govs.append({'name': DISPLAY.get(name, name),
                     'polys': [[[[round(x, 4), round(y, 4)] for x, y in r] for r in p] for p in polys],
                     'count': 0})

    rows = list(csv.DictReader(open(os.path.join(HERE, 'tn_mosques.csv'), encoding='utf-8-sig')))
    unmatched = Counter()
    for r in rows:
        r['_g'] = index.get(outline_key(r['governorate']))
        if r['_g'] is None:
            unmatched[r['governorate']] += 1
    if unmatched:
        print('governorate names not matched:', dict(unmatched))

    # ---- count (section 01)
    pts = []
    for r in rows:
        lat, lon = f(r['lat']), f(r['lon'])
        if r['_g'] is None or lat is None or lon is None:
            continue
        govs[r['_g']]['count'] += 1
        pts.append([round(lon, 4), round(lat, 4), r['_g']])
    near = sorted(f(r['nearest_m']) for r in rows if f(r['nearest_m']) is not None)
    summary = {
        'mosques': len(pts),
        'govsCovered': sum(1 for g in govs if g['count']),
        'govsTotal': len(govs),
        'named': sum(1 for r in rows if (r['name_ar'] or r['name'] or '').strip()),
        'medianNearest': round(near[len(near) // 2]) if near else None,
    }
    json.dump({'govs': govs, 'pts': pts, 'summary': summary}, open(os.path.join(HERE, 'tnCount.json'), 'w', encoding='utf-8'),
              ensure_ascii=False, separators=(',', ':'))
    print(f'tnCount.json: {len(pts)} mosques, {sum(1 for g in govs if g["count"])} governorates with data')

    # ---- names (section 03)
    named = [(r, (r['name_ar'] or r['name'] or '').strip()) for r in rows]
    named = [(r, n) for r, n in named if n and not re.fullmatch(r'(?i)\s*(mosqu[ée]e?|mosque|جامع|مسجد|masjid)\s*', n)]
    full = Counter()
    full_by_gov = defaultdict(Counter)
    latin_of = defaultdict(Counter)  # Arabic name -> Latin spellings seen on the same mosques
    prefix = re.compile(r"(?i)^\s*(grande\s+)?(mosqu[ée]e?|mosque|masjid|jam[aâ]a|djem[aâ]a|jem[aâ]a)\s+(de\s+|d'|du\s+)?")
    for r, n in named:
        if re.search(r'[؀-ۿ]', n):
            k = norm_ar(n)
            if k and k not in ('جامع', 'مسجد'):
                full[k] += 1
                if r['_g'] is not None:
                    full_by_gov[r['_g']][k] += 1
                for alt in (r['name_fr'], r['name_en'], r['name']):
                    if alt and not re.search(r'[؀-ۿ]', alt):
                        alt = prefix.sub('', alt).strip()
                        if alt and alt.lower() not in LAT_STOP and not re.fullmatch(r'(?i)(grande\s+)?(mosqu[ée]e?|mosque|masjid)s?', alt):
                            latin_of[k][alt.title()] += 1
    top_full = full.most_common(12)

    def name_entry(k, c):
        lat = TRANSLIT[k][0] if k in TRANSLIT else (latin_of[k].most_common(1)[0][0] if latin_of[k] else None)
        return {'ar': k, 'count': c, 'lat': lat, 'en': TRANSLIT.get(k, (None, None))[1]}
    themes = {t: Counter() for t in THEME_ORDER}
    per_gov = defaultdict(lambda: Counter())
    tiles = []  # one per named mosque: theme index (or -1)
    for r, n in named:
        t, w = theme_of(n)
        if t:
            themes[t][w] += 1
        if r['_g'] is not None:
            per_gov[r['_g']][t or 'other'] += 1
        tiles.append(THEME_ORDER.index(t) if t else -1)
    first = top_full[0] if top_full else ('', 0)
    names = {
        'total': len(rows),
        'named': len(named),
        'top': [name_entry(k, c) for k, c in top_full],
        'first': name_entry(*first),
        'themes': [{'id': t, 'label': THEMES[t]['label'], 'count': sum(themes[t].values()),
                    'words': [{'w': w, 'n': c} for w, c in themes[t].most_common(8)]} for t in THEME_ORDER],
        'other': sum(1 for x in tiles if x < 0),
        'tiles': sorted(tiles, key=lambda x: (x < 0, x)),
        'byGov': [{'g': g, 'name': govs[g]['name'], 'n': sum(c.values()),
                   'mix': [c[t] for t in THEME_ORDER] + [c['other']],
                   'top': [name_entry(k, n) for k, n in full_by_gov[g].most_common(3)]}
                  for g, c in sorted(per_gov.items(), key=lambda kv: -sum(kv[1].values()))],
    }
    json.dump(names, open(os.path.join(HERE, 'tnNames.json'), 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    print(f'tnNames.json: {len(named)} named, most common: {first}')

    # ---- qibla (section 04)
    rel = [r for r in rows if r['orientation_reliable'] == 'True' and f(r['deviation_deg']) is not None]
    devs = [f(r['deviation_deg']) for r in rel]
    bins = [0] * 18  # 5° bins from -45 to +45
    for d in devs:
        bins[min(17, max(0, int((d + 45) // 5)))] += 1
    absd = sorted(abs(d) for d in devs)

    def card(r, why):
        return {'why': why, 'name': r['name_ar'] or r['name'] or 'Unnamed mosque', 'name_lat': r['name'] or '',
                'gov': govs[r['_g']]['name'] if r['_g'] is not None else r['governorate'],
                'lat': round(f(r['lat']), 5), 'lon': round(f(r['lon']), 5),
                'dev': f(r['deviation_deg']), 'target': f(r['target_bearing']), 'axis': f(r['axis_deg']),
                'area': f(r['footprint_m2']), 'outline': local_outline(r['outline_wkt'], 40), 'url': r['url']}

    big = [r for r in rel if (f(r['footprint_m2']) or 0) >= 300 and (f(r['rectangularity']) or 0) >= 0.9]
    picks = []
    if big:
        best = min(big, key=lambda r: (abs(f(r['deviation_deg'])), -f(r['footprint_m2'])))
        picks.append(card(best, 'The most precise'))
        worst = max(big, key=lambda r: (abs(f(r['deviation_deg'])), f(r['footprint_m2'])))
        picks.append(card(worst, 'The most off'))

    def find(pattern, why, art=None):
        rx = re.compile(pattern, re.I)
        hits = [r for r in rows if r['outline_wkt'] and rx.search(' '.join([r['name'] or '', r['name_ar'] or '', r['name_fr'] or '', r['name_en'] or '']))]
        if hits:
            c = card(max(hits, key=lambda r: f(r['footprint_m2']) or 0), why)
            c['art'] = art
            picks.append(c)

    find(r'عقبة|okba|oqba|uqba|grande mosqu[ée]e de kairouan|great mosque of kairouan', 'Kairouan, 670', 'kairouan')
    find(r'الزيتونة|zitouna|zaytuna|zitoun', 'Al-Zaytuna, Tunis, c. 698', 'zitouna')
    find(r'مالك بن أنس|مالك بن انس|malik ibn anas|malek ibn anas', 'Malik ibn Anas, Carthage, 2003', 'carthage')
    qibla = {
        'n': len(devs), 'bins': bins,
        'within5': sum(1 for d in absd if d <= 5), 'within10': sum(1 for d in absd if d <= 10),
        'median': absd[len(absd) // 2] if absd else None,
        'cards': picks,
    }
    json.dump(qibla, open(os.path.join(HERE, 'tnQibla.json'), 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    print(f'tnQibla.json: {len(devs)} reliable orientations, median |dev| {qibla["median"]}, cards: {[c["why"] for c in picks]}')

    # ---- atlas
    atlas = []
    for r in rows:
        lat, lon = f(r['lat']), f(r['lon'])
        if lat is None or lon is None:
            continue
        atlas.append([
            round(lon, 5), round(lat, 5),
            r['name'] or '', r['name_ar'] or '',
            r['_g'] if r['_g'] is not None else -1,
            round(f(r['footprint_m2'])) if f(r['footprint_m2']) else None,
            f(r['deviation_deg']) if r['orientation_reliable'] == 'True' else None,
            f(r['target_bearing']),
            round(f(r['nearest_m'])) if f(r['nearest_m']) is not None else None,
            r['nearest_name'] or '',
            r['sources'] or r['source'] or '',
            r['url'] or '',
            local_outline(r['outline_wkt']) if r['outline_wkt'] else None,
            (r['start_date'] or r['inception'] or '')[:10],
        ])
    # featured before the atlas map: famous mosques (when they are in the data) and the largest buildings
    FAMOUS = [
        (r'الزيتونة|zitouna|zaytuna|zitoun', 'Al-Zaytuna, Tunis', 'Tunis', 'zitouna'),
        (r'عقبة|okba|oqba|uqba|grande mosqu[ée]e de kairouan', 'Great Mosque of Kairouan', 'Kairouan', 'kairouan'),
        (r'مالك بن أنس|مالك بن انس|malik ibn anas|malek ibn anas', 'Malik ibn Anas, Carthage', 'Tunis', 'carthage'),
        (r'سيدي محرز|sidi mahrez', 'Sidi Mahrez, Tunis', 'Tunis', 'sidimahrez'),
        (r'حمودة باشا|hammouda pacha', 'Hammouda Pacha, Tunis', 'Tunis', 'hammouda'),
        (r'الجامع الكبير|grande mosqu[ée]e|great mosque', 'Great Mosque of Sousse', 'Sousse', 'sousse'),
        (r'الأبواب الثلاثة|الابواب الثلاثة|trois portes|three doors', 'Mosque of the Three Doors', 'Kairouan', 'threedoors'),
        (r'فضلون|fadhloun|fadloun', 'Fadhloun, Djerba', 'Médenine', 'djerba'),
        (r'الجامع الكبير|grande mosqu[ée]e|testour', 'Great Mosque of Testour', 'Béja', 'testour'),
    ]
    featured, used = [], set()
    text = [' '.join([a[2], a[3]]) for a in atlas]
    gov_names = [g['name'] for g in govs]
    not_mosque = re.compile(r'(?i)maison|culture|centre|center|[ée]cole|school|librair|biblioth', re.I)
    for pat, label, gov, art in FAMOUS:
        rx = re.compile(pat, re.I)
        gi = gov_names.index(gov) if gov in gov_names else -2
        hits = [k for k, t in enumerate(text) if rx.search(t) and atlas[k][12] and atlas[k][4] == gi]
        if gov == 'Béja':  # Testour is a town in Béja: keep only mosques near it
            hits = [k for k in hits if abs(atlas[k][1] - 36.55) < 0.05 and abs(atlas[k][0] - 9.44) < 0.06]
        if hits:
            k = max(hits, key=lambda k: atlas[k][5] or 0)
            if k not in used:
                featured.append({'i': k, 'why': label, 'kind': 'famous', 'art': art})
                used.add(k)
    by_area = sorted((k for k, a in enumerate(atlas) if a[5] and a[12] and not not_mosque.search(text[k])), key=lambda k: -atlas[k][5])
    for k in by_area:
        if len([x for x in featured if x['kind'] == 'big']) >= 6:
            break
        if k not in used:
            featured.append({'i': k, 'why': f"{atlas[k][5]:,} m²", 'kind': 'big'})
            used.add(k)
    json.dump({'fields': ['lon', 'lat', 'name', 'name_ar', 'gov', 'area', 'dev', 'target', 'nearest_m',
                          'nearest_name', 'sources', 'url', 'outline', 'date'],
               'govs': [g['name'] for g in govs], 'rows': atlas, 'featured': featured},
              open(os.path.join(HERE, 'tnAtlas.json'), 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    print(f'tnAtlas.json: {len(atlas)} mosques')


if __name__ == '__main__':
    main()
