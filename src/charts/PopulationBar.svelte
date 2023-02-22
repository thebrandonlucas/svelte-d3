<script lang="ts">
	import {
		axisBottom,
		axisLeft,
		max,
		scaleBand,
		scaleLinear,
		select,
		type Selection,
		type BaseType,
		descending,
		ascending,
		transition,
		randomInt
	} from 'd3';
	import { onMount } from 'svelte';

	export let data: { country: string; population: number }[];

	const margin = { top: 20, right: 20, bottom: 40, left: 150 };
	const width = 800,
		height = 250,
		innerWidth = width - margin.right - margin.left,
		innerHeight = height - margin.top - margin.bottom;

	let x = scaleLinear()
		.domain([0, max(data, (d) => d.population) || 0])
		.range([0, innerWidth]);
	let y = scaleBand<string>()
		.domain(data.map(({ country }) => country))
		.rangeRound([innerHeight, 0])
		.padding(0.05);

	// axes
	let xAxis = axisBottom(x);
	let yAxis = axisLeft(y);

	const opacity = scaleLinear<number>()
		.domain([0, max(data, ({ population }) => population) || 0])
		.range([0.1, 1]);

	let svg: Selection<SVGGElement, unknown, HTMLElement, any>;
	let rects: Selection<
		BaseType | SVGRectElement,
		{ country: string; population: number },
		SVGGElement,
		unknown
	>;

	onMount(() => {
		// margin convention - this is the actual chart area minus axes
		svg = select('svg').append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

		rects = svg
			.selectAll('rect')
			.data(data)
			.join('rect')
			.attr('x', 0)
			.attr('y', ({ country }) => y(country) || '')
			.attr('height', y.bandwidth());

		rects
			.transition()
			.delay((_, i) => i * 100)
			.duration(1000)
			.attr('width', ({ population }) => x(population))
			.attr('opacity', ({ population }) => opacity(population))
			.attr('fill', 'red');

		// axes
		svg
			.append('g')
			.attr('class', 'x axis')
			.attr('transform', `translate(0, ${innerHeight})`)
			.call(xAxis);
		svg.append('g').attr('class', 'y axis').call(yAxis);
	});

	function update() {
		data[0] = { ...data[0], population: randomInt(1_000_000)() };
		y.domain(data.map(({ country }) => country));
		x.domain([0, max(data, (d) => d.population) || 0]);
		rects
			.data(data)
			.join('rect')
			.transition()
			.delay((_, i) => i * 100)
			.duration(250)
			.attr('x', 0)
			.attr('y', ({ country }) => y(country) || '')
			.attr('height', y.bandwidth())
			.attr('width', ({ population }) => x(population))
			.attr('opacity', ({ population }) => opacity(population));
		select('.y.axis').call(yAxis);
	}

	function remove() {
		data.shift();
		y.domain(data.map(({ country }) => country));
		x.domain([0, max(data, (d) => d.population) || 0]);
		rects
			.data(data)
			.join((exit) => exit.attr('height', 0).remove())
			.transition()
			.delay((_, i) => i * 100)
			.duration(250)
			.attr('x', 0)
			.attr('y', ({ country }) => y(country) || '')
			.attr('height', y.bandwidth())
			.attr('width', ({ population }) => x(population))
			.attr('opacity', ({ population }) => opacity(population));
		select('.y.axis')
			.call(yAxis)
			.selectAll('.tick')
			.transition()
			.delay((_, i) => i * 100)
			.duration(250)
			.attr('transform', (country) => {
				return `translate(0, ${y(country as string) + y.bandwidth() / 2})`;
			});
	}
</script>

<svg {width} {height} />

<button on:click={update}>Update last item's population randomly</button>
<button on:click={remove}>Remove an element</button>
