<script lang="ts">
	import { enhance } from "$app/forms";
	import { page } from "$app/state";
	import { Home, User, ArrowRightStartOnRectangle } from "svelte-heros-v2";

	let url = $derived(page.url.pathname.replace(/^\/(en|pl)/, ""));
</script>

<nav class="btm-nav btm-nav-sm z-10 border-t md:hidden">
	<a href="/" class:text-primary={["", "/", "/dashboard"].includes(url)}>
		<Home class="h-5 w-5" />
	</a>
	{#if page.data.user}{:else}
		<a href="/sign-in" class:text-accent={url === "/signup"}>
			<User class="h-5 w-5" />
		</a>
	{/if}
	{#if page.data.user}
		<form method="post" use:enhance action="/sign-out">
			<button>
				<ArrowRightStartOnRectangle variation="solid" class="h-5 w-5" />
			</button>
		</form>
	{/if}
</nav>
