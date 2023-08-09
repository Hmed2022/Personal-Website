<script>
	import { crossfade, scale } from 'svelte/transition';
	import images from '../components/nba2.js';

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
							on:click="{() => load(image)}"
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
                    <!-- <div class="photo" in:receive={{key:d.id}} out:send={{key:d.id}}></div> -->
					<img
						alt={d.alt}
						src= {d.path}
						on:click="{() => selected = null}"
					>
				</div>
			{/await}
		{/if}
	</div>
</div>

<style>
	.container {
        margin-top: 70%;
		position: absolute;
		display: flex;
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
		border: 1vmin solid rgb(255, 255, 255);
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
		color: white;
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
		align-items: stretch;
		justify-content: flex-end;
		flex-direction: column;
		will-change: transform;
	}

	img {
		object-fit: cover;
		cursor: pointer;
	}
</style>