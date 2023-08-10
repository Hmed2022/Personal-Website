<script>
	import { Router, Route } from 'svelte-routing';
	import Header from './components/Header.svelte'
	// @ts-ignore
	import Home from './pages/Home.svelte';
	import Projects from './pages/Projects.svelte';
	// import Resume from './pages/Resume.svelte';
	// import Contact from './pages/Contact.svelte';
	// import Star from './MyProjects/All-Star/NBA.svelte';
	// import Klay from './MyProjects/Klay/klay.svelte';
  </script>
  <header>
	<Header/>
  </header>
<body>
	<Router>
		<Route path="/" component={Home} />
		
		<Route path="/projects" component={Projects} />
		<!-- <Route path="/resume" component={Resume} /> -->
		<!-- <Route path="/contact" component={Contact} /> -->
		<!-- <Route path="/allStar" component={Star} /> -->
		<!-- <Route path="/klay" component={Klay} /> -->
	  </Router>
	  
	
</body>
  

