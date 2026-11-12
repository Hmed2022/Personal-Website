<script>
    // @ts-ignore
    // @ts-ignore
    import Map from "./Data Viz/Map/Map.svelte"
    import Footer from "../../components/footer.svelte";
    // import Title from "./Assets/Tunisian Banknotes.svg"
    import Timeline from "./Data Viz/Timeline/Timeline.svelte";            // original timeline (kept)
    import TimelineVintage from "./Data Viz/Timeline/TimelineVintage.svelte";
    import Beeswarm from "./Data Viz/Beesawarm/Graph.svelte";              // previous version (kept)
    import PortraitStory from "./Data Viz/Beesawarm/PortraitStory.svelte";
    // import Landmarks from "./Data Viz/Landmarks.svelte";
    import Color from "./Data Viz/Color/Color.svelte";                     // previous version (kept)
    import ColorGame from "./Data Viz/Color/ColorGame.svelte";
    import Scatter from "./Data Viz/Scatter/Scatter.svelte";               // previous version (kept)
    import SizeChart from "./Data Viz/Scatter/SizeChart.svelte";
    import Title from "./Components/Title.svelte"                 // previous animated title (kept)
    import TitlePortraits from "./Components/TitlePortraits.svelte"
    // @ts-ignore
    import Landmark from "./Data Viz/Landmarks/Landmark.svelte"            // previous explorer (kept)
    import LandmarkExplorer from "./Data Viz/Landmarks/LandmarkExplorer.svelte"
    import Landmarks from "./Components/Landmarks.svelte"

    // @ts-ignore
    import Propaganda from "./Components/Propaganda.svelte"              // previous version (kept)
    import ErasChanges from "./Components/ErasChanges.svelte"
    import NumeralsWipe from "./Components/NumeralsWipe.svelte"
    import LangSwitch from "./Components/LangSwitch.svelte"
    import NoteViewSwitch from "./Components/NoteViewSwitch.svelte"
    import CountryByEra from "./Data Viz/Landmarks/CountryByEra.svelte"
    import DinarValue from "./Data Viz/Timeline/DinarValue.svelte"
    import Conclusion from "./Components/Conclusion.svelte"
    import NoteLifespans from "./Data Viz/Timeline/NoteLifespans.svelte"
    import ChapterNav from "./Components/ChapterNav.svelte"   // (floating chapter menu: removed, the notebook navigates now)
    import Notebook from "./Components/Notebook.svelte"
    import TopicEnd from "./Components/TopicEnd.svelte"
    import BackToBinder from "./Components/BackToBinder.svelte"
    import { tick } from "svelte"
    // the notebook's questions, in the order they're listed (each opens one part of the story)
    const TOPICS = [
        { id: 'eras', q: 'pErasSameNote', short: 'nbT_eras' },
        { id: 'vivid', q: 'pVividNote', short: 'nbT_vivid' },
        { id: 'sizes', q: 'pSizeNote', short: 'nbT_sizes' },
        { id: 'faces', q: 'pFacesNote', short: 'nbT_faces' },
        { id: 'land', q: 'lmQuestion', short: 'nbT_land' },
        { id: 'country', q: 'insCountryNote', short: 'nbT_country' },
        { id: 'worth', q: 'pWorthNote', short: 'nbT_worth' },
        { id: 'end', q: 'nbBye', short: '' },
    ];
    let open = null, read = {}, topicEl, hubEl;
    // the goodbye ("Thanks, Dali!") only shows up once every question has been asked
    $: allRead = TOPICS.every((x) => x.id === 'end' || read[x.id]);
    async function pick(id) {
        if (!id) return;
        open = id; read = { ...read, [id]: true };
        await tick();
        topicEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // next unread question in list order (the goodbye last); null when there's nothing left
    const nextOf = (cur) => (TOPICS.find((x) => x.id !== cur && x.id !== 'end' && !read[x.id]) || (cur !== 'end' ? TOPICS[TOPICS.length - 1] : null))?.id;
    function backToNotebook() { hubEl?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    import Sources from "./Components/Sources.svelte"
    import Insight from "./Components/Insight.svelte"
    import { strayNote, sortedOnce, sortRequest } from "./Data Viz/Timeline/strayStore.js"
    // never sorted? Dali nudges you (with his own sort button); keep scrolling past him and the notebook shows up anyway
    let skipped = false, nudgeEl;
    function checkSkip() {
        if (!skipped && !$sortedOnce && nudgeEl && nudgeEl.getBoundingClientRect().bottom < innerHeight * 0.3) skipped = true;
    }
    function sortFromNudge() {
        document.querySelector('.timeline')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => sortRequest.update((n) => n + 1), 750);
    }   // the $20 / €20 joke from the binder
    import daliFull from "./Components/dali-full.svg"
    import { t, lang, dir } from "./i18n.js";

    let selectedLanguage = "english"; // Default to English

    function handleChange(event) {
    selectedLanguage = event.target.value;
    }

    import { style } from 'svelte-body';

    import TitleImg from "./Assets/Title-Tuninfo.png"

    // One background for the whole piece: warm paper with a very faint zellige tile pattern.
    import { zelligeFaint, divider } from "./Components/tunisianPatterns.js";
    const PAPER = "#FAF3E8";
    // Protect the images: no right-click menu ("Open image in new tab", "Save image as…"),
    // no dragging them into a new tab, no long-press menu on phones. This only discourages
    // casual copying; anyone determined can still use screenshots or the browser's dev tools.
    function isImage(el) {
        return el && (el.tagName === "IMG" || el.tagName === "image" || el.closest?.("img, svg image, .art, .wipe, .face, .card, .pic, .tip-img"));
    }
    function blockMenu(e) { if (isImage(e.target)) e.preventDefault(); }
    function blockDrag(e) { if (isImage(e.target)) e.preventDefault(); }

    const pageStyle = `background-color:${PAPER}; background-image:${zelligeFaint}; background-size:180px 180px; background-attachment:fixed; --tn-paper:${PAPER}; --tn-divider:${divider};`;
</script>
<!-- 
<p style="text-align:center"> Choose Language:</p> -->
<!-- <div class="lan">
    <p>
        Choose a Language
            <select bind:value={selectedLanguage} on:change={handleChange}>
          <option value="english">English</option>
          <option value="arabic">Arabic</option>
        </select>
    </p>
</div> -->


<NoteViewSwitch/>
<LangSwitch/>
<BackToBinder/>
<div class="tn-page" class:tn-ar={$lang === 'ar'} lang={$lang} dir={$dir}>
<div class="Title">
    <div class="svg">
        <!-- <Title/> previous animated title, kept -->
        <TitlePortraits/>
        <!-- <img class="TitleImg" src={TitleImg} alt="Title"/> static title image, kept -->
    </div>
    
    <!-- <img src="{Title}" alt="title" /> -->
    <!-- <h1> My name is Ahmed Bendaly</h1> -->
 
    <p class="introText">{@html $t('intro')}</p>
    <p class="introText second">{@html $t('intro2')}</p>
    <!-- meet Dali: Leghreeb (About page) in his dingri and chechia, beside how the piece works -->
    <div class="meet-dali">
        <img class="dali-full" src={daliFull} alt={$t('daliAlt')} draggable="false" />
        <Insight k="insHow" label="insHowLabel" noicon/>
    </div>
    <!-- <ChapterNav/> row of chapter links under the intro: removed (the floating menu stays) -->
</div>

<div class="prose centered">
    <h1 id="ch-timeline" class="chapter" style="--n:'01'">
        <span>{$t('hTimeline')}</span>  
    </h1>
    <!-- the binder introduces itself; the old timeline intro paragraph (pTimeline) is no longer shown -->
</div>



<div class="timeline">
    <!-- <Timeline/> original timeline, kept for reference -->
    <TimelineVintage/>
    </div>
<!-- the timeline's note + Dali's answer now live in the Bourguiba era story (TimelineVintage) -->

<!-- "How long does a note last?" is now the second view of the timeline (TimelineVintage), kept for reference:
<div class="prose">
    <h2><span>{$t('hLife')}</span></h2>
    <p>{$t('pLife')}</p>
</div>
<div class="wide"><NoteLifespans/></div>
<Insight k="insLife" note="insLifeNote" lens={['eco', 'pol']}/>
-->

{#if !$sortedOnce && !skipped}
<div class="sort-nudge" bind:this={nudgeEl}>
    <Insight k="nbSortNudge"/>
    <p class="sn"><button type="button" on:click={sortFromNudge}>{$t('bdSort')}</button></p>
</div>
{/if}
{#if $sortedOnce || skipped}
<!-- ===== your notebook: pick a question, Dali answers and that part opens (one at a time, any order) ===== -->
<div bind:this={hubEl}><Insight k={$sortedOnce ? 'nbNudge' : 'nbSkip'}/><Notebook items={allRead ? TOPICS : TOPICS.filter((x) => x.id !== 'end')} {read} {open} on:pick={(e) => pick(e.detail)}/></div>

{#if open === 'eras'}
<section class="topic" bind:this={topicEl}>
    <div class="prose">
        <h1 id="ch-eras" class="chapter" style="--n:'02'">
            <span>{$t('hEras')}</span>
        </h1>

    </div>
    <!-- if you kept the foreign note instead of giving it to Dali, he brings it up here -->
    <Insight k={$strayNote.choice === 'kept' ? ($strayNote.tag === '$20' ? 'pErasSameKeptUsd' : 'pErasSameKeptEur') : 'pErasSame'} />
    <Insight k="pEras0" note="pEras0Note"/>
    <div class="wide">
        <NumeralsWipe/>
    </div>
    <Insight k="pEras1" note="pEras1Note" lens={['pol']}/>
    <div class="wide">
        <ErasChanges/>
    </div>
    <Insight k="insEras" note="insErasNote" lens={['pol']}/>
    <div class="prose">
        <!-- previous version, kept:
        <div class="images">
            <div class="tounsi">
                <div class="image-container">
                    <img class="note" src="https://i.ibb.co/7V28gKG/baknote-06.png" alt="note"/>
                    <div class="caption">20 Tnd 1992</div>
                </div>
                <img class="arrow" src="https://i.ibb.co/9bnxBHH/arrow.png" alt="arrow">
                <div class="image-container">
                    <img class="note" alt="note" src="https://i.ibb.co/s3dNyNX/baknote-02.png" />
                    <div class="caption">20 Tnd 2011</div>
                </div>
            </div>
            <div class="rashiq">
                <div class="image-container">
                    <img class="note" alt="note"src="https://i.ibb.co/GxwtLq8/baknote-14.png"/>
                    <div class="caption">50 Tnd 2008</div>
                </div>
                <img class="arrow" src="https://i.ibb.co/9bnxBHH/arrow.png" alt="arrow">
                <div class="image-container">
                    <img class="note" alt="note"src="https://i.ibb.co/3BZMdM3/baknote-01.png"/>
                    <div class="caption">50 Tnd 2011</div>
                </div>
            </div>
        </div>

        <Propaganda/>
        -->
    </div>
<TopicEnd hasNext={!!nextOf(open)} on:next={() => pick(nextOf(open))} on:back={backToNotebook}/>
</section>
{/if}

{#if open === 'vivid'}
<section class="topic" bind:this={topicEl}>
    <div class="prose">
    <h1 id="ch-vivid" class="chapter" style="--n:'03'">
        <span>{$t('hVivid')}</span>  
    </h1>
    </div>
    <Insight k="pVivid"/>
    <!-- (the game's title and Dali's two round explanations were removed: the game explains itself) -->
    <div class="prose">
    <div class="wide">
        <!-- <div class="color"><Color/></div> previous version, kept -->
        <ColorGame/>
    </div>

    </div>
<TopicEnd hasNext={!!nextOf(open)} on:next={() => pick(nextOf(open))} on:back={backToNotebook}/>
</section>
{/if}

{#if open === 'sizes'}
<section class="topic" bind:this={topicEl}>
    <Insight k="pSizeDali" lens={['cul']}/>
    <div class="wide">
        <!-- <div class="color"><Scatter/></div> previous version, kept -->
        <SizeChart/>
    </div>
    <Insight k="insVivid" note="insVividNote" lens={['eco', 'geo']}/>
<TopicEnd hasNext={!!nextOf(open)} on:next={() => pick(nextOf(open))} on:back={backToNotebook}/>
</section>
{/if}

{#if open === 'faces'}
<section class="topic" bind:this={topicEl}>
    <div class="prose">
    <h1 id="ch-faces" class="chapter" style="--n:'04'">
        <span>{$t('hFigures')}</span>  
    </h1>
</div>
<Insight k="pFaces" lens={['pol', 'cul']}/>
<div class="timeline">
    
    <!-- <Beeswarm/> previous version, kept -->
    <PortraitStory/>
    </div>
<Insight k="insFaces" note="insFacesNote" lens={['pol', 'cul']}/>
<TopicEnd hasNext={!!nextOf(open)} on:next={() => pick(nextOf(open))} on:back={backToNotebook}/>
</section>
{/if}

{#if open === 'land'}
<section class="topic" bind:this={topicEl}>
    <div class="prose">
        <h2 id="ch-landmarks" class="chapter" style="--n:'05'; margin-top:5%">
            <span>{$t('hDiverse')}</span>
        </h2>
    </div>
    <div class="landmark">
<Landmarks/>
</div>
<Insight k="lmRegions" note="lmRegionsNote" lens={['geo', 'pol']}/>
<!-- (Dali's map exchange moved above the map) -->
<TopicEnd hasNext={!!nextOf(open)} on:next={() => pick(nextOf(open))} on:back={backToNotebook}/>
</section>
{/if}

{#if open === 'country'}
<section class="topic" bind:this={topicEl}>
<!-- what kind of country do the notes show? -->
<Insight k="insCountry" lens={['eco', 'pol']}/>
<div class="wide"><CountryByEra/></div>

<Insight k="pLandmarks"/>
<!-- <Landmark/> previous explorer, kept -->
<LandmarkExplorer/>
<TopicEnd hasNext={!!nextOf(open)} on:next={() => pick(nextOf(open))} on:back={backToNotebook}/>
</section>
{/if}

{#if open === 'worth'}
<section class="topic" bind:this={topicEl}>
<!-- what is your banknote worth? -->
<div class="prose">
    <h1 id="ch-worth" class="chapter" style="--n:'06'"><span>{$t('hWorth')}</span></h1>
</div>
<Insight k="pWorthDali" lens={['eco']}/>
<div class="wide"><DinarValue/></div>
<Insight k="insWorth" note="insWorthNote" lens={['eco']}/>
<TopicEnd hasNext={!!nextOf(open)} on:next={() => pick(nextOf(open))} on:back={backToNotebook}/>
</section>
{/if}

{#if open === 'end'}
<section class="topic" bind:this={topicEl}>
<div class="wide end-wrap"><Conclusion missed={TOPICS.filter((x) => x.id !== 'end' && !read[x.id]).map((x) => x.short)}/></div>
<TopicEnd hasNext={false} on:back={backToNotebook}/>
</section>
{/if}
{/if}

<!-- sources: always at the end of the page -->
<div class="prose">
    <h3 id="ch-sources"><span>{$t('hSources')}</span></h3>
</div>
<div class="wide sources-wrap"><Sources/></div>



<!-- <Map/> -->
<!-- <svelte:body use:style={"background-color: #DCDDDB;"} />    -->

<!-- <div class="map">
    <Map {selectedLanguage}/>
</div> -->

<!-- <svelte:body use:style={"background-color: #FDF6F5;"} /> previous flat background -->
</div><!-- /tn-page -->
<svelte:body use:style={pageStyle} />
<svelte:window on:contextmenu={blockMenu} on:dragstart={blockDrag} on:scroll|passive={checkSkip} />
<Footer theme={{ logoBg: 'transparent', logoFill: 'transparent', logoInk: '#1E3F5C' }} />

<style>
    @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap');

    /* Arabic: one readable Arabic font everywhere, except text marked lang="en"
       (the parts that stay bilingual, e.g. the English title) */
    :global(.tn-ar *:not([lang=en]):not([lang=en] *)) {
        font-family: 'Tajawal', 'Quicksand', sans-serif !important;
        letter-spacing: normal !important;
    }
    :global(.tn-ar) { line-height: 1.75; }
    :global(mark.purple) { background-color: #C6AFC0; color: #FDF6F5; padding: 0 .25em; border-radius: 3px; }


    .TitleImg{
        height:auto;
        width: 70%;
    }


.images > div {
                display: flex;
                align-items: center;
                justify-content: space-around;
            }
        
        .arrow {
            height: 3vh;
            margin:3%
        }
        
        .note {
            width: auto;
            height: 20vh;
            pointer-events: none;
        }
        
        .caption {
            margin-top: 0%;
            text-align:center;
            font-family: Quicksand;
            color:#BF5630;
            font-size: 0.75rem;
            font-weight:bold
        }


    .prose{
        max-width: 50rem;
        margin: 1rem auto;
    }

    /* interactive pieces break out of the 50rem text column */
    .wide{
        width: min(1100px, calc(100vw - 2rem));
        /* logical margins so the block is centred in both English (LTR) and Arabic (RTL) */
        margin-block: 1.4rem 3rem;
        margin-inline: calc(50% - min(550px, calc(50vw - 1rem))) 0;
    }
    .color{
        margin-right: 10%;
        margin-left: 10%
    }
    
    .landmark{
     
        margin-right:20%;
        margin-left:20%
    }
    @media (max-width: 760px) {
        .landmark { margin-left: 4%; margin-right: 4%; }
    }

    .introText{
        /* margin-top: -10%; */
        font-size: 1rem;
        /* margin-left: 10em; margin-right: 10em;  (old, squeezed the text on phones) */
        max-width: 70rem;
        margin-left: auto;
        margin-right: auto;
        margin-top: 1.8rem;   /* space under the title's bottom band */
        padding: 0 1rem;
    }
    .sort-nudge { margin: 2.5rem 0 4rem; }
    .sn { text-align: center; margin: -1.2rem 0 0; }
    .sn button { padding: .65rem 1.5rem; border: 0; border-radius: 999px; background: #8C4D3F; color: #FFFBF1; cursor: pointer;
        font: 800 .95rem Quicksand, sans-serif; box-shadow: 0 3px 10px rgba(74, 46, 37, .3); transition: transform .2s, background .2s; }
    .sn button:hover { background: #6E3A2F; transform: translateY(-2px); }
    .introText.second { margin-top: .9rem; }
    /* key phrases for readers who scan: a highlighter stroke, like the collector's own notes */
    .introText :global(b) {
        font-weight: 700; color: #1E3F5C;
        background: linear-gradient(transparent 55%, rgba(227, 167, 42, .38) 55%, rgba(227, 167, 42, .38) 92%, transparent 92%);
        -webkit-box-decoration-break: clone; box-decoration-break: clone; padding: 0 .1em;
    }
   .timeline{
    display: flex;
    justify-content: center;  
    align-items: center;      
   }

    .lan{
        text-align: center;
    }
    .Title{
        text-align: center;
        margin-top: 5%;
        display: block; 
    }

    /* .svg {
        display: inline-block; 
    } */
    /* img{
        width: 140vh;
        height: auto
    } */
    /* .map{
        margin-left: 10%;
        margin-right: 10%;
    }
    .info{
        max-width: 1000px
    } */

    p, h1, h2,h3,option{
        font-family: Quicksand;
    }

    .centered { text-align: center; }
    .end-wrap { margin-bottom: 3rem; }
    .sources-wrap { margin-bottom: 5rem; }

    /* images can't be dragged out or long-pressed to save (see blockMenu) */
    :global(body img), :global(body svg image) {
        -webkit-user-drag: none;
        user-select: none;
        -webkit-touch-callout: none;
    }

    /* ---------- headings: one banknote-inspired system, all centred ---------- */
    .tn-page h1, .tn-page h2, .tn-page h3 { text-align: center; }

    /* chapter titles: framed like a banknote, with a red serial number */
    .chapter{ margin-top: 0; }
    /* Chapter plates removed from view: the reading flows straight on, the bottom-right menu does the navigating.
       The headings stay in the page (for that menu, screen readers and search), just visually hidden, with some breathing room. */
    .tn-page .chapter{ position: relative; height: 1px; margin: 3.5rem 0 0 !important; padding: 0; overflow: hidden; clip-path: inset(50%); white-space: nowrap; border: 0; }
    .tn-page .chapter::before, .tn-page .chapter::after{ display: none; }
    .chapter::before{   /* door studs leading to a small arched door */
        content: "";
        display: block;
        height: 24px;
        margin: 4.5rem auto 1.4rem;
        max-width: 240px;
        background: var(--tn-divider) center / contain no-repeat;
    }
    .chapter > span{
        position: relative;
        display: inline-block;
        padding: .55em 1.4em .5em;
        font-family: 'Playfair Display', Georgia, serif;
        font-weight: 800;
        font-size: clamp(1.6rem, 3.4vw, 2.4rem);
        line-height: 1.15;
        color: #1E3F5C;
        background-color: #F6EBD3;
        background-image:
            repeating-radial-gradient(circle at 0 50%, rgba(140, 77, 63, .07) 0 1px, transparent 1px 7px),
            repeating-radial-gradient(circle at 100% 50%, rgba(30, 91, 140, .06) 0 1px, transparent 1px 7px);
        border: 1.5px solid #8C4D3F;
        outline: 1px solid rgba(140, 77, 63, .45);
        outline-offset: 4px;
        border-radius: 4px;
    }
    /* serial number, like the red numbers printed on notes */
    .chapter > span::before{
        content: "N° " var(--n);
        display: block;
        margin-bottom: .25rem;
        font-family: 'Courier New', monospace;
        font-size: .8rem;
        font-weight: 700;
        letter-spacing: .3em;
        color: #B5523B;
    }
    :global(.tn-ar) .chapter > span::before{ content: "الفصل " var(--n); letter-spacing: .05em; }
    /* small denomination-style corner marks */
    .chapter > span::after{
        content: "";
        position: absolute; inset: 5px;
        pointer-events: none;
        background:
            radial-gradient(circle, #8C4D3F 2px, transparent 2.5px) top left / 10px 10px no-repeat,
            radial-gradient(circle, #8C4D3F 2px, transparent 2.5px) top right / 10px 10px no-repeat,
            radial-gradient(circle, #8C4D3F 2px, transparent 2.5px) bottom left / 10px 10px no-repeat,
            radial-gradient(circle, #8C4D3F 2px, transparent 2.5px) bottom right / 10px 10px no-repeat;
    }
    h1.chapter > span{ font-size: clamp(1.7rem, 3.6vw, 2.5rem); }
    h2.chapter > span, h3.chapter > span{ font-size: clamp(1.5rem, 3vw, 2.1rem); }

    /* sub-headings: engraved lines with diamonds on both sides */
    .tn-page h2:not(.chapter), .tn-page h3:not(.chapter){
        display: flex; align-items: center; justify-content: center; gap: .9rem;
        margin: 2.6rem auto 1rem;
        color: #8C4D3F;
    }
    .tn-page h2:not(.chapter) > span, .tn-page h3:not(.chapter) > span{
        font-family: 'Playfair Display', Georgia, serif;
        font-weight: 700;
        font-size: clamp(1.25rem, 2.4vw, 1.65rem);
        color: #8C4D3F;
    }
    .tn-page h3:not(.chapter) > span{ font-size: clamp(1.1rem, 2vw, 1.35rem); color: #1E3F5C; }
    .tn-page h2:not(.chapter)::before, .tn-page h2:not(.chapter)::after,
    .tn-page h3:not(.chapter)::before, .tn-page h3:not(.chapter)::after{
        content: "";
        flex: 0 1 70px;
        height: 9px;
        background:
            linear-gradient(#C9A46F, #C9A46F) center / 100% 1.5px no-repeat,
            linear-gradient(45deg, transparent 40%, #C9A46F 40% 60%, transparent 60%) center / 9px 9px no-repeat;
    }

    .tn-page .prose > p { line-height: 1.7; }

    .meet-dali { display: flex; align-items: center; justify-content: center; gap: 1.2rem; max-width: 56rem; margin: 1.6rem auto 0; padding: 0 1rem; box-sizing: border-box; }
    .meet-dali :global(.ins) { margin: 0; flex: 1 1 auto; }
    .dali-full { flex: 0 0 auto; width: 128px; height: auto; filter: drop-shadow(0 6px 10px rgba(74, 46, 37, .18)); }
    @media (max-width: 640px) {
        .meet-dali { flex-direction: column; gap: .6rem; padding: 0; }
        .dali-full { width: 104px; }
    }
     .Reference{
        color: rgb(139, 139, 139);
        font-weight: 500;
        text-align: center;
        margin-top: 0;
    }
</style>
