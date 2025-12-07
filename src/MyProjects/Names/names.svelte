<script>
import { onMount } from 'svelte';

import AllNames from './Components/allnames.svelte'
import Title from './Components/title.svelte'
import Player from './Components/player.svelte';
import { style } from 'svelte-body';
import {language } from './Stores/misc.js';


      function setLanguage(lang) {
        language.set(lang);
    }

      let showPlayer = false;
    let allNamesElement;
    
    onMount(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    showPlayer = entry.isIntersecting;
                });
            },
            { threshold: 0.1 } // Show when 10% of AllNames is visible
        );
        
        if (allNamesElement) {
            observer.observe(allNamesElement);
        }
        
        return () => {
            if (allNamesElement) {
                observer.unobserve(allNamesElement);
            }
        };
    });

</script>



<!-- Language Buttons -->
<div class="language-buttons">
    <button 
        class:active={$language === 'English'}
        on:click={() => setLanguage('English')}
    >
        English
    </button>
    <button 
        class:active={$language === 'Arabic'}
        on:click={() => setLanguage('Arabic')}
    >
        Arabic
    </button>
</div>


<body>

    <div class="title">
    <Title/>
    </div>

    <div class="text">
        <p class="Reference">By Ahmed Bendaly | December 2025</p> <br>

        <!-- Test paragraph -->
<p class="ArabicText">
    {#if $language === 'Arabic'}
       يُقال كثيرًا إنَّ عِظَم الشيء يُعرَف بكثرة أسمائه. وفي الإسلام، الله جلّ جلاله هو الأعظم، وتنعكس أسماؤه على كماله. فكلّ اسم من أسماء الله الحُسنى يصف صفةً إلهية سامية — كالرَّحمن، القدير، العليم، السلام، القيّوم، النور. فهذه الأسماء ليست عناوين جامدة، بل هي دعوات للتعرّف إلى حقيقة الله ومعاني صفاته.

وقد علّم النبي محمد ﷺ:

«إنّ لله تسعةً وتسعين اسمًا، مائةً إلا واحدًا، مَن أحصاها دخل الجنة.»
(صحيح البخاري وصحيح مسلم)

في هذا المشروع سنقوم باستكشاف هذه الأسماء من مصادرها الأصيلة — القرآن الكريم، والسُّنّة النبوية، وتراث العلماء — ونتعرّف كيف جُمِعت، وفُسِّرت، وحُفظت عبر التاريخ الإسلامي. كما سنُنشئ تصوّرات بصرية توضّح الأنماط والتكرارات والمعاني والروابط بين هذه الأسماء.

هذا ليس بحثًا عقديًّا معمّقًا، بل هو رحلة اكتشاف موجَّهة:
✨ من أين جاءت هذه الأسماء؟
✨ كم مرّة وردت في القرآن الكريم؟
✨ ماذا تكشف لنا عن حقيقة الله وصفاته؟
✨ وكيف يمكن للبيانات والتصوّر البصري أن يعمّق فهمنا لها؟

ولكثيرٍ من المسلمين، تكون هذه الأسماء مألوفة قبل أن تُدرَس رسميًا؛ تُتعلَّم من الأسرة، ومن الثقافة، ومن الأناشيد خصوصًا. ففي تونس — على سبيل المثال — يكاد يكون الأمر عادةً رمضانية: قبل لحظات من الإفطار، يصدح نشيد أسماء الله الحُسنى في المنازل، ليصبح جزءًا من الذاكرة والروح والهوية.
    {:else}
        <p>
            It is often said that the greater something is, the more names it is known by. In Islam, God is the Greatest, and His Names reflect His perfection. Each of the Beautiful Names of Allah (Asmaa’ Allah al-Husnaa) describes a divine attribute — the All-Merciful, the All-Powerful, the All-Knowing, the Giver of Peace, the Sustainer, the Light. These Names are not merely titles; they are invitations to understand who Allah truly is.

The Prophet Muhammad ﷺ taught:

“Allah has ninety-nine names — one hundred minus one — whoever enumerates them will enter Paradise.”
(Sahih al-Bukhari & Sahih Muslim)

In this project, we will explore these Names from their authentic sources — the Qur’an, the Sunnah, and classical Islamic scholarship — and examine how they were collected, interpreted, and preserved throughout Islamic tradition. Along the way, we will also create visual insights to highlight patterns, frequencies, meanings, and connections across the Names.

This is not a theological deep dive, but rather a guided discovery:
✨ Where do the Names come from?
✨ How often do they appear in the Qur’an?
✨ What do they tell us about the nature of Allah?
✨ How can data and visualization help us appreciate them more deeply?

For many Muslims, these Names are familiar long before they are formally studied. They are learned through family, culture, and especially songs. In Tunisia, for example, it is almost a tradition: moments before breaking the fast in Ramadan, the melodious recitation of Asmaa’ Allah al-Husnaa fills the home — a sound that becomes part of memory, spirituality, and identity.
        </p>
    {/if}
</p>
       
    </div>


<div bind:this={allNamesElement}>
    <AllNames/>
</div>

{#if showPlayer}
    <div class="player-sticky-container">
        <Player/>
    </div>
{/if}

</body>

<svelte:body use:style={"background-color: #FDEEDB;"} />



<style>
      @font-face {
    font-family: 'NotoKufiArabic';
    src: url('../Assests/NotoKufiArabic-Regular.ttf') format('truetype');
    font-weight: 400;
  }

  @font-face {
    font-family: 'NotoKufiArabic';
    src: url('../Assests/NotoKufiArabic-Bold.ttf') format('truetype');
    font-weight: 700;
  }
    @font-face {
    font-family: 'JawiKufi';
    src: url('../Assests/JawiKufi-nOR1.ttf') format('truetype');
    font-weight: 400;
  }

    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');

        .Reference{
        color: #613D25;
        font-weight: 500;
        text-align: center;
        margin-top: 0;
        margin-bottom: 0;
    }

        .player-sticky-container {
        position: fixed;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 50%;
        max-width: 1000px;
        z-index: 1000;
        padding: 1rem;
        /* box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.15); */
    }

   .language-buttons {
    position: sticky;
    top: 0; /* This is essential for sticky to work */
    left:0;
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    padding: 3vw; /* Add some padding for better appearance */
    z-index: 100; /* Ensures buttons stay on top of other content */
}


    button{
    font-family: 'JawiKufi', sans-serif;
     font-size: 3vw;
    color: #603D25;

    background-color: #FDEDDB;
   border: 2px solid #FDEDDB;

    }


    .ArabicText{
    font-family: 'NotoKufiArabic', sans-serif;
    font-weight: 700;
    font-size: 1vw;
    direction: rtl;
    margin: 0;
    color: #603D25;
    }

    .text{
        font-size: 1.1vw;
        font-weight: 300;
        font-family: "Outfit", sans-serif;
        color: #613D25;
        margin-bottom: 10%;
    }
    .title{
        margin-bottom: 10%;
        text-align: center;
    }
    body {
        margin-right: 25%;
        margin-left:25%
    }

    p{
        text-align: center;
        justify-items: center;
    }
</style>