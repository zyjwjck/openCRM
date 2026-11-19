<script>
  import { ChevronDown, X } from '@lucide/svelte';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import { Badge } from '$lib/components/ui/badge/index.js';
  import { cn } from '$lib/utils.js';

  /**
   * Accepts both option shapes used across the app:
   * - { value, label, email? }  (drawer columns, most pages)
   * - { id, name, email? }      (TeamFormDialog)
   * @param {{ value?: string, id?: string, label?: string, name?: string, email?: string }} opt
   */
  function normalizeOption(opt) {
    return {
      value: opt.value ?? opt.id,
      label: opt.label ?? opt.name,
      email: opt.email
    };
  }

  /**
   * @typedef {Object} SelectOption
   * @property {string} [value]
   * @property {string} [id]
   * @property {string} [label]
   * @property {string} [name]
   * @property {string} [email]
   */

  /**
   * @type {{
   *   value?: string[],
   *   options?: SelectOption[],
   *   placeholder?: string,
   *   emptyText?: string,
   *   disabled?: boolean,
   *   onchange?: (value: string[]) => void,
   *   class?: string,
   *   maxDisplay?: number,
   * }}
   */
  let {
    value = [],
    options = [],
    placeholder = 'Select...',
    emptyText = 'None selected',
    disabled = false,
    onchange,
    class: className,
    maxDisplay = 3
  } = $props();

  let isOpen = $state(false);

  /**
   * Toggle an option
   * @param {string} id
   */
  function toggleOption(id) {
    const newValue = value.includes(id) ? value.filter((v) => v !== id) : [...value, id];
    onchange?.(newValue);
  }

  /**
   * Remove an option
   * @param {Event} e
   * @param {string} id
   */
  function removeOption(e, id) {
    e.stopPropagation();
    const newValue = value.filter((v) => v !== id);
    onchange?.(newValue);
  }

  /**
   * Get selected options
   */
  const normalizedOptions = $derived(options.map(normalizeOption));
  const selectedOptions = $derived(normalizedOptions.filter((opt) => value.includes(opt.value)));

  /**
   * Get display options (limited to maxDisplay)
   */
  const displayOptions = $derived(selectedOptions.slice(0, maxDisplay));

  /**
   * Get remaining count
   */
  const remainingCount = $derived(
    selectedOptions.length > maxDisplay ? selectedOptions.length - maxDisplay : 0
  );
</script>

<div class={cn('group', className)}>
  <DropdownMenu.Root bind:open={isOpen}>
    <DropdownMenu.Trigger {disabled} class="w-full">
      {#snippet child({ props })}
        <!-- Single button: nested <button> inside a trigger would break HTML parsing
             and leave the visible button without any click handler. -->
        <button
          {...props}
          type="button"
          class={cn(
            'flex min-h-[36px] w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors',
            !disabled && 'hover:bg-muted/50 cursor-pointer',
            disabled && 'cursor-default opacity-50'
          )}
        >
          <div class="flex flex-1 flex-wrap items-center gap-1.5">
            {#if selectedOptions.length === 0}
              <span class="text-muted-foreground italic">{emptyText}</span>
            {:else}
              {#each displayOptions as opt (opt.value)}
                <Badge variant="secondary" class="gap-1 pr-1">
                  <span class="max-w-[120px] truncate">{opt.label}</span>
                  {#if !disabled}
                    <span
                      role="button"
                      tabindex="-1"
                      class="hover:bg-muted rounded-sm p-0.5"
                      onclick={(e) => removeOption(e, opt.value)}
                      onkeydown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.stopPropagation();
                          e.preventDefault();
                          removeOption(e, opt.value);
                        }
                      }}
                    >
                      <X class="h-3 w-3" />
                    </span>
                  {/if}
                </Badge>
              {/each}
              {#if remainingCount > 0}
                <Badge variant="outline" class="text-xs">+{remainingCount}</Badge>
              {/if}
            {/if}
          </div>
          <ChevronDown
            class={cn(
              'text-muted-foreground h-4 w-4 shrink-0 transition-transform',
              isOpen && 'rotate-180'
            )}
          />
        </button>
      {/snippet}
    </DropdownMenu.Trigger>
    <DropdownMenu.Content class="max-h-64 w-64 overflow-y-auto" align="start">
      {#if normalizedOptions.length === 0}
        <div class="text-muted-foreground px-2 py-4 text-center text-sm">{emptyText}</div>
      {:else}
        <!-- No CheckboxGroup wrapper: its bindable `value` must be provided or Svelte
             throws props_invalid_value, which kills the whole menu content render. -->
        {#each normalizedOptions as opt (opt.value)}
          <DropdownMenu.CheckboxItem
            checked={value.includes(opt.value)}
            onCheckedChange={() => toggleOption(opt.value)}
            class=""
          >
            <div class="flex flex-col">
              <span>{opt.label}</span>
              {#if opt.email}
                <span class="text-muted-foreground text-xs">{opt.email}</span>
              {/if}
            </div>
          </DropdownMenu.CheckboxItem>
        {/each}
      {/if}
    </DropdownMenu.Content>
  </DropdownMenu.Root>
</div>
