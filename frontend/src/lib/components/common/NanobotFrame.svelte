<script>
  import { onMount } from 'svelte';
  import { apiRequest } from '$lib/api.js';
  import { getCurrentLanguage } from '$lib/utils/i18n.svelte.js';
  import { cn } from '$lib/utils.js';

  /**
   * Embeddable nanobot WebUI, mounted as a micro-frontend (no iframe).
   * The React agent UI is dynamically imported from the CRM's static assets
   * and mounted into this component's container. The active chat is tracked by
   * a session hash persisted to localStorage, so the same conversation is
   * restored across the /agent page and any drawer embedding this frame.
   */
  let {
    class: className = '',
    initialCrmModules = [],
  } = $props();

  const HASH_STORAGE_KEY = 'nanobot.webui.lastHash';
  const MODULE_URL = '/nanobot-agent/agent.js?v=2';
  // Version query busts the browser cache when the hosted CSS is rebuilt.
  // Increment V when the WebUI CSS content changes.
  const CSS_URL = '/nanobot-agent/style.css?v=4';

  /** @param {string} language */
  const toNanobotLocale = (language) => {
    if (!language) return 'en';
    const lower = String(language).toLowerCase();
    if (lower === 'zh' || lower.startsWith('zh-cn')) return 'zh-CN';
    if (lower.startsWith('zh-tw') || lower.startsWith('zh-hk')) return 'zh-TW';
    return lower;
  };

  /** Resolve effective theme ('light'|'dark'), handling 'system' */
  function getCurrentTheme() {
    if (typeof window === 'undefined') return 'light';
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') return stored;
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  }

  /** @returns {string} */
  function getSavedHash() {
    try {
      const hash = localStorage.getItem(HASH_STORAGE_KEY) || '';
      return hash && hash !== '#/new' && hash !== '#/' ? hash : '';
    } catch {
      return '';
    }
  }

  /** Ensure the hosted WebUI stylesheet is present in the document. */
  function ensureStylesheet() {
    if (document.querySelector(`link[data-nanobot-agent-css]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = CSS_URL;
    link.dataset.nanobotAgentCss = 'true';
    document.head.appendChild(link);
  }

  let containerEl;
  let errorMessage = $state('');
  let handle = null;
  let modulePromise = null;

  /** Fetch a signed identity credential for the embedded nanobot WebUI. */
  async function loadCredential() {
    const data = await apiRequest('/agent/nanobot-credential/');
    return data?.credential || '';
  }

  async function mountAgent() {
    if (!containerEl) return;
    errorMessage = '';
    try {
      ensureStylesheet();
      const credential = await loadCredential();
      if (!credential) throw new Error('无法获取 Agent 身份凭证，请重新登录');
      if (!modulePromise) modulePromise = import(/* @vite-ignore */ MODULE_URL);
      const mod = await modulePromise;
      // Unmount any previous instance before creating a new one.
      handle?.unmount?.();
      handle = await mod.mountAgent(containerEl, {
        credential,
        language: toNanobotLocale(getCurrentLanguage()),
        theme: getCurrentTheme(),
        initialSessionHash: getSavedHash(),
        initialCrmModules: Array.isArray(initialCrmModules) ? [...initialCrmModules] : [],
        onRouteChange: (hash) => {
          try {
            if (hash && hash !== '#/new' && hash !== '#/') {
              localStorage.setItem(HASH_STORAGE_KEY, hash);
            } else {
              localStorage.removeItem(HASH_STORAGE_KEY);
            }
          } catch {
            // localStorage may be unavailable; restoring simply won't happen.
          }
        },
        onError: (error) => {
          errorMessage = error?.message || 'Agent 初始化失败';
        },
      });
    } catch (err) {
      errorMessage = err?.message || 'Agent 加载失败';
    }
  }

  onMount(() => {
    void mountAgent();

    const remount = () => { void mountAgent(); };
    const onLanguageChange = () => remount();
    const onThemeChange = () => remount();
    const onStorage = (event) => {
      if (event.key === 'language' || event.key === 'theme') remount();
    };
    const onMediaChange = () => {
      if (localStorage.getItem('theme') === 'system') remount();
    };

    window.addEventListener('languageChange', onLanguageChange);
    window.addEventListener('themeChange', onThemeChange);
    window.addEventListener('storage', onStorage);
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    mql.addEventListener('change', onMediaChange);

    return () => {
      handle?.unmount?.();
      handle = null;
      window.removeEventListener('languageChange', onLanguageChange);
      window.removeEventListener('themeChange', onThemeChange);
      window.removeEventListener('storage', onStorage);
      mql.removeEventListener('change', onMediaChange);
    };
  });
</script>

<div class={cn('h-full w-full', className)}>
  {#if errorMessage}
    <div class="flex h-full w-full flex-col items-center justify-center gap-2 p-6 text-center text-sm text-muted-foreground">
      <span>{errorMessage}</span>
      <button
        type="button"
        class="rounded-md border border-border px-3 py-1.5 text-foreground hover:bg-accent"
        onclick={() => void mountAgent()}
      >重试</button>
    </div>
  {/if}
  <div bind:this={containerEl} class="h-full w-full"></div>
</div>
