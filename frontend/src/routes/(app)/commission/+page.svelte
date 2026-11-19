<script>
  import { cancel, enhance } from '$app/forms';
  import { invalidateAll, goto } from '$app/navigation';
  import { tick } from 'svelte';
  import { toast } from 'svelte-sonner';
  import { PageHeader } from '$lib/components/layout';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Pagination } from '$lib/components/ui/pagination';
  import { Search, Plus, Trash2, Wallet, Loader2, X } from '@lucide/svelte';
  import { useI18n } from '$lib/utils/i18n.svelte.js';
  import { formatCurrency, formatDate } from '$lib/utils/formatting.js';
  import { getCurrentUser } from '$lib/api.js';

  const i18n = useI18n();
  const tr = i18n.t;

  let { data, form } = $props();

  const currentUser = getCurrentUser();
  const isAdmin = !!currentUser?.organizations?.some((o) => o.role === 'ADMIN');

  const BASE_TYPES = [
    { value: 'NET', label: () => tr('netExclTax') },
    { value: 'GROSS', label: () => tr('grossInclTax') },
    { value: 'GROSS_PROFIT', label: () => tr('grossProfit') },
    { value: 'MARGIN_RATE', label: () => tr('marginRate') },
    { value: 'CASH', label: () => tr('cashReceived') }
  ];
  const CUSTOMER_SCOPES = [
    { value: 'ALL', label: () => tr('allCustomers') },
    { value: 'NEW', label: () => tr('newCustomers') },
    { value: 'EXISTING', label: () => tr('existingCustomers') }
  ];
  const SCOPES = [
    { value: 'ALL', label: () => tr('allProducts') },
    { value: 'CATEGORY', label: () => tr('category') },
    { value: 'PRODUCT', label: () => tr('product') }
  ];
  const ROLES = [
    { value: 'ACCOUNT_OWNER', label: () => tr('accountOwner') },
    { value: 'LEAD_SOURCE', label: () => tr('leadSource') }
  ];

  const activeTab = $derived(data.tab || 'policies');
  let drawerOpen = $state(false);
  let editing = $state(null);
  let deleting = $state(null);
  let saving = $state(false);

  // Form state
  let f = $state(blankPolicy());
  let tiers = $state([]);
  let creditRules = $state([]);

  const creditSplitTotal = $derived(
    creditRules.reduce((sum, rule) => sum + (Number(rule.share_percent) || 0), 0)
  );

  function blankPolicy() {
    return {
      name: '', code: '', scope: 'ALL', product: '', category: '',
      baseType: 'NET', customerScope: 'ALL', rate: 0, useTiers: false,
      minBaseAmount: 0, capAmount: 0, floorAmount: 0,
      excludeNegativeMargin: true, priority: 0, isActive: true,
      effectiveFrom: '', effectiveTo: '', notes: ''
    };
  }

  $effect(() => {
    if (form?.success) {
      toast.success(activeTab === 'policies' ? tr('policyName') : tr('commission'));
      drawerOpen = false;
      deleting = null;
      invalidateAll();
    } else if (form?.error) {
      toast.error(form.error === 'confirmRequired' ? tr('deleteConfirm') : form.error);
    }
  });

  function openCreate() {
    if (!isAdmin) return;
    editing = null;
    f = blankPolicy();
    tiers = [];
    creditRules = [
      { role: 'ACCOUNT_OWNER', share_percent: 100 },
      { role: 'LEAD_SOURCE', share_percent: 0 }
    ];
    drawerOpen = true;
  }

  function openEdit(policy) {
    if (!isAdmin) return;
    editing = policy;
    f = {
      name: policy.name, code: policy.code || '', scope: policy.scope,
      product: policy.product || '', category: policy.category || '',
      baseType: policy.base_type, customerScope: policy.customer_scope,
      rate: Number(policy.rate), useTiers: policy.use_tiers,
      minBaseAmount: Number(policy.min_base_amount), capAmount: Number(policy.cap_amount),
      floorAmount: Number(policy.floor_amount),
      excludeNegativeMargin: policy.exclude_negative_margin,
      priority: policy.priority, isActive: policy.is_active,
      effectiveFrom: policy.effective_from || '', effectiveTo: policy.effective_to || '',
      notes: policy.notes || ''
    };
    tiers = (policy.tiers || []).map((t) => ({
      min_amount: Number(t.min_amount), max_amount: t.max_amount == null ? '' : Number(t.max_amount), rate: Number(t.rate)
    }));
    creditRules = (policy.credit_rules || []).length
      ? policy.credit_rules.map((r) => ({ role: r.role, share_percent: Number(r.share_percent) }))
      : [
          { role: 'ACCOUNT_OWNER', share_percent: 100 },
          { role: 'LEAD_SOURCE', share_percent: 0 }
        ];
    drawerOpen = true;
  }

  function closeDrawer() {
    drawerOpen = false;
  }

  async function switchTab(tab) {
    await goto(`/commission?tab=${tab}`, { replaceState: true, noScroll: true, invalidateAll: true });
  }

  function formField(name, value) {
    return { name, value: value ?? '' };
  }

  function handlePageChange(newPage) {
    goto(`/commission?tab=${activeTab}&page=${newPage}`, { replaceState: true, noScroll: true, invalidateAll: true });
  }

  let currency = $derived(data.summary?.currency || 'USD');
