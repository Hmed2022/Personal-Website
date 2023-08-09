<script>
  import { tweened } from 'svelte/motion';

  export let x;
  export let y;
  export let width;
  export let height;
  export let tweenOptions = undefined;

	// @ts-ignore
	let tweened_x = tweened(x, tweenOptions?.x);
  // @ts-ignore
  let tweened_y = tweened(y, tweenOptions?.y);
  // @ts-ignore
  let tweened_width = tweened(width, tweenOptions?.width);
  // @ts-ignore
  let tweened_height = tweened(height, tweenOptions?.height);

 // @ts-ignore
   $: tweened_x.set(x, tweenOptions?.x);
 // @ts-ignore
   $: tweened_y.set(y, tweenOptions?.y);
 // @ts-ignore
   $: tweened_width.set(width, tweenOptions?.width);
 // @ts-ignore
   $: tweened_height.set(height, tweenOptions?.height);
</script>

<rect 
  x={$tweened_x}
  y={$tweened_y}
  width={$tweened_width}
  height={$tweened_height}
  role="button"
  tabindex="0"
  aria-label="Clickable Rectangle"
  {...$$restProps}
  on:click
/>

