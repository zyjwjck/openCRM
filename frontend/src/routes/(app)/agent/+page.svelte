<script>
  import { onMount } from 'svelte';
  import { getCurrentLanguage } from '$lib/utils/i18n.svelte.js';

  const NANOBOT_ORIGIN = 'http://127.0.0.1:8765';

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
    // 'system' or unset → resolve from actual applied class
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  }

  let iframeSrc = $state('');

  onMount(() => {
    const buildSrc = () => {
      const lang = toNanobotLocale(getCurrentLanguage());
      const theme = getCurrentTheme();
      // Directly load nanobot homepage; nanobot reads ?lang= & ?theme= URL params.
      return `${NANOBOT_ORIGIN}/?lang=${lang}&theme=${theme}`;
    };

    const apply = () => { iframeSrc = buildSrc(); };

    apply();

    const onLanguageChange = () => apply();
    const onThemeChange = () => apply();
    const onStorage = (event) => {
      if (event.key === 'language' || event.key === 'theme') apply();
    };
    const onMediaChange = (e) => {
      // When theme=system, media query changes should propagate
      if (localStorage.getItem('theme') === 'system') apply();
    };

    window.addEventListener('languageChange', onLanguageChange);
    window.addEventListener('themeChange', onThemeChange);
    window.addEventListener('storage', onStorage);
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    mql.addEventListener('change', onMediaChange);

    return () => {
      window.removeEventListener('languageChange', onLanguageChange);
      window.removeEventListener('themeChange', onThemeChange);
      window.removeEventListener('storage', onStorage);
      mql.removeEventListener('change', onMediaChange);
    };
  });
</script>

<svelte:head>
  <title>Agent - OpenCRM</title>
</svelte:head>

<div class="agent-page relative bg-background">
  {#if iframeSrc}
    <iframe
      src={iframeSrc}
      title="Nanobot Agent"
      class="agent-iframe"
      frameborder="0"
      allow="clipboard-read; clipboard-write; microphone"
      allowfullscreen
    ></iframe>
  {/if}
</div>

<style>
  .agent-page {
    flex: 1;
    min-height: 0;
    width: 100%;
    overflow: hidden;
  }

  .agent-iframe {
    width: 100%;
    height: 100%;
    border: none;
    display: block;
    background: transparent;
  }
</style>
