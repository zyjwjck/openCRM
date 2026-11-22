import { useCallback, useRef, useState } from "react";
import { Check, ChevronDown, Layers } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  floatingItemClassName,
  floatingItemFocusClassName,
} from "@/components/ui/floating-surface";
import {
  ALL_CRM_MODULE_IDS,
  CRM_MODULE_GROUPS,
  groupFullySelected,
  groupPartiallySelected,
  selectedModuleLabels,
  toggleGroup,
  toggleModule,
  type CrmModuleGroup,
} from "@/lib/crm-modules";
import { cn } from "@/lib/utils";

function ModuleCheck({ checked, partial }: { checked: boolean; partial?: boolean }) {
  if (!checked) return <span className="h-4 w-4 shrink-0 rounded border border-border/70" />;
  return (
    <span
      className={cn(
        "grid h-4 w-4 shrink-0 place-items-center rounded bg-primary text-primary-foreground",
        partial && "opacity-80",
      )}
    >
      <Check className="h-3 w-3" />
    </span>
  );
}

function GroupRow({
  group,
  selected,
  onToggleGroup,
  onToggleModule,
}: {
  group: CrmModuleGroup;
  selected: string[];
  onToggleGroup: (group: CrmModuleGroup) => void;
  onToggleModule: (id: string) => void;
}) {
  const fully = groupFullySelected(group, selected);
  const partially = !fully && groupPartiallySelected(group, selected);
  return (
    <div className="space-y-0.5">
      <button
        type="button"
        onClick={() => onToggleGroup(group)}
        className={cn(
          floatingItemClassName,
          floatingItemFocusClassName,
          "flex min-h-9 w-full items-center gap-2.5 px-2 py-1.5 text-left",
        )}
      >
        <ModuleCheck checked={fully} partial={partially} />
        <span className="flex-1 truncate text-[13px] font-semibold text-foreground">
          {group.label}
        </span>
        <span className="text-[11px] text-muted-foreground">
          {group.children.filter((child) => selected.includes(child.id)).length}/
          {group.children.length}
        </span>
      </button>
      <div className="pl-3">
        {group.children.map((child) => {
          const checked = selected.includes(child.id);
          return (
            <button
              key={child.id}
              type="button"
              onClick={() => onToggleModule(child.id)}
              className={cn(
                floatingItemClassName,
                floatingItemFocusClassName,
                "flex min-h-8 w-full items-center gap-2.5 px-2 py-1 text-left",
              )}
            >
              <ModuleCheck checked={checked} />
              <span className="flex-1 truncate text-[12.5px] text-foreground/90">
                {child.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function CrmModulePicker({
  compact = false,
  disabled,
  selected,
  onChange,
}: {
  compact?: boolean;
  disabled?: boolean;
  selected: string[];
  onChange?: (modules: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const count = selected.length;
  const label = count === 0
    ? "全部模块"
    : count === ALL_CRM_MODULE_IDS.length
      ? "全部模块"
      : selectedModuleLabels(selected).join("、");

  const handleToggleGroup = useCallback(
    (group: CrmModuleGroup) => {
      onChange?.(toggleGroup(group, selected));
    },
    [onChange, selected],
  );
  const handleToggleModule = useCallback(
    (id: string) => {
      onChange?.(toggleModule(id, selected));
    },
    [onChange, selected],
  );
  const clearAll = useCallback(() => onChange?.([]), [onChange]);

  return (
    <div
      className={cn(
        compact
          ? "inline-flex"
          : "flex min-w-0 items-center rounded-b-[28px] bg-muted/45 px-3 py-1.5 dark:bg-white/[0.045] sm:px-4",
      )}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            ref={triggerRef}
            type="button"
            disabled={disabled}
            aria-label="选择 CRM 模块范围"
            title={label}
            className={cn(
              compact
                ? "thread-composer-action touch-target inline-flex h-8 w-8 items-center justify-center rounded-full border border-transparent"
                : "inline-flex h-7 max-w-full items-center gap-2 rounded-full px-2.5 sm:max-w-[18rem]",
              "text-[12px] font-medium text-muted-foreground/90 transition-colors hover:text-foreground hover:bg-background/70 disabled:pointer-events-none disabled:opacity-55",
              count > 0 && "text-primary",
            )}
          >
            <Layers className={cn("shrink-0", compact ? "h-4 w-4" : "h-3.5 w-3.5")} />
            <span className={compact ? "sr-only" : "truncate"}>{label}</span>
            {!compact ? (
              <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            ) : null}
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          side="bottom"
          sideOffset={8}
          className="w-[min(34rem,calc(100vw-2rem))]"
        >
          <div className="flex items-center justify-between gap-2 px-2 pb-1.5 pt-1">
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-foreground">CRM 模块范围</p>
              <p className="text-[11px] text-muted-foreground">
                不选表示不限；本次会话仅在你选中的模块内行动
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearAll}
              disabled={count === 0}
              className="h-7 shrink-0 rounded-full px-2 text-[11.5px]"
            >
              不选代表全部
            </Button>
          </div>
          <div className="my-1 h-px bg-border/45" />
          <div className="grid max-h-[min(26rem,60vh)] grid-cols-2 gap-3 overflow-y-auto px-1 py-1">
            {CRM_MODULE_GROUPS.map((group, index) => (
              <div
                key={group.id}
                className={cn(
                  "min-w-0 space-y-0.5",
                  index > 0 && "border-l border-border/45 pl-3",
                )}
              >
                <GroupRow
                  group={group}
                  selected={selected}
                  onToggleGroup={handleToggleGroup}
                  onToggleModule={handleToggleModule}
                />
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
