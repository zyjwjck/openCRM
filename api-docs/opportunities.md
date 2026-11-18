# 客户关系管理 — 交易（商机）

> 共 16 个端点。🔒 = 需要登录（JWT），🟢 = 无需鉴权。

## 端点速览

| 方法 | 路径 | 鉴权 | 说明 |
|------|------|------|------|
| GET | `/api/opportunities/` | 🔒 |  |
| POST | `/api/opportunities/` | 🔒 |  |
| DELETE | `/api/opportunities/attachment/{id}/` | 🔒 |  |
| DELETE | `/api/opportunities/comment/{id}/` | 🔒 |  |
| PATCH | `/api/opportunities/comment/{id}/` | 🔒 | Partial Comment Update |
| PUT | `/api/opportunities/comment/{id}/` | 🔒 |  |
| DELETE | `/api/opportunities/{id}/` | 🔒 |  |
| GET | `/api/opportunities/{id}/` | 🔒 |  |
| PATCH | `/api/opportunities/{id}/` | 🔒 | Partial Opportunity Update |
| POST | `/api/opportunities/{id}/` | 🔒 |  |
| PUT | `/api/opportunities/{id}/` | 🔒 |  |
| GET | `/api/opportunities/{opportunity_id}/line-items/` | 🔒 | List all line items for an opportunity |
| POST | `/api/opportunities/{opportunity_id}/line-items/` | 🔒 | Create a new line item for an opportunity |
| DELETE | `/api/opportunities/{opportunity_id}/line-items/{line_item_id}/` | 🔒 | Delete a line item |
| GET | `/api/opportunities/{opportunity_id}/line-items/{line_item_id}/` | 🔒 | Retrieve a single line item |
| PUT | `/api/opportunities/{opportunity_id}/line-items/{line_item_id}/` | 🔒 | Update a line item |

## 端点详情

### GET `/api/opportunities/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `account` | query | string | — |  |
| `lead_source` | query | string | — |  |
| `name` | query | string | — |  |
| `org` | header | string | — |  |
| `stage` | query | string | — |  |
| `tags` | query | string | — |  |

**响应**

- **200** `OpportunityListResponse` 

---

### POST `/api/opportunities/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `org` | header | string | — |  |

**请求体** `application/json`

```
OpportunityCreateSwaggerRequest
```

**响应**

- **200** `OpportunityCreateResponse` 

---

### DELETE `/api/opportunities/attachment/{id}/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**响应**

- **200** `OpportunityAttachmentDeleteResponse` 

---

### DELETE `/api/opportunities/comment/{id}/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**响应**

- **200** `OpportunityCommentDeleteResponse` 

---

### PATCH `/api/opportunities/comment/{id}/` 🔒

Partial Comment Update

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**请求体** `application/json`

```
PatchedOpportunityCommentEditSwaggerRequest
```

**响应**

- **200** `OpportunityCommentPatchResponse` 

---

### PUT `/api/opportunities/comment/{id}/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**请求体** `application/json`

```
OpportunityCommentEditSwaggerRequest
```

**响应**

- **200** `OpportunityCommentUpdateResponse` 

---

### DELETE `/api/opportunities/{id}/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**响应**

- **200** `OpportunityDetailDeleteResponse` 

---

### GET `/api/opportunities/{id}/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**响应**

- **200** `OpportunityDetailResponse` 

---

### PATCH `/api/opportunities/{id}/` 🔒

Partial Opportunity Update

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**请求体** `application/json`

```
PatchedOpportunityCreateSwaggerRequest
```

**响应**

- **200** `OpportunityPatchResponse` 

---

### POST `/api/opportunities/{id}/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**请求体** `application/json`

```
OpportunityDetailEditSwaggerRequest
```

**响应**

- **200** `OpportunityCommentAttachmentResponse` 

---

### PUT `/api/opportunities/{id}/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**请求体** `application/json`

```
OpportunityCreateSwaggerRequest
```

**响应**

- **200** `OpportunityUpdateResponse` 

---

### GET `/api/opportunities/{opportunity_id}/line-items/` 🔒

List all line items for an opportunity

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `opportunity_id` | path | string | ✅ |  |

**响应**

- **200** `OpportunityLineItemListResponse` 

---

### POST `/api/opportunities/{opportunity_id}/line-items/` 🔒

Create a new line item for an opportunity

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `opportunity_id` | path | string | ✅ |  |

**请求体** `application/json`

```
OpportunityLineItemCreateRequest
```

**响应**

- **201** `OpportunityLineItemCreateResponse` 

---

### DELETE `/api/opportunities/{opportunity_id}/line-items/{line_item_id}/` 🔒

Delete a line item

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `line_item_id` | path | string | ✅ |  |
| `opportunity_id` | path | string | ✅ |  |

**响应**

- **200** `OpportunityLineItemDeleteResponse` 

---

### GET `/api/opportunities/{opportunity_id}/line-items/{line_item_id}/` 🔒

Retrieve a single line item

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `line_item_id` | path | string | ✅ |  |
| `opportunity_id` | path | string | ✅ |  |

**响应**

- **200** `OpportunityLineItem` 

---

### PUT `/api/opportunities/{opportunity_id}/line-items/{line_item_id}/` 🔒

Update a line item

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `line_item_id` | path | string | ✅ |  |
| `opportunity_id` | path | string | ✅ |  |

**请求体** `application/json`

```
OpportunityLineItemCreateRequest
```

**响应**

- **200** `OpportunityLineItemUpdateResponse` 

---
