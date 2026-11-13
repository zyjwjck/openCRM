<script>
  import { CalendarDays, ChevronDown, X, Clock, ArrowRight } from '@lucide/svelte';
  import { cn } from '$lib/utils.js';
  import * as Popover from '$lib/components/ui/popover/index.js';
  import Calendar from '$lib/components/ui/calendar/Calendar.svelte';
  import { Button } from '$lib/components/ui/button/index.js';
  import { today, getLocalTimeZone, parseDate } from '@internationalized/date';
  import { formatDate as formatLocalizedDate } from '$lib/utils/formatting.js';
  import { useI18n } from '$lib/utils/i18n.svelte.js';

  const i18n = useI18n();
  const tr = i18n.t;

  /**
   * @type {{
   *   startDate?: string,
   *   endDate?: string,
   *   label?: string,
   *   placeholder?: string,
   *   class?: string,
   *   onchange?: (startDate: string, endDate: string) => void,
   * }}
   */
  let {
    startDate = $bindable(''),
    endDate = $bindable(''),
    label = '',
    placeholder = tr('selectDates'),
    class: className,
    onchange
  } = $props();

  let open = $state(false);
  let selectingEnd = $state(false);

  const todayDate = today(getLocalTimeZone());

  // Convert string dates to DateValue for calendar
  const startDateValue = $derived(startDate ? parseDate(startDate) : undefined);
  const endDateValue = $derived(endDate ? parseDate(endDate) : undefined);

  /** @type {{ labelKey: string, shortLabel: string, getRange: () => { start: string, end: string } }[]} */
  const presets = [
    {
      labelKey: 'today',
      shortLabel: '1d',
      getRange: () => {
        const d = todayDate.toString();
        return { start: d, end: d };
      }
    },
    {
      labelKey: 'last7Days',
      shortLabel: '7d',
      getRange: () => ({
        start: todayDate.subtract({ days: 7 }).toString(),
        end: todayDate.toString()
      })
    },
    {
      labelKey: 'last30Days',
      shortLabel: '30d',
      getRange: () => ({
        start: todayDate.subtract({ days: 30 }).toString(),
        end: todayDate.toString()
      })
    },
    {
      labelKey: 'thisMonth',
      shortLabel: 'M',
      getRange: () => ({
        start: todayDate.set({ day: 1 }).toString(),
        end: todayDate.toString()
      })
    },
    {
      labelKey: 'lastMonth',
      shortLabel: 'Prev',
      getRange: () => {
        const lastMonth = todayDate.subtract({ months: 1 });
        const lastDayOfLastMonth = lastMonth
          .set({ day: 1 })
          .add({ months: 1 })
          .subtract({ days: 1 });
        return {
          start: lastMonth.set({ day: 1 }).toString(),
          end: lastDayOfLastMonth.toString()
        };
      }
    },
    {
      labelKey: 'last90Days',
      shortLabel: '90d',
      getRange: () => ({
        start: todayDate.subtract({ days: 90 }).toString(),
        end: todayDate.toString()
      })
    }
  ];

  const displayText = $derived.by(() => {
    if (!startDate && !endDate) return placeholder;
    if (startDate && endDate) {
      if (startDate === endDate) return formatLocalizedDate(startDate, undefined, i18n.lang);
      return `${formatDateShort(startDate)} - ${formatDateShort(endDate)}`;
    }
    if (startDate) return tr('fromDate', { date: formatDateShort(startDate) });
    return tr('untilDate', { date: formatDateShort(endDate) });
  });

  /**
   * @param {string} dateStr
   */
  function formatDateShort(dateStr) {
    if (!dateStr) return '';
    const isZh = String(i18n.lang).toLowerCase().startsWith('zh');
    return formatLocalizedDate(dateStr, isZh ? 'M月d日' : 'MMM d', i18n.lang);
  }

  /**
   * @param {{ labelKey: string, shortLabel: string, getRange: () => { start: string, end: string } }} preset
   */
  function handlePreset(preset) {
    const { start, end } = preset.getRange();
    startDate = start;
    endDate = end;
    onchange?.(start, end);
    open = false;
  }

  /**
   * @param {import('@internationalized/date').DateValue | undefined} dateValue
   */
  function handleDateSelect(dateValue) {
    if (!dateValue) return;
    const dateStr = dateValue.toString();

    if (!selectingEnd) {
      startDate = dateStr;
      endDate = '';
      selectingEnd = true;
    } else {
      // Ensure end is after start
      if (dateStr < startDate) {
        endDate = startDate;
        startDate = dateStr;
      } else {
        endDate = dateStr;
      }
      selectingEnd = false;
      onchange?.(startDate, endDate);
      open = false;
    }
  }

  function handleClear() {
    startDate = '';
    endDate = '';
    selectingEnd = false;
    onchange?.('', '');
  }

  const hasValue = $derived(!!startDate || !!endDate);
