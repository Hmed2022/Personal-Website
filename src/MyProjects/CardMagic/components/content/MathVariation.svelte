<script>
  // Last math slide: "Try it yourself" as six picture tiles, then "Variations" as a
  // small calculator (pick cards + piles -> rules, deals, final position, mini funnel).

  // ---------- Try it yourself ----------
  const steps = [
    { art: 'deck',   title: 'Take 27 cards',      text: 'A friend picks one and remembers it.' },
    { art: 'deal',   title: 'Deal into 3 piles',  text: 'Face up, one at a time, left to right.' },
    { art: 'ask',    title: 'Ask which pile',     text: 'Their card is in one of them.' },
    { art: 'middle', title: 'Their pile in the middle', text: 'Gather the piles. That’s the secret!', key: true },
    { art: 'repeat', title: 'Two more times',     text: 'Deal, ask, gather: 3 deals in total.' },
    { art: 'count',  title: 'Count to 14',        text: 'Top or bottom: the 14th is their card.' },
  ];

  // ---------- Variations ----------
  const CARD_OPTIONS = [15, 21, 25, 27, 33, 45];
  const PILE_OPTIONS = [3, 4, 5];
  let N = 27;
  let P = 3;

  $: oddPiles = P % 2 === 1;
  $: evenSplit = N % P === 0;
  $: valid = oddPiles && evenSplit;
  // Same rule as the trick: deal round-robin into P piles, gather with the target's pile
  // in the middle. Records every position the target can have after each deal.
  function simulate(n, p, deals) {
    const stages = Array.from({ length: deals }, () => new Set());
    for (let target = 0; target < n; target++) {
      let order = Array.from({ length: n }, (_, i) => i);
      for (let d = 0; d < deals; d++) {
        const piles = Array.from({ length: p }, () => []);
        order.forEach((card, pos) => piles[pos % p].push(card));
        piles.forEach((pile) => pile.reverse());
        const tp = piles.findIndex((pile) => pile.includes(target));
        const others = piles.map((_, i) => i).filter((i) => i !== tp);
        const half = others.length / 2;
        order = [...others.slice(0, half), tp, ...others.slice(half)].flatMap((i) => piles[i]);
        stages[d].add(order.indexOf(target));
      }
    }
    return stages;
  }

  // deals needed: the smallest D with P^D >= N; the card always ends in the middle,
  // at (N + 1) / 2 (checked by simulating every combination offered here)
  $: deals = (() => { let d = 0; while (P ** d < N) d++; return d; })();
  $: middle = (N + 1) / 2;
  $: power = Array(deals).fill(P).join(' × ');
  // funnel rows: all cards at the start, then where the card can be after each deal
  $: rows = valid
    ? [{ label: 'start', lit: new Set(Array.from({ length: N }, (_, i) => i)) },
       ...simulate(N, P, deals).map((st, d) => ({ label: `deal ${d + 1}`, lit: st }))]
    : [];
  const ord = (n) => n + (n % 10 === 1 && n % 100 !== 11 ? 'st' : n % 10 === 2 && n % 100 !== 12 ? 'nd' : n % 10 === 3 && n % 100 !== 13 ? 'rd' : 'th');
</script>

