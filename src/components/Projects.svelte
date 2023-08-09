<script>
    import { imageData } from "../components/images.js";
    // import { Center}  from '@svelteuidev/core';
    import {fade} from 'svelte/transition'
    import {onMount} from 'svelte'
    import { Link } from 'svelte-routing';

    let show = false

    onMount(() => {
        show=true
    }
    )
  </script>
  
{#if show}
<section>
    {#each imageData as image, i}
    <div class="card__wrapper" transition:fade={{delay: i*300}}>
        <div class="card__body">
        </div>
            
                <img class="image" src={image.url} alt="card" />
           
            <a href={image.href}>
            <div class="overlay">
                
                <h2>{image.title} <br> <span class="cview">-Click to Read-</span> </h2>
           
              </div> 
            </a>
    </div>
    {/each}
</section>
{/if}

  
  <style>

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
        font-family:Futura;
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
        font-family: Quicksand;
        font-size: 24px;
        text-align: center;
        margin-left: 5%;
        margin-right: 5%;
    }

  </style>
  