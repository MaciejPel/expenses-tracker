<script lang="ts">
	import { applyAction, enhance } from "$app/forms";
	import { invalidateAll } from "$app/navigation";
	import Modal from "$lib/components/Modal.svelte";
	import { categoriesTranslations, dateToHumanReadable } from "$lib/utils";
	import * as m from "$lib/paraglide/messages.js";
	import { Plus } from "svelte-heros-v2";

	let { children } = $props();
	let modalOpen = $state(false);
	let processing = $state(false);
</script>

<Modal bind:open={modalOpen}>
	<h2 class="text-lg font-semibold">{m.add_new_expense()}</h2>
	<form
		action="/dashboard?/add"
		method="POST"
		class="flex flex-col gap-2"
		use:enhance={() => {
			processing = true;
			return async ({ result, update }) => {
				processing = false;
				if (result.status === 200) {
					modalOpen = false;
					update({ reset: true });
				}
				await invalidateAll();
				await applyAction(result);
			};
		}}
	>
		<input type="text" name="name" class="input input-bordered" placeholder={m.name()} />
		<div class="join w-full">
			<input
				type="number"
				name="cost"
				class="input join-item input-bordered w-full grow"
				step="0.01"
				defaultValue="1.00"
				placeholder={m.cost()}
			/>
			<input
				type="date"
				name="paid_at"
				class="input join-item input-bordered"
				defaultValue={dateToHumanReadable()}
			/>
		</div>
		<select name="category" class="select select-bordered">
			{#each Object.entries(categoriesTranslations) as [key, translation]}
				<option value={key}>{translation()}</option>
			{/each}
		</select>
		<textarea name="note" class="textarea textarea-bordered" placeholder={m.note()}></textarea>
		<div class="join mt-2 flex justify-end">
			<button type="reset" class="btn btn-error join-item self-end">{m.reset()}</button>
			<button type="submit" class="btn btn-primary join-item self-end"> {m.save()} </button>
		</div>
	</form>
</Modal>
<main class="relative mb-16 flex min-h-[calc(100svh-3rem)] items-start justify-center py-4 md:mb-0">
	<div class="container px-4">
		{@render children()}
	</div>
	<button
		type="button"
		class="btn btn-primary fixed bottom-4 right-4 md:bottom-8 md:right-8"
		onclick={() => (modalOpen = true)}
	>
		<Plus class="h-6 w-6" />
	</button>
</main>
