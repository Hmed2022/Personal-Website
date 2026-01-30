<script>
    import {fade} from 'svelte/transition'
    import {onMount} from 'svelte'
    import { imageData } from './images.js';

    let show = false

    onMount(() => {
        show=true
    })

    let buttontag="all";
    function SetButton(buttonName) {
        buttontag="";

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
    <a href={image.href} class="card__link">
        <div class="card__wrapper" transition:fade={{delay: i * 50}}>
            <div class="card__image-container">
                <img class="image" src='{image.url}' alt={image.title} />
            </div>
            <div class="card__content">
                <h3 class="card__category">{image.desc}</h3>
                <h2 class="card__title">{image.title}</h2>
                <p class="card__desc">{image.description}</p>
            </div>
        </div>
    </a>
    {/if}
    {/each}
</section>
{/if}

<style>
    @import url('https://fonts.googleapis.com/css2?family=Jost:wght@500&family=Quicksand:wght@300;400;500;700&display=swap');

    * {
        box-sizing: border-box;
    }

    section {
        display: grid;
        max-width: 100vw;
        grid-template-columns: repeat(3, 1fr);
        grid-gap: 2rem;
        margin-left: 3%;
        margin-right: 3%;
        margin-top: 3%;
        padding-bottom: 3%;
    }

    .card__link {
        text-decoration: none;
        color: inherit;
        display: block;
    }

    .card__wrapper {
        position: relative;
        display: flex;
        flex-direction: column;
        background: white;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .card__wrapper:hover {
        transform: translateY(-8px);
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
    }

    .card__image-container {
        width: 100%;
        overflow: hidden;
        position: relative;
        background-color: white;
    }

    .image {
        width: 100%;
        height: auto;
        display: block;
        transition: transform 0.3s ease;
    }

    .card__wrapper:hover .image {
        transform: scale(1.05);
    }

    .card__content {
        padding: 2rem 2.5rem;
        background: white;
    }

    .card__category {
        color: #999;
        font-family: 'Jost', sans-serif;
        font-size: 0.85rem;
        font-weight: 400;
        margin: 0 0 0.5rem 0;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .card__title {
        color: #333;
        font-family: 'Quicksand', sans-serif;
        font-size: 1.5rem;
        font-weight: 600;
        margin: 0 0 1rem 0;
        line-height: 1.3;
    }

    .card__desc {
        color: #707171;
        font-family: 'Jost', sans-serif;
        font-size: 1rem;
        font-weight: 400;
        margin: 0;
        line-height: 1.6;
    }

    .buttons {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        max-width: 60%;
        text-align: center;
        margin-right: 20%;
        margin-left: 20%;
        margin-top: 2%;
        gap: 8px;
    }

    button {
        transition-duration: 0.4s;
        font-family: 'Jost', sans-serif;
        font-size: 1.2rem;
        background-color: white;
        color: #707171;
        border: none;
        padding: 8px 16px;
        border-radius: 5px;
        cursor: pointer;
    }

    button:hover {
        background-color: #a0a0a0;
        color: white;
    }

    /* Tablet and Mobile Styles */
    @media (max-width: 1400px) {
        section {
            grid-template-columns: repeat(2, 1fr);
            grid-gap: 1.5rem;
        }
    }

    @media (max-width: 1024px) {
        section {
            margin-left: 5%;
            margin-right: 5%;
            grid-template-columns: repeat(2, 1fr);
            grid-gap: 1.5rem;
        }

        .buttons {
            max-width: 80%;
            margin-right: 10%;
            margin-left: 10%;
        }
    }

    @media (max-width: 768px) {
        section {
            grid-template-columns: 1fr;
            grid-gap: 1.5rem;
            margin-left: 3%;
            margin-right: 3%;
            margin-top: 5%;
        }

        .card__image-container {
            height: 300px;
        }

        .card__content {
            padding: 1.5rem;
        }

        .card__category {
            font-size: 0.8rem;
        }

        .card__title {
            font-size: 1.3rem;
        }

        .card__desc {
            font-size: 0.95rem;
        }

        .buttons {
            max-width: 100%;
            margin-right: 5%;
            margin-left: 5%;
            margin-top: 5%;
        }

        button {
            font-size: 1.05rem;
            padding: 6px 12px;
        }
    }

    @media (max-width: 480px) {
        section {
            grid-template-columns: 1fr;
            grid-gap: 1rem;
            margin-left: 4%;
            margin-right: 4%;
        }

        .card__image-container {
            height: 250px;
        }

        .card__category {
            font-size: 0.75rem;
        }

        .card__title {
            font-size: 1.1rem;
        }

        .card__desc {
            font-size: 0.9rem;
        }

        button {
            font-size: 1rem;
            padding: 6px 10px;
        }
    }
</style>
