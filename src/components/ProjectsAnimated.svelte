<script>
    import Thumb from './Thumb.svelte';
    import {fade} from 'svelte/transition'
    import {onMount} from 'svelte'
    import { imageData, showFilters } from './images.js';

    let show = false

    onMount(() => {
        show=true
    })

    // A few topic filters only (tools like Svelte / D3 / SQL now sit on each card instead).
    // A filter appears only when at least one visible project matches. Revisit once there are 8+ projects.
    const FILTERS = [
        { tag: 'all', label: 'All', match: ['all'] },
        { tag: 'sports', label: 'Sport', match: ['sports'] },
        { tag: 'tunisia', label: 'Tunisia & culture', match: ['tunisia', 'culture'] },
        { tag: 'math', label: 'Math', match: ['math'] },
    ];
    const tagsOf = (p) => (p.tags || '').split(',').map((t) => t.trim());
    const matches = (p, f) => f.match.some((t) => tagsOf(p).includes(t));
    const countOf = (f) => imageData.filter((p) => p.show && matches(p, f)).length;
    const filters = FILTERS.map((f) => ({ ...f, n: countOf(f) })).filter((f) => f.n > 0);
    $: activeFilter = filters.find((f) => f.tag === buttontag) || filters[0];

    let buttontag = 'all';
    function SetButton(tag) { buttontag = tag; }

    // Sort projects by rank (highest rank number first)
    $: sortedImageData = imageData
        .slice()
        .sort((a, b) => {
            const rankA = a.rank !== undefined ? a.rank : 0;
            const rankB = b.rank !== undefined ? b.rank : 0;
            return rankB - rankA;
        });
</script>

