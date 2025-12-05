<script>
import AllNames from './Components/allnames.svelte'
import Title from './Components/title.svelte'
import Player from './Components/player.svelte';
 import { style } from 'svelte-body';
</script>


<body>
    <div class="title">
    <Title/>
    </div>

    <!-- <Player/> -->


    <AllNames/>
</body>

<svelte:body use:style={"background-color: #FDEEDB;"} />

<style>
    .title{
        margin-bottom: 20%;
        text-align: center;
    }
    body {
        margin-top: 10%;
        margin-right: 25%;
        margin-left:25%
    }
</style>