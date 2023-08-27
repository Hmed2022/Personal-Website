<script>
  export let width;
  export let yScale;
  export let margin;

  let yTicks = [90,95,100,105,110,115,120,125,130,135,140,145];
</script>

<g transform="translate({margin.left} {margin.top})">
  {#each yTicks as tick}
	    <text 
      x={0} 
      y={yScale(tick)}
      dy="-6"
      >{tick} {tick == 145 ? ' Ofrg' : ''}</text>
		
      <line 
        x1="0" 
        y1={yScale(tick)} 
        x2={width} 
        y2={yScale(tick)} 
        stroke={tick == 0 ? 'black' : "#cecece"} />
  {/each}
</g>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Quicksand&display=swap');
	text {
		font-family: 'Quicksand', sans-serif;
	}
  @media (max-width: 512px) {
		text {
		font-family: 'Quicksand', sans-serif;
    font-size: 0.75em;
	}
	}
</style>