# 客户关系管理 — 线索

> 共 25 个端点。🔒 = 需要登录（JWT），🟢 = 无需鉴权。

## 端点速览

| 方法 | 路径 | 鉴权 | 说明 |
|------|------|------|------|
| GET | `/api/leads/` | 🔒 |  |
| POST | `/api/leads/` | 🔒 | Leads Create |
| DELETE | `/api/leads/attachment/{id}/` | 🔒 |  |
| DELETE | `/api/leads/comment/{id}/` | 🔒 |  |
| PATCH | `/api/leads/comment/{id}/` | 🔒 | Partial Comment Update |
| POST | `/api/leads/comment/{id}/` | 🔒 | Create a new comment for a lead |
| PUT | `/api/leads/comment/{id}/` | 🔒 |  |
| POST | `/api/leads/create-from-site/` | 🔒 |  |
| GET | `/api/leads/kanban/` | 🔒 | Get kanban board data. |
| GET | `/api/leads/pipelines/` | 🔒 | List all pipelines for the organization. |
| POST | `/api/leads/pipelines/` | 🔒 | Create a new pipeline. |
| DELETE | `/api/leads/pipelines/{id}/` | 🔒 | Delete pipeline (soft delete by setting is_active=False). |
| GET | `/api/leads/pipelines/{id}/` | 🔒 | Get pipeline details with all stages. |
| PUT | `/api/leads/pipelines/{id}/` | 🔒 | Update pipeline. |
| POST | `/api/leads/pipelines/{pipeline_pk}/stages/` | 🔒 | Add a new stage to pipeline. |
| POST | `/api/leads/pipelines/{pipeline_pk}/stages/reorder/` | 🔒 | Reorder stages by providing ordered list of stage IDs. |
| DELETE | `/api/leads/stages/{id}/` | 🔒 | Delete stage. |
| PUT | `/api/leads/stages/{id}/` | 🔒 | Update stage. |
| POST | `/api/leads/upload/` | 🔒 |  |
| DELETE | `/api/leads/{id}/` | 🔒 | Lead Delete |
| GET | `/api/leads/{id}/` | 🔒 | Lead Detail |
| PATCH | `/api/leads/{id}/` | 🔒 | Partial Lead Update |
| POST | `/api/leads/{id}/` | 🔒 |  |
| PUT | `/api/leads/{id}/` | 🔒 |  |
| PATCH | `/api/leads/{id}/move/` | 🔒 | Move lead to different column and/or position. |

## 端点详情

### GET `/api/leads/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `assigned_to` | query | string | — |  |
| `org` | header | string | — |  |
| `source` | query | string | — |  |
| `status` | query | string | — |  |
| `tags` | query | string | — |  |
| `title` | query | string | — |  |

**响应**

- **200** `LeadListResponse` 

---

### POST `/api/leads/` 🔒

Leads Create

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `org` | header | string | — |  |

**请求体** `application/json`

```
LeadCreateSwaggerRequest
```

**响应**

- **200** `LeadCreateResponse` 

---

### DELETE `/api/leads/attachment/{id}/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**响应**

- **200** `LeadAttachmentDeleteResponse` 

---

### DELETE `/api/leads/comment/{id}/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**响应**

- **200** `LeadCommentDeleteResponse` 

---

### PATCH `/api/leads/comment/{id}/` 🔒

Partial Comment Update

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**请求体** `application/json`

```
PatchedLeadCommentEditSwaggerRequest
```

**响应**

- **200** `LeadCommentPatchResponse` 

---

### POST `/api/leads/comment/{id}/` 🔒

Create a new comment for a lead

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**请求体** `application/json`

```
LeadCommentEditSwaggerRequest
```

**响应**

- **200** `LeadCommentCreateResponse` 

---

### PUT `/api/leads/comment/{id}/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**请求体** `application/json`

```
LeadCommentEditSwaggerRequest
```

**响应**

- **200** `LeadCommentUpdateResponse` 

---

### POST `/api/leads/create-from-site/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `org` | header | string | — |  |

**请求体** `application/json`

```
CreateLeadFromSiteSwaggerRequest
```

**响应**

- **200** `CreateLeadFromSiteResponse` 

---

### GET `/api/leads/kanban/` 🔒

Get kanban board data.

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `assigned_to` | query | string | — | Filter by assigned user ID |
| `org` | query | string | ✅ |  |
| `pipeline_id` | query | string | — | Pipeline ID. If not provided, uses status-based columns |
| `rating` | query | string | — | Filter by rating (HOT/WARM/COLD) |
| `search` | query | string | — | Search in name, company, email |

**响应**

- **200** `` No response body

---

### GET `/api/leads/pipelines/` 🔒

List all pipelines for the organization.

**响应**

- **200** `array` 

---

### POST `/api/leads/pipelines/` 🔒

Create a new pipeline.

**请求体** `application/json`

```
LeadPipelineRequest
```

**响应**

- **201** `LeadPipeline` 

---

### DELETE `/api/leads/pipelines/{id}/` 🔒

Delete pipeline (soft delete by setting is_active=False).

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |

**响应**

- **204** `` No response body

---

### GET `/api/leads/pipelines/{id}/` 🔒

Get pipeline details with all stages.

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |

**响应**

- **200** `LeadPipeline` 

---

### PUT `/api/leads/pipelines/{id}/` 🔒

Update pipeline.

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |

**请求体** `application/json`

```
LeadPipelineRequest
```

**响应**

- **200** `LeadPipeline` 

---

### POST `/api/leads/pipelines/{pipeline_pk}/stages/` 🔒

Add a new stage to pipeline.

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `pipeline_pk` | path | string | ✅ |  |

**请求体** `application/json`

```
LeadStageRequest
```

**响应**

- **201** `LeadStage` 

---

### POST `/api/leads/pipelines/{pipeline_pk}/stages/reorder/` 🔒

Reorder stages by providing ordered list of stage IDs.

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `pipeline_pk` | path | string | ✅ |  |

**请求体** `application/json`

```
StageReorderRequestRequest
```

**响应**

- **200** `` No response body

---

### DELETE `/api/leads/stages/{id}/` 🔒

Delete stage.

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |

**响应**

- **204** `` No response body

---

### PUT `/api/leads/stages/{id}/` 🔒

Update stage.

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |

**请求体** `application/json`

```
LeadStageRequest
```

**响应**

- **200** `LeadStage` 

---

### POST `/api/leads/upload/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `org` | header | string | — |  |

**请求体** `application/json`

```
LeadUploadSwaggerRequest
```

**响应**

- **200** `LeadUploadResponse` 

---

### DELETE `/api/leads/{id}/` 🔒

Lead Delete

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**响应**

- **200** `LeadDeleteResponse` 

---

### GET `/api/leads/{id}/` 🔒

Lead Detail

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**响应**

- **200** `LeadDetailResponse` 

---

### PATCH `/api/leads/{id}/` 🔒

Partial Lead Update

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**请求体** `application/json`

```
PatchedLeadDetailEditSwaggerRequest
```

**响应**

- **200** `LeadPatchResponse` 

---

### POST `/api/leads/{id}/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**请求体** `application/json`

```
LeadDetailEditSwaggerRequest
```

**响应**

- **200** `LeadCommentAttachmentResponse` 

---

### PUT `/api/leads/{id}/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**请求体** `application/json`

```
LeadCreateSwaggerRequest
```

**响应**

- **200** `LeadUpdateResponse` 

---

### PATCH `/api/leads/{id}/move/` 🔒

Move lead to different column and/or position.

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |

**请求体** `application/json`

```
PatchedLeadMoveRequest
```

**响应**

- **200** `` No response body

---
