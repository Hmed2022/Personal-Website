<script>
  // Floating "Back to the binder" button (replaces the chapter menu). Shows once you've scrolled past the binder.
  import { t } from '../i18n.js';
  import { binderRequest } from '../Data Viz/Timeline/strayStore.js';
  let show = false;
  function check() {
    const el = document.querySelector('.timeline');
    show = !!el && el.getBoundingClientRect().top < -window.innerHeight * 0.6;
  }
  function go() {
    binderRequest.update((n) => n + 1);   // the timeline goes back to the binder
    document.querySelector('.timeline')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
</script>

<svelte:window on:scroll|passive={check} on:resize={check} />

{#if show}
  <button type="button" class="bb" on:click={go}>↩ {$t('nbBackBinder')}</button>
{/if}

<style>
  .bb {
    position: fixed; right: 1rem; bottom: 6.9rem; z-index: 900; padding: .5rem 1rem; border: 0; border-radius: 999px; cursor: pointer;
    background: #1E3F5C; color: #FFFFFF; font: 800 .88rem Quicksand, 'Tajawal', sans-serif; box-shadow: 0 4px 16px rgba(30, 63, 92, .3);
  }
  .bb:hover { background: #1E5B8C; }
  .bb:focus-visible { outline: 3px solid #E3A72A; outline-offset: 2px; }
  @media (max-width: 640px) { .bb { right: .6rem; bottom: 6rem; font-size: .8rem; } }
</style>
