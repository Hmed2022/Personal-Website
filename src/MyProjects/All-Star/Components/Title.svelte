<script>
 import { onMount } from 'svelte';
import { afterUpdate } from 'svelte';
import Logo from "./nba-logo.svelte"
import starUrl from "../../../assets/Projects/AllStar/star.png"

  let rotationAngle = 0;

  function handleScroll() {
    rotationAngle = window.pageYOffset;
  }

  onMount(() => {
    window.addEventListener('scroll', handleScroll);
  });

  afterUpdate(() => {
    window.removeEventListener('scroll', handleScroll);
    window.addEventListener('scroll', handleScroll);
  });
</script>
  
  <div class="title">
    <div class="container1">
      <h1 class="thedecline">The Decline <span class="of">of the</span> </h1>
      <div class="align-container">
         <h1 class="allstar"> ALL</h1>
         <img class="star" src="{starUrl}" alt="star" style="transform: rotate({rotationAngle}deg)">
          <h1 class="allstar"> STAR <span class="thedecline2">GAME</span> </h1>
      </div>
    </div>
    <div class="container2">
      <Logo />
    </div>
  </div>

  
  <style>
    .container1{
      width: 80%;
      float: left;

    }
    .container2{
      width: 20%;
      float: right;
    }

    .of{
      font-size: 0.3em;
  
    }

    @font-face {
  font-family: "Action Cond Regular Trial";
  src: url("../Fonts/ActionCondensedRegular-Grade2-Trial.otf")
    format("opentype");
}


    h1 {
        font-family:'Action Cond Regular Trial';
        color: #403F3E;
        font-size: 10em;
        margin: 0;
    }
    .title {
        margin-top: 15%;
        margin-bottom: 2%;
        display: flex;
      align-items: center;
      justify-content: center;
    }
  
    .align-container {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .allstar{
      font-weight: 300;
      display: flex;
      margin: 0;
    }

    .thedecline{
      font-weight: 600;
    }

    .thedecline2{
      font-weight: 600;
      display: flex;
      margin-left:4%
    }

    .star{
      height: 60px;
      transition: transform 0.3s ease-out;
      display: flex;
    }
  </style>
  