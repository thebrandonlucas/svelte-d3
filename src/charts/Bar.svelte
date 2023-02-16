<script lang="ts">
	import { select, type BaseType, type Selection } from 'd3';
	import { onMount } from 'svelte';
	import { identity } from 'svelte/internal';
	import { randomNums } from '../util';

	const w = 1000;
	const h = 200;
	const barPadding = 1;
	const barHeightOffset = 4;

	const data = randomNums(20, 0, 20);

	let rects: Selection<SVGRectElement, number, BaseType, unknown>;
	let labels: Selection<SVGTextElement, number, BaseType, unknown>;

	const xPos = (_: unknown, i: number) => i * (w / data.length);
	onMount(() => {
		rects = select('svg')
			.selectAll('rect')
			.data(data)
			.enter()
			.append('rect')
			// bars should move over relative to width of svg divided by amount of data
			.attr('x', xPos)
			// specify the "top" of each bar from which to grow downward
			.attr('y', (d) => h - d * barHeightOffset)
			.attr('width', w / data.length - barPadding)
			.attr('height', (d) => d * barHeightOffset)
			.attr('fill', (d) => `rgb(0, 0, ${Math.round(d * 10)})`);

		labels = select('svg')
			.selectAll('text')
			.data(data)
			.enter()
			.append('text')
			.text(identity)
			// i * (w / data.length): offset at which to start drawing for bar i
			// (w / data.length - barPadding): width of an individual bar
			// divide by 2 to center text
			.attr('x', (_, i) => i * (w / data.length) + (w / data.length - barPadding) / 2)
			.attr('y', (d) => h - d * 4 + 14)
			.attr('font-family', 'sans-serif')
			.attr('font-size', '11px')
			.attr('fill', 'white')
			.attr('text-anchor', 'middle');
	});
</script>

<svg width={w} height={h} />
