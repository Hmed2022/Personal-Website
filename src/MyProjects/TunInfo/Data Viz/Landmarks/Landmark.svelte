<script>
// @ts-nocheck

    import {fade} from 'svelte/transition'
		import {governorates} from './Governorates.js';
        import { BaseMap, FeatureLayer } from 'svelte-geo'
        import Tun from '../Map/Data/Tunisia.geojson.json'
	import Governorates from '../Map/Data/Governorates.json'
		import {imageData} from './images.js';
    // Sort governorates by name
    governorates.sort((a, b) => a.name.localeCompare(b.name));

    let selectedGovernorate = 'Tunis';
    let cities = [];
    let selectedCity = '';

    $: if (selectedGovernorate) {
    const selectedGovernorateData = governorates.find(g => g.name === selectedGovernorate);
    if (selectedGovernorateData) {
        // Sort cities by name
        selectedGovernorateData.cities.sort((a, b) => a.name.localeCompare(b.name));
        cities = selectedGovernorateData.cities;
    } else {
        cities = [];
    }
    // Set selectedCity to the first city if it's not already set to a city in the new list
    if (!cities.some(city => city.name === selectedCity)) {
        selectedCity = cities.length > 0 ? cities[0].name : '';
    }
} else {
    cities = [];
    selectedCity = ''; // Reset selectedCity when no governorate is selected
}
    
    import { scaleOrdinal } from 'd3-scale';

    let ordinalScale = scaleOrdinal()
		.range([
            '#C8E5ED'
 ]);  

        //              let ordinalScale = scaleOrdinal()
		// .range([
        //     '#91B4BA', // color for 0
        //     '#C8E5ED',// color for 1
		// 				'#759CA0', // color for 2
		// 				'#5A8083', // color for 3
		// 				'#416566', // color for 4
        //     '#163435' // color for 26
		// 			 ]);  

$: selection = [selectedGovernorate]; 

function updateSelectedGovernorate(newSelection) {
        if (newSelection.length > 0 && newSelection[0] !== selectedGovernorate) {
            selectedGovernorate = newSelection[0];
        }
    }

    $: if (selection.length > 0) {
    updateSelectedGovernorate(selection);
}

let textElement
$:textBoxWidth = textElement ? textElement.getComputedTextLength()+10 : 0
let zoomReset
let Zoom

let selectedlandmark
$: if (selectedGovernorate=='Tunis'){
    selectedlandmark ='26 (6)'
} else if (selectedGovernorate=='Ben Arous'){
    selectedlandmark ='1 (1)'}
    else if (selectedGovernorate=='Nabeul'){
    selectedlandmark ='1 (1)'}
    else if (selectedGovernorate=='Sousse'){
    selectedlandmark ='4 (2)'}
    else if (selectedGovernorate=='Monastir'){
    selectedlandmark ='4 (1)'}
    else if (selectedGovernorate=='Mahdia'){
    selectedlandmark ='4 (1)'}
    else if (selectedGovernorate=='Kairouan'){
    selectedlandmark ='4 (2)'}
    else if (selectedGovernorate=='Sfax'){
    selectedlandmark ='2 (1)'}
    else if (selectedGovernorate=='Tataouine'){
    selectedlandmark ='1 (1)'}
    else if (selectedGovernorate=='Gabes'){
    selectedlandmark ='2 (1)'}
    else if (selectedGovernorate=='Kasserine'){
    selectedlandmark ='1 (1)'}
    else if (selectedGovernorate=='Zaghouane'){
    selectedlandmark ='2 (1)'}
    else if (selectedGovernorate=='Jendouba'){
    selectedlandmark ='3 (2)'}
    else if (selectedGovernorate=='Beja'){
    selectedlandmark ='2 (1)'}
    else if (selectedGovernorate=='Manouba'){
    selectedlandmark ='1 (1)'}
    else if (selectedGovernorate=='Bizerte'){
    selectedlandmark ='2 (1)'}


</script>

<div class="left">
    <!-- <h1>Governorate</h1> <br>
