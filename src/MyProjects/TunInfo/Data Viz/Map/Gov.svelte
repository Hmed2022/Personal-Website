<script>
    import {fade} from 'svelte/transition'
   	import {imageData} from './Data/images';

    export let state = "Tataouine"
    export let city =" Tataouine"

  </script>

<!-- <div class="container">
      <div class="governorate">
        <h2 class="title"> Beja</h2>
				
          <div class="city">
            <h3 class="title2">Teboursek</h3>
					</div>
			</div>
		</div> -->
<section>
	
    {#each imageData as image, i}	
    {#if image.gov == state}	
    {#if image.city == city}
    <div class="card__wrapper">
        <div class="card__body">
        </div>
                <img class="image" src='{image.src}' alt="card" />
            <a href={image.url}>
            <div class="overlay">
                
                <h2 class="title3">{image.landmark} <br>
                  <span class="cview">{image.bill}</span><br><br>
                   <span class="cview">-Click to Read-</span> </h2>
              </div> 
            </a>
    </div>
    {/if}
    {/if}
    {/each}
</section>


  <style>
    .cview{
        font-weight: 300;
        font-size: 0.7em ;
    }


    section {
      display: grid;
      max-width: 100vw;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
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
      border-radius: 5px;
    }


    .card__wrapper:hover .overlay {
  opacity: 1;
}

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
    .title3 {
        color: white;
        font-family: 'Quicksand', sans-serif;
        font-size: 24px;
        text-align: center;
        margin-left: 5%;
        margin-right: 5%;
    }

			
 
  
     .title {
          font-family:Quicksand;
          font-size:1.4em;
		      margin-top: 0;
          margin-bottom:0;
          color:#90B5BB
    }
       .title2 {
          font-family:Quicksand;
          font-size:1.7em;
			     margin-top: 0;
          margin-bottom:0;
          color: #2C5056;
    }

  
  </style>
  