<script lang="ts">
	import {
		ascending,
		descending,
		max,
		min,
		range,
		scaleBand,
		scaleLinear,
		select,
		type BaseType,
		type Selection
	} from 'd3';
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

	let svg: Selection<BaseType, unknown, HTMLElement, any>;
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
			.on('mouseover', (event, _) =>
				select(event.currentTarget).transition('highlight').duration(150).attr('fill', 'orange')
			)
			.on('mouseout', (event, d) =>
				select(event.currentTarget)
					.transition('dehighlight')
					.duration(150)
					.attr('fill', () => `rgb(${colorScale(d)}, 0, 0)`)
			)
			.on('click', () => sortBars());

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

	let sortAscending = true;
	function sortBars() {
		svg
			.selectAll('rect')
			.sort((a, b) => {
				const n1 = a as number,
					n2 = b as number;
				return sortAscending ? ascending(n1, n2) : descending(n1, n2);
			})
			.transition('sortBars')
			.duration(1000)
			.attr('x', (_, i) => x(i) || 0);

		// sort text
		svg
			.selectAll('text')
			.sort((a, b) => {
				const s1 = a as string,
					s2 = b as string;
				return sortAscending ? ascending(s1, s2) : descending(s1, s2);
			})
			.transition('sortText')
			.duration(1000)
			.attr('x', (_, i) => (x(i) || 0) + x.bandwidth() / 2);
		sortAscending = !sortAscending;
	}
</script>

<svg {width} {height} />
<p>Click a bar to sort it ascending or descending!</p>