</script>

<svelte:head>
  <title>{tr('commission')} | openCRM</title>
</svelte:head>

<PageHeader title={tr('commission')} subtitle={tr('commissionPolicies')} />

<div class="flex min-h-0 flex-1 flex-col">
  <!-- Tabs -->
  <div class="mb-4 flex gap-1 border-b border-[var(--border-default)]">
    <button
      type="button"
      class="border-b-2 px-4 py-2 text-sm font-medium transition-colors {activeTab === 'policies'
        ? 'border-[var(--color-primary-default)] text-[var(--color-primary-default)]'
        : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}"
      onclick={() => switchTab('policies')}
    >
      {tr('commissionPolicies')}
    </button>
    <button
      type="button"
      class="border-b-2 px-4 py-2 text-sm font-medium transition-colors {activeTab === 'mine'
        ? 'border-[var(--color-primary-default)] text-[var(--color-primary-default)]'
        : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}"
      onclick={() => switchTab('mine')}
    >
      {tr('myCommission')}
    </button>
  </div>

  {#if activeTab === 'policies'}
    <div class="mb-4 flex items-center justify-between">
      <p class="text-sm text-[var(--text-secondary)]">{data.policies.length} {tr('commissionPolicies')}</p>
      {#if isAdmin}
        <Button onclick={openCreate} class="gap-2">
          <Plus class="h-4 w-4" />
          {tr('newPolicy')}
        </Button>
      {/if}
    </div>

    {#if data.policies.length === 0}
      <div class="rounded-lg border border-dashed border-[var(--border-default)] py-16 text-center text-sm text-[var(--text-secondary)]">
        {tr('noPolicies')}
      </div>
    {:else}
      <div class="overflow-hidden rounded-lg border border-[var(--border-default)]">
        <table class="w-full border-collapse text-sm">
          <thead class="bg-[var(--surface-sunken)]">
            <tr>
              <th class="px-4 py-3 text-left font-medium">{tr('policyName')}</th>
              <th class="px-4 py-3 text-left font-medium">{tr('scope')}</th>
              <th class="px-4 py-3 text-left font-medium">{tr('baseType')}</th>
              <th class="px-4 py-3 text-left font-medium">{tr('commissionRate')}</th>
              <th class="px-4 py-3 text-left font-medium">{tr('customerScope')}</th>
              <th class="px-4 py-3 text-left font-medium">{tr('status') || 'Status'}</th>
              <th class="px-4 py-3 text-right font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {#each data.policies as policy (policy.id)}
              <tr class="border-t border-[var(--border-default)]">
                <td class="px-4 py-3">
                  <div class="font-medium text-[var(--text-primary)]">{policy.name}</div>
                  {#if policy.code}<div class="text-xs text-[var(--text-tertiary)]">{policy.code}</div>{/if}
                </td>
                <td class="px-4 py-3">{SCOPES.find((x) => x.value === policy.scope)?.label() || policy.scope}</td>
                <td class="px-4 py-3">{BASE_TYPES.find((x) => x.value === policy.base_type)?.label() || policy.base_type}</td>
                <td class="px-4 py-3">
                  {policy.rate}%{#if policy.use_tiers}<span class="ml-1 text-xs text-[var(--text-tertiary)]">({tr('tiers')})</span>{/if}
                </td>
                <td class="px-4 py-3">{CUSTOMER_SCOPES.find((x) => x.value === policy.customer_scope)?.label() || policy.customer_scope}</td>
                <td class="px-4 py-3">
                  <span class="rounded-full px-2 py-0.5 text-xs {policy.is_active ? 'bg-green-100 text-green-700 dark:bg-green-900/30' : 'bg-gray-100 text-gray-600'}">
                    {policy.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td class="px-4 py-3 text-right">
                  {#if isAdmin}
                    <div class="flex justify-end gap-1">
                      <Button variant="ghost" size="sm" onclick={() => openEdit(policy)}>{tr('edit') || 'Edit'}</Button>
                      <Button variant="ghost" size="sm" onclick={() => (deleting = policy)}>
                        <Trash2 class="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  {/if}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
      {#if data.policiesPagination?.totalPages > 1}
        <div class="mt-4">
          <Pagination
            page={data.policiesPagination.page}
            limit={data.policiesPagination.limit}
            total={data.policiesPagination.total}
            onPageChange={handlePageChange}
          />
        </div>
      {/if}
    {/if}
  {:else}
    <!-- Summary cards -->
    <div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
      <div class="rounded-xl border border-[var(--border-default)] bg-[var(--surface-default)] p-5">
        <p class="text-sm text-[var(--text-secondary)]">{tr('provisional')}</p>
        <p class="mt-2 text-2xl font-bold">{formatCurrency(data.summary?.provisional || 0, currency)}</p>
      </div>
      <div class="rounded-xl border border-[var(--border-default)] bg-[var(--surface-default)] p-5">
        <p class="text-sm text-[var(--text-secondary)]">{tr('earned')}</p>
        <p class="mt-2 text-2xl font-bold">{formatCurrency(data.summary?.earned || 0, currency)}</p>
      </div>
      <div class="rounded-xl border border-[var(--border-default)] bg-[var(--surface-default)] p-5">
        <p class="text-sm text-[var(--text-secondary)]">{tr('totalCommission')}</p>
        <p class="mt-2 text-2xl font-bold text-[var(--color-primary-default)]">{formatCurrency(data.summary?.total || 0, currency)}</p>
      </div>
    </div>

    <div class="mb-4 text-sm text-[var(--text-secondary)]">{tr('myCommission')} · {data.entries.length}</div>
    {#if data.entries.length === 0}
      <div class="rounded-lg border border-dashed border-[var(--border-default)] py-16 text-center text-sm text-[var(--text-secondary)]">
        {tr('noEntries')}
      </div>
    {:else}
      <div class="overflow-hidden rounded-lg border border-[var(--border-default)]">
        <table class="w-full border-collapse text-sm">
          <thead class="bg-[var(--surface-sunken)]">
            <tr>
              <th class="px-4 py-3 text-left font-medium">{tr('invoice')}</th>
              <th class="px-4 py-3 text-left font-medium">{tr('stage')}</th>
              <th class="px-4 py-3 text-left font-medium">{tr('baseType')}</th>
              <th class="px-4 py-3 text-right font-medium">{tr('baseAmount') || 'Base'}</th>
              <th class="px-4 py-3 text-right font-medium">{tr('commissionRate')}</th>
              <th class="px-4 py-3 text-right font-medium">{tr('totalCommission')}</th>
              <th class="px-4 py-3 text-left font-medium">{tr('createdAt') || 'Date'}</th>
            </tr>
          </thead>
          <tbody>
            {#each data.entries as entry (entry.id)}
              <tr class="border-t border-[var(--border-default)]">
                <td class="px-4 py-3 font-medium">{entry.invoice_number}</td>
                <td class="px-4 py-3">
                  <span class="rounded-full px-2 py-0.5 text-xs {entry.stage === 'EARNED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}">
                    {entry.stage === 'EARNED' ? tr('earned') : tr('provisional')}
                  </span>
                </td>
                <td class="px-4 py-3">{entry.policy_name_snapshot}</td>
                <td class="px-4 py-3 text-right">{formatCurrency(entry.base_amount, entry.currency)}</td>
                <td class="px-4 py-3 text-right">{entry.rate}%</td>
                <td class="px-4 py-3 text-right font-medium {entry.amount < 0 ? 'text-red-500' : ''}">
                  {formatCurrency(entry.amount, entry.currency)}
                </td>
                <td class="px-4 py-3">{formatDate(entry.created_at)}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  {/if}
</div>

<!-- Policy editor drawer -->
{#if drawerOpen}
  <div class="fixed inset-0 z-50 flex" role="presentation">
    <button class="absolute inset-0 bg-black/40" aria-label="Close" onclick={closeDrawer}></button>
    <div class="relative ml-auto flex h-full w-full max-w-xl flex-col bg-[var(--surface-default)] shadow-xl">
      <div class="flex items-center justify-between border-b border-[var(--border-default)] px-5 py-4">
        <h2 class="text-lg font-semibold">{editing ? tr('editPolicy') : tr('newPolicy')}</h2>
        <button class="rounded p-1 hover:bg-[var(--surface-sunken)]" onclick={closeDrawer} aria-label="Close">
          <X class="h-5 w-5" />
        </button>
      </div>

      <form
        class="flex min-h-0 flex-1 flex-col"
        method="POST"
        action="?/{editing ? 'update' : 'create'}"
        use:enhance={() => {
          if (creditRules.length && Math.abs(creditSplitTotal - 100) > 0.01) {
            toast.error(tr('creditSplitInvalid', { total: creditSplitTotal }));
            return cancel();
          }
          saving = true;
          return async ({ update }) => {
            await update();
            saving = false;
          };
        }}
      >
        {#if editing}<input type="hidden" name="id" value={editing.id} />{/if}
        <input type="hidden" name="tiers" value={JSON.stringify(tiers)} />
        <input type="hidden" name="creditRules" value={JSON.stringify(creditRules)} />

        <div class="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4">
          <div class="grid grid-cols-2 gap-4">
            <label class="block text-sm">
              <span class="mb-1 block text-[var(--text-secondary)]">{tr('policyName')} *</span>
              <input name="name" bind:value={f.name} required class="w-full rounded-lg border border-[var(--border-default)] bg-transparent px-3 py-2" />
            </label>
            <label class="block text-sm">
              <span class="mb-1 block text-[var(--text-secondary)]">{tr('policyCode')}</span>
              <input name="code" bind:value={f.code} class="w-full rounded-lg border border-[var(--border-default)] bg-transparent px-3 py-2" />
            </label>
          </div>

          <div class="grid grid-cols-3 gap-4">
            <label class="block text-sm">
              <span class="mb-1 block text-[var(--text-secondary)]">{tr('scope')}</span>
              <select name="scope" bind:value={f.scope} class="w-full rounded-lg border border-[var(--border-default)] bg-[var(--surface-default)] px-3 py-2">
                {#each SCOPES as s}<option value={s.value}>{s.label()}</option>{/each}
              </select>
            </label>
            {#if f.scope === 'PRODUCT'}
              <label class="block text-sm">
                <span class="mb-1 block text-[var(--text-secondary)]">{tr('product')}</span>
                <select name="product" bind:value={f.product} class="w-full rounded-lg border border-[var(--border-default)] bg-[var(--surface-default)] px-3 py-2">
                  <option value="">-</option>
                  {#each data.products as p}<option value={p.id}>{p.name}</option>{/each}
                </select>
              </label>
            {:else if f.scope === 'CATEGORY'}
              <label class="block text-sm">
                <span class="mb-1 block text-[var(--text-secondary)]">{tr('category')}</span>
                <input name="category" bind:value={f.category} class="w-full rounded-lg border border-[var(--border-default)] bg-transparent px-3 py-2" />
              </label>
            {/if}
          </div>

          <div class="grid grid-cols-3 gap-4">
            <label class="block text-sm">
              <span class="mb-1 block text-[var(--text-secondary)]">{tr('baseType')}</span>
              <select name="baseType" bind:value={f.baseType} class="w-full rounded-lg border border-[var(--border-default)] bg-[var(--surface-default)] px-3 py-2">
                {#each BASE_TYPES as b}<option value={b.value}>{b.label()}</option>{/each}
              </select>
            </label>
            <label class="block text-sm">
              <span class="mb-1 block text-[var(--text-secondary)]">{tr('customerScope')}</span>
              <select name="customerScope" bind:value={f.customerScope} class="w-full rounded-lg border border-[var(--border-default)] bg-[var(--surface-default)] px-3 py-2">
                {#each CUSTOMER_SCOPES as c}<option value={c.value}>{c.label()}</option>{/each}
              </select>
            </label>
            <label class="block text-sm">
              <span class="mb-1 block text-[var(--text-secondary)]">{tr('commissionRate')} (%)</span>
              <input name="rate" type="number" step="1" min="0" max="99" value={f.rate} oninput={(e) => {
                const v = Math.round(Number(e.currentTarget.value) || 0);
                e.currentTarget.value = String(v);
                f.rate = v;
              }} class="w-full rounded-lg border border-[var(--border-default)] bg-transparent px-3 py-2" />
            </label>
          </div>

          <div class="grid grid-cols-3 gap-4">
            <label class="block text-sm">
              <span class="mb-1 block text-[var(--text-secondary)]">{tr('capAmount')} ({tr('amount')}, 0=∞)</span>
              <input name="capAmount" type="number" step="0.01" min="0" bind:value={f.capAmount} class="w-full rounded-lg border border-[var(--border-default)] bg-transparent px-3 py-2" />
            </label>
            <label class="block text-sm">
              <span class="mb-1 block text-[var(--text-secondary)]">{tr('floorAmount')} ({tr('amount')})</span>
              <input name="floorAmount" type="number" step="0.01" min="0" bind:value={f.floorAmount} class="w-full rounded-lg border border-[var(--border-default)] bg-transparent px-3 py-2" />
            </label>
            <label class="block text-sm">
              <span class="mb-1 block text-[var(--text-secondary)]">{tr('priority')}</span>
              <input name="priority" type="number" bind:value={f.priority} class="w-full rounded-lg border border-[var(--border-default)] bg-transparent px-3 py-2" />
            </label>
          </div>

          <div class="flex flex-wrap gap-5 text-sm">
            <label class="flex items-center gap-2">
              <input name="useTiers" type="checkbox" value="true" checked={f.useTiers} onchange={(e) => (f.useTiers = e.currentTarget.checked)} />
              {tr('useTiers')}
            </label>
            <label class="flex items-center gap-2">
              <input name="excludeNegativeMargin" type="checkbox" value="true" checked={f.excludeNegativeMargin} onchange={(e) => (f.excludeNegativeMargin = e.currentTarget.checked)} />
              {tr('excludeNegativeMargin')}
            </label>
            <label class="flex items-center gap-2">
              <input name="isActive" type="hidden" value="false" />
              <input type="checkbox" checked={f.isActive} onchange={(e) => (f.isActive = e.currentTarget.checked)} />
              {tr('active')}
            </label>
          </div>

          <!-- Tiers editor -->
          <div class="rounded-lg border border-[var(--border-default)] p-3">
            <div class="mb-2 flex items-center justify-between">
              <h3 class="text-sm font-semibold">{tr('tiers')}</h3>
              <Button type="button" variant="ghost" size="sm" onclick={() => (tiers = [...tiers, { min_amount: 0, max_amount: '', rate: 0 }])}>
                <Plus class="mr-1 h-3 w-3" />{tr('tiers')}
              </Button>
            </div>
            {#each tiers as tier, i}
              <div class="mb-2 grid grid-cols-[1fr_1fr_1fr_auto] items-end gap-2">
                <label class="block text-xs"><span class="mb-1 block text-[var(--text-secondary)]">{tr('minAmount')}</span>
                  <input type="number" step="0.01" bind:value={tier.min_amount} oninput={() => (tiers = tiers)} class="w-full rounded border border-[var(--border-default)] bg-transparent px-2 py-1.5" /></label>
                <label class="block text-xs"><span class="mb-1 block text-[var(--text-secondary)]">{tr('maxAmount')}</span>
                  <input type="number" step="0.01" bind:value={tier.max_amount} oninput={() => (tiers = tiers)} class="w-full rounded border border-[var(--border-default)] bg-transparent px-2 py-1.5" /></label>
                <label class="block text-xs"><span class="mb-1 block text-[var(--text-secondary)]">{tr('commissionRate')} (%)</span>
                  <input type="number" step="1" min="0" max="99" value={tier.rate} oninput={(e) => {
                    const v = Math.round(Number(e.currentTarget.value) || 0);
                    e.currentTarget.value = String(v);
                    tier.rate = v;
                    tiers = tiers;
                  }} class="w-full rounded border border-[var(--border-default)] bg-transparent px-2 py-1.5" /></label>
                <button type="button" class="mb-1 rounded p-1.5 hover:bg-[var(--surface-sunken)]" onclick={() => (tiers = tiers.filter((_, idx) => idx !== i))}>
                  <X class="h-4 w-4 text-red-500" />
                </button>
              </div>
            {/each}
          </div>

          <!-- Credit rules editor -->
          <div class="rounded-lg border border-[var(--border-default)] p-3">
            <h3 class="mb-2 text-sm font-semibold">{tr('creditRules')}</h3>
            {#each creditRules as rule}
              <div class="mb-2 grid grid-cols-[1fr_1fr] items-end gap-2">
                <label class="block text-xs"><span class="mb-1 block text-[var(--text-secondary)]">{tr('role')}</span>
                  <select bind:value={rule.role} onchange={() => (creditRules = creditRules)} class="w-full rounded border border-[var(--border-default)] bg-[var(--surface-default)] px-2 py-1.5">
                    {#each ROLES as r}<option value={r.value}>{r.label()}</option>{/each}
                  </select></label>
                <label class="block text-xs"><span class="mb-1 block text-[var(--text-secondary)]">{tr('sharePercent')}</span>
                  <input type="number" step="0.01" min="0" max="100" bind:value={rule.share_percent} oninput={() => (creditRules = creditRules)} class="w-full rounded border border-[var(--border-default)] bg-transparent px-2 py-1.5" /></label>
              </div>
            {/each}
            {#if creditRules.length}
              <div class="mt-1 flex justify-end text-xs">
                <span class={Math.abs(creditSplitTotal - 100) <= 0.01 ? 'text-[var(--color-success-default)]' : 'text-destructive'}>
                  {tr('total')} {creditSplitTotal}%
                </span>
              </div>
            {/if}
          </div>
        </div>

        <div class="flex justify-end gap-2 border-t border-[var(--border-default)] px-5 py-4">
          <Button type="button" variant="outline" onclick={closeDrawer}>Cancel</Button>
          <Button type="submit" disabled={saving}>
            {#if saving}<Loader2 class="mr-2 h-4 w-4 animate-spin" />{/if}
            Save
          </Button>
        </div>
      </form>
    </div>
  </div>
{/if}

<!-- Delete confirmation (required for dangerous operations) -->
{#if deleting}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40" role="presentation">
    <div class="w-full max-w-md rounded-xl bg-[var(--surface-default)] p-6 shadow-xl">
      <h2 class="text-lg font-semibold">{tr('delete') || 'Delete'}</h2>
      <p class="mt-2 text-sm text-[var(--text-secondary)]">{tr('deleteConfirm')}</p>
      <p class="mt-1 text-sm font-medium">{deleting.name}</p>
      <form class="mt-5 flex justify-end gap-2" method="POST" action="?/delete" use:enhance>
        <input type="hidden" name="id" value={deleting.id} />
        <input type="hidden" name="confirm" value="true" />
        <Button type="button" variant="outline" onclick={() => (deleting = null)}>Cancel</Button>
        <Button type="submit" variant="destructive">{tr('delete') || 'Delete'}</Button>
      </form>
    </div>
  </div>
{/if}
