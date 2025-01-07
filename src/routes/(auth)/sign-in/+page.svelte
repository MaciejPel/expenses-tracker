<script lang="ts">
	import { applyAction, enhance } from "$app/forms";
	import * as m from "$lib/paraglide/messages.js";
	import { fade } from "svelte/transition";
	import type { ActionData } from "./$types";
	import { Eye, EyeSlash } from "svelte-heros-v2";
	import { addToast } from "$lib/stores/toastStore.svelte";

	let { form }: { form: ActionData } = $props();
	let processing = $state(false);
	let passwordToggle = $state(false);

	const errTranslations: { [key: string]: { [key: string]: () => string } } = {
		// email: {
		// 	requirements: m.form_error_email_requirements,
		// 	taken: m.form_error_email_taken,
		// },
		// password: { requirements: m.form_error_password_requirements },
		// "repeat-password": { "no-match": m.form_error_repeat_password_no_match },
		// tos: { "no-accept": m.form_error_tos_no_accept },
	};
</script>

<svelte:head>
	<title>{m.signIn()} | expense tracker</title>
</svelte:head>
<div class="card w-96 bg-base-300" in:fade>
	<div class="card-body gap-4 p-6">
		<h2 class="card-title self-center text-2xl">{m.signIn()}</h2>
		<form
			class="flex flex-col gap-4"
			method="POST"
			use:enhance={() => {
				processing = true;
				return async ({ result }) => {
					processing = result.status === 302;
					addToast({ message: "Signed in", type: "success" });
					await applyAction(result);
				};
			}}
		>
			<!-- svelte-ignore a11y_autofocus -->
			<input
				type="text"
				id="email"
				name="email"
				class="input input-bordered"
				class:input-error={"email" === (form?.field || "")}
				placeholder={m.form_email()}
				disabled={processing}
				oninput={() => (form = null)}
				autofocus={true}
			/>
			<div class="relative w-full">
				<input
					type={passwordToggle ? "text" : "password"}
					id="password"
					name="password"
					class="input input-bordered w-full"
					class:input-error={"password" === (form?.field || "")}
					placeholder={m.form_password()}
					disabled={processing}
					oninput={() => (form = null)}
				/>
				<button
					onclick={() => (passwordToggle = !passwordToggle)}
					type="button"
					class="absolute right-4 top-1/2 z-[1] -translate-y-1/2 cursor-pointer"
				>
					{#if passwordToggle}
						<Eye class="h-5 w-5 text-base-content/50" />
					{:else}
						<EyeSlash class="h-5 w-5 text-base-content/50" />
					{/if}
				</button>
			</div>
			{#if form?.field && form?.reason}
				<div class="text-sm leading-none text-error" transition:fade>
					{errTranslations[form.field][form.reason]()}
				</div>
			{/if}
			<div class="flex flex-col gap-2">
				<button type="submit" class="btn btn-primary" disabled={processing}>
					{m.form_signIn()}
				</button>
				<a href="/sign-up" class="link-hover text-center text-sm">{m.signIn_no_account()}</a>
			</div>
		</form>
	</div>
</div>
