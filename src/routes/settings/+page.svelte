<script lang="ts">
	import { page } from "$app/state";
	import { goto, invalidateAll } from "$app/navigation";
	import { i18n } from "$lib/i18n";
	import * as m from "$lib/paraglide/messages.js";
	import {
		availableLanguageTags,
		languageTag,
		type AvailableLanguageTag,
	} from "$lib/paraglide/runtime";
	import { themes } from "$lib/constants";
	import Modal from "$lib/components/Modal.svelte";
	import { applyAction, enhance } from "$app/forms";
	import { addToast } from "$lib/stores/toastStore.svelte";

	let currentTheme = $state("");
	let modalOpen = $state(false);

	const themesTranslations: { [key: string]: () => string } = {
		light: m.light,
		dark: m.dark,
	};

	$effect(() => {
		if (typeof window !== "undefined") {
			currentTheme = document.documentElement.dataset.theme || "";
			if (!currentTheme) {
				const theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
				setTheme(theme);
			}
		}
	});

	function switchToLanguage(newLanguage: AvailableLanguageTag) {
		const canonicalPath = i18n.route(page.url.pathname);
		const localisedPath = i18n.resolveRoute(canonicalPath, newLanguage);
		goto(localisedPath);
	}

	function setTheme(theme: string) {
		if (!themes.includes(theme)) return;
		document.cookie = `theme=${theme}; max-age=${60 * 60 * 24 * 365}; path=/; SameSite=Lax`;
		document.documentElement.setAttribute("data-theme", theme);
		currentTheme = theme;
	}
</script>

<svelte:head>
	<title>{m.settings()} | expense tracker</title>
</svelte:head>

{#if page.data.user}
	<Modal bind:open={modalOpen}>
		<h2 class="text-lg font-semibold">{m.settings_delete_account()}</h2>
		<form
			action="?/delete"
			method="POST"
			class="flex flex-col gap-4"
			use:enhance={() => {
				return async ({ result, update }) => {
					if (result.status === 200) {
						modalOpen = false;
						update({ reset: true });
						addToast({ message: "account deleted", type: "success" });
						goto("/login");
					}
					await invalidateAll();
					await applyAction(result);
				};
			}}
		>
			<input type="hidden" name="id" value={page.data.user.id} />
			<div>{m.settings_delete_confirmation()}</div>
			<button type="submit" class="btn btn-error join-item self-end">{m.confirm()}</button>
		</form>
	</Modal>
{/if}

<div class="flex min-h-[calc(100svh-6rem)] flex-col gap-2">
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-8">
		<div class="card bg-base-300">
			<div class="card-body p-6">
				<h2 class="card-title flex">{m.language()}</h2>
				<div class="flex gap-2">
					{#each availableLanguageTags as lang}
						<button
							onclick={() => switchToLanguage(lang as "pl" | "en")}
							class="btn btn-sm uppercase"
							class:btn-primary={languageTag() === lang}
							class:btn-outline={languageTag() !== lang}
						>
							{lang}
						</button>
					{/each}
				</div>
			</div>
		</div>
		<div class="card bg-base-300">
			<div class="card-body p-6">
				<h2 class="card-title flex">{m.theme()}</h2>
				<div class="flex gap-2">
					{#each themes as theme}
						<button
							onclick={() => setTheme(theme)}
							class="btn btn-sm capitalize"
							class:btn-primary={currentTheme === theme}
							class:btn-outline={currentTheme !== theme}
						>
							{themesTranslations[theme]()}
						</button>
					{/each}
				</div>
			</div>
		</div>
		{#if page.data.user}
			<div class="card bg-base-300">
				<div class="card-body p-6">
					<h2 class="card-title flex">{m.settings_delete_account()}</h2>
					<div>{m.settings_delete_description()}</div>
					<button class="btn btn-error self-end" onclick={() => (modalOpen = true)}>
						{m.deleteStr()}
					</button>
				</div>
			</div>
		{/if}
	</div>
</div>
