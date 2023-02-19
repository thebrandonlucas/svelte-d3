<script lang="ts">
	import {
		axisBottom,
		axisLeft,
		format,
		max,
		scaleLinear,
		scaleSqrt,
		select,
		zip,
		type BaseType,
		type Selection
	} from 'd3';
	import { onMount } from 'svelte';
	import { randomNums } from '../util';

	const w = 500;
	const h = 300;
	const padding = 40;

	const xs = randomNums(20, 10, 450);
	const ys = randomNums(20, 10, 90);
	const data = zip(xs, ys);
	let circles: Selection<SVGCircleElement, number[], BaseType, unknown>;
	const xScale = scaleLinear()
		// domain is the true values of your data
		// range is the screen's representation of that data
		.domain([0, max(data, (d) => d[0]) || 0])
		.range([padding, w - padding * 2]);
	const yScale = scaleLinear()
		.domain([0, max(data, (d) => d[1]) || 0])
		.range([h - padding, padding]);
	const aScale = scaleSqrt()
		.domain([0, max(data, (d) => d[1]) || 0])
		.range([0, 10]);

	const formatAsPercentage = format('x'); // x-axis is now hex format, why not?

	onMount(() => {
		circles = select('svg')
			.selectAll('circle')
			.data(data)
			.enter()
			.append('circle')
			.attr('cx', (d) => xScale(d[0]))
			.attr('cy', (d) => yScale(d[1]))
			.attr('r', (d) => aScale(d[1]));

		select('svg')
			.selectAll('text')
			.data(data)
			.enter()
			.append('text')
			.text((d) => `${d[0]},${d[1]}`)
			.attr('x', (d) => xScale(d[0]))
			.attr('y', (d) => yScale(d[1]))
			.attr('font-family', 'sans-serif')
			.attr('font-size', '11px')
			.attr('fill', 'red');

		const xAxis = axisBottom(xScale).ticks(5).tickFormat(formatAsPercentage);
		select('svg')
			.append('g')
			.attr('class', 'axis')
			.attr('transform', `translate(0, ${h - padding})`)
			.call(xAxis);

		const yAxis = axisLeft(yScale).ticks(5);
		select('svg')
			.append('g')
			.attr('class', 'axis')
			.attr('transform', `translate(${padding}, 0)`)
			.call(yAxis);
	});
</script>

<svg width={w} height={h} />

<style>
	.axis path,
	.axis line {
		stroke: teal;
		shape-rendering: crispEdges;
	}
	.axis text {
		font-family: Optima, Futura, sans-serif;
		font-weight: bold;
		font-size: 14px;
		fill: teal;
	}
</style>
