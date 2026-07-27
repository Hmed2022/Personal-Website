<script>
  import { onMount, onDestroy } from 'svelte';

  import mutamaredImg from './Assets/Mutamared.svg';
  import klayHeadImg from './Assets/klayHead.svg';
  import klayHaloImg from './Assets/klayhalo.svg';
  import Profanity from './profanity.svelte';
  import Religious from './religious.svelte';

  const CAROUSEL_TRAVEL_PX = 48;

  /** @param {HTMLElement} node @param {{duration?: number}} opts */
  function slideIn(node, { duration = 1000 }) {
    return {
      duration,
      css: (/** @type {number} */ t) => `transform: translateY(${(1 - t) * CAROUSEL_TRAVEL_PX}px);`,
    };
  }

  /** @param {HTMLElement} node @param {{duration?: number}} opts */
  function slideOut(node, { duration = 1000 }) {
    return {
      duration,
      css: (/** @type {number} */ t) => `transform: translateY(${-(1 - t) * CAROUSEL_TRAVEL_PX}px);`,
    };
  }

  const names = [
    { text: 'Klay BBJ', dir: 'ltr', lang: 'en' },
    { text: 'أحمد بن أحمد', dir: 'rtl', lang: 'ar' },
    { text: 'أبو الغضب', dir: 'rtl', lang: 'ar' },
    { text: 'Boumaye', dir: 'ltr', lang: 'en' },
    { text: 'ولد باب الجديد', dir: 'rtl', lang: 'ar' },
    { text: 'RBJ', dir: 'ltr', lang: 'en' },
    { text: 'المتمرّد', dir: 'rtl', lang: 'ar' },
    { text: 'شاعر شوارع', dir: 'rtl', lang: 'ar' },
  ];

  let current = 0;
  /** @type {ReturnType<typeof setInterval>} */
  let timer;

  onMount(() => {
    timer = setInterval(() => {
      current = (current + 1) % names.length;
    }, 2000);
  });

  onDestroy(() => clearInterval(timer));
</script>

<div class="klay-page">
  <div class="hero">
    <img class="klay-halo" src={klayHaloImg} alt="" />
    <img class="mutamared" src={mutamaredImg} alt="متمرد" />
    <img class="klay-head" src={klayHeadImg} alt="Klay" />
  </div>

  <div class="body">
    <div class="carousel">
      {#key current}
        <span
          class="carousel-name"
          class:ar={names[current].lang === 'ar'}
          class:en={names[current].lang === 'en'}
          dir={names[current].dir}
          in:slideIn={{ duration: 500 }}
          out:slideOut={{ duration: 500 }}
        >
          {names[current].text}
        </span>
      {/key}
    </div>

    <h2 class="subtitle">مِرآةُ المُجتَمَعِ التّونسِي</h2>

    <p class="paragraph" dir="rtl">
      التونسي كائن متناقض، ما يعرفش شنية هويتو: لا عربي، لا افريقي، لا أمازيغي. مسلم، وفي نفس الوقت
      أول مستهلك للبيرة في المنطقة. يحكي 4 لغات، اما مايعرف يعبر كان بالكلام الزايد. يكره المستعمر،
      اما يقدّر اللي يحكي بلغة الاستعمار أكثر من لغتو. يحب القرآن، أما يستهزئ بيّ اللي يحكي بالعربية الفصحى.
    </p>

    <p class="paragraph" dir="rtl">
      الراب كيما اي نوع متع فن هو مرآة للمجتمع، مجتمع داخل بعضو ما يعطي كان فن غريب وقريب فرد وقت.
      كلاي ببجي ماهو الا عينية من شعراء الشوارع التونسيين.
    </p>

    <Profanity />
    <Religious />
  </div>
</div>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Zain:ital,wght@0,200;0,300;0,400;0,700;0,800;0,900;1,400&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Lalezar&display=swap');

  @font-face {
    font-family: 'RetroBrushArabic';
    src: url('./Assets/RetroBrushArabicPersonalUseOnly-Regular.otf') format('opentype');
  }

  :global(html),
  :global(body) {
    margin: 0;
    padding: 0;
  }

  .klay-page {
    background: #0d0d0d;
    color: #fff;
    overflow: hidden;
    min-height: 100vh;
    width: 100%;
  }

  .hero {
    position: relative;
    background: #eda23e;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 140px;
    padding: 1rem;
  }

  .mutamared {
    width: 100%;
    max-width: 320px;
  }

  .klay-head {
    position: absolute;
    bottom: -26px;
    right: 5%;
    width: clamp(90px, 12vw, 150px);
    filter: drop-shadow(0 6px 10px rgba(0, 0, 0, 0.35));
  }

  .klay-halo {
    position: absolute;
    bottom: -26px;
    left: 5%;
    width: clamp(70px, 9vw, 110px);
    filter: drop-shadow(0 6px 10px rgba(0, 0, 0, 0.35));
  }

  .body {
    text-align: center;
    padding: 0 1.5rem 2rem;
  }

  .carousel {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 170px;
    height: 48px;
    margin: -24px auto 1rem;
    background: #a5342a;
    border-radius: 4px;
    overflow: hidden;
    position: relative;
  }

  .carousel-name {
    position: absolute;
    color: #fff;
    font-weight: 700;
    font-size: 1.3rem;
    white-space: nowrap;
    padding: 0 0.75rem;
  }

  .carousel-name.en {
    font-family: 'Marker Felt', 'Comic Sans MS', cursive;
  }

  .carousel-name.ar {
    font-family: 'Lalezar', cursive;
  }

  .subtitle {
    font-family: 'RetroBrushArabic', sans-serif;
    font-size: clamp(1.3rem, 3vw, 2rem);
    margin: 0 0 0.75rem;
  }

  .paragraph {
    font-family: 'Zain', sans-serif;
    font-size: 0.9rem;
    line-height: 1.5;
    color: #ddd;
    max-width: 640px;
    margin: 0 auto 0.75rem;
    text-align: justify;
  }

  .paragraph:last-child {
    margin-bottom: 0;
  }
</style>
