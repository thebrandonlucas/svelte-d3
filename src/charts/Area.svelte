<script lang="ts">
	import {
		area,
		axisBottom,
		axisLeft,
		csv,
		extent,
		max,
		scaleLinear,
		scaleTime,
		select,
		timeParse,
		type DSVRowString
	} from 'd3';
	import { onMount } from 'svelte';

	const margin = { top: 10, right: 30, bottom: 30, left: 50 },
		height = 300,
		width = 500,
		innerHeight = height - margin.top - margin.bottom,
		innerWidth = width - margin.left - margin.right;

	function rowConverter(rawRow: DSVRowString<'date' | 'value'>) {
		return {
			date: timeParse('%Y-%m-%d')(rawRow.date || '') || new Date(Infinity),
			value: parseInt(rawRow.value || '')
		};
	}

	onMount(async () => {
		const chart = select('svg')
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);

		const data = await csv(
			'https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv',
			rowConverter
		);

		const x = scaleTime()
			// FIXME: how to type?
			.domain(extent(data, (d) => d.date) as [Date, Date])
			.range([0, innerWidth]);
		const y = scaleLinear()
			.domain([0, max(data, (d) => d.value) || 0])
			.range([innerHeight, 0]);

		const xAxis = axisBottom(x);
		const yAxis = axisLeft(y);

		chart
			.append('g')
			.attr('class', 'x axis')
			.attr('transform', `translate(0, ${innerHeight})`)
			.call(xAxis);
		chart.append('g').attr('class', 'y axis').call(yAxis);

		// area generator
		const a = area<(typeof data)[0]>()
			.x((d) => x(d.date))
			.y0(y(0))
			.y1((d) => y(d.value));

		// The data IS the SVG we're binding to, so we only need one svg and hence data is datum()
		chart
			.append('path')
			.datum(data)
			.attr('fill', 'green')
			.attr('stroke', 'blue')
			.attr('stroke-width', 2)
			.attr('d', a);
	});
</script>

<svg {width} {height} />
