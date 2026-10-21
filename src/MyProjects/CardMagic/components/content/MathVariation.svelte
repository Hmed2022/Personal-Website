<script>
    export let titleBg = "#A85C52"; // title badge color

    // Verified by simulating the deal/gather rules used in the trick
    const examples = [
      { n: 15, p: 3, i: 3, s: 8 },
      { n: 21, p: 3, i: 3, s: 11 },
      { n: 27, p: 3, i: 3, s: 14 },
      { n: 33, p: 3, i: 4, s: 17 },
      { n: 25, p: 5, i: 2, s: 13 },
    ];
  </script>


 <main class="slide" style="--titleBg:{titleBg}">
    <div class="columns">
      <section class="col">
        <div class="title">Try it yourself</div>
        <ol class="steps">
          <li>Take <b>27 cards</b>. Have a friend pick one, remember it, and put it back. Shuffle.</li>
          <li><b>Deal</b> the cards face up, one at a time, into <b>3 piles</b> from left to right.</li>
          <li>Ask your friend <b>which pile</b> has their card.</li>
          <li><b>Gather</b> the piles into one deck, putting <b>their pile in the middle</b>. That's the secret!</li>
          <li>Repeat steps 2 to 4 <b>two more times</b> (3 deals in total).</li>
          <li>Count to the <b>14th card</b>, from the top or the bottom. That's their card!</li>
        </ol>
      </section>

      <section class="col">
        <div class="title">Variations</div>
        <p class="lead">
          The trick works with other deck sizes too. With <b>N</b> cards, <b>P</b> piles
          and <b>I</b> deals:
        </p>
        <ol class="rules">
          <li><b>P</b> must be <b>odd</b>, so there is a middle pile.</li>
          <li><b>N</b> must be divisible by <b>P</b>, so every pile gets the same number of cards.</li>
          <li>Deal enough times: <b>P<sup>I</sup> ≥ N</b> (for 27 cards: 3 × 3 × 3 = 27).</li>
        </ol>
        <div class="formula">Final position: S = (N + 1) / 2</div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Cards (N)</th><th>Piles (P)</th><th>Deals (I)</th><th>Your card (S)</th></tr>
            </thead>
            <tbody>
              {#each examples as e}
                <tr class:current={e.n === 27 && e.p === 3}>
                  <td>{e.n}</td><td>{e.p}</td><td>{e.i}</td><td>{e.s}th</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </main>


  <style>
    @import url('https://fonts.googleapis.com/css2?family=Kumbh+Sans:wght@400;700&display=swap');

    /* One fluid base size (grows with the stage), everything else in em,
       so the whole slide scales up on big screens instead of floating
       small in the middle. */
    .slide {
      height: 100%;
      box-sizing: border-box;
      background-color: #FDD4D4;
      color: #6b3c38;
      font-family: "Kumbh Sans", system-ui, sans-serif;
      font-size: clamp(15px, calc(0.6cqw + 0.9cqh), 26px);
      padding: 2.5em 1.5em;
      overflow: auto;
      /* center the content in the slide (margin:auto below keeps it
         scrollable instead of clipped when the screen is too short) */
      display: flex;
      flex-direction: column;
    }

    .columns {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 3.5em;
      max-width: 66em;
      width: 100%;
      margin: auto;
    }

    .col {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .title {
      background: var(--titleBg);
      color: #fff;
      font-weight: 700;
      font-size: 1.6em;
      padding: .45em 1em;
      border-radius: .25em;
      margin-bottom: 1.1em;
    }

    .lead {
      line-height: 1.6;
      font-size: 1.05em;
      margin: 0 0 1em;
      text-align: center;
    }

    .steps, .rules {
      text-align: left;
      margin: 0 0 1em;
      padding-left: 1.3em;
      font-size: 1em;
      line-height: 1.5;
    }
    .steps li, .rules li { margin: .5em 0; }
    .steps li::marker, .rules li::marker { font-weight: 700; color: var(--titleBg); }

    .formula {
      font-weight: 700;
      font-size: 1.15em;
      background: var(--titleBg);
      color: #fff;
      padding: .5em 1.2em;
      border-radius: .5em;
      margin: .4em 0 1.2em;
    }

    .table-wrap { overflow-x: auto; max-width: 100%; }
    table {
      border-collapse: collapse;
      font-size: .95em;
    }
    th, td {
      padding: .4em .9em;
      text-align: center;
      border-bottom: 1px solid #e8b3ae;
    }
    th { font-weight: 700; color: var(--titleBg); }
    tr.current td { font-weight: 700; background: #F9BEBA; }

    /* stage narrower than 800px (see cq-* classes in Demo.Slider) */
    :global(.cq-800) .columns { grid-template-columns: 1fr; gap: 2em; }
    :global(.cq-800) .slide { padding: 2.5em 1em 2em; }
  </style>
