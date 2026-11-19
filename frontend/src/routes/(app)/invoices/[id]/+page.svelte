<script>
  import { goto, invalidateAll } from '$app/navigation';
  import { enhance } from '$app/forms';
  import { tick } from 'svelte';
  import { toast } from 'svelte-sonner';

  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Textarea } from '$lib/components/ui/textarea';
  import * as Select from '$lib/components/ui/select';
  import * as AlertDialog from '$lib/components/ui/alert-dialog';
  import * as Tabs from '$lib/components/ui/tabs';
  import { Separator } from '$lib/components/ui/separator';
  import { Badge } from '$lib/components/ui/badge';
  import { InvoiceViewPage } from '$lib/components/invoices';
  import { formatCurrency, formatDate } from '$lib/utils/formatting.js';
  import { CURRENCY_CODES } from '$lib/constants/filters.js';
  import { orgSettings } from '$lib/stores/org.js';
  import { t } from '$lib/utils/i18n.svelte.js';
  import {
    ArrowLeft,
    Plus,
    Trash2,
    Ban,
    Send,
    Save,
    Eye,
    FileText,
    Building2,
    User,
    Download,
    MoreHorizontal,
    CheckCircle,
    Clock,
    DollarSign,
    Pencil,
    Printer
  } from '@lucide/svelte';

  /** @type {{ data: import('./$types').PageData }} */
  let { data } = $props();

  // Currency options
  const currencyOptions = CURRENCY_CODES.filter((c) => c.value);

  // Payment terms options
  const PAYMENT_TERMS = [
    { value: 'DUE_ON_RECEIPT', label: t('due_on_receipt') },
    { value: 'NET_15', label: t('net_15') },
    { value: 'NET_30', label: t('net_30') },
    { value: 'NET_45', label: t('net_45') },
    { value: 'NET_60', label: t('net_60') },
    { value: 'CUSTOM', label: t('custom') }
  ];

  // Status colors - using design system tokens
  const STATUS_COLORS = {
    Draft: 'bg-[var(--surface-sunken)] text-[var(--text-secondary)]',
    Sent: 'bg-[var(--stage-contacted-bg)] text-[var(--stage-contacted)] dark:bg-[var(--stage-contacted)]/15',
    Viewed: 'bg-[var(--stage-qualified-bg)] text-[var(--stage-qualified)] dark:bg-[var(--stage-qualified)]/15',
    Partially_Paid: 'bg-[var(--stage-negotiation-bg)] text-[var(--stage-negotiation)] dark:bg-[var(--stage-negotiation)]/15',
    Paid: 'bg-[var(--color-success-light)] text-[var(--color-success-default)] dark:bg-[var(--color-success-default)]/15',
    Overdue: 'bg-[var(--color-negative-light)] text-[var(--color-negative-default)] dark:bg-[var(--color-negative-default)]/15',
    Pending: 'bg-[var(--color-primary-light)] text-[var(--color-primary-default)] dark:bg-[var(--color-primary-default)]/15',
    Cancelled: 'bg-[var(--surface-sunken)] text-[var(--text-tertiary)]'
  };

  // Status options for dropdown
  const INVOICE_STATUS_OPTIONS = [
    { value: 'Draft', label: t('draft') },
    { value: 'Sent', label: t('sent') },
    { value: 'Viewed', label: t('viewed') },
    { value: 'Paid', label: t('paid') },
    { value: 'Partially_Paid', label: t('partially_paid') },
    { value: 'Overdue', label: t('overdue') },
    { value: 'Pending', label: t('pending') },
    { value: 'Cancelled', label: t('cancelled') }
  ];

  // Form state - synced from data via $effect
  /** @type {Partial<typeof data.invoice> & Record<string, any>} */
  let invoice = $state({});
  /** @type {Array<{id: string, name: string, description: string, quantity: number, rate: number, amount: number}>} */
  let lineItems = $state([]);
  // Track synced invoice ID to detect data changes
  let syncedInvoiceId = $state('');

  // Company profile for invoice view
  const company = $derived(data.company || {});

  // Template for styling
  const template = $derived(data.template || {});

  // Current tab (view or edit)
  let currentTab = $state('view');

  // Edit mode (for legacy compatibility)
  let isEditing = $derived(currentTab === 'edit');

  // Form refs
  let updateForm;
  let cancelForm;
  let sendForm;
  let markPaidForm;
  let pdfForm;
  let isSaving = $state(false);
  let isDownloadingPdf = $state(false);
  let cancelDialogOpen = $state(false);

  // Derived values
  const accounts = $derived(data.accounts || []);
  const contacts = $derived(data.contacts || []);

  // Calculate totals
  const subtotal = $derived(lineItems.reduce((sum, item) => sum + item.quantity * item.rate, 0));
  let taxRate = $state(0);
  const taxAmount = $derived(subtotal * (taxRate / 100));
  const total = $derived(subtotal + taxAmount);

  // Sync form state when data changes (navigation or after invalidateAll)
  $effect(() => {
    if (data.invoice.id !== syncedInvoiceId) {
      syncedInvoiceId = data.invoice.id;
      invoice = { ...data.invoice };
      lineItems =
        data.invoice.lineItems?.length > 0
          ? [...data.invoice.lineItems]
          : [
              {
                id: crypto.randomUUID(),
                name: '',
                description: '',
                quantity: 1,
                rate: 0,
                amount: 0
              }
            ];
      taxRate = parseFloat(data.invoice.taxRate) || 0;
    }
  });

  // Update line item amount
  function updateLineItemAmount(index) {
    lineItems[index].amount = lineItems[index].quantity * lineItems[index].rate;
  }

  // Add new line item
  function addLineItem() {
    lineItems = [
      ...lineItems,
      { id: crypto.randomUUID(), name: '', description: '', quantity: 1, rate: 0, amount: 0 }
    ];
  }

  // Remove line item
  function removeLineItem(index) {
    if (lineItems.length > 1) {
      lineItems = lineItems.filter((_, i) => i !== index);
    }
  }

  // Handle contact selection
  function handleContactChange(contactId) {
    invoice.contactId = contactId;
    const contact = contacts.find((c) => c.id === contactId);
    if (contact) {
      invoice.clientEmail = contact.email || invoice.clientEmail;
      invoice.clientPhone = contact.phone || invoice.clientPhone;
    }
  }

  // Validate line items - at least one with name/description and rate > 0
  function hasValidLineItems() {
    return lineItems.some((item) => (item.name || item.description) && item.rate > 0);
  }

  // Save changes
  async function saveChanges() {
    if (!hasValidLineItems()) {
      toast.error(t('please_add_line_item'));
      return;
    }
    isSaving = true;
    await tick();
    updateForm.requestSubmit();
  }

  // Cancel editing
  function cancelEdit() {
    invoice = { ...data.invoice };
    lineItems =
      data.invoice.lineItems?.length > 0
        ? [...data.invoice.lineItems]
        : [{ id: crypto.randomUUID(), name: '', description: '', quantity: 1, rate: 0, amount: 0 }];
    taxRate = parseFloat(data.invoice.taxRate) || 0;
    currentTab = 'view';
  }

  // Print invoice
  function printInvoice() {
    window.print();
  }

  // Send invoice
  async function handleSend() {
    isSaving = true;
    await tick();
    sendForm.requestSubmit();
  }

  // Download PDF via server action
  async function downloadPDF() {
    isDownloadingPdf = true;
    await tick();
    pdfForm.requestSubmit();
  }

  // Handle PDF download result - convert base64 to blob and download
  function handlePdfDownload(base64Pdf, filename) {
    const byteCharacters = atob(base64Pdf);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `${invoice.invoiceNumber}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

  // Go back
  function goBack() {
    goto('/invoices');
  }

  // Change invoice status
  async function handleStatusChange(newStatus) {
    invoice.status = newStatus;
    isSaving = true;
    await tick();
    updateForm.requestSubmit();
  }
</script>

<svelte:head>
  <title>{t('invoice')} {invoice.invoiceNumber} | openCRM</title>
</svelte:head>

<!-- Hidden Forms -->
<form
  bind:this={updateForm}
  method="POST"
  action="?/update"
  class="hidden"
  use:enhance={() => {
    return async ({ result }) => {
      isSaving = false;
      if (result.type === 'success') {
        toast.success(t('invoice_updated'));
        currentTab = 'view';
        invalidateAll();
      } else if (result.type === 'failure') {
        toast.error(/** @type {string} */ (result.data?.error) || t('failed_to_update_invoice'));
      }
    };
  }}
>
  <input type="hidden" name="invoiceTitle" value={invoice.invoiceTitle} />
  <input type="hidden" name="status" value={invoice.status} />
  <input type="hidden" name="accountId" value={invoice.accountId} />
  <input type="hidden" name="contactId" value={invoice.contactId} />
  <input type="hidden" name="currency" value={invoice.currency} />
  <input type="hidden" name="paymentTerms" value={invoice.paymentTerms} />
  <input type="hidden" name="issueDate" value={invoice.issueDate} />
  <input type="hidden" name="dueDate" value={invoice.dueDate} />
  <input type="hidden" name="clientName" value={invoice.clientName} />
  <input type="hidden" name="clientEmail" value={invoice.clientEmail} />
  <input type="hidden" name="clientPhone" value={invoice.clientPhone} />
  <input type="hidden" name="clientAddressLine" value={invoice.clientAddressLine} />
  <input type="hidden" name="clientCity" value={invoice.clientCity} />
  <input type="hidden" name="clientState" value={invoice.clientState} />
  <input type="hidden" name="clientPostcode" value={invoice.clientPostcode} />
  <input type="hidden" name="clientCountry" value={invoice.clientCountry} />
  <input type="hidden" name="taxRate" value={taxRate} />
  <input type="hidden" name="notes" value={invoice.notes} />
  <input type="hidden" name="terms" value={invoice.terms} />
  <input type="hidden" name="billingPeriod" value={invoice.billingPeriod} />
  <input type="hidden" name="poNumber" value={invoice.poNumber} />
  <input
    type="hidden"
    name="lineItems"
    value={JSON.stringify(
      lineItems.filter((item) => item.name || item.description || item.rate > 0)
    )}
  />
</form>

<form
  bind:this={cancelForm}
  method="POST"
  action="?/cancel"
  class="hidden"
  use:enhance={() => {
    return async ({ result }) => {
      if (result.type === 'redirect') {
        toast.success(t('invoice_cancelled'));
      } else if (result.type === 'failure') {
        toast.error(/** @type {string} */ (result.data?.error) || t('failed_to_cancel_invoice'));
      }
    };
  }}
></form>

<form
  bind:this={sendForm}
  method="POST"
  action="?/send"
  class="hidden"
  use:enhance={() => {
    return async ({ result }) => {
      isSaving = false;
      if (result.type === 'success') {
        toast.success(t('invoice_sent'));
        invalidateAll();
      } else if (result.type === 'failure') {
        toast.error(/** @type {string} */ (result.data?.error) || t('failed_to_send_invoice'));
      }
    };
  }}
></form>

<form
  bind:this={pdfForm}
  method="POST"
  action="?/downloadPdf"
  class="hidden"
  use:enhance={() => {
    return async ({ result }) => {
      isDownloadingPdf = false;
      if (result.type === 'success' && result.data?.pdf) {
        handlePdfDownload(result.data.pdf, result.data.filename);
        toast.success(t('pdf_downloaded'));
      } else if (result.type === 'failure') {
        toast.error(/** @type {string} */ (result.data?.error) || t('failed_to_download_pdf'));
      }
    };
  }}
></form>

<div class="bg-muted/30 min-h-screen print:bg-white">
  <!-- Header (hidden when printing) -->
  <div class="bg-background sticky top-0 z-10 border-b print:hidden">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
      <div class="flex items-center gap-4">
        <Button variant="ghost" size="icon" onclick={goBack}>
          <ArrowLeft class="size-5" />
        </Button>
        <div>
          <div class="flex items-center gap-3">
            <h1 class="text-xl font-semibold">{invoice.invoiceNumber || t('invoice')}</h1>
            <Select.Root type="single" value={invoice.status} onValueChange={handleStatusChange}>
              <Select.Trigger
                class="h-7 w-auto gap-1 border-0 px-2 text-xs font-medium {STATUS_COLORS[
                  invoice.status
                ] || STATUS_COLORS.Draft}"
              >
                {INVOICE_STATUS_OPTIONS.find(s => s.value === invoice.status)?.label || t('draft')}
              </Select.Trigger>
              <Select.Content>
                {#each INVOICE_STATUS_OPTIONS as option}
                  <Select.Item value={option.value}>
                    <span class="flex items-center gap-2">
                      <span class="size-2 rounded-full {STATUS_COLORS[option.value]?.split(' ')[0]}"
                      ></span>
                      {option.label}
                    </span>
                  </Select.Item>
                {/each}
              </Select.Content>
            </Select.Root>
          </div>
          <p class="text-muted-foreground text-sm">{invoice.clientName || t('no_client_name')}</p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        {#if isEditing}
          <Button variant="outline" onclick={cancelEdit} disabled={isSaving}>{t('cancel')}</Button>
          <Button onclick={saveChanges} disabled={isSaving}>
            <Save class="mr-2 size-4" />
            {t('saveChanges')}
          </Button>
        {:else}
          <Button variant="outline" onclick={printInvoice}>
            <Printer class="mr-2 size-4" />
            {t('print')}
          </Button>
          <Button variant="outline" onclick={downloadPDF} disabled={isDownloadingPdf}>
            <Download class="mr-2 size-4" />
            {isDownloadingPdf ? t('downloading') : 'PDF'}
          </Button>
          {#if invoice.status === 'Draft'}
            <Button variant="outline" onclick={handleSend} disabled={isSaving}>
              <Send class="mr-2 size-4" />
              {t('send')}
            </Button>
          {/if}
          <Button onclick={() => (currentTab = 'edit')}>
            <Pencil class="mr-2 size-4" />
            {t('edit')}
          </Button>
          {#if invoice.status !== 'Cancelled' && invoice.status !== 'Paid'}
            <AlertDialog.Root bind:open={cancelDialogOpen}>
              <AlertDialog.Trigger>
                {#snippet child({ props })}
                  <Button
                    {...props}
                    variant="outline"
                    size="icon"
                    class="text-destructive"
                    title={t('cancelInvoice')}
                  >
                    <Ban class="size-4" />
                  </Button>
                {/snippet}
              </AlertDialog.Trigger>
              <AlertDialog.Content>
                <AlertDialog.Header>
                  <AlertDialog.Title>{t('cancelInvoice')}</AlertDialog.Title>
                  <AlertDialog.Description>
                    {t('cancelInvoiceDescription', { invoiceNumber: invoice.invoiceNumber })}
                  </AlertDialog.Description>
                </AlertDialog.Header>
                <AlertDialog.Footer>
                  <AlertDialog.Cancel>{t('keepInvoice')}</AlertDialog.Cancel>
                  <Button
                    variant="destructive"
                    onclick={() => {
                      cancelDialogOpen = false;
                      cancelForm.requestSubmit();
                    }}
                  >
                    {t('cancelInvoice')}
                  </Button>
                </AlertDialog.Footer>
              </AlertDialog.Content>
            </AlertDialog.Root>
          {/if}
        {/if}
      </div>
    </div>
  </div>

  <!-- Invoice Content -->
  <div class="mx-auto max-w-6xl px-6 py-8 print:max-w-none print:px-0 print:py-0">
    {#if currentTab === 'view'}
      <!-- Professional Invoice View -->
      <InvoiceViewPage invoice={data.invoice} {company} {template} />
    {:else}
      <!-- Edit Mode -->
      <div class="bg-background rounded-lg border shadow-sm print:hidden">
        <!-- Invoice Header -->
        <div class="border-b p-6">
          <div class="flex items-start justify-between">
            <div class="space-y-4">
              <div class="text-primary flex items-center gap-2 text-2xl font-bold">
                <FileText class="size-8" />
                <span>{t('invoice')}</span>
              </div>
              <div class="space-y-2">
                <div class="flex items-center gap-2">
                  <Label class="text-muted-foreground w-24">{t('invoice_number')}</Label>
                  <span class="font-medium">{invoice.invoiceNumber}</span>
                </div>
                {#if isEditing}
                  <div class="flex items-center gap-2">
                    <Label class="text-muted-foreground w-24">{t('title')}</Label>
                    <Input
                      bind:value={invoice.invoiceTitle}
                      placeholder={t('invoice_title_placeholder')}
                      class="max-w-xs"
                    />
                  </div>
                  <div class="flex items-center gap-2">
                    <Label class="text-muted-foreground w-24">{t('po_number')}</Label>
                    <Input
                      bind:value={invoice.poNumber}
                      placeholder={t('po_placeholder')}
                      class="max-w-xs"
                    />
                  </div>
                  <div class="flex items-center gap-2">
                    <Label class="text-muted-foreground w-24">{t('billing_period')}</Label>
                    <Input
                      bind:value={invoice.billingPeriod}
                      placeholder={t('billing_period_placeholder')}
                      class="max-w-xs"
                    />
                  </div>
                {:else if invoice.invoiceTitle || invoice.poNumber || invoice.billingPeriod}
                  {#if invoice.invoiceTitle}
                    <div class="flex items-center gap-2">
                      <Label class="text-muted-foreground w-24">{t('title')}</Label>
                      <span>{invoice.invoiceTitle}</span>
                    </div>
                  {/if}
                  {#if invoice.poNumber}
                    <div class="flex items-center gap-2">
                      <Label class="text-muted-foreground w-24">{t('po_number')}</Label>
                      <span>{invoice.poNumber}</span>
                    </div>
                  {/if}
                  {#if invoice.billingPeriod}
                    <div class="flex items-center gap-2">
                      <Label class="text-muted-foreground w-24">{t('billing_period')}</Label>
                      <span>{invoice.billingPeriod}</span>
                    </div>
                  {/if}
                {/if}
              </div>
            </div>

            <!-- Dates -->
            <div class="space-y-3 text-right">
              {#if isEditing}
                <div class="flex items-center justify-end gap-2">
                  <Label class="text-muted-foreground">{t('currency')}</Label>
                  <Select.Root
                    type="single"
                    value={invoice.currency}
                    onValueChange={(v) => (invoice.currency = v)}
                  >
                    <Select.Trigger class="w-40">
                      {currencyOptions.find((c) => c.value === invoice.currency)?.label || t('select')}
                    </Select.Trigger>
                    <Select.Content>
                      {#each currencyOptions as option}
                        <Select.Item value={option.value}>{option.label}</Select.Item>
                      {/each}
                    </Select.Content>
                  </Select.Root>
                </div>
                <div class="flex items-center justify-end gap-2">
                  <Label class="text-muted-foreground">{t('issue_date')}</Label>
                  <Input type="date" bind:value={invoice.issueDate} class="w-40" />
                </div>
                <div class="flex items-center justify-end gap-2">
                  <Label class="text-muted-foreground">{t('due_date')}</Label>
                  <Input type="date" bind:value={invoice.dueDate} class="w-40" />
                </div>
              {:else}
                <div class="flex items-center justify-end gap-2 text-sm">
                  <span class="text-muted-foreground">{t('issue_date')}:</span>
                  <span class="font-medium">{formatDate(invoice.issueDate)}</span>
                </div>
                <div class="flex items-center justify-end gap-2 text-sm">
                  <span class="text-muted-foreground">{t('due_date')}:</span>
                  <span class="font-medium">{formatDate(invoice.dueDate)}</span>
                </div>
                <div class="flex items-center justify-end gap-2 text-sm">
                  <span class="text-muted-foreground">{t('currency')}:</span>
                  <span class="font-medium">{invoice.currency}</span>
                </div>
              {/if}
            </div>
          </div>
        </div>

        <!-- From / To Section -->
        <div class="grid grid-cols-2 gap-8 border-b p-6">
          <!-- Bill From -->
          <div class="space-y-3">
            <div class="flex items-center gap-2 font-medium">
              <Building2 class="text-muted-foreground size-4" />
              <span>{t('bill_from')}</span>
            </div>
            {#if isEditing}
              <Select.Root
                type="single"
                value={invoice.accountId}
                onValueChange={(v) => (invoice.accountId = v)}
              >
                <Select.Trigger class="w-full">
                  {accounts.find((a) => a.id === invoice.accountId)?.name || t('select_account')}
                </Select.Trigger>
                <Select.Content>
                  {#each accounts as account}
                    <Select.Item value={account.id}>{account.name}</Select.Item>
                  {/each}
                </Select.Content>
              </Select.Root>
            {:else}
              <p class="font-medium">
                {accounts.find((a) => a.id === invoice.accountId)?.name || t('no_account')}
              </p>
            {/if}
          </div>

          <!-- Bill To -->
          <div class="space-y-3">
            <div class="flex items-center gap-2 font-medium">
              <User class="text-muted-foreground size-4" />
              <span>{t('bill_to')}</span>
            </div>
            {#if isEditing}
              <Select.Root
                type="single"
                value={invoice.contactId}
                onValueChange={handleContactChange}
              >
                <Select.Trigger class="w-full">
                  {contacts.find((c) => c.id === invoice.contactId)?.name || t('select_contact')}
                </Select.Trigger>
                <Select.Content>
                  {#each contacts as contact}
                    <Select.Item value={contact.id}>{contact.name}</Select.Item>
                  {/each}
                </Select.Content>
              </Select.Root>
              <div class="space-y-2">
                <Input bind:value={invoice.clientName} placeholder={t('client_name')} />
                <Input bind:value={invoice.clientEmail} placeholder={t('email')} type="email" />
                <Input bind:value={invoice.clientPhone} placeholder={t('phone')} />
              </div>
            {:else}
              <div class="space-y-1">
                <p class="font-medium">{invoice.clientName || t('no_name')}</p>
                {#if invoice.clientEmail}
                  <p class="text-muted-foreground text-sm">{invoice.clientEmail}</p>
                {/if}
                {#if invoice.clientPhone}
                  <p class="text-muted-foreground text-sm">{invoice.clientPhone}</p>
                {/if}
              </div>
            {/if}
          </div>
        </div>

        <!-- Line Items -->
        <div class="p-6">
          <h3 class="mb-4 font-medium">{t('line_items')}</h3>
          <div class="rounded-md border">
            <div
              class="bg-muted/50 text-muted-foreground grid grid-cols-12 gap-4 border-b px-4 py-3 text-sm font-medium"
            >
              <div class="col-span-5">{t('description')}</div>
              <div class="col-span-2 text-right">{t('quantity')}</div>
              <div class="col-span-2 text-right">{t('rate')}</div>
              <div class="col-span-2 text-right">{t('amount')}</div>
              {#if isEditing}<div class="col-span-1"></div>{/if}
            </div>

            {#each lineItems as item, index (item.id)}
              <div class="grid grid-cols-12 items-start gap-4 border-b px-4 py-3 last:border-b-0">
                <div class="col-span-5">
                  {#if isEditing}
                    <div class="space-y-2">
                      <Input
                        bind:value={item.name}
                        placeholder={t('item_name')}
                        class="border-0 bg-transparent px-0 font-medium focus-visible:ring-0"
                      />
                      <Input
                        bind:value={item.description}
                        placeholder={t('item_description_placeholder')}
                        class="text-muted-foreground border-0 bg-transparent px-0 text-xs focus-visible:ring-0"
                      />
                    </div>
                  {:else}
                    <div>
                      {#if item.name}
                        <span class="font-medium">{item.name}</span>
                        {#if item.description}
                          <span class="text-muted-foreground block text-xs">{item.description}</span
                          >
                        {/if}
                      {:else}
                        <span>{item.description || '-'}</span>
                      {/if}
                    </div>
                  {/if}
                </div>
                <div class="col-span-2 text-right">
                  {#if isEditing}
                    <Input
                      type="number"
                      bind:value={item.quantity}
                      min="0"
                      class="border-0 bg-transparent px-0 text-right focus-visible:ring-0"
                      oninput={() => updateLineItemAmount(index)}
                    />
                  {:else}
                    {item.quantity}
                  {/if}
                </div>
                <div class="col-span-2 text-right">
                  {#if isEditing}
                    <Input
                      type="number"
                      bind:value={item.rate}
                      min="0"
                      step="0.01"
                      class="border-0 bg-transparent px-0 text-right focus-visible:ring-0"
                      oninput={() => updateLineItemAmount(index)}
                    />
                  {:else}
                    {formatCurrency(item.rate, invoice.currency)}
                  {/if}
                </div>
                <div class="col-span-2 text-right font-medium">
                  {formatCurrency(item.quantity * item.rate, invoice.currency)}
                </div>
                {#if isEditing}
                  <div class="col-span-1 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      class="text-muted-foreground hover:text-destructive size-8"
                      onclick={() => removeLineItem(index)}
                      disabled={lineItems.length === 1}
                    >
                      <Trash2 class="size-4" />
                    </Button>
                  </div>
                {/if}
              </div>
            {/each}

            {#if isEditing}
              <div class="px-4 py-3">
                <Button variant="ghost" size="sm" onclick={addLineItem} class="text-primary">
                  <Plus class="mr-2 size-4" />
                  {t('add_line_item')}
                </Button>
              </div>
            {/if}
          </div>
        </div>

        <!-- Totals -->
        <div class="flex justify-end border-t p-6">
          <div class="w-80 space-y-3">
            <div class="flex justify-between text-sm">
              <span class="text-muted-foreground">{t('subtotal')}</span>
              <span class="font-medium">{formatCurrency(subtotal, invoice.currency)}</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <div class="flex items-center gap-2">
                <span class="text-muted-foreground">{t('tax')}</span>
                {#if isEditing}
                  <Input
                    type="number"
                    bind:value={taxRate}
                    min="0"
                    max="100"
                    step="0.1"
                    class="h-7 w-16 text-right text-xs"
                  />
                  <span class="text-muted-foreground">%</span>
                {:else}
                  <span class="text-muted-foreground">({taxRate}%)</span>
                {/if}
              </div>
              <span class="font-medium">{formatCurrency(taxAmount, invoice.currency)}</span>
            </div>
            <Separator />
            <div class="flex justify-between text-lg font-semibold">
              <span>{t('total')}</span>
              <span class="text-primary">{formatCurrency(total, invoice.currency)}</span>
            </div>
            {#if Number(invoice.amountPaid) > 0}
              <div class="flex justify-between text-sm text-green-600">
                <span>{t('amount_paid')}</span>
                <span>-{formatCurrency(Number(invoice.amountPaid), invoice.currency)}</span>
              </div>
              <div class="flex justify-between font-medium">
                <span>{t('amount_due')}</span>
                <span class="text-[var(--color-primary-default)]"
                  >{formatCurrency(Number(invoice.amountDue), invoice.currency)}</span
                >
              </div>
            {/if}
          </div>
        </div>

        <!-- Notes & Terms -->
        <div class="grid grid-cols-2 gap-8 border-t p-6">
          <div class="space-y-2">
            <Label class="text-sm font-medium">{t('notes')}</Label>
            <Textarea
              bind:value={invoice.notes}
              placeholder={t('notes_placeholder')}
              rows={4}
            />
          </div>
          <div class="space-y-2">
            <Label class="text-sm font-medium">{t('terms_conditions')}</Label>
            <Textarea bind:value={invoice.terms} placeholder={t('payment_terms_placeholder')} rows={4} />
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>
