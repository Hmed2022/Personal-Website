<script>
	// 03 · The names. Governorates first: each is a small square of tiles coloured by what its mosque
	// names are about; clicking one flips the street sign to that governorate's most common name
	// ("All of Tunisia" to start, revealed when the sign scrolls into view). Then every named mosque
	// as one tile, by theme. Everything comes from Data/tnNames.json (built by Data/build_tnmosq_data.py).
	import { onMount, onDestroy } from 'svelte';
	import Plaque from './Plaque.svelte';
	import MiniWaffle from './MiniWaffle.svelte';
	import names from '../Data/tnNames.json';

	export let small = false;

	const fmt = (n) => n.toLocaleString('en-US');
	const COLORS = ['#2357a8', '#2f6b3d', '#b3202f', '#c9963e']; // virtues, saints, people, places
	const OTHER = '#d9cfbb';
	const themed = names.themes.reduce((s, t) => s + t.count, 0);
	const plain = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '');

	// the scopes the sign can show: all of Tunisia, then each governorate with enough named mosques
	const ALL = { key: 'all', name: 'All of Tunisia', n: names.named, top: names.top };
	const govs = names.byGov.filter((g) => g.n >= 10).map((g) => ({ key: g.g, name: g.name, n: g.n, mix: g.mix, top: g.top || [] }));
	const signOf = (sc) => {
		const t = sc.top[0];
		if (!t || t.count < 2) return { text: 'No name repeats yet', tab: plain(sc.name) };
		return { text: t.lat ? `Jamaa ${plain(t.lat)}` : `${t.count} mosques`, tab: plain(sc.name) };
	};
	const SIGNS = [ALL, ...govs].map(signOf);

	let scope = ALL;
	let revealed = false;
	$: sign = signOf(scope);
	$: top = scope.top[0];
	$: repeats = top && top.count >= 2;
	$: runnersUp = scope.top.slice(1, scope.key === 'all' ? 7 : 3).filter((t) => t.count >= 2);

	function choose(sc) {
		scope = sc;
		revealed = true;
	}

	let wrap, io;
	onMount(() => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { revealed = true; return; }
		io = new IntersectionObserver(([e]) => {
			if (e.isIntersecting) { setTimeout(() => (revealed = true), 500); io.disconnect(); }
		}, { threshold: 0.6 });
		io.observe(wrap);
	});
	onDestroy(() => io && io.disconnect());

	const hide = (s) => s.replace(/[A-Za-z0-9]/g, '?');
	const waffleCols = small ? 32 : 56;
</script>

<p class="body">
	A mosque's name is chosen by the people who build it, so names say something about a neighbourhood: what
	it hopes for, whom it remembers, where it is. {fmt(names.named)} of the {fmt(names.total)} mosques we found have
	a name on record.
</p>

