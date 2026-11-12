<script>
  // "Reading the notes": what a collector can read in the notes, at the end of each chapter.
  import { t, isAr } from '../i18n.js';
  // Dali = Leghreeb (About page) in a dingri (blue work jacket) and red chechia, pre-rendered once (static: no hover, the chechia stays put)
  import daliImg from './dali.svg';
  export let k;               // strings key of the text
  export let label = 'insLabel';
  export let tone = 'gold';   // gold (insight) or blue (how to read)
  export let lens = [];       // what the box tells you about: 'pol' | 'eco' | 'cul' | 'geo'
  export let note = null;     // strings key of the collector's own jotted note, which the box answers
  export let vars = null;     // values for {placeholders} in the text
  export let noicon = false;  // Meet Dali: the full figure stands beside the box
  const LENS = {
    pol: { k: 'lensPol', c: '#1E5B8C', d: 'M3 21h18M5 21V10m4 11V10m6 11V10m4 11V10M2 10l10-6 10 6z' },
    eco: { k: 'lensEco', c: '#2F7D4F', d: 'M4 19 9 13l4 3 7-9M15 7h5v5' },
    cul: { k: 'lensCul', c: '#9A4A7C', d: 'M4 5h7a2 2 0 0 1 2 2v13a2 2 0 0 0-2-2H4zM20 5h-7a2 2 0 0 0-2 2v13a2 2 0 0 1 2-2h7z' },
    geo: { k: 'lensGeo', c: '#B5523B', d: 'M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21zM12 12.2a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2z' },
  };
</script>

<svelte:head>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Aref+Ruqaa:wght@400;700&display=swap" />
</svelte:head>

<!-- the collector's note: what "you" noticed, in your own handwriting -->
{#if note}
  <div class="jot" class:ar={$isAr} id={"q-" + note}>
    <span class="tape" aria-hidden="true"></span>
    <p class="jot-k">{$t('insNoteLabel')}</p>
    <p class="jot-t">{$t(note)}</p>
  </div>
{/if}

<!-- the answer: checks the note and explains what was really happening -->
<aside class="ins {tone}" class:answers={note}>
  {#if noicon}
  {:else if tone === 'gold'}
    <!-- Dali, the friend who answers your notes -->
    <span class="ico dali" aria-hidden="true"><img src={daliImg} alt="" draggable="false" /></span>
  {:else}
    <span class="ico" aria-hidden="true">
      <!-- magnifying glass over a note -->
      <svg viewBox="0 0 32 32"><rect x="3" y="8" width="20" height="12" rx="2" /><circle cx="20" cy="18" r="6.5" /><path d="M24.6 22.6 29 27" /></svg>
    </span>
  {/if}
  <div>
    <p class="lbl" class:who={tone === 'gold'}>{$t(label)}
      {#each lens as l}<span class="lens" style="--lc:{LENS[l].c}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d={LENS[l].d} /></svg>{$t(LENS[l].k)}</span>{/each}
    </p>
    <p class="txt">{@html $t(k, vars)}</p>
  </div>
</aside>

<style>
  .ins { --c: #A4731C; --bg: rgba(217, 164, 65, .12); display: flex; gap: .9rem; align-items: flex-start; max-width: 50rem; margin: 1.4rem auto 2.6rem; padding: 1rem 1.2rem; border-radius: 14px; background: var(--bg); border-inline-start: 4px solid var(--c); font-family: Quicksand, sans-serif; color: #3D2A22; box-sizing: border-box; text-align: start; }
  .ins.blue { --c: #1E5B8C; --bg: rgba(30, 91, 140, .08); }
  .ico { flex: 0 0 auto; width: 2.4rem; height: 2.4rem; border-radius: 50%; display: grid; place-items: center; background: var(--c); }
  /* just Dali's drawing, no frame */
  .ico.dali { width: 4.2rem; height: 4.4rem; margin-top: -.3rem; border-radius: 0; background: none; box-shadow: none; overflow: visible; }
  .ico.dali img { display: block; width: 100%; height: 100%; object-fit: contain; object-position: 50% 0; filter: drop-shadow(0 2px 3px rgba(74, 46, 37, .18)); }
  .lbl.who { text-transform: none; letter-spacing: .02em; font-size: .92rem; }
  .ico svg { width: 1.45rem; height: 1.45rem; fill: none; stroke: #FFFFFF; stroke-width: 2; stroke-linecap: round; }
  .lbl { margin: 0 0 .2rem; font-size: .72rem; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; color: var(--c); }
  .lens { display: inline-flex; align-items: center; gap: .25rem; margin-inline-start: .45rem; padding: .08rem .5rem .08rem .4rem; border-radius: 999px; background: color-mix(in srgb, var(--lc) 12%, transparent); color: var(--lc); font-size: .66rem; letter-spacing: .08em; vertical-align: .05rem; }
  .lens svg { width: .8rem; height: .8rem; fill: none; stroke: currentColor; stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; }
  .txt { margin: 0; font-size: .98rem; line-height: 1.6; }
  .txt :global(b) { color: var(--c); }
  .ins.answers { margin-top: .2rem; }

  /* a slip torn from the collector's notebook, taped above the answer */
  .jot {
    position: relative; width: fit-content; max-width: min(34rem, 88%); margin: 2.2rem auto 0; box-sizing: border-box;
    padding: 1.1rem 1.3rem .8rem; transform: rotate(-1.3deg); text-align: start;
    background:
      repeating-linear-gradient(transparent 0 1.55rem, rgba(30, 91, 140, .16) 1.55rem calc(1.55rem + 1px)),
      #FFFDF6;
    background-position: 0 .55rem;
    box-shadow: 0 1px 2px rgba(74, 46, 37, .12), 0 8px 18px -8px rgba(74, 46, 37, .3);
  }
  .jot::before { content: ''; position: absolute; top: 0; bottom: 0; inset-inline-start: 1.6rem; border-inline-start: 1px solid rgba(181, 82, 59, .35); }   /* margin line */
  .tape { position: absolute; top: -.6rem; left: 50%; width: 5.5rem; height: 1.3rem; transform: translateX(-50%) rotate(2deg); background: rgba(233, 214, 170, .75); box-shadow: 0 1px 2px rgba(74, 46, 37, .15); }
  .jot-k { margin: 0 0 .1rem; padding-inline-start: 1.1rem; font: 700 .68rem Quicksand, sans-serif; letter-spacing: .14em; text-transform: uppercase; color: #B5523B; }
  .jot-t { margin: 0; padding-inline-start: 1.1rem; font-family: Caveat, 'Segoe Print', cursive; font-weight: 500; font-size: 1.5rem; line-height: 1.55rem; color: #1E3F5C; }
  .jot.ar .jot-t { font-family: 'Aref Ruqaa', Tajawal, serif; font-size: 1.25rem; line-height: 1.55rem; }
  .jot.ar { transform: rotate(1.3deg); }
  @media (max-width: 640px) { .ins { margin-inline: 1rem; } .jot-t { font-size: 1.35rem; } }
</style>
