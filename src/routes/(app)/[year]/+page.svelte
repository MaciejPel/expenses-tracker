<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/state";
	import type { PageData } from "./$types";
	import { numberToMonth } from "$lib/utils";
	import { ArrowUturnLeft } from "svelte-heros-v2";
	import * as m from "$lib/paraglide/messages.js";

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{page.params.year} | expenses tracker</title>
</svelte:head>
<div class="flex flex-col gap-4">
	<div class="flex items-center gap-4">
		<a href="/dashboard" class="btn btn-accent btn-sm">
			<ArrowUturnLeft class="h-4 w-4" />
		</a>
		<h2 class="text-2xl font-bold">{page.params.year}</h2>
	</div>
	<div class="w-full overflow-x-auto">
		<table class="table table-lg w-full bg-base-300">
			<thead>
				<tr>
					<th>{m.month()}</th>
					<th>{m.cost()}</th>
				</tr>
			</thead>
			<tbody>
				{#each { length: 12 }, idx}
					<tr class="hover cursor-pointer" onclick={() => goto(`/${page.params.year}/${idx + 1}`)}>
						<td>{numberToMonth[idx + 1]()}</td>
						<td>{(data.monthly.find((v) => v.month === idx + 1)?.cost || 0).toFixed(2)} $</td>
					</tr>
				{/each}
				<tr class="hover font-bold">
					<td>{m.total()}:</td>
					<td>{data.monthly.reduce((acc, v) => acc + v.cost, 0).toFixed(2)} $</td>
				</tr>
			</tbody>
		</table>
	</div>
</div>
