<script lang="ts">
	import {
		max,
		min,
		randomInt,
		range,
		scaleBand,
		scaleLinear,
		select,
		type BaseType,
		type Selection
	} from 'd3';
	import { onMount } from 'svelte';
	import { randomNums } from '../util';

	const n = 20,
		mini = 1,
		maxi = 100;
	let data = randomNums(n, mini, maxi);

	const COLOR_MAX = 255;
	const colorScale = scaleLinear()
		.domain([min(data) || 0, max(data) || 0])
		.range([0, COLOR_MAX]);

	const width = 500,
		height = 250;

	// scales
	const xScale = scaleBand<number>()
		.domain(range(data.length))
		// Leave room on the left for y axis, on the right for text area
		.rangeRound([0, width])
		.paddingInner(0.05);

	const yScale = scaleLinear()
		.domain([0, max(data) || 0])
		.range([0, height]);

	// svg + bars
	let svg: Selection<BaseType, unknown, HTMLElement, any>;
	// FIXME: bad TS
	let bars: Selection<any, number, BaseType, unknown>;
	let text: Selection<any, number, BaseType, unknown>;
	onMount(() => {
		svg = select('svg');

		// bars
		bars = svg.selectAll('rect').data(data);
		bars
			.enter()
			.append('rect')
			.attr('x', (_, i) => xScale(i) || 0)
			.attr('y', (d) => height - yScale(d))
			.attr('width', xScale.bandwidth())
			.attr('height', (d) => yScale(d))
			.attr('fill', (d) => `rgb(${colorScale(d)}, 0, 0)`);

		// text
		text = svg.selectAll('text').data(data);
		text
			.enter()
			.append('text')
			.text((d) => d)
			.attr('x', (_, i) => (xScale(i) || 0) + xScale.bandwidth() / 2)
			.attr('y', (d) => height - yScale(d) + 15)
			.attr('text-anchor', 'middle')
			.attr('fill', 'white')
			.attr('font-family', 'sans-serif')
			.attr('font-size', '11px');
	});

	// add bar + update scales + axes

	function addValue() {
		data.push(randomInt(100)());
		// update the domains
		xScale.domain(range(data.length));
		yScale.domain([0, max(data) || 0]);
		bars = svg.selectAll('rect').data(data);
		bars
			.enter()
			.append('rect')
			// specify that new one comes in from the right and not the top-left
			.attr('x', width)
			.attr('y', (d) => height - yScale(d))
			.attr('width', xScale.bandwidth())
			.attr('height', (d) => yScale(d))
			.attr('fill', (d) => `rgb(${colorScale(d)}, 0, 0)`)
			.merge(bars)
			.transition()
			.duration(500)
			.attr('x', (_, i) => xScale(i) || 0)
			.attr('y', (d) => height - yScale(d))
			.attr('width', xScale.bandwidth())
			.attr('height', (d) => yScale(d));

		// update text
		text = svg.selectAll('text').data(data);
		text
			.enter()
			.append('text')
			.text((d) => d)
			.attr('x', width)
			.attr('y', (d) => height - yScale(d) + 15)
			.merge(text)
			.transition()
			.duration(500)
			.attr('x', (_, i) => (xScale(i) || 0) + xScale.bandwidth() / 2)
			.attr('y', (d) => height - yScale(d) + 15)
			.attr('text-anchor', 'middle')
			.attr('fill', 'white')
			.attr('font-family', 'sans-serif')
			.attr('font-size', '11px');
	}

	function removeValue() {
		data.shift();
		// update the domains
		xScale.domain(range(data.length));
		yScale.domain([0, max(data) || 0]);
		bars = svg.selectAll('rect').data(data);

		// update bar movement before removing
		bars
			.enter()
			.append('rect')
			.attr('x', width)
			.attr('y', (d) => height - yScale(d))
			.attr('width', xScale.bandwidth())
			.attr('height', (d) => yScale(d))
			.attr('fill', (d) => `rgb(${colorScale(d)}, 0, 0)`)
			.merge(bars)
			.transition()
			.duration(500)
			.attr('x', (_, i) => xScale(i) || 0)
			.attr('y', (d) => height - yScale(d))
			.attr('width', xScale.bandwidth())
			.attr('height', (d) => yScale(d));

		// remove
		bars.exit().transition().duration(500).attr('x', -xScale.bandwidth()).remove();
	}
</script>

<svg {width} {height} />
<button on:click={addValue}>Add a single value to the dataset</button>
<button on:click={removeValue}>Remove a single value</button>
