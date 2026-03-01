<script>
  import { onMount, onDestroy } from 'svelte';
  import { invalidateAll } from '$app/navigation';

  export let interval = 3000; // 默认3秒刷新一次
  export let enabled = true; // 是否启用自动刷新

  let intervalId;

  onMount(() => {
    if (enabled) {
      startRefresh();
    }
  });

  onDestroy(() => {
    stopRefresh();
  });

  function startRefresh() {
    intervalId = setInterval(() => {
      invalidateAll();
    }, interval);
  }

  function stopRefresh() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  $: if (enabled) {
    startRefresh();
  } else {
    stopRefresh();
  }
</script>

<!-- 自动刷新组件，无需渲染任何内容 -->
