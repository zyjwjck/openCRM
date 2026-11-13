<script>
  import { invalidateAll } from '$app/navigation';

  let { interval = 3000, enabled = true } = $props();

  // Svelte 5 runes: the effect owns the interval and always cleans it up.
  // The previous Svelte 4 version (export let / $: / onMount) both leaked
  // multiple intervals (startRefresh never cleared the old one) and, being a
  // legacy class component, made SvelteKit's invalidateAll() call `$set` on an
  // undefined instance -> "Cannot read properties of undefined (reading '$set')".
  $effect(() => {
    if (!enabled) return;
    const id = setInterval(() => {
      invalidateAll();
    }, interval);
    return () => clearInterval(id);
  });
</script>

<!-- 自动刷新组件，无需渲染任何内容 -->
