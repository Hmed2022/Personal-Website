<script>
	// import Header from "../components/Header.svelte";
	import Projects from "../components/ProjectsAnimated.svelte";
	import Footer from "../components/footer.svelte";
</script>
  

<!-- <Header /> -->
<!-- page intro (the grid and its filters come from ProjectsAnimated) -->
<section class="intro">
	<h1><span>Projects</span></h1>
	<p>Interactive stories and data visualizations about Tunisia, culture and sport. Use the filters to browse by topic.</p>
</section>
<Projects/>

<Footer />

<svelte:head><title>Projects · Ahmed Bendaly</title></svelte:head>

<style>
	@font-face { font-family: 'dkzonnig'; src: url('../assets/Fonts/dkzonnig.ttf') format('truetype'); font-display: swap; }
	.intro { max-width: 42rem; margin: 0 auto; padding: 2.5rem 1.5rem .5rem; text-align: center; font-family: 'Jost', sans-serif; }
	h1 { margin: 0 0 .8rem; }
	h1 span {
		display: inline-block; padding: .1em .9em .15em; font-family: 'dkzonnig', 'Jost', sans-serif; font-weight: 400; font-size: 2.4rem; color: #FFFFFF; background: #B5523B;
		clip-path: polygon(2% 12%, 30% 4%, 64% 9%, 98% 2%, 100% 46%, 97% 92%, 62% 98%, 30% 93%, 1% 99%, 3% 55%);
	}
	p { margin: 0; font-size: 1.1rem; font-weight: 300; line-height: 1.6; color: #5E6B70; }
</style>
