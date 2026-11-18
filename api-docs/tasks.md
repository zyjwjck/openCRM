# 客户关系管理 — 任务 & 看板

> 共 34 个端点。🔒 = 需要登录（JWT），🟢 = 无需鉴权。

## 端点速览

| 方法 | 路径 | 鉴权 | 说明 |
|------|------|------|------|
| GET | `/api/boards/` | 🔒 | List all boards for the user's organization |
| POST | `/api/boards/` | 🔒 | Create a new board with default columns |
| GET | `/api/boards/columns/{column_pk}/tasks/` | 🔒 | List all tasks for a column |
| POST | `/api/boards/columns/{column_pk}/tasks/` | 🔒 | Create a new task |
| DELETE | `/api/boards/tasks/{id}/` | 🔒 | Delete task |
| PUT | `/api/boards/tasks/{id}/` | 🔒 | Update task (including moving to different column) |
| GET | `/api/boards/{board_pk}/columns/` | 🔒 | List all columns for a board |
| POST | `/api/boards/{board_pk}/columns/` | 🔒 | Create a new column |
| DELETE | `/api/boards/{id}/` | 🔒 | Delete board (owner only) |
| GET | `/api/boards/{id}/` | 🔒 | Get board details with columns and tasks |
| PATCH | `/api/boards/{id}/` | 🔒 | Partial Board Update |
| PUT | `/api/boards/{id}/` | 🔒 | Update board |
| GET | `/api/tasks/` | 🔒 |  |
| POST | `/api/tasks/` | 🔒 |  |
| DELETE | `/api/tasks/attachment/{id}/` | 🔒 |  |
| DELETE | `/api/tasks/comment/{id}/` | 🔒 |  |
| PATCH | `/api/tasks/comment/{id}/` | 🔒 | Partial Comment Update |
| PUT | `/api/tasks/comment/{id}/` | 🔒 |  |
| GET | `/api/tasks/kanban/` | 🔒 | Get kanban board data. |
| GET | `/api/tasks/pipelines/` | 🔒 | List all pipelines for the organization. |
| POST | `/api/tasks/pipelines/` | 🔒 | Create a new pipeline. |
| DELETE | `/api/tasks/pipelines/{id}/` | 🔒 | Delete pipeline (soft delete by setting is_active=False). |
| GET | `/api/tasks/pipelines/{id}/` | 🔒 | Get pipeline details with all stages. |
| PUT | `/api/tasks/pipelines/{id}/` | 🔒 | Update pipeline. |
| POST | `/api/tasks/pipelines/{pipeline_pk}/stages/` | 🔒 | Add a new stage to pipeline. |
| POST | `/api/tasks/pipelines/{pipeline_pk}/stages/reorder/` | 🔒 | Reorder stages by providing ordered list of stage IDs. |
| DELETE | `/api/tasks/stages/{id}/` | 🔒 | Delete stage. |
| PUT | `/api/tasks/stages/{id}/` | 🔒 | Update stage. |
| DELETE | `/api/tasks/{id}/` | 🔒 |  |
| GET | `/api/tasks/{id}/` | 🔒 |  |
| PATCH | `/api/tasks/{id}/` | 🔒 | Partial Task Update |
| POST | `/api/tasks/{id}/` | 🔒 |  |
| PUT | `/api/tasks/{id}/` | 🔒 |  |
| PATCH | `/api/tasks/{id}/move/` | 🔒 | Move task to different column and/or position. |

## 端点详情

### GET `/api/boards/` 🔒

List all boards for the user's organization

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `archived` | query | boolean | — | Filter archived boards |
| `org` | query | string | ✅ | Organization ID |
| `search` | query | string | — | Search in board name |

**响应**

- **200** `array` 

---

### POST `/api/boards/` 🔒

Create a new board with default columns

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `org` | query | string | ✅ | Organization ID |

**请求体** `application/json`

```
BoardRequest
```

**响应**

- **201** `Board` 

---

### GET `/api/boards/columns/{column_pk}/tasks/` 🔒

List all tasks for a column

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `column_pk` | path | string | ✅ |  |
| `org` | query | string | ✅ | Organization ID |

**响应**

- **200** `array` 

---

### POST `/api/boards/columns/{column_pk}/tasks/` 🔒

Create a new task

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `column_pk` | path | string | ✅ |  |
| `org` | query | string | ✅ | Organization ID |

**请求体** `application/json`

```
BoardTaskRequest
```

**响应**

- **201** `BoardTask` 

---

### DELETE `/api/boards/tasks/{id}/` 🔒

Delete task

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | query | string | ✅ | Organization ID |

**响应**

- **204** `` No response body

---

### PUT `/api/boards/tasks/{id}/` 🔒

Update task (including moving to different column)

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | query | string | ✅ | Organization ID |

**请求体** `application/json`

```
BoardTaskRequest
```

**响应**

- **200** `BoardTask` 

---

### GET `/api/boards/{board_pk}/columns/` 🔒

List all columns for a board

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `board_pk` | path | string | ✅ |  |
| `org` | query | string | ✅ | Organization ID |

**响应**

- **200** `array` 

---

### POST `/api/boards/{board_pk}/columns/` 🔒

Create a new column

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `board_pk` | path | string | ✅ |  |
| `org` | query | string | ✅ | Organization ID |

**请求体** `application/json`

```
BoardColumnRequest
```

**响应**

- **201** `BoardColumn` 

---

### DELETE `/api/boards/{id}/` 🔒