<main class="slide">
  <div class="content">

    <!-- ===== Try it yourself ===== -->
    <section>
      <h2 class="heading">Try it yourself</h2>
      <ol class="tiles">
        {#each steps as step, i}
          <li class="tile" class:key={step.key}>
            <span class="num">{i + 1}</span>
            <div class="art" aria-hidden="true">
              {#if step.art === 'deck'}
                <div class="stack">{#each Array(5) as _, k}<span class="mini" style="--k:{k}"></span>{/each}</div>
              {:else if step.art === 'deal' || step.art === 'ask' || step.art === 'middle'}
                <div class="piles3">
                  {#each [0, 1, 2] as p}
                    <span class="mini pile" class:mark={step.art === 'middle' && p === 1}>
                      {#if step.art === 'ask'}<b>?</b>{/if}
                    </span>
                  {/each}
                </div>
              {:else if step.art === 'repeat'}
                <div class="repeat"><span class="loop">↻</span><b>×2</b></div>
              {:else}
                <div class="row14">{#each Array(7) as _, k}<span class="mini small" class:mark={k === 3}></span>{/each}</div>
              {/if}
            </div>
            <p class="t-title">{step.title}</p>
            <p class="t-text">{step.text}</p>
          </li>
        {/each}
      </ol>
    </section>

    <!-- ===== Variations ===== -->
    <section class="vars">
      <h2 class="heading">Variations</h2>
      <p class="lead">Use a different number of cards or piles: pick a combination to get your recipe.</p>

      <div class="calc">
        <div class="controls">
          <p class="hint">Tap a number to try it</p>
          <div class="picker">
            <span class="pick-label">Cards</span>
            <div class="chips">
              {#each CARD_OPTIONS as n}
                <button type="button" class="chip" class:active={N === n} on:click={() => (N = n)}>{n}</button>
              {/each}
            </div>
          </div>
          <div class="picker">
            <span class="pick-label">Piles</span>
            <div class="chips">
              {#each PILE_OPTIONS as p}
                <button type="button" class="chip" class:active={P === p} on:click={() => (P = p)}>{p}</button>
              {/each}
            </div>
          </div>

          <ul class="rules">
            <li class:ok={oddPiles} class:bad={!oddPiles}>
              <span class="icon">{oddPiles ? '✓' : '✗'}</span> Odd number of piles, so there's a middle pile
            </li>
            <li class:ok={evenSplit} class:bad={!evenSplit}>
              <span class="icon">{evenSplit ? '✓' : '✗'}</span> {N} cards split evenly into {P} piles
            </li>
            <li class:ok={valid} class:off={!valid}>
              <span class="icon">{valid ? '✓' : '–'}</span>
              {#if valid}Enough deals: {power} = {P ** deals} ≥ {N}{:else}Enough deals{/if}
            </li>
          </ul>
        </div>

        <div class="outcome" aria-live="polite">
          {#if valid}
            <p class="recipe-title">Your recipe with {N} cards</p>
            <ol class="recipe">
              <li class="r-tile">
                <div class="r-art" aria-hidden="true">{#each Array(P) as _}<span class="mini"></span>{/each}</div>
                <b>Deal into {P} piles</b>
                <small>their pile in the middle</small>
              </li>
              <li class="r-arrow" aria-hidden="true">→</li>
              <li class="r-tile">
                <div class="r-art" aria-hidden="true"><span class="loop">↻</span><b class="times">×{deals}</b></div>
                <b>Do it {deals} times</b>
                <small>{power} = {P ** deals} ≥ {N}</small>
              </li>
              <li class="r-arrow" aria-hidden="true">→</li>
              <li class="r-tile key">
                <div class="r-art" aria-hidden="true"><span class="pos">{ord(middle)}</span></div>
                <b>Count to the {ord(middle)}</b>
                <small>the middle card: ({N} + 1) / 2</small>
              </li>
            </ol>
            <div class="mini-funnel" style="--n:{N}" aria-label="Where the card can be after each deal">
              {#each rows as row, r}
                <div class="mf-row">
                  <span class="mf-label">{row.label}</span>
                  <span class="mf-squares">
                    {#each Array(N) as _, i}
                      <span class="mf-sq" class:on={row.lit.has(i)} class:final={r === rows.length - 1 && row.lit.has(i)}></span>
                    {/each}
                  </span>
                </div>
              {/each}
            </div>
          {:else}
            <p class="answer warn">
              {#if !oddPiles}With {P} piles there's no middle pile, so the trick can't work.
              {:else}{N} cards don't split evenly into {P} piles.{/if}
            </p>
          {/if}
        </div>
      </div>
    </section>

  </div>
</main>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Kumbh+Sans:wght@400;700&display=swap');

  /* One fluid base size (grows with the stage); everything else in em */
  .slide {
    height: 100%;
    box-sizing: border-box;
    background-color: #FDD4D4;
    color: #6b3c38;
    font-family: "Kumbh Sans", system-ui, sans-serif;
    font-size: clamp(13px, min(calc(0.5cqw + 0.75cqh), 2.4cqh), 22px);
    padding: 1.5em 1.5em;
    overflow: auto;
    display: flex;
    flex-direction: column;
  }
  .content { margin: auto; width: 100%; max-width: 62em; display: flex; flex-direction: column; gap: 1.6em; }
  section { display: flex; flex-direction: column; align-items: center; }

  .heading { margin: 0 0 .7em; font-size: 1.5em; font-weight: 800; color: #A34C49; }

  /* ---------- tiles ---------- */
  .tiles {
    list-style: none; margin: 0; padding: 0;
    display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: .7em; width: 100%;
  }
  .tile {
    position: relative;
    background: #F9BEBA; border-radius: .8em;
    padding: .8em .6em .7em;
    display: flex; flex-direction: column; align-items: center; text-align: center;
  }
  .tile.key { background: #874C47; color: #FDD4D4; }
  .num {
    position: absolute; top: .45em; left: .55em;
    font-size: .75em; font-weight: 800; opacity: .7;
  }
  .t-title { margin: .55em 0 .2em; font-weight: 800; font-size: .95em; line-height: 1.2; }
  .t-text { margin: 0; font-size: .78em; line-height: 1.35; opacity: .9; }

  /* tiny drawn cards / piles */
  .art { height: 3.2em; display: flex; align-items: center; justify-content: center; }
  .mini {
    display: inline-block; width: 1.5em; height: 2.1em; border-radius: .25em;
    background: #FDD4D4; border: 2px solid #D47D79; box-sizing: border-box;
  }
  .key .mini { background: #F9BEBA; border-color: #FDD4D4; }
  .mini.mark { background: #874C47; border-color: #874C47; }
  .key .mini.mark { background: #FDD4D4; border-color: #FDD4D4; }
  .stack { position: relative; width: 2.6em; height: 2.1em; }
  .stack .mini { position: absolute; left: calc(var(--k) * .22em); top: calc(var(--k) * -.08em); }
  .piles3 { display: flex; gap: .3em; }
  .pile { display: grid; place-items: center; }
  .pile b { font-size: .9em; color: #A34C49; }
  .repeat { display: flex; align-items: center; gap: .2em; }
  .loop { font-size: 2em; line-height: 1; color: #A34C49; }
  .repeat b { font-size: 1.1em; color: #A34C49; }
  .row14 { display: flex; gap: .15em; }
  .mini.small { width: .8em; height: 1.2em; border-width: 1.5px; }

  /* ---------- calculator ---------- */
  .lead { margin: 0 0 .9em; font-size: 1em; }
  .calc {
    width: 100%;
    display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.25fr); gap: 1.6em;
    background: #F9BEBA; border-radius: 1em; padding: 1.1em 1.3em;
    box-sizing: border-box;
  }
  .picker { display: flex; align-items: center; gap: .7em; margin-bottom: .6em; }
  .pick-label { width: 3.2em; font-weight: 800; font-size: .95em; }
  .chips { display: flex; flex-wrap: wrap; gap: .35em; }
  /* chips look like real buttons: outline + raised bottom edge, press down on click */
  .chip {
    font-family: inherit; font-weight: 800; font-size: .95em; color: #A34C49;
    background: #FFF0EF; border: 2px solid #D47D79; border-radius: .55em;
    padding: .3em .75em; cursor: pointer;
    box-shadow: 0 .18em 0 #D47D79;
    transition: transform .1s, box-shadow .1s, background .15s;
  }
  .chip:hover, .chip:focus-visible { background: #fff; transform: translateY(-1px); box-shadow: 0 .26em 0 #D47D79; }
  .chip:active { transform: translateY(.15em); box-shadow: 0 0 0 #D47D79; }
  .chip.active { background: #874C47; border-color: #874C47; color: #FDD4D4; box-shadow: 0 .18em 0 #5E3330; }
  .hint { margin: 0 0 .7em; font-size: .85em; font-weight: 700; color: #A34C49; }

  .rules { list-style: none; margin: .9em 0 0; padding: 0; font-size: .9em; }
  .rules li { display: flex; gap: .5em; align-items: baseline; margin: .35em 0; }
  .icon { width: 1.1em; font-weight: 800; text-align: center; }
  .rules li.ok .icon { color: #874C47; }
  .rules li.bad { color: #874C47; font-weight: 700; }
  .rules li.bad .icon { color: #C2412F; }
  .rules li.off { opacity: .5; }

  .outcome { display: flex; flex-direction: column; justify-content: center; }

  .answer { margin: 0; font-size: 1.05em; }
  .answer.warn { font-weight: 700; color: #874C47; }

  /* recipe: same tile style as "Try it yourself" */
  .recipe-title { margin: 0 0 .6em; font-weight: 800; font-size: 1.05em; }
  .recipe { list-style: none; margin: 0; padding: 0; display: flex; align-items: stretch; gap: .45em; }
  .r-tile {
    flex: 1; background: #FDD4D4; border-radius: .7em; padding: .6em .5em;
    display: flex; flex-direction: column; align-items: center; text-align: center; gap: .2em;
  }
  .r-tile b { font-size: .92em; line-height: 1.2; }
  .r-tile small { font-size: .74em; opacity: .85; }
  .r-tile.key { background: #874C47; color: #FDD4D4; }
  .r-arrow { align-self: center; font-weight: 800; color: #A34C49; }
  .r-art { height: 2.2em; display: flex; align-items: center; justify-content: center; gap: .2em; }
  .r-art .mini { width: 1.05em; height: 1.5em; }
  .times { font-size: 1em; color: #A34C49; }
  .pos { background: none; padding: 0; font-size: 1.6em; font-weight: 800; color: #FDD4D4; }

  .mini-funnel { display: flex; flex-direction: column; gap: .3em; margin-top: .9em; }
  .mf-row { display: flex; align-items: center; gap: .6em; }
  .mf-label { width: 3.6em; font-size: .75em; font-weight: 700; text-align: right; flex: 0 0 auto; }
  .mf-squares { flex: 1; display: grid; grid-template-columns: repeat(var(--n), minmax(0, 1fr)); gap: 2px; }
  .mf-sq { height: .9em; border-radius: 2px; background: #FDD4D4; }
  .mf-sq.on { background: #D47D79; }
  .mf-sq.final { background: #874C47; }

  /* narrow stage (see cq-* classes in Demo.Slider): stack things */
  :global(.cq-900) .tiles { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  :global(.cq-800) .calc { grid-template-columns: 1fr; }
</style>
