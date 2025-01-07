<script lang="ts">
	import * as m from "$lib/paraglide/messages.js";
</script>

<svelte:head>
	<title>{m.home()} | expense tracker</title>
</svelte:head>

<main class="flex min-h-[calc(100svh-6rem)] items-center justify-center py-4">
	<div
		class="container flex flex-col items-center justify-center gap-4 text-balance px-4 text-center"
	>
		<div class="flex flex-col items-center justify-center gap-2">
			<h1 class="text-4xl font-bold">expense tracker</h1>
			<p class="text-xl">{m.home_simple_app()}</p>
		</div>
		<div class="flex flex-col items-center justify-center gap-2">
			<div class="text-lg font-light">
				{m.home_to_begin()}
			</div>
			<div class="flex gap-4">
				<a href="/sign-up" class="btn btn-primary">{m.signUp()}</a>
				<a href="/sign-in" class="btn btn-secondary">{m.signIn()}</a>
			</div>
		</div>
	</div>
</main>
