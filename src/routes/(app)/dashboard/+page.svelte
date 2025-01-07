<script lang="ts">
	import { fade } from "svelte/transition";
	import type { PageData } from "./$types";
	import * as m from "$lib/paraglide/messages.js";

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{m.dashboard()} | expenses tracker</title>
</svelte:head>
{#if !data.yearly.length}
	<div class="flex h-[calc(100svh-6rem)] flex-col items-center justify-center">
		{m.dashboard_no_expenses()}
	</div>
{:else}
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
		{#each data.yearly as entry}
			<a
				href="/{entry.year}"
				class="flex flex-col gap-4 rounded-box bg-base-300 p-4 transition-colors hover:bg-base-200"
				in:fade
			>
				<div>{entry.total.toFixed(2)} $</div>
				<div class="self-end text-2xl font-bold">{entry.year}</div>
			</a>
		{/each}
	</div>
{/if}
