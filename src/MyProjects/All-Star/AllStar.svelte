<script>
    import Title from "./Components/Title.svelte"
    //  let value = "3 Point Shooting"
	// let items = ["3 Point Shooting", "Player Effort","Player Injuries"];

    import Tabs from "./src/Tabs.svelte";

	import LineChart1 from "./DataViz/LineChartFan/LineChart.svelte"
    

    import Tab1 from "./src/Tab1.svelte";
	import Tab2 from "./src/Tab2.svelte";
	import Tab3 from "./src/Tab3.svelte";

    import Conclusion from "./Components/Conclusion.svelte";

    import { style } from 'svelte-body';

    

  // List of tab items with labels, values and assigned components
  let items2 = [
    { label: "Player Effort",
		 value: 1,
		 component: Tab2
		},
    { label: "3 Point Shooting",
		 value: 2,
		 component: Tab1
		},
    {   label: "Player Injuries",
		 value: 3,
		 component: Tab3
		}
  ];


</script>


<body class="bodycolor">
    <section id="intro">
        <div class="prose">
            <Title/>
            <p class="Reference">By Ahmed Bendaly | June 2023</p>
            <br>
            <p>
                The NBA All-Star Game has traditionally been one of the most anticipated events for NBA fans,
                second only to the playoffs. It showcases the league's top stars coming together to
                play in an exhibition game, providing the ultimate entertainment. <br>
                <br>
                However, in recent years, the quality of the All-Star Game has <mark class= "dec">declined</mark>, leaving fans
                disappointed with <b>lackluster defense and subpar offense</b>. It seems as though some players
                lack the motivation to give their best performance, resulting in a lack of excitement
                and intensity. As a result, watching the All-Star Game sometimes feels more like
                observing pregame shoutouts rather than witnessing a thrilling display of basketball skills.

                What exactly led to this <mark class ="dec">decline</mark> in the quality of the All-Star Game?
                
            </p>

            <p> The decline of the NBA All-Star Game can be succinctly summarized by All-Star coach <a href="https://en.wikipedia.org/wiki/Michael_Malone_(basketball)">Mike Malone</a> in a tweet following the game:</p>
            <div class="tweet">
                <p><strong>"That is the worst basketball game ever played...I don't know if you can fix it." </strong> - Mike Malone on the NBA All-Star Game</p>
                <!-- <blockquote class="twitter-tweet"><p lang="en" dir="ltr">&quot;That is the worst basketball game ever played...I don&#39;t know if you can fix it.&quot; - Mike Malone on the NBA All-Star Game<br><br>(via <a href="https://twitter.com/VicLombardi?ref_src=twsrc%5Etfw">@VicLombardi</a>) <a href="https://t.co/y0okJZYrQk">pic.twitter.com/y0okJZYrQk</a></p>&mdash; Action Network (@ActionNetworkHQ) <a href="https://twitter.com/ActionNetworkHQ/status/1627538610076672000?ref_src=twsrc%5Etfw">February 20, 2023</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> -->
                <!-- <blockquote class="twitter-tweet"><p lang="en" dir="ltr">“That’s the worst basketball game ever played… I don’t know if you can fix it.” <br><br>- Mike Malone on the All-Star Game <br><br>(via <a href="https://twitter.com/VicLombardi?ref_src=twsrc%5Etfw">@VicLombardi</a>)</p>&mdash; Basketball Forever (@bballforever_) <a href="https://twitter.com/bballforever_/status/1627525573261279233?ref_src=twsrc%5Etfw">February 20, 2023</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> -->
            </div>

            
            <h1 class="faninterest"><mark class="nba_mark" >Fan Interest</mark></h1>
            
            <!-- <img class="dataviz1" src="./src/MyProjects/All-Star/DataViz/1.png" alt="Data1"> -->

            <!-- <input id="show" type="checkbox" bind:checked={show} />
            <label for="show" style="display: inline;">show curve</label>  -->

            <LineChart1/>
            <p> 
                In this article, we'll explore the reasons for the drop in viewership and ratings. 
                We have chosen three specific measures to examine and explain in detail; Player Effort, The Three Point and Injuries.
            </p>
            


            <Tabs {items2} />

        <Conclusion />

    </section>
    
</body>

<svelte:body use:style={"background-color: #f4f1ed;"} />


<style>
    .dec {
        background-color: #eaded3;
        color: #b8a79a;
    }

@import "./src/allStar.css";

    .faninterest{
        margin-bottom: 0;
    }

    .hoveroverme{
        text-align: center;
        font-family: Quicksand;
        color: #403F3E;
        font-size: 1em;

    }
    .dataviz1{
        width:650px;
        justify-content: center;
    }

    .Reference{
        color: rgb(139, 139, 139);
        font-weight: 500;
        text-align: center;
        margin-top: 0;
    }
    .tweet{
        display: flex;
        justify-content: center;
    }
    
  
    .nba_mark{
        background-color: #476b8d;
        padding: 1%;
        color: #f4f1ed;
    }
    .nba_mark:hover{
        background-color: #894044;
    }
    .prose{
        max-width: 40rem;
        margin: 1rem auto;
    

    }
    section {
        margin: 2rem auto 4rem;
    }

    h1 {
        text-align: center;
        font-family: Futura;
        font-size: 2.75em;
        text-transform: uppercase;
        font-weight: 800;
        margin-bottom: 5%;
    }
    p {
        display: block;
        text-align: justify;
        font-family: Quicksand;
        color: #403F3E;
        font-size: 1em;
        margin-block-start: 1em;
        margin-block-end: 1em;
        margin-inline-start: 0px;
        margin-inline-end: 0px;
    }      
    
    body {
        margin: 2rem auto;
    }

    /* .bodycolor {
  background-color: #f4f1ed;
} */




</style>