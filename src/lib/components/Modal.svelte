<script lang="ts">
	import type { Snippet } from "svelte";

	let { children, open = $bindable() }: { children: Snippet; open: boolean } = $props();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<dialog
	class="modal z-20 cursor-pointer"
	class:modal-open={open}
	onclose={() => (open = false)}
	onclick={(e) => {
		if (e.currentTarget === e.target) open = false;
	}}
>
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="modal-box flex cursor-auto flex-col gap-4" onclick={(e) => e.stopPropagation()}>
		<button
			type="button"
			class="btn btn-circle btn-ghost btn-sm absolute right-2 top-2"
			onclick={() => (open = false)}
		>
			✕
		</button>
		{@render children()}
	</div>
</dialog>
