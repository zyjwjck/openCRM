/**
 * CRM modules available for scoping an embedded openCRM agent conversation.
 *
 * The selected module ids are sent with each message (`crm_modules`) and turned
 * into a prompt-level scope hint by the nanobot backend. An empty selection
 * means "unrestricted".
 */

export interface CrmModuleOption {
  id: string;
  label: string;
  /** REST API path prefix used in the generated scope hint. */
  apiPath: string;
}

export interface CrmModuleGroup {
  id: string;
  label: string;
  children: CrmModuleOption[];
}

export const CRM_MODULE_GROUPS: CrmModuleGroup[] = [
  {
    id: "crm",
    label: "客户关系管理",
    children: [
      { id: "dashboard", label: "仪表盘", apiPath: "/api/dashboard/" },
      { id: "leads", label: "线索", apiPath: "/api/leads/" },
      { id: "contacts", label: "联系人", apiPath: "/api/contacts/" },
      { id: "accounts", label: "客户", apiPath: "/api/accounts/" },
      { id: "opportunities", label: "商机", apiPath: "/api/opportunities/" },
      { id: "cases", label: "工单", apiPath: "/api/cases/" },
      { id: "tasks", label: "任务", apiPath: "/api/tasks/" },
    ],
  },
  {
    id: "sales",
    label: "销售",
    children: [
      { id: "invoices", label: "所有发票", apiPath: "/api/invoices/" },
      { id: "estimates", label: "报价单", apiPath: "/api/invoices/estimates/" },
      { id: "products", label: "产品", apiPath: "/api/invoices/products/" },
      { id: "recurring", label: "循环发票", apiPath: "/api/invoices/recurring/" },
      { id: "templates", label: "模板", apiPath: "/api/invoices/templates/" },
      { id: "reports", label: "报表", apiPath: "/api/invoices/reports/" },
      { id: "commission", label: "提成", apiPath: "/api/commission/" },
    ],
  },
];

export const ALL_CRM_MODULE_IDS: string[] = CRM_MODULE_GROUPS.flatMap((group) =>
  group.children.map((child) => child.id),
);

export function groupFullySelected(
  group: CrmModuleGroup,
  selected: string[],
): boolean {
  return group.children.every((child) => selected.includes(child.id));
}

export function groupPartiallySelected(
  group: CrmModuleGroup,
  selected: string[],
): boolean {
  return group.children.some((child) => selected.includes(child.id));
}

export function toggleGroup(group: CrmModuleGroup, selected: string[]): string[] {
  if (groupFullySelected(group, selected)) {
    const groupIds = new Set(group.children.map((child) => child.id));
    return selected.filter((id) => !groupIds.has(id));
  }
  const merged = new Set(selected);
  group.children.forEach((child) => merged.add(child.id));
  return ALL_CRM_MODULE_IDS.filter((id) => merged.has(id));
}

export function toggleModule(id: string, selected: string[]): string[] {
  return selected.includes(id)
    ? selected.filter((item) => item !== id)
    : ALL_CRM_MODULE_IDS.filter((item) => item === id || selected.includes(item));
}

export function selectedModuleLabels(selected: string[]): string[] {
  const labels = new Map<string, string>();
  CRM_MODULE_GROUPS.forEach((group) => {
    group.children.forEach((child) => labels.set(child.id, child.label));
  });
  return selected.map((id) => labels.get(id) ?? id);
}
