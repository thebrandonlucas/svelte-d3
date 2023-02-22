<script lang="ts">
	import {
		area,
		axisBottom,
		axisLeft,
		color,
		csv,
		extent,
		group,
		max,
		scaleLinear,
		scaleOrdinal,
		scaleTime,
		schemeSet2,
		schemeSet3,
		schemeSpectral,
		select,
		stack,
		stackOrderDescending,
		sum,
		timeParse
	} from 'd3';
	import { onMount } from 'svelte';

	const margin = { top: 20, right: 20, bottom: 20, left: 20 };
	const height = 300,
		width = 500,
		innerHeight = height - margin.top - margin.bottom,
		innerWidth = width - margin.left - margin.right;

	onMount(async () => {
		const data = await csv(
			'https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/5_OneCatSevNumOrdered_wide.csv'
		);

		const keys = data.columns.slice(1);

		const stackedData = stack().keys(keys)(data);

		const x = scaleTime()
			.domain(extent(data, (d: any) => d.year))
			.range([0, innerWidth]);
		// TODO: use extent with accessor to get max
		const y = scaleLinear().domain([0, 200_000]).range([innerHeight, 0]);

		const chart = select('svg')
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);
		// axes
		chart
			.append('g')
			.attr('class', 'x axis')
			.attr('transform', `translate(0, ${innerHeight})`)
			.call(axisBottom(x));
		chart.append('g').attr('class', 'y axis').call(axisLeft(y));

		// area generator
		const areaGen = area()
			.x((d) => x(d.data.year))
			.y0((d) => y(d[0]))
			.y1((d) => y(d[1]));

		// color scale
		const color = scaleOrdinal().domain(keys).range(schemeSet3);
		// show areas
		chart
			.selectAll('path')
			.data(stackedData)
			.join('path')
			.style('fill', (d) => color(d.key))
			.attr('d', areaGen);

		console.log({ data, stackedData, keys });
	});
</script>

<svg {width} {height} />
