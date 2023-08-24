<script>

    import Footer from "../../components/footer.svelte";

    function redirectToTunInfo() {
        window.location.hash = '/tuninfo';
    }
</script>


<div style="text-align:center">

    <h2>Tunisia in Graphics: An Infographic Odyssey</h2>
    <button on:click={redirectToTunInfo}>
        Click here to read the Infohraphic
    </button>
</div>
<Footer/>

<style>
    button {
        border: none;
        padding: 0.5rem 2rem;
        color: #fff;
        font-size: 1.5rem;
        border-radius: 0.2rem;
        transition: all 250ms;
        transform-origin: center;
        margin-bottom: 5%;
    }
    button:hover {
        cursor: pointer;
        transform: scale(0.99);
        box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.25);
    }
</style>