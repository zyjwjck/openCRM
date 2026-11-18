# 销售 — 模板

> 共 5 个端点。🔒 = 需要登录（JWT），🟢 = 无需鉴权。

## 端点速览

| 方法 | 路径 | 鉴权 | 说明 |
|------|------|------|------|
| GET | `/api/invoices/templates/` | 🔒 | List and create invoice templates |
| POST | `/api/invoices/templates/` | 🔒 | List and create invoice templates |
| DELETE | `/api/invoices/templates/{id}/` | 🔒 | Retrieve, update, and delete an invoice template |
| GET | `/api/invoices/templates/{id}/` | 🔒 | Retrieve, update, and delete an invoice template |
| PUT | `/api/invoices/templates/{id}/` | 🔒 | Retrieve, update, and delete an invoice template |

## 端点详情

### GET `/api/invoices/templates/` 🔒

List and create invoice templates

**响应**

- **200** `` No response body

---

### POST `/api/invoices/templates/` 🔒

List and create invoice templates

**响应**

- **200** `` No response body

---

### DELETE `/api/invoices/templates/{id}/` 🔒

Retrieve, update, and delete an invoice template

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |

**响应**

- **204** `` No response body

---

### GET `/api/invoices/templates/{id}/` 🔒

Retrieve, update, and delete an invoice template

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |

**响应**

- **200** `` No response body

---

### PUT `/api/invoices/templates/{id}/` 🔒

Retrieve, update, and delete an invoice template

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |

**响应**

- **200** `` No response body

---
