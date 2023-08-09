<script>
	import data from './Data/ThreePointPer';
	import Graph from './Graph.svelte';
// 	import Sliders from './Slider.svelte';
	
	let show = true;
	
</script>
<section>

  <div class="chart">
		 <Graph {data} {show} />
  </div>
</section>
