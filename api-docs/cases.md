# 客户关系管理 — 工单

> 共 30 个端点。🔒 = 需要登录（JWT），🟢 = 无需鉴权。

## 端点速览

| 方法 | 路径 | 鉴权 | 说明 |
|------|------|------|------|
| GET | `/api/cases/` | 🔒 |  |
| POST | `/api/cases/` | 🔒 |  |
| DELETE | `/api/cases/attachment/{id}/` | 🔒 |  |
| DELETE | `/api/cases/comment/{id}/` | 🔒 |  |
| PATCH | `/api/cases/comment/{id}/` | 🔒 | Partial Comment Update |
| PUT | `/api/cases/comment/{id}/` | 🔒 |  |
| GET | `/api/cases/kanban/` | 🔒 | Get kanban board data. |
| GET | `/api/cases/pipelines/` | 🔒 | List all pipelines for the organization. |
| POST | `/api/cases/pipelines/` | 🔒 | Create a new pipeline. |
| DELETE | `/api/cases/pipelines/{id}/` | 🔒 | Retrieve, update, delete a pipeline. |
| GET | `/api/cases/pipelines/{id}/` | 🔒 | Retrieve, update, delete a pipeline. |
| PUT | `/api/cases/pipelines/{id}/` | 🔒 | Retrieve, update, delete a pipeline. |
| POST | `/api/cases/pipelines/{pipeline_pk}/stages/` | 🔒 | Create a stage in a pipeline. |
| POST | `/api/cases/pipelines/{pipeline_pk}/stages/reorder/` | 🔒 | Bulk reorder stages in a pipeline. |
| GET | `/api/cases/solutions/` | 🔒 | List all solutions with filters |
| POST | `/api/cases/solutions/` | 🔒 | Create a new solution |
| DELETE | `/api/cases/solutions/{id}/` | 🔒 | Delete solution |
| GET | `/api/cases/solutions/{id}/` | 🔒 | Get solution details |
| PATCH | `/api/cases/solutions/{id}/` | 🔒 | Partially update solution |
| PUT | `/api/cases/solutions/{id}/` | 🔒 | Update solution |
| POST | `/api/cases/solutions/{id}/publish/` | 🔒 | Publish an approved solution |
| POST | `/api/cases/solutions/{id}/unpublish/` | 🔒 | Unpublish a solution |
| DELETE | `/api/cases/stages/{id}/` | 🔒 | Update or delete a stage. |
| PUT | `/api/cases/stages/{id}/` | 🔒 | Update or delete a stage. |
| DELETE | `/api/cases/{id}/` | 🔒 |  |
| GET | `/api/cases/{id}/` | 🔒 |  |
| PATCH | `/api/cases/{id}/` | 🔒 | Partial Case Update |
| POST | `/api/cases/{id}/` | 🔒 |  |
| PUT | `/api/cases/{id}/` | 🔒 |  |
| PATCH | `/api/cases/{id}/move/` | 🔒 | Move case to different column and/or position. |

## 端点详情

### GET `/api/cases/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `account` | query | string | — |  |
| `name` | query | string | — |  |
| `org` | header | string | — |  |
| `priority` | query | string | — |  |
| `status` | query | string | — |  |

**响应**

- **200** `CaseListResponse` 

---

### POST `/api/cases/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `org` | header | string | — |  |

**请求体** `application/json`

```
CaseCreateSwaggerRequest
```

**响应**

- **200** `CaseCreateResponse` 

---

### DELETE `/api/cases/attachment/{id}/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**响应**

- **200** `CaseAttachmentDeleteResponse` 

---

### DELETE `/api/cases/comment/{id}/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**响应**

- **200** `CaseCommentDeleteResponse` 

---

### PATCH `/api/cases/comment/{id}/` 🔒

Partial Comment Update

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**请求体** `application/json`

```
PatchedCaseCommentEditSwaggerRequest
```

**响应**

- **200** `CaseCommentPatchResponse` 

---

### PUT `/api/cases/comment/{id}/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**请求体** `application/json`

```
CaseCommentEditSwaggerRequest
```

**响应**

- **200** `CaseCommentUpdateResponse` 

---

### GET `/api/cases/kanban/` 🔒

Get kanban board data.

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `account` | query | string | — | Filter by account ID |
| `assigned_to` | query | string | — | Filter by assigned user ID |
| `case_type` | query | string | — | Filter by case type (Question/Incident/Problem) |
| `org` | query | string | ✅ |  |
| `pipeline_id` | query | string | — | Pipeline ID. If not provided, uses status-based columns |
| `priority` | query | string | — | Filter by priority (Low/Normal/High/Urgent) |
| `search` | query | string | — | Search in name and description |

