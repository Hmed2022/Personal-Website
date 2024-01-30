<script>
    // @ts-ignore
    import Map from "./Data Viz/Map/Map.svelte"
    import Footer from "../../components/footer.svelte";
    // import Title from "./Assets/Tunisian Banknotes.svg"
    import Timeline from "./Data Viz/Timeline/Timeline.svelte";
    import Beeswarm from "./Data Viz/Beesawarm/Graph.svelte";
    // import Landmarks from "./Data Viz/Landmarks.svelte";
    import Color from "./Data Viz/Color/Color.svelte";
    import Scatter from "./Data Viz/Scatter/Scatter.svelte";
    import Title from "./Components/Title.svelte"
    import Landmark from "./Data Viz/Landmarks/Landmark.svelte"
    import Landmarks from "./Components/Landmarks.svelte"

    // @ts-ignore
    import Propaganda from "./Components/Propaganda.svelte"

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
    <div class="svg">
        <Title/>
    </div>
    
    <!-- <img src="{Title}" alt="title" /> -->
    <!-- <h1> My name is Ahmed Bendaly</h1> -->
   
    <p class="introText">
        Ready for a trip? Take a close look at your cash. It's not just for spending—it's your
         first clue to what's cool and important in the country. Who are the folks on the money? 
         What are the big, famous spots you should see? Our journey here dives into the Tunisian
          banknote and shows you how every note is a story of the country's past. After all, money 
          talks; you have just to listen!
    </p>
    <p class="Reference">By Ahmed Bendaly | Decemeber 2023</p>
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

    <div class="prose">
        <h1>
            <span style="color:#FDF6F5; background-color:#BF5630"> Changes Between Eras</span>
        </h1>

        <p>
            The dominant political party throughout the Ben Ali era in Tunisia was the Constitutional Democratic Rally (CDR). The CDR, renowned for adopting <mark style="background-color:#C6AFC0; color:#FDF6F5">purple</mark> as its signature color, had such a profound influence that the color became a ubiquitous symbol of the party. This association was so strong that even everyday items, including the national currency, were perceived as extensions of the CDR's presence and power. In the wake of the revolution, one of the earliest and most symbolic changes was the replacement of these everyday items, signifying a break from the past and a step towards a new future.
        </p>


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

    

    <h1>
        <span style="color:#FDF6F5; background-color:#BF5630"> Visually Vivid, Tactilely Telling</span>  
    </h1>
    <p>
        The iconic green of the US Dollar and the Euro's understated, uniform color scheme are instantly identifiable symbols of their economies. In contrast, Tunisian currency lacks a distinctive visual identity that resonates with its rich heritage. A redesign of Tunisia's banknotes is imperative to infuse them with a sense of national pride and recognition … and That’s exactly what happened!
    </p>
    
    <h2>
        <span style="color:#FDF6F5; background-color:#0588A6"> Ever play the 'Guess That Bill by the color’ game?</span>
    </h2>
    <div class="color">
        <Color/>
    </div>
    
    <h2>
        <span style="color:#FDF6F5; background-color:#0588A6"> Does size matter? </span>
    </h2>
    <div class="color">
        <Scatter/>
    </div>
    </div>
   


<div class="timeline">
    <Beeswarm/>
    </div>

    <div class="landmark">
<Landmarks/>
</div>

<Landmark/>

<!-- <Map/> -->
<!-- <svelte:body use:style={"background-color: #DCDDDB;"} />    -->

<!-- <div class="map">
    <Map {selectedLanguage}/>
</div> -->

<svelte:body use:style={"background-color: #FDF6F5;"} />
<Footer/>

<style>

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

    .color{
        margin-right: 10%;
        margin-left: 10%
    }
    
    .landmark{
        margin: 10%;
        margin-right:20%;
        margin-left:20%
    }

    .introText{
        margin-top: -10%;
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
    /* .Title{
        text-align: center;
        margin-top: 5%;
        display: block; 
    } */

    .svg {
        display: inline-block; 
    }
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

    p, h1, h2,option{
        font-family: Quicksand;
    }

     .Reference{
        color: rgb(139, 139, 139);
        font-weight: 500;
        text-align: center;
        margin-top: 0;
    }
</style>
