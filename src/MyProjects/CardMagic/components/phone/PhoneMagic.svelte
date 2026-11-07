<script>
  // Phone portrait version of the magic trick (desktop/landscape use the slide deck).
  // Same deck, same answer logic (mindCycles.answerPile) and same database saving;
  // only the presentation is different: pick -> deal + question (x3) -> gather -> count -> end.
  import { onDestroy } from 'svelte';
  import { fly, fade } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { get } from 'svelte/store';
  import {
    arrayCards, cycle1array, cycle2array, cycle3array,
    mode, mindReady, reveal, triggerReset, about
  } from '../../stores/misc.js';
  import AboutYou from '../items/AboutYou.svelte';
  import { newDeck, getCardSrc } from '../../stores/deck.js';
  import { answerPile } from '../../stores/mindCycles.js';
  import { startSession, logEvent } from '../../stores/db.js';
  import { playSound, preloadSound, FLIP_SOUND } from '../../stores/sound.js';
  import cardBack from '../../svg/Cards_png/back.webp';

  const DEAL_SOUND = '/assets/CardMagic/deal2.m4a';   // AAC so iPhones can play it
  preloadSound(FLIP_SOUND);
  preloadSound(DEAL_SOUND);
  if (!$arrayCards?.length) $arrayCards = newDeck();

  const SUIT = { Spades: '♠︎', Hearts: '♥︎', Diamonds: '♦︎', Clubs: '♣︎' };
  const NAMES = { 1: 'Ace', 11: 'Jack', 12: 'Queen', 13: 'King' };
  const name = (c) => (c ? `${NAMES[c.value] ?? c.value} of ${c.suit}` : '');
  const key = (c) => `${c.value}_${c.suit}`;

  // about | pick | deal | gather | count | end
  let screen = $about.done ? 'pick' : 'about';
  $: if (screen === 'about' && $about.done) screen = 'pick';
  let cycle = 1;

  // ---------- pick ----------
  let picked = null;        // pick mode: the tapped card
  let locked = false;       // pick mode: "Lock it in!" pressed
  let changedMind = 0;
  $: cards = [...($arrayCards || [])].sort((a, b) => a.index - b.index);

  function tapCard(card) {
    if ($mode !== 'pick' || locked) return;
    if (picked && key(picked) !== key(card)) changedMind++;
    picked = card;
  }
  function lockIn() {
    locked = true;
    startSession();
    playSound(FLIP_SOUND);
  }
  function startTrick() {
    if ($mode === 'mind') { $mindReady = true; startSession(); }
    cycle = 1;
    startDeal();
  }

  // ---------- deal + question ----------
  let dealList = [];
  let dealt = [];           // [{ card, pile, row }]
  let dealing = false;
  let speed = 1;
  let dealTimer;
  let chosen = null;
  let wrong = false;
  let wrongTimer;

  function listFor(c) {
    if (c === 1) return [...get(arrayCards)].sort((a, b) => a.index - b.index);
    if (c === 2) return [...get(cycle1array)].sort((a, b) => a.cycle1pos - b.cycle1pos);
    return [...get(cycle2array)].sort((a, b) => a.cycle2pos - b.cycle2pos);
  }
  const place = (card, i) => ({ card, pile: (i % 3) + 1, row: Math.floor(i / 3) });
  const interval = () => (speed === 2 ? 150 : 300) * (cycle === 3 ? 0.7 : 1);

  function startDeal() {
    clearTimeout(dealTimer);
    dealList = listFor(cycle);
    dealt = [];
    chosen = null;
    wrong = false;
    screen = 'deal';
    dealing = true;
    dealTimer = setTimeout(dealNext, 350);
  }
  function dealNext() {
    if (dealt.length >= dealList.length) { dealing = false; return; }
    dealt = [...dealt, place(dealList[dealt.length], dealt.length)];
    playSound(DEAL_SOUND, { rate: speed === 2 ? 1.4 : 1 });
    dealTimer = setTimeout(dealNext, interval());
  }
  function skipDeal() {
    clearTimeout(dealTimer);
    dealt = dealList.map(place);
    dealing = false;
  }
  $: columns = [1, 2, 3].map((p) => dealt.filter((d) => d.pile === p));
  $: remaining = dealList.length - dealt.length;

  // Each dealt card flies from the deck (bottom) to its spot in the column
  let deckEl;
  function fromDeck(node, { el = deckEl, duration = 320 } = {}) {
    if (!el) return { duration: 0 };
    const d = el.getBoundingClientRect();
    const n = node.getBoundingClientRect();
    const dx = d.left + d.width / 2 - (n.left + n.width / 2);
    const dy = d.top + d.height / 2 - (n.top + n.height / 2);
    const sc = d.width / n.width;
    return {
      duration,
      easing: cubicOut,
      css: (t, u) => `transform: translate(${dx * u}px, ${dy * u}px) scale(${sc + (1 - sc) * t}); opacity: ${Math.min(1, t * 3)}`,
    };
  }
  const DEAL_TEXT = {
    1: ['Watch your card!', "I'm splitting the cards into three piles. Keep an eye on yours, then tell me which pile it's in."],
    2: ['Watch it again', 'Same thing: three new piles. Where does your card land this time?'],
    3: ['One last time', 'Last deal. Watch your card one more time.'],
  };

  function tapPile(p) {
    if (dealing) return;
    if ($mode === 'pick') {
      const right = (dealList.findIndex((c) => key(c) === key(picked)) % 3) + 1;
      if (p !== right) {
        chosen = null;
        wrong = true;
        clearTimeout(wrongTimer);
        wrongTimer = setTimeout(() => (wrong = false), 1800);
        logEvent('wrong_pile', cycle);
        return;
      }
    }
    wrong = false;
    chosen = p;
  }

  // ---------- gather ----------
  let merged = false;
  let gatherTimers = [];
  function confirmPile() {
    answerPile(cycle, chosen, { mode: $mode, changedMind: $mode === 'pick' ? changedMind : null });
    merged = false;
    screen = 'gather';
    gatherTimers = [
      setTimeout(() => (merged = true), 250),
      setTimeout(() => {
        if (cycle < 3) { cycle++; startDeal(); } else startCount();
      }, 1500),
    ];
  }

  // ---------- count + reveal ----------
  let finalList = [];
  let counted = 0;
  let flipped = false;
  let oops = false;
  let countTimer;
  $: revealed = finalList[13];

  // A different reveal line each time (never shows the card's position)
  const REVEAL_WORDS = [
    'Abracadabra!', 'Here we go!', 'Yikahaw!', 'And your card is…',
    'Ta-da!', 'Drumroll, please…', 'Hocus pocus!', 'Behold!', 'Voilà!',
    'Is this it? (Spoiler: yes)', 'Shazam!', 'I knew it all along…',
    'No peeking was involved', 'The cards never lie',
  ];
  let revealWord = REVEAL_WORDS[0];

  function startCount() {
    revealWord = REVEAL_WORDS[Math.floor(Math.random() * REVEAL_WORDS.length)];
    finalList = [...get(cycle3array)].sort((a, b) => a.cycle3pos - b.cycle3pos);
    counted = 0;
    flipped = false;
    oops = false;
    screen = 'count';
    countTimer = setTimeout(countNext, 500);
  }
  let countDeckEl;
  function countNext() {
    counted++;
    playSound(DEAL_SOUND, { rate: 1.2 });
    if (counted < 14) { countTimer = setTimeout(countNext, 230); return; }
    countTimer = setTimeout(() => {
      flipped = true;
      $reveal = true;                        // math unlocked if they turn the phone sideways
      playSound(FLIP_SOUND);
      logEvent('finished', null, { once: true });
    }, 700);                                   // after the 14th card lands in the middle
  }

  // ---------- end / replay ----------
  let showHow = false;
  function playAgain(switchMode = false) {
    clearAll();
    if (switchMode) $mode = $mode === 'mind' ? 'pick' : 'mind';
    triggerReset();                          // fresh deck + cleared deals (shared with desktop)
    if (!get(arrayCards)?.length) $arrayCards = newDeck();
    picked = null; locked = false; changedMind = 0;
    cycle = 1; dealt = []; chosen = null; finalList = []; showHow = false;
    screen = 'pick';
  }
  function clearAll() {
    clearTimeout(dealTimer); clearTimeout(wrongTimer); clearTimeout(countTimer);
    gatherTimers.forEach(clearTimeout);
  }
  onDestroy(clearAll);

  // top progress: pick, Q1, Q2, Q3, reveal
  $: stage = screen === 'pick' || screen === 'about' ? 0 : screen === 'count' || screen === 'end' ? 4 : cycle;
