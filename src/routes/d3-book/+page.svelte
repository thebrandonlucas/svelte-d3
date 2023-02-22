<script lang="ts">
	import Bar from '../../charts/Bar.svelte';
	import CsvChart from '../../charts/CSVScatter.svelte';
	import DynamicScatter from '../../charts/DynamicScatter.svelte';
	import OrdinalBar from '../../charts/OrdinalBar.svelte';
	import Scatter from '../../charts/Scatter.svelte';
	import DynamicScaleBar from '../../charts/DynamicScaleBar.svelte';
	import DynamicScaleScatter from '../../charts/DynamicScaleScatter.svelte';
	import AddRemoveBar from '../../charts/AddRemoveBar.svelte';
	import MouseHoverBar from '../../charts/MouseHoverBar.svelte';
	import SortBars from '../../charts/SortBars.svelte';
	import TooltipBar from '../../charts/TooltipBar.svelte';
	import StackBar from '../../charts/StackBar.svelte';
	import StackedArea from '../../charts/StackedArea.svelte';
	import Area from '../../charts/Area.svelte';
	import ForceGraph from '../../charts/ForceGraph.svelte';
	import Pie from '../../charts/Pie.svelte';

	let selected: string;

	const types = [
		{
			type: 'bar',
			title: 'Bar',
			component: Bar
		},
		{
			type: 'scatter',
			title: 'Scatter',
			component: Scatter
		},
		{
			type: 'csv',
			title: 'CSV Scatter',
			component: CsvChart
		},
		{
			type: 'ordinal',
			title: 'Ordinal Bar',
			component: OrdinalBar
		},
		{
			type: 'dynamic-scatter',
			title: 'Dynamic Scatter',
			component: DynamicScatter
		},
		{
			type: 'dynamic-scale-bar',
			title: 'Dynamic Scale Bar',
			component: DynamicScaleBar
		},
		{
			type: 'dynamic-scale-scatter',
			title: 'Dynamic Scale Scatter',
			component: DynamicScaleScatter
		},
		{
			type: 'add-remove-bar',
			title: 'Add Remove Bar',
			component: AddRemoveBar
		},
		{
			type: 'mousehoverbar',
			title: 'Mouse Hover Bar',
			component: MouseHoverBar
		},
		{
			type: 'sortbars',
			title: 'Sort Bars',
			component: SortBars
		},
		{
			type: 'tooltipbar',
			title: 'Tooltip Bar',
			component: TooltipBar
		},
		{
			type: 'stackbar',
			title: 'Stack Bar',
			component: StackBar
		},
		{
			type: 'area',
			title: 'Area',
			component: Area
		},
		{
			type: 'stackedarea',
			title: 'Stacked Area',
			component: StackedArea
		},
		{
			type: 'forcegraph',
			title: 'Force Graph',
			component: ForceGraph
		},
		{
			type: 'pie',
			title: 'Pie',
			component: Pie
		}
	];
</script>

<div>
	{#each types as { type, title }}
		<button on:click={() => (selected = type)}>{title}</button>
	{/each}
</div>

{#each types as { type, component }}
	{#if selected === type}
		<svelte:component this={component} />
	{/if}
{/each}

<style>
	div {
		display: flex;
		margin: 10px;
	}
</style>
