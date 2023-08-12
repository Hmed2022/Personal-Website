<script>
	import Router, {location, link} from 'svelte-spa-router';
	import Header from './components/Header.svelte';
	import Home from './pages/Home.svelte';
	import Projects from './pages/Projects.svelte';
	import AllStarIntro from './MyProjects/All-Star/AllStarIntro.svelte'
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
		'/allstarintro': AllStarIntro
	}} />
  </body>
  