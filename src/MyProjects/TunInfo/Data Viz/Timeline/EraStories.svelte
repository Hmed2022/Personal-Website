<script>
  // The three eras (Bourguiba, Ben Ali, after the revolution): your notes about each, Dali's answers,
  // how many notes of each value, and the portrait figures. Opened by the first question in your notebook.
  import { t, isAr } from '../../i18n.js';
  import data from './Data/data.js';
  import { realNotes, realPhoto } from './noteImage.js';
  import daliImg from '../../Components/dali.svg';
  import eraYoung from './Assets/era-young.webp';
  import eraOld from './Assets/era-old.webp';
  import eraTawhida from './Assets/era-tawhida.webp';
  import tawhidaReal from '../../Components/portraits/tawhida-r.webp';
  const VALUES = [0.5, 1, 5, 10, 20, 30, 50];
  const COLORS = { 0.5: '#0388A6', 1: '#025E73', 5: '#005C53', 10: '#BF5630', 20: '#8C4D3F', 30: '#AB7E56', 50: '#C9A46F' };
  const label = (v) => (v === 0.5 ? '½' : String(v));
  const ERAS = [{ ink: '#025E73' }, { ink: '#7C4A8C' }, { ink: '#BF5630' }];
  const bourguibaNotes = data.filter((n) => /Bourguiba/.test(n.ObserveInEnglish)).sort((a, b) => a.Issued - b.Issued || a.Value - b.Value);
  const realYoung = bourguibaNotes.filter((n) => n.Issued <= 1962).map((n) => realPhoto(n, 'front'));
  const realOld = bourguibaNotes.filter((n) => n.Issued > 1962).map((n) => realPhoto(n, 'front'));
  // The era stories and counts from the original timeline (same text, same numbers).
  // counts follow VALUES: ½, 1, 5, 10, 20, 30, 50
  const STORIES = [
    {
      title: 'st0Title', years: '1956 – 1987', total: 23, counts: [4, 5, 7, 5, 2, 0, 0],
      text: 'st0Text',
      ask: 'insTimelineNote',   // your notebook slip; the story is Dali's answer
      figures: [
        { img: eraYoung, alt: 'Young Bourguiba portraits', caption: 'st0Fig1', stack: 'young' },
        { img: eraOld, alt: 'Old Bourguiba portraits', caption: 'st0Fig2', stack: 'old' },
      ],
    },
    {
      title: 'st1Title', years: '1987 – 2011', total: 7, counts: [0, 0, 1, 3, 1, 1, 1],
      text: 'st1Text',
      ask: 'st1Ask',
      note: 'st1Note',
      figures: [],
    },
    {
      title: 'st2Title', years: '2011 – today', total: 8, counts: [0, 0, 2, 2, 2, 0, 2],
      text: 'st2Text',
      ask: 'st2Ask',
      note: 'st2Note',
      figures: [
        { img: eraTawhida, alt: 'Tawhida Ben Cheikh', wide: true, caption: 'st2Fig', realImg: tawhidaReal },
      ],
    },
  ];
  const MAX_COUNT = 7;
