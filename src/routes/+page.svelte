<script lang="ts">
	import Bar from '../charts/Bar.svelte';
	import CsvChart from '../charts/CSVChart.svelte';
	import Scatter from '../charts/Scatter.svelte';

	let selected: 'bar' | 'scatter' | 'csv' = 'bar';
</script>

<div>
	<button on:click={() => (selected = 'bar')}>Bar</button>
	<button on:click={() => (selected = 'scatter')}>Scatter</button>
	<button on:click={() => (selected = 'csv')}>CSV</button>
</div>

{#if selected === 'bar'}
	<Bar />
{:else if selected === 'scatter'}
	<Scatter />
{:else if selected === 'csv'}
	<CsvChart />
{/if}

<style>
	div {
		display: flex;
		margin: 10px;
	}
</style>
