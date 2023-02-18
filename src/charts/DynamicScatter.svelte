<script lang="ts">
	import {
		axisBottom,
		axisLeft,
		max,
		min,
		scaleLinear,
		select,
		type Selection,
		type Transition
	} from 'd3';
	import { onMount } from 'svelte';
	import { randomNumsMatrix } from '../util';

	const rows = 10,
		cols = 10,
		minimum = 0,
		maximum = 100;
	const data = randomNumsMatrix(rows, cols, minimum, maximum);

	// margin convention
	// 1 - define margins
	const margin = { top: 30, left: 20, right: 30, bottom: 20 };
	// 2 - set height/width, innerHeight/innerWidth based on margin offset
	const height = 250,
		width = 500,
		innerHeight = height - margin.top - margin.bottom,
		innerWidth = width - margin.left - margin.right;

	// create scales
	const xScale = scaleLinear()
		.domain([0, max(data, (d) => d[0]) || 0])
		.range([0, innerWidth]);
	const yScale = scaleLinear()
		.domain([0, max(data, (d) => d[1]) || 0])
		.range([innerHeight, 0]);

	// axes
	let xAxis = axisBottom(xScale);
	let yAxis = axisLeft(yScale);

	let svg: Selection<SVGGElement, unknown, HTMLElement, any>;
	onMount(() => {
		// 3 - create G element within SVG and translate it to the center from the top-left
		// this will be our new chart
		svg = select('svg').append('g').attr('transform', `translate(${margin.top},${margin.left})`);
		// append a new group for each axis and call it
		// Call the `call` method on the axes and pass in the explicit typing for the `transition` object
		svg
			.append('g')
			.attr('class', 'axis')
			.attr('transform', `translate(0, ${innerHeight})`)
			.call((g) => {
				const axis = g as Selection<SVGGElement, unknown, HTMLElement, any>;
				axis.call(
					xAxis as (
						g: Selection<SVGGElement, unknown, HTMLElement, any>,
						transition: Transition<any, any, any, any>
					) => void
				);
			});

		svg
			.append('g')
			.attr('class', 'axis')
			.call((g) => {
				const axis = g as Selection<SVGGElement, unknown, HTMLElement, any>;
				axis.call(
					yAxis as (
						g: Selection<SVGGElement, unknown, HTMLElement, any>,
						transition: Transition<any, any, any, any>
					) => void
				);
			});

		// create circles
		svg
			.selectAll('circle')
			.data(data)
			.enter()
			.append('circle')
			.attr('cx', (d) => xScale(d[0]))
			.attr('cy', (d) => yScale(d[1]))
			.attr('r', 3);

		svg
			.selectAll('text')
			.data(data)
			.enter()
			.append('text')
			.text((d) => `${d[0]},${d[1]}`)
			.attr('x', (d) => xScale(d[0]))
			.attr('y', (d) => yScale(d[1]))
			.attr('font-family', 'sans-serif')
			.attr('font-size', '11px')
			.attr('fill', 'black');
	});

	function randomize() {
		const newdata = randomNumsMatrix(rows, cols, minimum, maximum);
		console.log({ newdata });
		svg
			.selectAll('circle')
			.data(newdata)
			.transition()
			.attr('cx', (d) => xScale(d[0]))
			.attr('cy', (d) => yScale(d[1]))
			.attr('r', 3);

		// update axes
		svg.select('.x.axis').transition().duration(1000).call(xAxis);
		svg.select('.y.axis').transition().duration(1000).call(yAxis);
	}
</script>

<svg {width} {height} />

<button on:click={randomize}>Randomize</button>
