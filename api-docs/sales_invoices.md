# 销售 — 所有发票

> 共 22 个端点。🔒 = 需要登录（JWT），🟢 = 无需鉴权。

## 端点速览

| 方法 | 路径 | 鉴权 | 说明 |
|------|------|------|------|
| GET | `/api/invoices/` | 🔒 | List and create invoices |
| POST | `/api/invoices/` | 🔒 | List and create invoices |
| DELETE | `/api/invoices/attachments/{id}/` | 🔒 | Delete an attachment |
| DELETE | `/api/invoices/comments/{id}/` | 🔒 | Update or delete a comment |
| PUT | `/api/invoices/comments/{id}/` | 🔒 | Update or delete a comment |
| POST | `/api/invoices/from-opportunity/{opportunity_id}/` | 🔒 | Create an invoice from a CLOSED_WON opportunity with line items |
| GET | `/api/invoices/{id}/` | 🔒 | Retrieve and update a single invoice |
| PUT | `/api/invoices/{id}/` | 🔒 | Retrieve and update a single invoice |
| POST | `/api/invoices/{id}/cancel/` | 🔒 | Cancel an invoice |
| POST | `/api/invoices/{id}/duplicate/` | 🔒 | Duplicate an existing invoice |
| POST | `/api/invoices/{id}/mark-paid/` | 🔒 | Mark invoice as paid |
| GET | `/api/invoices/{id}/pdf/` | 🔒 | Generate and download invoice PDF |
| POST | `/api/invoices/{id}/send/` | 🔒 | Send invoice to client via email |
| POST | `/api/invoices/{invoice_id}/attachments/` | 🔒 | Manage attachments on an invoice |
| POST | `/api/invoices/{invoice_id}/comments/` | 🔒 | Manage comments on an invoice |
| GET | `/api/invoices/{invoice_id}/line-items/` | 🔒 | Manage line items for an invoice |
| POST | `/api/invoices/{invoice_id}/line-items/` | 🔒 | Manage line items for an invoice |
| DELETE | `/api/invoices/{invoice_id}/line-items/{id}/` | 🔒 | Update or delete a single line item |
| PUT | `/api/invoices/{invoice_id}/line-items/{id}/` | 🔒 | Update or delete a single line item |
| GET | `/api/invoices/{invoice_id}/payments/` | 🔒 | List and create payments for an invoice |
| POST | `/api/invoices/{invoice_id}/payments/` | 🔒 | List and create payments for an invoice |
| DELETE | `/api/invoices/{invoice_id}/payments/{id}/` | 🔒 | Delete a payment |

## 端点详情

### GET `/api/invoices/` 🔒

List and create invoices

**响应**

- **200** `` No response body

---

### POST `/api/invoices/` 🔒

List and create invoices

**响应**

- **200** `` No response body

---

### DELETE `/api/invoices/attachments/{id}/` 🔒

Delete an attachment

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |

**响应**

- **204** `` No response body

---

### DELETE `/api/invoices/comments/{id}/` 🔒

Update or delete a comment

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |

**响应**

- **204** `` No response body

---

### PUT `/api/invoices/comments/{id}/` 🔒

Update or delete a comment

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |

**响应**

- **200** `` No response body

---

### POST `/api/invoices/from-opportunity/{opportunity_id}/` 🔒

Create an invoice from a CLOSED_WON opportunity with line items

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `opportunity_id` | path | string | ✅ |  |

**响应**

- **201** `Invoice` 
- **400** `` 
- **404** `` 

---

### GET `/api/invoices/{id}/` 🔒

Retrieve and update a single invoice

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |

**响应**

- **200** `` No response body

---

### PUT `/api/invoices/{id}/` 🔒

Retrieve and update a single invoice

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |

**响应**

- **200** `` No response body

---

### POST `/api/invoices/{id}/cancel/` 🔒

Cancel an invoice

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |

**响应**

- **200** `` No response body

---

### POST `/api/invoices/{id}/duplicate/` 🔒

Duplicate an existing invoice

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |

**响应**

- **200** `` No response body

---

### POST `/api/invoices/{id}/mark-paid/` 🔒

Mark invoice as paid

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |

**响应**

- **200** `` No response body

---

### GET `/api/invoices/{id}/pdf/` 🔒

Generate and download invoice PDF

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |

**响应**

- **200** `` No response body

---

### POST `/api/invoices/{id}/send/` 🔒

Send invoice to client via email

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |

**响应**

- **200** `` No response body

---

### POST `/api/invoices/{invoice_id}/attachments/` 🔒

Manage attachments on an invoice

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `invoice_id` | path | string | ✅ |  |

**响应**

- **200** `` No response body

---

### POST `/api/invoices/{invoice_id}/comments/` 🔒

Manage comments on an invoice

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `invoice_id` | path | string | ✅ |  |

**响应**

- **200** `` No response body

---

### GET `/api/invoices/{invoice_id}/line-items/` 🔒

Manage line items for an invoice

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `invoice_id` | path | string | ✅ |  |

**响应**

- **200** `` No response body

---

### POST `/api/invoices/{invoice_id}/line-items/` 🔒

Manage line items for an invoice

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `invoice_id` | path | string | ✅ |  |

**响应**

- **200** `` No response body

---

### DELETE `/api/invoices/{invoice_id}/line-items/{id}/` 🔒

Update or delete a single line item

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `invoice_id` | path | string | ✅ |  |

**响应**

- **204** `` No response body

---

### PUT `/api/invoices/{invoice_id}/line-items/{id}/` 🔒

Update or delete a single line item

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `invoice_id` | path | string | ✅ |  |

**响应**

- **200** `` No response body

---

### GET `/api/invoices/{invoice_id}/payments/` 🔒

List and create payments for an invoice

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `invoice_id` | path | string | ✅ |  |

**响应**

- **200** `` No response body

---

### POST `/api/invoices/{invoice_id}/payments/` 🔒

List and create payments for an invoice

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `invoice_id` | path | string | ✅ |  |

**响应**

- **200** `` No response body

---

### DELETE `/api/invoices/{invoice_id}/payments/{id}/` 🔒

Delete a payment

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `invoice_id` | path | string | ✅ |  |

**响应**

- **204** `` No response body

---
