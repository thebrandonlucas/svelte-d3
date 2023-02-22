<script lang="ts">
	import PopulationBar from '../../charts/PopulationBar.svelte';
	import population2019 from '../../data/population-2019';

	let selected: string;

	const types = [
		{
			type: 'populationbar',
			title: 'Population Bar',
			component: PopulationBar,
			data: population2019
		}
	];
</script>

<div>
	{#each types as { type, title }}
		<button on:click={() => (selected = type)}>{title}</button>
	{/each}
</div>

{#each types as { type, component, data }}
	{#if selected === type}
		<svelte:component this={component} {data} />
	{/if}
{/each}

<style>
	div {
		display: flex;
		margin: 10px;
	}
</style>
