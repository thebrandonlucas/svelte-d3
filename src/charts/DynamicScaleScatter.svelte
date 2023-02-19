<script lang="ts">
	import {
		axisBottom,
		axisLeft,
		max,
		scaleLinear,
		select,
		type BaseType,
		type Selection
	} from 'd3';
	import { onMount } from 'svelte';
	import { randomNumsMatrix } from '../util';

	const rows = 20,
		cols = 20,
		mini = 0,
		maxi = 1000;
	let data = randomNumsMatrix(rows, cols, mini, maxi);

	const padding = 30;
	const width = 500,
		height = 300;
	// domains, axes
	let xScale = scaleLinear()
		.domain([0, max(data, (d) => d[0]) || 0])
		// we add a little extra padding to the RIGHT end so text coordinates can be shown
		.range([padding, width - padding * 2]);
	let yScale = scaleLinear()
		.domain([0, max(data, (d) => d[1]) || 0])
		.range([height - padding, padding]);

	let xAxis = axisBottom(xScale);
	let yAxis = axisLeft(yScale);

	let svg: Selection<BaseType, unknown, HTMLElement, any>;
	let circles: Selection<SVGCircleElement, number[], BaseType, unknown>;
	onMount(() => {
		// create svg, add circles, call axes
		svg = select('svg');

		// clipping path
		svg
			.append('clipPath')
			.attr('id', 'chart-area')
			.append('rect')
			.attr('x', padding)
			.attr('y', padding)
			// The clip path width accounts for the scale's width (see scale variable):
			// - It's:
			//      width - LEFT padding
			//    + width - DOUBLE RIGHT padding
			// i.e. width - padding * 3
			.attr('width', width - padding * 3)
			// clip path height accounts for scale's height
			//      height - TOP padding
			//      height - BOTTOM padding
			// i.e. height - padding * 2
			.attr('height', height - padding * 2);

		// circles
		const r = 2;
		circles = svg
			.append('g')
			.attr('id', 'circles')
			.attr('clip-path', 'url(#chart-area)')
			.selectAll('circle')
			.data(data)
			.enter()
			.append('circle')
			.attr('cx', (d) => xScale(d[0]))
			.attr('cy', (d) => yScale(d[1]))
			.attr('r', r);

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
			.attr('fill', 'red');

		// axes
		svg
			.append('g')
			.attr('class', 'x axis')
			.attr('transform', `translate(0, ${height - padding})`)
			.call(xAxis);
		svg
			.append('g')
			.attr('class', 'y axis')
			.attr('transform', `translate(${padding}, 0)`)
			.call(yAxis);
	});

	function randomize() {
		data = randomNumsMatrix(rows, cols, mini, maxi);

		xScale.domain([0, max(data, (d) => d[0]) || 0]);
		yScale.domain([0, max(data, (d) => d[1]) || 0]);

		// Delay between points in milliseconds
		const duration = 1000;
		// update circles
		svg
			.selectAll('circle')
			.data(data)
			.transition()
			.duration(duration)
			.on('start', () => {
				circles.attr('fill', 'magenta').attr('r', 3);
			})
			.attr('cx', (d) => xScale(d[0]))
			.attr('cy', (d) => yScale(d[1]))
			.transition()
			.attr('fill', 'black')
			.attr('r', 2);
		// update text
		svg
			.selectAll('text')
			.data(data)
			.transition()
			.duration(duration)
			.attr('x', (d) => xScale(d[0]))
			.attr('y', (d) => yScale(d[1]))
			.text((d) => `${d[0]},${d[1]}`);

		// update axes
		// FIXME: TS error
		//  - Argument of type 'Axis<NumberValue>' is not assignable to parameter of type
		//  '(transition: Transition<BaseType, unknown, HTMLElement, any>, ...args: any[]) => any'.
		svg
			.select('.x.axis')
			.transition()
			.duration(duration)
			.call(xAxis as any);
		svg
			.select('.y.axis')
			.transition()
			.duration(duration)
			.call(yAxis as any);
	}
</script>

<svg {width} {height} />
<button on:click={randomize}>Randomize!</button>
