<script lang="ts">
	import { page } from "$app/state";
	import * as m from "$lib/paraglide/messages.js";
	import { errTranslations } from "$lib/utils";
	import { ExclamationTriangle } from "svelte-heros-v2";
</script>

<main class="flex min-h-[calc(100svh-6rem)] items-center justify-center py-4">
	<div class="container flex flex-col items-center justify-center px-4">
		<ExclamationTriangle variation="solid" class="h-32 w-32 text-error" />
		<div class="flex flex-col gap-2 text-center">
			<h1 class="text-3xl">[{page.status}] {m.error()}</h1>
			<h2>
				{page.error?.message
					? errTranslations["other"][page.error.message]()
					: m.something_went_wrong()}
			</h2>
			<a href="/dashboard" class="btn btn-primary self-center">{m.dashboard()}</a>
		</div>
	</div>
</main>
