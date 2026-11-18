# 销售 — 报价单

> 共 8 个端点。🔒 = 需要登录（JWT），🟢 = 无需鉴权。

## 端点速览

| 方法 | 路径 | 鉴权 | 说明 |
|------|------|------|------|
| GET | `/api/invoices/estimates/` | 🔒 | List and create estimates |
| POST | `/api/invoices/estimates/` | 🔒 | List and create estimates |
| DELETE | `/api/invoices/estimates/{id}/` | 🔒 | Retrieve, update, and delete an estimate |
| GET | `/api/invoices/estimates/{id}/` | 🔒 | Retrieve, update, and delete an estimate |
| PUT | `/api/invoices/estimates/{id}/` | 🔒 | Retrieve, update, and delete an estimate |
| POST | `/api/invoices/estimates/{id}/convert/` | 🔒 | Convert an estimate to an invoice |
| GET | `/api/invoices/estimates/{id}/pdf/` | 🔒 | Generate and download estimate PDF |
| POST | `/api/invoices/estimates/{id}/send/` | 🔒 | Send estimate to client via email |

## 端点详情

### GET `/api/invoices/estimates/` 🔒

List and create estimates

**响应**

- **200** `` No response body

---

### POST `/api/invoices/estimates/` 🔒

List and create estimates

**响应**

- **200** `` No response body

---

### DELETE `/api/invoices/estimates/{id}/` 🔒

Retrieve, update, and delete an estimate

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |

**响应**

- **204** `` No response body

---

### GET `/api/invoices/estimates/{id}/` 🔒

Retrieve, update, and delete an estimate

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |

**响应**

- **200** `` No response body

---

### PUT `/api/invoices/estimates/{id}/` 🔒

Retrieve, update, and delete an estimate

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |

**响应**

- **200** `` No response body

---

### POST `/api/invoices/estimates/{id}/convert/` 🔒

Convert an estimate to an invoice

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |

**响应**

- **200** `` No response body

---

### GET `/api/invoices/estimates/{id}/pdf/` 🔒

Generate and download estimate PDF

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |

**响应**

- **200** `` No response body

---

### POST `/api/invoices/estimates/{id}/send/` 🔒

Send estimate to client via email

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |

**响应**

- **200** `` No response body

---
