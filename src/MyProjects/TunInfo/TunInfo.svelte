<script>
    import Map from "./Data Viz/Map/Map.svelte"
    import Footer from "../../components/footer.svelte";
    import Title from "./Assets/Tunisian Banknotes.svg"
    import Timeline from "./Data Viz/Timeline/Timeline.svelte";
    import Beeswarm from "./Data Viz/Beesawarm/Beeswarm.svelte";

    let selectedLanguage = "english"; // Default to English

    function handleChange(event) {
    selectedLanguage = event.target.value;
    }

    import { style } from 'svelte-body';
</script>
<!-- 
<p style="text-align:center"> Choose Language:</p> -->
<div class="lan">
    <p>
        Choose a Language
            <select bind:value={selectedLanguage} on:change={handleChange}>
          <option value="english">English</option>
          <option value="arabic">Arabic</option>
        </select>
    </p>
</div>


<div class="Title">
    <img src="{Title}" alt="title" />
    <h1> My name is Ahmed Bendaly</h1>
    <p class="introText">
        Banknotes, beyond their primary function as a medium of exchange, have long served 
        as canvases that reflect the history, values, and aspirations of a nation. 
        From their inception, these pieces of currency have been adorned with images of
         influential figures, landmarks, and symbols that are emblematic of a country's 
         shared identity. The individuals depicted on banknotes often represent pivotal moments 
         or eras in a nation's history, capturing its political, economic, and cultural evolution.
          For instance, the presence of a revered leader or visionary on a banknote can signify a 
          period of political stability and national pride, while an influential economist or
           industrialist might symbolize a phase of economic progress and innovation. 
           Moreover, as societies evolve, so too does the imagery on their currency, reflecting 
           shifts in values, priorities, and perspectives. Consequently, studying the faces 
           and symbols on banknotes can offer profound insights into the heartbeat of a nation
            and its journey through time.
    </p>
</div>


<div class="timeline">
<Timeline/>
</div>

<div class="timeline">
    <Beeswarm/>
    </div>

<!-- <svelte:body use:style={"background-color: #DCDDDB;"} />    -->

<!-- <div class="map">
    <Map {selectedLanguage}/>
</div> -->

<Footer/>

<style>

    .introText{
        font-size: 1rem;
        margin-left: 10em;
        margin-right: 10em;
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
    }
    img{
        width: 140vh;
        height: auto
    }
    /* .map{
        margin-left: 10%;
        margin-right: 10%;
    }
    .info{
        max-width: 1000px
    } */

    p, h1, option{
        font-family: Quicksand;
    }
</style>
