<script>
  import NanobotFrame from '$lib/components/common/NanobotFrame.svelte';
</script>

<svelte:head>
  <title>Agent - OpenCRM</title>
</svelte:head>

<div class="agent-page relative -mx-6 bg-background md:-mx-8">
  <NanobotFrame />
</div>

<style>
  .agent-page {
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }
</style>
