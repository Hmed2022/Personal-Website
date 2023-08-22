<script>
	let yTicks = [0,5,10,15,20,25];
	export let yScale1;
	export let width;
// 	export let margin;
// 	export let height;
</script>

<g>
{#each yTicks as tick}
	<text x="0"
				y={yScale1(tick)}
					dy="-2"> {tick}</text>
	<line x1="0"
				y1={yScale1(tick)}
				x2={width}
				y2={yScale1(tick)}
				stroke="#cecece"/>
	
	
<!-- 	<line class="ref1"
				x1={width-90}
				y1="20"
				x2={width-4}
				y2="20"
				stroke-linecap="round"/>
	
	<line class="ref2"
				x1={width-90}
				y1="40"
				x2={width-4}
				y2="40"
				stroke-linecap="round"/>
	
		<text x={width-90} y="15" class="small">#Views (Million)</text>
		<text x={width-90} y="35" class="small">RTG</text> -->
	
{/each}
</g>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400&display=swap');

	text {
		font-family: 'Quicksand', sans-serif;
	}
/* 	.ref1{
		stroke: #476b8d;
		stroke-width: 4;
		fill: none;
	}
	.ref2{
		stroke: #894044;
		stroke-width: 4;
		fill: none;
	} 
	.small {
		color: #cecece;
		font-size: 0.8em;
		font-family: Quicksand;
	}*/
</style>