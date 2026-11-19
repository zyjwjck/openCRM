# 销售 — 模板

> 共 5 个端点。🔒 = 需要登录（JWT），🟢 = 无需鉴权。
> 发票/报价单模板 CRUD。GET /api/invoices/templates/ 返回 **DRF 标准分页**。

## 端点速览

| 方法 | 路径 | 鉴权 | 说明 |
|------|------|------|------|
| GET | `/api/invoices/templates/` | 🔒 | 列表查询 + 新建 invoice templates |
| POST | `/api/invoices/templates/` | 🔒 | 列表查询 + 新建 invoice templates |
| DELETE | `/api/invoices/templates/{id}/` | 🔒 | Retrieve, update, and delete an invoice template |
| GET | `/api/invoices/templates/{id}/` | 🔒 | Retrieve, update, and delete an invoice template |
| PUT | `/api/invoices/templates/{id}/` | 🔒 | Retrieve, update, and delete an invoice template |

## 端点详情

### GET `/api/invoices/templates/` 🔒

列表查询 + 新建 invoice templates

**200** → `Paginated[InvoiceTemplate]`

> ✅ 后端实测: DRF 分页响应，13 字段

**Schema: `Paginated[InvoiceTemplate]（后端实测）`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `count` | integer(int64) | ✅ | 总记录数 | — |
| `next` | string(uri) | ✅ | 下一页 URL | 可空 |
| `previous` | string(uri) | ✅ | 上一页 URL | 可空 |
| `results` | [InvoiceTemplate] | ✅ | 当前页 `InvoiceTemplate` 列表 | — |
| `results[].id` | string(uuid) | ✅ | — | 只读 |
| `results[].name` | string | ✅ | Template Name | ≤100字符 |
| `results[].logo` | string(uri) | — | — | 可空 |
| `results[].primary_color` | string | — | — | ≤7字符 |
| `results[].secondary_color` | string | — | — | ≤7字符 |
| `results[].template_html` | string | — | Custom HTML | — |
| `results[].template_css` | string | — | Custom CSS | — |
| `results[].default_notes` | string | — | — | — |
| `results[].default_terms` | string | — | — | — |
| `results[].footer_text` | string | — | — | — |
| `results[].is_default` | boolean | — | — | — |
| `results[].created_at` | string(date-time) | ✅ | — | 只读 |
| `results[].updated_at` | string(date-time) | ✅ | Last Modified At | 只读 |

**可能的错误响应（DRF 标准）**

- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### POST `/api/invoices/templates/` 🔒

列表查询 + 新建 invoice templates

**200** → 推断: InvoiceTemplate

> OpenAPI 未标注；创建成功推断返回 `InvoiceTemplate`

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### DELETE `/api/invoices/templates/{id}/` 🔒

Retrieve, update, and delete an invoice template

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string(uuid) | ✅ | — |

**204** → 无响应体（删除成功）

**可能的错误响应（DRF 标准）**

- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）
- **400**: 请求参数校验失败（query/header/body 不合法）

---
### GET `/api/invoices/templates/{id}/` 🔒

Retrieve, update, and delete an invoice template

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string(uuid) | ✅ | — |

**200** → 推断: InvoiceTemplate

> OpenAPI 未标注；推断返回 `InvoiceTemplate`

**可能的错误响应（DRF 标准）**

- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）
- **400**: 请求参数校验失败（query/header/body 不合法）

---
### PUT `/api/invoices/templates/{id}/` 🔒

Retrieve, update, and delete an invoice template

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string(uuid) | ✅ | — |

**200** → 推断: InvoiceTemplate

> OpenAPI 未标注；操作成功推断返回 `InvoiceTemplate`

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---