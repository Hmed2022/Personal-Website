<script>
    import Map from "./Data Viz/Map/Map.svelte"
    import Footer from "../../components/footer.svelte";

    let selectedLanguage = "english"; // Default to English

    function handleChange(event) {
    selectedLanguage = event.target.value;
    }


</script>
<!-- 
<p style="text-align:center"> Choose Language:</p> -->

<p>
    Choose a Language
        <select bind:value={selectedLanguage} on:change={handleChange}>
      <option value="english">English</option>
      <option value="arabic">Arabic</option>
    </select>
    </p>

    
<div class="map">
    <Map {selectedLanguage}/>
</div>

<!-- <Footer/> -->

<style>
    .map{
        margin-left: 10%;
        margin-right: 10%;
    }
    .info{
        max-width: 1000px
    }
</style>
