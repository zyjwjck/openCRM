# 销售 — 循环发票

> 共 6 个端点。🔒 = 需要登录（JWT），🟢 = 无需鉴权。

## 端点速览

| 方法 | 路径 | 鉴权 | 说明 |
|------|------|------|------|
| GET | `/api/invoices/recurring/` | 🔒 | List and create recurring invoices |
| POST | `/api/invoices/recurring/` | 🔒 | List and create recurring invoices |
| DELETE | `/api/invoices/recurring/{id}/` | 🔒 | Retrieve, update, and delete a recurring invoice |
| GET | `/api/invoices/recurring/{id}/` | 🔒 | Retrieve, update, and delete a recurring invoice |
| PUT | `/api/invoices/recurring/{id}/` | 🔒 | Retrieve, update, and delete a recurring invoice |
| POST | `/api/invoices/recurring/{id}/toggle/` | 🔒 | Pause or resume a recurring invoice |

## 端点详情

### GET `/api/invoices/recurring/` 🔒

List and create recurring invoices

**响应**

- **200** `` No response body

---

### POST `/api/invoices/recurring/` 🔒

List and create recurring invoices

**响应**

- **200** `` No response body

---

### DELETE `/api/invoices/recurring/{id}/` 🔒

Retrieve, update, and delete a recurring invoice

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |

**响应**

- **204** `` No response body

---

### GET `/api/invoices/recurring/{id}/` 🔒

Retrieve, update, and delete a recurring invoice

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |

**响应**

- **200** `` No response body

---

### PUT `/api/invoices/recurring/{id}/` 🔒

Retrieve, update, and delete a recurring invoice

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |

**响应**

- **200** `` No response body

---

### POST `/api/invoices/recurring/{id}/toggle/` 🔒

Pause or resume a recurring invoice

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |

**响应**

- **200** `` No response body

---