**响应**

- **200** `` No response body

---

### GET `/api/cases/pipelines/` 🔒

List all pipelines for the organization.

**响应**

- **200** `array` 

---

### POST `/api/cases/pipelines/` 🔒

Create a new pipeline.

**请求体** `application/json`

```
CasePipelineRequest
```

**响应**

- **201** `CasePipeline` 

---

### DELETE `/api/cases/pipelines/{id}/` 🔒

Retrieve, update, delete a pipeline.

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |

**响应**

- **204** `` No response body

---

### GET `/api/cases/pipelines/{id}/` 🔒

Retrieve, update, delete a pipeline.

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |

**响应**

- **200** `CasePipeline` 

---

### PUT `/api/cases/pipelines/{id}/` 🔒

Retrieve, update, delete a pipeline.

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |

**请求体** `application/json`

```
CasePipelineRequest
```

**响应**

- **200** `CasePipeline` 

---

### POST `/api/cases/pipelines/{pipeline_pk}/stages/` 🔒

Create a stage in a pipeline.

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `pipeline_pk` | path | string | ✅ |  |

**请求体** `application/json`

```
CaseStageRequest
```

**响应**

- **201** `CaseStage` 

---

### POST `/api/cases/pipelines/{pipeline_pk}/stages/reorder/` 🔒

Bulk reorder stages in a pipeline.

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `pipeline_pk` | path | string | ✅ |  |

**请求体** `application/json`

```
CaseStageReorderRequestRequest
```

**响应**

- **200** `` No response body

---

### GET `/api/cases/solutions/` 🔒

List all solutions with filters

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `is_published` | query | boolean | — | Filter by published status |
| `search` | query | string | — | Search in title and description |
| `status` | query | string | — | Filter by status (draft/reviewed/approved) |

**响应**

- **200** `array` 

---

### POST `/api/cases/solutions/` 🔒

Create a new solution

**请求体** `application/json`

```
SolutionCreateUpdateRequest
```

**响应**

- **201** `Solution` 

---

### DELETE `/api/cases/solutions/{id}/` 🔒

Delete solution

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |

**响应**

- **204** `` No response body

---

### GET `/api/cases/solutions/{id}/` 🔒

Get solution details

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |

**响应**

- **200** `SolutionDetail` 

---

### PATCH `/api/cases/solutions/{id}/` 🔒

Partially update solution

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |

**请求体** `application/json`

```
PatchedSolutionCreateUpdateRequest
```

**响应**

- **200** `Solution` 

---

### PUT `/api/cases/solutions/{id}/` 🔒

Update solution

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |

**请求体** `application/json`

```
SolutionCreateUpdateRequest
```

**响应**

- **200** `Solution` 

---

### POST `/api/cases/solutions/{id}/publish/` 🔒

Publish an approved solution

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |

**响应**

- **200** `Solution` 

---

### POST `/api/cases/solutions/{id}/unpublish/` 🔒

Unpublish a solution

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |

**响应**

- **200** `Solution` 

---

### DELETE `/api/cases/stages/{id}/` 🔒

Update or delete a stage.

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |

**响应**

- **204** `` No response body

---

### PUT `/api/cases/stages/{id}/` 🔒

Update or delete a stage.

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |

**请求体** `application/json`

```
CaseStageRequest
```

**响应**

- **200** `CaseStage` 

---

### DELETE `/api/cases/{id}/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**响应**

- **200** `CaseDeleteResponse` 

---

### GET `/api/cases/{id}/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**响应**

- **200** `CaseDetailResponse` 

---

### PATCH `/api/cases/{id}/` 🔒

Partial Case Update

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**请求体** `application/json`

```
PatchedCaseCreateSwaggerRequest
```

**响应**

- **200** `CasePatchResponse` 

---

### POST `/api/cases/{id}/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**请求体** `application/json`

```
CaseDetailEditSwaggerRequest
```

**响应**

- **200** `CaseCommentAttachmentResponse` 

---

### PUT `/api/cases/{id}/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**请求体** `application/json`

```
CaseCreateSwaggerRequest
```

**响应**

- **200** `CaseUpdateResponse` 

---

### PATCH `/api/cases/{id}/move/` 🔒

Move case to different column and/or position.

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |

**请求体** `application/json`

```
PatchedCaseMoveRequest
```

**响应**

- **200** `` No response body

---
