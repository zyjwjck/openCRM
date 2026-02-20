<script>
	export let open = false;
	export let onClose = () => {};
	export let title = '';

	function handleBackdropClick() {
		onClose();
	}

	function handleModalClick(e) {
		e.stopPropagation();
	}
</script>

{#if open}
	<div style="position: fixed; inset: 0; z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 20px;" on:click={handleBackdropClick}>
		<div style="position: fixed; inset: 0; background: rgba(0, 0, 0, 0.5);"></div>
		<div style="background: white; color: black; border-radius: 8px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15); max-width: 600px; width: 100%; max-height: 80vh; overflow-y: auto; position: relative; z-index: 1;">
			<div style="padding: 20px; border-bottom: 1px solid #eaeaea; display: flex; justify-content: space-between; align-items: center;">
				<h3 style="margin: 0; font-size: 18px; font-weight: 600;">{title}</h3>
				<button
					style="background: none; border: none; cursor: pointer; padding: 8px; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: black;"
					on:click={onClose}
					aria-label="Close"
				>
					<svg
						w="20"
						h="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<line x1="18" y1="6" x2="6" y2="18"></line>
						<line x1="6" y1="6" x2="18" y2="18"></line>
					</svg>
				</button>
			</div>
			<div style="padding: 20px;" on:click={handleModalClick}>
				<slot />
			</div>
		</div>
	</div>
{/if}