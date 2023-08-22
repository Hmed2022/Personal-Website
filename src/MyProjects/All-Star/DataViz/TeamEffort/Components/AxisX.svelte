<script>
  export let height;
  export let xScale;
  export let margin;

  let xTicks = [90,95,100,105,110,115,120,125,130,135,140,145,150];
</script>

<g>
  {#each xTicks as tick}
	    <text 
      x={xScale(tick)} 
      y={height - margin.bottom}
      dy="6"
      dominant-baseline="hanging"
      >{tick} {tick == 150 ? ' Drtg' : ''}</text>
  {/each}
</g>


<style>

@import url('https://fonts.googleapis.com/css2?family=Quicksand&display=swap');
	text {
		font-family: 'Quicksand', sans-serif;
	}
</style>