<script>
	export let correctPassword = "1130";
  export let hint = "Hint: Take the I-44";
	export let extraHint = "Another hint: We went to Sami Chaifi on this day (mmdd).";
  export let placeholder = "Enter a 4 digit number";
  import pdfUrl from './20082015.pdf'


	import { style } from 'svelte-body';

  let passwordInput = "";
  let attempts = 0;
  let checked = false; // whether the user has attempted a check in this round
  let showPassword = true;

  const handleCheck = () => {
    checked = true;
    if (!isCorrect) {
      attempts += 1;
    }
  };

  const reset = () => {
    passwordInput = "";
    checked = false;
  };

  $: isCorrect = passwordInput === correctPassword;


  import { flip } from 'svelte/animate';
  import { quintOut } from 'svelte/easing';

  let words = [
    "Nawarry",
    "Habibi",
    "Rouhy",
    "Nawarty",
    "Tofla",
    "Nour Inaya",
    "Mezyena",
    "Narvouzty",
    "Habboubi",
    "Mra",
    "El Nouri",
    "Mtaa el Burgundy",
    "Sitt el kol",
    "Mtaa el Matouia",
    "Mannequin",
    "Halloufa",
    "Khabbeza",
    "Mtaa limech",
    "Princessa",
    "❤️"    
  ];

  let index = 0;

  // change word every 0.5s
  const interval = setInterval(() => {
    index = (index + 1) % words.length;
  }, 1000);


</script>

<div class="center">
	<h1>
        Aaslema<br>ya 
        {#each [words[index]] as word (word)}
          <span class="word" animate:flip={{ duration: 1000, easing: quintOut }}>
            {word}!
          </span>
        {/each}
      </h1>
	<h3> We made it to one year of maa baadhina!! <br>
	This is my gift to you this year, Hope you like it!</h3>
	<h4> To see the gift, I need to verify that this is truly you<br>You will need a password and it is the distance <br>between my house and yours in Miles.</h4>


<form on:submit|preventDefault={handleCheck} class="gate">
  <label for="pw" style="font-family: 'PompadourBold', sans-serif;">Password</label>
  <div class="input-row">
    <input
    id="pw"
    name="pw"
    type={showPassword ? "text" : "password"}
    value={passwordInput}
    on:input={(e) => passwordInput = e.target.value}
    placeholder={placeholder}
    autocomplete="off"
    aria-describedby="pw-help"
    style="font-family: 'PompadourBold', sans-serif; font-size: 16px;"
  />
  </div>
  <button type="submit" class="check" style="font-family: 'PompadourBold', sans-serif;">Check</button>
  
  <div id="pw-help" class="help" aria-live="polite">
    {#if checked && !isCorrect}
      <span class="error"style="font-family: 'PompadourBold', sans-serif;">Incorrect password. Try again.</span>
       {#if attempts >= 3 && attempts < 5}
        <div class="hint" style="font-family: 'PompadourBold', sans-serif;">{hint}</div>
      {/if}
      {#if attempts >= 5}
        <div class="hint" style="font-family: 'PompadourBold', sans-serif;">{extraHint}</div>
      {/if}
    {/if}
  </div>
</form>

 
{#if isCorrect}
  <a href= {pdfUrl} target="_blank" rel="noopener noreferrer" class="enter" style="font-family: 'PompadourBold', sans-serif;">
    Good Job, click to Enter
  </a>
{/if}
</div>

<svelte:body use:style={"background-color: #f2f3f2;"} />
<style>
    @font-face {
  font-family: 'PompadourBold';
  src: url('./fonts/03_APompadourBoldSample.otf') format('opentype');
  font-weight: normal;
  font-style: normal;
}


	.center{
		text-align: center;
		justify-items: center;
		margin-top: 10%;
        margin-left: 10%;
        margin-right: 10%;
	}

    h1{
			margin-bottom:0;
		color: #ca353d;
		font-size: 3rem;
		 display: inline-block;
         font-family: 'PompadourBold', sans-serif;
        perspective: 500px; /* to make 3D flip visible */
	}
  .word {
    display: inline-block;
    transform-origin: center;
  }

	h3 {
		/* margin-top:-0.5%; */
		color: #ca353d;
        font-family: 'PompadourBold', sans-serif;
	}

	h4{
		color: #4d4f4d;
        font-family: 'PompadourBold', sans-serif;
	}


	 .gate { display: grid; gap: 0.5rem; max-width: 420px;}
  label { font-weight: 600; }
  .input-row { display: grid; grid-template-columns: 1fr auto auto; align-items: center; }
  input { padding: 0.6rem 0.75rem; border: 1px solid #cbd5e1; border-radius: 0.75rem; outline: none; }
  input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,.15); }
  .check { padding: 0.6rem 0.9rem; border: 1px solid #4d4f4d; background: #4d4f4d; color: white; border-radius: 0.75rem; cursor: pointer; }
  .enter { margin-top: 0.25rem; padding: 0.75rem 1rem; border: 1px solid #feea00; background: #feea00; color: #4d4f4d; border-radius: 0.75rem; cursor: pointer; }
  .help { min-height: 1.25rem; color: #6b7280; }
  .error { color: #ca353d; font-weight: 500; }
  .hint { margin-top: 0.25rem; padding: 0.5rem 0.75rem; background: #fff7ed; border-radius: 0.5rem; color: #ca353d; }
</style>