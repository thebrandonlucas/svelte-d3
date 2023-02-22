<script lang="ts">
	import * as d3 from 'd3';
	import {
		drag,
		forceCenter,
		forceLink,
		forceManyBody,
		forceSimulation,
		range,
		scaleBand,
		scaleLinear,
		scaleOrdinal,
		schemeCategory10,
		schemeSet3,
		select,
		selectAll
	} from 'd3';
	import { onMount } from 'svelte';

	const dataset = {
		nodes: [
			{ name: 'Adam' },
			{ name: 'Bob' },
			{ name: 'Carrie' },
			{ name: 'Donovan' },
			{ name: 'Edward' },
			{ name: 'Felicity' },
			{ name: 'George' },
			{ name: 'Hannah' },
			{ name: 'Iris' },
			{ name: 'Jerry' }
		],
		edges: [
			{ source: 0, target: 1 },
			{ source: 0, target: 2 },
			{ source: 0, target: 3 },
			{ source: 0, target: 4 },
			{ source: 1, target: 5 },
			{ source: 2, target: 5 },
			{ source: 2, target: 5 },
			{ source: 3, target: 4 },
			{ source: 5, target: 8 },
			{ source: 5, target: 9 },
			{ source: 6, target: 7 },
			{ source: 7, target: 8 },
			{ source: 8, target: 9 }
		]
	};

	const width = 500,
		height = 500;
	const force = forceSimulation(dataset.nodes)
		.force('charge', forceManyBody())
		.force('link', forceLink(dataset.edges))
		.force(
			'center',
			forceCenter()
				.x(width / 2)
				.y(height / 2)
		);
	const colors = scaleOrdinal(schemeCategory10);
	onMount(() => {
		const svg = select('svg');

		const edges = svg
			.selectAll('line')
			.data(dataset.edges)
			.join('line')
			.style('stroke', '#ccc')
			.style('stroke-width', 1);

		const nodes = svg
			.selectAll('circle')
			.data(dataset.nodes)
			.join('circle')
			.attr('r', 10)
			.style('fill', (_, i) => colors(String(i)))
			.call(drag().on('start', dragstarted).on('drag', dragged).on('end', dragended));

		nodes.append('title').text((d) => d.name);

		force.on('tick', () => {
			edges
				.attr('x1', (d) => d.source.x)
				.attr('y1', (d) => d.source.y)
				.attr('x2', (d) => d.target.x)
				.attr('y2', (d) => d.target.y);

			nodes.attr('cx', (d) => d.x).attr('cy', (d) => d.y);
		});
	});

	// function drag(simulation) {
	function dragstarted(event) {
		if (!event.active) force.alphaTarget(0.3).restart();
		event.subject.fx = event.subject.x;
		event.subject.fy = event.subject.y;
	}

	function dragged(event) {
		event.subject.fx = event.x;
		event.subject.fy = event.y;
	}

	function dragended(event) {
		if (!event.active) force.alphaTarget(0);
		event.subject.fx = null;
		event.subject.fy = null;
	}
</script>

<svg {width} {height} />
