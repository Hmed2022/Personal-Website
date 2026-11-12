<script>
  // Floating switch: see the notes as illustrations or as photos of the real notes (whole piece).
  import { t } from '../i18n.js';
  import { realNotes } from '../Data Viz/Timeline/noteImage.js';
</script>

<div class="vs" role="radiogroup" aria-label={$t('viewLbl')}>
  <button type="button" role="radio" aria-checked={!$realNotes} class:on={!$realNotes} on:click={() => realNotes.set(false)}>✎ {$t('viewIllus')}</button>
  <button type="button" role="radio" aria-checked={$realNotes} class:on={$realNotes} on:click={() => realNotes.set(true)}>◫ {$t('viewReal')}</button>
</div>

<style>
  .vs {
    position: fixed; right: 1rem; bottom: 3.9rem; z-index: 900; display: inline-flex; gap: .2rem; padding: .25rem;
    border-radius: 999px; background: rgba(255, 251, 244, .95); box-shadow: 0 4px 16px rgba(61, 42, 34, .22); border: 1px solid #E6DCCF;
  }
  button { font: 700 .82rem Quicksand, 'Tajawal', sans-serif; color: #4D6473; background: none; border: none; border-radius: 999px; padding: .38rem .8rem; cursor: pointer; }
  button.on { background: #8C4D3F; color: #FFFFFF; }
  button:focus-visible { outline: 3px solid #1E5B8C; outline-offset: 2px; }
  @media (max-width: 640px) { .vs { right: .6rem; bottom: 3.3rem; } button { padding: .32rem .65rem; font-size: .76rem; } }
</style>
