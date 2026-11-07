<script>
  // Optional "before I read your mind" question (age range + gender), shown once per
  // visit before the first page on desktop and on phones. Saved with the card pick.
  import { onMount } from 'svelte';
  import { about } from '../../stores/misc.js';
  import { getCardSrc } from '../../stores/deck.js';
  import cardBack from '../../svg/Cards_png/back.webp';

  // Decorative fan of 4 cards; a random one starts face up (a random card) and
  // turns face down after 3 s. Different every time the screen opens.
  const SUITS = ['Spades', 'Hearts', 'Diamonds', 'Clubs'];
  const FACE_UP = Math.floor(Math.random() * 4);                     // which card of the fan (0-3)
  const shown = { suit: SUITS[Math.floor(Math.random() * 4)], value: 1 + Math.floor(Math.random() * 13) };
  let faceUp = true;
  onMount(() => {
    const t = setTimeout(() => (faceUp = false), 3000);
    return () => clearTimeout(t);
  });

  // "Tonight" adapts to the visitor's local hour
  const hour = new Date().getHours();
  const when = hour >= 5 && hour < 12 ? 'This morning' : hour >= 12 && hour < 17 ? 'This afternoon' : 'Tonight';

  const AGES = ['Under 18', '18–24', '25–34', '35–44', '45–54', '55+'];
  const GENDERS = ['Woman', 'Man', 'Non-binary', 'Prefer not to say'];

  let ageRange = $about.ageRange;
  let gender = $about.gender;

  function done(skip = false) {
    $about = skip ? { ageRange: null, gender: null, done: true } : { ageRange, gender, done: true };
  }
</script>

<div class="about">
  <p class="kicker"><span aria-hidden="true">✦</span> Welcome to the show <span aria-hidden="true">✦</span></p>
  <h1>Hello, and welcome!</h1>
  <p class="sub">
    {when}, I'll read your mind and find your card in just <b>3 questions</b>.<br />
    But every good magician knows their audience first… tell me a little about yourself.
  </p>

  <div class="fan" aria-hidden="true">
    {#each [0, 1, 2, 3] as i}
      <div class="fan-card" style="--i:{i}">
        <div class="flip" class:up={i === FACE_UP && faceUp}>
          <img class="face back" src={cardBack} alt="" draggable="false" />
          {#if i === FACE_UP}<img class="face front" src={getCardSrc(shown)} alt="" draggable="false" />{/if}
        </div>
      </div>
    {/each}
  </div>

  <div class="group" role="group" aria-label="Your age">
    <p class="label">Age</p>
    <div class="chips">
      {#each AGES as a}
        <button type="button" class="chip" class:active={ageRange === a} aria-pressed={ageRange === a}
                on:click={() => (ageRange = ageRange === a ? null : a)}>{a}</button>
      {/each}
    </div>
  </div>

  <div class="group" role="group" aria-label="Your gender">
    <p class="label">Gender</p>
    <div class="chips">
      {#each GENDERS as g}
        <button type="button" class="chip" class:active={gender === g} aria-pressed={gender === g}
                on:click={() => (gender = gender === g ? null : g)}>{g}</button>
      {/each}
    </div>
  </div>

  <button type="button" class="continue" on:click={() => done()}>Let the show begin ✦</button>
  <button type="button" class="skip" on:click={() => done(true)}>Skip</button>
  <p class="privacy">Optional and anonymous, just for academic purposes.</p>
</div>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Kumbh+Sans:wght@400;700&display=swap');

  .about {
    position: relative;
    display: flex; flex-direction: column; align-items: center; text-align: center;
    font-family: 'Kumbh Sans', sans-serif; color: #3F3075; width: 100%;
  }
  /* soft stage spotlight behind the welcome */
  .about::before {
    content: ''; position: absolute; z-index: -1; left: 50%; top: -2em; transform: translateX(-50%);
    width: min(40em, 120%); height: 18em; border-radius: 50%;
    background: radial-gradient(closest-side, rgba(255, 255, 255, .45), rgba(255, 255, 255, 0));
    pointer-events: none;
  }
  .kicker {
    margin: 0 0 .5em; font-size: .85em; font-weight: 800; letter-spacing: .18em; text-transform: uppercase;
    color: #5B4E88;
  }
  .kicker span { display: inline-block; animation: twinkle 2.4s ease-in-out infinite; }
  .kicker span:last-child { animation-delay: 1.2s; }
  @keyframes twinkle { 0%, 100% { opacity: .35; transform: scale(.85); } 50% { opacity: 1; transform: scale(1.15); } }
  h1 { margin: 0 0 .3em; font-size: 2em; font-weight: 800; }
  .sub { margin: 0 0 1.4em; font-size: 1.05em; color: #4A3F78; max-width: 30em; line-height: 1.45; }
  /* fan of 4 cards in an arc */
  .fan { position: relative; width: 13em; height: 8.6em; margin: 0 auto 1.3em; }
  .fan-card {
    position: absolute; left: 50%; bottom: 0; width: 4.4em; height: 6.5em; margin-left: -2.2em;
    transform-origin: 50% 120%;
    transform: rotate(calc((var(--i) - 1.5) * 13deg)) translateY(calc(-1 * (1.5 - (var(--i) - 1.5) * (var(--i) - 1.5) * .6) * .5em));
    perspective: 600px;
  }
  .flip { position: relative; width: 100%; height: 100%; transform-style: preserve-3d; transition: transform .7s; transform: rotateY(180deg); }
  .flip.up { transform: rotateY(0deg); }
  .face { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; backface-visibility: hidden; }
  .face.back { transform: rotateY(180deg); }

  /* short screens (e.g. iPhone SE): smaller fan so the whole welcome fits */
  @media (max-height: 720px) {
    .fan { width: 10em; height: 6.4em; margin-bottom: .8em; }
    .fan-card { width: 3.3em; height: 4.9em; margin-left: -1.65em; }
    .sub { margin-bottom: 1em; }
  }

  .group { margin-bottom: 1.1em; width: 100%; max-width: 34em; }
  .label { margin: 0 0 .5em; font-size: .8em; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: #5B4E88; }
  .chips { display: flex; flex-wrap: wrap; justify-content: center; gap: .45em; }
  .chip {
    font-family: inherit; font-weight: 700; font-size: .95em; color: #3F3075;
    background: #E5DEFF; border: none; border-radius: .6em; padding: calc(.45em + 2px) calc(.85em + 2px); cursor: pointer;   /* no outline; padding keeps the old size */
    box-shadow: 0 .15em 0 #9B8FD0; transition: transform .1s, box-shadow .1s;
  }
  .chip:hover, .chip:focus-visible { transform: translateY(-1px); }
  .chip:active { transform: translateY(.12em); box-shadow: none; }
  .chip.active { background: #3F3075; color: #fff; box-shadow: 0 .15em 0 #241a4d; }
  .continue {
    margin-top: .6em; min-width: 12em; font-family: inherit; font-size: 1.1em; font-weight: 800;
    color: #fff; background: #3F3075; border: none; border-radius: .7em; padding: .75em 1.6em; cursor: pointer;
  }
  .skip {
    margin-top: .5em; font-family: inherit; font-size: .95em; font-weight: 700; color: #3F3075;
    background: none; border: none; text-decoration: underline; cursor: pointer; padding: .3em;
  }
  .privacy { margin: .6em 0 0; font-size: .78em; opacity: .75; }
</style>
