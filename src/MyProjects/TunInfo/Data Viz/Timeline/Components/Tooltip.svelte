<script>
  export let data;
  export let xScale;
  export let mouseY;

	let status= "Front"

</script>

<!-- <div class='tooltip' style="position: absolute;
  top: {mouseY}px;
  left: {xScale(data.Value2)}px">
	<p> <b></b>{data.ObserveInEnglish}</p>
<p><b>Issued: </b> {data.Issued}</p> 
	<p> <b>End: </b> {data.EndofCirculation}</p>
	<p><b>click for more info</p>
</div> -->

<div class='tooltip' style="position: absolute;
  top: {mouseY}px;
  left: {xScale(data.Value2)}px">
	<img 
    src={data.Preview} 
    alt="Front banknote"/>
	<p> Click for more info</p>
	
</div>

<style>

	img{
		width: 20em;
		height: auto
	}
  .tooltip {
		text-align:center;
    padding: 6px;
    background: white;
    border: 1px solid rgba(0, 0, 0, 0.5);
    pointer-events: none;
    transition: top 300ms ease, left 300ms ease;
  }


	p{
		font-family: Quicksand;
		font-size:0.8rem;
		margin:0
	}
	
</style>