<div class="map">
     <button on:click={zoomReset} >Reset Zoom</button> -->
    <div class="basemap">
        
        <BaseMap bind:zoomReset background= #FDF6F5>
          <FeatureLayer
          
          styleAccessor={(feature, selected) => ({
            "fill": selected ? '#9D6D79' : ordinalScale(feature.properties.landmarks),
            "stroke": '#91B4BA',
            "vector-effect": 'non-scaling-stroke',
            
          })}

            geojson={Tun}
            selectMode={1}
            idAccessor={(feature) => feature.properties.gouv_fr}
            bind:selection={selection}

                  on:mount ={zoomReset}
            on:destroy = {zoomReset}
              let:hoveredFeature >
            <rect 
              width={textBoxWidth} 
              height = 21 
              x={-0.5*textBoxWidth} 
              y = -15
              rx = 10  
              fill="#FDF6F5" 
              opacity=0.8
            />
            <text text-anchor="middle" bind:this={textElement} >
              {hoveredFeature?.properties.gouv_fr}
            </text>
                   </FeatureLayer>
        </BaseMap>
        
      
      <h2 class="caption">{selectedGovernorate} </h2> 
      <mark class="caption2">Nb Landmarks (Cities)<br>{selectedlandmark}</mark> 
    </div>  
</div>

<div class="container">
  
<div class="right">
	<div class="btn">
			<select style="color-background:#FAE4DD" bind:value={selectedGovernorate}>
    <option value="" style="font-family:Quicksand">Select a Governorate</option>
    {#each governorates as governorate}
        <option value={governorate.name}>{governorate.name}</option>
    {/each}
</select>

{#if selectedGovernorate}
    <!-- <p>You selected: {selectedGovernorate}</p> -->
    <select bind:value={selectedCity}>
        <option value="">Select a City</option>
        {#each cities as city}
            <option value={city.name}>{city.name}</option>
        {/each}
    </select>
{/if}
	</div>
{#if selectedCity && selectedGovernorate}
<section>
    {#each imageData as image, i}		
			{#if image.gov == selectedGovernorate && image.city == selectedCity}
    <div class="card__wrapper">
        <div class="card__body">
        </div>
                <img class="image" src='{image.src}' alt="card" />
            <!-- <a href={image.url}> -->
            <div class="overlay">
         
                <h2 class="title3">{image.landmark} <br>
                  <span class="cview">{image.bill}</span><br><br>
                  <img class="tag" src='{image.tags}' alt="Tag"  />
                   <!-- <span class="cview">-Click to Read-</span> </h2> -->
              </div> 
            <!-- </a> -->
    </div>
			{/if}
    {/each}
</section>
{/if}

<!-- {#if selectedCity && selectedGovernorate}
	<p> {selectedGovernorate} </p>
    <p>City: {selectedCity}</p> 
	
{/if} -->
</div>
</div>

  <style>

.tag {
			margin:2%;
			height:35px;
			opacity:0.8;
		}

    select{
        font-family: Quicksand;
        font-weight: bold;
        font-size: 1rem;
        color:#2088A6;
        background-color:#C8E5ED;
        border:none;
        border-radius: 5px;
    }

    .caption{
        font-family:Quicksand;
        text-align: center;
        color:#2088A6
    }

    .caption2{
        margin-top:0;
        font-weight: bold;
        padding:3px;
        font-family:Quicksand;
        text-align: center;
        color:#2088A6;
        background-color:#C8E5ED
    }


.basemap {
   /* border: #CE897A solid 2px; */
    background-color: #FDF6F5 ;
    width: 320px;
    height: 320px;
    margin-top: 20px;
	float:left;
    pointer-events: none;

  }
		h1,h2{
			margin:0;
		}

		.btn{
			text-align:center;
		}
    .cview{
        font-weight: 300;
        font-size: 0.8em ;
    }


    section {
      display: grid;
      max-width: 100vw;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      grid-gap: 0.2rem;
      margin-left: 10%;
      margin-right: 10%;
      margin-top: 3%;
      max-width: 50rem;
      margin: 1rem auto;
  
    }

    .image {
      width: 250px;
      height: 250px;
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
        width: 250px;
	      height: 250px;
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
        font-size: 20px;
        text-align: center;
        margin-left: 5%;
        margin-right: 5%;
    }


.left {
    position: sticky; /* Makes the left div sticky */
    top: 0; /* Aligns to the top of the viewport */
    z-index: 10; /* Ensures it stays on top when scrolling */
    width: 30%; /* Adjust the width as needed */
    text-align: center;
}

.right {
    width: 70%; /* Adjust the width as needed */
    margin-left: auto; /* Centers the right div */
    margin-right: auto;
}

    .map {
        width: auto;
        height:13%;
    }
  </style>