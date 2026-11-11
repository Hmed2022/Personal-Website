<script>
	import Router, {location, link} from 'svelte-spa-router';
	import { wrap } from 'svelte-spa-router/wrap';
	import Header from './components/Header.svelte';
	import RouteLoading from './components/RouteLoading.svelte';
	import TunLoading from './MyProjects/TunInfo/Components/TunLoading.svelte';   // flag-emblem loader for the banknotes piece
	// import Home from './pages/Home_old.svelte';   // previous landing page (kept)
	import Home from './pages/HomeNew.svelte';      // the landing page stays in the main bundle

	import { onMount } from 'svelte';
	import { theme, PERSONAL_PAGES } from './components/theme.js';

	// ---- Scroll position between pages ----
	// The browser keeps the scroll offset when only the #hash changes, so opening a project from
	// the bottom of the home page used to land halfway down the project. Now:
	//   - a new page (clicked link / typed URL) starts at the top
	//   - Back / Forward return to where you were on that page
	// Each history entry gets a key; we remember the last scroll position per key.
	const savedY = {};
	let currentKey = null;
	let restoreY = null;

	onMount(() => {
		if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
		const onScroll = () => { if (currentKey) savedY[currentKey] = window.scrollY; };
		// popstate fires for every hash change (clicks included) before the new page renders;
		// only Back / Forward land on an entry that already has our key.
		const onPop = (e) => {
			currentKey = null; // stop recording: the old page is about to be swapped out
			const k = e.state && e.state.__scrollKey;
			restoreY = k && k in savedY ? savedY[k] : null;
		};
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('popstate', onPop);
		return () => {
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('popstate', onPop);
		};
	});

	// ---- Tab title per page ----
	// (A page's own <svelte:head><title> would also work; keeping them in one table is easier to scan.)
	const SITE = 'Ahmed Bendaly';
	const TITLES = {
		'': `${SITE} · Data stories`,
		'/': `${SITE} · Data stories`,
		'/projects': `Projects · ${SITE}`,
		'/about': `More about me · ${SITE}`,
		'/leghreeb': `About Leghreeb · ${SITE}`,
		'/allstarintro': `The Decline of the All-Star Game · ${SITE}`,
		'/allstar': `The Decline of the All-Star Game · ${SITE}`,
		'/tuninfointro': `What Can Tunisia's Banknotes Tell You? · ${SITE}`,
		'/tuninfo': `What Can Tunisia's Banknotes Tell You? · ${SITE}`,
		'/klay': `Klay BBJ: A Mirror of Tunisian Society · ${SITE}`,
		'/names': `The Names We Memorized Before We Understood · ${SITE}`,
		'/cardmagic': `The Math Behind the Magic · ${SITE}`
	};
	const titleFor = (path) => TITLES[path] ?? `Uncharted territory · ${SITE}`;

	function onRouteLoaded(e) {
		const path = ((e && e.detail && e.detail.location) || '').toLowerCase().split('?')[0].replace(/\/+$/, '');
		document.title = titleFor(path);

		let k = history.state && history.state.__scrollKey;
		if (!k) {
			k = Math.random().toString(36).slice(2);
			history.replaceState({ ...history.state, __scrollKey: k }, '');
		}
		const y = restoreY ?? 0;
		restoreY = null;
		// wait a frame so the new page has laid out before scrolling
		requestAnimationFrame(() => { window.scrollTo(0, y); currentKey = k; });
	}

	// Every other page is its own chunk, downloaded only when visited
	// (e.g. #/cardmagic no longer downloads the Names / TunInfo / All-Star code and data).
	const lazy = (load) => wrap({ asyncComponent: load, loadingComponent: RouteLoading });

	const routes = {
    '/': Home,
    '/projects': lazy(() => import('./pages/Projects.svelte')),
    '/about': lazy(() => import('./pages/About.svelte')),
    '/leghreeb': lazy(() => import('./pages/Leghreeb.svelte')),
    '/allstarintro': lazy(() => import('./MyProjects/All-Star/AllStarIntro.svelte')),
    '/allstar': lazy(() => import('./MyProjects/All-Star/NBA.svelte')),
    '/tuninfo': wrap({ asyncComponent: () => import('./MyProjects/TunInfo/TunInfo.svelte'), loadingComponent: TunLoading }),
    '/tuninfointro': lazy(() => import('./MyProjects/TunInfo/TunInfoIntro.svelte')),
    '/klay': lazy(() => import('./MyProjects/Klay/klay.svelte')),
    // '/Anniv': lazy(() => import('./MyProjects/Anniversary/Aniv.svelte')),
    '/Names': lazy(() => import('./MyProjects/Names/names.svelte')),
    '/cardmagic': lazy(() => import('./MyProjects/CardMagic/CardMagic.svelte')),
    // anything else (e.g. #/oops): a small "uncharted territory" page instead of a blank screen
    '*': lazy(() => import('./pages/NotFound.svelte'))
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


  // night mode applies to the personal pages only; project stories always keep their own colours
  $: document.documentElement.setAttribute('data-theme', PERSONAL_PAGES.includes(normalizedPath) && $theme === 'dark' ? 'dark' : 'light');
</script>

{#if !hideHeader}
  <header>
    <Header />
  </header>
{/if}

<!-- Don't wrap in <body> inside a Svelte component -->
<Router {routes} on:routeLoaded={onRouteLoaded} />

<style>
  @import './app.css';
</style>