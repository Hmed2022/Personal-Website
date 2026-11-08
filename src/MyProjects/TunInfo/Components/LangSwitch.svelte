<script>
  // Floating English / العربية switch for the whole piece.
  import { lang } from '../i18n.js';
</script>

<div class="ls" role="radiogroup" aria-label="Language / اللغة" dir="ltr">
  <button type="button" role="radio" aria-checked={$lang === 'en'} class:on={$lang === 'en'} on:click={() => lang.set('en')} lang="en">English</button>
  <button type="button" role="radio" aria-checked={$lang === 'ar'} class:on={$lang === 'ar'} on:click={() => lang.set('ar')} lang="ar">العربية</button>
</div>

<style>
  .ls {
    position: fixed; right: 1rem; bottom: 1rem; z-index: 900; display: inline-flex; gap: .2rem; padding: .25rem;
    border-radius: 999px; background: rgba(255, 251, 244, .95); box-shadow: 0 4px 16px rgba(61, 42, 34, .22); border: 1px solid #E6DCCF;
  }
  button { font: 700 .88rem Quicksand, 'Tajawal', sans-serif; color: #4D6473; background: none; border: none; border-radius: 999px; padding: .4rem .9rem; cursor: pointer; }
  button[lang='ar'] { font-family: 'Tajawal', sans-serif; font-size: .95rem; }
  button.on { background: #1E5B8C; color: #FFFFFF; }
  @media (max-width: 640px) { .ls { right: .6rem; bottom: .6rem; } button { padding: .35rem .75rem; } }
</style>
