<script lang="ts">
	import { scaleLinear, select, max, scaleBand, range, type Selection, type BaseType } from 'd3';
	import { onMount } from 'svelte';
	import { randomNums } from '../util';

	const width = 500,
		height = 250;
	const padding = 30;
	const n = 20,
		minimum = 0,
		maximum = 100;
	let data = randomNums(n, minimum, maximum);

	const xScale = scaleBand<number>()
		.domain(range(data.length) || 0)
		.rangeRound([0, width])
		.paddingInner(0.05);
	const yScale = scaleLinear()
		.domain([0, max(data) || 0])
		.range([0, height]);

	const calcX = (_: unknown, i: number) => xScale(i) || 0;
	const calcY = (d: number) => height - yScale(d);
	const calcWidth = () => xScale.bandwidth();
	const calcHeight = (d: number) => yScale(d);
	const calcFill = (d: number) => `rgb(${d * 2}, 0, ${d * 3})`;

	const textYPadding = 15;
	const textXPadding = xScale.bandwidth() / 2;
	let svg: Selection<BaseType, unknown, HTMLElement, any>;
	onMount(() => {
		svg = select('svg');
		svg
			.selectAll('rect')
			.data(data)
			.enter()
			.append('rect')
			.attr('x', calcX)
			.attr('y', calcY)
			.attr('width', calcWidth)
			.attr('height', calcHeight)
			.attr('fill', calcFill);

		svg
			.selectAll('text')
			.data(data)
			.enter()
			.append('text')
			.text((d) => d)
			.attr('x', (_, i) => (xScale(i) || 0) + textXPadding)
			.attr('y', (d) => height - yScale(d) + textYPadding)
			.attr('text-anchor', 'middle')
			.attr('font-family', 'sans-serif')
			.attr('font-size', '11px')
			.attr('fill', 'white');
	});

	function handleClick() {
		// transition scales
		// transition bars
		// transition text
		data = randomNums(n, minimum, maximum);
		const delayFn = (_: unknown, i: number) => i * data.length * 3;
		yScale.domain([0, max(data) || 0]);
		svg
			.selectAll('rect')
			.data(data)
			.transition()
			.duration(500)
			.delay(delayFn)
			.attr('y', calcY)
			.attr('height', calcHeight)
			.attr('fill', calcFill);

		svg
			.selectAll('text')
			.data(data)
			.transition()
			.duration(500)
			.delay(delayFn)
			.text((d) => d)
			.attr('y', (d) => height - yScale(d) + textYPadding);
	}
</script>

<svg {width} {height} />
<button on:click={handleClick}>Click me!</button>
