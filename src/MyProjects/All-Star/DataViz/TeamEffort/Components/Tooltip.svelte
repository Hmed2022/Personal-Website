<script>
  export let data;
  export let xScale;
  export let yScale;

</script>

<div class='tooltip' style="position: absolute;
  top: {yScale(data.oftg)}px;
  left: {xScale(data.drtg)}px">
	<p> <b>Year: </b>{data.edition}</p>
<p><b>Team: </b> {data.allstarteam}</p> 
	<p> <b>Dftg: </b> {data.drtg}</p>
	<p><b>Oftg: </b> {data.oftg}</p>
</div>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Quicksand&display=swap');
  .tooltip {
		text-align:center;
    padding: 6px;
    background: white;
    border: 1px solid rgba(0, 0, 0, 0.5);
    pointer-events: none;
    transition: top 300ms ease, left 300ms ease;
  }


	p{
		font-family: 'Quicksand', sans-serif;
		font-size:0.8rem;
	}
	
</style>