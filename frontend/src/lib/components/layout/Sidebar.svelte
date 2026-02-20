<script>
	import { chats } from '$lib/stores';
	import { goto } from '$app/navigation';

	function handleChatClick(id: string) {
		goto(`/chat/c/${id}`);
	}

	function handleNewChat() {
		goto('/chat/new');
	}
</script>

<div class="w-64 h-full bg-card border-r border-border flex flex-col">
	<div class="p-4 border-b border-border">
		<button
			class="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
			on:click={handleNewChat}
		>
			<svg
				w="16"
				h="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M12 5v14"></path>
				<path d="M5 12h14"></path>
			</svg>
			New Chat
		</button>
	</div>
	<div class="flex-1 overflow-y-auto">
		{#each $chats as chat}
			<button
				class="w-full text-left p-3 hover:bg-secondary transition-colors border-b border-border flex items-start gap-3"
				on:click={() => handleChatClick(chat.id)}
			>
				<div class="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
				<div class="flex-1 min-w-0">
					<p class="text-text font-medium truncate">
						{chat.title || 'Untitled Chat'}
					</p>
					<p class="text-text-secondary text-sm mt-1 truncate">
						{chat.messages[0]?.content?.slice(0, 50) || 'No messages yet'}
					</p>
				</div>
			</button>
		{/each}
		{#if $chats.length === 0}
			<div class="flex flex-col items-center justify-center h-full text-text-secondary">
				<svg
					w="48"
					h="48"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="opacity-50"
				>
					<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
				</svg>
				<p class="mt-4 text-center">No chats yet</p>
				<p class="text-sm mt-2 text-center max-w-xs">Start a new chat to begin</p>
			</div>
		{/if}
	</div>
	<div class="p-4 border-t border-border">
		<div class="text-text-secondary text-sm">
			<p>Chat UI</p>
			<p class="mt-1">v1.0.0</p>
		</div>
	</div>
</div>