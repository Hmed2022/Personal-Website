<script>
    import ThreePointLine from "../DataViz/ThreePointLine/ThreePointLine.svelte"
    import ThreePointPer from "../DataViz/ThreePointPer/ThreePointLine.svelte"
</script>

<body>
    <h1><mark class="nba_mark">3pt Vs. 2pt</mark></h1>
    <p> The NBA All-Star game: where threes rain like confetti, turning basketball into an unending long-range shootout.
         One three-point contest is cool, but having two feels redundant. <br> <br>
         When watching the All-Star game in these years.  You'll notice the sheer volume of threes attempted with comparison to the 2pt 
         attempted. And the data shows it! </p>
    <ThreePointPer />
    <p> In the history of regular seasons (RS), the closest attempt ratio between twos and threes was in 2020
         when it was 54 to 34 respectively, indicating players took 22.7% fewer threes than twos during the RS.
          However, in the 2015 All-Star game, there was a significant shift as three-point attempts (133) surpassed 
          two-point attempts (130) for the first time. Since then, the ratio has fluctuated.</p>
          <br>
          <h1><mark class="nba_mark">The Three</mark></h1>
    <ThreePointLine />

    
   
</body>

<style>
    .nba_mark{
        background-color: #476b8d;
        padding: 1%;
        color: #f4f1ed;
    }
    .nba_mark:hover{
        background-color: #894044;
    }
    
    .dataviz2{
        width:100%;
        height: auto;
        justify-content: center;
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

    .nba_mark{
        background-color: #476b8d;
        padding: 1%;
        color: #f2efeb;
    }
    .nba_mark:hover{
        background-color: #894044;
    }
    h1 {
        text-align: center;
        font-family: Futura;
        font-size: 2em;
        text-transform: uppercase;
        font-weight: 800;
        margin-top: 0;
    }
</style>