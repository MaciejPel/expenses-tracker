<script lang="ts">
	import { enhance } from "$app/forms";
	import { page } from "$app/state";
	import * as m from "$lib/paraglide/messages";
	import {
		ArrowRightOnRectangle,
		ArrowRightStartOnRectangle,
		Cog6Tooth,
		PencilSquare,
	} from "svelte-heros-v2";
</script>

<header class="sticky top-0 z-10 flex w-full items-center justify-center bg-base-300 py-2 shadow">
	<div class="container flex w-full items-center justify-between px-4">
		<a href="/" class="link-hover flex items-center gap-2 font-mono text-2xl font-bold">et</a>
		<div class="flex">
			<a href="/settings" class="btn btn-ghost btn-sm font-medium">
				<Cog6Tooth variation="solid" class="h-5 w-5" />
				<span class="hidden sm:block">{m.settings()}</span>
			</a>
			{#if page.data.user}
				<form method="post" use:enhance action="/sign-out" class="flex p-0">
					<button class="btn btn-ghost btn-sm flex grow gap-2">
						<ArrowRightStartOnRectangle variation="solid" class="h-5 w-5" />
						{m.signOut()}
					</button>
				</form>
			{:else}
				<a href="/sign-in" class="btn btn-ghost btn-sm font-medium">
					<ArrowRightOnRectangle variation="solid" class="h-5 w-5" />
					{m.signIn()}
				</a>
				<a href="/sign-up" class="btn btn-ghost btn-sm font-medium">
					<PencilSquare variation="solid" class="h-5 w-5" />
					{m.signUp()}
				</a>
			{/if}
		</div>
	</div>
</header>
