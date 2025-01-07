<script lang="ts">
	import { fade } from "svelte/transition";
	import { page } from "$app/state";
	import { applyAction, enhance } from "$app/forms";
	import type { PageData } from "./$types";
	import { invalidateAll } from "$app/navigation";
	import { ArrowUturnLeft, PencilSquare, Trash } from "svelte-heros-v2";
	import Modal from "$lib/components/Modal.svelte";
	import { addToast } from "$lib/stores/toastStore.svelte";
	import * as m from "$lib/paraglide/messages.js";
	import {
		categoriesTranslations,
		dateToHumanReadable,
		errTranslations,
		numberToMonth,
	} from "$lib/utils";
	import type { ActionData } from "../../dashboard/$types";

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let processing = $state(false);
	let modalState = $state({
		edit: false,
		delete: false,
	});
	let currentExpense: {
		id?: number;
		name?: string;
		cost?: number;
		category?: "tax" | "grocery" | "tech" | "gift" | "other";
		note?: string;
		paidAt?: Date;
	} = $state({});
</script>

<svelte:head>
	<title>{page.params.year} {numberToMonth[Number(page.params.month)]()} | expenses tracker</title>
</svelte:head>
<Modal bind:open={modalState.edit}>
	<h2 class="text-lg font-semibold">{m.edit_expense()}</h2>
	<form
		action="/dashboard?/edit"
		method="POST"
		class="flex flex-col gap-2"
		use:enhance={() => {
			return async ({ result, update }) => {
				if (result.status === 200) {
					modalState.edit = false;
					update({ reset: true });
					addToast({ message: m.edit_expense_success(), type: "success" });
				}
				await invalidateAll();
				await applyAction(result);
			};
		}}
	>
		<input type="hidden" name="id" value={currentExpense?.id} />
		<input
			type="text"
			name="name"
			class="input input-bordered"
			class:input-error={form?.field === "name"}
			defaultValue={currentExpense?.name}
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
				defaultValue={currentExpense?.cost?.toFixed(2)}
				placeholder={m.cost()}
				disabled={processing}
				oninput={() => (form = null)}
			/>
			<input
				type="date"
				name="paid_at"
				class="input join-item input-bordered"
				class:input-error={form?.field === "paid_at"}
				defaultValue={dateToHumanReadable(currentExpense?.paidAt)}
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
				<option selected={currentExpense?.category === key} value={key}>{translation()}</option>
			{/each}
		</select>
		<textarea
			name="note"
			class="textarea textarea-bordered"
			placeholder={m.note()}
			defaultValue={currentExpense?.note}
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
			<button type="reset" class="btn btn-error join-item self-end">{m.reset()}</button>
			<button type="submit" class="btn btn-primary join-item self-end">{m.save()}</button>
		</div>
	</form>
</Modal>
<Modal bind:open={modalState.delete}>
	<h2 class="text-lg font-semibold">{m.delete_expense()}</h2>
	<form
		action="/dashboard?/delete"
		method="POST"
		class="flex flex-col gap-2"
		use:enhance={() => {
			return async ({ result, update }) => {
				if (result.status === 200) {
					modalState.delete = false;
					update({ reset: true });
					addToast({ message: m.delete_expense_success(), type: "success" });
				}
				await invalidateAll();
				await applyAction(result);
			};
		}}
	>
		<input type="hidden" name="id" value={currentExpense?.id} />
		<div>{m.delete_expense_confirmation()}</div>
		<button type="submit" class="btn btn-error join-item self-end">{m.confirm()}</button>
	</form>
</Modal>
<div class="flex flex-col gap-4">
	<div class="flex items-center gap-4">
		<a href="/{page.params.year}" class="btn btn-accent btn-sm">
			<ArrowUturnLeft class="h-4 w-4" />
		</a>
		<h2 class="text-2xl font-bold">
			{page.params.year}
			{numberToMonth[Number(page.params.month)]()}
		</h2>
	</div>
	<div class="w-full overflow-x-auto">
		<table class="table table-lg w-full bg-base-300">
			<thead>
				<tr>
					<th>{m.name()}</th>
					<th>{m.cost()}</th>
					<th>{m.category()}</th>
					<th>{m.paidAt()}</th>
					<th>{m.actions()}</th>
				</tr>
			</thead>
			<tbody>
				{#each data.expenses as entry}
					<tr class="hover">
						<td class="text-nowrap">{entry.name}</td>
						<td>{entry.cost?.toFixed(2)} $</td>
						<td>{categoriesTranslations[entry.category]()}</td>
						<td class="text-nowrap">{dateToHumanReadable(entry.paidAt)}</td>
						<td>
							<button
								class="btn btn-secondary btn-sm"
								onclick={() => {
									currentExpense = entry;
									modalState.edit = true;
								}}
							>
								<PencilSquare variation="solid" class="h-4 w-4" />
							</button>
							<button
								class="btn btn-error btn-sm"
								onclick={() => {
									currentExpense = entry;
									modalState.delete = true;
								}}
							>
								<Trash variation="solid" class="h-4 w-4" />
							</button>
						</td>
					</tr>
				{/each}
				<tr class="hover font-bold">
					<td>{m.total()}:</td>
					<td>{data.expenses.reduce((acc, v) => acc + v.cost, 0).toFixed(2)} $</td>
					<td></td>
					<td></td>
					<td></td>
				</tr>
			</tbody>
		</table>
	</div>
</div>