</script>

<div class="phone">
  <header class="top">
    <div class="dots" aria-label={`Step ${stage + 1} of 5`}>
      {#each [0, 1, 2, 3, 4] as d}<span class:on={d <= stage}></span>{/each}
    </div>
    {#if screen !== 'pick' && screen !== 'about'}
      <button type="button" class="restart" on:click={() => playAgain()} aria-label="Start over">↺</button>
    {/if}
  </header>

  <!-- =============== ABOUT YOU (optional, once per visit) =============== -->
  {#if screen === 'about'}
    <section class="screen center about-wrap" in:fade={{ duration: 250 }}>
      <AboutYou />
    </section>

  <!-- =============== PICK =============== -->
  {:else if screen === 'pick'}
    <section class="screen" in:fade={{ duration: 250 }}>
      {#if $mode === 'mind'}
        <h1>Think of a card</h1>
        <p class="sub">Pick one of <b>these 27 cards</b> in your mind, and don't tell me. I'll find it in <b>3 questions</b>.</p>
      {:else if !locked}
        <h1>Pick a card</h1>
        <p class="sub">Tap any card. Trust me, I won't look!</p>
      {:else}
        <h1>Remember it!</h1>
        <p class="sub">Your card is the <b>{name(picked)}</b>. I'll find it in <b>3 questions</b>.</p>
      {/if}

      <div class="grid">
        {#each cards as card (key(card))}
          {@const isPicked = picked && key(picked) === key(card)}
          <button type="button" class="g-card" class:picked={isPicked} class:static={$mode === 'mind'}
                  on:click={() => tapCard(card)} disabled={$mode === 'mind' || locked}
                  aria-label={$mode === 'mind' ? name(card) : 'Face-down card'}>
            <img src={$mode === 'mind' || (locked && isPicked) ? getCardSrc(card) : cardBack} alt="" draggable="false" />
          </button>
        {/each}
      </div>

      <div class="actions">
        {#if $mode === 'mind'}
          <button type="button" class="primary" on:click={startTrick}>I've got it!</button>
        {:else if !locked}
          <button type="button" class="primary" on:click={lockIn} disabled={!picked}>Lock it in!</button>
        {:else}
          <button type="button" class="primary" on:click={startTrick}>Start dealing →</button>
        {/if}
      </div>
    </section>

  <!-- =============== DEAL + QUESTION =============== -->
  {:else if screen === 'deal'}
    <section class="screen" in:fade={{ duration: 200 }}>
      {#if dealing}
        <p class="step-label">Deal {cycle} of 3</p>
        <h1 class="q">{DEAL_TEXT[cycle][0]}</h1>
        <p class="sub small-plain">{DEAL_TEXT[cycle][1]}</p>
      {:else}
        <p class="step-label">Question {cycle} of 3</p>
        <h1 class="q">{wrong ? 'Not that one, look again!' : 'Which pile is your card in?'}</h1>
        <!-- same text kept invisible so the header height (and the piles) don't move -->
        <p class="sub small-plain keep-space" aria-hidden="true">{DEAL_TEXT[cycle][1]}</p>
      {/if}

      <div class="columns">
        {#each [1, 2, 3] as p}
          <button type="button" class="col" class:chosen={chosen === p} class:waiting={dealing}
                  on:click={() => tapPile(p)} aria-label={`Pile ${p}`}>
            <div class="stack">
              {#each columns[p - 1] as d (key(d.card))}
                <div class="s-card" style="--r:{d.row}; z-index:{d.row + 1}" in:fromDeck>
                  <img src={getCardSrc(d.card)} alt={name(d.card)} draggable="false" />
                  <span class="suit-tag" class:light={d.card.suit === 'Hearts' || d.card.suit === 'Diamonds'}>{SUIT[d.card.suit]}</span>
                </div>
              {/each}
            </div>
            <span class="col-label">{chosen === p ? '✓ HERE' : `PILE ${p}`}</span>
          </button>
        {/each}
      </div>

      <div class="actions deal-actions">
        {#if dealing}
          <!-- the deck the cards are drawn from (shrinks as it deals) -->
          <div class="deck" bind:this={deckEl} aria-label={`${remaining} cards left`}>
            {#each Array(Math.min(6, Math.ceil(remaining / 4))) as _, k}
              <img src={cardBack} alt="" style="--k:{k}" draggable="false" />
            {/each}
          </div>
          <div class="speed" role="group" aria-label="Dealing speed">
            <button type="button" class:on={speed === 1} on:click={() => (speed = 1)}>1×</button>
            <button type="button" class:on={speed === 2} on:click={() => (speed = 2)}>2×</button>
            <button type="button" on:click={skipDeal}>Skip</button>
          </div>
        {:else}
          <button type="button" class="primary" on:click={confirmPile} disabled={!chosen}>
            {cycle < 3 ? 'Next deal →' : 'Find my card →'}
          </button>
        {/if}
      </div>
    </section>

  <!-- =============== GATHER =============== -->
  {:else if screen === 'gather'}
    <section class="screen center" in:fade={{ duration: 200 }}>
      <div class="gather" class:merged>
        {#each [1, 2, 3] as p}
          <div class="g-pile">
            {#each [0, 1, 2] as k}<img src={cardBack} alt="" style="--k:{k}" draggable="false" />{/each}
          </div>
        {/each}
      </div>
      <p class="gather-text"><b>Gathering…</b></p>
    </section>

  <!-- =============== COUNT + REVEAL =============== -->
  {:else if screen === 'count'}
    <section class="screen" in:fade={{ duration: 250 }}>
      <div class="counter">
        {#if counted >= 14}
          <!-- no position shown: keeps the secret (the 14th card) hidden -->
          <span class="big drawn">{revealWord}</span>
          <span class="step-label">&nbsp;</span>
        {:else}
          <span class="big drawing">Drawing…</span>
          <span class="step-label">&nbsp;</span>
        {/if}
      </div>
      <!-- cards come off the deck one by one; the 14th flies to the middle and flips -->
      <div class="count-row" aria-hidden="true">
        <div class="mini-stack" bind:this={countDeckEl}>
          {#each Array(Math.max(1, Math.min(6, Math.ceil((27 - counted) / 4)))) as _, k}
            <img src={cardBack} alt="" style="--k:{k}" draggable="false" />
          {/each}
        </div>
        <span class="count-arrow">→</span>
        <div class="mini-stack counted">
          {#each Array(Math.min(counted, 13)) as _, k (k)}
            <img src={cardBack} alt="" style="--k:{Math.min(k, 5)}" draggable="false" in:fromDeck={{ el: countDeckEl, duration: 200 }} />
          {/each}
        </div>
      </div>

      <div class="reveal-wrap">
        {#if counted >= 14}
          <div class="big-card" class:flipped in:fromDeck={{ el: countDeckEl, duration: 550 }}>
            <img class="face back" src={cardBack} alt="" draggable="false" />
            {#if revealed}<img class="face front" src={getCardSrc(revealed)} alt={name(revealed)} draggable="false" />{/if}
          </div>
        {/if}
      </div>
      <p class="sr-only" aria-live="polite">{flipped && revealed ? `Your card is the ${name(revealed)}` : ''}</p>

      <div class="answer" class:show={flipped}>
        {#if !oops}
          <h1 class="q">Is this <span class="pill">your card</span>?</h1>
          <p class="sub small">Of course it is. Nothing was left to chance…</p>
          <div class="two">
            <button type="button" class="primary heartbeat" on:click={() => (screen = 'end')} tabindex={flipped ? 0 : -1}>Yes!</button>
            <button type="button" class="secondary" on:click={() => (oops = true)} tabindex={flipped ? 0 : -1}>Not my card</button>
          </div>
        {:else}
          <h1 class="q">Hmm, that never happens…</h1>
          <p class="sub small">Maybe one pile answer slipped? Let's try again, and keep a close eye on your card.</p>
          <div class="two">
            <button type="button" class="primary" on:click={() => playAgain()}>Try again</button>
          </div>
        {/if}
      </div>
    </section>

  <!-- =============== END =============== -->
  {:else}
    <section class="screen center" in:fade={{ duration: 250 }}>
      <h1><span class="pill big-pill">That's the trick!</span></h1>
      <p class="sub">{$mode === 'mind' ? 'You never told me your card, and I still found it.' : 'Three questions were all it took.'}</p>
      <div class="end-actions">
        <button type="button" class="primary" on:click={() => (showHow = !showHow)}>How does it work?</button>
        {#if showHow}
          <p class="how" transition:fade={{ duration: 200 }}>
            Turn your phone sideways, then tap <b>“↓ See the math”</b> to walk through it step by step with your own cards.
          </p>
        {/if}
        <button type="button" class="secondary" on:click={() => playAgain()}>Play again</button>
        <!-- Mode switch (pick a card on screen) hidden for now; playAgain(true) still works.
        <button type="button" class="link" on:click={() => playAgain(true)}>
          {$mode === 'mind' ? 'Try it by picking a card on screen' : 'Try it by keeping a card in mind'}
        </button> -->
      </div>
    </section>
  {/if}
</div>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Kumbh+Sans:wght@400;700&display=swap');

  .phone {
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    background: #BFAFF7;
    color: #3F3075;
    font-family: 'Kumbh Sans', sans-serif;
    padding: max(12px, env(safe-area-inset-top)) 16px max(14px, env(safe-area-inset-bottom));
    overflow-y: auto;
    overscroll-behavior: contain;          /* no pull-to-refresh from inside the trick */
  }

  .top { display: flex; align-items: center; justify-content: center; position: relative; min-height: 28px; }
  .dots { display: flex; gap: 6px; }
  .dots span { width: 26px; height: 5px; border-radius: 3px; background: rgba(63, 48, 117, .2); transition: background .3s; }
  .dots span.on { background: #3F3075; }
  .restart {
    position: absolute; right: 0; top: 50%; transform: translateY(-50%);
    border: none; background: rgba(229, 222, 255, .7); color: #3F3075;
    width: 30px; height: 30px; border-radius: 50%; font-size: 1.05rem; cursor: pointer;
  }

  .screen { flex: 1; display: flex; flex-direction: column; align-items: center; text-align: center; padding-top: 10px; min-height: 0; }
  .screen.center { justify-content: center; }

  h1 { margin: 6px 0 4px; font-size: 1.6rem; font-weight: 800; line-height: 1.2; }
  h1.q { font-size: 1.35rem; }
  .sub { margin: 0 0 12px; font-size: .98rem; line-height: 1.4; color: #4A3F78; max-width: 22rem; }
  .sub.small { font-size: .85rem; font-style: italic; opacity: .85; margin-bottom: 10px; }
  .step-label { margin: 2px 0 0; font-size: .75rem; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: #5B4E88; }

  .pill { background: #5B4D88; color: #E5DEFE; padding: .05em .4em; border-radius: .3em; }
  .big-pill { font-size: 1.4rem; padding: .15em .6em; }

  /* ---------- buttons ---------- */
  .actions { width: 100%; margin-top: auto; padding-top: 12px; display: flex; justify-content: center; }
  .primary, .secondary {
    width: 100%; max-width: 22rem; border: none; border-radius: 14px; padding: 15px 18px;
    font-family: inherit; font-size: 1.1rem; font-weight: 800; cursor: pointer;
  }
  .primary { background: #3F3075; color: #fff; }
  .primary:disabled { opacity: .4; cursor: default; }
  .secondary { background: #E5DEFF; color: #3F3075; }
  .link { border: none; background: none; color: #3F3075; font-family: inherit; font-weight: 700; text-decoration: underline; padding: 8px; cursor: pointer; }

  /* ---------- pick grid (6 x 5) ---------- */
  .grid { width: 100%; margin: auto 0; display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 6px; }
  .g-card { padding: 0; border: none; background: none; cursor: pointer; transition: transform .15s; }
  .g-card.static { cursor: default; }
  .g-card img { width: 100%; aspect-ratio: 336 / 494; display: block; object-fit: contain; }
  .g-card.picked { transform: translateY(-8px) scale(1.08); filter: drop-shadow(0 6px 8px rgba(35, 25, 70, .35)); }
  .g-card:disabled { opacity: 1; }

  /* ---------- deal columns ---------- */
  /* columns narrow on short screens so the 9-card stacks always fit the height */
  .columns {
    width: 100%; max-width: calc((100dvh - 345px) * .716 + 68px);
    display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; margin: auto; padding-top: 10px;
  }
  .col {
    display: flex; flex-direction: column; align-items: stretch; gap: 8px;
    padding: 8px 6px 10px; border-radius: 16px; cursor: pointer;
    background: rgba(229, 222, 255, .45); border: 2px solid transparent;
    font-family: inherit; color: inherit; transition: background .2s, border-color .2s;
  }
  .col.waiting { cursor: default; }
  .col.chosen { background: rgba(229, 222, 255, .85); border-color: #3F3075; }
  .col-label { font-size: .75rem; font-weight: 800; letter-spacing: .06em; }

  /* each card overlaps the previous one, leaving its top strip (value + suit) visible */
  /* 9 cards: 8 strips of 34cqw + one full card (147cqw tall) */
  .stack { position: relative; width: 100%; aspect-ratio: 1 / 4.19; container-type: inline-size; }
  .s-card { position: absolute; left: 0; right: 0; top: calc(var(--r) * 34cqw); }
  .s-card img { width: 100%; aspect-ratio: 336 / 494; display: block; object-fit: contain; }
  .suit-tag {
    position: absolute; top: 10cqw; right: 13cqw;
    font-size: 17cqw; line-height: 1; font-weight: 800; color: #574B84;   /* spades / clubs, as on the cards */
  }
  .suit-tag.light { color: #8F83B8; }                                       /* hearts / diamonds, as on the cards */

  .actions:has(.deck) { justify-content: space-between; align-items: center; }
  .deck { position: relative; width: 70px; height: 103px; flex: 0 0 auto; }
  .deck img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain;
              transform: translate(calc(var(--k) * 2px), calc(var(--k) * -2px)); }
  .deck-count {
    position: absolute; right: -10px; bottom: -6px; z-index: 2;
    min-width: 26px; padding: 2px 6px; border-radius: 999px; box-sizing: border-box;
    background: #3F3075; color: #fff; font-size: .8rem; font-weight: 800; text-align: center;
  }
  .sub.small-plain { font-size: .88rem; margin: 2px 0 0; max-width: 21rem; }
  .keep-space { visibility: hidden; }
  /* same height while dealing (deck) and after (button), so the piles stay put */
  .deal-actions { min-height: 115px; align-items: center; }
  .speed { display: flex; gap: 8px; }
  .speed button {
    border: none; border-radius: 999px; padding: 9px 16px; font-family: inherit; font-weight: 800; font-size: .9rem;
    background: rgba(229, 222, 255, .7); color: #3F3075; cursor: pointer;
  }
  .speed button.on { background: #3F3075; color: #fff; }

  /* ---------- gather ---------- */
  .gather { display: flex; gap: 14px; margin: 22px 0 18px; }
  .g-pile { position: relative; width: 72px; height: 106px; transition: transform .3s; }
  .g-pile img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; transform: translate(calc(var(--k) * 3px), calc(var(--k) * -3px)); }
  /* the outer piles slide onto the middle one: three piles become one deck */
  .gather .g-pile { transition: transform .45s cubic-bezier(.5, 0, .2, 1); }
  .gather.merged .g-pile:nth-child(1) { transform: translateX(calc(100% + 14px)); }
  .gather.merged .g-pile:nth-child(3) { transform: translateX(calc(-100% - 14px)); }
  .gather-text { margin: 0; font-size: 1.05rem; line-height: 1.5; }

  /* ---------- count + reveal ---------- */
  .counter { display: flex; flex-direction: column; align-items: center; margin-top: 4px; }
  .big { font-size: 3.4rem; font-weight: 800; line-height: 1; }
  .big small { font-size: .45em; margin-left: .05em; }
  .big.drawn { font-size: clamp(1.3rem, 7vw, 2.2rem); line-height: 1.55; white-space: nowrap; }   /* long lines shrink to one line */
  .big.drawing { font-size: 2.2rem; line-height: 1.55; animation: pulse 1.1s ease-in-out infinite; }
  @keyframes pulse { 0%, 100% { opacity: .55; } 50% { opacity: 1; } }
  .count-row { display: flex; align-items: center; justify-content: center; gap: 22px; margin: 12px 0 4px; }
  .mini-stack { position: relative; width: 58px; height: 85px; }
  .mini-stack img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain;
                    transform: translate(calc(var(--k) * 2px), calc(var(--k) * -2px)); }
  .mini-stack .tag {
    position: absolute; right: -10px; bottom: -6px; z-index: 30; min-width: 24px; padding: 2px 6px; box-sizing: border-box;
    border-radius: 999px; background: #3F3075; color: #fff; font-size: .75rem; font-weight: 800; text-align: center;
  }
  .count-arrow { font-size: 1.4rem; font-weight: 800; color: #5B4E88; }

  .reveal-wrap { flex: 1; display: flex; align-items: center; justify-content: center; min-height: 0; width: 100%; perspective: 900px; }
  .big-card { position: relative; height: min(34vh, 260px); aspect-ratio: 336 / 494; transform-style: preserve-3d; transition: transform .7s; }
  .big-card.flipped { transform: rotateY(180deg); }
  .face { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; backface-visibility: hidden; }
  .face.front { transform: rotateY(180deg); }

  .answer { width: 100%; display: flex; flex-direction: column; align-items: center; visibility: hidden; opacity: 0; transition: opacity .35s; }
  .answer.show { visibility: visible; opacity: 1; }
  .two { width: 100%; max-width: 22rem; display: flex; gap: 10px; }
  .two > * { flex: 1; }
  .answer.show .heartbeat { animation: heartbeat 1.3s ease-in-out .6s infinite; }
  @keyframes heartbeat { 0%, 40%, 100% { transform: scale(1); } 10% { transform: scale(1.06); } 20% { transform: scale(1); } 30% { transform: scale(1.04); } }

  /* ---------- end ---------- */
  .end-actions { width: 100%; display: flex; flex-direction: column; align-items: center; gap: 10px; margin-top: 18px; }
  .how { margin: 0; max-width: 22rem; font-size: .92rem; line-height: 1.45; background: rgba(229, 222, 255, .7); padding: 10px 14px; border-radius: 12px; }

  .about-wrap { font-size: 14px; }

  .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }

  @media (prefers-reduced-motion: reduce) {
    .phone *, .phone *::before, .phone *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
  }
</style>
