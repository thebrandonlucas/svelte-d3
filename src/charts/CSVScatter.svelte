<script lang="ts">
	import {
		axisBottom,
		axisLeft,
		csv,
		max,
		min,
		scaleLinear,
		scaleTime,
		select,
		timeFormat,
		timeParse,
		type DSVRowString,
		type NumberValue
	} from 'd3';
	import { onMount } from 'svelte';

	const padding = 20;

	// mike bostock margin convention
	// define margins object
	const margin = { top: 20, right: 10, bottom: 20, left: 10 };
	// define width and height as inner dimensions of the chart area
	const outerWidth = 500,
		outerHeight = 200,
		width = 500 - margin.left - margin.right,
		height = 200 - margin.top - margin.bottom;

	const parseTime = timeParse('%m/%d/%Y');
	const formatTime = timeFormat('%b %e');
	const axisFormatTime = timeFormat('%m/%d');

	function rowConverter(d: DSVRowString<string>) {
		return {
			Date: parseTime(d.Date || '') || new Date(Infinity),
			Amount: parseInt(d.Amount || '')
		};
	}

	onMount(async () => {
		const data = await csv('time_scale_data.csv', rowConverter);
		const xScale = scaleTime()
			.domain([min(data, (d) => d.Date) || 0, max(data, (d) => d.Date) || 0])
			.range([padding, width - padding]);
		const yScale = scaleLinear()
			.domain([0, max(data, (d) => d.Amount) || 0])
			.range([height, 0]);

		// Fixme: broken Typescript
		const xAxis = axisBottom(xScale)
			.ticks(5)
			.tickFormat(axisFormatTime as (domainValue: Date | NumberValue, index: number) => string);
		const yAxis = axisLeft(yScale);

		// define svg as a G element which translates the origin to top-left corner of chart area
		const svg = select('svg')
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);

		svg
			.selectAll('circle')
			.data(data)
			.enter()
			.append('circle')
			.attr('cx', (d) => xScale(d.Date))
			.attr('cy', (d) => yScale(d.Amount))
			.attr('r', (d) => Math.sqrt(d.Amount));

		svg
			.selectAll('text')
			.data(data)
			.enter()
			.append('text')
			.text((d) => formatTime(d.Date))
			.attr('x', (d) => xScale(d.Date))
			.attr('y', (d) => yScale(d.Amount))
			.attr('font-family', 'sans-serif')
			.attr('font-size', '7px')
			.attr('fill', '#bbb');

		svg
			.append('g')
			.attr('transform', `translate(0, ${height - padding})`)
			.call(xAxis);

		svg.append('g').call(yAxis);
	});
</script>

<svg width={outerWidth} height={outerHeight} />
