<script>
import { onMount } from 'svelte';

import AllNames from './Components/allnames.svelte'
import Title from './Components/title.svelte'
import Player from './Components/player.svelte';
import { style } from 'svelte-body';
import {language,nameId } from './Stores/misc.js';
import  names  from './Components/names.js';
import Back from './Components/background.svelte'
import quranData from './Assests/quran.json';
import surahsData from './Assests/surahs.json';


    // Reactive statement: automatically updates when $nameId changes
    $: currentName = $nameId && names[$nameId] ? names[$nameId] : null;

    // Carousel state for Quranic verses
    let currentVerseIndex = 0;

    // Get Quranic verses for current name
    $: quranVerses = currentName && currentName.reference ? currentName.reference.map(ref => {
        const surahVerses = quranData[ref.surah.toString()];
        if (surahVerses) {
            const verse = surahVerses.find(v => v.verse === ref.ayah);
            const surahInfo = surahsData.find(s => s.id === ref.surah);
            return {
                text: verse ? verse.text : '',
                surahName: surahInfo ? surahInfo.name : '',
                surahNumber: ref.surah,
                ayahNumber: ref.ayah
            };
        }
        return null;
    }).filter(v => v !== null) : [];

    // Reset carousel when name changes
    $: if (currentName) {
        currentVerseIndex = 0;
    }

    function nextVerse() {
        if (currentVerseIndex < quranVerses.length - 1) {
            currentVerseIndex++;
        }
    }

    function prevVerse() {
        if (currentVerseIndex > 0) {
            currentVerseIndex--;
        }
    }

    // Function to highlight the Arabic name in the verse text
    function highlightName(text, arabicName) {
        if (!text || !arabicName) return text;

        // Remove diacritics and normalize Arabic text
        const normalizeArabic = (str) => {
            return str
                .replace(/[\u064B-\u065F]/g, '') // Remove all diacritics (fatha, damma, kasra, sukun, shadda, etc.)
                .replace(/[\u0670]/g, '') // Remove superscript alif
                .replace(/[\u06D6-\u06ED]/g, '') // Remove Quranic annotation marks (small high marks, etc.)
                .replace(/[\u0640]/g, '') // Remove tatweel (elongation)
                .replace(/ٱ/g, 'ا') // Normalize alif wasla to regular alif
                .replace(/أ/g, 'ا') // Normalize hamza on alif
                .replace(/إ/g, 'ا') // Normalize hamza under alif
                .replace(/آ/g, 'ا') // Normalize alif madda
                .replace(/ٰ/g, '') // Remove alif khanjariyah (superscript alif)
                .replace(/ؤ/g, 'و') // Normalize hamza on waw
                .replace(/ئ/g, 'ي') // Normalize hamza on ya
                .replace(/ى/g, 'ي') // Normalize alif maqsurah to ya
                .replace(/ة/g, 'ه'); // Normalize ta marbuta to ha
        };

        // Strip the name to base form: ٱلرَّحْمَٰنُ -> الرحمن
        let strippedName = normalizeArabic(arabicName);

        // Remove ال prefix to get root: الرحمن -> رحمن
        const rootName = strippedName.replace(/^ال/, '');

        // Create a version without long alif for flexible matching (سلام -> سلم)
        const rootNameNoAlif = rootName.replace(/ا/g, '');

        // Create a version without final ya for flexible matching (المتعالي -> المتعال)
        const rootNameNoFinalYa = rootName.replace(/ي$/, '');

        if (rootName.length === 0) return text;

        // Split text into words and check each word
        const words = text.split(/\s+/);
        const highlightedWords = words.map(word => {
            const strippedWord = normalizeArabic(word);
            const strippedWordNoAlif = strippedWord.replace(/ا/g, '');
            const strippedWordNoFinalYa = strippedWord.replace(/ي$/, '');

            // Check if the word matches the name (with or without ال, with flexible alif, and with flexible final ya)
            if (strippedWord === strippedName || strippedWord === rootName ||
                strippedWordNoAlif === rootNameNoAlif ||
                strippedWord === rootNameNoFinalYa || // Word matches name without final ya
                strippedWordNoFinalYa === rootNameNoFinalYa || // Both have final ya removed
                strippedWord.includes(rootName) || strippedWordNoAlif.includes(rootNameNoAlif)) {
                return `<span class="highlighted-name">${word}</span>`;
            }
            return word;
        });

        return highlightedWords.join(' ');
    }


      function setLanguage(lang) {
        language.set(lang);
    }

      let showPlayer = false;
    let allNamesElement;
    let bottomNameElement;
    let allNamesVisible = false;
    let bottomNameVisible = false;

    // Reactive statement to control showPlayer based on both elements
    $: showPlayer = allNamesVisible && !bottomNameVisible;

    onMount(() => {
        const allNamesObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.target === allNamesElement) {
                        allNamesVisible = entry.isIntersecting;
                    }
                });
            },
            { threshold: 0.1 } // Show when 10% of AllNames is visible
        );

        const bottomNameObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.target === bottomNameElement) {
                        bottomNameVisible = entry.isIntersecting;
                    }
                });
            },
            { threshold: 0.1 } // Track when 10% of bottom name is visible
        );

        if (allNamesElement) {
            allNamesObserver.observe(allNamesElement);
        }

        if (bottomNameElement) {
            bottomNameObserver.observe(bottomNameElement);
        }

        return () => {
            if (allNamesElement) {
                allNamesObserver.unobserve(allNamesElement);
            }
            if (bottomNameElement) {
                bottomNameObserver.unobserve(bottomNameElement);
            }
        };
    });

