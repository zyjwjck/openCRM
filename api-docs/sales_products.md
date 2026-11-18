# 销售 — 产品

> 共 5 个端点。🔒 = 需要登录（JWT），🟢 = 无需鉴权。

## 端点速览

| 方法 | 路径 | 鉴权 | 说明 |
|------|------|------|------|
| GET | `/api/invoices/products/` | 🔒 | List and create products |
| POST | `/api/invoices/products/` | 🔒 | List and create products |
| DELETE | `/api/invoices/products/{id}/` | 🔒 | Retrieve, update, and delete a product |
| GET | `/api/invoices/products/{id}/` | 🔒 | Retrieve, update, and delete a product |
| PUT | `/api/invoices/products/{id}/` | 🔒 | Retrieve, update, and delete a product |

## 端点详情

### GET `/api/invoices/products/` 🔒

List and create products

**响应**

- **200** `` No response body

---

### POST `/api/invoices/products/` 🔒

List and create products

**响应**

- **200** `` No response body

---

### DELETE `/api/invoices/products/{id}/` 🔒

Retrieve, update, and delete a product

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |

**响应**

- **204** `` No response body

---

### GET `/api/invoices/products/{id}/` 🔒

Retrieve, update, and delete a product

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |

**响应**

- **200** `` No response body

---

### PUT `/api/invoices/products/{id}/` 🔒

Retrieve, update, and delete a product

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |

**响应**

- **200** `` No response body

---
