# 客户关系管理 — 联系人

> 共 11 个端点。🔒 = 需要登录（JWT），🟢 = 无需鉴权。

## 端点速览

| 方法 | 路径 | 鉴权 | 说明 |
|------|------|------|------|
| GET | `/api/contacts/` | 🔒 |  |
| POST | `/api/contacts/` | 🔒 |  |
| DELETE | `/api/contacts/attachment/{id}/` | 🔒 |  |
| DELETE | `/api/contacts/comment/{id}/` | 🔒 |  |
| PATCH | `/api/contacts/comment/{id}/` | 🔒 | Partial Comment Update |
| PUT | `/api/contacts/comment/{id}/` | 🔒 |  |
| DELETE | `/api/contacts/{id}/` | 🔒 |  |
| GET | `/api/contacts/{id}/` | 🔒 |  |
| PATCH | `/api/contacts/{id}/` | 🔒 | Partial Contact Update |
| POST | `/api/contacts/{id}/` | 🔒 |  |
| PUT | `/api/contacts/{id}/` | 🔒 |  |

## 端点详情

### GET `/api/contacts/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `assigned_to` | query | string | — |  |
| `city` | query | string | — |  |
| `name` | query | string | — |  |
| `org` | header | string | — |  |

**响应**

- **200** `ContactListResponse` 

---

### POST `/api/contacts/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `org` | header | string | — |  |

**请求体** `application/json`

```
CreateContactRequest
```

**响应**

- **200** `ContactCreateResponse` 

---

### DELETE `/api/contacts/attachment/{id}/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**响应**

- **200** `ContactAttachmentDeleteResponse` 

---

### DELETE `/api/contacts/comment/{id}/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**响应**

- **200** `ContactCommentDeleteResponse` 

---

### PATCH `/api/contacts/comment/{id}/` 🔒

Partial Comment Update

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**请求体** `application/json`

```
PatchedContactCommentEditSwaggerRequest
```

**响应**

- **200** `ContactCommentPatchResponse` 

---

### PUT `/api/contacts/comment/{id}/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**请求体** `application/json`

```
ContactCommentEditSwaggerRequest
```

**响应**

- **200** `ContactCommentUpdateResponse` 

---

### DELETE `/api/contacts/{id}/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**响应**

- **200** `ContactDetailDeleteResponse` 

---

### GET `/api/contacts/{id}/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**响应**

- **200** `ContactDetailResponse` 

---

### PATCH `/api/contacts/{id}/` 🔒

Partial Contact Update

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**请求体** `application/json`

```
PatchedCreateContactRequest
```

**响应**

- **200** `ContactPatchResponse` 

---

### POST `/api/contacts/{id}/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**请求体** `application/json`

```
ContactDetailEditSwaggerRequest
```

**响应**

- **200** `ContactCommentAttachmentResponse` 

---

### PUT `/api/contacts/{id}/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `address_line` | query | string | — |  |
| `assigned_to` | query | string | — |  |
| `city` | query | string | — |  |
| `contact_attachment` | query | string | — |  |
| `country` | query | string | — |  |
| `date_of_birth` | query | string | — |  |
| `department` | query | string | — |  |
| `description` | query | string | — |  |
| `do_not_call` | query | boolean | — |  |
| `email` | query | string | — |  |
| `facebook_url` | query | string | — |  |
| `first_name` | query | string | — |  |
| `id` | path | string | ✅ |  |
| `language` | query | string | — |  |
| `last_name` | query | string | — |  |
| `linkedin_url` | query | string | — |  |
| `org` | header | string | — |  |
| `organization` | query | string | — |  |
| `phone` | query | string | — |  |
| `pincode` | query | string | — |  |
| `salutation` | query | string | — |  |
| `secondary_email` | query | string | — |  |
| `secondary_number` | query | string | — |  |
| `state` | query | string | — |  |
| `street` | query | string | — |  |
| `teams` | query | string | — |  |
| `title` | query | string | — |  |
| `twitter_username` | query | string | — |  |

**请求体** `application/json`

```
CreateContactRequest
```

**响应**

- **200** `ContactUpdateResponse` 

---
