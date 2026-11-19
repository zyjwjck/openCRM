<script>
  import { page } from '$app/stores';
  import { goto, invalidateAll } from '$app/navigation';
  import { enhance, deserialize } from '$app/forms';
  import { tick } from 'svelte';
  import { toast } from 'svelte-sonner';

  import { PageHeader } from '$lib/components/layout';
  import { CrmDrawer } from '$lib/components/ui/crm-drawer';
  import { CrmTable } from '$lib/components/ui/crm-table';
  import { FilterBar, SearchInput, SelectFilter } from '$lib/components/ui/filter';
  import { Pagination } from '$lib/components/ui/pagination';
  import { Button } from '$lib/components/ui/button';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import { formatCurrency } from '$lib/utils/formatting.js';
  import { t } from '$lib/utils/i18n.svelte.js';
  import { Banknote, Paperclip, Upload, Download, Loader2, Trash2, FileText, AlertTriangle } from '@lucide/svelte';
  import { CURRENCY_CODES } from '$lib/constants/filters.js';
import AutoRefresh from '$lib/components/common/AutoRefresh.svelte';

  /** @type {{ data: import('./$types').PageData }} */
  let { data } = $props();

  // Status options
  const STATUS_OPTIONS = [
    { value: 'true', label: t('active') },
    { value: 'false', label: t('inactive') }
  ];

  // Currency options for select
  const currencyOptions = CURRENCY_CODES.filter((c) => c.value).map((c) => ({
    value: c.value,
    label: c.label,
    color: 'bg-[var(--surface-sunken)] text-[var(--text-secondary)]'
  }));

  /**
   * @typedef {'text' | 'email' | 'number' | 'date' | 'select' | 'checkbox' | 'relation'} ColumnType
   * @typedef {{ key: string, label: string, type?: ColumnType, width?: string, editable?: boolean, canHide?: boolean, getValue?: (row: any) => any, emptyText?: string, relationIcon?: string, options?: Array<{value: string, label: string, color: string}> }} ColumnDef
   */

  /** @type {ColumnDef[]} */
  const columns = [
    {
      key: 'name',
      label: t('name'),
      type: 'text',
      width: 'w-48',
      editable: false,
      canHide: false
    },
    {
      key: 'sku',
      label: t('sku'),
      type: 'text',
      width: 'w-28',
      canHide: true,
      getValue: (row) => row.sku
    },
    {
      key: 'category',
      label: t('category'),
      type: 'text',
      width: 'w-32',
      canHide: true,
      getValue: (row) => row.category
    },
    {
      key: 'price',
      label: t('price'),
      type: 'number',
      width: 'w-28',
      canHide: false,
      getValue: (row) => formatCurrency(Number(row.price), row.currency)
    },
    {
      key: 'isActive',
      label: t('status'),
      type: 'checkbox',
      width: 'w-28',
      canHide: true,
      getValue: (row) => row.isActive
    },
    {
      key: 'description',
      label: t('description'),
      type: 'text',
      width: 'w-64',
      canHide: true,
      getValue: (row) => row.description
    }
  ];

  // Drawer field definitions
  // NOTE: the shelf status is not listed here on purpose. It is shown and
  // toggled by the single status button in the drawer footer, which uses the
  // exact same wording/styling as the list column. A second "Active" checkbox
  // would duplicate that control and make the two look contradictory.
  const drawerFields = [
    { key: 'name', label: t('name'), type: 'text', section: 'core', required: true },
    { key: 'sku', label: t('sku'), type: 'text', section: 'core' },
    { key: 'category', label: t('category'), type: 'text', section: 'core' },
    { key: 'price', label: t('price'), type: 'number', section: 'pricing' },
    { key: 'currency', label: t('currency'), type: 'select', icon: Banknote, options: currencyOptions, placeholder: t('selectCurrency'), section: 'pricing' },
    { key: 'description', label: t('description'), type: 'textarea', section: 'details' }
  ];

  // Default visible columns
  const DEFAULT_VISIBLE_COLUMNS = ['name', 'sku', 'category', 'price', 'isActive', 'description'];

  // State
  let filtersExpanded = $state(false);
  let visibleColumns = $state([...DEFAULT_VISIBLE_COLUMNS]);

  // Drawer state
  let drawerOpen = $state(false);
  /** @type {'view' | 'create'} */
  let drawerMode = $state('view');
  let selectedProduct = $state(null);
  /** @type {Record<string, any>} */
  let drawerFormData = $state({});

  // Optimistic shelf-status overrides, keyed by product id
  /** @type {Record<string, boolean>} */
  let statusOverrides = $state({});
  /** @type {Record<string, boolean>} */
  let togglingIds = $state({});

  // Form references
  let createForm;
  let updateForm;
  let deleteForm;

  // Attachment state
  let attachments = $state([]);
  let attachmentsLoading = $state(false);
  let uploadingAttachment = $state(false);
  let fileInput;

  /**
   * Call a page server action with FormData and deserialize the result.
   * @param {string} action
   * @param {FormData} formData
   */
  async function callAction(action, formData) {
    const response = await fetch(`?/${action}`, { method: 'POST', body: formData });
    const result = /** @type {any} */ (deserialize(await response.text()));
    if (result.type === 'failure') {
      throw new Error(/** @type {string} */ (result.data?.error) || 'Request failed');
    }
    if (result.type !== 'success') {
      throw new Error('Request failed');
    }
    return result.data;
  }

  /** Load attachments for the selected product */
  async function loadAttachments() {
    if (!selectedProduct?.id) {
      attachments = [];
      return;
    }
    attachmentsLoading = true;
    try {
      const formData = new FormData();
      formData.append('productId', selectedProduct.id);
      const data = await callAction('listAttachments', formData);
      attachments = data?.attachments || [];
    } catch (err) {
      console.error('Failed to load attachments:', err);
      attachments = [];
    } finally {
      attachmentsLoading = false;
    }
  }

  /** Trigger the hidden file input */
  function handleUploadClick() {
    fileInput?.click();
  }

  /** Upload the chosen file */
  async function handleFileChange(event) {
    const target = /** @type {HTMLInputElement} */ (event.currentTarget);
    const file = target.files?.[0];
    if (!file || !selectedProduct?.id) return;

    uploadingAttachment = true;
    try {
      const formData = new FormData();
      formData.append('productId', selectedProduct.id);
      formData.append('file', file);
      const data = await callAction('uploadAttachment', formData);
      if (data?.attachment) {
        attachments = [data.attachment, ...attachments];
      } else {
        await loadAttachments();
      }
      toast.success(t('attachment_uploaded'));
    } catch (err) {
      toast.error(/** @type {Error} */ (err).message || t('attachment_upload_failed'));
    } finally {
      uploadingAttachment = false;
      target.value = '';
    }
  }

  /** Delete an attachment */
  async function handleAttachmentDelete(attachment) {
    if (!confirm(t('are_you_sure_delete_attachment'))) return;
    try {
      const formData = new FormData();
      formData.append('attachmentId', attachment.id);
      await callAction('deleteAttachment', formData);
      attachments = attachments.filter((a) => a.id !== attachment.id);
      toast.success(t('attachment_deleted'));
    } catch (err) {
      toast.error(/** @type {Error} */ (err).message || t('attachment_delete_failed'));
    }
  }

  /** Download an attachment via base64 payload */
  async function handleAttachmentDownload(attachment) {
    try {
      const formData = new FormData();
      formData.append('attachmentId', attachment.id);
      const data = await callAction('downloadAttachment', formData);
      const file = data?.file;
      if (!file?.data) throw new Error('No file data received');

      const byteCharacters = atob(file.data);
      const byteArray = new Uint8Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteArray[i] = byteCharacters.charCodeAt(i);
      }
      const blob = new Blob([byteArray], { type: file.contentType || 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.fileName || attachment.file_name || attachment.fileName || 'attachment';
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      toast.error(/** @type {Error} */ (err).message || t('attachment_download_failed'));
    }
  }

  /** Format attachment size */
  function formatFileSize(bytes) {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  // Form state for hidden forms
  let formState = $state({
    productId: '',
    name: '',
    description: '',
    sku: '',
    price: '0',
    currency: 'USD',
    category: '',
    isActive: 'true'
  });

  // Derived values
  const filters = $derived(data.filters);
  const pagination = $derived(data.pagination);
  const products = $derived(data.products);
  const categories = $derived(data.categories || []);

  // Count active filters
  const activeFiltersCount = $derived(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.category) count++;
    if (filters.is_active) count++;
    return count;
  });

  // Filter handlers
  async function updateFilters(newFilters) {
    const url = new URL($page.url);

    // Clear existing filter params
    ['search', 'category', 'is_active'].forEach((key) => url.searchParams.delete(key));

    // Set new params
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        url.searchParams.set(key, value);
      }
    });

    // Reset to page 1 when filters change
    url.searchParams.set('page', '1');

    await goto(url.toString(), { replaceState: true, noScroll: true, invalidateAll: true });
  }

  async function clearFilters() {
    await updateFilters({});
  }

  // Pagination handlers
  async function handlePageChange(newPage) {
    const url = new URL($page.url);
    url.searchParams.set('page', newPage.toString());
    await goto(url.toString(), { replaceState: true, noScroll: true, invalidateAll: true });
  }

  async function handleLimitChange(newLimit) {
    const url = new URL($page.url);
    url.searchParams.set('limit', newLimit.toString());
    url.searchParams.set('page', '1');
    await goto(url.toString(), { replaceState: true, noScroll: true, invalidateAll: true });
  }

  // Row click handler
  function handleRowClick(product) {
    selectedProduct = product;
    drawerMode = 'view';
    drawerOpen = true;
    loadAttachments();
  }

  /**
   * Resolve the effective shelf status for a row, preferring the optimistic
   * local override while a toggle request is in flight.
   * @param {any} product
   */
  function getProductStatus(product) {
    const id = product?.id;
    if (id && id in statusOverrides) return statusOverrides[id];
    return Boolean(product?.isActive);
  }

  /**
   * Toggle a product's shelf status directly from the list.
   * @param {any} product
   */
  async function handleToggleStatus(product) {
    if (!product?.id || togglingIds[product.id]) return;

    const nextValue = !getProductStatus(product);

    togglingIds = { ...togglingIds, [product.id]: true };
    statusOverrides = { ...statusOverrides, [product.id]: nextValue };

    const formData = new FormData();
    formData.append('productId', product.id);
    formData.append('isActive', nextValue ? 'true' : 'false');

    try {
      await callAction('toggleActive', formData);
      toast.success(nextValue ? t('product_activated') : t('product_deactivated'));
      // Refresh so the row reflects the persisted value, then drop the
      // optimistic override and let the server value become authoritative.
      await invalidateAll();
      const { [product.id]: _cleared, ...restOverrides } = statusOverrides;
      statusOverrides = restOverrides;
    } catch (err) {
      // Revert the optimistic change
      const { [product.id]: _removed, ...restOverrides } = statusOverrides;
      statusOverrides = restOverrides;
      toast.error(/** @type {Error} */ (err).message || t('failed_to_toggle_product'));
    } finally {
      const { [product.id]: _done, ...rest } = togglingIds;
      togglingIds = rest;
    }
  }

  // Create new product
  function openCreateDrawer() {
    selectedProduct = null;
    attachments = [];
    drawerMode = 'create';
    drawerFormData = {
      name: '',
      description: '',
      sku: '',
      price: '0',
      currency: 'USD',
      category: '',
      isActive: true
    };
    drawerOpen = true;
  }

  // Close drawer
  function closeDrawer() {
    drawerOpen = false;
    selectedProduct = null;
    drawerFormData = {};
    attachments = [];
  }

  // Sync drawer form data when opening
  $effect(() => {
    if (drawerOpen) {
      if (drawerMode === 'create') {
        // Already set in openCreateDrawer
      } else if (selectedProduct) {
        drawerFormData = { ...selectedProduct };
      }
    }
  });

  // Field change handler
  function handleFieldChange(field, value) {
    drawerFormData[field] = value;
  }

  // Save handler
  async function handleDrawerSave() {
    if (drawerMode === 'create') {
      formState.name = drawerFormData.name;
      formState.description = drawerFormData.description;
      formState.sku = drawerFormData.sku;
      formState.price = drawerFormData.price?.toString() || '0';
      formState.currency = drawerFormData.currency;
      formState.category = drawerFormData.category;
      formState.isActive = drawerFormData.isActive ? 'true' : 'false';

      await tick();
      createForm.requestSubmit();
    } else {
      formState.productId = selectedProduct.id;
      formState.name = drawerFormData.name;
      formState.description = drawerFormData.description;
      formState.sku = drawerFormData.sku;
      formState.price = drawerFormData.price?.toString() || '0';
      formState.currency = drawerFormData.currency;
      formState.category = drawerFormData.category;
      formState.isActive = drawerFormData.isActive ? 'true' : 'false';

      await tick();
      updateForm.requestSubmit();
    }
  }

  // Delete handler
  async function handleDelete() {
    if (!selectedProduct) return;

    if (!confirm(t('are_you_sure_delete_product'))) return;

    formState.productId = selectedProduct.id;
    await tick();
    deleteForm.requestSubmit();
  }

  /**
   * Toggle a product's shelf status from the drawer (detail view).
   * Keeps the drawer in sync with the server instead of going through
   * "Save changes", so the operation matches the list toggle.
   */
  async function handleDrawerToggleStatus() {
    if (!selectedProduct?.id) return;

    const nextValue = !getProductStatus(selectedProduct);
    const productId = selectedProduct.id;

    togglingIds = { ...togglingIds, [productId]: true };

    const formData = new FormData();
    formData.append('productId', productId);
    formData.append('isActive', nextValue ? 'true' : 'false');

    try {
      await callAction('toggleActive', formData);
      toast.success(nextValue ? t('product_activated') : t('product_deactivated'));
      // Reflect the new status in the drawer immediately
      selectedProduct = { ...selectedProduct, isActive: nextValue };
      drawerFormData = { ...drawerFormData, isActive: nextValue };
      await invalidateAll();
    } catch (err) {
      toast.error(/** @type {Error} */ (err).message || t('failed_to_toggle_product'));
    } finally {
      const { [productId]: _done, ...rest } = togglingIds;
      togglingIds = rest;
    }
  }

  // Column visibility
  function loadColumnConfig() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('products-column-config');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            // Keep the user's saved selection, but make sure newly added
            // columns (e.g. the shelf status column) are shown by default.
            const merged = [...parsed];
            for (const key of DEFAULT_VISIBLE_COLUMNS) {
              if (!merged.includes(key)) merged.push(key);
            }
            visibleColumns = merged;
          } else {
            visibleColumns = [...DEFAULT_VISIBLE_COLUMNS];
          }
        } catch (e) {
          visibleColumns = [...DEFAULT_VISIBLE_COLUMNS];
        }
      }
    }
  }

  function saveColumnConfig() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('products-column-config', JSON.stringify(visibleColumns));
    }
  }

  function toggleColumn(key) {
    const column = columns.find((c) => c.key === key);
    if (column && !column.canHide) return;

    if (visibleColumns.includes(key)) {
      visibleColumns = visibleColumns.filter((k) => k !== key);
    } else {
      visibleColumns = [...visibleColumns, key];
    }
    saveColumnConfig();
  }

  // Load column config on mount
  $effect(() => {
    loadColumnConfig();
  });
