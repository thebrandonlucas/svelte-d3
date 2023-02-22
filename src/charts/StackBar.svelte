<script lang="ts">
	import {
		easeBack,
		easeBackInOut,
		easeBounceIn,
		easeCircle,
		easeCubicIn,
		easeElasticIn,
		easeExp,
		easePoly,
		max,
		range,
		scaleBand,
		scaleLinear,
		scaleOrdinal,
		schemeCategory10,
		select,
		stack,
		stackOrderAscending,
		stackOrderDescending,
		type BaseType,
		type Selection,
		type Series
	} from 'd3';
	import { onMount } from 'svelte';

	//Width and height
	const width = 500;
	const height = 300;
	const padding = 30;

	//Original data
	const dataset = [
		{ apples: 5, oranges: 10, grapes: 22 },
		{ apples: 4, oranges: 12, grapes: 28 },
		{ apples: 2, oranges: 19, grapes: 32 },
		{ apples: 7, oranges: 23, grapes: 35 },
		{ apples: 23, oranges: 17, grapes: 43 }
	];

	const stck = stack().keys(['apples', 'oranges', 'grapes']).order(stackOrderDescending);
	const series = stck(dataset);

	const x = scaleBand<number>().domain(range(dataset.length)).range([0, width]).paddingInner(0.05);
	const y = scaleLinear()
		.domain([0, max(dataset, ({ apples, oranges, grapes }) => apples + oranges + grapes) || 0])
		.range([height, 0]);

	$: console.log({ stck, series });
	//Easy colors accessible via a 10-step ordinal scale
	const colors = scaleOrdinal(schemeCategory10);

	let groups: Selection<
		BaseType,
		Series<
			{
				[key: string]: number;
			},
			string
		>,
		BaseType,
		unknown
	>;

	onMount(() => {
		const svg = select('svg');

		groups = svg
			.selectAll('g')
			.data(series)
			.join('g')
			.style('fill', (_, i) => colors(String(i)));

		const barTransitionDelay = 100,
			barTransitionDuration = 1000;
		const rects = groups
			.selectAll('rect')
			// bind using each row as data
			.data((d) => d)
			.join('rect')
			.attr('x', (_, i) => x(i) || 0)
			.attr('width', x.bandwidth())
			.transition()
			.delay((_, i) => i * barTransitionDelay)
			.duration(barTransitionDuration)
			.ease(easeBack)
			.attr('y', (d) => y(d[1]))
			// compare baseline value (d[0]) with topline value (d[1])
			// top of current bar is bottom of next bar, etc.
			.attr('height', (d) => y(d[0]) - y(d[1]));
	});
</script>

<svg {width} {height} />
