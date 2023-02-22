<script lang="ts">
	import {
		area,
		axisBottom,
		axisLeft,
		csv,
		curveStepAfter,
		extent,
		line,
		scaleLinear,
		scaleOrdinal,
		scaleTime,
		schemeSet2,
		schemeSet3,
		select,
		stack,
		timeParse,
		type DSVRowString
	} from 'd3';
	import { onMount } from 'svelte';

	const margin = { top: 20, right: 20, bottom: 20, left: 50 };
	const height = 300,
		width = 500,
		innerHeight = height - margin.top - margin.bottom,
		innerWidth = width - margin.left - margin.right;

	function rowConverter(rawRow: any) {
		const formatTime = timeParse('%Y');
		return Object.fromEntries(
			Object.entries(rawRow).map(([key, value]) =>
				key === 'year' ? [key, formatTime(value as string)] : [key, parseInt(value as string)]
			)
		);
	}

	onMount(async () => {
		const chart = select('svg')
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);

		const d = await csv(
			'https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/5_OneCatSevNumOrdered_wide.csv',
			rowConverter
		);

		const data = d.slice(100);

		console.log({ data });

		// Amanda,
		const keys = d.columns.slice(1);

		// color scale
		const color = scaleOrdinal().domain(keys).range(schemeSet2);
		const darkened = scaleOrdinal().domain(keys).range(schemeSet3);

		const stackedData = stack().keys(keys)(data);

		console.log({ stackedData });

		const x = scaleTime()
			.domain(extent(data, (d: any) => d.year))
			.range([0, innerWidth]);

		const areaChart = chart.append('g');
		const lineChart = chart.append('g');

		chart
			.append('g')
			.attr('class', 'x axis')
			.attr('transform', `translate(0, ${innerHeight})`)
			.call(axisBottom(x).ticks(5));
		// TODO: use extent with accessor to get max
		const y = scaleLinear().domain([0, 200_000]).range([innerHeight, 0]);
		chart.append('g').attr('class', 'y axis').call(axisLeft(y));

		// area generator
		const areaGen = area()
			.curve(curveStepAfter)
			.x((d) => x(d.data.year))
			.y0((d) => y(d[0]))
			.y1((d) => y(d[1]));

		// show areas
		areaChart
			.selectAll('path')
			.data(stackedData)
			.join('path')
			.style('stroke', 'none')
			.style('fill', (d) => color(d.key))
			.transition()
			.duration(3000)
			.attr('d', areaGen);

		// Add the line

		lineChart
			.selectAll('path')
			.data(stackedData)
			.join('path')
			.attr('fill', 'none')
			.attr('stroke', (d) => darkened(d.key))
			.attr('stroke-width', 1)
			.attr(
				'd',
				line()
					.curve(curveStepAfter)
					.x((d) => x(d.data.year))
					.y((d) => y(d[1]))
			);
	});
</script>

<svg {width} {height} />
