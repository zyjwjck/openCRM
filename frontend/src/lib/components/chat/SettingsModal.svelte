<script lang="ts">
	import Modal from "../common/Modal.svelte";

	import { WEB_UI_VERSION } from "$lib/constants";
	import toast from "svelte-french-toast";
	import { onMount, onDestroy } from "svelte";
	import { info, models, settings } from "$lib/stores";
	import Advanced from "./Settings/Advanced.svelte";
	import { t, getCurrentLanguage } from "$lib/utils/i18n.js";

	let { show = false, onClose = () => {} } = $props();

	let language = getCurrentLanguage();

	// Language change listener
	const handleLanguageChange = (event) => {
		language = event.detail.language;
	};

	onMount(() => {
		// Add language change listener
		if (typeof window !== 'undefined') {
			window.addEventListener('languageChange', handleLanguageChange);
		}
	});

	onDestroy(() => {
		// Remove language change listener
		if (typeof window !== 'undefined') {
			window.removeEventListener('languageChange', handleLanguageChange);
		}
	});

	// Add console logs for debugging
	$effect(() => {
		console.log('SettingsModal show changed:', show);
	});

	const saveSettings = async (updated) => {
		console.log(updated);
		await settings.set({ ...$settings, ...updated });
		if (typeof window !== 'undefined') {
			localStorage.setItem("settings", JSON.stringify($settings));
		}
		toast.success(t('settingsSaved', language));
	};

	let selectedTab = $state("advanced");

	// Advanced
	let requestFormat = $state("");
	let options = $state({
		// Advanced
		seed: 0,
		temperature: "",
		repeat_penalty: "",
		repeat_last_n: "",
		mirostat: "",
		mirostat_eta: "",
		mirostat_tau: "",
		top_k: "",
		top_p: "",
		stop: "",
		tfs_z: "",
		num_ctx: ""
	});

	// Models configuration
	let modelsConfig = $state([
		{
			id: "1",
			name: "nanobot",
			url: "http://127.0.0.1:5679/v1",
			apiKey: "",
			isDefault: true
		}
	]);

	// UI state
	let expandedModelId = $state(null);
	let editingModel = $state(null);
	let showEditModal = $state(false);
	let showDeleteConfirm = $state(false);
	let modelToDelete = $state(null);

	const toggleRequestFormat = async () => {
		if (requestFormat === "") {
			requestFormat = "json";
		} else {
			requestFormat = "";
		}

		saveSettings({ requestFormat: requestFormat !== "" ? requestFormat : undefined });
	};

	const addModel = () => {
		modelsConfig.push({
			id: Date.now().toString(),
			name: "New Model",
			url: "",
			apiKey: "",
			isDefault: false
		});
	};

	const removeModel = (id) => {
		if (modelsConfig.length > 1) {
			modelToDelete = id;
			showDeleteConfirm = true;
		} else {
			toast.error(t('atLeastOneModel', language));
		}
	};

	const confirmDeleteModel = () => {
		if (modelToDelete) {
			modelsConfig = modelsConfig.filter(model => model.id !== modelToDelete);
			// If the deleted model was the default, set the first model as default
			if (modelsConfig.length > 0 && !modelsConfig.some(m => m.isDefault)) {
				modelsConfig[0].isDefault = true;
			}
			showDeleteConfirm = false;
			modelToDelete = null;
			toast.success(t('modelDeleted', language));
		}
	};

	const cancelDeleteModel = () => {
		showDeleteConfirm = false;
		modelToDelete = null;
	};

	const editModel = (model) => {
		editingModel = { ...model };
		showEditModal = true;
	};

	const saveEditedModel = () => {
		if (editingModel) {
			const index = modelsConfig.findIndex(m => m.id === editingModel.id);
			if (index !== -1) {
				modelsConfig[index] = { ...editingModel };
				// If this model is set as default, ensure others are not
				if (editingModel.isDefault) {
					modelsConfig.forEach((m, i) => {
						if (i !== index) {
							m.isDefault = false;
						}
					});
				}
				showEditModal = false;
				editingModel = null;
				toast.success(t('modelUpdated', language));
			}
		}
	};

	const cancelEditModel = () => {
		showEditModal = false;
		editingModel = null;
	};

	const toggleModelExpanded = (modelId) => {
		expandedModelId = expandedModelId === modelId ? null : modelId;
	};

	onMount(() => {
		if (typeof window !== 'undefined') {
			let settings = JSON.parse(localStorage.getItem("settings") ?? "{}");
			console.log(settings);

			requestFormat = settings.requestFormat ?? "";

			options.seed = settings.seed ?? 0;
			options.temperature = settings.temperature ?? "";
			options.repeat_penalty = settings.repeat_penalty ?? "";
			options.top_k = settings.top_k ?? "";
			options.top_p = settings.top_p ?? "";
			options.num_ctx = settings.num_ctx ?? "";
			options = { ...options, ...settings.options };

			// Load models configuration
			if (settings.modelsConfig && Array.isArray(settings.modelsConfig)) {
				modelsConfig = settings.modelsConfig.map((model, index) => ({
					...model,
					isDefault: model.isDefault ?? (index === 0)
				}));
			}
		}
	});
