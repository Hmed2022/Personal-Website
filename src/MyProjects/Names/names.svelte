<script>
import { onMount } from 'svelte';

import AllNames from './Components/allnames.svelte'
import Title from './Components/title.svelte'
import Player from './Components/player.svelte';
import { style } from 'svelte-body';
import {language,nameId, filterQuran, filterDerived, filterHadith, showDisputed, audioPlaying, audioCurrentTime } from './Stores/misc.js';
import  names  from './Components/names.js';
import Back from './Components/background.svelte'
import quranData from './Assests/quran.json';
import quranDataEN from './Assests/QuranEN.json';
import surahsData from './Assests/surahs.json';
import sunnahData from './Assests/sunnah.json';
import Frequency from './Components/frequency.svelte';
import video from '../../assets/Projects/Names/video.mp4'


    // Reactive statement: automatically updates when $nameId changes
    $: currentName = $nameId && names[$nameId] ? names[$nameId] : null;

    // Carousel state for Quranic verses
    let currentVerseIndex = 0;

    // Get Quranic verses for current name (Arabic)
    $: quranVerses = currentName && currentName.reference ? currentName.reference.map(ref => {
        // Skip if this is a hadith reference (has id instead of surah/ayah)
        if (!ref.surah || !ref.ayah) return null;

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

    // Get Quranic verses for current name (English)
    $: quranVersesEN = currentName && currentName.reference ? currentName.reference.map(ref => {
        // Skip if this is a hadith reference (has id instead of surah/ayah)
        if (!ref.surah || !ref.ayah) return null;

        const surahVerses = quranDataEN[ref.surah.toString()];
        if (surahVerses) {
            const verse = surahVerses.find(v => v.verse === ref.ayah);
            const surahInfo = surahsData.find(s => s.id === ref.surah);
            return {
                text: verse ? verse.text : '',
                surahName: surahInfo ? surahInfo.transliteration : '',
                surahTranslation: surahInfo ? surahInfo.translation : '',
                surahNumber: ref.surah,
                ayahNumber: ref.ayah
            };
        }
        return null;
    }).filter(v => v !== null) : [];

    // Get Hadith data for current name
    $: hadithData = currentName && currentName.quran_hadith === 'Hadith' && currentName.reference ? currentName.reference.map(ref => {
        const hadith = sunnahData.hadiths.find(h => h.id === ref.id);
        if (hadith) {
            return {
                textArabic: hadith.text.arabic,
                textEnglish: hadith.text.english,
                collection: hadith.collection,
                narrator: hadith.narrator,
                hadithNumber: hadith.reference.hadith_number,
                bookTitleArabic: hadith.reference.book_title_arabic,
                bookTitleEnglish: hadith.reference.book_title_english,
                englishReference: hadith.reference.english_translation_reference,
                url: hadith.url
            };
        }
        return null;
    }).filter(h => h !== null) : [];

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
    let videoElement;

    // Reactive statement to control showPlayer based on both elements
    // $: showPlayer = allNamesVisible && !bottomNameVisible;

     $: showPlayer = true;

    // Sync video with audio player (play/pause)
    $: if (videoElement) {
        if ($audioPlaying) {
            videoElement.play();
        } else {
            videoElement.pause();
        }
    }

    // Sync video currentTime with audio currentTime
    $: if (videoElement && $audioCurrentTime !== undefined) {
        // Only update if the difference is significant to avoid constant updates
        if (Math.abs(videoElement.currentTime - $audioCurrentTime) > 0.1) {
            videoElement.currentTime = $audioCurrentTime;
        }
    }

    onMount(() => {
        // Scroll to top when component mounts
        window.scrollTo(0, 0);

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

<svelte:head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Reem+Kufi:wght@400..700&display=swap" rel="stylesheet">
</svelte:head>

<!-- Language Buttons -->

 <div class="language-buttons2">
    {#if $language === 'Arabic'}
        <p class="language-label-arabic">اختر لغة</p>
    {:else}
        <p class="language-label-english">Choose a language</p>
    {/if}
    <div style="display: flex; gap: 0.5rem;">
        <button
            class:active={$language === 'English'}
            on:click={() => setLanguage('English')}
        >
            {#if $language === 'Arabic'}
                الإنجليزية
            {:else}
                English
            {/if}
        </button>
        <button
            class:active={$language === 'Arabic'}
            on:click={() => setLanguage('Arabic')}
        >
            {#if $language === 'Arabic'}
                العربية
            {:else}
                Arabic
            {/if}
        </button>
    </div>
</div>

<body>

    <Back/>
    

    <div class="title">
    <Title/>
      {#if $language === 'Arabic'}
    <h1 class='ArTitle'> الأسماء التي حفظناها قبل أن نفهمها</h1>
    {:else}
     <h1 class='ENTitle'> The Names We Memorized Before We Understood</h1>
    {/if}
    </div>

    <div class="text">
        <!-- <p class="Reference">By Ahmed Bendaly | February 2026</p> <br> -->


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
        <p class=EnglishText>It’s the first day of Ramadan in Tunisia. <br><br>
We’ve been fasting all day, and now we’re making the final touches to the dining table. On TV, the Qur’an is being recited by Ali Al-Barrak, a familiar signal that iftar is only minutes away. The sun sets. The adhan rises—one call from the nearby mosque, another from farther away, and a third from the television, all overlapping.
We break our fast with dates and water. After a long day of fasting, that first sip is deeply satisfying. <br><br>
Then a familiar song begins to play in the background. <br><br>
It’s a song everyone knows—not because we chose to learn it, but because we hear it every day for thirty days, year after year. The unmistakable voice of Lotfi Bouchnak fills the room, carrying a rhythmic chant of the Names of Allah. I remember singing along while cutting lemons and baguettes.
 </p>
    {/if}
</p>

<div class="video-container">
    <video
        class="names-video"
        bind:this={videoElement}
        muted
        playsinline
    >
        <source src={video} type="video/mp4">
        Your browser does not support the video tag.
    </video>
</div>

    <p class="ArabicText">
    {#if $language === 'Arabic'}
       يُقال كثيرًا إنَّ عِظَم الشيء يُعرَف بكثرة أسمائه. وفي الإسلام، الله جلّ جلاله هو الأعظم، وتنعكس أسماؤه على كماله. فكلّ اسم من أسماء الله الحُسنى يصف صفةً إلهية سامية — كالرَّحمن، القدير، العليم، السلام، القيّوم، النور. فهذه الأسماء ليست عناوين جامدة، بل هي دعوات للتعرّف إلى حقيقة الله ومعاني صفاته.
ولكثيرٍ من المسلمين، تكون هذه الأسماء مألوفة قبل أن تُدرَس رسميًا؛ تُتعلَّم من الأسرة، ومن الثقافة، ومن الأناشيد خصوصًا. ففي تونس — على سبيل المثال — يكاد يكون الأمر عادةً رمضانية: قبل لحظات من الإفطار، يصدح نشيد أسماء الله الحُسنى في المنازل، ليصبح جزءًا من الذاكرة والروح والهوية.
    {:else}
        <p class=EnglishText>
            
            The song is nostalgic. It signals family, gathering, and the moment we finally eat together. But years later, listening to it again, I realized something: we learned these names long before we understood them.<br><br> The beauty is that all Tunisians share the same song, The same childhood memory But rarely stop to ask how it was assembled.
This project begins there—by returning to the names we memorized by sound, and taking a closer look at them through the text itself.
<br><br>
<i style='font-weight:300'>Please Note: This project does not attempt to define the “correct” 99 Names of Allah, nor to correct religious practice or offer theological interpretation.
It documents how a familiar list—learned through culture and memory—appears when examined against the Qur’anic text, using a simple and transparent method.
       </i> 
    
    <br> <br>
    Below is the list of the Names, each Name will be highlighted when it is mentioned in the song,</p>
    {/if}
</p>
       
    </div>


<div bind:this={allNamesElement}>
    <AllNames/>
</div>



{#if showPlayer}
    <div class="player-sticky-container">
        <div class="player-wrapper">
            <Player/>
        </div>
        {#if currentName}
            <div class="name-display-sticky">
                {#if $language === 'Arabic'}
                    <p class="current-name-sticky-arabic">{currentName.arabicName}</p>
                {:else}
                    <p class="current-name-sticky-english">{currentName.englishName}</p>
                {/if}
                {#if currentName.rank !== undefined}
                    <span class="name-rank">{currentName.rank}</span>
                {/if}
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
              <p class="source-label">ذكر في القرآن الكريم</p>
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

                <div class={currentName.quran_hadith === "Hadith" ? "verse-container-hadith" : currentName.quran_hadith === "Derived" ? "verse-container-derived" : "verse-container"}>
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
            <p class="source-label">ذكر في الحديث الصحيح</p>
          </div>

          <!-- Hadith reference -->
          {#if hadithData.length > 0}
            <div class="quran-carousel">
              <div class="carousel-content">
                <div class="verse-container-hadith">
                  <p class="quran-text">{@html highlightName(hadithData[0].textArabic, currentName.arabicName)}</p>
                  <p class="verse-reference">
                   <b>{hadithData[0].collection} - {hadithData[0].bookTitleArabic} - حديث رقم {hadithData[0].hadithNumber}<b/>
                  </p>
                </div>
              </div>
            </div>
          {/if}
        {:else if currentName.quran_hadith === 'Derived'}
          <!-- Derived Source -->
          <div class="source-hadith">
            <p class="source-label">مشتق من القرآن الكريم</p>
          </div>

          <!-- Verse reference for Derived -->
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

                <div class="verse-container-derived">
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
        {/if}
      </div>
    {:else}
      <!-- English Version -->
      <div class="name-display">
        <p class="english-mean">{currentName.englishMean}</p>
        <span class="separator">|</span>
        <p class="english-name">{currentName.englishName}</p>
      </div>

      <!-- English Description -->
      {#if currentName.descEn}
        <p class="description-english">{currentName.descEn}</p>
      {/if}

      <!-- Source Information -->
      <div class="source-info">
        {#if currentName.quran_hadith === 'Quran'}
          <!-- Quran Source with Frequency -->
          <div class="source-columns">
           
            <div class="source-column">
              <p class="source-label-english">Mentioned in The Holy Quran</p>
            </div>

             <div class="source-column">
              {#if currentName.frequency === 1}
                <p class="frequency-text-english">Once</p>
              {:else if currentName.frequency === 2}
                <p class="frequency-text-english">Twice</p>
              {:else if currentName.frequency >= 3}
                <p class="frequency-text-english">{currentName.frequency} times</p>
              {:else}
                <p class="frequency-text-english">0 times</p>
              {/if}
            </div>
          </div>

          <!-- Quranic Verses Carousel -->
          {#if quranVersesEN.length > 0}
            <div class="quran-carousel">
              <div class="carousel-content">
                {#if quranVersesEN.length > 1}
                  <button class="carousel-arrow carousel-arrow-left" on:click={prevVerse} disabled={currentVerseIndex === 0}>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                    </svg>
                  </button>
                {/if}

                <div class={currentName.quran_hadith === "Hadith" ? "verse-container-hadith" : currentName.quran_hadith === "Derived" ? "verse-container-derived" : "verse-container"}>
                  <p class="quran-text">{quranVersesEN[currentVerseIndex].text}</p>
                  <p class="verse-reference">
                   <b> Surah {quranVersesEN[currentVerseIndex].surahName} <i class="translation-text">({quranVersesEN[currentVerseIndex].surahTranslation})</i> - Verse {quranVersesEN[currentVerseIndex].ayahNumber} <b/>
                  </p>
                  {#if quranVersesEN.length > 1}
                    <p class="verse-counter">{currentVerseIndex + 1} / {quranVersesEN.length}</p>
                  {/if}
                </div>

                {#if quranVersesEN.length > 1}
                  <button class="carousel-arrow carousel-arrow-right" on:click={nextVerse} disabled={currentVerseIndex === quranVersesEN.length - 1}>
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
            <p class="source-label-english">Mentioned in Hadith Sahih</p>
          </div>

          <!-- Hadith reference -->
          {#if hadithData.length > 0}
            <div class="quran-carousel">
              <div class="carousel-content">
                <div class="verse-container-hadith">
                  <p class="quran-text">{hadithData[0].textEnglish}</p>
                  <p class="verse-reference">
                   <b>{hadithData[0].collection} - {hadithData[0].englishReference} - Hadith #{hadithData[0].hadithNumber}<b/>
                  </p>
                </div>
              </div>
            </div>
          {/if}
        {:else if currentName.quran_hadith === 'Derived'}
          <!-- Derived Source -->
          <div class="source-hadith">
            <p class="source-label-english">Derived From The Holy Quran</p>
          </div>

          <!-- Verse reference for Derived -->
          {#if quranVersesEN.length > 0}
            <div class="quran-carousel">
              <div class="carousel-content">
                {#if quranVersesEN.length > 1}
                  <button class="carousel-arrow carousel-arrow-left" on:click={prevVerse} disabled={currentVerseIndex === 0}>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                    </svg>
                  </button>
                {/if}

                <div class="verse-container-derived">
                  <p class="quran-text">{quranVersesEN[currentVerseIndex].text}</p>
                  <p class="verse-reference">
                   <b> Surah {quranVersesEN[currentVerseIndex].surahName} <i class="translation-text">({quranVersesEN[currentVerseIndex].surahTranslation})</i> - Verse {quranVersesEN[currentVerseIndex].ayahNumber} <b/>
                  </p>
                  {#if quranVersesEN.length > 1}
                    <p class="verse-counter">{currentVerseIndex + 1} / {quranVersesEN.length}</p>
                  {/if}
                </div>

                {#if quranVersesEN.length > 1}
                  <button class="carousel-arrow carousel-arrow-right" on:click={nextVerse} disabled={currentVerseIndex === quranVersesEN.length - 1}>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                    </svg>
                  </button>
                {/if}
              </div>
            </div>
          {/if}
        {/if}
      </div>
    {/if}
  </div>
{/if}


<p class="ArabicText">
    {#if $language === 'Arabic'}
        <p class="ArabicText">
            لفترةٍ طويلة، افترضتُ أنَّ جميع هذه الأسماء مذكورة صراحةً في القرآن الكريم. لكن عند الدراسة الدقيقة، تظهر صورة أكثر تفصيلاً.
        </p>

        <div class="filter-section-arabic">
            <label class="filter-checkbox-arabic quran-filter">
                <span>ذُكر في القرآن الكريم</span>
                <input type="checkbox" bind:checked={$filterQuran} />
            </label>

            <label class="filter-checkbox-arabic derived-filter">
                <span>مُشتق من القرآن الكريم</span>
                <input type="checkbox" bind:checked={$filterDerived} />
            </label>

            <label class="filter-checkbox-arabic hadith-filter">
                <span>ذُكر في الحديث الصحيح</span>
                <input type="checkbox" bind:checked={$filterHadith} />
            </label>
        </div>

        <p class="ArabicText">
            إنَّ ما هو ثابت عبر التقاليد العلمية ليس التكوين الدقيق للقائمة، بل عددها: تسعة وتسعون اسمًا، كما ورد في حديث مشهور عن النبي محمد ﷺ.
        </p>

        <p class="ArabicText">
            بعض الأسماء محلّ خلاف بين العلماء. في الواقع، من أصل ٩٩ اسمًا، هناك فقط ٨١ اسمًا متفق عليها، والباقي محلّ نقاش.
            <span class="disputed-toggle" on:click={() => $showDisputed = !$showDisputed} on:keydown={(e) => e.key === 'Enter' && ($showDisputed = !$showDisputed)} role="button" tabindex="0">
                اضغط هنا {$showDisputed ? 'لإخفاء' : 'لتمييز'} الأسماء المتنازع عليها
            </span>
        </p>
    {:else}
        <p class=EnglishText>
            For a long time, I assumed that all of these Names were explicitly mentioned in the Qur'an. When examined closely, however, a more nuanced picture emerges.
        </p>

        <div class="filter-section">
            <label class="filter-checkbox quran-filter">
                <input type="checkbox" bind:checked={$filterQuran} />
                <span>Mentioned in the Qur'an</span>
            </label>

            <label class="filter-checkbox derived-filter">
                <input type="checkbox" bind:checked={$filterDerived} />
                <span>Derived from the Qur'an</span>
            </label>

            <label class="filter-checkbox hadith-filter">
                <input type="checkbox" bind:checked={$filterHadith} />
                <span>Mentioned in Sahih Hadith</span>
            </label>
        </div>

        <p class="EnglishText">
            What is consistent across scholarly traditions is not the exact composition of the list, but its number: ninety-nine Names, as referenced in a well-known hadith of the Prophet Muhammad ﷺ.
        </p>

        <p class="EnglishText">
            Some names are disputed among scholars. In fact, out of the 99, only 81 are agreed upon and the others are open for discussion.
            <span class="disputed-toggle" on:click={() => $showDisputed = !$showDisputed} on:keydown={(e) => e.key === 'Enter' && ($showDisputed = !$showDisputed)} role="button" tabindex="0">
                Click here to {$showDisputed ? 'hide' : 'highlight'} the disputed names
            </span>
        </p>
    {/if}
</p>


</body>

<!-- <div class="frequency-section">
<Frequency/>
</div> -->

<body>
    <div class="conclusion-section">
        {#if $language === 'Arabic'}
            <h2 class="section-title-ar">الخاتمة والمنهجية</h2>
            <p class="ArabicText">
                في هذا المشروع، استكشفنا أسماء الله الحسنى من خلال منظور البيانات والتصور البصري، محاولين فهم كيفية ظهور هذه الأسماء في النصوص المقدسة وكيف تم جمعها وحفظها عبر التاريخ الإسلامي.
                <br><br>
                اعتمدت المنهجية على تحليل القرآن الكريم والسنة النبوية، مع التركيز على تكرار الأسماء وسياقاتها المختلفة. استخدمنا أدوات التصور البصري لإبراز الأنماط والعلاقات بين هذه الأسماء، مما يساعد على فهم أعمق لمعانيها وأهميتها الروحية.
                <br><br>
                هذا العمل ليس محاولة لتقديم تفسير ديني نهائي، بل هو دعوة لإعادة اكتشاف هذه الأسماء التي حفظناها قبل أن نفهمها، وللتأمل في عظمة الله من خلال أسمائه الحسنى.
            </p>
        {:else}
            <h2 class="section-title-en">Conclusion and Methodology</h2>
            <p class="EnglishText">
                In this project, we explored the Names of Allah through the lens of data visualization, seeking to understand how these names appear in sacred texts and how they have been compiled and preserved throughout Islamic history.
                <br><br>
                The methodology was based on analyzing the Quran and Sunnah, focusing on the frequency and different contexts of these names. We used visualization tools to highlight patterns and relationships between the names, enabling a deeper understanding of their meanings and spiritual significance.
                <br><br>
                This work is not an attempt to provide a definitive religious interpretation, but rather an invitation to rediscover the names we memorized before we understood them, and to contemplate the greatness of Allah through His beautiful names.
            </p>
        {/if}
    </div>
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

    @font-face {
    font-family: 'KFGQPCUthmanicScriptHAFS';
    src: url('../Assests/KFGQPC%20Uthmanic%20Script%20HAFS%20Regular.otf') format('opentype');
    font-weight: normal;
    font-style: normal;
  }

    @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Funnel+Display:wght@300..800&family=Quicksand:wght@300..700&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Amiri+Quran&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap');

        .Reference{
        color: #266F8C;
        /* font-weight: 200; */
        text-align: center;
        margin-top: 0;
        margin-bottom: 0;
        font-family: 'JawiKufi';
        font-size: 3vw;
    }

    .ENTitle{
         font-family: 'JawiKufi';
         background-color: #266F8C;
         padding-top: 2%;
         color: #FEEEDB;
         font-size: 4vw;
    }

    .ArTitle{
        font-family: "Reem Kufi", sans-serif;
        font-weight: 600;
        background-color: #266F8C;
        color: #FEEEDB;
        font-size: 3vw;
        font-optical-sizing: auto;
        font-style: normal;
    }

        .player-sticky-container {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100vw;
        display: flex;
        align-items: center;
        gap: 2rem;
        background-color: #FDEEDB;
        padding: 0 3rem;
        z-index: 1000;
        box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.15);
        margin: 0;
        height: auto;
        min-height: 120px;
    }

    .player-wrapper {
        flex: 1;
        min-width: 400px;
        max-width: 800px;
    }

    .player-wrapper :global(.player-container) {
        max-width: none;
        padding: 1rem 0;
        margin: 0;
    }

    .name-display-sticky {
        flex: 0 1 auto;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        min-width: 200px;
        max-width: 400px;
    }

    .current-name-sticky-arabic {
        font-family: 'NotoKufiArabic', sans-serif;
        font-weight: 700;
        font-size: clamp(1.5rem, 2.5vw, 3rem);
        color: #266F8C;
        margin: 0;
        text-align: right;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        direction: rtl;
    }

    .current-name-sticky-english {
        font-family: 'JawiKufi', sans-serif;
        font-weight: 700;
        font-size: clamp(1.5rem, 2.5vw, 3rem);
        color: #266F8C;
        margin: 0;
        text-align: right;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .name-rank {
        font-family: 'JawiKufi', sans-serif;
        font-weight: 700;
        font-size: clamp(1.8rem, 3vw, 3.5rem);
        color: #EEDCC9;
        margin-left: 2rem;
        flex-shrink: 0;
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
    position: sticky;
    top: 1vw;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.5rem;
    z-index: 1000;
    float: right;
    margin-left: auto;
    margin-right: 2vw;
    padding: 0.5vw;

}

  .language-label-english {
    margin: 0 0 0.3rem 0;
    font-size: 2vw;
    color: #266F8C;
    font-family: 'JawiKufi', sans-serif;
  }

  .language-label-arabic {
    margin: 0 0 0.3rem 0;
    font-size: 1.7vw;
    color: #266F8C;
    font-family: "Reem Kufi", sans-serif;
    direction: rtl;
  }

  .language-buttons2 button {
    padding: 0.5rem 1rem;
    font-size: 2vw;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .language-buttons2 button.active {
    background-color: #266F8C;
    color: #FDEEDB;
    border-color: #266F8C;
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
    color: #266F8C;
    order: 3; /* appears on the right */
  }

  .separator {
    order: 2; /* appears in center */
     font-size: 6vw;
    color: #266F8C;
    position: absolute; /* position it absolutely */
    left: 50%; /* center horizontally */
    transform: translateX(-50%); /* adjust for element width */
  }

  .english-name {
    font-family: 'JawiKufi', sans-serif;
     font-size: 5vw;
    color: #266F8C;
    margin: 0;
    order: 1; /* appears on the left */
  }

   .english-mean {
    font-family: 'JawiKufi', sans-serif;
     font-size: 4vw;
     font-weight: 900;
    color: #266F8C;
    margin: 0;
    order: 3; /* appears on the left */
  }



    button{
    font-family: 'JawiKufi', sans-serif;
     font-size: 4vw;
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
        margin-right: 25vw;
        margin-left:25vw
    }

    .frequency-section {
        margin-right: 0;
        margin-left: 0;
        width: 100vw;
        position: relative;
        left: 50%;
        right: 50%;
        margin-left: -50vw;
        margin-right: -50vw;
    }

    .EnglishText{
         font-family: "Quicksand", sans-serif;
        font-size: 1.1vw;
        text-align: center;
        justify-items: center;
        direction: ltr;
    }

    .conclusion-section {
        margin-top: 8%;
        margin-bottom: 10%;
        padding: 3rem 0;
    }

    .section-title-ar {
        font-family: 'NotoKufiArabic', sans-serif;
        font-size: 3vw;
        font-weight: 700;
        color: #266F8C;
        text-align: center;
        margin-bottom: 2rem;
        direction: rtl;
    }

    .section-title-en {
        font-family: 'JawiKufi', sans-serif;
        font-size: 3vw;
        font-weight: 700;
        color: #266F8C;
        text-align: center;
        margin-bottom: 2rem;
    }

    .conclusion-section .ArabicText {
        font-size: 1.2vw;
        line-height: 1.8;
        text-align: justify;
    }

    .conclusion-section .EnglishText {
        font-size: 1.2vw;
        line-height: 1.8;
        text-align: justify;
    }

    .video-container {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 4rem 0;
        padding: 0;
    }

    .names-video {
        width: 100%;
        max-width: 800px;
        height: auto;
        border: 8px solid #266F8C;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(38, 111, 140, 0.3);
    }


    p{
        font-family: "Funnel Display", sans-serif;
        font-size: 1vw;
        text-align: center;
        justify-items: center;
    }

    /* Arabic Description */
    .description-arabic {
        font-family: 'NotoKufiArabic', sans-serif;
        font-size: 1.4vw;
        direction: rtl;
        text-align: center;
        color: #603D25;
        margin: 2rem 0;
        line-height: 1.8;
    }

    /* English Description */
    .description-english {
        font-family: 'Nunito', sans-serif;
        font-size: 1.4vw;
        direction: ltr;
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

    .source-label-english {
        font-family: 'Nunito', sans-serif;
        font-size: 2vw;
        font-weight: 700;
        color: #266F8C;
        margin: 0;
        direction: ltr;
    }

    .frequency-text {
        font-family: 'NotoKufiArabic', sans-serif;
        font-size: 2vw;
        font-weight: 700;
        color: #AB8A7E;
        margin: 0;
        direction: rtl;
    }

    .frequency-text-english {
        font-family: 'Nunito', sans-serif;
        font-size: 2vw;
        font-weight: 700;
        color: #AB8A7E;
        margin: 0;
        direction: ltr;
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

    .verse-container-hadith {
        flex: 1;
        max-width: 800px;
        background-color: rgba(128, 90, 168, 0.05);
        padding: 2rem;
        border-radius: 12px;
        border: 2px solid #805AA8;
    }

    .verse-container-derived {
        flex: 1;
        max-width: 800px;
        background-color: rgba(76, 140, 76, 0.05);
        padding: 2rem;
        border-radius: 12px;
        border: 2px solid #4C8C4C;
    }

    .quran-text {
        font-family: 'KFGQPCUthmanicScriptHAFS', 'Amiri Quran', serif !important;
        font-weight: 400;
        font-size: 1.8vw;
        direction: rtl;
        text-align: center;
        color: #603D25;
        line-height: 2.5;
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

    .translation-text {
        font-weight: 300;
    }

    .verse-counter {
        font-family: 'NotoKufiArabic', sans-serif;
        font-weight: 900;
        font-size: 1.2vw;
        text-align: center;
        color: #AB8A7E;
        margin: 0.5rem 0 0 0;
        direction: ltr;
    }

    .name-display-container {
        background-color: none;
        /* padding: 2rem; */
        width: 100%;
    }

    /* Filter Section Styles */
    .filter-section {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin: 2rem 0;
        padding: 1.5rem;
        background-color: rgba(171, 138, 126, 0.1);
        border-radius: 8px;
    }

    .filter-checkbox {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 1rem;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s;
        font-family: 'Nunito', sans-serif;
        font-size: 1.1rem;
        font-weight: 500;
    }

    .filter-checkbox:hover {
        transform: translateX(5px);
    }

    .quran-filter {
        background-color: rgba(38, 111, 140, 0.15);
        border: 2px solid #266F8C;
    }

    .quran-filter:hover {
        background-color: rgba(38, 111, 140, 0.25);
    }

    .derived-filter {
        background-color: rgba(76, 140, 76, 0.15);
        border: 2px solid #4C8C4C;
    }

    .derived-filter:hover {
        background-color: rgba(76, 140, 76, 0.25);
    }

    .hadith-filter {
        background-color: rgba(128, 90, 168, 0.15);
        border: 2px solid #805AA8;
    }

    .hadith-filter:hover {
        background-color: rgba(128, 90, 168, 0.25);
    }

    .filter-checkbox input[type="checkbox"] {
        width: 20px;
        height: 20px;
        cursor: pointer;
        accent-color: #603D25;
    }

    .filter-checkbox span {
        color: #603D25;
    }

    /* Disputed Toggle Styles */
    .disputed-toggle {
        color: #266F8C;
        text-decoration: underline;
        cursor: pointer;
        font-weight: 600;
        transition: color 0.2s;
    }

    .disputed-toggle:hover {
        color: #AC8B7E;
    }

    /* Arabic Filter Section Styles */
    .filter-section-arabic {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin: 2rem 0;
        padding: 1.5rem;
        background-color: rgba(171, 138, 126, 0.1);
        border-radius: 8px;
        direction: rtl;
    }

    .filter-checkbox-arabic {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 1rem;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s;
        font-family: 'NotoKufiArabic', sans-serif;
        font-size: 1.1rem;
        font-weight: 500;
        direction: rtl;
    }

    .filter-checkbox-arabic:hover {
        transform: translateX(-5px);
    }

    .filter-checkbox-arabic input[type="checkbox"] {
        width: 20px;
        height: 20px;
        cursor: pointer;
        accent-color: #603D25;
    }

    .filter-checkbox-arabic span {
        color: #603D25;
    }
</style>