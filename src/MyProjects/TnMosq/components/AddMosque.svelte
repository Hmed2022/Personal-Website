<script>
	// "Help us find the rest": a form for adding a mosque that's missing from the map,
	// with a tiled live counter of submissions. Saved to Supabase (see submissions.js);
	// every submission is reviewed before it reaches the map.
	import { onMount, onDestroy } from 'svelte';
	import Plaque from './Plaque.svelte';
	import { GOVS } from '../countMap.js';
	import { submitMosque, submissionCount } from '../submissions.js';

	export let small = false;

	const govNames = GOVS.map((g) => g.name).sort((a, b) => a.localeCompare(b));
	let form = { name: '', name_ar: '', place: '', governorate: '', lat: '', lon: '', note: '' };
	let state = 'idle'; // idle | sending | done | error
	let errorText = '';
	let count = null;
	let locating = false;
	let wrap, io, timer;

	async function refreshCount() {
		const n = await submissionCount();
		if (n !== null) count = n;
	}

	function useMyLocation() {
		if (!navigator.geolocation) { errorText = 'Your browser can’t share its location. Type the coordinates instead.'; return; }
		locating = true;
		navigator.geolocation.getCurrentPosition(
			(p) => {
				form.lat = p.coords.latitude.toFixed(5);
				form.lon = p.coords.longitude.toFixed(5);
				locating = false;
			},
			() => { locating = false; errorText = 'Location not shared. You can type the coordinates instead.'; },
			{ enableHighAccuracy: true, timeout: 10000 }
		);
	}

	// paste a Google Maps / OpenStreetMap link and pull the coordinates out of it
	function readLink(e) {
		const t = (e.clipboardData || window.clipboardData).getData('text');
		const m = t.match(/(-?\d{1,2}\.\d{3,})[,/ ]\s*(-?\d{1,2}\.\d{3,})/);
		if (m) { e.preventDefault(); form.lat = m[1]; form.lon = m[2]; }
	}

	async function send() {
		errorText = '';
		state = 'sending';
		const res = await submitMosque(form);
		if (res.ok) {
			state = 'done';
			refreshCount();
			return;
		}
		state = 'error';
		errorText =
			res.reason === 'name' ? 'Please give the mosque’s name.'
			: res.reason === 'place' ? 'Those coordinates are outside Tunisia.'
			: 'Submissions aren’t open yet. You can add the mosque to OpenStreetMap directly (link below): our map is rebuilt from it.';
	}

	function again() {
		form = { name: '', name_ar: '', place: '', governorate: form.governorate, lat: '', lon: '', note: '' };
		state = 'idle';
	}

	$: osmEdit = form.lat && form.lon
		? `https://www.openstreetmap.org/edit#map=19/${form.lat}/${form.lon}`
		: 'https://www.openstreetmap.org/edit#map=7/34.0/9.5';

	onMount(() => {
		io = new IntersectionObserver(([e]) => {
			if (e.isIntersecting) {
				refreshCount();
				clearInterval(timer);
				timer = setInterval(refreshCount, 30000);
			} else clearInterval(timer);
		}, { rootMargin: '200px' });
		io.observe(wrap);
	});
	onDestroy(() => { if (io) io.disconnect(); clearInterval(timer); });
</script>

