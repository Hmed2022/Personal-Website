<script>
import { onMount } from 'svelte';

import AllNames from './Components/allnames.svelte'
import Title from './Components/title.svelte'
import Player from './Components/player.svelte';
import { style } from 'svelte-body';
import {language,nameId, filterQuran, filterDerived, filterHadith, showDisputed, audioPlaying, audioCurrentTime } from './Stores/misc.js';
import  names  from './Components/names.js';
import  people  from './Components/people.js';
import Back from './Components/background.svelte'
import quranData from './Assests/quran.json';
import quranDataEN from './Assests/QuranEN.json';
import surahsData from './Assests/surahs.json';
import sunnahData from './Assests/sunnah.json';
import Frequency from './Components/frequency.svelte';
import video from '../../assets/Projects/Names/video.mp4'


    // Reactive statement: automatically updates when $nameId changes
    $: currentName = $nameId && names[$nameId] ? names[$nameId] : null;
    $: currentPerson = $nameId && people[$nameId] ? people[$nameId] : null;

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
    <!-- {#if $language === 'Arabic'}
        <p class="language-label-arabic">اختر لغة</p>
    {:else}
        <p class="language-label-english">Choose a language</p>
    {/if} -->
    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        <button
            class:active={$language === 'English'}
            on:click={() => setLanguage('English')}
        >
            <span class="lang-full">English</span>
            <span class="lang-short">EN</span>
        </button>
        <button
            class:active={$language === 'Arabic'}
            on:click={() => setLanguage('Arabic')}
        >
            <span class="lang-full">Arabic</span>
            <span class="lang-short">AR</span>
        </button>
    </div>
</div>

<body>

    <Back/>
    

    <div class="title">
    <Title/>
      {#if $language === 'Arabic'}
    <h1 class='ArTitle'>الأَسْمَاءُ الَّتِي حَفِظْنَاهَا قَبْلَ أَنْ نَفْهَمَهَا</h1>
    {:else}
     <h1 class='ENTitle'> The Names We Memorized Before We Understood</h1>
    {/if}
    </div>

    <div class="text">
        <div class="reference-wrapper">
            <p class="Reference">By Ahmed Bendaly | February 2026</p>
        </div> <br>


        <!-- Test paragraph -->
<p class="ArabicText">
    {#if $language === 'Arabic'}إنه اليوم الأول من رمضان في تونس. <br><br>
صمنا طوال النهار، والآن نضع اللمسات الأخيرة على مائدة الإفطار. على شاشة التلفاز، يُتلى القرآن بصوت علي البرّاك، إشارة مألوفة بأن الإفطار لم يبقَ عليه سوى دقائق. تغرب الشمس. يرتفع الأذان — نداء من المسجد القريب، وآخر من بعيد، وثالث من التلفاز، تتداخل جميعها.
نُفطر على التمر والماء. بعد يوم طويل من الصيام، تلك الرشفة الأولى مُرضية للغاية. <br><br>
ثم تبدأ أغنية مألوفة في الخلفية. <br><br>
إنها أغنية يعرفها الجميع — ليس لأننا اخترنا تعلّمها، بل لأننا نسمعها كل يوم لثلاثين يومًا، سنة بعد سنة. يملأ صوت لطفي بوشناق — أحب مطربي تونس — الغرفة، حاملًا ترنيمة إيقاعية لأسماء الله الحُسنى. بالنسبة للتونسيين، هذه الأغنية مألوفة كالنشيد الوطني — فهي تُعلن لحظة الإفطار كل يوم طوال شهر كامل. أتذكر أنني كنت أُردد معها وأنا أقطع الليمون والخبز الفرنسي.
    {:else}
        <p class=EnglishText>It's the first day of Ramadan in Tunisia. <br><br>
We've been fasting all day, and now we're making the final touches to the dining table. On TV, the Holy Qur'an is being recited by Ali Al-Barrak, a familiar signal that iftar is only minutes away. The sun sets. The adhan rises—one call from the nearby mosque, another from farther away, and a third from the television, all overlapping.
We break our fast with dates and water. After a long day of fasting, that first sip is deeply satisfying. <br><br>
Then a familiar song begins to play in the background. <br><br>
It's a song everyone knows—not because we chose to learn it, but because we hear it every day for thirty days, year after year. The unmistakable voice of Lotfi Bouchnak—Tunisia's most beloved singer—fills the room, carrying a rhythmic chant of the Names of Allah. For Tunisians, this song is as familiar as a national anthem—it marks the moment of breaking fast every single day for a month. I remember singing along while cutting lemons and baguettes.
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
الأغنية تبعث على الحنين. تُشير إلى العائلة، والاجتماع، واللحظة التي نأكل فيها أخيرًا معًا. لكن بعد سنوات، وأنا أستمع إليها مجددًا، أدركت شيئًا: لقد تعلّمنا هذه الأسماء قبل أن نفهمها بوقت طويل.<br><br>
يبدأ هذا المشروع من هناك — بالعودة إلى الأسماء التي حفظناها بالصوت، وإلقاء نظرة أعمق عليها من خلال النص نفسه.
<br><br>
<i style='font-weight:300'>ملاحظة: لا يسعى هذا المشروع إلى تحديد أسماء الله الحُسنى "الصحيحة" التسعة والتسعين، ولا إلى تصحيح الممارسة الدينية أو تقديم تفسير عقدي.
إنه يوثّق كيف تبدو قائمة مألوفة — تعلّمناها من الثقافة والذاكرة — عند فحصها مقابل النص القرآني، باستخدام منهج بسيط وشفاف.</i>
<br><br>
فيما يلي القائمة التفاعلية للأسماء التسعة والتسعين. عند تشغيل الأغنية، سيتم تمييز كل اسم في الوقت الفعلي عندما يُنشده لطفي بوشناق. يمكنك أيضاً التصفية حسب الفئة لمعرفة الأسماء المذكورة مباشرة في القرآن، والمشتقة من صفات قرآنية، والتي تظهر فقط في أدب الحديث.
    {:else}
        <p class=EnglishText>

            The song is nostalgic. It signals family, gathering, and the moment we finally eat together. But years later, listening to it again, I realized something: we learned these names long before we understood them.<br><br> The beauty is that all Tunisians share the same song, The same childhood memory But rarely stop to ask how it was assembled.
This project begins there—by returning to the names we memorized by sound, and taking a closer look at them through the text itself.
<br><br>
<i style='font-weight:300'>Please Note: This project does not attempt to define the "correct" 99 Names of Allah, nor to correct religious practice or offer theological interpretation.
It documents how a familiar list—learned through culture and memory—appears when examined against the Holy Qur'anic text, using a simple and transparent method.
       </i>

    <br> <br>
    Below is the interactive list of the 99 Names. As you play the song, each name will highlight in real-time when Lotfi Bouchnak sings it. You can also filter by category to see which names come directly from the Holy Qur'an, which are derived from Holy Qur'anic attributes, and which appear only in hadith literature.</p>
    {/if}
</p>
       
    </div>


<div bind:this={allNamesElement}>
    <AllNames/>
</div>



{#if showPlayer}
    <div class="player-sticky-container">
        {#if currentName && currentName.rank !== undefined}
            <div class="rank-display-sticky">
                <span class="name-rank">{currentName.rank}</span>
            </div>
        {/if}
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
                <span><b>ذُكر في القرآن الكريم</b> — 55 اسمًا (55.6%)</span>
                <input type="checkbox" bind:checked={$filterQuran} />
            </label>
            <p class="filter-description-arabic">الاسم يظهر صراحةً في النص القرآني كصفة إلهية.</p>

            <label class="filter-checkbox-arabic derived-filter">
                <span><b>مُشتق من القرآن الكريم</b> — 40 اسمًا (40.4%)</span>
                <input type="checkbox" bind:checked={$filterDerived} />
            </label>
            <p class="filter-description-arabic">الاسم مأخوذ من صفات إلهية أو أوصاف موجودة في الآيات، وإن لم يُذكر كاسم مباشرة.</p>

            <label class="filter-checkbox-arabic hadith-filter">
                <span><b>ذُكر في الحديث الصحيح</b> — 4 أسماء (4.0%)</span>
                <input type="checkbox" bind:checked={$filterHadith} />
            </label>
            <p class="filter-description-arabic">الاسم يظهر في الأحاديث النبوية الصحيحة لكن ليس في القرآن.</p>
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
            For a long time, I assumed that all of these Names were explicitly mentioned in the Holy Qur'an. When examined closely, however, a more nuanced picture emerges.
        </p>

        <div class="filter-section">
            <label class="filter-checkbox quran-filter">
                <input type="checkbox" bind:checked={$filterQuran} />
                <span><b>Mentioned in the Holy Qur'an</b> — 55 names (55.6%)</span>
            </label>
            <p class="filter-description">The exact name appears explicitly in the Holy Qur'anic text as a divine attribute.</p>

            <label class="filter-checkbox derived-filter">
                <input type="checkbox" bind:checked={$filterDerived} />
                <span><b>Derived from the Holy Qur'an</b> — 40 names (40.4%)</span>
            </label>
            <p class="filter-description">The name is drawn from divine attributes or descriptions found in verses, though not stated as a name directly.</p>

            <label class="filter-checkbox hadith-filter">
                <input type="checkbox" bind:checked={$filterHadith} />
                <span><b>Mentioned in Sahih Hadith</b> — 4 names (4.0%)</span>
            </label>
            <p class="filter-description">The name appears in authenticated prophetic traditions but not in the Holy Qur'an.</p>
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
    <div class="carried-names-section">
        {#if $language === 'Arabic'}
            <h2 class="section-title-ar">الأسماء التي حملناها قبل أن نعرفها</h2>
            <p class="ArabicText">
                لكن الأغنية لم تكن في الحقيقة أول لقاء لنا بهذه الأسماء. فقبل أن نحفظها بصوت لطفي بوشناق بوقت طويل، كنا محاطين بها بالفعل — منسوجة في نسيج حياتنا اليومية من خلال أسماء الناس من حولنا.
                <br><br>
                في تونس، كما في جميع أنحاء العالم العربي والإسلامي، تعيش كثير من هذه الأسماء في الناس الذين نعرفهم. النمط بسيط: عبد، بمعنى "خادم" أو "عبد"، يليه أحد أسماء الله الحسنى. هكذا نحصل على أسماء مثل:
            </p>

            {#if currentPerson && currentPerson.personAr}
                <div class="name-breakdown">
                    <div class="name-formula" style="direction: rtl;">
                        <span class="abd-fixed-ar">عبد</span>
                        <span class="plus-sign">+</span>
                        <span class="name-variable-ar">{currentPerson.arabicName}</span>
                    </div>
                    {#if currentPerson.link}
                        <a href={currentPerson.link} target="_blank" rel="noopener noreferrer" class="person-name-ar">{currentPerson.personAr}</a>
                    {:else}
                        <div class="person-name-ar">{currentPerson.personAr}</div>
                    {/if}
                    <div class="person-desc-ar">{currentPerson.descAr}</div>
                </div>
            {/if}

            <p class="ArabicText">
                هذه ليست مجرد أسماء — إنها إعلانات عبودية وتواضع، تذكير بأننا ننتمي لشيء أعظم. في كل مرة تنادي شخصاً باسمه، فإنك تستحضر إحدى صفات الله.
                <br><br>
                لكن هنا يصبح الأمر مثيراً للاهتمام: ليس كل اسم يبدأ بـ"عبد" في تونس يقابل أحد الأسماء الحسنى التسعة والتسعين المتفق عليها.
                <br><br>
                خذ مثلاً عبد الستار، وهو اسم تونسي شائع. الستار (المُستتِر) يُستخدم على نطاق واسع، لكنه في الواقع ليس ضمن القائمة المتفق عليها للأسماء التسعة والتسعين. إنه مشتق من صفة الله في ستر الذنوب، الموجودة في الأحاديث والتراث الإسلامي، لكنه لم يدخل في التعداد القانوني. ومع ذلك، ظل التونسيون يسمون أبناءهم عبد الستار لأجيال، ويتعاملون معه كما لو كان كذلك.
                <br><br>
                هذا يكشف شيئاً عميقاً: الأسماء الحسنى ليست مجرد قائمة ثابتة — إنها تقليد حي، شكّلته الثقافة والعلم والممارسة الشعبية. ما يتناقشه العلماء، حسمته العائلات بالفعل. ما يظهر في قائمة أحد التقاليد قد يغيب عن قائمة أخرى — لكن الاسم يعيش في جد أحدهم أو عمه أو جاره.
                <br><br>
                بعض الأسماء، من ناحية أخرى، تظهر في قائمة التسعة والتسعين لكنها نادراً ما تُستخدم كأسماء شخصية — أسماء مثل القهار أو المميت. لن تجد كثيراً من الأطفال التونسيين يحملون اسم عبد القهار أو عبد المميت. هناك مصفاة ثقافية ضمنية: بعض الصفات تبدو ثقيلة جداً، شديدة جداً، لتُوضع على طفل.
                <br><br>
                وهناك أيضاً الأسماء المستقلة — أسماء الله التي أصبحت أسماء شخصية دون بادئة "عبد":
                <br><br>
                رحمان (رغم أنه أقل شيوعاً من عبد الرحمن)
                <br>
                كريم (الكريم) — يُستخدم على نطاق واسع كاسم مستقل
                <br>
                عزيز (العزيز)
                <br>
                حكيم (الحكيم)
                <br><br>
                هذه تحمل نفس الثقل، نفس الصدى المقدس، حتى بدون الإعلان الصريح عن العبودية.
                <br><br>
                إذن قبل الأغنية، قبل القائمة الرسمية، قبل أن أفكر يوماً في إحصاء عدد مرات ظهور كل اسم في القرآن — كنت أعرفها بالفعل. عرفتها في وجوه الجيران وزملاء الدراسة والأقارب. عرفتها في نداء الحضور في المدرسة، في بطاقات الأعراس، في الأسماء المنقوشة على شواهد القبور.
                <br><br>
                الأسماء لم تكن مجردة. كانت أشخاصاً.
                <br><br>
                وربما هذا هو الجزء الأجمل: هذه الأسماء لا تصف الله فحسب — بل تعيش بيننا، في الهويات التي نحملها، في الأشخاص الذين نصبحهم. في كل مرة يقدم أحدهم نفسه باسم عبد الرحمن، فهو يذكّرك — ويذكّر نفسه — بالرحمة الإلهية. كل عبد العزيز هو استحضار حي للعزة. كل كريم يجسّد الكرم، سواء ارتقى إليه أم لا.
                <br><br>
                الأسماء الحسنى ليست مجرد قائمة للحفظ. إنها خريطة لكيف نرى الإلهي — وكيف نسمّي أنفسنا في علاقتنا به.
            </p>
        {:else}
            <h2 class="section-title-en">The Names We Carried Before We Knew Them</h2>
            <p class="EnglishText">
                But the song wasn't actually our first encounter with these Names. Long before we memorized them through Lotfi Bouchnak's voice, we were already surrounded by them—woven into the fabric of our daily lives through the names of people around us.
                <br><br>
                In Tunisia, as across the Arab and Muslim world, many of these Names live on in the people we know. The pattern is simple: Abd (عبد) or Abdul (عبد ال), meaning "servant of" or "slave of," followed by one of Allah's Names. This is how we get names like:
            </p>

            {#if currentPerson && currentPerson.personEn}
                <div class="name-breakdown">
                    <div class="name-formula">
                        <span class="abd-fixed">Abdul</span>
                        <span class="plus-sign">+</span>
                        <span class="name-variable">{currentName.englishName}</span>
                    </div>
                    {#if currentPerson.link}
                        <a href={currentPerson.link} target="_blank" rel="noopener noreferrer" class="person-name-en">{currentPerson.personEn}</a>
                    {:else}
                        <div class="person-name-en">{currentPerson.personEn}</div>
                    {/if}
                    <div class="person-desc-en">{currentPerson.descEn}</div>
                </div>
            {/if}

            <p class="EnglishText">
                These aren't just names—they're declarations of servitude and humility, reminders that we belong to something greater. Every time you call someone by their name, you're invoking one of Allah's attributes.
                <br><br>
                But here's where it gets interesting: not every "Abd" name in Tunisia corresponds to one of the canonical 99 Names.
                <br><br>
                Take Abdessattar (عبد الستار), a common Tunisian name. As-Sattar (الستار—the Concealer) is widely used, but it's actually not on the agreed-upon list of 99 Names. It's derived from Allah's attribute of concealing sins, found in hadith and Islamic tradition, but it didn't make the canonical enumeration. Yet Tunisians have been naming their sons Abdessattar for generations, treating it as if it were.
                <br><br>
                This reveals something profound: the 99 Names aren't just a fixed list—they're a living tradition, shaped by culture, scholarship, and popular practice. What scholars debate, families have already decided. What appears in one tradition's list may be absent from another's—but the name lives on in someone's grandfather, uncle, or neighbor.
                <br><br>
                Some Names, on the other hand, appear in the list of 99 but are rarely used as given names—names like Al-Qahhar (القهار—the Subduer) or Al-Mumit (المميت—the Bringer of Death). You won't find many Tunisian children named Abdelqahhar or Abdelmumit. There's an implicit cultural filter: some attributes feel too overwhelming, too severe, to place on a child.
                <br><br>
                And then there are the standalone names—Names of Allah that have become first names without the "Abd" prefix:
                <br><br>
                Rahman (though less common than Abderrahman)
                <br>
                Karim (the Generous)—used widely as a standalone name
                <br>
                Aziz (the Mighty)
                <br>
                Hakim (the Wise)
                <br><br>
                These carry the same weight, the same sacred resonance, even without the explicit declaration of servitude.
                <br><br>
                So before the song, before the formalized list, before I ever thought to count how many times each Name appeared in the Qur'an—I already knew them. I knew them in the faces of neighbors, classmates, relatives. I knew them in the roll call at school, in wedding invitations, in the names etched on gravestones.
                <br><br>
                The Names weren't abstract. They were people.
                <br><br>
                And maybe that's the most beautiful part: these Names don't just describe Allah—they live among us, in the identities we carry, the people we become. Every time someone introduces themselves as Abderrahman, they're reminding you—and themselves—of divine mercy. Every Abdelaziz is a walking invocation of might. Every Karim embodies generosity, whether they live up to it or not.
                <br><br>
                The 99 Names aren't just a list to memorize. They're a map of how we see the divine—and how we name ourselves in relation to it.
            </p>
        {/if}
    </div>
</body>

<body>
    <div class="conclusion-section">
        {#if $language === 'Arabic'}
            <h2 class="section-title-ar">الخَاتِمَةُ وَالْمَرَاجِع</h2>
            <p class="ArabicText">
                بدأ هذا المشروع كرحلة شخصية — فرصة لإعادة التواصل مع الأسماء التي حفظتها في طفولتي ولفهمها بشكل أعمق، روحياً وتقنياً. كانت أيضاً فرصة لتجربة SVGs والتصور البياني كأدوات لاستكشاف المعنى.
                <br><br>
                ما فاجأني أكثر هو اكتشاف أن ليس كل اسم في القائمة يظهر مباشرة في القرآن — وأنه لا يوجد حديث صحيح واحد يسرد جميع الأسماء التسعة والتسعين. الأحاديث التي تعددها مصنفة كضعيفة من قبل علماء الحديث. هذا لا يقلل من الأهمية الروحية للأسماء، لكنه يكشف شيئاً مهماً: القائمة التي نحفظها عن ظهر قلب هي نتيجة قرون من التفسير العلمي، تجمع الأسماء من القرآن وأدب الحديث والصفات الإلهية المذكورة في سياقات مختلفة.
                <br><br>
                فهم هذا التمييز لا يقلل من جمال القائمة — بل يعمقه، مذكراً إيانا بأن التقليد الإسلامي مبني على الوحي والجهد العلمي عبر الأجيال.
                <br><br>
                أشارك هذا خلال رمضان — نفس الشهر الذي أصبحت فيه هذه الأسماء جزءاً من ذاكرتي، تُغنى في الخلفية بينما نحضر الإفطار. يبدو أنه الوقت المناسب لإعادة زيارتها بعيون جديدة وفضول أعمق.
                <br><br>
                في النهاية، هذا ليس عن تصحيح فهم أي شخص. إنه عن التوقف للسؤال من أين يأتي شيء عرفناه دائماً، وإيجاد طرق جديدة لتقديره.
                <br><br>
                هذا مشروع تعليمي، وأرحب بأفكاركم. إذا لاحظتم شيئاً يمكن توضيحه، أو لديكم رؤى علمية للمشاركة، أو ببساطة تريدون التأمل في تجربتكم الخاصة مع هذه الأسماء، يسعدني أن أسمع منكم.
            </p>

            <div class="sources-columns-ar">
                <div class="source-col-ar">
                    <h3 class="subsection-title-ar">مصادر البيانات</h3>
                    <p class="ArabicText">
                        <b><a href="https://github.com/risan/quran-json/tree/main" target="_blank" class="source-link">Qur'an JSON</a>:</b> استُخدم للنص القرآني والترجمة الإنجليزية وحساب تكرار كل اسم
                        <br>
                        <b><a href="https://learn-islam.org/allah-names" target="_blank" class="source-link">LearnIslam</a> و <a href="https://myislam.org/99-names-of-allah/" target="_blank" class="source-link">MyIslam</a>:</b> مراجع لأوصاف الأسماء وأصولها (ذكر قرآني مباشر، صفة مشتقة، أو مبني على الحديث)
                    </p>
                </div>
                <div class="source-col-ar">
                    <h3 class="subsection-title-ar">الأصول المرئية</h3>
                    <p class="ArabicText">
                        الأعمال الفنية المستخدمة في هذا المقال لم أصنعها — قمت بتحويل التصاميم الموجودة إلى صيغة SVG للاستخدام التفاعلي.
                        <br>
                        <a href="https://www.pinterest.com/pin/37717715626215055/" target="_blank" class="source-link">الخلفية</a> | <a href="https://www.pinterest.com/pin/257690409908415932/" target="_blank" class="source-link">فن الأسماء</a>
                    </p>
                </div>
            </div>

            <h3 class="subsection-title-ar">ملاحظة منهجية</h3>
            <p class="ArabicText">
                تصنيف الأسماء (مذكور / مشتق / حديث) يتبع المنح الإسلامية المرجعية الشائعة لكنه ليس متفقاً عليه عالمياً. القراء المهتمون بنقاش لاهوتي أعمق مدعوون لاستشارة التفسير الكلاسيكي وأدب الحديث.
            </p>
        {:else}
            <h2 class="section-title-en">Conclusion & References</h2>
            <p class="EnglishText">
                This project began as a personal journey—a chance to reconnect with the Names I memorized as a child and to understand them more deeply, both spiritually and technically. It was also an opportunity to experiment with SVGs and data visualization as tools for exploring meaning.
                <br><br>
                What surprised me most was learning that not every name on the list appears directly in the Qur'an—and that there is no single authentic hadith that lists all 99 names. The hadiths that do enumerate them are classified as da'if (weak) by hadith scholars. This doesn't diminish the spiritual significance of the Names, but it does reveal something important: the list we know by heart is the result of centuries of scholarly interpretation, compiling names from across the Qur'an, hadith literature, and divine attributes mentioned in various contexts.
                <br><br>
                Understanding this distinction doesn't diminish the beauty of the list—it deepens it, reminding us that Islamic tradition is built on both revelation and scholarly effort across generations.
                <br><br>
                I'm sharing this during Ramadan—the same month when these Names first became part of my memory, sung in the background while we prepared iftar. It feels like the right time to revisit them with fresh eyes and a deeper curiosity.
                <br><br>
                Ultimately, this isn't about correcting anyone's understanding. It's about pausing to ask where something we've always known actually comes from, and finding new ways to appreciate it.
                <br><br>
                This is a learning project, and I welcome your thoughts. If you notice something that could be clarified, have scholarly insights to share, or simply want to reflect on your own experience with these Names, I'd love to hear from you.
            </p>

            <div class="sources-columns">
                <div class="source-col">
                    <h3 class="subsection-title-en">Data Sources</h3>
                    <p class="EnglishText">
                        <b><a href="https://github.com/risan/quran-json/tree/main" target="_blank" class="source-link">Qur'an JSON</a>:</b> Used for Holy Qur'anic text, English translation, and calculating the frequency of each name
                        <br>
                        <b><a href="https://learn-islam.org/allah-names" target="_blank" class="source-link">LearnIslam</a> and <a href="https://myislam.org/99-names-of-allah/" target="_blank" class="source-link">MyIslam</a>:</b> Referenced for descriptions of the Names and their origins (direct Holy Qur'anic mention, derived attribute, or hadith-based)
                    </p>
                </div>
                <div class="source-col">
                    <h3 class="subsection-title-en">Visual Assets</h3>
                    <p class="EnglishText">
                        The artwork used in this article was not created by me—I converted existing designs into SVG format for interactive use.
                        <br>
                        <a href="https://www.pinterest.com/pin/37717715626215055/" target="_blank" class="source-link">Background</a> | <a href="https://www.pinterest.com/pin/257690409908415932/" target="_blank" class="source-link">All Names Art</a>
                    </p>
                </div>
            </div>

            <h3 class="subsection-title-en">Methodology Note</h3>
            <p class="EnglishText">
                The classification of names (Mentioned / Derived / Hadith) follows commonly referenced Islamic scholarship but is not universally agreed upon. Readers interested in deeper theological discussion are encouraged to consult classical tafsir and hadith literature.
            </p>
        {/if}
    </div>
</body>

<svelte:body use:style={"background-color: #FDEEDB;"} />



<style>
    @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Funnel+Display:wght@300..800&family=Quicksand:wght@300..700&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Amiri+Quran&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap');

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

        .Reference{
        color: #FEEEDB;
        background-color: #AC8B7E;
        text-align: center;
        margin-top: 0;
        margin-bottom: 0;
        font-weight: 500;
        font-family: "Quicksand", sans-serif;
        font-size: 1vw;
        display: inline-block; /* makes background span only the text */
        padding: 0.3vw 1vw; /* add some padding around text */
    }

    .reference-wrapper {
        text-align: center;
        width: 100%;
    }

    .ENTitle{
         font-family: 'JawiKufi';
         background-color: #266F8C;
         padding-top: 2%;
         color: #FEEEDB;
         font-size: 4vw;
    }

    .ArTitle{
        font-family: 'NotoKufiArabic', sans-serif;
        font-weight: 600;
        background-color: #266F8C;
        color: #FEEEDB;
        margin-top: 5%;
        font-size: 2vw;
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
        justify-content: space-between;
        gap: 2rem;
        background-color: #FDEEDB;
        padding: 0.5rem 4rem 0.5rem 2rem; /* more padding on right */
        z-index: 1000;
        box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.15);
        margin: 0;
        height: auto;
        min-height: 80px;
        box-sizing: border-box;
    }

    .rank-display-sticky {
        flex: 0 0 80px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
    }

    .player-wrapper {
        flex: 1;
        display: flex;
        justify-content: center;
        max-width: 40vw;
    }

    .player-wrapper :global(.player-container) {
        max-width: none;
        padding: 0.5rem 0;
        margin: 0;
        width: 100%;
    }

    .name-display-sticky {
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        min-width: 150px;
    }

    .current-name-sticky-arabic {
        font-family: 'NotoKufiArabic', sans-serif;
        font-weight: 700;
        font-size: 2rem;
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
        font-size: 3rem;
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
        font-size: 2.5rem;
        color: #8B7355; /* darker brown shade */
        flex-shrink: 0;
    }

   .language-buttons {
    position: sticky;
    top: 0; /* This is essential for sticky to work */
    left:0;
    display: flex;
    gap: 1vw; /* 1rem */
    margin-bottom: 2vw; /* 2rem */
    padding: 3vw; /* Add some padding for better appearance */
    z-index: 100; /* Ensures buttons stay on top of other content */
}

  .language-buttons2 {
    position: fixed;
    top: 1vw;
    right: 2vw;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.5vw; /* 0.5rem */
    z-index: 1000;
    padding: 0.5vw;
}

  .language-label-english {
    margin: 0 0 0.3vw 0; /* 0 0 0.3rem 0 */
    font-size: 2vw;
    color: #266F8C;
    font-family: 'JawiKufi', sans-serif;
  }

  .language-label-arabic {
    margin: 0 0 0.3vw 0; /* 0 0 0.3rem 0 */
    font-size: 1.7vw;
    color: #266F8C;
    font-family: 'NotoKufiArabic', sans-serif;
    direction: rtl;
  }

  .language-buttons2 button {
    padding: 0.5vw 1vw; /* 0.5rem 1rem */
    font-size: 2vw;
    border-radius: 0.3vw; /* 5px */
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .language-buttons2 button.active {
    background-color: #266F8C;
    color: #FDEEDB;
    border-color: #266F8C;
  }

  .lang-full {
    display: inline;
  }

  .lang-short {
    display: none;
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
   border: 0.125vw solid #FDEDDB; /* 2px */

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
         font-weight: 900;
        font-size: 1.1vw;
        text-align: center;
        color:#276F8C ;
        justify-items: center;
        direction: ltr;
    }

    .conclusion-section {
        /* margin-top: 8%; */
        margin-bottom: 15%;
        padding: 3vw 0; /* 3rem 0 */
    }

    .carried-names-section {
        margin-bottom: 5%;
        padding: 3vw 0;
    }

    .name-breakdown {
        text-align: center;
        padding: 3vw 0;
        margin: 2vw 0;
    }

    .name-formula {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1.5vw;
        margin-bottom: 1.5vw;
    }

    .abd-fixed,
    .name-variable {
        font-family: 'JawiKufi', sans-serif;
        font-size: 5vw;
        font-weight: 700;
        color: #266F8C;
    }

    .abd-fixed-ar,
    .name-variable-ar {
        font-family: 'NotoKufiArabic', sans-serif;
        font-size: 6vw;
        font-weight: 700;
        color: #266F8C;
        direction: rtl;
    }

    .plus-sign {
        font-family: 'JawiKufi', sans-serif;
        font-size: 3.5vw;
        font-weight: 400;
        color: #266F8C;
    }

    .person-name-ar {
        font-family: 'NotoKufiArabic', sans-serif;
        font-size: 1.8vw;
        font-weight: 700;
        color: #266F8C;
        direction: rtl;
        margin-bottom: 0.5vw;
        display: block;
        text-decoration: none;
    }

    a.person-name-ar:hover {
        text-decoration: underline;
    }

    .person-desc-ar {
        font-family: 'NotoKufiArabic', sans-serif;
        font-size: 1.5vw;
        font-weight: 500;
        color: #AC8B7E;
        direction: rtl;
    }

    .person-name-en {
        font-family: 'JawiKufi', sans-serif;
        font-size: 2.5vw;
        font-weight: 700;
        color: #266F8C;
        direction: ltr;
        margin-bottom: 0.5vw;
        display: block;
        text-decoration: none;
    }

    a.person-name-en:hover {
        text-decoration: underline;
    }

    .person-desc-en {
        font-family: "Quicksand", sans-serif;
        font-size: 1.5vw;
        font-weight: 700;
        color: #AC8B7E;
        direction: ltr;
    }

    .section-title-ar {
        font-family: 'NotoKufiArabic', sans-serif;
        font-size: 2vw;
        font-weight: 700;
        background-color: #266F8C;
        color: #FEEEDB;
        text-align: center;
        margin-bottom: 2vw; /* 2rem */
        direction: rtl;
    }

    .section-title-en {
        font-family: 'JawiKufi', sans-serif;
        font-size: 3vw;
        font-weight: 700;
        background-color: #266F8C;
        padding-top:2%;
        color: #FEEEDB;
        text-align: center;
        margin-bottom: 2vw; /* 2rem */
    }

    .subsection-title-ar {
        color: #FEEEDB;
        background-color: #AC8B7E;
        text-align: center;
        margin-top: 2vw;
        margin-bottom: 0.3vw;
        margin-left: auto;
        margin-right: auto;
        font-weight: 500;
        font-family: 'NotoKufiArabic', sans-serif;
        font-size: 1vw;
        display: block;
        width: fit-content;
        padding: 0.3vw 1vw;
        direction: rtl;
    }

    .sources-columns {
        display: flex;
        gap: 3vw;
        margin: 2vw 0;
    }

    .source-col {
        flex: 1;
        text-align: center;
    }

    .sources-columns-ar {
        display: flex;
        flex-direction: row-reverse;
        gap: 3vw;
        margin: 2vw 0;
    }

    .source-col-ar {
        flex: 1;
        text-align: center;
    }

    .source-link {
        color: #266F8C;
        text-decoration: underline;
        transition: color 0.2s;
    }

    .source-link:hover {
        color: #AC8B7E;
    }

    .subsection-title-en {
        color: #FEEEDB;
        background-color: #AC8B7E;
        text-align: center;
        margin-top: 2vw;
        margin-bottom: 0.3vw;
        margin-left: auto;
        margin-right: auto;
        font-weight: 500;
        font-family: "Quicksand", sans-serif;
        font-size: 1vw;
        display: block;
        width: fit-content;
        padding: 0.3vw 1vw;
    }

    /* .conclusion-section .ArabicText {
        font-size: 1.2vw;
        line-height: 1.8;
        text-align: justify;
    }

    .conclusion-section .EnglishText {
        font-size: 1.2vw;
        line-height: 1.8;
        text-align: justify;
    } */

    .video-container {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 4vw 0; /* 4rem 0 */
        padding: 0;
    }

    .names-video {
        width: 100%;
        max-width: 50vw; /* 800px */
        height: auto;
        border: 0.5vw solid #266F8C; /* 8px */
        border-radius: 0.5vw; /* 8px */
        box-shadow: 0 0.25vw 0.75vw rgba(38, 111, 140, 0.3); /* 0 4px 12px */
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
        margin: 2vw 0; /* 2rem 0 */
        line-height: 1.8;
    }

    /* English Description */
    .description-english {
        font-family: 'Nunito', sans-serif;
        font-size: 1.4vw;
        direction: ltr;
        text-align: center;
        color: #603D25;
        margin: 2vw 0; /* 2rem 0 */
        line-height: 1.8;
    }

    /* Source Information */
    .source-info {
        margin-top: 2vw; /* 2rem */
        width: 100%;
    }

    .source-columns {
        display: flex;
        justify-content: center;
        gap: 2vw; /* 2rem */
        margin-bottom: 2vw; /* 2rem */
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
        margin: 2vw 0; /* 2rem 0 */
    }

    .carousel-content {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1vw; /* 1rem */
        position: relative;
    }

    .carousel-arrow {
        width: 3.125vw; /* 50px */
        height: 3.125vw; /* 50px */
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
        width: 1.5vw; /* 24px */
        height: 1.5vw; /* 24px */
        color: #FDEDDB;
    }

    .verse-container {
        flex: 1;
        max-width: 50vw; /* 800px */
        background-color: rgba(38, 111, 140, 0.05);
        padding: 2vw; /* 2rem */
        border-radius: 0.75vw; /* 12px */
        border: 0.125vw solid #266F8C; /* 2px */
    }

    .verse-container-hadith {
        flex: 1;
        max-width: 50vw; /* 800px */
        background-color: rgba(128, 90, 168, 0.05);
        padding: 2vw; /* 2rem */
        border-radius: 0.75vw; /* 12px */
        border: 0.125vw solid #805AA8; /* 2px */
    }

    .verse-container-derived {
        flex: 1;
        max-width: 50vw; /* 800px */
        background-color: rgba(76, 140, 76, 0.05);
        padding: 2vw; /* 2rem */
        border-radius: 0.75vw; /* 12px */
        border: 0.125vw solid #4C8C4C; /* 2px */
    }

    .quran-text {
        font-family: 'KFGQPCUthmanicScriptHAFS', 'Amiri Quran', serif !important;
        font-weight: 400;
        font-size: 1.8vw;
        direction: rtl;
        text-align: center;
        color: #603D25;
        line-height: 2.5;
        margin: 0 0 1.5vw 0; /* 0 0 1.5rem 0 */
    }

    .quran-text :global(.highlighted-name) {
        font-weight: 700;
        color: #266F8C;
        background-color: rgba(171, 138, 126, 0.2);
        padding: 0.2vw 0.4vw; /* 0.2em 0.4em */
        border-radius: 0.25vw; /* 4px */
    }

    .verse-reference {
        font-family: 'NotoKufiArabic', sans-serif;
        font-size: 1.4vw;
        direction: rtl;
        text-align: center;
        color: #266F8C;
        margin: 0.5vw 0; /* 0.5rem 0 */
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
        margin: 0.5vw 0 0 0; /* 0.5rem 0 0 0 */
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
        gap: 1vw; /* 1rem */
        margin: 2vw 0; /* 2rem 0 */
        padding: 1.5vw; /* 1.5rem */
        background-color: rgba(171, 138, 126, 0.1);
        border-radius: 0.5vw; /* 8px */
    }

    .filter-checkbox {
        display: flex;
        align-items: center;
        gap: 0.75vw; /* 0.75rem */
        padding: 0.75vw 1vw; /* 0.75rem 1rem */
        border-radius: 0.375vw; /* 6px */
        cursor: pointer;
        transition: all 0.2s;
        font-family: 'Nunito', sans-serif;
        font-size: 1.1vw; /* 1.1rem */
        font-weight: 500;
        direction: ltr;
        text-align: left;
    }

    .filter-checkbox:hover {
        transform: translateX(0.3vw); /* 5px */
    }

    .quran-filter {
        background-color: rgba(62, 139, 169, 0.15); /* Teal blue */
        border: 0.125vw solid #3E8BA9; /* 2px */
    }

    .quran-filter:hover {
        background-color: rgba(62, 139, 169, 0.25);
    }

    .derived-filter {
        background-color: rgba(4, 120, 87, 0.15); /* Emerald green */
        border: 0.125vw solid #047857; /* 2px */
    }

    .derived-filter:hover {
        background-color: rgba(4, 120, 87, 0.25);
    }

    .hadith-filter {
        background-color: rgba(194, 69, 45, 0.15); /* Terracotta/rust */
        border: 0.125vw solid #C2452D; /* 2px */
    }

    .hadith-filter:hover {
        background-color: rgba(194, 69, 45, 0.25);
    }

    .filter-checkbox input[type="checkbox"] {
        width: 1.25vw; /* 20px */
        height: 1.25vw; /* 20px */
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
        gap: 1vw; /* 1rem */
        margin: 2vw 0; /* 2rem 0 */
        padding: 1.5vw; /* 1.5rem */
        background-color: rgba(171, 138, 126, 0.1);
        border-radius: 0.5vw; /* 8px */
        direction: rtl;
    }

    .filter-checkbox-arabic {
        display: flex;
        align-items: center;
        gap: 0.75vw; /* 0.75rem */
        padding: 0.75vw 1vw; /* 0.75rem 1rem */
        border-radius: 0.375vw; /* 6px */
        cursor: pointer;
        transition: all 0.2s;
        font-family: 'NotoKufiArabic', sans-serif;
        font-size: 1.1vw; /* 1.1rem */
        font-weight: 500;
        direction: rtl;
    }

    .filter-checkbox-arabic:hover {
        transform: translateX(-0.3vw); /* -5px */
    }

    .filter-checkbox-arabic input[type="checkbox"] {
        width: 1.25vw; /* 20px */
        height: 1.25vw; /* 20px */
        cursor: pointer;
        accent-color: #603D25;
    }

    .filter-checkbox-arabic span {
        color: #603D25;
    }

    /* Filter Description Styles */
    .filter-description {
        font-family: 'Nunito', sans-serif;
        font-size: 0.95vw;
        color: #603D25;
        margin: 0 0 0.5vw 2vw;
        padding: 0;
        font-style: italic;
        opacity: 0.85;
        direction: ltr;
        text-align: left;
    }

    .filter-description-arabic {
        font-family: 'NotoKufiArabic', sans-serif;
        font-size: 0.95vw;
        color: #603D25;
        margin: 0 2vw 0.5vw 0;
        padding: 0;
        direction: rtl;
        text-align: right;
        font-style: normal;
        opacity: 0.85;
    }


    	@media (max-width: 768px) {

        body {
            margin-right: 10vw;
            margin-left: 10vw
        }

        .ArabicText {
            font-size: 2.5vw; /* was 1vw */
        }

        .EnglishText {
            font-size: 2.5vw; /* was 1.1vw */
        }

        p {
            font-size: 2.5vw; /* was 1vw */
        }

        /* Current name display */
        .english-name {
            font-size: 6vw; /* was 5vw */
        }

        .arabic-name {
            font-size: 5vw; /* was 2.5vw */
        }

        .english-mean {
            font-size: 5vw; /* was 4vw */
        }

        /* Description sections */
        .description-arabic {
            font-size: 2.5vw; /* was 1.4vw */
        }

        .description-english {
            font-size: 2.5vw; /* was 1.4vw */
        }

        /* Source labels */
        .source-label {
            font-size: 3vw; /* was 2vw */
        }

        .source-label-english {
            font-size: 3vw; /* was 2vw */
        }

        .frequency-text {
            font-size: 3vw; /* was 2vw */
        }

        .frequency-text-english {
            font-size: 3vw; /* was 2vw */
        }

        /* Carousel / Quran verse */
        .quran-text {
            font-size: 3vw; /* was 1.8vw */
        }

        .verse-reference {
            font-size: 2.5vw; /* was 1.4vw */
        }

        .verse-counter {
            font-size: 2.5vw; /* was 1.2vw */
        }

        .carousel-arrow {
            width: 6vw; /* was 3.125vw */
            height: 6vw; /* was 3.125vw */
        }

        .carousel-arrow svg {
            width: 3vw; /* was 1.5vw */
            height: 3vw; /* was 1.5vw */
        }

        /* Filter checkboxes */
        .filter-checkbox {
            font-size: 2.5vw; /* was 1.1vw */
            padding: 1.5vw 2vw;
        }

        .filter-checkbox-arabic {
            font-size: 2.5vw; /* was 1.1vw */
            padding: 1.5vw 2vw;
        }

        .filter-checkbox input[type="checkbox"],
        .filter-checkbox-arabic input[type="checkbox"] {
            width: 3vw;
            height: 3vw;
        }

        .filter-description {
            font-size: 2vw;
            margin: 0 0 1vw 3vw;
        }

        .filter-description-arabic {
            font-size: 2vw;
            margin: 0 3vw 1vw 0;
        }

        .lang-full {
            display: none;
        }

        .lang-short {
            display: inline;
        }

        .sources-columns,
        .sources-columns-ar {
            flex-direction: column;
        }

        /* Mobile language buttons */
        .language-buttons2 {
            top: 2vw;
            right: 3vw;
            gap: 1.5vw;
        }

        .language-buttons2 button {
            padding: 1.5vw 2.5vw;
            font-size: 4vw;
            border-radius: 1vw;
        }

        /* Mobile player */
        .player-sticky-container {
            padding: 1.5rem 2rem;
            min-height: 100px;
        }

        .player-wrapper {
            max-width: 60vw;
        }

        .name-rank {
            font-size: 5vw;
        }

        .current-name-sticky-arabic {
            font-size: 4vw;
        }

        .current-name-sticky-english {
            font-size: 5vw;
        }

      }
</style>