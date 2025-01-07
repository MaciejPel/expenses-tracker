<script lang="ts">
	import type { Snippet } from "svelte";
	import { applyAction, enhance } from "$app/forms";
	import { invalidateAll } from "$app/navigation";
	import Modal from "$lib/components/Modal.svelte";
	import { categoriesTranslations, dateToHumanReadable, errTranslations } from "$lib/utils";
	import * as m from "$lib/paraglide/messages.js";
	import { Plus } from "svelte-heros-v2";
	import { fade } from "svelte/transition";
	import type { ActionData } from "./dashboard/$types";
	import { addToast } from "$lib/stores/toastStore.svelte";

	let { children, form }: { children: Snippet; form: ActionData } = $props();
	let modalOpen = $state(false);
	let processing = $state(false);
</script>

<Modal bind:open={modalOpen}>
	<h2 class="text-lg font-semibold">{m.add_expense()}</h2>
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
					addToast({ message: m.add_expense_success(), type: "success" });
				}
				await invalidateAll();
				await applyAction(result);
			};
		}}
	>
		<input
			type="text"
			name="name"
			class="input input-bordered"
			class:input-error={form?.field === "name"}
			placeholder={m.name()}
			disabled={processing}
			oninput={() => (form = null)}
			maxlength="64"
		/>
		<div class="join w-full">
			<input
				type="number"
				name="cost"
				class="input join-item input-bordered w-full grow"
				class:input-error={form?.field === "cost"}
				step="0.01"
				defaultValue="1.00"
				placeholder={m.cost()}
				disabled={processing}
				oninput={() => (form = null)}
			/>
			<input
				type="date"
				name="paid_at"
				class="input join-item input-bordered"
				class:input-error={form?.field === "paid_at"}
				defaultValue={dateToHumanReadable()}
				disabled={processing}
				oninput={() => (form = null)}
			/>
		</div>
		<select
			name="category"
			class="select select-bordered"
			class:select-error={form?.field === "category"}
			disabled={processing}
			oninput={() => (form = null)}
		>
			{#each Object.entries(categoriesTranslations) as [key, translation]}
				<option value={key}>{translation()}</option>
			{/each}
		</select>
		<textarea
			name="note"
			class="textarea textarea-bordered"
			class:textarea-error={form?.field === "note"}
			placeholder={m.note()}
			disabled={processing}
			maxlength="256"
			oninput={() => (form = null)}
		></textarea>
		{#if form?.field && form?.reason}
			<div class="text-sm leading-none text-error" transition:fade>
				{errTranslations[form.field][form.reason]()}
			</div>
		{/if}
		<div class="join mt-2 flex justify-end">
			<button
				type="reset"
				class="btn btn-error join-item self-end"
				disabled={processing}
				onclick={() => (form = null)}
			>
				{m.reset()}
			</button>
			<button type="submit" class="btn btn-primary join-item self-end" disabled={processing}>
				{m.save()}
			</button>
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
