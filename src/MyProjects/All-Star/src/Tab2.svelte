<script>
 import PlayerEffortLine from "../DataViz/PlayerEffort/PlayerEffort.svelte";
 import TeamEffort from "../DataViz/TeamEffort/TeamEffort.svelte"
</script>

<body>
    
    <p> Having stars in the all-star game is vital, but let's face it, watching endless threes and defensive dunks can be as thrilling as watching paint dry.
         Now with data, we can analyze and study the player effort on both ends of the floor: Offense and defense.</p>
    
     <!-- <h1><mark class="nba_mark">Team Efficiency</mark></h1> -->
    <TeamEffort/>

    <!-- <blockquote class="twitter-tweet"><p lang="en" dir="ltr">&quot;I would not draft myself
         either.&quot;<br><br>Nikola Jokic after being picked 7th from the Starters Pool 
         tonight 🤣<a href="https://twitter.com/hashtag/NBAAllStar?src=hash&amp;
         ref_src=twsrc%5Etfw">#NBAAllStar</a> <a href="https://t.co/ZpOQfsldUE">pic.twitte
            r.com/ZpOQfsldUE</a></p>&mdash; NBA (@NBA) <a href="https://twitter.com/NBA/statu
            s/1627527587239960576?ref_src=twsrc%5Etfw">February 20, 2023</a></blockquote> <scr
            ipt async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> -->
     <!-- <h1><mark class="nba_mark">Defense</mark></h1> -->
     <br>
     <h1><mark class="nba_mark">Team Effort</mark></h1>
    <PlayerEffortLine/>
    <br>
    
    
</body>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Jost:wght@400;800&family=Quicksand&display=swap');

    img{
        width: 550px;
    }

blockquote {
    width: 50%;
}
    .nba_mark{
        background-color: #476b8d;
        padding: 1%;
        color: #f2efeb;
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
        font-family: 'Quicksand', sans-serif;
        color: #403F3E;
        font-size: 1em;
        margin-block-start: 1em;
        margin-block-end: 1em;
        margin-inline-start: 0px;
        margin-inline-end: 0px;
    }    
    h1 {
        text-align: center;
        font-family: 'Jost', sans-serif;
        font-size: 2em;
        text-transform: uppercase;
        font-weight: 800;
        margin-top: 0;
    }
</style>