<script>
	let xTicks = [1990,1995,2000,2005,2010,2015,2020,2025];
// 	let xTicks_lines = [1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023];
	let xTicks_lines = [1990,1995,2000,2005,2010,2015,2020,2025];
	export let xScale;
	export let height;
	export let margin;
</script>

<g>
{#each xTicks as tick}
	<text x={xScale(tick)}
				y={height - margin.bottom}
				dy="-15"
				dominant-baseline ="hanging"
				> {tick}</text>
{/each}
</g>

<g>
{#each xTicks_lines as line}
<line
          class="vert-line"
          x1={xScale(line)}
          x2={xScale(line)}
          y1={height - margin.bottom}
          y2={height-margin.top}
        />
{/each}
</g>

<style>
	
	.vert-line{
		 stroke: #cecece;
    
	}
	
	text {
		font-family: Quicksand;
		font-size: 0.9em;
	}
</style>