<script>
  import { setInitialLanguage } from '$lib/utils/i18n.svelte.js';

  let { data, children } = $props();

  // Inject SSR language before any child renders so the server-rendered HTML
  // matches the client's saved preference (no English -> Chinese flash).
  // svelte-ignore state_referenced_locally
  setInitialLanguage(data.language);
</script>

{@render children()}
