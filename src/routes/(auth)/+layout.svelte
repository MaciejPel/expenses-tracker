<script lang="ts">
	let { children } = $props();
</script>

<main class="relative flex min-h-[calc(100svh-3rem)] items-center justify-center">
	<div class="container flex h-full items-center justify-center px-4">
		{@render children()}
	</div>
</main>
