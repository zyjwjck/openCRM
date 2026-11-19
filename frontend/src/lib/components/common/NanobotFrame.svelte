<script>
  import { onMount } from 'svelte';
  import { getCurrentLanguage } from '$lib/utils/i18n.svelte.js';
  import { cn } from '$lib/utils.js';

  /**
   * Embeddable nanobot WebUI. The active chat is tracked solely by the URL
   * hash inside the iframe, so we persist the hash it reports via postMessage
   * and restore it whenever the iframe is (re)mounted. This keeps the same
   * conversation across the /agent page and any drawer embedding this frame.
   */
  let { class: className = '' } = $props();

  const NANOBOT_ORIGIN = 'http://127.0.0.1:8765';
  const HASH_STORAGE_KEY = 'nanobot.webui.lastHash';
  const ROUTE_MESSAGE_SOURCE = 'nanobot-webui';
  const ROUTE_MESSAGE_TYPE = 'nanobot-webui:route';

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

  let iframeSrc = $state('');

  onMount(() => {
    /** @returns {string} */
    const getSavedHash = () => {
      try {
        const hash = localStorage.getItem(HASH_STORAGE_KEY) || '';
        return hash && hash !== '#/new' && hash !== '#/' ? hash : '';
      } catch {
        return '';
      }
    };

    const buildSrc = () => {
      const lang = toNanobotLocale(getCurrentLanguage());
      const theme = getCurrentTheme();
      const hash = getSavedHash();
      return `${NANOBOT_ORIGIN}/?lang=${lang}&theme=${theme}${hash}`;
    };

    const apply = () => { iframeSrc = buildSrc(); };

    apply();

    const onLanguageChange = () => apply();
    const onThemeChange = () => apply();
    const onStorage = (event) => {
      if (event.key === 'language' || event.key === 'theme') apply();
    };
    const onMediaChange = () => {
      if (localStorage.getItem('theme') === 'system') apply();
    };

    // Persist the chat hash reported by the embedded iframe. Only write to
    // storage here — calling apply() would reload the iframe in a loop.
    const onMessage = (event) => {
      if (event.origin !== NANOBOT_ORIGIN) return;
      const data = event.data;
      if (!data || data.source !== ROUTE_MESSAGE_SOURCE || data.type !== ROUTE_MESSAGE_TYPE) return;
      const hash = typeof data.hash === 'string' ? data.hash : '';
      try {
        if (hash && hash !== '#/new' && hash !== '#/') {
          localStorage.setItem(HASH_STORAGE_KEY, hash);
        } else {
          localStorage.removeItem(HASH_STORAGE_KEY);
        }
      } catch {
        // localStorage may be unavailable; restoring simply won't happen.
      }
    };

    window.addEventListener('languageChange', onLanguageChange);
    window.addEventListener('themeChange', onThemeChange);
    window.addEventListener('storage', onStorage);
    window.addEventListener('message', onMessage);
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    mql.addEventListener('change', onMediaChange);

    return () => {
      window.removeEventListener('languageChange', onLanguageChange);
      window.removeEventListener('themeChange', onThemeChange);
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('message', onMessage);
      mql.removeEventListener('change', onMediaChange);
    };
  });
</script>

{#if iframeSrc}
  <iframe
    src={iframeSrc}
    title="Nanobot Agent"
    class={cn('block h-full w-full border-0 bg-transparent', className)}
    frameborder="0"
    allow="clipboard-read; clipboard-write; microphone"
    allowfullscreen
  ></iframe>
{/if}
