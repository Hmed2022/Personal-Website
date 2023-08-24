<script>
	import Router, {location, link} from 'svelte-spa-router';
	import Header from './components/Header.svelte';
	import Home from './pages/Home.svelte';
	import Projects from './pages/Projects.svelte';
	import AllStarIntro from './MyProjects/All-Star/AllStarIntro.svelte';
	import NBA from "./MyProjects/All-Star/NBA.svelte";
	import TunInfo from './MyProjects/TunInfo/TunInfo.svelte';
	import TunInfoIntro from './MyProjects/TunInfo/TunInfoIntro.svelte';

</script>
  
  <header>
	<Header />
  </header>
  
  <body>
	<!-- <nav>
		<a href="/">Home</a>
		<a href="/#/projects">Projects</a>
	</nav> -->
	
	<Router routes={{
		'/': Home,
		'/projects': Projects,
		'/allstarintro': AllStarIntro,
		'/allstar': NBA,
		'/tuninfo': TunInfo,
		'/tuninfointro': TunInfoIntro
	}} />
  </body>
  
  <style>
  @import './app.css';
  </style>