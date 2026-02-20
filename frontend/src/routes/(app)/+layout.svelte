<script>
  import '../../app.css';
  import { AppShell } from '$lib/components/layout/index.js';
  import { Toaster } from '$lib/components/ui/sonner/index.js';
  import { initOrgSettings } from '$lib/stores/org.js';
  import { v4 as uuidv4 } from "uuid";
  import { openDB, deleteDB } from "idb";
  import { onMount, tick } from "svelte";
  import { goto } from "$app/navigation";
  import { info, showSettings, settings, models, db, chats, chatId, currentTitle } from "$lib/stores";
  import SettingsModal from "$lib/components/chat/SettingsModal.svelte";
  import toast from "svelte-french-toast";

  let { data, children } = $props();
  let loaded = $state(false);
  let currentModels = [];

  const getModels = async () => {
    // 由于使用云上大模型，不再从Ollama获取模型列表
    // 从用户配置中获取模型列表
    return $settings?.modelsConfig?.map(model => ({
      name: model.model,
      digest: "",
      size: "",
      modified_at: ""
    })) || [];
  };

  const getDB = async () => {
    if (typeof window === 'undefined') {
      // Return a mock DB object for server-side rendering
      return {
        db: null,
        getChatById: async function (id) {
          return null;
        },
        getChats: async function () {
          return [];
        },
        exportChats: async function () {
          return [];
        },
        addChats: async function (_chats) {
          // Do nothing
        },
        addChat: async function (chat) {
          // Do nothing
        },
        createNewChat: async function (chat) {
          // Do nothing
        },
        updateChatById: async function (id, updated) {
          // Do nothing
        },
        deleteChatById: async function (id) {
          // Do nothing
        },
        deleteAllChat: async function () {
          // Do nothing
        }
      };
    }

    const DB = await openDB("Chats", 1, {
      upgrade(db) {
        const store = db.createObjectStore("chats", {
          keyPath: "id",
          autoIncrement: true
        });
        store.createIndex("timestamp", "timestamp");
      }
    });

    return {
      db: DB,
      getChatById: async function (id) {
        return await this.db.get("chats", id);
      },
      getChats: async function () {
        let chats = await this.db.getAllFromIndex("chats", "timestamp");
        chats = chats.map((item, idx) => ({
          title: chats[chats.length - 1 - idx].title,
          id: chats[chats.length - 1 - idx].id
        }));
        return chats;
      },
      exportChats: async function () {
        let chats = await this.db.getAllFromIndex("chats", "timestamp");
        chats = chats.map((item, idx) => chats[chats.length - 1 - idx]);
        return chats;
      },
      addChats: async function (_chats) {
        for (const chat of _chats) {
          console.log(chat);
          await this.addChat(chat);
        }
        await chats.set(await this.getChats());
      },
      addChat: async function (chat) {
        await this.db.put("chats", {
          ...chat
        });
      },
      createNewChat: async function (chat) {
        await this.addChat({ ...chat, timestamp: Date.now() });
        await chats.set(await this.getChats());
      },
      updateChatById: async function (id, updated) {
        const chat = await this.getChatById(id);

        await this.db.put("chats", {
          ...chat,
          ...updated,
          timestamp: Date.now()
        });

        await chats.set(await this.getChats());
      },
      deleteChatById: async function (id) {
        if ($chatId === id) {
          goto("/chat");
          await chatId.set(uuidv4());
        }
        await this.db.delete("chats", id);
        await chats.set(await this.getChats());
      },
      deleteAllChat: async function () {
        const tx = this.db.transaction("chats", "readwrite");
        await Promise.all([tx.store.clear(), tx.done]);

        await chats.set(await this.getChats());
      }
    };
  };

  // Initialize org settings store from server data
  $effect(() => {
    if (data.org_settings) {
      initOrgSettings(data.org_settings);
    }
  });

  onMount(async () => {
    if (typeof window !== 'undefined') {
      await settings.set(JSON.parse(localStorage.getItem("settings") ?? "{}"));
    }

    // 获取模型列表（从用户配置中）
    await models.set(await getModels());

    let _db = await getDB();
    await db.set(_db);

    await tick();
    loaded = true;
  });
</script>

{#if loaded}
  <AppShell user={data.user} org_name={data.org_name}>
    <main class="flex-1">
      {@render children()}
    </main>
  </AppShell>
{/if}

<SettingsModal show={$showSettings} onClose={() => showSettings.set(false)} />

{#if $showSettings}
	{console.log('showSettings is true, SettingsModal should be visible')}
{/if}
<Toaster richColors closeButton position="bottom-right" />
