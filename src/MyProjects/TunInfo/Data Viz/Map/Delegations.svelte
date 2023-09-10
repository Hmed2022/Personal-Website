<script>
	import { BaseMap, FeatureLayer } from 'svelte-geo'
	import cities from './Data/Delegations.geojson.json'
	 let zoomReset

	export let selection

		 let textElement
  $:textBoxWidth = textElement ? textElement.getComputedTextLength()+10 : 0
	
	$: filteredCities = cities.features.filter(city => city.properties.gouv_fr === selection[0]);
	$: filteredGeoJSON = {
            type: "FeatureCollection",
            crs: cities.crs,
            features: filteredCities
        };
</script>
            <div class="basemap2">
                <BaseMap bind:zoomReset background = white>
                <FeatureLayer
                    styleAccessor={(feature) => ({
                    'fill': '#FBF5F5',
                    'stroke': '#CE897A',
                    'vector-effect': 'non-scaling-stroke',
                    })}
									
                    geojson={filteredGeoJSON}
                        on:mount ={zoomReset}
                    on:destroy = {zoomReset}
                    let:hoveredFeature >
                    <rect 
                    width={textBoxWidth} 
                    height = 21 
                    x={-0.5*textBoxWidth} 
                    y = -15
                    rx = 10  
                    fill="white" 
                    opacity=0.8
                    />
                    <text text-anchor="middle" bind:this={textElement} >
                    {hoveredFeature?.properties.del_fr}
                    </text>
                        </FeatureLayer>
                </BaseMap>
                <button class="button2" on:click={zoomReset} >Reset Zoom</button>
                </div>  


		<style>
			.basemap2 {
   /* border: black solid thin; */
    background-color: #F4EDDB;
    width: 250px;
    height: 250px;
    text-align:center;
  }
			
    .button2 {
        border: none;
        padding: 0.5rem 2rem;
        color: #fff;
        font-size: 0.7rem;
        border-radius: 0.2rem;
        transition: all 250ms;
        transform-origin: center;
        margin-bottom: 2%;
        background-color: #c8afaa;
    }

    text{
		font-family: Quicksand;
		font-weight: 400;
	}
		</style>