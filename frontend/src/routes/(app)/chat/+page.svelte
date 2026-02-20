<script lang="ts">
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";
	import { chats } from "$lib/stores";

	// Redirect root path based on chat history
	onMount(async () => {
		// Load chats from localStorage
		if (typeof window !== 'undefined') {
			chats.loadFromLocalStorage();
			
			// Get chats from localStorage
			const saved = localStorage.getItem('chats');
			let allChats = [];
			if (saved) {
				try {
					allChats = JSON.parse(saved);
				} catch (e) {
					console.error('Failed to parse chats from localStorage:', e);
				}
			}
			
			if (allChats && allChats.length > 0) {
				// If there are chat histories, redirect to the last one
				const lastChat = allChats[0]; // Chats are ordered with latest first
				goto(`/chat/c/${lastChat.id}`);
			} else {
				// If no chat histories, redirect to new chat
				goto("/chat/new");
			}
		}
	});
</script>


<div class="min-h-screen w-full flex justify-center items-center">
	<p>Redirecting...</p>
</div>