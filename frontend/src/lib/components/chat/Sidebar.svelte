<script lang="ts">
	import { v4 as uuidv4 } from "uuid";

import fileSaver from "file-saver";
const { saveAs } = fileSaver;

import { goto } from "$app/navigation";
import { chats, showSettings, chatId } from "$lib/stores";
import { onMount, onDestroy, createEventDispatcher } from "svelte";
import { t, getCurrentLanguage } from "$lib/utils/i18n.js";

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

	let show = true;
	let navElement;
	let importFileInputElement;
	let importFiles;

	let title: string = "Agent Web UI";
	let search = "";

	let chatDeleteId = null;

	let chatTitleEditId = null;
	let chatTitle = "";

	let showDeleteHistoryConfirm = false;

	// Export event to notify parent about sidebar visibility changes
	export let visible = false;
	const dispatch = createEventDispatcher();

	onMount(async () => {
		// Always show sidebar on mount regardless of window width
		show = true;
		visible = true;
		dispatch('visibilityChange', true);

		// Load chats from localStorage
		if (typeof window !== 'undefined') {
			chats.loadFromLocalStorage();
		}
	});

	// No need to watch for changes in chats store as it's already reactive
	// Chats are automatically saved to localStorage via the store subscription

	const loadChat = async (id) => {
		goto(`/chat/c/${id}`);
	};

	const editChatTitle = async (id, _title) => {
		chats.updateChat(id, {
			title: _title
		});
		title = _title;
	};

	const deleteChat = async (id) => {
		goto("/chat");
		chats.deleteChat(id);
	};

	const deleteChatHistory = async () => {
		chats.clearChats();
	};

	const importChats = async (chatHistory) => {
		// Add each chat to the store
		chatHistory.forEach(chat => {
			chats.addChat(chat);
		});
	};

	const exportChats = async () => {
		// Get chats from localStorage
		if (typeof window !== 'undefined') {
			const saved = localStorage.getItem('chats');
			if (saved) {
				let blob = new Blob([saved], {
					type: "application/json"
				});
				saveAs(blob, `chat-export-${Date.now()}.json`);
			}
		}
	};

	$: if (importFiles) {
		console.log(importFiles);

		let reader = new FileReader();
		reader.onload = (event) => {
			let chats = JSON.parse(event.target.result);
			console.log(chats);
			importChats(chats);
		};

		reader.readAsText(importFiles[0]);
	}
</script>

<div
	bind:this={navElement}
	class="h-screen {show
		? ''
			: '-translate-x-[260px]'}  w-[260px] relative top-0 left-0 z-30 transition-all duration-300 bg-sidebar text-sidebar-foreground text-sm
        "
