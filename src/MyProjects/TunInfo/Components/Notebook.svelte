<script>
  // Your notebook of questions for Dali, after the timeline. Pick any question, in any order:
  // Dali answers and that part of the story opens below. Read questions get ticked.
  import { createEventDispatcher } from 'svelte';
  import { slide } from 'svelte/transition';
  import { t, isAr } from '../i18n.js';
  export let items = [];   // [{ id, q }] q = strings key of the question
  export let read = {};    // { id: true } for the ones already opened
  export let open = null;  // the one showing now
  const dispatch = createEventDispatcher();
  function jump(key) {
    const el = document.getElementById('q-' + key);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
</script>

<div class="nb" class:ar={$isAr}>
  <span class="tape" aria-hidden="true"></span>
  <!-- margin doodles, in the same pen: two stars and a cube -->
  <svg class="doodles" viewBox="0 0 150 110" aria-hidden="true">
    <g fill="none" stroke="#1E3F5C" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M38 8 L44 25 L62 26 L48 37 L53 55 L38 44 L23 55 L28 37 L14 26 L32 25 Z" />
      <path d="M40 15 L44 27 M37 47 l-1 -6" stroke-width="1.2" opacity=".55" />
      <path d="M78 62 l3 8 l9 1 l-7 5 l3 9 l-8 -5 l-8 5 l3 -9 l-7 -5 l9 -1 Z" stroke-width="1.8" />
      <path d="M102 22 L126 16 L142 28 L118 35 Z M102 22 L102 50 L118 63 L118 35 M142 28 L142 56 L118 63" />
      <path d="M104 26 L104 48 M110 30 L110 54" stroke-width="1" opacity=".45" />
      <path d="M8 74 q4 -3 8 0 t8 0" stroke-width="1.6" opacity=".7" />
    </g>
  </svg>
  <p class="nb-k">{$t('insNoteLabel')}</p>
  <h2 class="nb-title">{$t('nbTitle')}</h2>
  <p class="nb-hint">{$t('nbHint')}</p>
  <ol>
    {#each items as it}
      <li>
        <button type="button" class:read={read[it.id]} class:on={open === it.id} aria-pressed={open === it.id} on:click={() => dispatch('pick', it.id)}>
          <span class="box" aria-hidden="true">{read[it.id] ? '✓' : ''}</span>
          <span class="q">{$t(it.q)}</span>
        </button>
        <!-- once a question is open, the follow-up questions you wrote under it show up; click one to jump to it -->
        {#if open === it.id && it.subs && it.subs.length}
          <ul class="subs" transition:slide={{ duration: 250 }}>
            {#each it.subs as sq}
              <li><button type="button" class="sub" on:click={() => jump(sq)}><span class="arrow" aria-hidden="true">↳</span><span class="q">{$t(sq)}</span></button></li>
            {/each}
          </ul>
        {/if}
      </li>
    {/each}
  </ol>
</div>

<style>
  .nb {
    position: relative; max-width: 44rem; margin: 3rem auto 1.5rem; padding: 1.8rem 1.6rem 1.2rem 3.4rem; box-sizing: border-box;
    transform: rotate(-.5deg); text-align: start;
    background: repeating-linear-gradient(transparent 0 1.9rem, rgba(30, 91, 140, .22) 1.9rem calc(1.9rem + 1px)), #FFFDF6;
    background-position: 0 1.1rem;
    box-shadow: 0 1px 2px rgba(74, 46, 37, .12), 0 12px 28px -10px rgba(74, 46, 37, .35);
  }
  .nb::before { content: ''; position: absolute; top: 0; bottom: 0; inset-inline-start: 2.4rem; border-inline-start: 1.5px solid rgba(181, 82, 59, .4); }
  .doodles { position: absolute; top: .7rem; inset-inline-end: 1rem; width: 8.5rem; height: auto; transform: rotate(4deg); opacity: .85; pointer-events: none; }
  .ar .doodles { transform: rotate(-4deg) scaleX(-1); }
  @media (max-width: 640px) { .doodles { width: 5.5rem; top: .4rem; } }
  .tape { position: absolute; top: -.75rem; left: 50%; width: 7rem; height: 1.6rem; transform: translateX(-50%) rotate(2deg); background: rgba(233, 214, 170, .8); box-shadow: 0 1px 2px rgba(74, 46, 37, .15); }
  .nb-k { margin: 0; font: 700 .7rem Quicksand, sans-serif; letter-spacing: .14em; text-transform: uppercase; color: #B5523B; }
  .nb-title { margin: .1rem 0 0; font: 700 2rem/1.9rem Caveat, 'Segoe Print', cursive; color: #1E3F5C; }
  .nb-hint { margin: 0 0 .5rem; font: 500 1.15rem/1.9rem Caveat, 'Segoe Print', cursive; color: #8C6A5C; }
  ol { list-style: none; margin: 0; padding: 0; }
  button {
    display: flex; align-items: flex-start; gap: .7rem; width: 100%; padding: .15rem .3rem; margin: 0; border: 0; background: none; cursor: pointer; text-align: start;
    font: 500 1.4rem/1.9rem Caveat, 'Segoe Print', cursive; color: #1E3F5C; border-radius: 6px; transition: background .15s;
  }
  button:hover { background: rgba(227, 167, 42, .14); }
  button:focus-visible { outline: 3px solid #1E5B8C; outline-offset: 1px; }
  .box { flex: 0 0 auto; width: 1.15rem; height: 1.15rem; margin-top: .4rem; border: 2px solid #1E3F5C; border-radius: 3px; display: grid; place-items: center; font: 800 1.1rem/1 Quicksand, sans-serif; color: #C62F2F; }
  .read .q { color: #6B7F8E; }
  .subs { list-style: none; margin: 0 0 .2rem; padding: 0; padding-inline-start: 2rem; }
  button.sub { font-size: 1.2rem; color: #3D5A73; }
  .sub .arrow { flex: 0 0 auto; color: #C62F2F; font: 700 1.1rem/1.9rem Quicksand, sans-serif; }
  .on .q { color: #C62F2F; background: linear-gradient(transparent 60%, rgba(227, 167, 42, .4) 60%, rgba(227, 167, 42, .4) 92%, transparent 92%); }
  .ar .nb-title, .ar .nb-hint, .ar button { font-family: 'Aref Ruqaa', Tajawal, serif; }
  .ar .nb-title { font-size: 1.6rem; }
  .ar button { font-size: 1.15rem; }
  .nb.ar { transform: rotate(.5deg); }
  @media (max-width: 640px) { .nb { margin-inline: .6rem; padding: 1.5rem 1rem 1rem 2.6rem; } .nb::before { inset-inline-start: 1.8rem; } button { font-size: 1.25rem; } }
</style>
