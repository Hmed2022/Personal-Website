<script>
  // End of an opened part of the story: on to another question, or back to the notebook.
  import { createEventDispatcher } from 'svelte';
  import { t } from '../i18n.js';
  export let hasNext = true;
  const dispatch = createEventDispatcher();
</script>

<div class="te">
  <button type="button" class="back" on:click={() => dispatch('back')}>↑ {$t('nbBack')}</button>
  {#if hasNext}<button type="button" class="next" on:click={() => dispatch('next')}>{$t('nbNext')} →</button>{/if}
</div>

<style>
  .te { display: flex; justify-content: center; gap: .8rem; flex-wrap: wrap; margin: 2.5rem auto 1rem; }
  button { font: 800 .95rem Quicksand, sans-serif; border-radius: 999px; padding: .6rem 1.3rem; cursor: pointer; transition: transform .15s, background .15s; }
  button:hover { transform: translateY(-1px); }
  button:focus-visible { outline: 3px solid #1E5B8C; outline-offset: 2px; }
  .back { background: #FFFBF1; color: #8C4D3F; border: 1.5px solid #C9A98F; }
  .next { background: #8C4D3F; color: #FFFBF1; border: 0; box-shadow: 0 3px 10px rgba(74, 46, 37, .25); }
</style>