>
	<div class="py-2.5 my-auto flex flex-col justify-between h-screen">
		<div class="px-2.5 flex justify-center space-x-2">
			<button
				class="flex-grow flex justify-between rounded-md px-3 py-1.5 mt-2 hover:bg-sidebar-accent transition"
				on:click={async () => {
					goto("/chat/new");

					await chatId.set(uuidv4());
					// createNewChat();
				}}
			>
				<div class="flex self-center">
					<div class="self-center mr-3.5">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
						<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
					</svg>
					</div>

					<div class=" self-center font-medium text-sm">{t('newChat', language)}</div>
				</div>
				</button>
		</div>

		<div class="px-2.5 mt-1 mb-2 flex justify-center space-x-2">
			<div class="flex w-full">
				<div class="self-center pl-3 py-2 rounded-l bg-sidebar-accent">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						class="w-4 h-4"
					>
						<path
							fill-rule="evenodd"
							d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
							clip-rule="evenodd"
						/>
					</svg>
				</div>

				<input
				class="w-full rounded-r py-1.5 pl-2.5 pr-4 text-sm text-sidebar-foreground bg-sidebar-accent outline-none"
				placeholder={t('search', language)}
				bind:value={search}
			/>
			</div>
		</div>

		<div class="pl-2.5 my-2 flex-1 flex flex-col space-y-1 overflow-y-auto">
			{#each $chats.filter((chat) => {
				if (search === "") {
					return true;
				} else {
					let title = chat.title.toLowerCase();

					if (title.includes(search)) {
						return true;
					} else {
						return false;
					}
				}
			}) as chat, i}
				<div class=" w-full pr-2 relative">
					<button
					class=" w-full flex justify-between rounded-md px-3 py-2 hover:bg-sidebar-accent {chat.id ===
					$chatId
						? 'bg-sidebar-accent'
						: ''} transition whitespace-nowrap text-ellipsis"
					on:click={() => {
						// goto(`/c/${chat.id}`);
						if (chat.id !== chatTitleEditId) {
							chatTitleEditId = null;
							chatTitle = "";
						}

						if (chat.id !== $chatId) {
							loadChat(chat.id);
						}
					}}
				>
						<div class=" flex self-center flex-1">
							<div class=" self-center mr-3">
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
											<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
										</svg>
							</div>
							<div
								class=" text-left self-center overflow-hidden {chat.id === $chatId
									? 'w-[120px]'
									: 'w-[180px]'} "
							>
								{#if chatTitleEditId === chat.id}
									<input bind:value={chatTitle} class=" bg-transparent w-full" />
								{:else}
									{chat.title}
								{/if}
							</div>
						</div>
					</button>

					{#if chat.id === $chatId}
						<div class=" absolute right-[22px] top-[10px]">
							{#if chatTitleEditId === chat.id}
								<div class="flex self-center space-x-1.5">
									<button
							class=" self-center hover:text-sidebar-foreground transition"
							on:click={() => {
								editChatTitle(chat.id, chatTitle);
								chatTitleEditId = null;
								chatTitle = "";
							}}
						>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 20 20"
											fill="currentColor"
											class="w-4 h-4"
										>
											<path
												fill-rule="evenodd"
													d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
												clip-rule="evenodd"
											/>
										</svg>
									</button>
									<button
							class=" self-center hover:text-sidebar-foreground transition"
							on:click={() => {
								chatTitleEditId = null;
								chatTitle = "";
							}}
						>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 20 20"
											fill="currentColor"
											class="w-4 h-4"
										>
											<path
												d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
											/>
										</svg>
									</button>
								</div>
							{:else if chatDeleteId === chat.id}
								<div class="flex items-end space-x-1.5">
									<button
							class=" items-end hover:text-sidebar-foreground transition text-sm px-2 py-1 rounded text-red-400"
							on:click={() => {
								deleteChat(chat.id);
							}}
						>
										{t('delete', language)}
									</button>
									<button
							class=" items-end hover:text-sidebar-foreground transition text-sm px-2 py-1 rounded"
							on:click={() => {
								chatDeleteId = null;
							}}
						>
										{t('cancel', language)}
									</button>
								</div>
							{:else}
								<div class="flex self-center space-x-1.5">
									<button
							class=" self-center hover:text-sidebar-foreground transition"
							on:click={() => {
								chatTitle = chat.title;
								chatTitleEditId = chat.id;
								// editChatTitle(chat.id, 'a');
							}}
						>
										<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												stroke-width="1.5"
												stroke="currentColor"
												class="w-4 h-4"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
											</svg>
									</button>
									<button
							class=" self-center hover:text-sidebar-foreground transition"
							on:click={() => {
								chatDeleteId = chat.id;
							}}
						>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke-width="1.5"
											stroke="currentColor"
											class="w-4 h-4"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
													d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
												/>
											</svg>
									</button>
								</div>
							{/if}
						</div>
					{/if}
				</div>
			{/each}
		</div>

		<div class="px-2.5">
				<div class="flex flex-col">
					<button
						class=" flex rounded-md py-3 px-3.5 w-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
						on:click={() => {
												showSettings.set(true);
										}}
					>
						<div class=" self-center mr-3">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="w-5 h-5"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
										d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.774-.773a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z"
									/>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
										d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
									/>
								</svg>
						</div>
						<div class=" self-center font-medium">{t('settings', language)}</div>
					</button>
				</div>
			</div>
	</div>

	<div
		class="relative left-0 top-[50dvh] z-30 -translate-y-1/2 transition-transform translate-x-[255px] md:translate-x-[260px] rotate-0"
	>
		<button
			class=" group"
			on:click={() => {
				show = !show;
				visible = show;
				dispatch('visibilityChange', show);
			}}
			aria-label={show ? t('collapseSidebar', language) : t('expandSidebar', language)}
			><span class="" data-state="closed"
				><div
					class="flex h-[72px] w-8 items-center justify-center opacity-20 group-hover:opacity-100 transition"
				>
					<div class="flex h-6 w-6 flex-col items-center">
						<div
							class="h-3 w-1 rounded-full bg-sidebar-foreground rotate-0 translate-y-[0.15rem] {show
											? 'group-hover:rotate-[15deg]'
											: 'group-hover:rotate-[-15deg]'}"
						/>
						<div
							class="h-3 w-1 rounded-full bg-sidebar-foreground rotate-0 translate-y-[-0.15rem] {show
											? 'group-hover:rotate-[-15deg]'
											: 'group-hover:rotate-[15deg]'}"
						/>
					</div>
				</div>
			</span>
		</button>
	</div>
</div>