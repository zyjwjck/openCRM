<script lang="ts">
	import { showSettings, settings } from "$lib/stores";
	import toast from "svelte-french-toast";

	export let selectedModels = [""];
	export let disabled = false;

	const saveDefaultModel = () => {
		settings.set({ ...$settings, models: selectedModels });
		localStorage.setItem("settings", JSON.stringify($settings));
		toast.success("Default model updated");
	};

	// Get models from settings
	$: modelsConfig = $settings.modelsConfig || [];
	$: hasModels = modelsConfig.length > 0;
	$: modelOptions = modelsConfig.map(model => model.name);
</script>

{#if !hasModels}
	<div class="flex flex-col my-2 items-center justify-center p-6 border border-dashed rounded-lg">
		<div class="text-gray-500 dark:text-gray-400 text-center">
			<p class="mb-2">No models configured</p>
			<p class="text-xs mb-4">Please add and configure models in settings</p>
			<button
			class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-sm"
			on:click={() => {
				console.log('Open Settings button clicked in ModelSelector');
				console.log('Current showSettings value:', $showSettings);
				showSettings.set(true);
				console.log('showSettings set to true');
				setTimeout(() => {
					console.log('showSettings value after 100ms:', $showSettings);
				}, 100);
			}}
		>
			Open Settings
		</button>
		</div>
	</div>
{:else}
	<div>
		<select
			id="models"
			class="outline-none bg-transparent text-sm font-medium rounded-lg placeholder-gray-400"
			style="width: 150px"
			bind:value={selectedModels[0]}
		>
			<option class=" text-gray-700" value="" selected>Select a model</option>
			{#each modelOptions as modelName}
				<option value={modelName} class="text-gray-700 text-sm">{modelName}</option>
			{/each}
		</select>
	</div>
{/if}