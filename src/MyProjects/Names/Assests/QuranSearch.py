import json, re
from pathlib import Path
from typing import Dict, Any, List, Tuple, Set

import arabic_reshaper
from bidi.algorithm import get_display

# ====== CONFIG ======
QURAN_FILE = r"/Users/ahmedbendaly/Documents/Winter 2023/Learning/Svelte/svelte-projects/my-svelte-project/src/MyProjects/Names/Assests"
QUERY = "الرحمن"              # keep this as-is if you enable UNIFY_ALEF_WASLA below
UNIFY_ALEF_WASLA = True       # <-- set True to treat ٱ as ا during MATCHING ONLY

# ====== matching helpers (only remove tashkeel + tatweel; optional ٱ→ا for matching) ======
DIACRITICS_RE = re.compile(r'[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]')  # harakat + Quranic marks + dagger alif
TATWEEL_RE    = re.compile(r'\u0640')  # ـ

def normalize_for_match(s: str) -> str:
    if not s:
        return s
    s = TATWEEL_RE.sub('', s)
    s = DIACRITICS_RE.sub('', s)
    if UNIFY_ALEF_WASLA:
        s = s.replace('\u0671', '\u0627')  # ٱ -> ا  (matching only)
    return s

# tokens as they appear (letters + diacritics + tatweel kept intact)
AR_TOKEN_RE = re.compile(r'[\u0620-\u063A\u0641-\u064A\u0671\u064B-\u065F\u0670\u06D6-\u06ED\u0640]+')
def tokenize_raw(s: str) -> List[str]:
    return AR_TOKEN_RE.findall(s)

# file shape: {"1":[{chapter,verse,text},...], ...}
def iter_verses(quran_data: Dict[str, Any]):
    for k in sorted(quran_data.keys(), key=lambda x: int(x) if x.isdigit() else x):
        verses = quran_data[k]
        if isinstance(verses, list):
            for v in verses:
                yield int(v.get('chapter', k)), int(v['verse']), v.get('text', '')

def count_and_collect(quran_path: str, query: str) -> Tuple[int, List[Tuple[int,int,str]]]:
    data = json.loads(Path(quran_path).read_text(encoding='utf-8'))
    q_norm = normalize_for_match(query)
    total = 0
    ayahs: List[Tuple[int,int,str]] = []
    seen: Set[Tuple[int,int]] = set()

    for sura, ayah, text in iter_verses(data):
        hits_here = 0
        for t in tokenize_raw(text):
            if normalize_for_match(t) == q_norm:
                hits_here += 1
        if hits_here:
            total += hits_here
            key = (sura, ayah)
            if key not in seen:
                seen.add(key)
                ayahs.append((sura, ayah, text))
    return total, ayahs

if __name__ == "__main__":
    total, ayahs = count_and_collect(QURAN_FILE, QUERY)

    # 1) total occurrences
    print(total)

    # 2) each ayah (sura:ayah + full diacritized text, shaped for display)
    for sura, ayah, text in ayahs:
        shaped = get_display(arabic_reshaper.reshape(text))
        print(f"{sura}:{ayah}  {shaped}")
