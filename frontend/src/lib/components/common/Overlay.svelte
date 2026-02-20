<script>
	export let open = false;
	export let onClose = () => {};

	function handleClick() {
		onClose();
	}

	function handleEscape(e) {
		if (e.key === 'Escape') {
			onClose();
		}
	}
</script>

{#if open}
	<div
			class="fixed inset-0 bg-black/50 backdrop-blur-sm z-9999"
			on:click={handleClick}
			on:keydown={handleEscape}
			tabindex="-1"
			role="dialog"
			aria-modal="true"
		>
		</div>
{/if}