<div class="add" bind:this={wrap}>
	{#if count !== null}
		<div class="live" aria-live="polite">
			<Plaque bare text={count.toLocaleString('en-US')} tile={small ? 4 : 6} color="#ecd9b4" flipSpread={300} label="{count} mosques submitted" />
			<span>mosques submitted by readers so far</span>
		</div>
	{/if}

	{#if state === 'done'}
		<div class="thanks">
			<p><b>Thank you.</b> We’ll check it and add it to the map.</p>
			<button type="button" class="btn" on:click={again}>Add another mosque</button>
		</div>
	{:else}
		<form on:submit|preventDefault={send}>
			<label class="wide">Name of the mosque <span class="req">required</span>
				<input bind:value={form.name} required maxlength="120" placeholder="e.g. Jamaa Ennour" />
			</label>
			<label>Name in Arabic
				<input bind:value={form.name_ar} maxlength="120" dir="rtl" lang="ar" placeholder="جامع النور" />
			</label>
			<label>Town or neighbourhood
				<input bind:value={form.place} maxlength="120" placeholder="e.g. El Menzah 6" />
			</label>
			<label>Governorate
				<select bind:value={form.governorate}>
					<option value="">Choose…</option>
					{#each govNames as g}<option value={g}>{g}</option>{/each}
				</select>
			</label>
			<fieldset class="wide">
				<legend>Where is it?</legend>
				<div class="coords">
					<input bind:value={form.lat} inputmode="decimal" placeholder="Latitude" aria-label="Latitude" on:paste={readLink} />
					<input bind:value={form.lon} inputmode="decimal" placeholder="Longitude" aria-label="Longitude" on:paste={readLink} />
					<button type="button" class="btn ghost" on:click={useMyLocation} disabled={locating}>
						{locating ? 'Locating…' : 'Use my location'}
					</button>
				</div>
				<p class="hint">Standing at the mosque? Use your location. Otherwise paste a Google Maps or OpenStreetMap link into either box.</p>
			</fieldset>
			<label class="wide">Anything else? <span class="opt">optional</span>
				<textarea bind:value={form.note} maxlength="600" rows="3" placeholder="Old name, year it was built, is it a small masjid or a Friday mosque…" />
			</label>
			{#if errorText}<p class="err" role="alert">{errorText}</p>{/if}
			<div class="actions wide">
				<button type="submit" class="btn" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : 'Add this mosque'}</button>
				<a href={osmEdit} target="_blank" rel="noopener noreferrer">or add it to OpenStreetMap yourself ↗</a>
			</div>
		</form>
	{/if}
</div>

<style>
	.add { color: #ece6da; }
	.live { display: flex; align-items: flex-end; justify-content: center; gap: 12px; margin: 0 0 22px; }
	.live :global(.plaque) { width: auto; }
	.live span { padding-bottom: 4px; color: #cdb88f; }
	form { text-align: left; display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px 16px; }
	.wide { grid-column: 1 / -1; }
	label, legend { display: flex; flex-direction: column; gap: 6px; font-size: 0.88rem; color: #cdb88f; }
	legend { padding: 0; margin-bottom: 6px; }
	fieldset { border: 0; padding: 0; margin: 0; }
	.req, .opt { font-size: 0.75rem; color: #8f8778; font-style: italic; }
	input, select, textarea {
		font: inherit;
		font-size: 0.98rem;
		color: #13213f;
		background: #f6f1e7;
		border: 2px solid #3b3b42;
		border-radius: 0;
		padding: 9px 10px;
		box-shadow: inset 2px 2px 0 #d9d1c1;
	}
	input:focus, select:focus, textarea:focus { outline: 2px solid #ecd9b4; outline-offset: 1px; }
	.coords { display: grid; grid-template-columns: 1fr 1fr auto; gap: 10px; }
	.hint { margin: 6px 0 0; font-size: 0.8rem; color: #8f8778; }
	.err { grid-column: 1 / -1; margin: 0; color: #f2b8a0; }
	.actions { display: flex; align-items: center; justify-content: center; gap: 18px; flex-wrap: wrap; }
	.actions a { color: #cdb88f; font-size: 0.9rem; }
	.btn {
		font: inherit;
		font-weight: 600;
		background: #ecd9b4;
		color: #13213f;
		border: 0;
		padding: 11px 18px;
		cursor: pointer;
		box-shadow: 3px 3px 0 #2b5fae;
	}
	.btn:hover { transform: translate(-1px, -1px); box-shadow: 4px 4px 0 #2b5fae; }
	.btn:disabled { opacity: 0.6; cursor: default; transform: none; }
	.btn.ghost { background: transparent; color: #ecd9b4; border: 2px solid #ecd9b4; box-shadow: none; }
	.thanks p { font-size: 1.1rem; margin: 0 0 14px; }
	@media (max-width: 640px) {
		form { grid-template-columns: 1fr; }
		.coords { grid-template-columns: 1fr 1fr; }
		.coords .btn { grid-column: 1 / -1; }
	}
</style>
