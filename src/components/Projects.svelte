<script>
    // import { imageData } from "../components/images.js";
    // import { Center}  from '@svelteuidev/core';
    import {fade} from 'svelte/transition'
    import {onMount} from 'svelte'
    import { imageData } from '../components/images.js';

    let show = false

    onMount(() => {
        show=true
    }
    )

    let buttontag="all";
    function SetButton(buttonName) {
        // Reset all variables to false
        buttontag="";

        // Set the variable corresponding to the clicked button to true
        if (buttonName === "All") {
          buttontag = 'all';
        } else if (buttonName === "Svelte") {
          buttontag = 'svelte';
        } else if (buttonName === "Data Visualization") {
          buttontag = 'dataviz';
        } else if (buttonName === "Infographic") {
          buttontag = 'info';
        } else if (buttonName === "Tunisia") {
          buttontag = 'tunisia';
        } else if (buttonName === "Machine Learning") {
          buttontag = 'ml';
        } else if (buttonName === "Story") {
          buttontag = 'story';
        } else if (buttonName === "Data Science") {
          buttontag = 'ds';
        } else if (buttonName === "D3") {
          buttontag = 'd3';
        } else if (buttonName === "SQL") {
          buttontag = 'sql';
        }
    }
  </script>


<div class="buttons">
  <button on:click={() => SetButton("All")} class="all">All</button>
  <button on:click={() => SetButton("Svelte")} class="svelte">Svelte</button>
  <button on:click={() => SetButton("Data Visualization")} class="Viz">Data Visualization</button>
  <button on:click={() => SetButton("Infographic")} class="info">Infographic</button>
  <button on:click={() => SetButton("Tunisia")} class="tunisia">Tunisia</button>
  <button on:click={() => SetButton("Machine Learning")} class="ml">Machine Learning</button>
  <button on:click={() => SetButton("Story")} class="story">Story</button>
  <button on:click={() => SetButton("Data Science")} class="ds">Data Science</button>
  <button on:click={() => SetButton("D3")} class="d3">D3</button>
  <button on:click={() => SetButton("SQL")} class="sql">SQL</button>
</div>

{#if show}
<section>
    {#each imageData as image, i}
    {#if image.show && image.tags.includes(buttontag)}
    <!-- <div class="card__wrapper" transition:fade={{delay:100}}> -->
    <div class="card__wrapper">
        <div class="card__body">
        </div>
            
                <img class="image" src='{image.url}' alt="card" />
           
            <a href={image.href}>
            <div class="overlay">
                
                <h2>{image.title} <br>
                  <span class="cview">{image.desc}</span><br><br>
                   <span class="cview">-Click to Read-</span> </h2>
           
              </div> 
            </a>
    </div>
    {/if}
    {/each}
</section>
{/if}

  <style>

    @import url('https://fonts.googleapis.com/css2?family=Jost:wght@500&family=Quicksand:wght@300;400;500;700&display=swap');

    /* img:hover { opacity: 0.7 } */

    .cview{
        font-weight: 300;
        font-size: 0.7em ;
    }


    section {
      display: grid;
      max-width: 100vw;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      grid-gap: 0.2rem;
      margin-left: 10%;
      margin-right: 10%;
      margin-top: 3%;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      aspect-ratio: 1 / 1;
      border-radius: 10px;
    }


    .card__wrapper:hover .overlay {
  opacity: 1;
}


    /* .card__wrapper:hover .card__body{
        transform: translateY(0);

    } */

    .card__wrapper{
        position: relative;
        display: inline-block;
    }

    .card__body{
        text-align: center;
        position: absolute;
        padding: .5em 1em;
        /* bottom:0; 
        color: rgb(255, 255, 255);
        background: linear-gradient(transparent, rgb(0, 0, 0));
        transform: translateY(150%);
        transition: transform .3s ease; */
        
    }

    h1,p {
      font-family: 'Jost', sans-serif;
        font-weight: 500;
    }

    .overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.6);
        opacity: 0;
        transition: opacity 0.3s;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 10px;
    }
    h2,h3 {
        color: white;
        font-family: 'Quicksand', sans-serif;
        font-size: 24px;
        text-align: center;
        margin-left: 5%;
        margin-right: 5%;
    }

    .buttons {
        display: flex;
        justify-content: center;
        flex-wrap: wrap; /* Allow buttons to wrap to the next line */
        max-width: 60%;
        text-align: center;
        margin-right: 20%;
        margin-left: 20%;
        margin-top: 2%;
    }

    button {
        transition-duration: 0.4s;
        margin-right: 4px;
        margin-bottom: 4px;
				font-family: 'Jost', sans-serif;
				font-size: 1.2rem;
				background-color: white;
			  color: #707171;
			  border: none;
				padding:4px;
				border-radius: 5px;
    }

    button:hover {
        background-color: #a0a0a0;
        border: none;
        color: white;
    }

    @media (max-width: 768px) {
      button {
        transition-duration: 0.4s;
        margin-right: 4px;
        margin-bottom: 4px;
				font-family: 'Jost', sans-serif;
				font-size: 1.05rem;
				background-color: white;
			  color: #707171;
			  border: none;
				padding:4px;
				border-radius: 5px;
    }

    .buttons {
        display: flex;
        justify-content: center;
        flex-wrap: wrap; /* Allow buttons to wrap to the next line */
        max-width: 100%;
        text-align: center;
        margin-right: 5%;
        margin-left: 5%;
        margin-top: 5%;
    }

    section {
      display: grid;
      max-width: 100vw;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      grid-gap: 0.2rem;
      margin-left: 0;
      margin-right: 0;
      margin-top: 3%;
    }

    }

  </style>
  