</script>

  <div class="stories">
    {#each STORIES as st, i}
      <article class="story" style="--ec:{ERAS[i].ink}">
        <div class="story-text">
          <p class="story-years">{st.years.replace('today', $t('today'))}</p>
          <h3>{$t(st.title)}</h3>
          {#if st.ask}
            <div class="jot" class:ar={$isAr} id={"q-" + st.ask}>
              <span class="tape" aria-hidden="true"></span>
              <p class="jot-k">{$t('insNoteLabel')}</p>
              <p class="jot-t">{$t(st.ask)}</p>
            </div>
          {/if}
          <p class="story-who"><img src={daliImg} alt="" draggable="false" />{$t('insLabel')}</p>
          <p>{@html $t(st.text)}</p>
        </div>
        <aside class="story-facts">
          <p class="total"><span>{st.total}</span> {$t('tlIssued')}</p>
          <ul class="counts">
            {#each VALUES as v, k}
              <li class:zero={st.counts[k] === 0}>
                <span class="swatch" style="background:{COLORS[v]}"></span>
                <span class="den">{label(v)} {$t('dt')}</span>
                <span class="meter"><i style="width:{(st.counts[k] / MAX_COUNT) * 100}%; background:{COLORS[v]}"></i></span>
                <b>{st.counts[k]}</b>
              </li>
            {/each}
          </ul>
          {#if st.note}<p class="note">{@html $t(st.note)}</p>{/if}
          {#if st.figures.length}
            <div class="figures">
              {#each st.figures as f}
                <figure class:wide={f.wide}>
                  {#if $realNotes && f.stack}
                    {@const list = f.stack === 'young' ? realYoung : realOld}
                    <!-- the real notes, fanned out like a small pile -->
                    <span class="pile" class:big={list.length > 6} role="img" aria-label={f.alt}>
                      {#each list as src, i}<img {src} alt="" loading="lazy" style="--i:{i}; --n:{list.length}" />{/each}
                    </span>
                  {:else}
                    <img src={$realNotes && f.realImg ? f.realImg : f.img} alt={f.alt} loading="lazy" />
                  {/if}
                  <figcaption>{@html $t(f.caption)}</figcaption>
                </figure>
              {/each}
            </div>
          {/if}
        </aside>
      </article>
    {/each}
  </div>

<style>
  .stories { display: grid; gap: 1.6rem; max-width: 62rem; margin: 1.5rem auto; padding: 0 1rem; box-sizing: border-box; font-family: Quicksand, sans-serif; color: #4A2E25; text-align: start; }
  .story {
    display: grid; grid-template-columns: 1.55fr 1fr; gap: 1.4rem;
    padding: 1.1rem 1.3rem; border-radius: 8px;
    background: rgba(255, 251, 241, .78); border: 1px solid rgba(140, 77, 63, .3); border-inline-start: 5px solid var(--ec);
    box-shadow: 0 2px 8px rgba(74, 46, 37, .1);
  }
  .story-years { margin: 0; font-size: .72rem; font-weight: 800; letter-spacing: .2em; text-transform: uppercase; color: var(--ec); }
  .story h3 { margin: .1rem 0 .5rem; font-family: 'Playfair Display', Georgia, serif; font-size: 1.45rem; font-weight: 800; color: #3D2A22; }
  .story-text p:last-child { margin: 0; font-size: .95rem; line-height: 1.6; }
  /* your notebook slip inside a story (same look as the slips above Dali's replies) */
  .story .jot {
    position: relative; width: fit-content; max-width: 100%; margin: .9rem 0 .8rem; box-sizing: border-box;
    padding: .9rem 1.1rem .6rem; transform: rotate(-1deg); text-align: start;
    background: repeating-linear-gradient(transparent 0 1.75rem, rgba(30, 91, 140, .16) 1.75rem calc(1.75rem + 1px)), #FFFDF6;
    background-position: 0 .5rem; box-shadow: 0 1px 2px rgba(74, 46, 37, .12), 0 6px 14px -6px rgba(74, 46, 37, .3);
  }
  .story .jot::before { content: ''; position: absolute; top: 0; bottom: 0; inset-inline-start: 1.3rem; border-inline-start: 1px solid rgba(181, 82, 59, .35); }
  .story .tape { position: absolute; top: -.55rem; left: 50%; width: 4.5rem; height: 1.1rem; transform: translateX(-50%) rotate(2deg); background: rgba(233, 214, 170, .75); }
  .story .jot-k { margin: 0; padding-inline-start: .9rem; font: 700 .64rem Quicksand, sans-serif; letter-spacing: .14em; text-transform: uppercase; color: #B5523B; }
  .story .jot p.jot-t { margin: 0; padding-inline-start: .9rem; font-family: Caveat, 'Segoe Print', cursive; font-weight: 500; font-size: 1.7rem; line-height: 1.75rem; color: #1E3F5C; }
  .story .jot.ar { transform: rotate(1deg); }
  .story .jot.ar p.jot-t { font-family: 'Aref Ruqaa', Tajawal, serif; font-size: 1.4rem; }
  .story-who { display: flex; align-items: center; gap: .4rem; margin: .2rem 0 .3rem; font-size: .9rem; font-weight: 800; color: var(--ec); }
  .story-who img { width: 2.4rem; height: 2.5rem; object-fit: contain; object-position: 50% 0; }
  .story :global(b) { font-weight: 700; color: #3D2A22; }
  .story :global(mark.purple) { background: #C6AFC0; color: #FDF6F5; padding: 0 .25em; border-radius: 3px; }
  .story :global(a) { color: var(--ec); }
  .story-facts { border-inline-start: 1px dashed rgba(140, 77, 63, .35); padding-inline-start: 1.2rem; }
  .total { margin: 0 0 .5rem; font-weight: 700; font-size: .9rem; }
  .total span { font-family: 'Playfair Display', Georgia, serif; font-size: 2rem; font-weight: 800; color: var(--ec); margin-inline-end: .2rem; vertical-align: -.15em; }
  .counts { list-style: none; margin: 0; padding: 0; display: grid; gap: .25rem; }
  .counts li { display: grid; grid-template-columns: .65rem 3rem 1fr 1.2rem; align-items: center; gap: .45rem; font-size: .82rem; }
  .counts .den { font-weight: 700; }
  .meter { height: .55rem; border-radius: 999px; background: rgba(74, 46, 37, .1); overflow: hidden; }
  .meter i { display: block; height: 100%; border-radius: inherit; transition: width .5s; }
  .counts b { text-align: right; }
  .counts li.zero { opacity: .45; }
  .counts li.zero b { color: #B5523B; }
  .note { margin: .7rem 0 0; font-size: .85rem; line-height: 1.5; }
  .figures { display: flex; gap: .8rem; margin-top: .8rem; }
  .figures figure { flex: 1; margin: 0; text-align: center; }
  .figures img { width: 100%; max-width: 9rem; height: auto; }
  .figures figcaption { font-size: .78rem; line-height: 1.4; }
  .pile { position: relative; display: block; width: 100%; max-width: 12rem; height: 7.6rem; margin: 0 auto .3rem; }
  .pile img { position: absolute; left: 50%; top: 50%; width: 6.6rem; max-width: none; height: auto; border-radius: 3px; box-shadow: 0 1px 4px rgba(61, 42, 34, .3);
    transform: translate(-50%, -50%) translate(calc((var(--i) - (var(--n) - 1) / 2) * 1.1rem), calc(((var(--i) * 7) - (var(--i) * 7 / 13) * 13 - 3) * .1rem)) rotate(calc((var(--i) - (var(--n) - 1) / 2) * 3deg)); }
  .pile.big img { width: 5.8rem; transform: translate(-50%, -50%) translate(calc((var(--i) - (var(--n) - 1) / 2) * .4rem), 0) rotate(calc((var(--i) - (var(--n) - 1) / 2) * 3.5deg)); }
  .figures figure.wide { display: flex; gap: .7rem; align-items: flex-start; text-align: start; }
  .figures figure.wide img { width: 5.5rem; flex: 0 0 auto; }
  .swatch { width: .65rem; height: .65rem; border-radius: 2px; flex: 0 0 auto; }
  @media (max-width: 640px) {
    .story { grid-template-columns: 1fr; gap: .9rem; padding: 1rem; }
    .story-facts { border-inline-start: none; border-top: 1px dashed rgba(140, 77, 63, .35); padding: .8rem 0 0; }
  }
</style>
