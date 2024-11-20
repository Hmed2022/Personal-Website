<script>
	import { crossfade, scale } from 'svelte/transition';
	import images from '../components/nba.js';

	// export let name2 = '';
	// export let arena = '';
	// export let opponents = '';
	// export let date = '';

	// function setName(value){
	// 	name2 = value
	// 	return ""
	// }

	const [send, receive] = crossfade({
		duration: 200,
		fallback: scale
	});

	let selected = null;
	let loading = null;


	const load = image => {
		const timeout = setTimeout(() => loading = image, 100);

		const img = new Image();

		img.onload = () => {
			selected = image;
			clearTimeout(timeout);
			loading = null;
		};

		img.src = image.path;
	};
</script>

<div class="container">
	<div class="phone">
		<div class="grid">
			{#each images as image}
				<div class="square">
					{#if selected !== image}
						<button
							on:click="{() => {load(image)}}"
							in:receive={{key:image.id}}
							out:send={{key:image.id}}
                            disabled= "{image.disable}"
		
						><img src= {image.logo} alt='logo'/>
                        {loading === image ? '...' : image.id}</button>
					{/if}
				</div>
			{/each}
		</div>

		{#if selected}
			{#await selected then d}
				<div class="photo" in:receive={{key:d.id}} out:send={{key:d.id}}>
					<img
						alt={d.alt}
						src={d.path}
						on:click={() => selected = null} />

					<div class="details">
						<p>{d.arena} - {d.date} </p>
					</div>
				</div>
			{/await}
		{/if}
	</div>
</div>

<style>
	.container {
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
	}

	.phone {
		position: relative;
		display: flex;
		flex-direction: column;
		width: 50vmin;
		height: 76vmin;
		border: 1.2vmin solid rgb(111, 61, 61);;
		padding: 2vmin;
		border-radius: 2vmin;
	}

	.grid {
		display: grid;
		flex: 1;
		grid-template-columns: repeat(3, 1fr);
		grid-template-rows: repeat(5, 1fr);
		grid-gap: 2vmin;
	}

	button {
		width: 100%;
		height: 100%;
		color: grey;
		font-size: 5vmin;
		border: none;
		margin: 0;
		will-change: transform;
	}

	.photo, img {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	.photo {
		display: flex;
		text-align: center;
		align-items: stretch;
		justify-content: flex-end;
		flex-direction: column;
		will-change: transform;
	}

    .details {
		display: relative;
        margin-top: 5px;
        font-size: 1rem;
        color: rgb(195, 46, 46);
    }

	img {
		object-fit: cover;
		cursor: pointer;
	}
</style>