<script>
import AllNames from './Components/allnames.svelte'
 import { style } from 'svelte-body';
</script>


<body>
    <AllNames/>
</body>

<svelte:body use:style={"background-color: #FDEEDB;"} />

<style>
    body {
        margin-top: 10%;
        margin-right: 25%;
        margin-left:25%
    }
</style>