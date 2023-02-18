<script lang="ts">
	import Bar from '../charts/Bar.svelte';
	import CsvChart from '../charts/CSVScatter.svelte';
	import DynamicScatter from '../charts/DynamicScatter.svelte';
	import OrdinalBar from '../charts/OrdinalBar.svelte';
	import Scatter from '../charts/Scatter.svelte';
	import DynamicScaleBar from '../charts/DynamicScaleBar.svelte';
	import DynamicScaleScatter from '../charts/DynamicScaleScatter.svelte';

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
