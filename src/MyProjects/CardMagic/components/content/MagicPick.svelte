<script>
  import Cards from "../items/cards.svelte";
  import {lockedCard} from '../../stores/misc.js'
  import KeyboardDown from "../items/KeyboardDown.svelte";

  import { style } from 'svelte-body';
</script>

<section class='body'>

  <div class="center">
    <div class="text">
        <h1> Pick A card</h1>
        <h3>Grab 27 cards from a real deck and follow along!</h3>
    </div>
    
    <div class= 'container'>
        <Cards/>
    </div>
  </div>

</section>

<svelte:body use:style={"background-color: #BFAFF7;"} />

<style>

    .text {
        margin-bottom: 1em;
    }

    /* html{
        margin: 0;
        padding: 0;
        height: 100%;
    } */

    /* One fluid base size (cards and text are in em) + content centered
       vertically, so big screens aren't mostly empty. */
    .body {
        height: 100%;
        box-sizing: border-box;
        margin-top: 0;
        background-color: #BFAFF7;
        /* ~20px on a normal laptop (cards ≈ 130px, the original size), up to 28px
           on big screens; the 2.6cqh cap keeps it from overflowing short windows */
        font-size: clamp(16px, min(calc(0.8cqw + 1.1cqh), 2.6cqh), 28px);
        padding: 2em 1.5em;
        overflow: auto;
        display: flex;
        flex-direction: column;
    }
    .center {
        margin: auto 0;   /* vertical centering; still scrolls if too short */
        width: 100%;
    }

    h1, h3 {
        margin: 0;
    }
   
    h1 {
        text-align: center;
        color: #3F3075;
        font-family: 'Kumbh Sans', sans-serif;
    }

    h3 {
        text-align: center;
        color: #3F3075;
        font-weight: 100;
        font-family: 'Kumbh Sans', sans-serif;
    }
</style>