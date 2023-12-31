<script>
// @ts-nocheck

	// @ts-ignore
	import { BaseMap, FeatureLayer } from 'svelte-geo'
	// @ts-ignore
	import Tun from './Data/Tunisia.geojson.json'
	import Governorates from './Data/Governorates.json'
    import Delegation from "./Delegations.svelte"

    import UrlAriana from "./Flags/ariana_flag.png"
    import UrlBeja from "./Flags/beja_flag.png"
    import UrlBenArous from "./Flags/ben_arous_flag.png"
    import UrlBizerte from "./Flags/bizerte_flag.png"
    import UrlGabes from "./Flags/gabes_flag.png"
    import UrlGafsa from "./Flags/gafsa_flag.png"
    import UrlJendouba from "./Flags/jendouba_flag.png"
    import UrlKairouan from "./Flags/kairouan_flag.png"
    import UrlKasserine from "./Flags/kasserine_flag.png"
    import UrlKebili from "./Flags/kebili_flag.png"
    import UrlKef from "./Flags/kef_flag.png"
    import UrlMahdia from "./Flags/mahdia_flag.png"
    import UrlManouba from "./Flags/manouba_flag.png"
    import UrlMedenine from "./Flags/medenine_flag.png"
    import UrlMonastir from "./Flags/monastir_flag.png"
    import UrlNabeul from "./Flags/nabeul_flag.png"
    import UrlSfax from "./Flags/sfax_flag.png"
    import UrlSidiBouzid from "./Flags/sidi-bouzid_flag.png"
    import UrlSiliana from "./Flags/siliana_flag.png"
    import UrlSousse from "./Flags/sousse_flag.png"
    import UrlTataouine from "./Flags/tataouin_flag.png"
    import UrlTozeur from "./Flags/tozeur_flag.png"
    import UrlTunis from "./Flags/tunis_flag.png"
    import UrlZaghouan from "./Flags/zaghouan_flag.png"

    import UrlFont from "../../Assets/Fonts/Hacen Saudi Arabia.ttf"
    import Accordion from './Accordion.svelte'

    import { scaleOrdinal } from 'd3-scale';
  let ordinalScale = scaleOrdinal()
		.range([
            '#91B4BA', // color for 0
            '#C8E5ED',// color for 1
						'#759CA0', // color for 2
						'#5A8083', // color for 3
						'#416566', // color for 4
            '#163435' // color for 26
					 ]);  

 import Gov from "./Gov.svelte"


 let selectedLanguage = "english"

  // export let selectedLanguage
    let selection = ["Tunis"] 

	 let textElement
  $:textBoxWidth = textElement ? textElement.getComputedTextLength()+10 : 0
 	let zoomReset
    let Zoom


</script>  


