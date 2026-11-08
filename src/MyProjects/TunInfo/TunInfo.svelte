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
    import LangSwitch from "./Components/LangSwitch.svelte"
    import CountryByEra from "./Data Viz/Landmarks/CountryByEra.svelte"
    import DinarValue from "./Data Viz/Timeline/DinarValue.svelte"
    import Conclusion from "./Components/Conclusion.svelte"
    import NoteLifespans from "./Data Viz/Timeline/NoteLifespans.svelte"
    import ChapterNav from "./Components/ChapterNav.svelte"
    import Sources from "./Components/Sources.svelte"
    import Insight from "./Components/Insight.svelte"
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

    const pageStyle = `background-color:${PAPER}; background-image:${zelligeFaint}; background-size:90px 90px; background-attachment:fixed; --tn-paper:${PAPER}; --tn-divider:${divider};`;
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


<LangSwitch/>
<ChapterNav inline={false}/>
<div class="tn-page" class:tn-ar={$lang === 'ar'} lang={$lang} dir={$dir}>
<div class="Title">
    <div class="svg">
        <!-- <Title/> previous animated title, kept -->
        <TitlePortraits/>
        <!-- <img class="TitleImg" src={TitleImg} alt="Title"/> static title image, kept -->
    </div>
    
    <!-- <img src="{Title}" alt="title" /> -->
    <!-- <h1> My name is Ahmed Bendaly</h1> -->
 
    <p class="introText">{$t('intro')}</p>
    <p class="Reference">{$t('byline')}</p>
    <Insight k="insHow" label="insHowLabel" tone="blue"/>
    <ChapterNav/>
</div>

<div class="prose centered">
    <h1 id="ch-timeline" class="chapter" style="--n:'01'">
        <span>{$t('hTimeline')}</span>  
    </h1>
    <p>{$t('pTimeline')}</p>
</div>



<div class="timeline">
    <!-- <Timeline/> original timeline, kept for reference -->
    <TimelineVintage/>
    </div>
<Insight k="insTimeline"/>

<div class="prose">
    <h2><span>{$t('hLife')}</span></h2>
    <p>{$t('pLife')}</p>
</div>
<div class="wide"><NoteLifespans/></div>
<Insight k="insLife"/>

    <div class="prose">
        <h1 id="ch-eras" class="chapter" style="--n:'02'">
            <span>{$t('hEras')}</span>
        </h1>

        <p>{@html $t('pEras1')}</p>


        <p>{@html $t('pEras2')}</p>
    </div>
    <div class="wide">
        <ErasChanges/>
    </div>
    <Insight k="insEras"/>
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

    

    <h1 id="ch-vivid" class="chapter" style="--n:'03'">
        <span>{$t('hVivid')}</span>  
    </h1>
    <p>{$t('pVivid')}</p>
    
    <h2>
        <span>{$t('hGuess')}</span>
    </h2>
    <p>{$t('pGuess1')}</p>
    <p>{$t('pGuess2')}</p>
    <div class="wide">
        <!-- <div class="color"><Color/></div> previous version, kept -->
        <ColorGame/>
    </div>

    <h2>
        <span>{$t('hSize')}</span>
    </h2>
    <p>{$t('pSize1')}</p>
    <p>{$t('pSize2')}</p>
    <div class="wide">
        <!-- <div class="color"><Scatter/></div> previous version, kept -->
        <SizeChart/>
    </div>
    <Insight k="insVivid"/>

    <h1 id="ch-faces" class="chapter" style="--n:'04'">
        <span>{$t('hFigures')}</span>  
    </h1>
    <h2>
        <span>{$t('hFaces')}</span>
    </h2>
<p style="margin-bottom:5%">{@html $t('pFaces')}</p>
</div>
<div class="timeline">
    
    <!-- <Beeswarm/> previous version, kept -->
    <PortraitStory/>
    </div>
<Insight k="insFaces"/>

    <div class="prose">
        <h2 id="ch-landmarks" class="chapter" style="--n:'05'; margin-top:5%">
            <span>{$t('hDiverse')}</span>
        </h2>
        <h3>
            <span>{$t('hDistribution')}</span>
        </h3>
    </div>
    <div class="landmark">
<Landmarks/>
</div>
<Insight k="insMap"/>

<div class="prose">
    <h3>
        <span>{$t('hLandmarks')}</span>
    </h3>
    <p>{$t('pLandmarks')}</p>
</div>
<!-- <Landmark/> previous explorer, kept -->
<LandmarkExplorer/>

<!-- what kind of country do the notes show? -->
<div class="prose">
    <h3><span>{$t('hCountry')}</span></h3>
    <p>{$t('pCountry')}</p>
</div>
<div class="wide"><CountryByEra/></div>
<Insight k="insCountry"/>

<!-- what is your banknote worth? -->
<div class="prose">
    <h1 id="ch-worth" class="chapter" style="--n:'06'"><span>{$t('hWorth')}</span></h1>
    <p>{@html $t('pWorth1')}</p>
    <p>{@html $t('pWorth2')}</p>
</div>
<div class="wide"><DinarValue/></div>
<Insight k="insWorth"/>

<!-- conclusion -->
<div class="prose centered">
    <h1 id="ch-end" class="chapter" style="--n:'07'"><span>{$t('hEnd')}</span></h1>
</div>
<div class="wide end-wrap"><Conclusion/></div>

<div class="prose">
    <h3 id="ch-sources" class="chapter" style="--n:'08'"><span>{$t('hSources')}</span></h3>
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
<svelte:window on:contextmenu={blockMenu} on:dragstart={blockDrag} />
<Footer/>

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
        padding: 0 1rem;
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
    .chapter::before{   /* the Tunisian star divider */
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

     .Reference{
        color: rgb(139, 139, 139);
        font-weight: 500;
        text-align: center;
        margin-top: 0;
    }
</style>