</script>

<!-- Hidden Forms -->
<form
  bind:this={createForm}
  method="POST"
  action="?/create"
  class="hidden"
  use:enhance={() => {
    return async ({ result }) => {
      if (result.type === 'success') {
        toast.success(t('product_created'));
        closeDrawer();
        invalidateAll();
      } else if (result.type === 'failure') {
        toast.error(/** @type {string} */ (result.data?.error) || t('failed_to_create_product'));
      }
    };
  }}
>
  <input type="hidden" name="name" value={formState.name} />
  <input type="hidden" name="description" value={formState.description} />
  <input type="hidden" name="sku" value={formState.sku} />
  <input type="hidden" name="price" value={formState.price} />
  <input type="hidden" name="currency" value={formState.currency} />
  <input type="hidden" name="category" value={formState.category} />
  <input type="hidden" name="isActive" value={formState.isActive} />
</form>

<form
  bind:this={updateForm}
  method="POST"
  action="?/update"
  class="hidden"
  use:enhance={() => {
    return async ({ result }) => {
      if (result.type === 'success') {
        toast.success(t('product_updated'));
        closeDrawer();
        invalidateAll();
      } else if (result.type === 'failure') {
        toast.error(/** @type {string} */ (result.data?.error) || t('failed_to_update_product'));
      }
    };
  }}
