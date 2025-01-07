<script lang="ts">
	let { children } = $props();
</script>

<main class="relative mb-16 flex min-h-[calc(100svh-3rem)] items-start justify-center py-4 md:mb-0">
	<div class="container px-4">
		{@render children()}
	</div>
</main>
