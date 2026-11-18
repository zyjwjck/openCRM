# 客户关系管理 — 账户

> 共 12 个端点。🔒 = 需要登录（JWT），🟢 = 无需鉴权。

## 端点速览

| 方法 | 路径 | 鉴权 | 说明 |
|------|------|------|------|
| GET | `/api/accounts/` | 🔒 |  |
| POST | `/api/accounts/` | 🔒 |  |
| DELETE | `/api/accounts/attachment/{id}/` | 🔒 |  |
| DELETE | `/api/accounts/comment/{id}/` | 🔒 |  |
| PATCH | `/api/accounts/comment/{id}/` | 🔒 | Partial Comment Update |
| PUT | `/api/accounts/comment/{id}/` | 🔒 |  |
| DELETE | `/api/accounts/{id}/` | 🔒 |  |
| GET | `/api/accounts/{id}/` | 🔒 |  |
| PATCH | `/api/accounts/{id}/` | 🔒 | Partial Account Update |
| POST | `/api/accounts/{id}/` | 🔒 |  |
| PUT | `/api/accounts/{id}/` | 🔒 |  |
| POST | `/api/accounts/{id}/create_mail/` | 🔒 |  |

## 端点详情

### GET `/api/accounts/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `city` | query | string | — |  |
| `name` | query | string | — |  |
| `org` | header | string | — |  |
| `tags` | query | string | — |  |

**响应**

- **200** `Account` 

---

### POST `/api/accounts/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `org` | header | string | — |  |

**请求体** `application/json`

```
AccountCreateRequest
```

**响应**

- **200** `Account` 

---

### DELETE `/api/accounts/attachment/{id}/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**响应**

- **204** `` No response body

---

### DELETE `/api/accounts/comment/{id}/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**响应**

- **204** `` No response body

---

### PATCH `/api/accounts/comment/{id}/` 🔒

Partial Comment Update

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**请求体** `application/json`

```
PatchedAccountCommentEditSwaggerRequest
```

**响应**

- **200** `AccountCommentEditSwagger` 

---

### PUT `/api/accounts/comment/{id}/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**请求体** `application/json`

```
AccountCommentEditSwaggerRequest
```

**响应**

- **200** `AccountCommentEditSwagger` 

---

### DELETE `/api/accounts/{id}/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**响应**

- **204** `` No response body

---

### GET `/api/accounts/{id}/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**响应**

- **200** `Account` 

---

### PATCH `/api/accounts/{id}/` 🔒

Partial Account Update

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**请求体** `application/json`

```
PatchedAccountWriteRequest
```

**响应**

- **200** `Account` 

---

### POST `/api/accounts/{id}/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**请求体** `application/json`

```
AccountDetailEditSwaggerRequest
```

**响应**

- **200** `Account` 

---

### PUT `/api/accounts/{id}/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**请求体** `application/json`

```
AccountWriteRequest
```

**响应**

- **200** `Account` 

---

### POST `/api/accounts/{id}/create_mail/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**请求体** `application/json`

```
EmailWriteRequest
```

**响应**

- **200** `EmailWrite` 

---
