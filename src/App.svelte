<script>
// @ts-nocheck

	// @ts-ignore
	import { Router, Route } from 'svelte-routing';
	import Home from './pages/Home.svelte';
	import Projects from './pages/Projects.svelte';
	import Resume from './pages/Resume.svelte';
	import Contact from './pages/Contact.svelte';
	// import Star from './MyProjects/All-Star/NBA.svelte';
	import Klay from './MyProjects/Klay/klay.svelte';
  </script>
  
  <Router>
	<Route path="/" component={Home} />
	<Route path="/projects" component={Projects} />
	<Route path="/resume" component={Resume} />
	<Route path="/contact" component={Contact} />
	<!-- <Route path="/allStar" component={Star} /> -->
	<Route path="/klay" component={Klay} />
  </Router>
  


