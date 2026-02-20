<script lang="ts">
	import { v4 as uuidv4 } from 'uuid';
	import toast from 'svelte-french-toast';


	import { tick } from 'svelte';

	const splitStream = (splitOn) => {
		let buffer = "";
		return new TransformStream({
			transform(chunk, controller) {
				buffer += chunk;
				const parts = buffer.split(splitOn);
				parts.slice(0, -1).forEach((part) => controller.enqueue(part));
				buffer = parts[parts.length - 1];
			},
			flush(controller) {
				if (buffer) controller.enqueue(buffer);
			}
		});
	};

	const convertMessagesToHistory = (messages) => {
		let history = {
			messages: {},
			currentId: null
		};

		let parentMessageId = null;
		let messageId = null;

		for (const message of messages) {
			messageId = uuidv4();

			if (parentMessageId !== null) {
				history.messages[parentMessageId].childrenIds = [
					...history.messages[parentMessageId].childrenIds,
					messageId
				];
			}

			history.messages[messageId] = {
				...message,
				id: messageId,
				parentId: parentMessageId,
				childrenIds: []
			};

			parentMessageId = messageId;
		}

		history.currentId = messageId;
		return history;
	};
	import { goto } from '$app/navigation';
	import { models, settings, chats, chatId, currentTitle } from '$lib/stores';

	import MessageInput from '$lib/components/chat/MessageInput.svelte';
	import Messages from '$lib/components/chat/Messages.svelte';
	import ModelSelector from '$lib/components/chat/ModelSelector.svelte';
	import Sidebar from '$lib/components/chat/Sidebar.svelte';
	import { page } from '$app/stores';

	let loaded = false;
	let stopResponseFlag = false;
	let autoScroll = true;

	// let chatId = $page.params.id;
	let selectedModels = [''];

	let title = '';
	let prompt = '';

	let messages = [];
	let history = {
		messages: {},
		currentId: null
	};

	$: if (history.currentId !== null) {
		let _messages = [];

		let currentMessage = history.messages[history.currentId];
		while (currentMessage !== null) {
			_messages.unshift({ ...currentMessage });
			currentMessage =
				currentMessage.parentId !== null ? history.messages[currentMessage.parentId] : null;
		}
		messages = _messages;
	} else {
		messages = [];
	}

	$: if ($page.params.id) {
		(async () => {
			let chat = await loadChat();

			await tick();
			if (chat) {
				loaded = true;
			} else {
				await goto('/chat');
			}
		})();
	}

	//////////////////////////
	// Web functions
	//////////////////////////

	const loadChat = async () => {
		await chatId.set($page.params.id);
		
		// Load chat from local storage
		let chat = null;
		if (typeof window !== 'undefined') {
			chats.loadFromLocalStorage();
			const saved = localStorage.getItem('chats');
			if (saved) {
				try {
					const chatsList = JSON.parse(saved);
					chat = chatsList.find((c: any) => c.id === $chatId);
				} catch (e) {
					console.error('Failed to parse chats from localStorage:', e);
				}
			}
		}

		if (chat) {
			console.log('Loaded chat:', chat);

			// Load models
			selectedModels = [chat.model ?? ''];
			console.log('Loaded models:', selectedModels);

			// Load history - use existing history if available, otherwise convert from messages
			if (chat.history) {
				history = chat.history;
				console.log('Loaded existing history:', history);
			} else {
				history = convertMessagesToHistory(chat.messages);
				console.log('Created history from messages:', history);
			}

			// Load title
			title = chat.title;
			currentTitle.set(title);
			console.log('Loaded title:', title);

			// Load settings
			let _settings = {};
			if (typeof window !== 'undefined') {
				_settings = JSON.parse(localStorage.getItem('settings') ?? '{}');
			}
			await settings.set({
				..._settings
			});
			autoScroll = true;

			await tick();
			if (messages.length > 0) {
				history.messages[messages.at(-1).id].done = true;
			}
			await tick();

			console.log('Loaded messages:', messages);
			return chat;
		} else {
			console.log('Chat not found');
			return null;
		}
	};

	const copyToClipboard = (text) => {
		if (!navigator.clipboard) {
			var textArea = document.createElement('textarea');
			textArea.value = text;

			// Avoid scrolling to bottom
			textArea.style.top = '0';
			textArea.style.left = '0';
			textArea.style.position = 'fixed';

			document.body.appendChild(textArea);
			textArea.focus();
			textArea.select();

			try {
				var successful = document.execCommand('copy');
				var msg = successful ? 'successful' : 'unsuccessful';
				console.log('Fallback: Copying text command was ' + msg);
			} catch (err) {
				console.error('Fallback: Oops, unable to copy', err);
			}

			document.body.removeChild(textArea);
			return;
		}
		navigator.clipboard.writeText(text).then(
			function () {
				console.log('Async: Copying to clipboard was successful!');
			},
			function (err) {
				console.error('Async: Could not copy text: ', err);
			}
		);
	};

	//////////////////////////
	// Ollama functions
	//////////////////////////

	const sendPrompt = async (userPrompt, parentId, _chatId) => {
		await Promise.all(
			selectedModels.map(async (model) => {
				console.log(model);
				await sendPromptToAI(model, userPrompt, parentId, _chatId);
			})
		);

		// Chats are automatically saved to localStorage via the store subscription
	};

	const sendPromptToAI = async (model, userPrompt, parentId, _chatId) => {
		console.log('sendPromptToAI');
		let responseMessageId = uuidv4();
		let responseMessage = {
				parentId: parentId,
				id: responseMessageId,
				childrenIds: [],
				role: 'assistant',
				content: '',
				model: model,
				feedback: {}
			};

		history.messages[responseMessageId] = responseMessage;
		history.currentId = responseMessageId;
		if (parentId !== null) {
			history.messages[parentId].childrenIds = [
				...history.messages[parentId].childrenIds,
				responseMessageId
			];
		}

		await tick();
		window.scrollTo({ top: document.body.scrollHeight });

		// Get model configuration from settings
		const modelConfig = $settings.modelsConfig?.find(m => m.name === model);
		const modelUrl = modelConfig?.url || $settings?.API_BASE_URL;
		const apiKey = modelConfig?.apiKey;

		console.log('Model:', model);
		console.log('Model config:', modelConfig);
		console.log('Model URL:', modelUrl);

		const headers = {
			'Content-Type': 'application/json'
		};

		if (apiKey) {
			headers['Authorization'] = `Bearer ${apiKey}`;
		}

		const res = await fetch(`${modelUrl}/chat/completions`, {
			method: 'POST',
			headers: headers,
			body: JSON.stringify({
				model: model,
				messages: messages.map((message) => ({
					role: message.role,
					content: message.content
				})),
				temperature: $settings.temperature ?? 0.7,
				top_p: $settings.top_p ?? 1,
				max_tokens: 1000
			})
		}).catch((err) => {
			console.log('Fetch error:', err);
			return null;
		});

		if (res && res.ok) {
			try {
				const data = await res.json();
				console.log('Response data:', data);

				if (data.choices && data.choices.length > 0) {
					responseMessage.content = data.choices[0].message.content;
					responseMessage.done = true;
					responseMessage.info = {
						total_tokens: data.usage?.total_tokens,
						prompt_tokens: data.usage?.prompt_tokens,
						completion_tokens: data.usage?.completion_tokens
					};
					messages = messages;

					if ($settings.responseAutoCopy) {
						copyToClipboard(responseMessage.content);
					}
				} else {
					throw new Error('No response from model');
				}
			} catch (error) {
				console.log('Processing error:', error);
				toast.error(`Error processing response: ${error.message}`);
				responseMessage.content = `Error processing response: ${error.message}`;
				responseMessage.error = true;
			}
		} else {
			if (res !== null) {
				try {
					const error = await res.json();
					console.log('API error:', error);
					const errorMessage = error.error || error.detail || `API error: ${res.status}`;
					toast.error(errorMessage);
					responseMessage.content = errorMessage;
				} catch (e) {
					const errorMessage = `Connection error: ${res.statusText}`;
					toast.error(errorMessage);
					responseMessage.content = errorMessage;
				}
			} else {
				const errorMessage = `Uh-oh! There was an issue connecting to the model server.`;
				toast.error(errorMessage);
				responseMessage.content = errorMessage;
			}

			responseMessage.error = true;
		}

		responseMessage.done = true;
		// Update history reference to trigger reactive update
		history = { ...history };

		// Update chat in local storage
		chats.updateChat(_chatId, {
			title: title === '' ? 'New Chat' : title,
			messages: messages.map(msg => ({
				id: msg.id,
				content: msg.content,
				role: msg.role,
				timestamp: Date.now()
			})),
			timestamp: Date.now(),
			model: selectedModels[0] || 'gpt-3.5-turbo'
		});

		stopResponseFlag = false;
		await tick();
		if (autoScroll) {
			window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
		}

		if (messages.length == 2 && messages.at(1).content !== '') {
			window.history.replaceState(history.state, '', `/chat/c/${_chatId}`);
			// Skip generateChatTitle to avoid Ollama API call
			// await generateChatTitle(_chatId, userPrompt);
			// Set a simple title instead
			await setChatTitle(_chatId, userPrompt.substring(0, 30) + (userPrompt.length > 30 ? '...' : ''));
		}
	};

	const submitPrompt = async (userPrompt) => {
		const _chatId = JSON.parse(JSON.stringify($chatId));
		console.log('submitPrompt', _chatId);

		if (selectedModels.includes('')) {
			toast.error('Model not selected');
		} else if (messages.length != 0 && messages.at(-1).done != true) {
			console.log('wait');
		} else {
			document.getElementById('chat-textarea').style.height = '';

			let userMessageId = uuidv4();
			let userMessage = {
				id: userMessageId,
				parentId: messages.length !== 0 ? messages.at(-1).id : null,
				childrenIds: [],
				role: 'user',
				content: userPrompt,
			};

			// Add user message to messages array
			messages = [...messages, userMessage];

			// First set the user message in history
			history.messages[userMessageId] = userMessage;
			history.currentId = userMessageId;

			// Then update childrenIds if there are previous messages
			if (messages.length > 1) {
				const previousMessageId = messages.at(-2).id;
				if (history.messages[previousMessageId]) {
					history.messages[previousMessageId].childrenIds.push(userMessageId);
				}
			}

			await tick();
			if (messages.length == 1) {
				// Create new chat in local storage
				chats.addChat({
					id: _chatId,
					title: 'New Chat',
					messages: messages.map(msg => ({
						id: msg.id,
						content: msg.content,
						role: msg.role,
						timestamp: Date.now()
					})),
					timestamp: Date.now(),
					model: selectedModels[0] || 'gpt-3.5-turbo'
				});
			}

			prompt = '';

			setTimeout(() => {
				window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
			}, 50);

			await sendPrompt(userPrompt, userMessageId, _chatId);
		}
	};

	const stopResponse = () => {
		stopResponseFlag = true;
		console.log('stopResponse');
	};

	const regenerateResponse = async () => {
		const _chatId = JSON.parse(JSON.stringify($chatId));
		console.log('regenerateResponse', _chatId);

		if (messages.length != 0 && messages.at(-1).done == true) {
			messages.splice(messages.length - 1, 1);
			messages = messages;

			let userMessage = messages.at(-1);
			let userPrompt = userMessage.content;

			await sendPrompt(userPrompt, userMessage.id, _chatId);
		}
	};

	const generateChatTitle = async (_chatId, userPrompt) => {
		if ($settings.titleAutoGenerate ?? true) {
			console.log('generateChatTitle');

			// 由于使用云上大模型，不再使用Ollama的generate接口
			// 这里应该使用OpenAI兼容的接口
			const modelConfig = $settings.modelsConfig?.find(m => m.model === selectedModels[0]);
			const modelUrl = modelConfig?.url || $settings?.API_BASE_URL;
			const apiKey = modelConfig?.apiKey;
			
			if (!modelUrl) {
				toast.error("Please configure API Base URL in settings");
				return;
			}
			
			const res = await fetch(`${modelUrl}/v1/chat/completions`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					...(apiKey && { Authorization: `Bearer ${apiKey}` }),
					...($settings.authHeader && { Authorization: $settings.authHeader })
				},
				body: JSON.stringify({
					model: selectedModels[0],
					messages: [
						{
							role: 'user',
							content: `Generate a brief 3-5 word title for this question, excluding the term 'title.' Then, please reply with only the title: ${userPrompt}`
						}
					],
					temperature: 0.7,
					max_tokens: 100
				})
			})
				.then(async (res) => {
					if (!res.ok) throw await res.json();
					return res.json();
				})
				.catch((error) => {
					if ('error' in error) {
						toast.error(error.error.message);
					}
					console.log(error);
					return null;
				});

			if (res) {
				await setChatTitle(_chatId, res.choices?.[0]?.message?.content || 'New Chat');
			}
		} else {
			await setChatTitle(_chatId, `${userPrompt}`);
		}
	};

	const setChatTitle = async (_chatId, _title) => {
		chats.updateChat(_chatId, { title: _title });
		if (_chatId === $chatId) {
			title = _title;
			currentTitle.set(_title);
		}
	};
</script>

<svelte:window
	on:scroll={(e) => {
		autoScroll = window.innerHeight + window.scrollY >= document.body.offsetHeight - 40;
	}}
/>

{#if loaded}
	<div class="min-h-screen w-full flex overflow-hidden">
		<!-- Chatbot Sidebar -->
		<Sidebar class="flex-shrink-0 h-screen" />
		
		<!-- Main Content Area -->
		<div class="flex-1 flex flex-col h-screen">
			<!-- Messages Area -->
			<div class="flex-1 overflow-y-auto py-10 px-4">
				<Messages
					{selectedModels}
					bind:history
					bind:messages
					bind:autoScroll
					{sendPrompt}
					{regenerateResponse}
					bottomPadding={true}
				/>
			</div>
			
			<!-- Input Area -->
			<div class="py-3 px-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
				<MessageInput
					bind:prompt
					bind:autoScroll
					{messages}
					{submitPrompt}
					{stopResponse}
					bind:selectedModels
					disabled={messages.length > 0}
				/>
			</div>
		</div>
	</div>
{/if}