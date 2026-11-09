<script>
	// import Header from "../components/Header.svelte";
	import Projects from "../components/ProjectsAnimated.svelte";
	import Footer from "../components/footer.svelte";
	import { showFilters } from "../components/images.js";
</script>
  

<!-- <Header /> -->
<!-- page intro (the grid and its filters come from ProjectsAnimated) -->
<section class="intro">
	<p class="hi">Each project, I'm Leghreeb again</p>
	<h1>It usually begins with a <span class="mark">question</span>.</h1>
	<p class="lede">Most of these start with a question I couldn't let go of, so I went looking for the answer in the data. Sometimes I have a take I want to share, but usually I'm just curious. Often I start as a complete <a href="/#/leghreeb">stranger</a> to the subject and come out the other side an expert.{#if showFilters} Use the filters to browse by topic.{/if}</p>
</section>
<Projects/>

<Footer />

<svelte:head><title>Projects · Ahmed Bendaly</title></svelte:head>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600&display=swap');
	@font-face { font-family: 'dkzonnig'; src: url('../assets/Fonts/dkzonnig.ttf') format('truetype'); font-display: swap; }
	/* same intro style as the About me page: handwritten kicker, big headline with a highlighted word */
	.intro { max-width: 46rem; margin: 0 auto; padding: 2.5rem 1.5rem .5rem; text-align: center; font-family: 'Jost', sans-serif; color: #2E3A40; }
	.hi { margin: 0 0 .4rem; font-family: 'dkzonnig', 'Jost', sans-serif; font-size: 1.7rem; color: #B5523B; }
	h1 { margin: 0; font-weight: 500; font-size: clamp(1.8rem, 3.4vw, 2.6rem); line-height: 1.2; }
	.mark { position: relative; white-space: nowrap; color: #1E5B8C; }
	.mark::after { content: ''; position: absolute; left: -.1em; right: -.1em; bottom: .05em; height: .32em; z-index: -1; background: #D9A441; opacity: .45; border-radius: 3px; transform: skewX(-8deg); }
	.lede a { color: #1E5B8C; text-decoration-color: #D9A441; text-decoration-thickness: 2px; text-underline-offset: 3px; }
	.lede a:hover { color: #B5523B; }
	.lede { margin: 1.2rem auto 0; font-size: 1.12rem; font-weight: 300; line-height: 1.7; color: #5E6B70; }
	/* night mode (toggle in the header) */
	:global(html[data-theme="dark"]) .intro { color: #E9E4DA; }
	:global(html[data-theme="dark"]) .hi { color: #E8967A; }
	:global(html[data-theme="dark"]) .mark, :global(html[data-theme="dark"]) .lede a { color: #8CBDE6; }
	:global(html[data-theme="dark"]) .lede a:hover { color: #E8967A; }
	:global(html[data-theme="dark"]) .lede { color: #A7B3BB; }
</style>