</script>



<!-- Language Buttons -->



<body>

    <Back/>

    <div class="title">
    <Title/>
    </div>

    <div class="text">
        <p class="Reference">By Ahmed Bendaly | December 2025</p> <br>

        <div class="language-buttons2">
            <p>Choose a language</p>
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


    <div class="player-sticky-container2">
        <Player/>
    </div>

       
    </div>


<div bind:this={allNamesElement}>
    <AllNames/>
</div>



{#if showPlayer}
    <div class="player-sticky-container">
          {#if currentName}
  <div class="name-display2">
    <p class="arabic-name">{currentName.arabicName}</p>
    <span class="separator">|</span>
    <p class="english-name">{currentName.englishName}</p>
  </div>
{/if}
    </div>
{/if}


   {#if currentName}
  <div class="name-display-container" bind:this={bottomNameElement}>
    {#if $language === 'Arabic'}
      <!-- Arabic Version -->
      <div class="name-display">
        <p class="arabic-name">{currentName.arabicName}</p>
        <span class="separator">|</span>
        <p class="english-name">{currentName.englishName}</p>
      </div>

      <!-- Arabic Description -->
      {#if currentName.descAr}
        <p class="description-arabic">{currentName.descAr}</p>
      {/if}

      <!-- Source Information -->
      <div class="source-info">
        {#if currentName.quran_hadith === 'Quran'}
          <!-- Quran Source with Frequency -->
          <div class="source-columns">
            <div class="source-column">
              {#if currentName.frequency === 1}
                <p class="frequency-text">مرة واحدة</p>
              {:else if currentName.frequency === 2}
                <p class="frequency-text">مرتين</p>
              {:else if currentName.frequency >= 3 && currentName.frequency <= 10}
                <p class="frequency-text">{currentName.frequency} مرّات</p>
              {:else if currentName.frequency >= 11}
                <p class="frequency-text">{currentName.frequency} مرّة</p>
              {:else}
                <p class="frequency-text">0 مرّة</p>
              {/if}
            </div>
            <div class="source-column">
              <p class="source-label">ذكرت في القرآن</p>
            </div>
          </div>

          <!-- Quranic Verses Carousel -->
          {#if quranVerses.length > 0}
            <div class="quran-carousel">
              <div class="carousel-content">
                {#if quranVerses.length > 1}
                  <button class="carousel-arrow carousel-arrow-left" on:click={nextVerse} disabled={currentVerseIndex === quranVerses.length - 1}>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                    </svg>
                  </button>
                {/if}

                <div class="verse-container">
                  <p class="quran-text">{@html highlightName(quranVerses[currentVerseIndex].text, currentName.arabicName)}</p>
                  <p class="verse-reference">
                   <b> سورة {quranVerses[currentVerseIndex].surahName} - آية {quranVerses[currentVerseIndex].ayahNumber} <b/>
                  </p>
                  {#if quranVerses.length > 1}
                    <p class="verse-counter">{currentVerseIndex + 1} / {quranVerses.length}</p>
                  {/if}
                </div>

                {#if quranVerses.length > 1}
                  <button class="carousel-arrow carousel-arrow-right" on:click={prevVerse} disabled={currentVerseIndex === 0}>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                    </svg>
                  </button>
                {/if}
              </div>
            </div>
          {/if}
        {:else if currentName.quran_hadith === 'Hadith'}
          <!-- Hadith Source -->
          <div class="source-hadith">
            <p class="source-label">ذكرت في الحديث</p>
          </div>
        {/if}
      </div>
    {:else}
      <!-- English Version (keep original) -->
      <div class="name-display">
        <p class="arabic-name">{currentName.arabicName}</p>
        <span class="separator">|</span>
        <p class="english-name">{currentName.englishName}</p>
      </div>
    {/if}
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
    @import url('https://fonts.googleapis.com/css2?family=Amiri+Quran&display=swap');

        .Reference{
        color: #266F8C;
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

        /* box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.15); */
    }


        .player-sticky-container2 {

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

  .language-buttons2 {
    text-align: center;
    gap: 1rem;
}



  .name-display {
    display: flex;
    justify-content: space-between; /* pushes items to edges */
    align-items: center;
    width: 100%; /* takes full width */
    background-color: none;
  }

   .name-display2 {
    display: flex;
    justify-content: space-between; /* pushes items to edges */
    align-items: center;
    width: 100%; /* takes full width */
    background-color: #FDEEDB;
  }

  .arabic-name {
    font-family: 'NotoKufiArabic', sans-serif;
    font-weight: 700;
    font-size: 2.5vw;
    direction: rtl;
    margin: 0;
    color: #603D25;
    order: 3; /* appears on the right */
  }

  .separator {
    order: 2; /* appears in center */
     font-size: 6vw;
    color: #603D25;
    position: absolute; /* position it absolutely */
    left: 50%; /* center horizontally */
    transform: translateX(-50%); /* adjust for element width */
  }

  .english-name {
    font-family: 'JawiKufi', sans-serif;
     font-size: 5vw;
    color: #603D25;
    margin: 0;
    order: 1; /* appears on the left */
  }
    button{
    font-family: 'JawiKufi', sans-serif;
     font-size: 3vw;
    color: #266F8C;

    background-color: #FDEDDB;
   border: 2px solid #FDEDDB;

    }


    .ArabicText{
    font-family: 'NotoKufiArabic', sans-serif;
    font-weight: 700;
    font-size: 1vw;
    direction: rtl;
    margin: 0;
    color: #266F8C;
    }

    .text{
        font-size: 1.1vw;
        font-weight: 300;
        font-family: "Outfit", sans-serif;
        color: #266F8C;
        margin-bottom: 10%;
    }
    .title{
        margin-top:20%;
        margin-bottom: 10%;
        text-align: center;
    }
    body {
        margin-right: 25%;
        margin-left:25%
    }

    p{
         font-family: 'JawiKufi', sans-serif;
     font-size: 2vw;
        text-align: center;
        justify-items: center;
    }

    /* Arabic Description */
    .description-arabic {
        font-family: 'NotoKufiArabic', sans-serif;
        font-size: 1.8vw;
        direction: rtl;
        text-align: center;
        color: #603D25;
        margin: 2rem 0;
        line-height: 1.8;
    }

    /* Source Information */
    .source-info {
        margin-top: 2rem;
        width: 100%;
    }

    .source-columns {
        display: flex;
        justify-content: center;
        gap: 2rem;
        margin-bottom: 2rem;
    }

    .source-column {
        text-align: center;
    }

    .source-label {
        font-family: 'NotoKufiArabic', sans-serif;
        font-size: 2vw;
        font-weight: 700;
        color: #266F8C;
        margin: 0;
        direction: rtl;
    }

    .frequency-text {
        font-family: 'NotoKufiArabic', sans-serif;
        font-size: 2vw;
        font-weight: 700;
        color: #AB8A7E;
        margin: 0;
        direction: rtl;
    }

    .source-hadith {
        text-align: center;
    }

    /* Quran Carousel */
    .quran-carousel {
        width: 100%;
        margin: 2rem 0;
    }

    .carousel-content {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        position: relative;
    }

    .carousel-arrow {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: #266F8C;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
        flex-shrink: 0;
    }

    .carousel-arrow:hover:not(:disabled) {
        background-color: #AB8A7E;
        transform: scale(1.1);
    }

    .carousel-arrow:disabled {
        background-color: #d0d0d0;
        cursor: not-allowed;
        opacity: 0.5;
    }

    .carousel-arrow svg {
        width: 24px;
        height: 24px;
        color: #FDEDDB;
    }

    .verse-container {
        flex: 1;
        max-width: 800px;
        background-color: rgba(38, 111, 140, 0.05);
        padding: 2rem;
        border-radius: 12px;
        border: 2px solid #266F8C;
    }

    .quran-text {
        font-family: 'Amiri Quran', serif;
        font-weight: 400;
        font-size: 2.2vw;
        direction: rtl;
        text-align: center;
        color: #603D25;
        line-height: 2.2;
        margin: 0 0 1.5rem 0;
    }

    .quran-text :global(.highlighted-name) {
        font-weight: 700;
        color: #266F8C;
        background-color: rgba(171, 138, 126, 0.2);
        padding: 0.2em 0.4em;
        border-radius: 4px;
    }

    .verse-reference {
        font-family: 'NotoKufiArabic', sans-serif;
        font-size: 1.4vw;
        direction: rtl;
        text-align: center;
        color: #266F8C;
        margin: 0.5rem 0;
    }

    .verse-counter {
        font-family: 'NotoKufiArabic', sans-serif;
        font-size: 1.2vw;
        text-align: center;
        color: #AB8A7E;
        margin: 0.5rem 0 0 0;
        direction: ltr;
    }

    .name-display-container {
        background-color: none;
        padding: 2rem;
        width: 100%;
    }
</style>