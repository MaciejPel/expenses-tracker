<script lang="ts">
	import { i18n } from "$lib/i18n";
	import { ParaglideJS } from "@inlang/paraglide-sveltekit";
	import Header from "$lib/components/Header.svelte";
	import "../app.css";
	import ToastContainer from "$lib/components/ToastContainer.svelte";

	let { children } = $props();
</script>

<ParaglideJS {i18n}>
	<Header />
	{@render children()}
	<ToastContainer />
</ParaglideJS>
