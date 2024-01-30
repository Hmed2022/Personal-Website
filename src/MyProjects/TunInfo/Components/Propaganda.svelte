<script>
    import { fade } from 'svelte/transition';
    let isHovered = false;

    function toggleHover() {
        isHovered = !isHovered;
    }
</script>

<style>
    .container {
        position: relative;
        width: auto; /* Set appropriate width */
        height: 400px; /* Set appropriate height */
        margin:5%;
       
   
    }
    img {
        position: absolute;
        top: 0;
        left: 0;
        width: auto;
        height: 100%;
        transition: opacity 0.5s ease;
    }
    .trigger {
        /* text-align: center;
        justify-content: center;
        display: flex; */
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: transparent;
        border: none;
        padding: 0;
        cursor: pointer;
    }
    .highlight {
        cursor: pointer;
        background-color:#A93925 ;
        color:#FDF6F5;
    }
    p, h1, h2,option{
        font-family: Quicksand;
    }
</style>

<p>
The transformation extended beyond mere color changes. Under Ben Ali's regime, while his image was notably absent from the bills, they were heavily imbued with 
<span class="highlight" 
on:mouseover={() => toggleHover()} 
on:focus={() => toggleHover()}
on:blur={() => toggleHover()}>propaganda symbols and references </span> celebrating the <b>November 7, 1987, revolution.</b>
<br> However,   Following the 2011 revolution, these symbolic elements were removed.
             
</p>


<div class="container">
    <button class="trigger"
            on:mouseover={() => toggleHover()} 
            on:mouseout={() => toggleHover()}
            on:focus={() => toggleHover()}
            on:blur={() => toggleHover()}>
    </button>
    <img src="https://i.ibb.co/Z67Wkt1/back-baknotes-06.png" 
         alt="note" 
         style="opacity: {isHovered ? 0.2 : 1}">
    <img src="https://i.ibb.co/KWVRYdm/back-baknotes-07.png" 
         alt="note" 
         style="opacity: {isHovered ? 1 : 0}" 
         in:fade={{ delay: 0, duration: 500 }} 
         out:fade={{ delay: 0, duration: 500 }}>
</div>