</script>

<Modal open={show} onClose={onClose} title={t('settings', language)}>
	<div style="z-index: 10000; position: relative;">
		<hr class=" dark:border-gray-800" />

		<div class="flex flex-col md:flex-row w-full p-4 md:space-x-4">
			<div
					class="tabs flex flex-row overflow-x-auto space-x-1 md:space-x-0 md:space-y-1 md:flex-col flex-1 md:flex-none md:w-40 text-xs text-left mb-3 md:mb-0"
				>
					<button
						class="px-2.5 py-2.5 min-w-fit rounded-lg flex-1 md:flex-none flex text-right transition {selectedTab ===
						'advanced'
							? 'bg-primary text-white'
							: ' hover:bg-secondary'}"
						on:click={() => {
							selectedTab = "advanced";
						}}
					>
						<div class=" self-center mr-2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="currentColor"
								class="w-4 h-4"
							>
								<path
									d="M17 2.75a.75.75 0 00-1.5 0v5.5a.75.75 0 001.5 0v-5.5zM17 15.75a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5zM3.75 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zM4.5 2.75a.75.75 0 00-1.5 0v5.5a.75.75 0 001.5 0v-5.5zM10 11a.75.75 0 01.75.75v5.5a.75.75 0 01-1.5 0v-5.5A.75.75 0 0110 11zM10.75 2.75a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5zM10 6a2 2 0 100 4 2 2 0 000-4zM3.75 10a2 2 0 100 4 2 2 0 000-4zM16.25 10a2 2 0 100 4 2 2 0 000-4z"
									/>
								</svg>
						</div>
						<div class=" self-center">{t('advanced', language)}</div>
					</button>

					<button
						class="px-2.5 py-2.5 min-w-fit rounded-lg flex-1 md:flex-none flex text-right transition {selectedTab ===
						'models'
							? 'bg-primary text-white'
							: ' hover:bg-secondary'}"
						on:click={() => {
							selectedTab = "models";
						}}
					>
						<div class=" self-center mr-2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="currentColor"
								class="w-4 h-4"
							>
								<path
									fill-rule="evenodd"
										d="M10 1c3.866 0 7 1.79 7 4s-3.134 4-7 4-7-1.79-7-4 3.134-4 7-4zm5.694 8.13c.464-.264.91-.583 1.306-.952V10c0 2.21-3.134 4-7 4s-7-1.79-7-4V8.178c.396.37.842.688 1.306.953C5.838 10.006 7.854 10.5 10 10.5s4.162-.494 5.694-1.37zM3 13.179V15c0 2.21 3.134 4 7 4s7-1.79 7-4v-1.822c-.396.37-.842.688-1.306.953-1.532.875-3.548 1.369-5.694 1.369s-4.162-.494-5.694-1.37A7.009 7.009 0 013 13.179z"
										clip-rule="evenodd"
										/>
									</svg>
						</div>
						<div class=" self-center">{t('models', language)}</div>
					</button>

					<button
						class="px-2.5 py-2.5 min-w-fit rounded-lg flex-1 md:flex-none flex text-right transition {selectedTab ===
						'chat'
							? 'bg-primary text-white'
							: ' hover:bg-secondary'}"
						on:click={() => {
							selectedTab = "chat";
						}}
					>
						<div class=" self-center mr-2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="currentColor"
								class="w-4 h-4"
							>
								<path
									d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"
									/>
								<path
									d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"
									/>
								</svg>
						</div>
						<div class=" self-center">{t('chatManagement', language)}</div>
					</button>
				</div>
			<div class="flex-1 md:min-h-[340px]">
				{#if selectedTab === "advanced"}
					<div class="flex flex-col h-full justify-between text-sm">
						<div class=" space-y-3 pr-1.5 overflow-y-scroll max-h-72">
							<div class=" text-sm font-medium">{t('parameters', language)}</div>

							<Advanced bind:options />
							<hr class=" dark:border-gray-700" />

							<div>
								<div class=" py-1 flex w-full justify-between">
									<div class=" self-center text-sm font-medium">{t('requestMode', language)}</div>

									<button
										class="p-1 px-3 text-xs flex rounded transition border dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
										on:click={() => {
											toggleRequestFormat();
										}}
									>
										{#if requestFormat === ""}
									<span class="ml-2 self-center"> {t('default', language)} </span>
								{:else if requestFormat === "json"}
									<span class="ml-2 self-center"> {t('json', language)} </span>
								{/if}
									</button>
								</div>
							</div>
						</div>

						<div class="flex justify-end pt-3 text-sm font-medium">
							<button
									class=" px-4 py-2 bg-primary hover:bg-primary/90 text-white transition rounded"
									on:click={() => {
										saveSettings({
											options: {
												seed: (options.seed !== 0 ? options.seed : undefined) ?? undefined,
												stop: options.stop !== "" ? options.stop : undefined,
												temperature: options.temperature !== "" ? options.temperature : undefined,
												repeat_penalty:
													options.repeat_penalty !== "" ? options.repeat_penalty : undefined,
												repeat_last_n:
													options.repeat_last_n !== "" ? options.repeat_last_n : undefined,
												mirostat: options.mirostat !== "" ? options.mirostat : undefined,
												mirostat_eta: options.mirostat_eta !== "" ? options.mirostat_eta : undefined,
												mirostat_tau: options.mirostat_tau !== "" ? options.mirostat_tau : undefined,
												top_k: options.top_k !== "" ? options.top_k : undefined,
												top_p: options.top_p !== "" ? options.top_p : undefined,
												tfs_z: options.tfs_z !== "" ? options.tfs_z : undefined,
												num_ctx: options.num_ctx !== "" ? options.num_ctx : undefined
											}
										});
										onClose();
									}}
								>
										{t('save', language)}
								</button>
						</div>
					</div>
				{:else if selectedTab === "models"}
					<div class="flex flex-col space-y-3 text-sm mb-10">
						<div>
							<div class=" mb-2.5 text-sm font-medium">{t('modelsConfiguration', language)}</div>
							<div class="text-xs text-gray-400 dark:text-gray-500 mb-4">
								{t('modelsDescription', language)}
						</div>

							{#each modelsConfig as model, index}
								<div class="border dark:border-gray-700 rounded-lg mb-3 overflow-hidden">
									<button
										class="w-full flex justify-between items-center p-3 text-left"
										on:click={() => toggleModelExpanded(model.id)}
									>
										<div class="font-medium">
											{model.name}
											{#if model.isDefault}
												<span class="ml-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-0.5 rounded">
																{t('default', language)}
														</span>
											{/if}
										</div>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 20 20"
											fill="currentColor"
											class={`w-4 h-4 transition-transform ${expandedModelId === model.id ? 'transform rotate-180' : ''}`}
										>
											<path
												d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.06 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
												/>
										</svg>
									</button>

									{#if expandedModelId === model.id}
										<div class="p-3 border-t dark:border-gray-700">
											<div class="flex justify-between items-center mb-3">
												<div class="text-sm text-gray-500 dark:text-gray-400">
													URL: {model.url}
													{#if model.apiKey}
														<span class="ml-2">• API Key: Set</span>
													{/if}
												</div>
												<div class="flex space-x-2">
													<button
															class="px-2 py-1 text-xs rounded border border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition"
															on:click={() => editModel(model)}
														>
															{t('edit', language)}
														</button>
														{#if modelsConfig.length > 1}
															<button
																	class="px-2 py-1 text-xs rounded border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition"
																	on:click={() => removeModel(model.id)}
																>
																	{t('deleteModel', language)}
																</button>
													{/if}
												</div>
											</div>
										</div>
									{/if}
								</div>
							{/each}

							<!-- Edit Model Modal -->
							{#if showEditModal && editingModel}
								<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
									<div class="bg-white dark:bg-gray-800 rounded-lg p-4 max-w-md w-full">
										<div class="flex justify-between items-center mb-4">
											<h3 class="font-medium">{t('editModel', language)}</h3>
											<button
												on:click={cancelEditModel}
												class="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 20 20"
													fill="currentColor"
													class="w-5 h-5"
												>
													<path
														d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
														/>
												</svg>
											</button>
										</div>
										<div class="space-y-4">
											<div>
												<label class="block text-xs font-medium mb-1">Model Name</label>
												<input
													class="w-full rounded py-2 px-4 text-sm dark:text-gray-300 dark:bg-gray-700 outline-none"
													placeholder="Enter model name"
													bind:value={editingModel.name}
												/>
											</div>
											<div>
												<label class="block text-xs font-medium mb-1">Server URL</label>
												<input
													class="w-full rounded py-2 px-4 text-sm dark:text-gray-300 dark:bg-gray-700 outline-none"
													placeholder="Enter server URL (e.g. http://localhost:11434/api)"
													bind:value={editingModel.url}
												/>
											</div>
											<div>
												<label class="block text-xs font-medium mb-1">API Key</label>
												<input
													class="w-full rounded py-2 px-4 text-sm dark:text-gray-300 dark:bg-gray-700 outline-none"
													placeholder="Enter API key (if required)"
													bind:value={editingModel.apiKey}
												/>
											</div>
											<div class="flex items-center">
												<input
													type="checkbox"
													id="defaultModel"
													bind:checked={editingModel.isDefault}
													class="mr-2"
												/>
												<label for="defaultModel" class="text-sm">{t('setAsDefault', language)}</label>
											</div>
										</div>
										<div class="flex justify-end space-x-2 mt-4">
											<button
												class="px-3 py-1 text-sm border dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
												on:click={cancelEditModel}
										>
												{t('cancel', language)}
										</button>
											<button
												class="px-3 py-1 text-sm bg-primary hover:bg-primary/90 text-white rounded"
												on:click={saveEditedModel}
											>
												{t('save', language)}
											</button>
										</div>
									</div>
								</div>
							{/if}

							<!-- Delete Confirmation Modal -->
							{#if showDeleteConfirm}
								<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
									<div class="bg-white dark:bg-gray-800 rounded-lg p-4 max-w-sm w-full">
										<div class="mb-4">
											<h3 class="font-medium mb-2">{t('confirmDelete', language)}</h3>
												<p class="text-sm text-gray-600 dark:text-gray-400">
														{t('confirmDeleteMessage', language)}
												</p>
										</div>
										<div class="flex justify-end space-x-2">
											<button
																class="px-3 py-1 text-sm border dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
																on:click={cancelDeleteModel}
														>
																{t('cancel', language)}
														</button>
														<button
																	class="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded transition"
																	on:click={confirmDeleteModel}
																>
																	{t('deleteModel', language)}
																</button>
										</div>
									</div>
								</div>
							{/if}

							<button
							class="w-full mt-3 px-3 py-2 bg-primary hover:bg-primary/90 text-white rounded transition flex items-center justify-center"
							on:click={addModel}
						>
							<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									class="w-4 h-4 mr-2"
								>
									<path
										d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"
										/>
									</svg>
							{t('addModel', language)}
						</button>
						</div>
					</div>

					<div class="flex justify-end pt-3 text-sm font-medium">
						<button
										class=" px-4 py-2 bg-primary hover:bg-primary/90 text-white transition rounded"
										on:click={() => {
											saveSettings({ modelsConfig });
											onClose();
										}}
									>
												{t('save', language)}
									</button>
					</div>
				{:else if selectedTab === "chat"}
						<div class="flex flex-col space-y-3 text-sm mb-10">
							<div>
								<div class="mb-2.5 text-sm font-medium">{t('chatManagement', language)}</div>
								<div class="text-xs text-gray-400 dark:text-gray-500 mb-4">
										{t('chatManagementDescription', language)}
								</div>

								<div class="space-y-3">
									<button
										class="w-full px-3 py-2 border dark:border-gray-600 rounded transition flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-800"
										on:click={() => {
											console.log('Import conversations clicked');
											// Import functionality
											const input = document.createElement('input');
											input.type = 'file';
											input.accept = '.json';
											input.onchange = async (e) => {
												const file = e.target.files[0];
												if (file) {
													const reader = new FileReader();
													reader.onload = async (event) => {
														try {
															const data = JSON.parse(event.target.result);
															// Import logic here
															toast.success(t('importSuccess', language));
														} catch (error) {
															toast.error(t('importFailed', language));
														}
													};
													reader.readAsText(file);
												}
											};
											input.click();
										}}
									>
										<div class="flex items-center">
											<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 20 20"
											fill="currentColor"
											class="w-4 h-4 mr-2"
										>
											<path
												d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 6H11V10.5a.5.5 0 001 0V6h1.5a3.5 3.5 0 10-4.243-3.163A3.5 3.5 0 105.5 13z"
												/>
										</svg>
										{t('importConversations', language)}
										</div>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 20 20"
											fill="currentColor"
											class="w-4 h-4"
										>
											<path
												d="M5 12a1 1 0 011-1h10a1 1 0 110 2H6a1 1 0 01-1-1z"
												/>
											<path
												d="M10 6a2 2 0 100 4 2 2 0 000-4z"
												/>
										</svg>
									</button>

									<button
										class="w-full px-3 py-2 border dark:border-gray-600 rounded transition flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-800"
										on:click={() => {
											console.log('Export conversations clicked');
											// Export functionality
											if (typeof window !== 'undefined') {
												const data = { conversations: [] };
												const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
												const url = URL.createObjectURL(blob);
												const a = document.createElement('a');
												a.href = url;
												a.download = `conversations-${new Date().toISOString().slice(0, 10)}.json`;
												document.body.appendChild(a);
												a.click();
												document.body.removeChild(a);
												URL.revokeObjectURL(url);
												toast.success(t('exportSuccess', language));
											}
										}}
									>
										<div class="flex items-center">
											<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 20 20"
											fill="currentColor"
											class="w-4 h-4 mr-2"
										>
											<path
												d="M5 12a1 1 0 011-1h10a1 1 0 110 2H6a1 1 0 01-1-1z"
												/>
											<path
												d="M10 6a2 2 0 100 4 2 2 0 000-4z"
												/>
										</svg>
										{t('exportConversations', language)}
										</div>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 20 20"
											fill="currentColor"
											class="w-4 h-4"
										>
											<path
												d="M5 12a1 1 0 011-1h10a1 1 0 110 2H6a1 1 0 01-1-1z"
												/>
											<path
												d="M10 6a2 2 0 100 4 2 2 0 000-4z"
												/>
										</svg>
									</button>

									<button
										class="w-full px-3 py-2 border border-red-300 dark:border-red-700 rounded transition flex items-center justify-between hover:bg-red-50 dark:hover:bg-red-900/30"
										on:click={() => {
											console.log('Clear conversations clicked');
											// Clear conversations functionality
											if (confirm(t('clearConfirm', language))) {
															// Clear logic here
															toast.success(t('clearSuccess', language));
													}
										}}
									>
										<div class="flex items-center">
											<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 20 20"
											fill="currentColor"
											class="w-4 h-4 mr-2"
										>
											<path
												d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
												/>
										</svg>
										{t('clearConversations', language)}
										</div>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 20 20"
											fill="currentColor"
											class="w-4 h-4"
										>
											<path
												d="M5 12a1 1 0 011-1h10a1 1 0 110 2H6a1 1 0 01-1-1z"
												/>
											<path
												d="M10 6a2 2 0 100 4 2 2 0 000-4z"
												/>
										</svg>
									</button>
								</div>
							</div>
						</div>
					{/if}
			</div>
		</div>
	</div>
</Modal>

<style>
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		/* display: none; <- Crashes Chrome on hover */
		-webkit-appearance: none;
		margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
	}

	.tabs::-webkit-scrollbar {
		display: none; /* for Chrome, Safari and Opera */
	}

	.tabs {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}

	input[type="number"] {
		-moz-appearance: textfield; /* Firefox */
	}
</style>