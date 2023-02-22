<script lang="ts">
	import {
		area,
		axisBottom,
		axisRight,
		csv,
		max,
		min,
		scaleLinear,
		scaleTime,
		schemeCategory10,
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

	const parseTime = timeParse('%Y-%m');

	// stacked chart takes data of following type:
	// Array with { date: Date(), metric1, metric2, ... metricN }
	function rowConvert(csvRow: any) {
		// TODO: TS
		let row: any = {};
		Object.keys(csvRow).forEach((key) => {
			row[key] = key === 'Date' ? parseTime(csvRow.Date) : parseInt(csvRow[key]) || 0;
		});
		return row;
	}

	const stk = stack().order(stackOrderDescending);

	onMount(async () => {
		const data = await csv('ev_sales_data.csv', rowConvert);

		const chart = select('svg')
			.append('g')
			.attr('transform', `translate(${margin.top},${margin.right})`);

		// remove the "date" key so that we don't include it in stacking
		const keys = Object.keys(data[0]);
		keys.shift();
		// set the stack's keys
		stk.keys(keys);
		// stack the data
		const series = stk(data);

		// set scales & axes
		const x = scaleTime()
			.domain([min(data, ({ Date }) => Date), max(data, ({ Date }) => Date)])
			.range([0, innerWidth]);
		const y = scaleLinear()
			.domain([
				0,
				max(data, (d) => {
					let sum = 0;
					Object.keys(d).forEach((key) => {
						if (key !== 'Date') {
							sum += d[key];
						}
					});
					return sum;
				}) || 0
			])
			.range([innerHeight, 0]);

		const xAxis = axisBottom(x);
		const yAxis = axisRight(y);

		// create area generator
		const ar = area()
			.x((d) => x(d.Date))
			.y0(() => y(d[0]))
			.y1((d) => y(d[1]));

		// area paths
		chart
			.selectAll('path')
			.data(series)
			.join('path')
			.attr('d', ar)
			.attr('fill', (_, i) => schemeCategory10[i])
			.append('title')
			.text((d) => d.key);
	});

	const x = scaleTime();
</script>

<svg {width} {height} />
