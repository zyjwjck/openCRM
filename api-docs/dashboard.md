# 客户关系管理 — 仪表盘

> 共 2 个端点。🔒 = 需要登录（JWT），🟢 = 无需鉴权。
> 仪表盘：活动动态流 + 首页统计概览。GET 返回的是**聚合 dict**（accounts/leads/cases/opportunities 各列表 + 下拉选项），不是分页列表。

## 端点速览

| 方法 | 路径 | 鉴权 | 说明 |
|------|------|------|------|
| GET | `/api/activities/` | 🔒 | 获取组织最近活动动态 Returns the last 10 activities by default |
| GET | `/api/dashboard/` | 🔒 | 列表查询 |

## 端点详情

### GET `/api/activities/` 🔒

获取组织最近活动动态 Returns the last 10 activities by default

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `entity_type` | query | string | — | Filter by entity type (Account, Lead, Contact, etc.) |
| `limit` | query | integer | — | Number of activities to return (default: 10, max: 50) |
| `org` | header | string | — | — |

**200** → `activities`

> ✅ 后端实测: 自定义 dict（OpenAPI 未标注）；顶层字段: activities, count, error

**Schema: `activities → 响应（后端实测）`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `error` | boolean | — | — | — |
| `count` | integer | — | — | — |
| `activities` | [object] | — | — | — |

**可能的错误响应（DRF 标准）**

- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）
- **400**: 请求参数校验失败（query/header/body 不合法）

---
### GET `/api/dashboard/` 🔒

列表查询

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `org` | header | string | — | — |

**200** → `dashboard`

> ✅ 后端实测: 自定义 dict（OpenAPI 未标注）；顶层字段: accounts, accounts_count, activities, contacts, contacts_count, hot_leads, leads, leads_count, opportunities, opportunities_count, pipeline_by_stage, revenue_metrics...

**Schema: `dashboard → 响应（后端实测）`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `accounts_count` | integer | — | — | — |
| `contacts_count` | integer | — | — | — |
| `leads_count` | integer | — | — | — |
| `opportunities_count` | integer | — | — | — |
| `accounts` | [object] | — | — | — |
| `contacts` | [object] | — | — | — |
| `leads` | [object] | — | — | — |
| `opportunities` | [object] | — | — | — |
| `urgent_counts` | object | — | — | — |
| `pipeline_by_stage` | object | — | — | — |
| `revenue_metrics` | object | — | — | — |
| `hot_leads` | [object] | — | — | — |
| `tasks` | [object] | — | — | — |
| `activities` | [object] | — | — | — |

**可能的错误响应（DRF 标准）**

- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）
- **400**: 请求参数校验失败（query/header/body 不合法）

---