<script lang="ts">
	import {
		axisBottom,
		axisLeft,
		easeBounceOut,
		easeCircleIn,
		easeElasticIn,
		easeLinear,
		max,
		min,
		range,
		scaleBand,
		scaleLinear,
		select
	} from 'd3';
	import { onMount } from 'svelte';
	import { randomNums } from '../util';

	//Width and height
	const width = 600;
	const height = 250;
	const padding = 10;

	const dataset = [5, 10, 13, 19, 21, 25, 22, 18, 15, 13, 11, 12, 15, 20, 18, 17, 16, 18, 23, 25];

	// mike's margin convention
	const margin = { top: 20, right: 20, bottom: 20, left: 10 };
	// define inner width and height with margins subtracted
	const innerWidth = width - margin.right - margin.left,
		innerHeight = height - margin.top - margin.bottom;

	const xScale = scaleBand<number>()
		.domain(range(dataset.length))
		.rangeRound([padding, innerWidth])
		.paddingInner(0.05);

	const yScale = scaleLinear()
		.domain([0, max(dataset) || 0])
		.range([0, innerHeight]);

	onMount(() => {
		// define element G within svg that is pushed to center of svg by adding top margin and left margin
		const svg = select('svg')
			.append('g')
			.attr('transform', `translate(${margin.top},${margin.left})`);

		svg
			.selectAll('rect')
			.data(dataset)
			.enter()
			.append('rect')
			.attr('x', (_, i) => xScale(i) || 0)
			.attr('y', (d) => innerHeight - yScale(d))
			.attr('width', xScale.bandwidth())
			.attr('height', (d) => yScale(d))
			.attr('fill', (d) => `rgb(0, ${Math.round(d * 10)}, 0)`);

		svg
			.selectAll('text')
			.data(dataset)
			.enter()
			.append('text')
			.text((d) => d)
			.attr('text-anchor', 'middle')
			.attr('x', (_, i) => (xScale(i) || 0) + xScale.bandwidth() / 2)
			.attr('y', (d) => innerHeight - yScale(d) + 15)
			.attr('font-family', 'sans-serif')
			.attr('font-size', '11px')
			.attr('fill', 'white');

		// update chart on click
		select('p').on('click', () => {
			const newdata = randomNums(dataset.length, 0, 100);
			yScale.domain([0, max(newdata) || 0]);

			const duration = 500;
			const delayFn = (_: unknown, i: number) => (i / dataset.length) * 1000;
			svg
				.selectAll('rect')
				.data(newdata)
				.transition()
				.delay(delayFn)
				.duration(duration)
				.ease(easeBounceOut)
				.attr('y', (d) => innerHeight - yScale(d))
				.attr('height', (d) => yScale(d))
				.attr('fill', (d) => `rgb(0, ${Math.round(d * 10)}, 0)`);

			svg
				.selectAll('text')
				.data(newdata)
				.transition()
				.delay(delayFn)
				.duration(duration)
				.ease(easeBounceOut)
				.text((d) => d)
				.attr('x', (_, i) => (xScale(i) || 0) + xScale.bandwidth() / 2)
				.attr('y', (d) => innerHeight - yScale(d) + 15);
		});
	});
</script>

<svg {width} {height} />

<p>Click on this text to update the chart with new data values</p>
