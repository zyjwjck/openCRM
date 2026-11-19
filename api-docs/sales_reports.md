# 销售 — 报表

> 共 3 个端点。🔒 = 需要登录（JWT），🟢 = 无需鉴权。
> 销售报表数据（aging/dashboard/revenue 三个 GET 端点）。

## 端点速览

| 方法 | 路径 | 鉴权 | 说明 |
|------|------|------|------|
| GET | `/api/invoices/reports/aging/` | 🔒 | Accounts receivable aging report |
| GET | `/api/invoices/reports/dashboard/` | 🔒 | Dashboard summary for invoices |
| GET | `/api/invoices/reports/revenue/` | 🔒 | Revenue report with date range and grouping |

## 端点详情

### GET `/api/invoices/reports/aging/` 🔒

Accounts receivable aging report

**200** → `aging`

> ✅ 后端实测: 自定义 dict（OpenAPI 未标注）；顶层字段: 1_30_days, 31_60_days, 61_90_days, current, over_90_days, total

**Schema: `aging → 响应（后端实测）`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `current` | object | — | — | — |
| `1_30_days` | object | — | — | — |
| `31_60_days` | object | — | — | — |
| `61_90_days` | object | — | — | — |
| `over_90_days` | object | — | — | — |
| `total` | object | — | — | — |

**可能的错误响应（DRF 标准）**

- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### GET `/api/invoices/reports/dashboard/` 🔒

Dashboard summary for invoices

**200** → `dashboard`

> ✅ 后端实测: 自定义 dict（OpenAPI 未标注）；顶层字段: estimates, overdue, recent_activity, status_counts, summary

**Schema: `dashboard → 响应（后端实测）`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `summary` | object | — | — | — |
| `status_counts` | object | — | — | — |
| `overdue` | object | — | — | — |
| `recent_activity` | object | — | — | — |
| `estimates` | object | — | — | — |

**可能的错误响应（DRF 标准）**

- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### GET `/api/invoices/reports/revenue/` 🔒

Revenue report with date range and grouping

**200** → `revenue`

> ✅ 后端实测: 自定义 dict（OpenAPI 未标注）；顶层字段: data, end_date, group_by, start_date, total

**Schema: `revenue → 响应（后端实测）`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `start_date` | string | — | — | — |
| `end_date` | string | — | — | — |
| `group_by` | string | — | — | — |
| `data` | [object] | — | — | — |
| `total` | object | — | — | — |

**可能的错误响应（DRF 标准）**

- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---