>
  <input type="hidden" name="productId" value={formState.productId} />
  <input type="hidden" name="name" value={formState.name} />
  <input type="hidden" name="description" value={formState.description} />
  <input type="hidden" name="sku" value={formState.sku} />
  <input type="hidden" name="price" value={formState.price} />
  <input type="hidden" name="currency" value={formState.currency} />
  <input type="hidden" name="category" value={formState.category} />
  <input type="hidden" name="isActive" value={formState.isActive} />
</form>

<form
  bind:this={deleteForm}
  method="POST"
  action="?/delete"
  class="hidden"
  use:enhance={() => {
    return async ({ result }) => {
      if (result.type === 'success') {
        toast.success(t('product_deleted'));
        closeDrawer();
        invalidateAll();
      } else if (result.type === 'failure') {
        toast.error(/** @type {string} */ (result.data?.error) || t('failed_to_delete_product'));
      }
    };
  }}
>
  <input type="hidden" name="productId" value={formState.productId} />
</form>

<!-- Page Content -->
<div class="flex flex-col gap-4">
  <!-- Header -->
  <PageHeader title={t('products')}>
    {#snippet actions()}
      <!-- Back to Invoices -->
      <Button variant="ghost" size="sm" onclick={() => goto('/invoices')}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="mr-2"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        {t('invoices')}
      </Button>

      <!-- Filters Toggle -->
      <Button
        variant="outline"
        size="sm"
        onclick={() => (filtersExpanded = !filtersExpanded)}
        class="gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
        {t('filters')}
        {#if activeFiltersCount() > 0}
          <span class="rounded-full bg-[var(--color-primary-light)] px-2 py-0.5 text-xs text-[var(--color-primary-default)]">
            {activeFiltersCount()}
          </span>
        {/if}
      </Button>

      <!-- Column Visibility -->
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          {#snippet child({ props })}
            <Button {...props} variant="outline" size="sm" class="gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="9" y1="3" x2="9" y2="21" />
              </svg>
              {t('columns')}
            </Button>
          {/snippet}
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end" class="w-48">
          {#each columns as column}
            <DropdownMenu.CheckboxItem
              class=""
              checked={visibleColumns.includes(column.key)}
              disabled={!column.canHide}
              onCheckedChange={() => toggleColumn(column.key)}
            >
              {column.label}
            </DropdownMenu.CheckboxItem>
          {/each}
        </DropdownMenu.Content>
      </DropdownMenu.Root>

      <!-- New Product -->
      <Button onclick={openCreateDrawer} class="gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        {t('createNewProduct')}
      </Button>
    {/snippet}
  </PageHeader>

  <!-- Filter Bar -->
  <FilterBar
    minimal
    expanded={filtersExpanded}
    activeCount={activeFiltersCount()}
    onClear={clearFilters}
  >
    <SearchInput
      value={filters.search}
      placeholder={t('search_products')}
      onchange={(value) => updateFilters({ ...filters, search: value })}
    />

    {#if categories.length > 0}
      <SelectFilter
        label={t('category')}
        value={filters.category}
        options={categories}
        onchange={(value) => updateFilters({ ...filters, category: value })}
      />
    {/if}

    <SelectFilter
      label={t('status')}
      value={filters.is_active}
      options={STATUS_OPTIONS}
      onchange={(value) => updateFilters({ ...filters, is_active: value })}
    />
  </FilterBar>

  <!-- Products Table -->
  <CrmTable data={products} {columns} bind:visibleColumns onRowClick={handleRowClick}>
    {#snippet emptyState()}
      <div class="flex flex-col items-center justify-center py-16 text-center">
        <div class="mb-4 flex size-16 items-center justify-center rounded-[var(--radius-xl)] bg-[var(--surface-sunken)]">
          <span class="text-4xl">📦</span>
        </div>
        <h3 class="text-[var(--text-primary)] text-lg font-medium">{t('no_products_yet')}</h3>
        <p class="text-[var(--text-secondary)] text-sm">{t('create_first_product')}</p>
      </div>
    {/snippet}
    {#snippet cellContent(row, column)}
      {#if column.key === 'price'}
        {formatCurrency(Number(row.price), row.currency)}
      {:else if column.key === 'isActive'}
        <button
          type="button"
          class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors {getProductStatus(row)
            ? 'bg-green-500/10 text-green-600 hover:bg-green-500/20 dark:bg-green-500/15 dark:text-green-400'
            : 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20 dark:bg-gray-500/15 dark:text-gray-400'}"
          disabled={togglingIds[row.id]}
          onclick={(e) => {
            e.stopPropagation();
            handleToggleStatus(row);
          }}
          title={getProductStatus(row) ? t('off_shelf') : t('on_shelf')}
        >
          <span
            class="h-1.5 w-1.5 rounded-full {getProductStatus(row)
              ? 'bg-green-500'
              : 'bg-gray-400'}"
          ></span>
          {getProductStatus(row) ? t('on_shelf') : t('off_shelf')}
        </button>
      {:else}
        {row[column.key] || '-'}
      {/if}
    {/snippet}
  </CrmTable>

  <!-- Pagination -->
  <Pagination
    page={pagination.page}
    limit={pagination.limit}
    total={pagination.total}
    limitOptions={[10, 25, 50, 100]}
    onPageChange={handlePageChange}
    onLimitChange={handleLimitChange}
  />
</div>

<!-- Product Drawer -->
<CrmDrawer
  bind:open={drawerOpen}
  data={drawerFormData}
  columns={drawerFields}
  titleKey="name"
  titlePlaceholder={t('new_product')}
  headerLabel={t('product')}
  mode={drawerMode}
  onFieldChange={handleFieldChange}
  onDelete={handleDelete}
  onClose={closeDrawer}
>
  {#snippet afterProperties()}
    {#if drawerMode !== 'create' && selectedProduct && !selectedProduct.hasCommissionPolicy}
      <div class="mb-3 rounded-[var(--radius-lg)] border border-[var(--color-warning-light)] bg-[var(--color-warning-light)] p-3 dark:border-[var(--color-warning-default)]/30 dark:bg-[var(--color-warning-default)]/10">
        <div class="flex gap-2">
          <AlertTriangle class="mt-0.5 size-4 shrink-0 text-[var(--color-warning-dark)] dark:text-[var(--color-warning-default)]" />
          <div>
            <p class="text-sm font-medium text-[var(--color-warning-dark)] dark:text-[var(--color-warning-default)]">{t('no_commission_policy')}</p>
            <p class="mt-0.5 text-xs text-[var(--color-warning-dark)]/80 dark:text-[var(--color-warning-default)]/80">
              {t('add_commission_policy_hint')}
            </p>
          </div>
        </div>
      </div>
    {/if}
    {#if drawerMode !== 'create' && selectedProduct}
      <div
        class="group -mx-3 flex min-h-[44px] items-center rounded-lg px-3 transition-all duration-150 hover:bg-muted/40"
      >
        <div
          class="flex w-32 shrink-0 items-center gap-2.5 text-[13px] font-medium text-muted-foreground"
        >
          {t('status')}
        </div>
        <div class="min-w-0 flex-1">
          <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors disabled:opacity-60 {getProductStatus(
              selectedProduct
            )
              ? 'bg-green-500/10 text-green-600 hover:bg-green-500/20 dark:bg-green-500/15 dark:text-green-400'
              : 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20 dark:bg-gray-500/15 dark:text-gray-400'}"
            disabled={togglingIds[selectedProduct.id]}
            onclick={handleDrawerToggleStatus}
            title={t('toggle_shelf_status')}
          >
            <span
              class="h-1.5 w-1.5 rounded-full {getProductStatus(selectedProduct)
                ? 'bg-green-500'
                : 'bg-gray-400'}"
            ></span>
            {getProductStatus(selectedProduct) ? t('on_shelf') : t('off_shelf')}
          </button>
        </div>
      </div>
    {/if}
  {/snippet}

  {#snippet activitySection()}
    {#if drawerMode === 'view' && selectedProduct}
      <div class="space-y-3">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Paperclip class="text-muted-foreground h-4 w-4" />
            <h3 class="text-sm font-semibold">{t('attachments')}</h3>
            {#if attachments.length > 0}
              <span class="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs">
                {attachments.length}
              </span>
            {/if}
          </div>
          <Button
            variant="outline"
            size="sm"
            class="gap-2"
            disabled={uploadingAttachment}
            onclick={handleUploadClick}
          >
            {#if uploadingAttachment}
              <Loader2 class="h-4 w-4 animate-spin" />
            {:else}
              <Upload class="h-4 w-4" />
            {/if}
            {t('upload_attachment')}
          </Button>
        </div>

        <input
          bind:this={fileInput}
          type="file"
          class="hidden"
          onchange={handleFileChange}
        />

        <!-- Attachment list -->
        {#if attachmentsLoading}
          <div class="text-muted-foreground flex items-center gap-2 py-4 text-sm">
            <Loader2 class="h-4 w-4 animate-spin" />
            {t('loading')}
          </div>
        {:else if attachments.length === 0}
          <div class="text-muted-foreground rounded-lg border border-dashed py-6 text-center text-sm">
            {t('no_attachments')}
          </div>
        {:else}
          <div class="space-y-2">
            {#each attachments as attachment (attachment.id)}
              <div
                class="flex items-center gap-3 rounded-lg border bg-[var(--surface-sunken)] px-3 py-2"
              >
                <FileText class="text-muted-foreground h-4 w-4 shrink-0" />
                <span class="min-w-0 flex-1 truncate text-sm" title={attachment.file_name}>
                  {attachment.file_name || 'file'}
                </span>
                <button
                  type="button"
                  class="text-muted-foreground hover:text-foreground transition-colors"
                  title={t('download')}
                  onclick={() => handleAttachmentDownload(attachment)}
                >
                  <Download class="h-4 w-4" />
                </button>
                <button
                  type="button"
                  class="text-muted-foreground hover:text-destructive transition-colors"
                  title={t('delete')}
                  onclick={() => handleAttachmentDelete(attachment)}
                >
                  <Trash2 class="h-4 w-4" />
                </button>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    {/if}
  {/snippet}

  {#snippet footerActions()}
    <div class="flex w-full items-center justify-end gap-2">
      <Button variant="outline" onclick={closeDrawer}>{t('cancel')}</Button>
      <Button onclick={handleDrawerSave}>
        {drawerMode === 'create' ? t('create_product') : t('save_changes')}
      </Button>
    </div>
  {/snippet}
</CrmDrawer>

<!-- Page Title -->
<svelte:head>
  <title>{t('products')} | openCRM</title>
</svelte:head>

<!-- 自动刷新组件 -->
<AutoRefresh interval={3000} enabled={true} />
