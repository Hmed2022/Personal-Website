<script>
    import Map from "./Data Viz/Map/Map.svelte"
    import Footer from "../../components/footer.svelte";
    import Title from "./Assets/Tunisian Banknotes.svg"
    import Timeline from "./Data Viz/Timeline/Timeline.svelte";
    import Beeswarm from "./Data Viz/Beesawarm/Beeswarm.svelte";
    import Landmarks from "./Data Viz/Landmarks.svelte";
    import Color from "./Data Viz/Color/Color.svelte";
    import Scatter from "./Data Viz/Scatter/Scatter.svelte";

  


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
    <!-- <h1> My name is Ahmed Bendaly</h1> -->
    <p class="introText">
        Ready for a trip? Take a close look at your cash. It's not just for spending—it's your
         first clue to what's cool and important in the country. Who are the folks on the money? 
         What are the big, famous spots you should see? Our journey here dives into the Tunisian
          banknote and shows you how every note is a story of the country's past. After all, money 
          talks; you have just to listen!
    </p>
</div>

<h1>
    The Tunisian Banknote Timeline
</h1>
<p>
    Explore the history of Tunisian banknotes since 1956 through our interactive timeline. Click on a rectangle for details about each note.
</p>

<div class="timeline">
    <Timeline/>
    </div>

<h1>
    Visually Vivid, Tactilely Telling
</h1>
<p>
    The iconic green of the US Dollar and the Euro's understated, uniform color scheme are instantly identifiable symbols of their economies. In contrast, Tunisian currency lacks a distinctive visual identity that resonates with its rich heritage. A redesign of Tunisia's banknotes is imperative to infuse them with a sense of national pride and recognition … and That’s exactly what happened!
</p>

<h2>
    Ever play the 'Guess That Bill by the color’ game?
</h2>
<div class="color">
    <Color/>
</div>

<h2>
    Does size matter?
</h2>
<div class="color">
    <Scatter/>
</div>


<div class="timeline">
    <Beeswarm/>
    </div>

    <div class="landmark">
<Landmarks/>
</div>

<Map/>
<!-- <svelte:body use:style={"background-color: #DCDDDB;"} />    -->

<!-- <div class="map">
    <Map {selectedLanguage}/>
</div> -->

<svelte:body use:style={"background-color: #FDF6F5;"} />
<Footer/>

<style>

    .color{
        margin-right: 10%;
        margin-left: 10%
    }
    
    .landmark{
        margin: 10%
    }

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

    p, h1, h2,option{
        font-family: Quicksand;
    }
</style>
