<script lang="ts">
	import Toast from "./Toast.svelte";
	import { dismissToast, toasts } from "$lib/stores/toastStore.svelte";
</script>

{#if toasts}
	<div
		class="toast toast-end toast-bottom bottom-20 left-0 z-10 w-full max-w-96 gap-0 p-0 px-4 md:bottom-8 md:left-8"
	>
		{#each toasts as toast (toast.id)}
			<Toast type={toast.type} onDismiss={() => dismissToast(toast.id)}>{toast.message}</Toast>
		{/each}
	</div>
{/if}
