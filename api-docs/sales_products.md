# 销售 — 产品

> 共 5 个端点。🔒 = 需要登录（JWT），🟢 = 无需鉴权。
> 产品目录 CRUD（用于发票/报价单行项目）。GET /api/invoices/products/ 返回 **DRF 标准分页**。

## 端点速览

| 方法 | 路径 | 鉴权 | 说明 |
|------|------|------|------|
| GET | `/api/invoices/products/` | 🔒 | 列表查询 + 新建 products |
| POST | `/api/invoices/products/` | 🔒 | 列表查询 + 新建 products |
| DELETE | `/api/invoices/products/{id}/` | 🔒 | Retrieve, update, and delete a product |
| GET | `/api/invoices/products/{id}/` | 🔒 | Retrieve, update, and delete a product |
| PUT | `/api/invoices/products/{id}/` | 🔒 | Retrieve, update, and delete a product |

## 端点详情

### GET `/api/invoices/products/` 🔒

列表查询 + 新建 products

**200** → `Paginated[Product]`

> ✅ 后端实测: DRF 分页响应，10 字段

**Schema: `Paginated[Product]（后端实测）`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `count` | integer(int64) | ✅ | 总记录数 | — |
| `next` | string(uri) | ✅ | 下一页 URL | 可空 |
| `previous` | string(uri) | ✅ | 上一页 URL | 可空 |
| `results` | [Product] | ✅ | 当前页 `Product` 列表 | — |
| `results[].id` | string(uuid) | ✅ | — | 只读 |
| `results[].name` | string | ✅ | Product Name | ≤255字符 |
| `results[].description` | string | — | — | 可空 |
| `results[].sku` | string | — | — | 可空; ≤100字符 |
| `results[].price` | string(decimal) | — | — | 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `results[].currency` | enum(CurrencyEnum) | — | — | 枚举: USD, EUR, GBP, INR, CAD, AUD, JPY, CNY, CHF, SGD, AED, BRL, MXN; 可空 |
| `results[].category` | string | — | — | 可空; ≤100字符 |
| `results[].is_active` | boolean | — | — | — |
| `results[].created_at` | string(date-time) | ✅ | — | 只读 |
| `results[].updated_at` | string(date-time) | ✅ | Last Modified At | 只读 |

**可能的错误响应（DRF 标准）**

- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### POST `/api/invoices/products/` 🔒

列表查询 + 新建 products

**200** → 推断: Product

> OpenAPI 未标注；创建成功推断返回 `Product`

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### DELETE `/api/invoices/products/{id}/` 🔒

Retrieve, update, and delete a product

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
### GET `/api/invoices/products/{id}/` 🔒

Retrieve, update, and delete a product

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string(uuid) | ✅ | — |

**200** → 推断: Product

> OpenAPI 未标注；推断返回 `Product`

**可能的错误响应（DRF 标准）**

- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）
- **400**: 请求参数校验失败（query/header/body 不合法）

---
### PUT `/api/invoices/products/{id}/` 🔒

Retrieve, update, and delete a product

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string(uuid) | ✅ | — |

**200** → 推断: Product

> OpenAPI 未标注；操作成功推断返回 `Product`

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---