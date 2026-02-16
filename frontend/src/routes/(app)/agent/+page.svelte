<script>
  import { t } from '$lib/utils/i18n.js';
</script>

<svelte:head>
  <title>Agent - OpenCRM</title>
</svelte:head>

<div class="agent-page">
  <div class="container">
    <h1 class="title">{t('agent')}</h1>
    <div class="content">
      <p class="coming-soon">{t('comingSoon')}</p>
    </div>
  </div>
</div>

<style>
  .agent-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--background);
  }

  .container {
    text-align: center;
    max-width: 600px;
    padding: 2rem;
  }

  .title {
    font-size: 2.5rem;
    font-weight: 800;
    color: var(--text-primary);
    margin-bottom: 2rem;
  }

  .content {
    background: var(--card);
    border-radius: var(--radius-lg);
    padding: 3rem;
    border: 1px solid var(--border);
  }

  .coming-soon {
    font-size: 1.5rem;
    color: var(--text-secondary);
    margin: 0;
  }
</style>