<h3 class="sub">Pick a governorate</h3>
<p class="note">Each square is one governorate's named mosques, as 100 tiles, coloured by what the names are about. Click one to see its most common name.</p>
<div class="minis" role="tablist" aria-label="Governorates">
	<button type="button" class="mini" class:on={scope.key === 'all'} role="tab" aria-selected={scope.key === 'all'} on:click={() => choose(ALL)}>
		<MiniWaffle values={[...names.themes.map((t) => t.count), names.other]} colors={[...COLORS, OTHER]} tile={small ? 5 : 6} />
		<span class="mn">All of Tunisia <i>{fmt(names.named)}</i></span>
	</button>
	{#each govs as g, i}
		<button type="button" class="mini" class:on={scope.key === g.key} role="tab" aria-selected={scope.key === g.key} on:click={() => choose(g)}>
			<MiniWaffle values={g.mix} colors={[...COLORS, OTHER]} tile={small ? 5 : 6} delay={i * 60} />
			<span class="mn">{g.name} <i>{g.n}</i></span>
		</button>
	{/each}
</div>
<p class="legend">
	{#each names.themes as t, i}<span><b style="background:{COLORS[i]}" />{t.label}</span>{/each}
	<span><b style="background:{OTHER}" />Other</span>
</p>

<div class="reveal" bind:this={wrap} aria-live="polite">
	<p class="kick">The most common mosque name {scope.key === 'all' ? 'in Tunisia' : `in ${scope.name}`}</p>
	<Plaque
		tab={revealed ? sign.tab : hide(sign.tab)}
		text={revealed ? sign.text : hide(sign.text)}
		fitAll={SIGNS}
		tile={small ? 3 : 5}
		align="center"
		flipSpread={1100}
		label="{sign.tab}: {sign.text}"
	/>
	{#if revealed}
		{#key scope.key}
			{#if repeats}
				<p class="ar" lang="ar" dir="rtl">جامع {top.ar}</p>
				{#if top.en}<p class="mean">“{top.en}”</p>{/if}
				<p class="share">{top.count} of {scope.key === 'all' ? 'the' : `${scope.name}'s`} {fmt(scope.n)} named mosques</p>
			{:else}
				<p class="share">Every named mosque{scope.key === 'all' ? '' : ` in ${scope.name}`} has a different name, so far.</p>
			{/if}
			{#if runnersUp.length}
				<p class="runners">
					Then
					{#each runnersUp as t, i}<span class="nm"><bdi lang="ar">{t.ar}</bdi>{#if t.lat} <bdi>({t.lat})</bdi>{/if} <b>{t.count}</b></span>{i < runnersUp.length - 1 ? ', ' : '.'}{/each}
				</p>
			{/if}
		{/key}
	{/if}
</div>

<h3 class="sub">What the names are about</h3>
<p class="note">Each tile is one named mosque. {fmt(themed)} names fit one of four themes; the rest are family names, local words, or names we couldn't place.</p>
<div class="waffle">
	<MiniWaffle values={[...names.themes.map((t) => t.count), names.other]} colors={[...COLORS, OTHER]} cols={waffleCols} rows={Math.ceil(names.named / waffleCols)} tile={small ? 6 : 8} perTile={1} empty="#f6f1e7" />
</div>
<div class="themes">
	{#each names.themes as t, i}
		<div class="theme">
			<p class="th"><span class="sw" style="background:{COLORS[i]}" /><b>{t.label}</b> <span class="cnt">{fmt(t.count)}</span></p>
			<p class="words">
				{#each t.words.slice(0, 6) as w, k}<span class="wd"><bdi class="w" lang={/[؀-ۿ]/.test(w.w) ? 'ar' : 'fr'}>{w.w}</bdi><span class="wn">{w.n}</span></span>{k < Math.min(5, t.words.length - 1) ? ' · ' : ''}{/each}
			</p>
		</div>
	{/each}
</div>

<style>
	.body { font-size: 1.06rem; line-height: 1.65; max-width: 680px; margin: 28px auto 0; }
	.sub { font-family: 'Fraunces', Georgia, serif; font-weight: 600; font-size: 1.35rem; margin: 44px 0 4px; color: #13213f; }
	.note { margin: 0 auto 14px; font-size: 0.88rem; color: #5d6780; max-width: 720px; }

	.minis { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; }
	.mini {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		padding: 8px;
		background: transparent;
		border: 2px solid transparent;
		cursor: pointer;
		font: inherit;
		color: #13213f;
	}
	.mini:hover { border-color: #c9bfa9; }
	.mini.on { border-color: #13306a; background: #fffaf0; box-shadow: 3px 3px 0 #13306a; }
	.mini:focus-visible { outline: 2px solid #e8b13e; outline-offset: 2px; }
	.mn { font-size: 0.82rem; }
	.mn i { font-style: normal; color: #8a7a5c; }
	.legend { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px 16px; margin: 12px 0 0; font-size: 0.8rem; color: #5d6780; }
	.legend b { display: inline-block; width: 11px; height: 11px; margin-right: 5px; vertical-align: -1px; }

	.reveal { margin: 40px auto 8px; text-align: center; }
	.kick { text-transform: uppercase; letter-spacing: 0.18em; font-size: 0.75rem; color: #5d6780; margin: 0 0 12px; }
	.ar { font-family: 'Amiri', serif; font-size: 2.2rem; margin: 14px 0 0; color: #13213f; animation: rise 0.6s ease both; }
	.mean { margin: 2px 0 0; font-family: 'Fraunces', Georgia, serif; font-style: italic; font-size: 1.2rem; color: #2357a8; animation: rise 0.6s 0.15s ease both; }
	.share { margin: 8px 0 0; font-size: 0.92rem; color: #5d6780; animation: rise 0.6s 0.25s ease both; }
	.runners { max-width: 720px; margin: 14px auto 0; font-size: 0.98rem; line-height: 1.8; color: #13213f; }
	.nm bdi[lang='ar'] { font-family: 'Amiri', serif; font-size: 1.15rem; }
	.nm b { color: #2357a8; }

	.waffle { overflow-x: auto; display: flex; justify-content: center; }
	.themes { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 16px 22px; margin: 18px 0 0; }
	.theme { font-size: 0.92rem; color: #13213f; }
	.th { margin: 0; }
	.sw { display: inline-block; width: 14px; height: 14px; margin-right: 6px; vertical-align: -2px; box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.12); }
	.cnt { color: #5d6780; font-variant-numeric: tabular-nums; }
	.words { margin: 4px 0 0; line-height: 1.7; }
	.wd { white-space: nowrap; }
	.w[lang='ar'] { font-family: 'Amiri', serif; font-size: 1.1rem; }
	.wn { font-size: 0.72rem; color: #8a7a5c; margin-left: 2px; }
	@keyframes rise { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
	@media (prefers-reduced-motion: reduce) { .ar, .mean, .share { animation: none; } }
</style>
