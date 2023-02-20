<script lang="ts">
	import { max, min, range, scaleBand, scaleLinear, select } from 'd3';
	import { onMount } from 'svelte';
	import { randomNums } from '../util';

	const n = 30,
		mini = 0,
		maxi = 100;
	let data = randomNums(n, mini, maxi);

	const width = 500,
		height = 250;
	const x = scaleBand<number>().domain(range(data.length)).range([0, width]).paddingInner(0.05);
	const y = scaleLinear()
		.domain([0, max(data) || 0])
		.range([0, height]);

	let svg;
	const COLORS_MIN_MAX = [0, 255];
	const colorScale = scaleLinear()
		.domain([min(data) || 0, max(data) || 0])
		.range([...COLORS_MIN_MAX]);
	onMount(() => {
		svg = select('svg');
		svg
			.selectAll('rect')
			.data(data)
			.enter()
			.append('rect')

			.attr('x', (_, i) => x(i) || 0)
			.attr('y', (d) => height - y(d))
			.attr('width', x.bandwidth())
			.attr('height', (d) => y(d))
			.attr('fill', (d) => `rgb(${colorScale(d)}, 0, 0)`)
			// can also use regular function() to access "this"
			.on('mouseover', (event, d) => {
				console.log({ event });
				select(event.currentTarget).transition().duration(150).attr('fill', 'orange');

				const xPosition = parseFloat(select(event?.currentTarget).attr('x')) + x.bandwidth() / 2;
				const yPosition = parseFloat(select(event.currentTarget).attr('y'));
				// tooltip
				select('#tooltip')
					.style('left', `${xPosition}px`)
					.style('top', `${yPosition}px`)
					.select('#value')
					.text(d);

				// show tip
				select('#tooltip').classed('hidden', false);
			})
			.on('mouseout', (event, d) => {
				select(event.currentTarget)
					.transition()
					.duration(150)
					.attr('fill', () => `rgb(${colorScale(d)}, 0, 0)`);

				// hide tooltip
				select('#tooltip').classed('hidden', true);
			})
			.append('title')
			.text((d) => d);

		svg
			.selectAll('text')
			.data(data)
			.enter()
			.append('text')
			.text((d) => d)
			.attr('x', (_, i) => (x(i) || 0) + x.bandwidth() / 2)
			.attr('y', (d) => height - y(d) + 15)
			.attr('fill', 'white')
			.attr('text-anchor', 'middle')
			.attr('font-family', 'sans-serif')
			.attr('font-size', '11px')
			.style('pointer-events', 'none');
	});
</script>

<svg {width} {height} />

<div id="tooltip" class="hidden">
	<p><strong>Header here</strong></p>
	<p><span id="value">100</span>%</p>
</div>

<style>
	#tooltip {
		position: absolute;
		width: 200px;
		height: auto;
		padding: 10px;
		background-color: white;
		border: 1px solid black;
		pointer-events: none;
	}

	#tooltip.hidden {
		display: none;
	}
</style>
