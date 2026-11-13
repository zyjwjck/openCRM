<script>
  import { LayoutGrid, Table2 } from '@lucide/svelte';
  import { useI18n } from '$lib/utils/i18n.svelte.js';

  const i18n = useI18n();
  const tr = i18n.t;

  /**
   * @typedef {'table' | 'kanban'} ViewMode
   */

  /** @type {{ view: ViewMode, onchange?: (view: ViewMode) => void }} */
  let { view = 'table', onchange } = $props();

  /**
   * Handle view change
   * @param {ViewMode} newView
   */
  function handleChange(newView) {
    if (newView !== view) {
      onchange?.(newView);
    }
  }
</script>

<div
  class="flex rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
  role="group"
  aria-label={tr('viewModeToggle')}
>
  <button
    type="button"
    onclick={() => handleChange('table')}
    class="flex items-center gap-1.5 rounded-l-lg px-3 py-1.5 text-sm font-medium transition-colors {view ===
    'table'
      ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-300'}"
    aria-pressed={view === 'table'}
    aria-label={tr('tableView')}
  >
    <Table2 class="h-4 w-4" />
    <span class="hidden sm:inline">{tr('table')}</span>
  </button>
  <button
    type="button"
    onclick={() => handleChange('kanban')}
    class="flex items-center gap-1.5 rounded-r-lg border-l border-gray-200 px-3 py-1.5 text-sm font-medium transition-colors dark:border-gray-700 {view ===
    'kanban'
      ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-300'}"
    aria-pressed={view === 'kanban'}
    aria-label={tr('kanbanView')}
  >
    <LayoutGrid class="h-4 w-4" />
    <span class="hidden sm:inline">{tr('kanban')}</span>
  </button>
</div>
