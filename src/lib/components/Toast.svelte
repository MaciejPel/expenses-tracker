<script lang="ts">
	import {
		InformationCircle,
		ExclamationCircle,
		ExclamationTriangle,
		CheckCircle,
		XMark,
	} from "svelte-heros-v2";
	import { type ToastType } from "$lib/stores/toastStore.svelte";
	import type { Snippet } from "svelte";
	import { slide } from "svelte/transition";

	type Props = {
		children: Snippet;
		onDismiss: () => void;
		type: ToastType;
	};

	let { children, onDismiss, type }: Props = $props();
	// alert-info alert-success alert-warning alert-error
</script>

<div class="alert alert-{type} my-1 flex w-full max-w-96 animate-none text-left" transition:slide>
	{#if type === "info"}
		<InformationCircle variation="solid" class="h-6 w-6" />
	{:else if type === "error"}
		<ExclamationCircle variation="solid" class="h-6 w-6" />
	{:else if type === "warning"}
		<ExclamationTriangle variation="solid" class="h-6 w-6" />
	{:else if type === "success"}
		<CheckCircle variation="solid" class="h-6 w-6" />
	{/if}
	<span class="w-fit grow text-wrap"> {@render children()} </span>
	<button onclick={onDismiss}>
		<XMark variation="solid" class="h-6 w-6" />
	</button>
</div>
