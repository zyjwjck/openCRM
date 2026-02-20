import { writable } from 'svelte/store';

interface Message {
	id: string;
	content: string;
	role: 'user' | 'assistant';
	timestamp: number;
}

interface Chat {
	id: string;
	title: string;
	messages: Message[];
	timestamp: number;
	model: string;
}

const defaultModel = 'gpt-3.5-turbo';

// Backend
export const info = writable({});

// Frontend
export const db = writable(undefined);
export const chatId = writable("");

const createChatStore = () => {
	// Initialize with data from localStorage if available
	let initialValue: Chat[] = [];
	if (typeof window !== 'undefined') {
		const saved = localStorage.getItem('chats');
		if (saved) {
			try {
				initialValue = JSON.parse(saved);
			} catch (e) {
				console.error('Failed to load chats from localStorage:', e);
			}
		}
	}

	const { subscribe, set, update } = writable<Chat[]>(initialValue);

	return {
		subscribe,
		addChat: (chat: Chat) => update((chats) => [chat, ...chats]),
		updateChat: (id: string, updates: Partial<Chat>) =>
			update((chats) =>
				chats.map((chat) => (chat.id === id ? { ...chat, ...updates } : chat))
			),
		deleteChat: (id: string) => update((chats) => chats.filter((chat) => chat.id !== id)),
		clearChats: () => set([]),
		loadFromLocalStorage: () => {
			if (typeof window !== 'undefined') {
				const saved = localStorage.getItem('chats');
				if (saved) {
					try {
						set(JSON.parse(saved));
					} catch (e) {
						console.error('Failed to load chats from localStorage:', e);
					}
				}
			}
		},
		saveToLocalStorage: (chats: Chat[]) => {
			if (typeof window !== 'undefined') {
				localStorage.setItem('chats', JSON.stringify(chats));
			}
		}
	};
};

const chats = createChatStore();

chats.subscribe((value) => {
	chats.saveToLocalStorage(value);
});

const models = writable([
	{ label: 'GPT-3.5 Turbo', value: 'gpt-3.5-turbo' },
	{ label: 'GPT-4', value: 'gpt-4' },
	{ label: 'GPT-4 Turbo', value: 'gpt-4-turbo' }
]);

const temperature = writable('0.7');
const top_p = writable('0.9');
const max_tokens = writable('1000');
const frequency_penalty = writable('0');
const presence_penalty = writable('0');
const system_prompt = writable('You are a helpful assistant for CRM.');

// Default settings with nanobot model
const settings = writable({
	modelsConfig: [
		{
			id: "1",
			name: "nanobot",
			url: "http://127.0.0.1:5679/v1",
			apiKey: "",
			isDefault: true
		}
	],
	temperature: 0.13,
	top_p: 0.9,
	max_tokens: 1000,
	frequency_penalty: 0,
	presence_penalty: 0,
	system_prompt: 'You are a helpful assistant for crm.',
	API_BASE_URL: "http://127.0.0.1:5679/v1"
});

export const showSettings = writable(false);
export const currentTitle = writable("");

export { chats, models, temperature, top_p, max_tokens, frequency_penalty, presence_penalty, system_prompt, settings };