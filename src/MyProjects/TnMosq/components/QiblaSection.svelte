<script>
	// 04 · Which way do they face? Mosques are built so the prayer wall faces Mecca (the qibla).
	// For buildings whose outline is a clean rectangle we measure which wall is closest to the qibla
	// and how far it is turned from it. Data/tnQibla.json, built by Data/build_tnmosq_data.py.
	import RoseFan from './RoseFan.svelte';
	import OutlineCard from './OutlineCard.svelte';
	import qibla from '../Data/tnQibla.json';

	export let small = false;

	const fmt = (n) => n.toLocaleString('en-US');
	const pct = (k) => Math.round((k / Math.max(1, qibla.n)) * 100);
	const turn = (d) =>
		d === null || d === undefined ? '' : Math.abs(d) < 0.5 ? 'faces Mecca almost exactly' : `turned ${Math.abs(d).toFixed(1).replace(/\.0$/, '')}° ${d > 0 ? 'clockwise' : 'anticlockwise'} from Mecca`;
	const area = (a) => (a ? `${fmt(Math.round(a))} m²` : '');
	// a uniform spread would put a ninth of buildings within 5°: compare against that
	const uniform5 = Math.round(qibla.n / 9);
</script>

<!-- Al-Baqarah 2:115 -->
<blockquote class="ayah">
	<p class="ayah-ar" lang="ar" dir="rtl">وَلِلَّهِ الْمَشْرِقُ وَالْمَغْرِبُ ۚ فَأَيْنَمَا تُوَلُّوا فَثَمَّ وَجْهُ اللَّهِ ۚ إِنَّ اللَّهَ وَاسِعٌ عَلِيمٌ</p>
	<p class="ayah-en">“To Allah belong the east and the west. So wherever you turn, there is the Face of Allah. Indeed, Allah is all-Encompassing and Knowing.”</p>
	<cite>Al-Baqarah 2:115</cite>
</blockquote>

<p class="body">
	Every mosque is built so that its prayer wall faces Mecca. From Tunisia that direction, the qibla, is a little south of
	east, about 106° from north. We took the {fmt(qibla.n)} mosques whose outline on the map is a clean rectangle,
	found the wall closest to the qibla, and measured how far it is turned.
</p>

<RoseFan bins={qibla.bins} R={small ? 18 : 26} tile={small ? 7 : 8} />

<div class="nums">
	<div><b>{pct(qibla.within5)}%</b><span>within 5° of Mecca ({fmt(qibla.within5)} mosques)</span></div>
	<div><b>{pct(qibla.within10)}%</b><span>within 10°</span></div>
	<div><b>{qibla.median ? Math.round(qibla.median) : '–'}°</b><span>typical turn (median)</span></div>
</div>

<p class="body">
	{#if qibla.within5 < uniform5 * 1.5}
		That is close to what you would see if the buildings were turned at random: many follow the street grid, the plot,
		or the old lines of a medina rather than the exact bearing. Outlines on the map often trace a whole compound,
		courtyard and annexes included, so a skewed outline does not always mean a skewed prayer hall.
	{:else}
		Far more than chance: the prayer wall is usually set within a few degrees of the bearing, even where the street
		grid runs another way.
	{/if}
</p>

{#if qibla.cards.length}
	<h3 class="sub">Seen from above</h3>
	<p class="note"><span class="k gold" /> direction of Mecca &nbsp; <span class="k blue" /> direction the building faces</p>
		<div class="cards">
		{#each qibla.cards as c}
			<figure class="card">
				<!-- the real outline from the map, seen from above, with the qibla and facing arrows -->
				<OutlineCard outline={c.outline} target={c.target} dev={c.dev} n={small ? 26 : 30} tile={small ? 6 : 7} />
				<figcaption>
					<span class="why">{c.why}</span>
					<bdi class="nm" lang={/[؀-ۿ]/.test(c.name) ? 'ar' : null}>{c.name}</bdi>
					<span class="meta">{c.gov}{c.area ? ' · ' + area(c.area) : ''}</span>
					<span class="dev">{turn(c.dev)}</span>
					<a href={c.url} target="_blank" rel="noopener noreferrer">On OpenStreetMap ↗</a>
				</figcaption>
			</figure>
		{/each}
	</div>
{/if}

<p class="fine">
	How it's measured: we fit the tightest rectangle around each outline and keep buildings that fill at least 85% of it
	and cover 60 m² or more. A rectangle has four sides, so the turn is always between 0° and 45°.
</p>

<style>
	.body { font-size: 1.06rem; line-height: 1.65; max-width: 680px; margin: 28px auto 0; }
	.ayah { margin: 30px auto 0; max-width: 720px; padding: 18px 20px; border-top: 2px solid #c9bfa9; border-bottom: 2px solid #c9bfa9; }
	.ayah-ar { font-family: 'Amiri', serif; font-size: 1.75rem; line-height: 1.9; margin: 0; color: #13213f; }
	.ayah-en { font-family: 'Fraunces', Georgia, serif; font-style: italic; font-size: 1.02rem; line-height: 1.55; margin: 10px 0 0; color: #2357a8; }
	.ayah cite { display: block; margin-top: 6px; font-style: normal; font-size: 0.8rem; color: #8a7a5c; letter-spacing: 0.06em; }
	.nums { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 14px; margin: 26px 0 0; }
	.nums div { border-top: 4px solid #2357a8; padding: 8px 4px 4px; }
	.nums b { display: block; font-family: 'Fraunces', Georgia, serif; font-size: 2rem; color: #13306a; }
	.nums span { font-size: 0.88rem; color: #13213f; }
	.sub { font-family: 'Fraunces', Georgia, serif; font-weight: 600; font-size: 1.35rem; margin: 44px 0 4px; color: #13213f; }
	.note { margin: 0 0 16px; font-size: 0.88rem; color: #5d6780; display: flex; align-items: center; justify-content: center; gap: 6px; flex-wrap: wrap; }
	.cards { display: flex; flex-wrap: wrap; justify-content: center; gap: 26px; }
	.card { width: 250px; }
	.card :global(.oc) { margin: 0 auto; }
	.k { display: inline-block; width: 22px; height: 6px; }
	.k.gold { background: #e8b13e; }
	.k.blue { background: #5d93d8; }
	.card { margin: 0; }
	figcaption { display: flex; flex-direction: column; align-items: center; gap: 2px; margin-top: 18px; font-size: 0.88rem; color: #13213f; }
	.why { text-transform: uppercase; letter-spacing: 0.12em; font-size: 0.72rem; color: #a87a2a; font-weight: 600; }
	.nm { font-family: 'Fraunces', Georgia, serif; font-size: 1.05rem; font-weight: 600; }
	.nm[lang='ar'] { font-family: 'Amiri', serif; font-size: 1.25rem; }
	.meta { color: #5d6780; }
	.dev { color: #2357a8; }
	figcaption a { color: #2357a8; font-size: 0.82rem; margin-top: 4px; }
	.fine { font-size: 0.85rem; color: #5d6780; margin: 28px auto 0; max-width: 720px; }
</style>