<div class="containers">
    {#if selectedLanguage == "english"}
    <div class="map">
        <button on:click={zoomReset} >Reset Zoom</button>
        <div class="basemap">
            
            <BaseMap bind:zoomReset background= white>
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
                  fill="white" 
                  opacity=0.8
                />
                <text text-anchor="middle" bind:this={textElement} >
                  {hoveredFeature?.properties.gouv_fr}
                </text>
                       </FeatureLayer>
            </BaseMap>
            
          </div>
    </div>  
    <div class="info">
        {#each Governorates.governorates as gov}
            {#if selection == gov.Name}

              <!-- <Delegation {selection} language="english"/> -->
                <!-- <p><span>Name: </span>{gov.Name} </p>
                <p><span>Population: </span>{gov.Population} </p>
                <p> <span> Nb of Landmarks:</span> {gov.Landmarks}</p>
                <p><span>Area: </span>{gov.Surface} km2 </p>  -->
                {#if selection == "Ariana"}
                <!-- <img src={UrlAriana} alt="Ariana Flag"/> -->
                {:else if selection == "Beja"}
                <!-- <img src={UrlBeja} alt="Beja Flag"/> -->
                <!-- <h3>
                  <span>City:</span>Teboursouk
                </h3> -->
                <h2>
                  Beja
                </h2>
                <Accordion open={true}>
                  <span slot="head"> <h3>Teboursek (2) </h3></span>
                  <div slot="details">
                    <Gov  state = "Beja" city ="Teboursek"/>
                  </div>
                </Accordion>
                {:else if selection == "Ben Arous"}
                <img src={UrlBenArous} alt="Ben Arous Flag"/>
                {:else if selection == "Bizerte"}
                <!-- <img src={UrlBizerte} alt="Bizerte Flag"/> -->
                <h2>
                  Bizerte
                </h2>
                <Accordion open={true}>
                  <span slot="head"> <h3>Bizerte (2) </h3></span>
                  <div slot="details">
                    <Gov  state = "Bizerte" city ="Bizerte"/>
                  </div>
                </Accordion>
                {:else if selection == "Gabes"}
                <img src={UrlGabes} alt="Gabes Flag"/>
                {:else if selection == "Gafsa"}
                <img src={UrlGafsa} alt="Gafsa Flag"/>
                {:else if selection == "Jendouba"}
                <!-- <img src={UrlJendouba} alt="Jendouba Flag"/> -->
                <h2>
                  Jendouba
                </h2>
                <Accordion open={true}>
                  <span slot="head"> <h3>Fernena (1) </h3></span>
                  <div slot="details">
                    <Gov  state = "Jendouba" city= "Fernena"/>
                  </div>
                </Accordion>
                <Accordion open={false}>
                  <span slot="head"> <h3>Jendouba (2) </h3></span>
                  <div slot="details">
                    <Gov  state = "Jendouba" city= "Jendouba"/>
                  </div>
                </Accordion>
                {:else if selection == "Kairouan"}
                <img src={UrlKairouan} alt="Kairouan Flag"/>
                {:else if selection == "Kebili"}
                <img src={UrlKebili} alt="Kebili Flag"/>
                {:else if selection == "Kasserine"}
                <img src={UrlKasserine} alt="Kasserine Flag"/>
                {:else if selection == "Tunis"}
                <img src={UrlTunis} alt="Tunis Flag"/>
                {:else if selection == "El Kef"}
                <img src={UrlKef} alt="El Kef Flag"/>
                {:else if selection == "Mahdia"}
                <img src={UrlMahdia} alt="Mahdia Flag"/>
                {:else if selection == "Monastir"}
                <img src={UrlMonastir} alt="Monastir Flag"/>
                {:else if selection == "Manouba"}
                <!-- <img src={UrlManouba} alt="Manouba Flag"/> -->
                <h2>
                  Manouba
                </h2>
                <Accordion open={true}>
                  <span slot="head"> <h3>El Fahs (1) </h3></span>
                  <div slot="details">
                    <Gov  state = "Manouba" city ="El Fahs"/>
                  </div>
                </Accordion>
              
                {:else if selection == "Medenine"}
                <img src={UrlMedenine} alt="Medenine Flag"/>
                {:else if selection == "Nabeul"}
                <img src={UrlNabeul} alt="Nabeul Flag"/>
                {:else if selection == "Sfax"}
                <img src={UrlSfax} alt="Sfax Flag"/>
                {:else if selection == "Sidi Bouzid"}
                <img src={UrlSidiBouzid} alt="Sidi Bouzid Flag"/>
                {:else if selection == "Siliana"}
                <img src={UrlSiliana} alt="Siliana Flag"/>
                {:else if selection == "Sousse"}
                <img src={UrlSousse} alt="Sousse Flag"/>
                {:else if selection == "Tataouine"}
                <!-- <img src={UrlTataouine} alt="Tataoin Flag"/> -->

                <h2>
                  Tataouine
                </h2>
                <Accordion open={true}>
                  <span slot="head"> <h3>Tataouine (1) </h3></span>
                  <div slot="details">
                    <Gov  state = "Tataouine" city= "Tataouine"/>
                  </div>
                </Accordion>
          
                {:else if selection == "Tozeur"}
                <img src={UrlTozeur} alt="Tozeur Flag"/>
                {:else if selection == "Zaghouan"}
                <img src={UrlZaghouan} alt="Zaghouan Flag"/>
                {/if}
            {/if}
        {/each}
</div>  
{:else}
<div class="map">
    <button on:click={zoomReset} >Reset Zoom</button>
    <div class="basemap">
        
        <BaseMap bind:zoomReset background= white>
          <FeatureLayer
            styleAccessor={(feature, selected) => ({
              'fill': '#D59C9D',
              'stroke': '#CE897A',
              'vector-effect': 'non-scaling-stroke',
              'fill-opacity': selected ? 0.5 : 0.1
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
              fill="white" 
              opacity=0.8
            />
            <text class="arabtext" text-anchor="middle" bind:this={textElement} >
              {hoveredFeature?.properties.gouv_ar}
            </text>
                   </FeatureLayer>
        </BaseMap>
        
      </div>
</div>  
<div class="info">
    {#each Governorates.governorates as gov}
        {#if selection == gov.Name}
            <p class='arabtext'><span>الولاية:  </span>{gov.Name_in_Arabic} </p>
            <p class='arabtext'><span>عدد السكان:  </span>{gov.Population} </p>
            <p class='arabtext'><span>المساحة:  </span>{gov.Surface} كم </p> 
            {#if selection == "Ariana"}
            <img src={UrlAriana} alt="Ariana Flag"/>
            {:else if selection == "Beja"}
            <img src={UrlBeja} alt="Beja Flag"/>
            {:else if selection == "Ben Arous"}
            <img src={UrlBenArous} alt="Ben Arous Flag"/>
            {:else if selection == "Bizerte"}
            <img src={UrlBizerte} alt="Bizerte Flag"/>
            {:else if selection == "Gabes"}
            <img src={UrlGabes} alt="Gabes Flag"/>
            {:else if selection == "Gafsa"}
            <img src={UrlGafsa} alt="Gafsa Flag"/>
            {:else if selection == "Jendouba"}
            <img src={UrlJendouba} alt="Jendouba Flag"/>
            {:else if selection == "Kairouan"}
            <img src={UrlKairouan} alt="Kairouan Flag"/>
            {:else if selection == "Kebili"}
            <img src={UrlKebili} alt="Kebili Flag"/>
            {:else if selection == "Kasserine"}
            <img src={UrlKasserine} alt="Kasserine Flag"/>
            {:else if selection == "Tunis"}
            <img src={UrlTunis} alt="Tunis Flag"/>
            {:else if selection == "El Kef"}
            <img src={UrlKef} alt="El Kef Flag"/>
            {:else if selection == "Mahdia"}
            <img src={UrlMahdia} alt="Mahdia Flag"/>
            {:else if selection == "Monastir"}
            <img src={UrlMonastir} alt="Monastir Flag"/>
            {:else if selection == "Manouba"}
            <img src={UrlManouba} alt="Manouba Flag"/>
            {:else if selection == "Medenine"}
            <img src={UrlMedenine} alt="Medenine Flag"/>
            {:else if selection == "Nabeul"}
            <img src={UrlNabeul} alt="Nabeul Flag"/>
            {:else if selection == "Sfax"}
            <img src={UrlSfax} alt="Sfax Flag"/>
            {:else if selection == "Sidi Bouzid"}
            <img src={UrlSidiBouzid} alt="Sidi Bouzid Flag"/>
            {:else if selection == "Siliana"}
            <img src={UrlSiliana} alt="Siliana Flag"/>
            {:else if selection == "Sousse"}
            <img src={UrlSousse} alt="Sousse Flag"/>
            {:else if selection == "Tataouine"}
            <img src={UrlTataouine} alt="Tataoin Flag"/>
            {:else if selection == "Tozeur"}
            <img src={UrlTozeur} alt="Tozeur Flag"/>
            {:else if selection == "Zaghouan"}
            <img src={UrlZaghouan} alt="Zaghouan Flag"/>
            {/if}
        {/if}
    {/each}
</div> 
{/if}
</div>

                 
<style> 

@font-face {
  font-family: 'Hacen Saudi Arabia';
  src: url("../../Assets/Fonts/Hacen Saudi Arabia.ttf") format('truetype');
  font-weight: normal;
  font-style: normal;
}

.arabtext{
    font-family:'Hacen Saudi Arabia' ;
}

img {
    width:200px;
    height:auto;
    opacity: 0.7;
}
button {
        border: none;
        padding: 0.5rem 2rem;
        color: #fff;
        font-size: 1rem;
        border-radius: 0.2rem;
        transition: all 250ms;
        transform-origin: center;
        margin-bottom: 2%;
        background-color: #CE897A;
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

.containers {
    display: flex;
    /* justify-content: space-between; */
    /* background-image: url("./Flags/kef_flag.png"); */
    background-size: cover;
    background-repeat: no-repeat; 
    background-position: center center; 
  }

  .info {

    padding: 20px; /* Add some padding for spacing */
    box-sizing: border-box; /* Include padding in the width calculation */
    text-align:center;
  }

    .containers{
        display: flex;
    }
	p, text{
		font-family: Quicksand;
		font-weight: 400;
	}

span{
    font-weight: 900;
}

  .basemap {
   /* border: #CE897A solid 2px; */
    background-color: #F4EDDB;
    width: 500px;
    height: 500px;
    margin: 20px;
		float:left;

  }

  .map {
    width:50%;
    text-align: center;
  }

  h3 {
          font-family:Quicksand;
          font-size:1.4em;
		      margin-top: 0;
          margin-bottom:0;
          color:white
    }
       h2 {
          font-family:Quicksand;
          font-size:1.7em;
			     margin-top: 0;
          margin-bottom:0;
          color: #2C5056;
    }

</style>