</script>

<div class={cn('flex flex-col gap-1.5', className)}>
  {#if label}
    <span class="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
      {label}
    </span>
  {/if}
  <Popover.Root
    bind:open
    onOpenChange={(o) => {
      if (!o) selectingEnd = false;
    }}
  >
    <Popover.Trigger class="">
      {#snippet child({ props })}
        <button
          {...props}
          type="button"
          class={cn(
            'date-filter-trigger group',
            'relative flex h-9 w-full items-center justify-between gap-2',
            'rounded-lg border px-3 py-2',
            'bg-background/60 backdrop-blur-sm',
            'text-sm transition-all duration-200',
            'outline-none',
            // Default state
            'border-input/60',
            'hover:border-input hover:bg-background/80',
            // Focus state
            'focus:border-primary/50 focus:bg-background',
            'focus:ring-2 focus:ring-primary/20',
            // Dark mode
            'dark:bg-white/[0.03] dark:border-white/[0.08]',
            'dark:hover:bg-white/[0.05] dark:hover:border-white/[0.12]',
            'dark:focus:bg-white/[0.06] dark:focus:border-primary/40',
            // Active state
            hasValue && 'border-primary/40 bg-primary/[0.03] dark:border-primary/30 dark:bg-primary/[0.08]',
            // Open state
            open && 'ring-2 ring-primary/20 dark:ring-primary/30',
            props.class
          )}
        >
          <div class="flex items-center gap-2">
            <CalendarDays
              class={cn(
                'h-4 w-4 transition-colors duration-200',
                hasValue ? 'text-primary' : 'text-muted-foreground'
              )}
            />
            <span
              class={cn(
                'truncate transition-colors duration-150',
                hasValue ? 'text-foreground font-medium' : 'text-muted-foreground'
              )}
            >
              {displayText}
            </span>
          </div>

          <div class="flex shrink-0 items-center gap-1">
            {#if hasValue}
              <!-- Active indicator -->
              <div class="h-1.5 w-1.5 rounded-full bg-primary animate-in fade-in zoom-in duration-200"></div>
              <!-- Clear button -->
              <span
                role="button"
                tabindex="0"
                onclick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleClear();
                }}
                onkeydown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.stopPropagation();
                    e.preventDefault();
                    handleClear();
                  }
                }}
                class={cn(
                  'flex h-5 w-5 items-center justify-center rounded-md',
                  'text-muted-foreground/60 transition-all duration-150',
                  'hover:bg-muted hover:text-foreground',
                  'active:scale-90'
                )}
              >
                <X class="h-3 w-3" />
              </span>
            {/if}
            <ChevronDown
              class={cn(
                'h-4 w-4 text-muted-foreground/50 transition-transform duration-200',
                open && 'rotate-180'
              )}
            />
          </div>
        </button>
      {/snippet}
    </Popover.Trigger>

    <Popover.Content
      align="start"
      sideOffset={4}
      class={cn(
        'date-filter-content',
        'w-auto overflow-hidden rounded-xl p-0',
        'border border-border/60 bg-popover/95 backdrop-blur-md',
        'shadow-lg shadow-black/5',
        'dark:border-white/[0.08] dark:bg-popover/90',
        'dark:shadow-[0_8px_32px_-4px_rgba(0,0,0,0.5)]',
        'animate-in fade-in-0 zoom-in-95 duration-150'
      )}
    >
      <div class="flex">
        <!-- Presets sidebar -->
        <div
          class={cn(
            'flex flex-col gap-0.5 border-r border-border/40 p-2',
            'bg-muted/30 dark:bg-white/[0.02] dark:border-white/[0.04]'
          )}
        >
          <div class="mb-1 px-2 py-1">
            <span class="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
              {tr('quickSelect')}
            </span>
          </div>
          {#each presets as preset, i}
            <Button
              variant="ghost"
              size="sm"
              class={cn(
                'h-8 justify-start px-3 text-xs font-medium',
                'text-muted-foreground hover:text-foreground',
                'hover:bg-primary/10 dark:hover:bg-primary/20',
                'transition-all duration-150',
                'animate-in fade-in slide-in-from-left-1'
              )}
              style="animation-delay: {i * 30}ms"
              onclick={() => handlePreset(preset)}
            >
              <Clock class="mr-2 h-3 w-3 opacity-50" />
              {tr(preset.labelKey)}
            </Button>
          {/each}
        </div>

        <!-- Calendar section -->
        <div class="p-3">
          <!-- Date selection status -->
          <div
            class={cn(
              'mb-3 flex items-center justify-center gap-2',
              'rounded-lg bg-muted/50 px-3 py-2',
              'dark:bg-white/[0.03]'
            )}
          >
            {#if startDate}
              <div class="flex items-center gap-1.5">
                <div class="h-2 w-2 rounded-full bg-primary"></div>
                <span class="text-xs font-medium text-foreground">
                  {formatDateShort(startDate)}
                </span>
              </div>
            {:else}
              <span class="text-xs text-muted-foreground">{tr('startDate')}</span>
            {/if}

            <ArrowRight class="h-3 w-3 text-muted-foreground/50" />

            {#if endDate}
              <div class="flex items-center gap-1.5">
                <div class="h-2 w-2 rounded-full bg-primary"></div>
                <span class="text-xs font-medium text-foreground">
                  {formatDateShort(endDate)}
                </span>
              </div>
            {:else}
              <span class="text-xs text-muted-foreground">
                {selectingEnd ? tr('selectEnd') : tr('endDate')}
              </span>
            {/if}
          </div>

          <!-- Selection hint -->
          <div
            class={cn(
              'mb-2 text-center text-xs font-medium',
              'transition-colors duration-200',
              selectingEnd ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            {#if selectingEnd}
              <span class="animate-pulse">{tr('clickToSelectEndDate')}</span>
            {:else}
              {tr('selectStartDate')}
            {/if}
          </div>

          <!-- Calendar -->
          <div class="date-calendar-wrapper">
            <Calendar
              value={selectingEnd ? endDateValue : startDateValue}
              onValueChange={handleDateSelect}
            />
          </div>
        </div>
      </div>
    </Popover.Content>
  </Popover.Root>
</div>

<style>
  .date-filter-trigger {
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.03);
  }

  :global(.dark) .date-filter-trigger {
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
  }

  .date-filter-trigger:focus {
    box-shadow:
      inset 0 1px 2px rgba(0, 0, 0, 0.02),
      0 0 0 3px var(--ring);
  }

  :global(.dark) .date-filter-trigger:focus {
    box-shadow:
      inset 0 1px 2px rgba(0, 0, 0, 0.1),
      0 0 0 3px var(--ring),
      0 0 20px -4px var(--primary);
  }

  /* Calendar wrapper refinements */
  .date-calendar-wrapper :global([data-calendar-root]) {
    --calendar-cell-size: 32px;
  }

  .date-calendar-wrapper :global(button[data-today]) {
    position: relative;
  }

  .date-calendar-wrapper :global(button[data-today])::after {
    content: '';
    position: absolute;
    bottom: 4px;
    left: 50%;
    transform: translateX(-50%);
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: var(--primary);
  }

  .date-calendar-wrapper :global(button[data-selected]) {
    background: var(--primary) !important;
    color: var(--primary-foreground) !important;
  }

  :global(.dark) .date-calendar-wrapper :global(button[data-selected]) {
    box-shadow: 0 0 12px -2px var(--primary);
  }
</style>
