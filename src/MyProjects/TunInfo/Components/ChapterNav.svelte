<script>
  // Reading guide: a row of chapter links under the intro, a thin reading-progress bar at the top
  // of the screen, and a floating "chapters" button that shows where you are and lets you jump.
  // (Links scroll with JS: the site uses #/ routes, so #anchors can't be used.)
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { t, dir, lang } from '../i18n.js';

  const CHAPTERS = [
    { id: 'ch-timeline', key: 'chTimeline' },
    { id: 'ch-eras', key: 'chEras' },
    { id: 'ch-vivid', key: 'chVivid' },
    { id: 'ch-faces', key: 'chFaces' },
    { id: 'ch-landmarks', key: 'chLandmarks' },
    { id: 'ch-worth', key: 'chWorth' },
    { id: 'ch-end', key: 'chEnd' },
    { id: 'ch-sources', key: 'chSources' },
  ];
  export let inline = true;    // the row of links (placed under the intro)

  let progress = 0, current = -1, menu = false, started = false;
  function update() {
    const doc = document.documentElement;
    progress = Math.min(1, Math.max(0, scrollY / (doc.scrollHeight - innerHeight)));
    let c = -1;
    CHAPTERS.forEach((ch, i) => { const el = document.getElementById(ch.id); if (el && el.getBoundingClientRect().top < innerHeight * 0.35) c = i; });
    current = c;
    const first = document.getElementById(CHAPTERS[0].id);
    started = !!first && first.getBoundingClientRect().top < innerHeight * 0.6;
  }
  function go(id) {
    menu = false;
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 70, behavior: 'smooth' });
  }
  onMount(() => { update(); });
</script>

<svelte:window on:scroll|passive={update} on:resize={update} />

{#if inline}
  <nav class="row" aria-label={$t('chapters')}>
    {#each CHAPTERS as ch, i}
      <button type="button" on:click={() => go(ch.id)}><span class="n">{i + 1}</span>{$t(ch.key)}</button>
    {/each}
  </nav>
{:else}
  <div class="progress" style="transform: scaleX({progress})" aria-hidden="true"></div>
  {#if started}
    <div class="float" dir={$dir} lang={$lang} transition:fly={{ y: 16, duration: 200 }}>
      {#if menu}
        <ul class="menu" transition:fade={{ duration: 120 }}>
          {#each CHAPTERS as ch, i}
            <li><button type="button" class:on={i === current} on:click={() => go(ch.id)}><span class="n">{i + 1}</span>{$t(ch.key)}</button></li>
          {/each}
        </ul>
      {/if}
      <button type="button" class="pill" aria-expanded={menu} aria-label={$t('chJump')} on:click={() => (menu = !menu)}>
        <span class="ico" aria-hidden="true">☰</span>
        <span>{current >= 0 ? $t(CHAPTERS[current].key) : $t('chapters')}</span>
        <span class="pct">{$t('chRead', { p: Math.round(progress * 100) })}</span>
      </button>
    </div>
  {/if}
{/if}

<style>
  .row { display: flex; flex-wrap: wrap; justify-content: center; gap: .4rem; max-width: 56rem; margin: 1.2rem auto 0; padding: 0 1rem; }
  .row button, .menu button {
    display: inline-flex; align-items: center; gap: .4rem; font: 700 .85rem Quicksand, 'Tajawal', sans-serif; color: #1E3F5C; cursor: pointer;
    background: rgba(255, 255, 255, .75); border: 1.5px solid #E1D6C8; border-radius: 999px; padding: .3rem .8rem .3rem .35rem;
  }
  .row button:hover { border-color: #1E5B8C; }
  .n { width: 1.35rem; height: 1.35rem; border-radius: 50%; display: grid; place-items: center; background: #1E5B8C; color: #FFFFFF; font-size: .72rem; }

  .progress { position: fixed; top: 0; left: 0; right: 0; height: 4px; z-index: 950; background: linear-gradient(90deg, #1E5B8C, #B5523B); transform-origin: 0 50%; pointer-events: none; }
  :global([dir='rtl']) .progress { transform-origin: 100% 50%; }

  .float { position: fixed; right: 1rem; bottom: 6.9rem; z-index: 900; display: flex; flex-direction: column; align-items: flex-end; gap: .4rem; }
  .pill { display: inline-flex; align-items: center; gap: .5rem; font: 700 .85rem Quicksand, 'Tajawal', sans-serif; color: #FFFFFF; background: #1E3F5C; border: none; border-radius: 999px; padding: .5rem .9rem; cursor: pointer; box-shadow: 0 4px 16px rgba(30, 63, 92, .3); }
  .pct { font-weight: 600; opacity: .75; font-size: .75rem; }
  .menu { list-style: none; margin: 0; padding: .4rem; display: grid; gap: .25rem; background: #FFFBF4; border: 1px solid #E6DCCF; border-radius: 14px; box-shadow: 0 10px 28px rgba(61, 42, 34, .2); }
  .menu button { width: 100%; background: none; border-color: transparent; }
  .menu button.on { background: #EEF4F6; border-color: #C8D9DC; }
  @media (max-width: 640px) { .float { right: .6rem; bottom: 6rem; } .pct { display: none; } }
</style>
