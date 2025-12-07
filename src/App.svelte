<script>
	import Router, {location, link} from 'svelte-spa-router';
	import Header from './components/Header.svelte';
	import Home from './pages/Home.svelte';
	import Projects from './pages/Projects.svelte';
	import AllStarIntro from './MyProjects/All-Star/AllStarIntro.svelte';
	import NBA from "./MyProjects/All-Star/NBA.svelte";
	import TunInfo from './MyProjects/TunInfo/TunInfo.svelte';
	import TunInfoIntro from './MyProjects/TunInfo/TunInfoIntro.svelte';
	import Klay from './MyProjects/Klay/klay.svelte'
	import Anniversary from './MyProjects/Anniversary/Aniv.svelte'
  import Names from './MyProjects/Names/names.svelte'


	const routes = {
    '/': Home,
    '/projects': Projects,
    '/allstarintro': AllStarIntro,
    '/allstar': NBA,
    '/tuninfo': TunInfo,
    '/tuninfointro': TunInfoIntro,
    '/klay': Klay,
    // '/Anniv': Anniversary,
    '/Names': Names
  };

  // Normalize current path from the router (works for hash or history)
  $: normalizedPath =
    ($location || '')
      .toLowerCase()
      .split('?')[0]       // drop ?query
      .replace(/\/+$/, ''); // drop trailing slash


 $: hideHeader = 
    normalizedPath === '/anniv' ||
    normalizedPath === '/names' ||
    normalizedPath === '/allstar' ||
    normalizedPath === '/tuninfo';

</script>

{#if !hideHeader}
  <header>
    <Header />
  </header>
{/if}

<!-- Don’t wrap in <body> inside a Svelte component -->
<Router {routes} />

<style>
  @import './app.css';
</style>