{#if showFilters}
<div class="buttons" role="group" aria-label="Filter projects">
  {#each filters as f}
    <button type="button" class:active={buttontag === f.tag} aria-pressed={buttontag === f.tag} on:click={() => SetButton(f.tag)}>
      {f.label}{#if f.tag !== 'all'}<span class="n">{f.n}</span>{/if}
    </button>
  {/each}
</div>
{/if}

{#if show}
<section>
    {#each sortedImageData as image, i}
    {#if image.show && matches(image, activeFilter)}
    <!-- The title is the card's one link; it stretches over the whole card, so links inside the
         description (e.g. The Pudding) stay real, separate links instead of links-inside-a-link. -->
    <article class="card__wrapper" transition:fade|local={{delay: i * 50}}>
        <div class="card__image-container">
            <Thumb class="image" src={image.url} video={image.video} alt={image.alt || `Preview of ${image.title}`} />
        </div>
        <div class="card__content">
            <div class="card__category-row">
                <p class="card__category">{image.desc}</p>
                {#if image.lang}
                <span class="card__lang">{image.lang}</span>
                {/if}
            </div>
            <h3 class="card__title"><a href={image.href} class="card__link">{image.title}</a></h3>
            <p class="card__desc">{@html image.description}</p>
            {#if image.tools?.length}
            <ul class="card__tools" aria-label="Built with">
                {#each image.tools as t}<li>{t}</li>{/each}
            </ul>
            {/if}
        </div>
    </article>
    {/if}
    {/each}
</section>
{/if}

<style>
    @import url('https://fonts.googleapis.com/css2?family=Jost:wght@500&family=Quicksand:wght@300;400;500;700&display=swap');

    * {
        box-sizing: border-box;
    }

    section {
        display: grid;
        max-width: 100vw;
        grid-template-columns: repeat(3, 1fr);
        grid-gap: 2rem;
        margin-left: 3%;
        margin-right: 3%;
        margin-top: 3%;
        padding-bottom: 3%;
    }

    .card__link {
        text-decoration: none;
        color: inherit;
    }
    /* stretch the title link over the whole card */
    .card__link::after {
        content: '';
        position: absolute;
        inset: 0;
        z-index: 1;
    }
    .card__link:focus-visible { outline: none; }
    /* links inside the description sit above the stretched title link */
    .card__desc :global(a) { position: relative; z-index: 2; }

    .card__tools {
        display: flex;
        flex-wrap: wrap;
        gap: .4rem;
        list-style: none;
        margin: 1.1rem 0 0;
        padding: 0;
    }
    .card__tools li {
        font-family: 'Jost', sans-serif;
        font-size: .78rem;
        font-weight: 500;
        letter-spacing: .03em;
        color: #1E5B8C;
        background: rgba(30, 91, 140, .08);
        padding: .2rem .65rem;
        border-radius: 999px;
    }

    .card__wrapper {
        position: relative;
        display: flex;
        flex-direction: column;
        background: white;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        outline: 2px solid transparent;
        outline-offset: 0;
        transition: outline-color 0.2s ease;
    }

    /* hover: a blue outline only (no lift, no zoom, no bigger shadow) */
    .card__wrapper { cursor: pointer; }
    .card__wrapper:hover, .card__wrapper:focus-within {
        outline-color: #1E5B8C;
    }

    .card__image-container {
        width: 100%;
        overflow: hidden;
        position: relative;
        background-color: white;
    }

    .card__image-container :global(.image) {
        width: 100%;
        height: auto;
        display: block;
        transition: transform 0.3s ease;
    }

    /* .card__wrapper:hover .image { transform: scale(1.05); }  (zoom removed) */

    .card__content {
                padding: 2rem 2.5rem;
        background: white;
    }

    .card__category-row {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 1rem;
        margin: 0 0 0.5rem 0;
    }

    .card__category {
        color: #999;
        font-family: 'Jost', sans-serif;
        font-size: 0.85rem;
        font-weight: 400;
        margin: 0;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .card__title {
        color: #333;
        font-family: 'Quicksand', sans-serif;
        font-size: 1.5rem;
        font-weight: 600;
        margin: 0 0 1rem 0;
        line-height: 1.3;
    }

    .card__desc {
        color: #707171;
        font-family: 'Jost', sans-serif;
        font-size: 1rem;
        font-weight: 400;
        margin: 0;
        line-height: 1.6;
    }

    .card__desc :global(a) {
        color: #707171;
        text-decoration: underline;
    }

    .card__desc :global(a:hover) {
        color: #333;
    }

    .card__lang {
        color: #707171;
        font-family: 'Jost', sans-serif;
        font-size: 0.85rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        white-space: nowrap;
    }

    .buttons {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        max-width: 60%;
        text-align: center;
        margin-right: 20%;
        margin-left: 20%;
        margin-top: 2%;
        gap: 8px;
    }

    button {
        transition-duration: 0.4s;
        font-family: 'Jost', sans-serif;
        font-size: 1.2rem;
        background-color: white;
        color: #707171;
        border: none;
        padding: 8px 16px;
        border-radius: 999px;
        cursor: pointer;
        margin: 4px;
    }

    button:hover {
        background-color: rgba(30, 91, 140, .1);
        color: #1E5B8C;
    }
    button.active {
        background-color: #1E5B8C;
        color: white;
    }
    button .n {
        margin-left: .35em;
        font-size: .75em;
        opacity: .6;
    }

    /* Tablet and Mobile Styles */
    @media (max-width: 1400px) {
        section {
            grid-template-columns: repeat(2, 1fr);
            grid-gap: 1.5rem;
        }
    }

    @media (max-width: 1024px) {
        section {
            margin-left: 5%;
            margin-right: 5%;
            grid-template-columns: repeat(2, 1fr);
            grid-gap: 1.5rem;
        }

        .buttons {
            max-width: 80%;
            margin-right: 10%;
            margin-left: 10%;
        }
    }

    @media (max-width: 768px) {
        section {
            grid-template-columns: 1fr;
            grid-gap: 1.5rem;
            margin-left: 3%;
            margin-right: 3%;
            margin-top: 5%;
        }

        /* one card per row: let each picture keep its own shape (a fixed height
           left a white gap under wide GIFs like the card trick) */
        .card__image-container {
            height: auto;
        }

        .card__content {
            padding: 1.5rem;
        }

        .card__category {
            font-size: 0.8rem;
        }

        .card__title {
            font-size: 1.3rem;
        }

        .card__desc {
            font-size: 0.95rem;
        }

        .buttons {
            max-width: 100%;
            margin-right: 5%;
            margin-left: 5%;
            margin-top: 5%;
        }

        button {
            font-size: 1.05rem;
            padding: 6px 12px;
        }
    }

    @media (max-width: 480px) {
        section {
            grid-template-columns: 1fr;
            grid-gap: 1rem;
            margin-left: 4%;
            margin-right: 4%;
        }

        .card__image-container {
            height: auto;
        }

        .card__category {
            font-size: 0.75rem;
        }

        .card__title {
            font-size: 1.1rem;
        }

        .card__desc {
            font-size: 0.9rem;
        }

        button {
            font-size: 1rem;
            padding: 6px 10px;
        }
    }

    /* ---- night mode (only ever on Home / Projects) ---- */
    :global(html[data-theme="dark"]) .card__wrapper, :global(html[data-theme="dark"]) .card__image-container,
    :global(html[data-theme="dark"]) .card__content { background: #1F303D; }
    :global(html[data-theme="dark"]) .card__wrapper { box-shadow: 0 4px 14px rgba(0, 0, 0, .35); }
    :global(html[data-theme="dark"]) .card__wrapper:hover, :global(html[data-theme="dark"]) .card__wrapper:focus-within { outline-color: #8CBDE6; }
    :global(html[data-theme="dark"]) .card__title, :global(html[data-theme="dark"]) .card__desc :global(a:hover) { color: #E9E4DA; }
    :global(html[data-theme="dark"]) .card__desc, :global(html[data-theme="dark"]) .card__desc :global(a),
    :global(html[data-theme="dark"]) .card__lang { color: #A7B3BB; }
    :global(html[data-theme="dark"]) .card__category { color: #8796A0; }
    :global(html[data-theme="dark"]) .card__tools li { color: #8CBDE6; background: rgba(140, 189, 230, .12); }
    :global(html[data-theme="dark"]) button { background-color: #1F303D; color: #A7B3BB; }
    :global(html[data-theme="dark"]) button:hover { background-color: rgba(140, 189, 230, .14); color: #8CBDE6; }
    :global(html[data-theme="dark"]) button.active { background-color: #8CBDE6; color: #14202A; }
</style>
