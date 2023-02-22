<script lang="ts">
	import { arc, pie, scaleOrdinal, schemeBlues, schemeCategory10, select } from 'd3';
	import { onMount } from 'svelte';

	const dataset = [5, 10, 20, 45, 6, 25];

	const width = 500,
		height = 500;

	const pieFn = pie();

	const outerRadius = width / 2,
		innerRadius = 0;
	const arcFn = arc().innerRadius(innerRadius).outerRadius(outerRadius);

	const color = scaleOrdinal(schemeCategory10);
	onMount(() => {
		const chart = select('svg');
		const arcs = chart
			.selectAll('g.arc')
			.data(pieFn(dataset))
			.join('g')
			.attr('class', 'arc')
			.attr('transform', `translate(${outerRadius},${outerRadius})`);

		arcs
			.append('path')
			.attr('fill', (_, i) => color(String(i)))
			.attr('d', arcFn);

		arcs
			.append('text')
			.attr('transform', (d) => `translate(${arcFn.centroid(d)})`)
			.attr('text-anchor', 'middle')
			.text((d) => d.value)
			.attr('font-family', 'sans-serif')
			.attr('fill', 'white');
	});
</script>

<svg {width} {height} />