Delete board (owner only)

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | query | string | ✅ | Organization ID |

**响应**

- **204** `` No response body

---

### GET `/api/boards/{id}/` 🔒

Get board details with columns and tasks

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | query | string | ✅ | Organization ID |

**响应**

- **200** `Board` 

---

### PATCH `/api/boards/{id}/` 🔒

Partial Board Update

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | query | string | ✅ | Organization ID |

**请求体** `application/json`

```
PatchedBoardRequest
```

**响应**

- **200** `Board` 

---

### PUT `/api/boards/{id}/` 🔒

Update board

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | query | string | ✅ | Organization ID |

**请求体** `application/json`

```
BoardRequest
```

**响应**

- **200** `Board` 

---

### GET `/api/tasks/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `org` | header | string | — |  |
| `priority` | query | string | — |  |
| `status` | query | string | — |  |
| `title` | query | string | — |  |

**响应**

- **200** `TaskListResponse` 

---

### POST `/api/tasks/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `org` | header | string | — |  |

**请求体** `application/json`

```
TaskCreateSwaggerRequest
```

**响应**

- **200** `TaskCreateResponse` 

---

### DELETE `/api/tasks/attachment/{id}/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**响应**

- **200** `TaskAttachmentDeleteResponse` 

---

### DELETE `/api/tasks/comment/{id}/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**响应**

- **200** `TaskCommentDeleteResponse` 

---

### PATCH `/api/tasks/comment/{id}/` 🔒

Partial Comment Update

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**请求体** `application/json`

```
PatchedTaskCommentEditSwaggerRequest
```

**响应**

- **200** `TaskCommentPatchResponse` 

---

### PUT `/api/tasks/comment/{id}/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**请求体** `application/json`

```
TaskCommentEditSwaggerRequest
```

**响应**

- **200** `TaskCommentUpdateResponse` 

---

### GET `/api/tasks/kanban/` 🔒

Get kanban board data.

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `account` | query | string | — | Filter by account ID |
| `assigned_to` | query | string | — | Filter by assigned user ID |
| `case` | query | string | — | Filter by case ID |
| `due_date__gte` | query | string | — | Due date from |
| `due_date__lte` | query | string | — | Due date to |
| `lead` | query | string | — | Filter by lead ID |
| `opportunity` | query | string | — | Filter by opportunity ID |
| `org` | query | string | ✅ |  |
| `pipeline_id` | query | string | — | Pipeline ID. If not provided, uses status-based columns |
| `priority` | query | string | — | Filter by priority (Low/Medium/High) |
| `search` | query | string | — | Search in title and description |

**响应**

- **200** `` No response body

---

### GET `/api/tasks/pipelines/` 🔒

List all pipelines for the organization.

**响应**

- **200** `array` 

---

### POST `/api/tasks/pipelines/` 🔒

Create a new pipeline.

**请求体** `application/json`

```
TaskPipelineRequest
```

**响应**

- **201** `TaskPipeline` 

---

### DELETE `/api/tasks/pipelines/{id}/` 🔒

Delete pipeline (soft delete by setting is_active=False).

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |

**响应**

- **204** `` No response body

---

### GET `/api/tasks/pipelines/{id}/` 🔒

Get pipeline details with all stages.

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |

**响应**

- **200** `TaskPipeline` 

---

### PUT `/api/tasks/pipelines/{id}/` 🔒

Update pipeline.

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |

**请求体** `application/json`

```
TaskPipelineRequest
```

**响应**

- **200** `TaskPipeline` 

---

### POST `/api/tasks/pipelines/{pipeline_pk}/stages/` 🔒

Add a new stage to pipeline.

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `pipeline_pk` | path | string | ✅ |  |

**请求体** `application/json`

```
TaskStageRequest
```

**响应**

- **201** `TaskStage` 

---

### POST `/api/tasks/pipelines/{pipeline_pk}/stages/reorder/` 🔒

Reorder stages by providing ordered list of stage IDs.

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `pipeline_pk` | path | string | ✅ |  |

**请求体** `application/json`

```
TaskStageReorderRequestRequest
```

**响应**

- **200** `` No response body

---

### DELETE `/api/tasks/stages/{id}/` 🔒

Delete stage.

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |

**响应**

- **204** `` No response body

---

### PUT `/api/tasks/stages/{id}/` 🔒

Update stage.

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |

**请求体** `application/json`

```
TaskStageRequest
```

**响应**

- **200** `TaskStage` 

---

### DELETE `/api/tasks/{id}/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**响应**

- **200** `TaskDeleteResponse` 

---

### GET `/api/tasks/{id}/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**响应**

- **200** `TaskDetailResponse` 

---

### PATCH `/api/tasks/{id}/` 🔒

Partial Task Update

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**请求体** `application/json`

```
PatchedTaskCreateSwaggerRequest
```

**响应**

- **200** `TaskPatchResponse` 

---

### POST `/api/tasks/{id}/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**请求体** `application/json`

```
TaskDetailEditSwaggerRequest
```

**响应**

- **200** `TaskCommentAttachmentResponse` 

---

### PUT `/api/tasks/{id}/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**请求体** `application/json`

```
TaskCreateSwaggerRequest
```

**响应**

- **200** `TaskUpdateResponse` 

---

### PATCH `/api/tasks/{id}/move/` 🔒

Move task to different column and/or position.

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |

**请求体** `application/json`

```
PatchedTaskMoveRequest
```

**响应**

- **200** `` No response body

---
