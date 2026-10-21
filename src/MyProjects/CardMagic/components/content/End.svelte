<script>
    import FlipPhotoButton from "../items/FlipButton.svelte";
    import BackMagic from "../../svg/back1.svg"
    import FrontMagic from "../../svg/font1.svg"
    import BackMath from "../../svg/back2.svg"
    import FrontMath from "../../svg/font2.svg"
    import { triggerReset } from "../../stores/misc.js";

    import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  // Hovering "Yes" flips the orange (math) card, "No" flips the purple (magic) one
  let hoverYes = false;
  let hoverNo = false;

  // Math  => vertical 1, horizontal 0: plain transition, keeps the picked card & cycles
  function seeMath() {
    dispatch("goto", { y: 1, x: 0 });
  }

  // Magic => vertical 0, horizontal 0: start the trick over with a fresh deck
  function playAgain() {
    dispatch("goto", { y: 0, x: 0 });
    triggerReset();
  }


  </script>


<section class='end'>
  <div class="content">
    <div class="text">
        <h1>
           <span class='title'>That's the trick!</span> 
        </h1>
        <p>Now, do you think you figured it out ?</p>
        <p>
          <button class='yes' type="button"
            on:mouseenter={() => (hoverYes = true)}
            on:mouseleave={() => (hoverYes = false)}
            on:focus={() => (hoverYes = true)}
            on:blur={() => (hoverYes = false)}
            on:click={seeMath}>Yes</button>
          or
          <button class='no' type="button"
            on:mouseenter={() => (hoverNo = true)}
            on:mouseleave={() => (hoverNo = false)}
            on:focus={() => (hoverNo = true)}
            on:blur={() => (hoverNo = false)}
            on:click={playAgain}>No</button>
          ?
        </p>
        <p class="choices">
          <b>Yes:</b> check your answer with the math. &nbsp; <b>No:</b> watch it again, closely.
        </p>
        <button class="stuck" type="button" on:click={seeMath}>
          Still stuck? Show me how it works →
        </button>
    </div>


    <div class="wrap">

        <FlipPhotoButton
        frontSrc= {BackMath}
        backSrc= {FrontMath}
        alt="Math option"
        label="See the math"
        width="11em"
        forceFlip={hoverYes}
        on:select={seeMath}
      />


        <FlipPhotoButton
          frontSrc= {BackMagic}
          backSrc= {FrontMagic}
          alt="Magic option"
          label="Play the magic again"
          width="11em"
          forceFlip={hoverNo}
          on:select={playAgain}
        />
      
      
      </div>
  </div>
    </section>
  
  
  <style>
@import url('https://fonts.googleapis.com/css2?family=Kumbh+Sans:wght@400;700&display=swap');

    /* One fluid base size (grows with the stage) + everything in em, and the
       content centered vertically, so big screens aren't mostly empty. */
    .end {
        height: 100%;
        box-sizing: border-box;
        background-color: #BEAFF7;
        font-family: 'Kumbh Sans', sans-serif;
        font-size: clamp(14px, calc(0.55cqw + 0.85cqh), 26px);
        padding: 2em 1.5em;
        overflow: auto;
        display: flex;
        flex-direction: column;
    }
    .content {
        margin: auto;           /* centers; still scrolls if the screen is too short */
        width: 100%;
        max-width: 50em;
    }

    .text { text-align: center; }

    h1 { font-size: 2em; margin: 0 0 .6em; }

    .title {
        background-color: #5B4D88;
        color: #E5DEFE;
        padding: 0 1.2em;
    }

    p {
        color: #5B4D88;
        font-size: 1.3em;
        margin: .5em 0;
    }

    .yes, .no {
        border: none;
        font: inherit;
        cursor: pointer;
        padding: 0 .5em;
        transition: transform .15s;
    }
    .yes:hover, .no:hover,
    .yes:focus-visible, .no:focus-visible {
        transform: scale(1.08);
    }
    .yes { background-color: #D47D79; color: #FCD4D4; }
    .no  { background-color: #5B4D88; color: #E5DEFE; }

    .choices { font-size: .95em; margin: .8em 0 0; }

    .stuck {
        margin-top: .6em;
        font-family: inherit;
        font-size: .9em;
        color: #5B4D88;
        background: none;
        border: none;
        text-decoration: underline;
        cursor: pointer;
    }
    .stuck:hover, .stuck:focus-visible { color: #3F3075; }

    .wrap {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 2em;
      justify-items: center;
      align-items: center;
      margin-top: 2em;
    }
  
    /* stage narrower than 520px (see cq-* classes in Demo.Slider) */
    :global(.cq-520) .wrap { grid-template-columns: 1fr; }
</style>
