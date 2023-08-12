<script>
	import { Router, Link, Route } from 'svelte-navigator';
	import Header from './components/Header.svelte';
	import Home from './pages/Home.svelte';
	import Projects from './pages/Projects.svelte';
	// import Resume from './pages/Resume.svelte';
	// import Contact from './pages/Contact.svelte';
	// import Star from './MyProjects/All-Star/NBA.svelte';
	// import Klay from './MyProjects/Klay/klay.svelte';
  </script>
  
  <header>
	<Header />
  </header>
  

  <body>

	<Router>
			<Route path="/" component={Home} />
			<Route path="/projects" component={Projects} />
	</Router>
  </body>

