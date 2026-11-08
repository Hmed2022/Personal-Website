<script>
  // "Reading the notes": what a collector can read in the notes, at the end of each chapter.
  import { t } from '../i18n.js';
  export let k;               // strings key of the text
  export let label = 'insLabel';
  export let tone = 'gold';   // gold (insight) or blue (how to read)
</script>

<aside class="ins {tone}">
  <span class="ico" aria-hidden="true">
    <!-- magnifying glass over a note -->
    <svg viewBox="0 0 32 32"><rect x="3" y="8" width="20" height="12" rx="2" /><circle cx="20" cy="18" r="6.5" /><path d="M24.6 22.6 29 27" /></svg>
  </span>
  <div>
    <p class="lbl">{$t(label)}</p>
    <p class="txt">{@html $t(k)}</p>
  </div>
</aside>

<style>
  .ins { --c: #A4731C; --bg: rgba(217, 164, 65, .12); display: flex; gap: .9rem; align-items: flex-start; max-width: 50rem; margin: 1.4rem auto 2.6rem; padding: 1rem 1.2rem; border-radius: 14px; background: var(--bg); border-inline-start: 4px solid var(--c); font-family: Quicksand, sans-serif; color: #3D2A22; box-sizing: border-box; text-align: start; }
  .ins.blue { --c: #1E5B8C; --bg: rgba(30, 91, 140, .08); }
  .ico { flex: 0 0 auto; width: 2.4rem; height: 2.4rem; border-radius: 50%; display: grid; place-items: center; background: var(--c); }
  .ico svg { width: 1.45rem; height: 1.45rem; fill: none; stroke: #FFFFFF; stroke-width: 2; stroke-linecap: round; }
  .lbl { margin: 0 0 .2rem; font-size: .72rem; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; color: var(--c); }
  .txt { margin: 0; font-size: .98rem; line-height: 1.6; }
  .txt :global(b) { color: var(--c); }
  @media (max-width: 640px) { .ins { margin-inline: 1rem; } }
</style>
