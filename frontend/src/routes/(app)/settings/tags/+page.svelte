<script>
  import { enhance } from '$app/forms';
  import { invalidateAll } from '$app/navigation';
  import { toast } from 'svelte-sonner';
  import { Tag, Plus, Archive, RotateCcw, Pencil, Search, MoreHorizontal, Check, X } from '@lucide/svelte';
  import { PageHeader } from '$lib/components/layout';
  import { Button } from '$lib/components/ui/button/index.js';
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { Label } from '$lib/components/ui/label/index.js';
  import { TAG_COLORS } from '$lib/constants/colors.js';
  import { t } from '$lib/utils/i18n.js';

  /** @type {{ data: any, form: any }} */
  let { data, form } = $props();

  const tags = $derived(data.tags || []);
  const activeTags = $derived(tags.filter((/** @type {any} */ t) => t.is_active));
  const archivedTags = $derived(tags.filter((/** @type {any} */ t) => !t.is_active));

  // Search and filter
  let searchQuery = $state('');
  let showArchived = $state(false);

  const filteredActiveTags = $derived(
    activeTags.filter((/** @type {any} */ tag) =>
      tag.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const filteredArchivedTags = $derived(
    archivedTags.filter((/** @type {any} */ tag) =>
      tag.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Dialog state
  let createDialogOpen = $state(false);
  let editDialogOpen = $state(false);
  /** @type {any} */
  let editingTag = $state(null);
  let isLoading = $state(false);

  // Form state
  let formName = $state('');
  let formColor = $state('blue');
  let formDescription = $state('');

  function openCreate() {
    formName = '';
    formColor = 'blue';
    formDescription = '';
    createDialogOpen = true;
  }

  /**
   * @param {any} tag
   */
  function openEdit(tag) {
    editingTag = tag;
    formName = tag.name;
    formColor = tag.color || 'blue';
    formDescription = tag.description || '';
    editDialogOpen = true;
  }

  function closeDialogs() {
    createDialogOpen = false;
    editDialogOpen = false;
    editingTag = null;
  }

  // Handle form results
  $effect(() => {
    if (form?.success) {
      const messages = {
        create: t('tagCreatedSuccessfully'),
        update: t('tagUpdatedSuccessfully'),
        archive: t('tagArchivedSuccessfully'),
        restore: t('tagRestoredSuccessfully')
      };
      toast.success(messages[form.action] || t('operationSuccessful'));
      closeDialogs();
      invalidateAll();
    } else if (form?.error) {
      toast.error(form.error);
    }
  });

  // HubSpot-style color mapping - simple, clean colors
  /**
   * @param {string} color
   */
  function getHubspotBadgeClass(color) {
    const colorMap = {
      gray: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
      red: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400',
      orange: 'bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-400',
      amber: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
      yellow: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400',
      lime: 'bg-lime-50 text-lime-700 dark:bg-lime-950 dark:text-lime-400',
      green: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400',
      emerald: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400',
      teal: 'bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-400',
      cyan: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-400',
      sky: 'bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-400',
      blue: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
      indigo: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400',
      violet: 'bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-400',
      purple: 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-400',
      fuchsia: 'bg-fuchsia-50 text-fuchsia-700 dark:bg-fuchsia-950 dark:text-fuchsia-400',
      pink: 'bg-pink-50 text-pink-700 dark:bg-pink-950 dark:text-pink-400',
      rose: 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
    };
    return colorMap[color] || colorMap.blue;
  }

  /**
   * @param {string} color
   */
  function getColorDotClass(color) {
    const colorMap = {
      gray: 'bg-slate-500',
      red: 'bg-red-500',
      orange: 'bg-orange-500',
      amber: 'bg-amber-500',
      yellow: 'bg-yellow-500',
      lime: 'bg-lime-500',
      green: 'bg-emerald-500',
      emerald: 'bg-emerald-500',
      teal: 'bg-teal-500',
      cyan: 'bg-cyan-500',
      sky: 'bg-sky-500',
      blue: 'bg-blue-500',
      indigo: 'bg-indigo-500',
      violet: 'bg-violet-500',
      purple: 'bg-purple-500',
      fuchsia: 'bg-fuchsia-500',
      pink: 'bg-pink-500',
      rose: 'bg-rose-500'
    };
    return colorMap[color] || colorMap.blue;
  }
</script>

<svelte:head>
  <title>{t('tags')} - BottleCRM</title>
</svelte:head>

<!-- HubSpot-style header -->
<div class="border-b border-border bg-card">
  <div class="px-6 py-5">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight text-foreground">{t('tags')}</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          {t('createAndManageTags')}
        </p>
      </div>
      <Button onclick={openCreate} class="bg-[var(--color-primary-default)] hover:bg-[var(--color-primary-dark)] text-white border-0">
        <Plus class="mr-2 h-4 w-4" />
        {t('createTag')}
      </Button>
    </div>
  </div>
</div>

<div class="flex-1 bg-background">
  <!-- Search and filter bar -->
  <div class="border-b border-border bg-card px-6 py-3">
    <div class="flex items-center gap-4">
      <div class="relative flex-1 max-w-sm">
        <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder={t('searchTags')}
          bind:value={searchQuery}
          class="pl-9 h-9 bg-background"
        />
      </div>
      <div class="flex items-center gap-2">
        <button
          onclick={() => (showArchived = false)}
          class="px-3 py-1.5 text-sm font-medium rounded-md transition-colors {!showArchived
            ? 'bg-secondary text-foreground'
            : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'}"
        >
          {t('active')} ({activeTags.length})
        </button>
        <button
          onclick={() => (showArchived = true)}
          class="px-3 py-1.5 text-sm font-medium rounded-md transition-colors {showArchived
            ? 'bg-secondary text-foreground'
            : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'}"
        >
          {t('archived')} ({archivedTags.length})
        </button>
      </div>
    </div>
  </div>

  <!-- Tags table -->
  <div class="px-6 py-4">
    {#if !showArchived}
      {#if filteredActiveTags.length === 0}
        <div class="flex flex-col items-center justify-center py-16 text-center">
          <div class="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <Tag class="h-7 w-7 text-muted-foreground" />
          </div>
          {#if searchQuery}
            <h3 class="text-lg font-medium text-foreground">No tags found</h3>
            <p class="mt-1 text-sm text-muted-foreground">
              No tags match "{searchQuery}". Try a different search term.
            </p>
          {:else}
            <h3 class="text-lg font-medium text-foreground">No tags yet</h3>
            <p class="mt-1 max-w-sm text-sm text-muted-foreground">
              Tags help you organize and filter your CRM records. Create your first tag to get started.
            </p>
            <Button onclick={openCreate} class="mt-4 bg-[var(--color-primary-default)] hover:bg-[var(--color-primary-dark)] text-white border-0">
              <Plus class="mr-2 h-4 w-4" />
              Create tag
            </Button>
          {/if}
        </div>
      {:else}
        <div class="overflow-hidden rounded-lg border border-border">
          <table class="w-full">
            <thead>
              <tr class="border-b border-border bg-muted/50">
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t('tagName')}
                </th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t('description')}
                </th>
                <th class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t('actions')}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              {#each filteredActiveTags as tag (tag.id)}
                <tr class="group bg-card transition-colors hover:bg-muted/30">
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-3">
                      <span class="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm font-medium {getHubspotBadgeClass(tag.color)}">
                        <span class="h-2 w-2 rounded-full {getColorDotClass(tag.color)}"></span>
                        {tag.name}
                      </span>
                    </div>
                  </td>
                  <td class="px-4 py-3">
                    <span class="text-sm text-muted-foreground">
                      {tag.description || '—'}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-right">
                    <div class="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        variant="ghost"
                        size="sm"
                        onclick={() => openEdit(tag)}
                        class="h-8 px-2 text-muted-foreground hover:text-foreground"
                      >
                        <Pencil class="h-4 w-4" />
                        <span class="ml-1.5">{t('edit')}</span>
                      </Button>
                      <DropdownMenu.Root>
                        <DropdownMenu.Trigger>
                          <Button variant="ghost" size="icon" class="h-8 w-8 text-muted-foreground hover:text-foreground">
                            <MoreHorizontal class="h-4 w-4" />
                          </Button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content align="end">
                          <form method="POST" action="?/archive" use:enhance>
                            <input type="hidden" name="tagId" value={tag.id} />
                            <DropdownMenu.Item class="text-destructive focus:text-destructive">
                              <button type="submit" class="flex w-full items-center gap-2">
                                <Archive class="h-4 w-4" />
                                {t('archiveTag')}
                              </button>
                            </DropdownMenu.Item>
                          </form>
                        </DropdownMenu.Content>
                      </DropdownMenu.Root>
                    </div>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
        <p class="mt-3 text-xs text-muted-foreground">
          {t('showing', { count: filteredActiveTags.length, total: activeTags.length })} {t('activeTags')}
        </p>
      {/if}
    {:else}
      {#if filteredArchivedTags.length === 0}
        <div class="flex flex-col items-center justify-center py-16 text-center">
          <div class="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <Archive class="h-7 w-7 text-muted-foreground" />
          </div>
          {#if searchQuery}
            <h3 class="text-lg font-medium text-foreground">No archived tags found</h3>
            <p class="mt-1 text-sm text-muted-foreground">
              No archived tags match "{searchQuery}".
            </p>
          {:else}
            <h3 class="text-lg font-medium text-foreground">No archived tags</h3>
            <p class="mt-1 text-sm text-muted-foreground">
              Archived tags will appear here.
            </p>
          {/if}
        </div>
      {:else}
        <div class="overflow-hidden rounded-lg border border-border">
          <table class="w-full">
            <thead>
              <tr class="border-b border-border bg-muted/50">
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t('tagName')}
                </th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t('description')}
                </th>
                <th class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t('actions')}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              {#each filteredArchivedTags as tag (tag.id)}
                <tr class="group bg-card opacity-60 transition-all hover:opacity-100">
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-3">
                      <span class="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm font-medium {getHubspotBadgeClass(tag.color)}">
                        <span class="h-2 w-2 rounded-full {getColorDotClass(tag.color)}"></span>
                        {tag.name}
                      </span>
                    </div>
                  </td>
                  <td class="px-4 py-3">
                    <span class="text-sm text-muted-foreground">
                      {tag.description || '—'}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-right">
                    <form method="POST" action="?/restore" use:enhance class="inline">
                      <input type="hidden" name="tagId" value={tag.id} />
                      <Button
                        variant="ghost"
                        size="sm"
                        type="submit"
                        class="h-8 gap-1.5 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100"
                      >
                        <RotateCcw class="h-4 w-4" />
                        {t('restore')}
                      </Button>
                    </form>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
        <p class="mt-3 text-xs text-muted-foreground">
          {t('showing', { count: filteredArchivedTags.length, total: archivedTags.length })} {t('archivedTags')}
        </p>
      {/if}
    {/if}
  </div>
</div>

<!-- Create Dialog - HubSpot style -->
<Dialog.Root bind:open={createDialogOpen}>
  <Dialog.Content class="sm:max-w-md p-0 gap-0 overflow-hidden">
    <div class="border-b border-border px-6 py-4">
      <Dialog.Title class="text-lg font-semibold">{t('createTag')}</Dialog.Title>
      <Dialog.Description class="text-sm text-muted-foreground mt-1">
        {t('tagsHelpOrganize')}
      </Dialog.Description>
    </div>
    <form
      method="POST"
      action="?/create"
      use:enhance={() => {
        isLoading = true;
        return async ({ update }) => {
          await update();
          isLoading = false;
        };
      }}
    >
      <div class="px-6 py-5 space-y-5">
        <div class="space-y-2">
          <Label for="name" class="text-sm font-medium">
            {t('tagName')} <span class="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            bind:value={formName}
            placeholder={t('tagNamePlaceholder')}
            class="h-10"
          />
        </div>

        <div class="space-y-2">
          <Label class="text-sm font-medium">{t('color')}</Label>
          <div class="flex flex-wrap gap-2">
            {#each TAG_COLORS as color}
              <button
                type="button"
                onclick={() => (formColor = color.value)}
                class="group relative flex h-7 w-7 items-center justify-center rounded-full transition-all {getColorDotClass(color.value)} {formColor === color.value ? 'ring-2 ring-offset-2 ring-offset-background ring-foreground scale-110' : 'hover:scale-110'}"
                title={color.label}
              >
                {#if formColor === color.value}
                  <Check class="h-3.5 w-3.5 text-white" />
                {/if}
              </button>
            {/each}
          </div>
          <input type="hidden" name="color" value={formColor} />
        </div>

        <div class="space-y-2">
          <Label for="description" class="text-sm font-medium">
            {t('description')} <span class="text-muted-foreground font-normal">(optional)</span>
          </Label>
          <Input
            id="description"
            name="description"
            bind:value={formDescription}
            placeholder={t('tagDescriptionPlaceholder')}
            class="h-10"
          />
        </div>

        <!-- Preview -->
        <div class="pt-2">
          <Label class="text-sm font-medium text-muted-foreground">{t('preview')}</Label>
          <div class="mt-2 flex items-center">
            <span class="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm font-medium {getHubspotBadgeClass(formColor)}">
              <span class="h-2 w-2 rounded-full {getColorDotClass(formColor)}"></span>
              {formName || t('tagName')}
            </span>
          </div>
        </div>
      </div>

      <div class="flex justify-end gap-2 border-t border-border bg-muted/30 px-6 py-4">
        <Button variant="outline" type="button" onclick={() => (createDialogOpen = false)}>
          {t('cancel')}
        </Button>
        <Button
          type="submit"
          disabled={!formName.trim() || isLoading}
          class="bg-[var(--color-primary-default)] hover:bg-[var(--color-primary-dark)] text-white border-0"
        >
          {isLoading ? t('creating') : t('createTag')}
        </Button>
      </div>
    </form>
  </Dialog.Content>
</Dialog.Root>

<!-- Edit Dialog - HubSpot style -->
<Dialog.Root bind:open={editDialogOpen}>
  <Dialog.Content class="sm:max-w-md p-0 gap-0 overflow-hidden">
    <div class="border-b border-border px-6 py-4">
      <Dialog.Title class="text-lg font-semibold">{t('editTag')}</Dialog.Title>
      <Dialog.Description class="text-sm text-muted-foreground mt-1">
        {t('updateTagNameColorDescription')}
      </Dialog.Description>
    </div>
    <form
      method="POST"
      action="?/update"
      use:enhance={() => {
        isLoading = true;
        return async ({ update }) => {
          await update();
          isLoading = false;
        };
      }}
    >
      <input type="hidden" name="tagId" value={editingTag?.id} />
      <div class="px-6 py-5 space-y-5">
        <div class="space-y-2">
          <Label for="edit-name" class="text-sm font-medium">
            {t('tagName')} <span class="text-destructive">*</span>
          </Label>
          <Input id="edit-name" name="name" bind:value={formName} class="h-10" />
        </div>

        <div class="space-y-2">
          <Label class="text-sm font-medium">{t('color')}</Label>
          <div class="flex flex-wrap gap-2">
            {#each TAG_COLORS as color}
              <button
                type="button"
                onclick={() => (formColor = color.value)}
                class="group relative flex h-7 w-7 items-center justify-center rounded-full transition-all {getColorDotClass(color.value)} {formColor === color.value ? 'ring-2 ring-offset-2 ring-offset-background ring-foreground scale-110' : 'hover:scale-110'}"
                title={color.label}
              >
                {#if formColor === color.value}
                  <Check class="h-3.5 w-3.5 text-white" />
                {/if}
              </button>
            {/each}
          </div>
          <input type="hidden" name="color" value={formColor} />
        </div>

        <div class="space-y-2">
          <Label for="edit-description" class="text-sm font-medium">
            {t('description')} <span class="text-muted-foreground font-normal">(optional)</span>
          </Label>
          <Input id="edit-description" name="description" bind:value={formDescription} class="h-10" />
        </div>

        <!-- Preview -->
        <div class="pt-2">
          <Label class="text-sm font-medium text-muted-foreground">{t('preview')}</Label>
          <div class="mt-2 flex items-center">
            <span class="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm font-medium {getHubspotBadgeClass(formColor)}">
              <span class="h-2 w-2 rounded-full {getColorDotClass(formColor)}"></span>
              {formName || t('tagName')}
            </span>
          </div>
        </div>
      </div>

      <div class="flex justify-end gap-2 border-t border-border bg-muted/30 px-6 py-4">
        <Button variant="outline" type="button" onclick={() => (editDialogOpen = false)}>
          {t('cancel')}
        </Button>
        <Button
          type="submit"
          disabled={!formName.trim() || isLoading}
          class="bg-[var(--color-primary-default)] hover:bg-[var(--color-primary-dark)] text-white border-0"
        >
          {isLoading ? t('saving') : t('save')}
        </Button>
      </div>
    </form>
  </Dialog.Content>
</Dialog.Root>
