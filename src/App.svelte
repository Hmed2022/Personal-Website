<script>
	import Router, {location, link} from 'svelte-spa-router';
	import { wrap } from 'svelte-spa-router/wrap';
	import Header from './components/Header.svelte';
	import RouteLoading from './components/RouteLoading.svelte';
	import Home from './pages/Home_old.svelte';   // the landing page stays in the main bundle

	// Every other page is its own chunk, downloaded only when visited
	// (e.g. #/cardmagic no longer downloads the Names / TunInfo / All-Star code and data).
	const lazy = (load) => wrap({ asyncComponent: load, loadingComponent: RouteLoading });

	const routes = {
    '/': Home,
    '/projects': lazy(() => import('./pages/Projects.svelte')),
    '/allstarintro': lazy(() => import('./MyProjects/All-Star/AllStarIntro.svelte')),
    '/allstar': lazy(() => import('./MyProjects/All-Star/NBA.svelte')),
    '/tuninfo': lazy(() => import('./MyProjects/TunInfo/TunInfo.svelte')),
    '/tuninfointro': lazy(() => import('./MyProjects/TunInfo/TunInfoIntro.svelte')),
    '/klay': lazy(() => import('./MyProjects/Klay/klay.svelte')),
    // '/Anniv': lazy(() => import('./MyProjects/Anniversary/Aniv.svelte')),
    '/Names': lazy(() => import('./MyProjects/Names/names.svelte')),
    '/cardmagic': lazy(() => import('./MyProjects/CardMagic/CardMagic.svelte'))
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
    normalizedPath === '/tuninfo' ||
    normalizedPath === '/klay' ||
    normalizedPath === '/cardmagic';

</script>

{#if !hideHeader}
  <header>
    <Header />
  </header>
{/if}

<!-- Don't wrap in <body> inside a Svelte component -->
<Router {routes} />

<style>
  @import './app.css';
</style>