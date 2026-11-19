# 客户关系管理 — 任务 & 看板

> 共 34 个端点。🔒 = 需要登录（JWT），🟢 = 无需鉴权。
> 任务 CRUD + 看板管道/阶段 + 独立看板 Boards（Board/Column/BoardTask）API。GET /api/tasks/ 返回**聚合 dict**（tasks + accounts_list + contacts_list + 下拉选项）。

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
| GET | `/api/tasks/` | 🔒 | 列表查询 |
| POST | `/api/tasks/` | 🔒 | 新建任务 |
| DELETE | `/api/tasks/attachment/{id}/` | 🔒 | 删除 |
| DELETE | `/api/tasks/comment/{id}/` | 🔒 | 删除评论 |
| PATCH | `/api/tasks/comment/{id}/` | 🔒 | 部分更新评论 |
| PUT | `/api/tasks/comment/{id}/` | 🔒 | 全量更新 |
| GET | `/api/tasks/kanban/` | 🔒 | 获取看板数据 . |
| GET | `/api/tasks/pipelines/` | 🔒 | 列出组织的所有管道 . |
| POST | `/api/tasks/pipelines/` | 🔒 | 新建管道 . |
| DELETE | `/api/tasks/pipelines/{id}/` | 🔒 | Delete pipeline (soft delete by setting is_active=False). |
| GET | `/api/tasks/pipelines/{id}/` | 🔒 | Get pipeline details with all stages. |
| PUT | `/api/tasks/pipelines/{id}/` | 🔒 | Update pipeline. |
| POST | `/api/tasks/pipelines/{pipeline_pk}/stages/` | 🔒 | Add a new stage to pipeline. |
| POST | `/api/tasks/pipelines/{pipeline_pk}/stages/reorder/` | 🔒 | Reorder stages by providing ordered list of stage IDs. |
| DELETE | `/api/tasks/stages/{id}/` | 🔒 | Delete stage. |
| PUT | `/api/tasks/stages/{id}/` | 🔒 | Update stage. |
| DELETE | `/api/tasks/{id}/` | 🔒 | 删除 |
| GET | `/api/tasks/{id}/` | 🔒 | 获取详情 |
| PATCH | `/api/tasks/{id}/` | 🔒 | 部分更新任务 |
| POST | `/api/tasks/{id}/` | 🔒 | 编辑任务详情（含附件/评论） |
| PUT | `/api/tasks/{id}/` | 🔒 | 新建任务 |
| PATCH | `/api/tasks/{id}/move/` | 🔒 | 移动任务到不同列/位置 . |

## 端点详情

### GET `/api/boards/` 🔒

List all boards for the user's organization

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `archived` | query | boolean | — | Filter archived boards |
| `org` | query | string | ✅ | Organization ID |
| `search` | query | string | — | Search in board name |

**200** → `Paginated[Board]`

> ✅ 后端实测: DRF 分页响应，0 字段

**Schema: `Paginated[Board]（后端实测）`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `count` | integer(int64) | ✅ | 总记录数 | — |
| `next` | string(uri) | ✅ | 下一页 URL | 可空 |
| `previous` | string(uri) | ✅ | 上一页 URL | 可空 |
| `results` | [Board] | ✅ | 当前页 `Board` 列表 | — |
| `results[].id` | string(uuid) | ✅ | — | 只读 |
| `results[].owner` | any | ✅ | — | 只读 |
| `results[].columns` | [BoardColumnList] | ✅ | — | 只读 |
| `results[].columns[].id` | string(uuid) | ✅ | — | 只读 |
| `results[].columns[].name` | string | ✅ | — | ≤100字符 |
| `results[].columns[].order` | integer(int64) | — | — | — |
| `results[].columns[].color` | string | — | — | ≤7字符 |
| `results[].columns[].limit` | integer(int64) | — | — | 可空 |
| `results[].columns[].task_count` | integer | ✅ | — | 只读 |
| `results[].members` | [BoardMember] | ✅ | — | 只读 |
| `results[].members[].id` | string(uuid) | ✅ | — | 只读 |
| `results[].members[].profile` | any | ✅ | — | 只读 |
| `results[].members[].created_at` | string(date-time) | ✅ | — | 只读 |
| `results[].members[].updated_at` | string(date-time) | ✅ | Last Modified At | 只读 |
| `results[].members[].role` | → BoardMemberRoleEnum | — | — | — |
| `results[].members[].created_by` | string(uuid) | — | — | 可空 |
| `results[].members[].updated_by` | string(uuid) | — | Last Modified By | 可空 |
| `results[].members[].board` | string(uuid) | ✅ | — | 只读 |
| `results[].members[].org` | string(uuid) | ✅ | — | — |
| `results[].member_count` | integer | ✅ | — | 只读 |
| `results[].task_count` | integer | ✅ | — | 只读 |
| `results[].created_at` | string(date-time) | ✅ | — | 只读 |
| `results[].updated_at` | string(date-time) | ✅ | Last Modified At | 只读 |
| `results[].name` | string | ✅ | — | ≤255字符 |
| `results[].description` | string | — | — | 可空 |
| `results[].is_archived` | boolean | — | — | — |
| `results[].created_by` | string(uuid) | ✅ | — | 只读; 可空 |
| `results[].updated_by` | string(uuid) | ✅ | Last Modified By | 只读; 可空 |
| `results[].org` | string(uuid) | ✅ | — | 只读 |

**可能的错误响应（DRF 标准）**

- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）
- **400**: 请求参数校验失败（query/header/body 不合法）

---
### POST `/api/boards/` 🔒

Create a new board with default columns

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `org` | query | string | ✅ | Organization ID |

**请求体** `application/json`

> 新建/编辑看板

**Schema: `BoardRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `name` | string | ✅ | — | ≤255字符 |
| `description` | string | — | — | 可空 |
| `is_archived` | boolean | — | — | — |

**201** → `Board`

**Schema: `Board`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `id` | string(uuid) | ✅ | — | 只读 |
| `owner` | any | ✅ | — | 只读 |
| `columns` | [BoardColumnList] | ✅ | — | 只读 |
| `columns[].id` | string(uuid) | ✅ | — | 只读 |
| `columns[].name` | string | ✅ | — | ≤100字符 |
| `columns[].order` | integer(int64) | — | — | — |
| `columns[].color` | string | — | — | ≤7字符 |
| `columns[].limit` | integer(int64) | — | — | 可空 |
| `columns[].task_count` | integer | ✅ | — | 只读 |
| `members` | [BoardMember] | ✅ | — | 只读 |
| `members[].id` | string(uuid) | ✅ | — | 只读 |
| `members[].profile` | any | ✅ | — | 只读 |
| `members[].created_at` | string(date-time) | ✅ | — | 只读 |
| `members[].updated_at` | string(date-time) | ✅ | Last Modified At | 只读 |
| `members[].role` | → BoardMemberRoleEnum | — | — | — |
| `members[].created_by` | string(uuid) | — | — | 可空 |
| `members[].updated_by` | string(uuid) | — | Last Modified By | 可空 |
| `members[].board` | string(uuid) | ✅ | — | 只读 |
| `members[].org` | string(uuid) | ✅ | — | — |
| `member_count` | integer | ✅ | — | 只读 |
| `task_count` | integer | ✅ | — | 只读 |
| `created_at` | string(date-time) | ✅ | — | 只读 |
| `updated_at` | string(date-time) | ✅ | Last Modified At | 只读 |
| `name` | string | ✅ | — | ≤255字符 |
| `description` | string | — | — | 可空 |
| `is_archived` | boolean | — | — | — |
| `created_by` | string(uuid) | ✅ | — | 只读; 可空 |
| `updated_by` | string(uuid) | ✅ | Last Modified By | 只读; 可空 |
| `org` | string(uuid) | ✅ | — | 只读 |

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### GET `/api/boards/columns/{column_pk}/tasks/` 🔒

List all tasks for a column

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `column_pk` | path | string | ✅ | — |
| `org` | query | string | ✅ | Organization ID |

**200** → `[BoardTask]`

**Schema: `BoardTask`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `id` | string(uuid) | ✅ | — | 只读 |
| `assigned_to` | [Profile] | ✅ | — | 只读 |
| `assigned_to[].id` | string(uuid) | ✅ | — | 只读 |
| `assigned_to[].user_details` | object | ✅ | — | 只读 |
| `assigned_to[].role` | → ProfileRoleEnum | — | — | — |
| `assigned_to[].address` | string(uuid) | — | — | 可空 |
| `assigned_to[].has_marketing_access` | boolean | — | — | — |
| `assigned_to[].has_sales_access` | boolean | — | — | — |
| `assigned_to[].phone` | string | — | — | 可空; ≤20字符 |
| `assigned_to[].date_of_joining` | string(date) | — | — | 可空 |
| `assigned_to[].is_active` | boolean | — | — | — |
| `assigned_to[].created_at` | string(date-time) | ✅ | — | 只读 |
| `is_completed` | boolean | ✅ | — | 只读 |
| `is_overdue` | boolean | ✅ | — | 只读 |
| `created_at` | string(date-time) | ✅ | — | 只读 |
| `updated_at` | string(date-time) | ✅ | Last Modified At | 只读 |
| `title` | string | ✅ | — | ≤255字符 |
| `description` | string | — | — | 可空 |
| `order` | integer(int64) | — | — | — |
| `priority` | → BoardTaskPriorityEnum | — | — | — |
| `due_date` | string(date-time) | — | — | 可空 |
| `completed_at` | string(date-time) | ✅ | — | 只读; 可空 |
| `created_by` | string(uuid) | — | — | 可空 |
| `updated_by` | string(uuid) | — | Last Modified By | 可空 |
| `column` | string(uuid) | ✅ | — | — |
| `account` | string(uuid) | — | — | 可空 |
| `contact` | string(uuid) | — | — | 可空 |
| `opportunity` | string(uuid) | — | — | 可空 |
| `org` | string(uuid) | ✅ | — | — |

**可能的错误响应（DRF 标准）**

- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）
- **400**: 请求参数校验失败（query/header/body 不合法）

---
### POST `/api/boards/columns/{column_pk}/tasks/` 🔒

Create a new task

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `column_pk` | path | string | ✅ | — |
| `org` | query | string | ✅ | Organization ID |

**请求体** `application/json`

> 新建/编辑看板任务

**Schema: `BoardTaskRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `assigned_to_ids` | [string] | — | — | — |
| `title` | string | ✅ | — | ≤255字符 |
| `description` | string | — | — | 可空 |
| `order` | integer(int64) | — | — | — |
| `priority` | → BoardTaskPriorityEnum | — | — | — |
| `due_date` | string(date-time) | — | — | 可空 |
| `created_by` | string(uuid) | — | — | 可空 |
| `updated_by` | string(uuid) | — | Last Modified By | 可空 |
| `column` | string(uuid) | ✅ | — | — |
| `account` | string(uuid) | — | — | 可空 |
| `contact` | string(uuid) | — | — | 可空 |
| `opportunity` | string(uuid) | — | — | 可空 |
| `org` | string(uuid) | ✅ | — | — |

**201** → `BoardTask`

**Schema: `BoardTask`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `id` | string(uuid) | ✅ | — | 只读 |
| `assigned_to` | [Profile] | ✅ | — | 只读 |
| `assigned_to[].id` | string(uuid) | ✅ | — | 只读 |
| `assigned_to[].user_details` | object | ✅ | — | 只读 |
| `assigned_to[].role` | → ProfileRoleEnum | — | — | — |
| `assigned_to[].address` | string(uuid) | — | — | 可空 |
| `assigned_to[].has_marketing_access` | boolean | — | — | — |
| `assigned_to[].has_sales_access` | boolean | — | — | — |
| `assigned_to[].phone` | string | — | — | 可空; ≤20字符 |
| `assigned_to[].date_of_joining` | string(date) | — | — | 可空 |
| `assigned_to[].is_active` | boolean | — | — | — |
| `assigned_to[].created_at` | string(date-time) | ✅ | — | 只读 |
| `is_completed` | boolean | ✅ | — | 只读 |
| `is_overdue` | boolean | ✅ | — | 只读 |
| `created_at` | string(date-time) | ✅ | — | 只读 |
| `updated_at` | string(date-time) | ✅ | Last Modified At | 只读 |
| `title` | string | ✅ | — | ≤255字符 |
| `description` | string | — | — | 可空 |
| `order` | integer(int64) | — | — | — |
| `priority` | → BoardTaskPriorityEnum | — | — | — |
| `due_date` | string(date-time) | — | — | 可空 |
| `completed_at` | string(date-time) | ✅ | — | 只读; 可空 |
| `created_by` | string(uuid) | — | — | 可空 |
| `updated_by` | string(uuid) | — | Last Modified By | 可空 |
| `column` | string(uuid) | ✅ | — | — |
| `account` | string(uuid) | — | — | 可空 |
| `contact` | string(uuid) | — | — | 可空 |
| `opportunity` | string(uuid) | — | — | 可空 |
| `org` | string(uuid) | ✅ | — | — |

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### DELETE `/api/boards/tasks/{id}/` 🔒

Delete task

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | query | string | ✅ | Organization ID |

**204** → 无响应体（删除成功）

**可能的错误响应（DRF 标准）**

- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）
- **400**: 请求参数校验失败（query/header/body 不合法）

---
### PUT `/api/boards/tasks/{id}/` 🔒

Update task (including moving to different column)

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | query | string | ✅ | Organization ID |

**请求体** `application/json`

> 新建/编辑看板任务

**Schema: `BoardTaskRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `assigned_to_ids` | [string] | — | — | — |
| `title` | string | ✅ | — | ≤255字符 |
| `description` | string | — | — | 可空 |
| `order` | integer(int64) | — | — | — |
| `priority` | → BoardTaskPriorityEnum | — | — | — |
| `due_date` | string(date-time) | — | — | 可空 |
| `created_by` | string(uuid) | — | — | 可空 |
| `updated_by` | string(uuid) | — | Last Modified By | 可空 |
| `column` | string(uuid) | ✅ | — | — |
| `account` | string(uuid) | — | — | 可空 |
| `contact` | string(uuid) | — | — | 可空 |
| `opportunity` | string(uuid) | — | — | 可空 |
| `org` | string(uuid) | ✅ | — | — |

**200** → `BoardTask`

**Schema: `BoardTask`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `id` | string(uuid) | ✅ | — | 只读 |
| `assigned_to` | [Profile] | ✅ | — | 只读 |
| `assigned_to[].id` | string(uuid) | ✅ | — | 只读 |
| `assigned_to[].user_details` | object | ✅ | — | 只读 |
| `assigned_to[].role` | → ProfileRoleEnum | — | — | — |
| `assigned_to[].address` | string(uuid) | — | — | 可空 |
| `assigned_to[].has_marketing_access` | boolean | — | — | — |
| `assigned_to[].has_sales_access` | boolean | — | — | — |
| `assigned_to[].phone` | string | — | — | 可空; ≤20字符 |
| `assigned_to[].date_of_joining` | string(date) | — | — | 可空 |
| `assigned_to[].is_active` | boolean | — | — | — |
| `assigned_to[].created_at` | string(date-time) | ✅ | — | 只读 |
| `is_completed` | boolean | ✅ | — | 只读 |
| `is_overdue` | boolean | ✅ | — | 只读 |
| `created_at` | string(date-time) | ✅ | — | 只读 |
| `updated_at` | string(date-time) | ✅ | Last Modified At | 只读 |
| `title` | string | ✅ | — | ≤255字符 |
| `description` | string | — | — | 可空 |
| `order` | integer(int64) | — | — | — |
| `priority` | → BoardTaskPriorityEnum | — | — | — |
| `due_date` | string(date-time) | — | — | 可空 |
| `completed_at` | string(date-time) | ✅ | — | 只读; 可空 |
| `created_by` | string(uuid) | — | — | 可空 |
| `updated_by` | string(uuid) | — | Last Modified By | 可空 |
| `column` | string(uuid) | ✅ | — | — |
| `account` | string(uuid) | — | — | 可空 |
| `contact` | string(uuid) | — | — | 可空 |
| `opportunity` | string(uuid) | — | — | 可空 |
| `org` | string(uuid) | ✅ | — | — |

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### GET `/api/boards/{board_pk}/columns/` 🔒

List all columns for a board

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `board_pk` | path | string | ✅ | — |
| `org` | query | string | ✅ | Organization ID |

**200** → `[BoardColumn]`

**Schema: `BoardColumn`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `id` | string(uuid) | ✅ | — | 只读 |
| `tasks` | [BoardTask] | ✅ | — | 只读 |
| `tasks[].id` | string(uuid) | ✅ | — | 只读 |
| `tasks[].assigned_to` | [Profile] | ✅ | — | 只读 |
| `tasks[].assigned_to[].id` | string(uuid) | ✅ | — | 只读 |
| `tasks[].assigned_to[].user_details` | object | ✅ | — | 只读 |
| `tasks[].assigned_to[].role` | → ProfileRoleEnum | — | — | — |
| `tasks[].assigned_to[].address` | string(uuid) | — | — | 可空 |
| `tasks[].assigned_to[].has_marketing_access` | boolean | — | — | — |
| `tasks[].assigned_to[].has_sales_access` | boolean | — | — | — |
| `tasks[].assigned_to[].phone` | string | — | — | 可空; ≤20字符 |
| `tasks[].assigned_to[].date_of_joining` | string(date) | — | — | 可空 |
| `tasks[].assigned_to[].is_active` | boolean | — | — | — |
| `tasks[].assigned_to[].created_at` | string(date-time) | ✅ | — | 只读 |
| `tasks[].is_completed` | boolean | ✅ | — | 只读 |
| `tasks[].is_overdue` | boolean | ✅ | — | 只读 |
| `tasks[].created_at` | string(date-time) | ✅ | — | 只读 |
| `tasks[].updated_at` | string(date-time) | ✅ | Last Modified At | 只读 |
| `tasks[].title` | string | ✅ | — | ≤255字符 |
| `tasks[].description` | string | — | — | 可空 |
| `tasks[].order` | integer(int64) | — | — | — |
| `tasks[].priority` | → BoardTaskPriorityEnum | — | — | — |
| `tasks[].due_date` | string(date-time) | — | — | 可空 |
| `tasks[].completed_at` | string(date-time) | ✅ | — | 只读; 可空 |
| `tasks[].created_by` | string(uuid) | — | — | 可空 |
| `tasks[].updated_by` | string(uuid) | — | Last Modified By | 可空 |
| `tasks[].column` | string(uuid) | ✅ | — | — |
| `tasks[].account` | string(uuid) | — | — | 可空 |
| `tasks[].contact` | string(uuid) | — | — | 可空 |
| `tasks[].opportunity` | string(uuid) | — | — | 可空 |
| `tasks[].org` | string(uuid) | ✅ | — | — |
| `task_count` | integer | ✅ | — | 只读 |
| `created_at` | string(date-time) | ✅ | — | 只读 |
| `updated_at` | string(date-time) | ✅ | Last Modified At | 只读 |
| `name` | string | ✅ | — | ≤100字符 |
| `order` | integer(int64) | — | — | — |
| `color` | string | — | — | ≤7字符 |
| `limit` | integer(int64) | — | — | 可空 |
| `created_by` | string(uuid) | — | — | 可空 |
| `updated_by` | string(uuid) | — | Last Modified By | 可空 |
| `board` | string(uuid) | ✅ | — | 只读 |
| `org` | string(uuid) | ✅ | — | — |

**可能的错误响应（DRF 标准）**

- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）
- **400**: 请求参数校验失败（query/header/body 不合法）

---
### POST `/api/boards/{board_pk}/columns/` 🔒

Create a new column

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `board_pk` | path | string | ✅ | — |
| `org` | query | string | ✅ | Organization ID |

**请求体** `application/json`

> 新建/编辑看板列

**Schema: `BoardColumnRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `name` | string | ✅ | — | ≤100字符 |
| `order` | integer(int64) | — | — | — |
| `color` | string | — | — | ≤7字符 |
| `limit` | integer(int64) | — | — | 可空 |
| `created_by` | string(uuid) | — | — | 可空 |
| `updated_by` | string(uuid) | — | Last Modified By | 可空 |
| `org` | string(uuid) | ✅ | — | — |

**201** → `BoardColumn`

**Schema: `BoardColumn`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `id` | string(uuid) | ✅ | — | 只读 |
| `tasks` | [BoardTask] | ✅ | — | 只读 |
| `tasks[].id` | string(uuid) | ✅ | — | 只读 |
| `tasks[].assigned_to` | [Profile] | ✅ | — | 只读 |
| `tasks[].assigned_to[].id` | string(uuid) | ✅ | — | 只读 |
| `tasks[].assigned_to[].user_details` | object | ✅ | — | 只读 |
| `tasks[].assigned_to[].role` | → ProfileRoleEnum | — | — | — |
| `tasks[].assigned_to[].address` | string(uuid) | — | — | 可空 |
| `tasks[].assigned_to[].has_marketing_access` | boolean | — | — | — |
| `tasks[].assigned_to[].has_sales_access` | boolean | — | — | — |
| `tasks[].assigned_to[].phone` | string | — | — | 可空; ≤20字符 |
| `tasks[].assigned_to[].date_of_joining` | string(date) | — | — | 可空 |
| `tasks[].assigned_to[].is_active` | boolean | — | — | — |
| `tasks[].assigned_to[].created_at` | string(date-time) | ✅ | — | 只读 |
| `tasks[].is_completed` | boolean | ✅ | — | 只读 |
| `tasks[].is_overdue` | boolean | ✅ | — | 只读 |
| `tasks[].created_at` | string(date-time) | ✅ | — | 只读 |
| `tasks[].updated_at` | string(date-time) | ✅ | Last Modified At | 只读 |
| `tasks[].title` | string | ✅ | — | ≤255字符 |
| `tasks[].description` | string | — | — | 可空 |
| `tasks[].order` | integer(int64) | — | — | — |
| `tasks[].priority` | → BoardTaskPriorityEnum | — | — | — |
| `tasks[].due_date` | string(date-time) | — | — | 可空 |
| `tasks[].completed_at` | string(date-time) | ✅ | — | 只读; 可空 |
| `tasks[].created_by` | string(uuid) | — | — | 可空 |
| `tasks[].updated_by` | string(uuid) | — | Last Modified By | 可空 |
| `tasks[].column` | string(uuid) | ✅ | — | — |
| `tasks[].account` | string(uuid) | — | — | 可空 |
| `tasks[].contact` | string(uuid) | — | — | 可空 |
| `tasks[].opportunity` | string(uuid) | — | — | 可空 |
| `tasks[].org` | string(uuid) | ✅ | — | — |
| `task_count` | integer | ✅ | — | 只读 |
| `created_at` | string(date-time) | ✅ | — | 只读 |
| `updated_at` | string(date-time) | ✅ | Last Modified At | 只读 |
| `name` | string | ✅ | — | ≤100字符 |
| `order` | integer(int64) | — | — | — |
| `color` | string | — | — | ≤7字符 |
| `limit` | integer(int64) | — | — | 可空 |
| `created_by` | string(uuid) | — | — | 可空 |
| `updated_by` | string(uuid) | — | Last Modified By | 可空 |
| `board` | string(uuid) | ✅ | — | 只读 |
| `org` | string(uuid) | ✅ | — | — |

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### DELETE `/api/boards/{id}/` 🔒

Delete board (owner only)

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | query | string | ✅ | Organization ID |

**204** → 无响应体（删除成功）

**可能的错误响应（DRF 标准）**

- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）
- **400**: 请求参数校验失败（query/header/body 不合法）

---
### GET `/api/boards/{id}/` 🔒

Get board details with columns and tasks

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | query | string | ✅ | Organization ID |

**200** → `Board`

**Schema: `Board`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `id` | string(uuid) | ✅ | — | 只读 |
| `owner` | any | ✅ | — | 只读 |
| `columns` | [BoardColumnList] | ✅ | — | 只读 |
| `columns[].id` | string(uuid) | ✅ | — | 只读 |
| `columns[].name` | string | ✅ | — | ≤100字符 |
| `columns[].order` | integer(int64) | — | — | — |
| `columns[].color` | string | — | — | ≤7字符 |
| `columns[].limit` | integer(int64) | — | — | 可空 |
| `columns[].task_count` | integer | ✅ | — | 只读 |
| `members` | [BoardMember] | ✅ | — | 只读 |
| `members[].id` | string(uuid) | ✅ | — | 只读 |
| `members[].profile` | any | ✅ | — | 只读 |
| `members[].created_at` | string(date-time) | ✅ | — | 只读 |
| `members[].updated_at` | string(date-time) | ✅ | Last Modified At | 只读 |
| `members[].role` | → BoardMemberRoleEnum | — | — | — |
| `members[].created_by` | string(uuid) | — | — | 可空 |
| `members[].updated_by` | string(uuid) | — | Last Modified By | 可空 |
| `members[].board` | string(uuid) | ✅ | — | 只读 |
| `members[].org` | string(uuid) | ✅ | — | — |
| `member_count` | integer | ✅ | — | 只读 |
| `task_count` | integer | ✅ | — | 只读 |
| `created_at` | string(date-time) | ✅ | — | 只读 |
| `updated_at` | string(date-time) | ✅ | Last Modified At | 只读 |
| `name` | string | ✅ | — | ≤255字符 |
| `description` | string | — | — | 可空 |
| `is_archived` | boolean | — | — | — |
| `created_by` | string(uuid) | ✅ | — | 只读; 可空 |
| `updated_by` | string(uuid) | ✅ | Last Modified By | 只读; 可空 |
| `org` | string(uuid) | ✅ | — | 只读 |

**可能的错误响应（DRF 标准）**

- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）
- **400**: 请求参数校验失败（query/header/body 不合法）

---
### PATCH `/api/boards/{id}/` 🔒

Partial Board Update

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | query | string | ✅ | Organization ID |

**请求体** `application/json`

**Schema: `PatchedBoardRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `name` | string | — | — | ≤255字符 |
| `description` | string | — | — | 可空 |
| `is_archived` | boolean | — | — | — |

**200** → `Board`

**Schema: `Board`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `id` | string(uuid) | ✅ | — | 只读 |
| `owner` | any | ✅ | — | 只读 |
| `columns` | [BoardColumnList] | ✅ | — | 只读 |
| `columns[].id` | string(uuid) | ✅ | — | 只读 |
| `columns[].name` | string | ✅ | — | ≤100字符 |
| `columns[].order` | integer(int64) | — | — | — |
| `columns[].color` | string | — | — | ≤7字符 |
| `columns[].limit` | integer(int64) | — | — | 可空 |
| `columns[].task_count` | integer | ✅ | — | 只读 |
| `members` | [BoardMember] | ✅ | — | 只读 |
| `members[].id` | string(uuid) | ✅ | — | 只读 |
| `members[].profile` | any | ✅ | — | 只读 |
| `members[].created_at` | string(date-time) | ✅ | — | 只读 |
| `members[].updated_at` | string(date-time) | ✅ | Last Modified At | 只读 |
| `members[].role` | → BoardMemberRoleEnum | — | — | — |
| `members[].created_by` | string(uuid) | — | — | 可空 |
| `members[].updated_by` | string(uuid) | — | Last Modified By | 可空 |
| `members[].board` | string(uuid) | ✅ | — | 只读 |
| `members[].org` | string(uuid) | ✅ | — | — |
| `member_count` | integer | ✅ | — | 只读 |
| `task_count` | integer | ✅ | — | 只读 |
| `created_at` | string(date-time) | ✅ | — | 只读 |
| `updated_at` | string(date-time) | ✅ | Last Modified At | 只读 |
| `name` | string | ✅ | — | ≤255字符 |
| `description` | string | — | — | 可空 |
| `is_archived` | boolean | — | — | — |
| `created_by` | string(uuid) | ✅ | — | 只读; 可空 |
| `updated_by` | string(uuid) | ✅ | Last Modified By | 只读; 可空 |
| `org` | string(uuid) | ✅ | — | 只读 |

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### PUT `/api/boards/{id}/` 🔒

Update board

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | query | string | ✅ | Organization ID |

**请求体** `application/json`

> 新建/编辑看板

**Schema: `BoardRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `name` | string | ✅ | — | ≤255字符 |
| `description` | string | — | — | 可空 |
| `is_archived` | boolean | — | — | — |

**200** → `Board`

**Schema: `Board`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `id` | string(uuid) | ✅ | — | 只读 |
| `owner` | any | ✅ | — | 只读 |
| `columns` | [BoardColumnList] | ✅ | — | 只读 |
| `columns[].id` | string(uuid) | ✅ | — | 只读 |
| `columns[].name` | string | ✅ | — | ≤100字符 |
| `columns[].order` | integer(int64) | — | — | — |
| `columns[].color` | string | — | — | ≤7字符 |
| `columns[].limit` | integer(int64) | — | — | 可空 |
| `columns[].task_count` | integer | ✅ | — | 只读 |
| `members` | [BoardMember] | ✅ | — | 只读 |
| `members[].id` | string(uuid) | ✅ | — | 只读 |
| `members[].profile` | any | ✅ | — | 只读 |
| `members[].created_at` | string(date-time) | ✅ | — | 只读 |
| `members[].updated_at` | string(date-time) | ✅ | Last Modified At | 只读 |
| `members[].role` | → BoardMemberRoleEnum | — | — | — |
| `members[].created_by` | string(uuid) | — | — | 可空 |
| `members[].updated_by` | string(uuid) | — | Last Modified By | 可空 |
| `members[].board` | string(uuid) | ✅ | — | 只读 |
| `members[].org` | string(uuid) | ✅ | — | — |
| `member_count` | integer | ✅ | — | 只读 |
| `task_count` | integer | ✅ | — | 只读 |
| `created_at` | string(date-time) | ✅ | — | 只读 |
| `updated_at` | string(date-time) | ✅ | Last Modified At | 只读 |
| `name` | string | ✅ | — | ≤255字符 |
| `description` | string | — | — | 可空 |
| `is_archived` | boolean | — | — | — |
| `created_by` | string(uuid) | ✅ | — | 只读; 可空 |
| `updated_by` | string(uuid) | ✅ | Last Modified By | 只读; 可空 |
| `org` | string(uuid) | ✅ | — | 只读 |

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### GET `/api/tasks/` 🔒

列表查询

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `org` | header | string | — | — |
| `priority` | query | string | — | — |
| `status` | query | string | — | — |
| `title` | query | string | — | — |

**200** → `tasks`

> ✅ 后端实测: 自定义 dict（OpenAPI 未标注）；顶层字段: accounts_list, contacts_list, offset, priority, status, tasks, tasks_count

**Schema: `tasks → 响应（后端实测）`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `tasks_count` | integer | — | — | — |
| `offset` | integer | — | — | — |
| `tasks` | [object] | — | — | — |
| `status` | [array] | — | — | — |
| `priority` | [array] | — | — | — |
| `accounts_list` | [object] | — | — | — |
| `contacts_list` | [object] | — | — | — |

**可能的错误响应（DRF 标准）**

- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）
- **400**: 请求参数校验失败（query/header/body 不合法）

---
### POST `/api/tasks/` 🔒

新建任务

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `org` | header | string | — | — |

**请求体** `application/json`

> 新建任务

**Schema: `TaskCreateSwaggerRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `title` | string | ✅ | — | ≤200字符 |
| `status` | → TaskStatusEnum | ✅ | — | — |
| `priority` | → TaskPriorityEnum | ✅ | — | — |
| `due_date` | string(date) | — | — | 可空 |
| `description` | string | — | Notes | 可空 |
| `account` | string(uuid) | — | — | 可空 |
| `opportunity` | string(uuid) | — | — | 可空 |
| `case` | string(uuid) | — | — | 可空 |
| `lead` | string(uuid) | — | — | 可空 |
| `contacts` | [string] | ✅ | — | — |
| `teams` | [string] | ✅ | — | — |
| `assigned_to` | [string] | ✅ | — | — |
| `tags` | [string] | — | — | — |

**200** → `TaskCreateResponse`

**Schema: `TaskCreateResponse`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `error` | boolean | ✅ | — | — |
| `message` | string | ✅ | — | — |

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### DELETE `/api/tasks/attachment/{id}/` 🔒

删除

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**200** → `TaskAttachmentDeleteResponse`

**Schema: `TaskAttachmentDeleteResponse`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `error` | boolean | ✅ | — | — |
| `message` | string | ✅ | — | — |

**可能的错误响应（DRF 标准）**

- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）
- **400**: 请求参数校验失败（query/header/body 不合法）

---
### DELETE `/api/tasks/comment/{id}/` 🔒

删除评论

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**200** → `TaskCommentDeleteResponse`

**Schema: `TaskCommentDeleteResponse`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `error` | boolean | ✅ | — | — |
| `message` | string | ✅ | — | — |

**可能的错误响应（DRF 标准）**

- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）
- **400**: 请求参数校验失败（query/header/body 不合法）

---
### PATCH `/api/tasks/comment/{id}/` 🔒

部分更新评论

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**请求体** `application/json`

**Schema: `PatchedTaskCommentEditSwaggerRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `comment` | string | — | — | — |

**200** → `TaskCommentPatchResponse`

**Schema: `TaskCommentPatchResponse`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `error` | boolean | ✅ | — | — |
| `message` | string | ✅ | — | — |

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### PUT `/api/tasks/comment/{id}/` 🔒

全量更新

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**请求体** `application/json`

**Schema: `TaskCommentEditSwaggerRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `comment` | string | ✅ | — | — |

**200** → `TaskCommentUpdateResponse`

**Schema: `TaskCommentUpdateResponse`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `error` | boolean | ✅ | — | — |
| `message` | string | ✅ | — | — |

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### GET `/api/tasks/kanban/` 🔒

获取看板数据 .

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
| `org` | query | string | ✅ | — |
| `pipeline_id` | query | string | — | Pipeline ID. If not provided, uses status-based columns |
| `priority` | query | string | — | Filter by priority (Low/Medium/High) |
| `search` | query | string | — | Search in title and description |

**200** → `kanban`

> ✅ 后端实测: 自定义 dict（OpenAPI 未标注）；顶层字段: columns, mode, pipeline, total_tasks

**Schema: `kanban → 响应（后端实测）`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `mode` | string | — | — | — |
| `pipeline` | string | — | — | 可空 |
| `columns` | [object] | — | — | — |
| `total_tasks` | integer | — | — | — |

**可能的错误响应（DRF 标准）**

- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）
- **400**: 请求参数校验失败（query/header/body 不合法）

---
### GET `/api/tasks/pipelines/` 🔒

列出组织的所有管道 .

**200** → `pipelines`

> ✅ 后端实测: 自定义 dict（OpenAPI 未标注）；顶层字段: pipelines

**Schema: `pipelines → 响应（后端实测）`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `pipelines` | [string] | — | — | — |

**可能的错误响应（DRF 标准）**

- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### POST `/api/tasks/pipelines/` 🔒

新建管道 .

**请求体** `application/json`

**Schema: `TaskPipelineRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `name` | string | ✅ | Pipeline Name | ≤255字符 |
| `description` | string | — | — | 可空 |
| `is_default` | boolean | — | If true, new tasks without explicit pipeline go here | — |
| `is_active` | boolean | — | — | — |

**201** → `TaskPipeline`

**Schema: `TaskPipeline`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `id` | string(uuid) | ✅ | — | 只读 |
| `name` | string | ✅ | Pipeline Name | ≤255字符 |
| `description` | string | — | — | 可空 |
| `is_default` | boolean | — | If true, new tasks without explicit pipeline go here | — |
| `is_active` | boolean | — | — | — |
| `stages` | [TaskStage] | ✅ | — | 只读 |
| `stages[].id` | string(uuid) | ✅ | — | 只读 |
| `stages[].name` | string | ✅ | Stage Name | ≤100字符 |
| `stages[].order` | integer(int64) | — | — | — |
| `stages[].color` | string | — | — | ≤7字符 |
| `stages[].stage_type` | → TaskStageStageTypeEnum | — | — | — |
| `stages[].maps_to_status` | string | — | When task enters this stage, also update Task.status | 可空; ≤50字符 |
| `stages[].wip_limit` | integer(int64) | — | Maximum tasks allowed in this stage (null = unlimited) | 可空 |
| `stages[].task_count` | integer | ✅ | — | 只读 |
| `stages[].created_at` | string(date-time) | ✅ | — | 只读 |
| `stages[].updated_at` | string(date-time) | ✅ | Last Modified At | 只读 |
| `stage_count` | integer | ✅ | — | 只读 |
| `task_count` | integer | ✅ | — | 只读 |
| `created_at` | string(date-time) | ✅ | — | 只读 |
| `updated_at` | string(date-time) | ✅ | Last Modified At | 只读 |

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### DELETE `/api/tasks/pipelines/{id}/` 🔒

Delete pipeline (soft delete by setting is_active=False).

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |

**204** → 无响应体（删除成功）

**可能的错误响应（DRF 标准）**

- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）
- **400**: 请求参数校验失败（query/header/body 不合法）

---
### GET `/api/tasks/pipelines/{id}/` 🔒

Get pipeline details with all stages.

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |

**200** → `TaskPipeline`

**Schema: `TaskPipeline`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `id` | string(uuid) | ✅ | — | 只读 |
| `name` | string | ✅ | Pipeline Name | ≤255字符 |
| `description` | string | — | — | 可空 |
| `is_default` | boolean | — | If true, new tasks without explicit pipeline go here | — |
| `is_active` | boolean | — | — | — |
| `stages` | [TaskStage] | ✅ | — | 只读 |
| `stages[].id` | string(uuid) | ✅ | — | 只读 |
| `stages[].name` | string | ✅ | Stage Name | ≤100字符 |
| `stages[].order` | integer(int64) | — | — | — |
| `stages[].color` | string | — | — | ≤7字符 |
| `stages[].stage_type` | → TaskStageStageTypeEnum | — | — | — |
| `stages[].maps_to_status` | string | — | When task enters this stage, also update Task.status | 可空; ≤50字符 |
| `stages[].wip_limit` | integer(int64) | — | Maximum tasks allowed in this stage (null = unlimited) | 可空 |
| `stages[].task_count` | integer | ✅ | — | 只读 |
| `stages[].created_at` | string(date-time) | ✅ | — | 只读 |
| `stages[].updated_at` | string(date-time) | ✅ | Last Modified At | 只读 |
| `stage_count` | integer | ✅ | — | 只读 |
| `task_count` | integer | ✅ | — | 只读 |
| `created_at` | string(date-time) | ✅ | — | 只读 |
| `updated_at` | string(date-time) | ✅ | Last Modified At | 只读 |

**可能的错误响应（DRF 标准）**

- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）
- **400**: 请求参数校验失败（query/header/body 不合法）

---
### PUT `/api/tasks/pipelines/{id}/` 🔒

Update pipeline.

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |

**请求体** `application/json`

**Schema: `TaskPipelineRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `name` | string | ✅ | Pipeline Name | ≤255字符 |
| `description` | string | — | — | 可空 |
| `is_default` | boolean | — | If true, new tasks without explicit pipeline go here | — |
| `is_active` | boolean | — | — | — |

**200** → `TaskPipeline`

**Schema: `TaskPipeline`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `id` | string(uuid) | ✅ | — | 只读 |
| `name` | string | ✅ | Pipeline Name | ≤255字符 |
| `description` | string | — | — | 可空 |
| `is_default` | boolean | — | If true, new tasks without explicit pipeline go here | — |
| `is_active` | boolean | — | — | — |
| `stages` | [TaskStage] | ✅ | — | 只读 |
| `stages[].id` | string(uuid) | ✅ | — | 只读 |
| `stages[].name` | string | ✅ | Stage Name | ≤100字符 |
| `stages[].order` | integer(int64) | — | — | — |
| `stages[].color` | string | — | — | ≤7字符 |
| `stages[].stage_type` | → TaskStageStageTypeEnum | — | — | — |
| `stages[].maps_to_status` | string | — | When task enters this stage, also update Task.status | 可空; ≤50字符 |
| `stages[].wip_limit` | integer(int64) | — | Maximum tasks allowed in this stage (null = unlimited) | 可空 |
| `stages[].task_count` | integer | ✅ | — | 只读 |
| `stages[].created_at` | string(date-time) | ✅ | — | 只读 |
| `stages[].updated_at` | string(date-time) | ✅ | Last Modified At | 只读 |
| `stage_count` | integer | ✅ | — | 只读 |
| `task_count` | integer | ✅ | — | 只读 |
| `created_at` | string(date-time) | ✅ | — | 只读 |
| `updated_at` | string(date-time) | ✅ | Last Modified At | 只读 |

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### POST `/api/tasks/pipelines/{pipeline_pk}/stages/` 🔒

Add a new stage to pipeline.

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `pipeline_pk` | path | string | ✅ | — |

**请求体** `application/json`

**Schema: `TaskStageRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `name` | string | ✅ | Stage Name | ≤100字符 |
| `order` | integer(int64) | — | — | — |
| `color` | string | — | — | ≤7字符 |
| `stage_type` | → TaskStageStageTypeEnum | — | — | — |
| `maps_to_status` | string | — | When task enters this stage, also update Task.status | 可空; ≤50字符 |
| `wip_limit` | integer(int64) | — | Maximum tasks allowed in this stage (null = unlimited) | 可空 |

**201** → `TaskStage`

**Schema: `TaskStage`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `id` | string(uuid) | ✅ | — | 只读 |
| `name` | string | ✅ | Stage Name | ≤100字符 |
| `order` | integer(int64) | — | — | — |
| `color` | string | — | — | ≤7字符 |
| `stage_type` | → TaskStageStageTypeEnum | — | — | — |
| `maps_to_status` | string | — | When task enters this stage, also update Task.status | 可空; ≤50字符 |
| `wip_limit` | integer(int64) | — | Maximum tasks allowed in this stage (null = unlimited) | 可空 |
| `task_count` | integer | ✅ | — | 只读 |
| `created_at` | string(date-time) | ✅ | — | 只读 |
| `updated_at` | string(date-time) | ✅ | Last Modified At | 只读 |

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### POST `/api/tasks/pipelines/{pipeline_pk}/stages/reorder/` 🔒

Reorder stages by providing ordered list of stage IDs.

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `pipeline_pk` | path | string | ✅ | — |

**请求体** `application/json`

**Schema: `TaskStageReorderRequestRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `stage_ids` | [string] | ✅ | — | — |

**200** → 推断: TaskPipeline

> OpenAPI 未标注；动作 `reorder` 推断返回 `TaskPipeline`

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### DELETE `/api/tasks/stages/{id}/` 🔒

Delete stage.

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |

**204** → 无响应体（删除成功）

**可能的错误响应（DRF 标准）**

- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）
- **400**: 请求参数校验失败（query/header/body 不合法）

---
### PUT `/api/tasks/stages/{id}/` 🔒

Update stage.

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |

**请求体** `application/json`

**Schema: `TaskStageRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `name` | string | ✅ | Stage Name | ≤100字符 |
| `order` | integer(int64) | — | — | — |
| `color` | string | — | — | ≤7字符 |
| `stage_type` | → TaskStageStageTypeEnum | — | — | — |
| `maps_to_status` | string | — | When task enters this stage, also update Task.status | 可空; ≤50字符 |
| `wip_limit` | integer(int64) | — | Maximum tasks allowed in this stage (null = unlimited) | 可空 |

**200** → `TaskStage`

**Schema: `TaskStage`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `id` | string(uuid) | ✅ | — | 只读 |
| `name` | string | ✅ | Stage Name | ≤100字符 |
| `order` | integer(int64) | — | — | — |
| `color` | string | — | — | ≤7字符 |
| `stage_type` | → TaskStageStageTypeEnum | — | — | — |
| `maps_to_status` | string | — | When task enters this stage, also update Task.status | 可空; ≤50字符 |
| `wip_limit` | integer(int64) | — | Maximum tasks allowed in this stage (null = unlimited) | 可空 |
| `task_count` | integer | ✅ | — | 只读 |
| `created_at` | string(date-time) | ✅ | — | 只读 |
| `updated_at` | string(date-time) | ✅ | Last Modified At | 只读 |

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### DELETE `/api/tasks/{id}/` 🔒

删除

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**200** → `TaskDeleteResponse`

**Schema: `TaskDeleteResponse`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `error` | boolean | ✅ | — | — |
| `message` | string | ✅ | — | — |

**可能的错误响应（DRF 标准）**

- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）
- **400**: 请求参数校验失败（query/header/body 不合法）

---
### GET `/api/tasks/{id}/` 🔒

获取详情

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**200** → `TaskDetailResponse`

**Schema: `TaskDetailResponse`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `task_obj` | → Task | ✅ | — | — |
| `task_obj.id` | string(uuid) | ✅ | — | 只读 |
| `task_obj.title` | string | ✅ | — | ≤200字符 |
| `task_obj.status` | → TaskStatusEnum | ✅ | — | — |
| `task_obj.priority` | → TaskPriorityEnum | ✅ | — | — |
| `task_obj.due_date` | string(date) | — | — | 可空 |
| `task_obj.description` | string | — | Notes | 可空 |
| `task_obj.account` | string(uuid) | — | — | 可空 |
| `task_obj.opportunity` | string(uuid) | — | — | 可空 |
| `task_obj.case` | string(uuid) | — | — | 可空 |
| `task_obj.lead` | string(uuid) | — | — | 可空 |
| `task_obj.created_by` | → User | ✅ | — | — |
| `task_obj.created_by.id` | string(uuid) | ✅ | — | 只读 |
| `task_obj.created_by.email` | string(email) | — | Email address | ≤254字符 |
| `task_obj.created_by.profile_pic` | string | — | — | 可空; ≤1000字符 |
| `task_obj.created_at` | string(date-time) | ✅ | — | 只读 |
| `task_obj.contacts` | [Contact] | ✅ | — | 只读 |
| `task_obj.contacts[].id` | string(uuid) | ✅ | — | 只读 |
| `task_obj.contacts[].first_name` | string | ✅ | — | ≤255字符 |
| `task_obj.contacts[].last_name` | string | ✅ | — | ≤255字符 |
| `task_obj.contacts[].email` | string(email) | — | — | 可空; ≤254字符 |
| `task_obj.contacts[].phone` | string | — | — | 可空; ≤25字符; 正则: ^[\d\s\-\(\)\+\.]{7,25}$ |
| `task_obj.contacts[].organization` | string | — | Company | 可空; ≤255字符 |
| `task_obj.contacts[].title` | string | — | Job Title | 可空; ≤255字符 |
| `task_obj.contacts[].department` | string | — | — | 可空; ≤255字符 |
| `task_obj.contacts[].do_not_call` | boolean | — | — | — |
| `task_obj.contacts[].linkedin_url` | string(uri) | — | — | 可空; ≤200字符 |
| `task_obj.contacts[].address_line` | string | — | Address | 可空; ≤255字符 |
| `task_obj.contacts[].city` | string | — | — | 可空; ≤255字符 |
| `task_obj.contacts[].state` | string | — | — | 可空; ≤255字符 |
| `task_obj.contacts[].postcode` | string | — | Postal Code | 可空; ≤64字符 |
| `task_obj.contacts[].country` | enum(ClientCountryEnum) | — | — | 枚举: GB, AF, AX, AL, DZ, AS, AD, AO, AI, AQ, AG, AR, AM, AW, AU, AT, AZ, BS, BH, BD, BB, BY, BE, BZ, BJ, BM, BT, BO, BA, BW, BV, BR, IO, BN, BG, BF, BI, KH, CM, CA, CV, KY, CF, TD, CL, CN, CX, CC, CO, KM, CG, CD, CK, CR, CI, HR, CU, CY, CZ, DK, DJ, DM, DO, EC, EG, SV, GQ, ER, EE, ET, FK, FO, FJ, FI, FR, GF, PF, TF, GA, GM, GE, DE, GH, GI, GR, GL, GD, GP, GU, GT, GG, GN, GW, GY, HT, HM, VA, HN, HK, HU, IS, IN, ID, IR, IQ, IE, IM, IL, IT, JM, JP, JE, JO, KZ, KE, KI, KP, KR, KW, KG, LA, LV, LB, LS, LR, LY, LI, LT, LU, MO, MK, MG, MW, MY, MV, ML, MT, MH, MQ, MR, MU, YT, MX, FM, MD, MC, MN, ME, MS, MA, MZ, MM, NA, NR, NP, NL, AN, NC, NZ, NI, NE, NG, NU, NF, MP, NO, OM, PK, PW, PS, PA, PG, PY, PE, PH, PN, PL, PT, PR, QA, RE, RO, RU, RW, BL, SH, KN, LC, MF, PM, VC, WS, SM, ST, SA, SN, RS, SC, SL, SG, SK, SI, SB, SO, ZA, GS, ES, LK, SD, SR, SJ, SZ, SE, CH, SY, TW, TJ, TZ, TH, TL, TG, TK, TO, TT, TN, TR, TM, TC, TV, UG, UA, AE, US, UM, UY, UZ, VU, VE, VN, VG, VI, WF, EH, YE, ZM, ZW; 可空 |
| `task_obj.contacts[].assigned_to` | [Profile] | ✅ | — | 只读 |
| `task_obj.contacts[].assigned_to[].id` | string(uuid) | ✅ | — | 只读 |
| `task_obj.contacts[].assigned_to[].user_details` | object | ✅ | — | 只读 |
| `task_obj.contacts[].assigned_to[].role` | → ProfileRoleEnum | — | — | — |
| `task_obj.contacts[].assigned_to[].address` | string(uuid) | — | — | 可空 |
| `task_obj.contacts[].assigned_to[].has_marketing_access` | boolean | — | — | — |
| `task_obj.contacts[].assigned_to[].has_sales_access` | boolean | — | — | — |
| `task_obj.contacts[].assigned_to[].phone` | string | — | — | 可空; ≤20字符 |
| `task_obj.contacts[].assigned_to[].date_of_joining` | string(date) | — | — | 可空 |
| `task_obj.contacts[].assigned_to[].is_active` | boolean | — | — | — |
| `task_obj.contacts[].assigned_to[].created_at` | string(date-time) | ✅ | — | 只读 |
| `task_obj.contacts[].teams` | [Teams] | ✅ | — | 只读 |
| `task_obj.contacts[].teams[].id` | string(uuid) | ✅ | — | 只读 |
| `task_obj.contacts[].teams[].name` | string | ✅ | — | ≤100字符 |
| `task_obj.contacts[].teams[].description` | string | ✅ | — | — |
| `task_obj.contacts[].teams[].users` | [Profile] | ✅ | — | 只读 |
| `task_obj.contacts[].teams[].users[].id` | string(uuid) | ✅ | — | 只读 |
| `task_obj.contacts[].teams[].users[].user_details` | object | ✅ | — | 只读 |
| `task_obj.contacts[].teams[].users[].role` | → ProfileRoleEnum | — | — | — |
| `task_obj.contacts[].teams[].users[].address` | string(uuid) | — | — | 可空 |
| `task_obj.contacts[].teams[].users[].has_marketing_access` | boolean | — | — | — |
| `task_obj.contacts[].teams[].users[].has_sales_access` | boolean | — | — | — |
| `task_obj.contacts[].teams[].users[].phone` | string | — | — | 可空; ≤20字符 |
| `task_obj.contacts[].teams[].users[].date_of_joining` | string(date) | — | — | 可空 |
| `task_obj.contacts[].teams[].users[].is_active` | boolean | — | — | — |
| `task_obj.contacts[].teams[].users[].created_at` | string(date-time) | ✅ | — | 只读 |
| `task_obj.contacts[].teams[].created_at` | string(date-time) | ✅ | — | 只读 |
| `task_obj.contacts[].teams[].created_by` | → User | ✅ | — | — |
| `task_obj.contacts[].teams[].created_by.id` | string(uuid) | ✅ | — | 只读 |
| `task_obj.contacts[].teams[].created_by.email` | string(email) | — | Email address | ≤254字符 |
| `task_obj.contacts[].teams[].created_by.profile_pic` | string | — | — | 可空; ≤1000字符 |
| `task_obj.contacts[].tags` | [string] | — | — | — |
| `task_obj.contacts[].description` | string | — | Notes | 可空 |
| `task_obj.contacts[].created_by` | string(uuid) | — | — | 可空 |
| `task_obj.contacts[].created_at` | string(date-time) | ✅ | — | 只读 |
| `task_obj.contacts[].is_active` | boolean | — | — | — |
| `task_obj.contacts[].org` | → Organization | ✅ | — | — |
| `task_obj.contacts[].org.id` | string(uuid) | ✅ | — | 只读 |
| `task_obj.contacts[].org.name` | string | — | — | 可空; ≤100字符 |
| `task_obj.contacts[].org.api_key` | string | ✅ | — | 只读 |
| `task_obj.contacts[].account` | string(uuid) | — | Primary account this contact belongs to | 可空 |
| `task_obj.contacts[].contact_attachment` | [Attachments] | ✅ | — | 只读 |
| `task_obj.contacts[].contact_attachment[].id` | string(uuid) | ✅ | — | 只读 |
| `task_obj.contacts[].contact_attachment[].created_by` | string(uuid) | — | — | 可空 |
| `task_obj.contacts[].contact_attachment[].file_name` | string | ✅ | — | ≤60字符 |
| `task_obj.contacts[].contact_attachment[].created_at` | string(date-time) | ✅ | — | 只读 |
| `task_obj.contacts[].contact_attachment[].file_path` | string | ✅ | — | 只读 |
| `task_obj.contacts[].contact_attachment[].content_type` | string | ✅ | Python model class name | 只读 |
| `task_obj.contacts[].contact_attachment[].object_id` | string(uuid) | ✅ | — | — |
| `task_obj.contacts[].contact_attachment[].org` | string(uuid) | ✅ | — | — |
| `task_obj.teams` | [Teams] | ✅ | — | 只读 |
| `task_obj.teams[].id` | string(uuid) | ✅ | — | 只读 |
| `task_obj.teams[].name` | string | ✅ | — | ≤100字符 |
| `task_obj.teams[].description` | string | ✅ | — | — |
| `task_obj.teams[].users` | [Profile] | ✅ | — | 只读 |
| `task_obj.teams[].users[].id` | string(uuid) | ✅ | — | 只读 |
| `task_obj.teams[].users[].user_details` | object | ✅ | — | 只读 |
| `task_obj.teams[].users[].role` | → ProfileRoleEnum | — | — | — |
| `task_obj.teams[].users[].address` | string(uuid) | — | — | 可空 |
| `task_obj.teams[].users[].has_marketing_access` | boolean | — | — | — |
| `task_obj.teams[].users[].has_sales_access` | boolean | — | — | — |
| `task_obj.teams[].users[].phone` | string | — | — | 可空; ≤20字符 |
| `task_obj.teams[].users[].date_of_joining` | string(date) | — | — | 可空 |
| `task_obj.teams[].users[].is_active` | boolean | — | — | — |
| `task_obj.teams[].users[].created_at` | string(date-time) | ✅ | — | 只读 |
| `task_obj.teams[].created_at` | string(date-time) | ✅ | — | 只读 |
| `task_obj.teams[].created_by` | → User | ✅ | — | — |
| `task_obj.teams[].created_by.id` | string(uuid) | ✅ | — | 只读 |
| `task_obj.teams[].created_by.email` | string(email) | — | Email address | ≤254字符 |
| `task_obj.teams[].created_by.profile_pic` | string | — | — | 可空; ≤1000字符 |
| `task_obj.assigned_to` | [Profile] | ✅ | — | 只读 |
| `task_obj.assigned_to[].id` | string(uuid) | ✅ | — | 只读 |
| `task_obj.assigned_to[].user_details` | object | ✅ | — | 只读 |
| `task_obj.assigned_to[].role` | → ProfileRoleEnum | — | — | — |
| `task_obj.assigned_to[].address` | string(uuid) | — | — | 可空 |
| `task_obj.assigned_to[].has_marketing_access` | boolean | — | — | — |
| `task_obj.assigned_to[].has_sales_access` | boolean | — | — | — |
| `task_obj.assigned_to[].phone` | string | — | — | 可空; ≤20字符 |
| `task_obj.assigned_to[].date_of_joining` | string(date) | — | — | 可空 |
| `task_obj.assigned_to[].is_active` | boolean | — | — | — |
| `task_obj.assigned_to[].created_at` | string(date-time) | ✅ | — | 只读 |
| `task_obj.tags` | [Tags] | ✅ | — | 只读 |
| `task_obj.tags[].id` | string(uuid) | ✅ | — | 只读 |
| `task_obj.tags[].name` | string | ✅ | — | ≤50字符 |
| `task_obj.tags[].slug` | string | ✅ | — | 只读 |
| `task_obj.tags[].color` | → ColorEnum | — | — | — |
| `task_obj.tags[].description` | string | — | — | — |
| `task_obj.tags[].is_active` | boolean | — | — | — |
| `task_obj.tags[].created_at` | string(date-time) | ✅ | — | 只读 |
| `task_obj.task_attachment` | [Attachments] | ✅ | — | 只读 |
| `task_obj.task_attachment[].id` | string(uuid) | ✅ | — | 只读 |
| `task_obj.task_attachment[].created_by` | string(uuid) | — | — | 可空 |
| `task_obj.task_attachment[].file_name` | string | ✅ | — | ≤60字符 |
| `task_obj.task_attachment[].created_at` | string(date-time) | ✅ | — | 只读 |
| `task_obj.task_attachment[].file_path` | string | ✅ | — | 只读 |
| `task_obj.task_attachment[].content_type` | string | ✅ | Python model class name | 只读 |
| `task_obj.task_attachment[].object_id` | string(uuid) | ✅ | — | — |
| `task_obj.task_attachment[].org` | string(uuid) | ✅ | — | — |
| `task_obj.task_comments` | [Comment] | ✅ | — | 只读 |
| `task_obj.task_comments[].id` | string(uuid) | ✅ | — | 只读 |
| `task_obj.task_comments[].comment` | string | ✅ | — | ≤255字符 |
| `task_obj.task_comments[].commented_on` | string(date-time) | ✅ | — | 只读 |
| `task_obj.task_comments[].commented_by` | string(uuid) | — | — | 可空 |
| `task_obj.task_comments[].content_type` | string | ✅ | Python model class name | 只读 |
| `task_obj.task_comments[].object_id` | string(uuid) | ✅ | — | — |
| `task_obj.task_comments[].org` | string(uuid) | ✅ | — | — |
| `attachments` | [Attachments] | ✅ | — | — |
| `attachments[].id` | string(uuid) | ✅ | — | 只读 |
| `attachments[].created_by` | string(uuid) | — | — | 可空 |
| `attachments[].file_name` | string | ✅ | — | ≤60字符 |
| `attachments[].created_at` | string(date-time) | ✅ | — | 只读 |
| `attachments[].file_path` | string | ✅ | — | 只读 |
| `attachments[].content_type` | string | ✅ | Python model class name | 只读 |
| `attachments[].object_id` | string(uuid) | ✅ | — | — |
| `attachments[].org` | string(uuid) | ✅ | — | — |
| `comments` | [Comment] | ✅ | — | — |
| `comments[].id` | string(uuid) | ✅ | — | 只读 |
| `comments[].comment` | string | ✅ | — | ≤255字符 |
| `comments[].commented_on` | string(date-time) | ✅ | — | 只读 |
| `comments[].commented_by` | string(uuid) | — | — | 可空 |
| `comments[].content_type` | string | ✅ | Python model class name | 只读 |
| `comments[].object_id` | string(uuid) | ✅ | — | — |
| `comments[].org` | string(uuid) | ✅ | — | — |
| `users_mention` | [any] | ✅ | — | — |
| `assigned_data` | object | ✅ | — | — |
| `users` | [Profile] | ✅ | — | — |
| `users[].id` | string(uuid) | ✅ | — | 只读 |
| `users[].user_details` | object | ✅ | — | 只读 |
| `users[].role` | → ProfileRoleEnum | — | — | — |
| `users[].address` | string(uuid) | — | — | 可空 |
| `users[].has_marketing_access` | boolean | — | — | — |
| `users[].has_sales_access` | boolean | — | — | — |
| `users[].phone` | string | — | — | 可空; ≤20字符 |
| `users[].date_of_joining` | string(date) | — | — | 可空 |
| `users[].is_active` | boolean | — | — | — |
| `users[].created_at` | string(date-time) | ✅ | — | 只读 |
| `users_excluding_team` | [Profile] | ✅ | — | — |
| `users_excluding_team[].id` | string(uuid) | ✅ | — | 只读 |
| `users_excluding_team[].user_details` | object | ✅ | — | 只读 |
| `users_excluding_team[].role` | → ProfileRoleEnum | — | — | — |
| `users_excluding_team[].address` | string(uuid) | — | — | 可空 |
| `users_excluding_team[].has_marketing_access` | boolean | — | — | — |
| `users_excluding_team[].has_sales_access` | boolean | — | — | — |
| `users_excluding_team[].phone` | string | — | — | 可空; ≤20字符 |
| `users_excluding_team[].date_of_joining` | string(date) | — | — | 可空 |
| `users_excluding_team[].is_active` | boolean | — | — | — |
| `users_excluding_team[].created_at` | string(date-time) | ✅ | — | 只读 |
| `teams` | [Teams] | ✅ | — | — |
| `teams[].id` | string(uuid) | ✅ | — | 只读 |
| `teams[].name` | string | ✅ | — | ≤100字符 |
| `teams[].description` | string | ✅ | — | — |
| `teams[].users` | [Profile] | ✅ | — | 只读 |
| `teams[].users[].id` | string(uuid) | ✅ | — | 只读 |
| `teams[].users[].user_details` | object | ✅ | — | 只读 |
| `teams[].users[].role` | → ProfileRoleEnum | — | — | — |
| `teams[].users[].address` | string(uuid) | — | — | 可空 |
| `teams[].users[].has_marketing_access` | boolean | — | — | — |
| `teams[].users[].has_sales_access` | boolean | — | — | — |
| `teams[].users[].phone` | string | — | — | 可空; ≤20字符 |
| `teams[].users[].date_of_joining` | string(date) | — | — | 可空 |
| `teams[].users[].is_active` | boolean | — | — | — |
| `teams[].users[].created_at` | string(date-time) | ✅ | — | 只读 |
| `teams[].created_at` | string(date-time) | ✅ | — | 只读 |
| `teams[].created_by` | → User | ✅ | — | — |
| `teams[].created_by.id` | string(uuid) | ✅ | — | 只读 |
| `teams[].created_by.email` | string(email) | — | Email address | ≤254字符 |
| `teams[].created_by.profile_pic` | string | — | — | 可空; ≤1000字符 |

**可能的错误响应（DRF 标准）**

- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）
- **400**: 请求参数校验失败（query/header/body 不合法）

---
### PATCH `/api/tasks/{id}/` 🔒

部分更新任务

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**请求体** `application/json`

**Schema: `PatchedTaskCreateSwaggerRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `title` | string | — | — | ≤200字符 |
| `status` | → TaskStatusEnum | — | — | — |
| `priority` | → TaskPriorityEnum | — | — | — |
| `due_date` | string(date) | — | — | 可空 |
| `description` | string | — | Notes | 可空 |
| `account` | string(uuid) | — | — | 可空 |
| `opportunity` | string(uuid) | — | — | 可空 |
| `case` | string(uuid) | — | — | 可空 |
| `lead` | string(uuid) | — | — | 可空 |
| `contacts` | [string] | — | — | — |
| `teams` | [string] | — | — | — |
| `assigned_to` | [string] | — | — | — |
| `tags` | [string] | — | — | — |

**200** → `TaskPatchResponse`

**Schema: `TaskPatchResponse`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `error` | boolean | ✅ | — | — |
| `message` | string | ✅ | — | — |

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### POST `/api/tasks/{id}/` 🔒

编辑任务详情（含附件/评论）

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**请求体** `application/json`

> 编辑任务详情（含附件/评论）

**Schema: `TaskDetailEditSwaggerRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `comment` | string | ✅ | — | — |
| `task_attachment` | string(binary) | ✅ | — | — |

**200** → `TaskCommentAttachmentResponse`

**Schema: `TaskCommentAttachmentResponse`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `task_obj` | → Task | ✅ | — | — |
| `task_obj.id` | string(uuid) | ✅ | — | 只读 |
| `task_obj.title` | string | ✅ | — | ≤200字符 |
| `task_obj.status` | → TaskStatusEnum | ✅ | — | — |
| `task_obj.priority` | → TaskPriorityEnum | ✅ | — | — |
| `task_obj.due_date` | string(date) | — | — | 可空 |
| `task_obj.description` | string | — | Notes | 可空 |
| `task_obj.account` | string(uuid) | — | — | 可空 |
| `task_obj.opportunity` | string(uuid) | — | — | 可空 |
| `task_obj.case` | string(uuid) | — | — | 可空 |
| `task_obj.lead` | string(uuid) | — | — | 可空 |
| `task_obj.created_by` | → User | ✅ | — | — |
| `task_obj.created_by.id` | string(uuid) | ✅ | — | 只读 |
| `task_obj.created_by.email` | string(email) | — | Email address | ≤254字符 |
| `task_obj.created_by.profile_pic` | string | — | — | 可空; ≤1000字符 |
| `task_obj.created_at` | string(date-time) | ✅ | — | 只读 |
| `task_obj.contacts` | [Contact] | ✅ | — | 只读 |
| `task_obj.contacts[].id` | string(uuid) | ✅ | — | 只读 |
| `task_obj.contacts[].first_name` | string | ✅ | — | ≤255字符 |
| `task_obj.contacts[].last_name` | string | ✅ | — | ≤255字符 |
| `task_obj.contacts[].email` | string(email) | — | — | 可空; ≤254字符 |
| `task_obj.contacts[].phone` | string | — | — | 可空; ≤25字符; 正则: ^[\d\s\-\(\)\+\.]{7,25}$ |
| `task_obj.contacts[].organization` | string | — | Company | 可空; ≤255字符 |
| `task_obj.contacts[].title` | string | — | Job Title | 可空; ≤255字符 |
| `task_obj.contacts[].department` | string | — | — | 可空; ≤255字符 |
| `task_obj.contacts[].do_not_call` | boolean | — | — | — |
| `task_obj.contacts[].linkedin_url` | string(uri) | — | — | 可空; ≤200字符 |
| `task_obj.contacts[].address_line` | string | — | Address | 可空; ≤255字符 |
| `task_obj.contacts[].city` | string | — | — | 可空; ≤255字符 |
| `task_obj.contacts[].state` | string | — | — | 可空; ≤255字符 |
| `task_obj.contacts[].postcode` | string | — | Postal Code | 可空; ≤64字符 |
| `task_obj.contacts[].country` | enum(ClientCountryEnum) | — | — | 枚举: GB, AF, AX, AL, DZ, AS, AD, AO, AI, AQ, AG, AR, AM, AW, AU, AT, AZ, BS, BH, BD, BB, BY, BE, BZ, BJ, BM, BT, BO, BA, BW, BV, BR, IO, BN, BG, BF, BI, KH, CM, CA, CV, KY, CF, TD, CL, CN, CX, CC, CO, KM, CG, CD, CK, CR, CI, HR, CU, CY, CZ, DK, DJ, DM, DO, EC, EG, SV, GQ, ER, EE, ET, FK, FO, FJ, FI, FR, GF, PF, TF, GA, GM, GE, DE, GH, GI, GR, GL, GD, GP, GU, GT, GG, GN, GW, GY, HT, HM, VA, HN, HK, HU, IS, IN, ID, IR, IQ, IE, IM, IL, IT, JM, JP, JE, JO, KZ, KE, KI, KP, KR, KW, KG, LA, LV, LB, LS, LR, LY, LI, LT, LU, MO, MK, MG, MW, MY, MV, ML, MT, MH, MQ, MR, MU, YT, MX, FM, MD, MC, MN, ME, MS, MA, MZ, MM, NA, NR, NP, NL, AN, NC, NZ, NI, NE, NG, NU, NF, MP, NO, OM, PK, PW, PS, PA, PG, PY, PE, PH, PN, PL, PT, PR, QA, RE, RO, RU, RW, BL, SH, KN, LC, MF, PM, VC, WS, SM, ST, SA, SN, RS, SC, SL, SG, SK, SI, SB, SO, ZA, GS, ES, LK, SD, SR, SJ, SZ, SE, CH, SY, TW, TJ, TZ, TH, TL, TG, TK, TO, TT, TN, TR, TM, TC, TV, UG, UA, AE, US, UM, UY, UZ, VU, VE, VN, VG, VI, WF, EH, YE, ZM, ZW; 可空 |
| `task_obj.contacts[].assigned_to` | [Profile] | ✅ | — | 只读 |
| `task_obj.contacts[].assigned_to[].id` | string(uuid) | ✅ | — | 只读 |
| `task_obj.contacts[].assigned_to[].user_details` | object | ✅ | — | 只读 |
| `task_obj.contacts[].assigned_to[].role` | → ProfileRoleEnum | — | — | — |
| `task_obj.contacts[].assigned_to[].address` | string(uuid) | — | — | 可空 |
| `task_obj.contacts[].assigned_to[].has_marketing_access` | boolean | — | — | — |
| `task_obj.contacts[].assigned_to[].has_sales_access` | boolean | — | — | — |
| `task_obj.contacts[].assigned_to[].phone` | string | — | — | 可空; ≤20字符 |
| `task_obj.contacts[].assigned_to[].date_of_joining` | string(date) | — | — | 可空 |
| `task_obj.contacts[].assigned_to[].is_active` | boolean | — | — | — |
| `task_obj.contacts[].assigned_to[].created_at` | string(date-time) | ✅ | — | 只读 |
| `task_obj.contacts[].teams` | [Teams] | ✅ | — | 只读 |
| `task_obj.contacts[].teams[].id` | string(uuid) | ✅ | — | 只读 |
| `task_obj.contacts[].teams[].name` | string | ✅ | — | ≤100字符 |
| `task_obj.contacts[].teams[].description` | string | ✅ | — | — |
| `task_obj.contacts[].teams[].users` | [Profile] | ✅ | — | 只读 |
| `task_obj.contacts[].teams[].users[].id` | string(uuid) | ✅ | — | 只读 |
| `task_obj.contacts[].teams[].users[].user_details` | object | ✅ | — | 只读 |
| `task_obj.contacts[].teams[].users[].role` | → ProfileRoleEnum | — | — | — |
| `task_obj.contacts[].teams[].users[].address` | string(uuid) | — | — | 可空 |
| `task_obj.contacts[].teams[].users[].has_marketing_access` | boolean | — | — | — |
| `task_obj.contacts[].teams[].users[].has_sales_access` | boolean | — | — | — |
| `task_obj.contacts[].teams[].users[].phone` | string | — | — | 可空; ≤20字符 |
| `task_obj.contacts[].teams[].users[].date_of_joining` | string(date) | — | — | 可空 |
| `task_obj.contacts[].teams[].users[].is_active` | boolean | — | — | — |
| `task_obj.contacts[].teams[].users[].created_at` | string(date-time) | ✅ | — | 只读 |
| `task_obj.contacts[].teams[].created_at` | string(date-time) | ✅ | — | 只读 |
| `task_obj.contacts[].teams[].created_by` | → User | ✅ | — | — |
| `task_obj.contacts[].teams[].created_by.id` | string(uuid) | ✅ | — | 只读 |
| `task_obj.contacts[].teams[].created_by.email` | string(email) | — | Email address | ≤254字符 |
| `task_obj.contacts[].teams[].created_by.profile_pic` | string | — | — | 可空; ≤1000字符 |
| `task_obj.contacts[].tags` | [string] | — | — | — |
| `task_obj.contacts[].description` | string | — | Notes | 可空 |
| `task_obj.contacts[].created_by` | string(uuid) | — | — | 可空 |
| `task_obj.contacts[].created_at` | string(date-time) | ✅ | — | 只读 |
| `task_obj.contacts[].is_active` | boolean | — | — | — |
| `task_obj.contacts[].org` | → Organization | ✅ | — | — |
| `task_obj.contacts[].org.id` | string(uuid) | ✅ | — | 只读 |
| `task_obj.contacts[].org.name` | string | — | — | 可空; ≤100字符 |
| `task_obj.contacts[].org.api_key` | string | ✅ | — | 只读 |
| `task_obj.contacts[].account` | string(uuid) | — | Primary account this contact belongs to | 可空 |
| `task_obj.contacts[].contact_attachment` | [Attachments] | ✅ | — | 只读 |
| `task_obj.contacts[].contact_attachment[].id` | string(uuid) | ✅ | — | 只读 |
| `task_obj.contacts[].contact_attachment[].created_by` | string(uuid) | — | — | 可空 |
| `task_obj.contacts[].contact_attachment[].file_name` | string | ✅ | — | ≤60字符 |
| `task_obj.contacts[].contact_attachment[].created_at` | string(date-time) | ✅ | — | 只读 |
| `task_obj.contacts[].contact_attachment[].file_path` | string | ✅ | — | 只读 |
| `task_obj.contacts[].contact_attachment[].content_type` | string | ✅ | Python model class name | 只读 |
| `task_obj.contacts[].contact_attachment[].object_id` | string(uuid) | ✅ | — | — |
| `task_obj.contacts[].contact_attachment[].org` | string(uuid) | ✅ | — | — |
| `task_obj.teams` | [Teams] | ✅ | — | 只读 |
| `task_obj.teams[].id` | string(uuid) | ✅ | — | 只读 |
| `task_obj.teams[].name` | string | ✅ | — | ≤100字符 |
| `task_obj.teams[].description` | string | ✅ | — | — |
| `task_obj.teams[].users` | [Profile] | ✅ | — | 只读 |
| `task_obj.teams[].users[].id` | string(uuid) | ✅ | — | 只读 |
| `task_obj.teams[].users[].user_details` | object | ✅ | — | 只读 |
| `task_obj.teams[].users[].role` | → ProfileRoleEnum | — | — | — |
| `task_obj.teams[].users[].address` | string(uuid) | — | — | 可空 |
| `task_obj.teams[].users[].has_marketing_access` | boolean | — | — | — |
| `task_obj.teams[].users[].has_sales_access` | boolean | — | — | — |
| `task_obj.teams[].users[].phone` | string | — | — | 可空; ≤20字符 |
| `task_obj.teams[].users[].date_of_joining` | string(date) | — | — | 可空 |
| `task_obj.teams[].users[].is_active` | boolean | — | — | — |
| `task_obj.teams[].users[].created_at` | string(date-time) | ✅ | — | 只读 |
| `task_obj.teams[].created_at` | string(date-time) | ✅ | — | 只读 |
| `task_obj.teams[].created_by` | → User | ✅ | — | — |
| `task_obj.teams[].created_by.id` | string(uuid) | ✅ | — | 只读 |
| `task_obj.teams[].created_by.email` | string(email) | — | Email address | ≤254字符 |
| `task_obj.teams[].created_by.profile_pic` | string | — | — | 可空; ≤1000字符 |
| `task_obj.assigned_to` | [Profile] | ✅ | — | 只读 |
| `task_obj.assigned_to[].id` | string(uuid) | ✅ | — | 只读 |
| `task_obj.assigned_to[].user_details` | object | ✅ | — | 只读 |
| `task_obj.assigned_to[].role` | → ProfileRoleEnum | — | — | — |
| `task_obj.assigned_to[].address` | string(uuid) | — | — | 可空 |
| `task_obj.assigned_to[].has_marketing_access` | boolean | — | — | — |
| `task_obj.assigned_to[].has_sales_access` | boolean | — | — | — |
| `task_obj.assigned_to[].phone` | string | — | — | 可空; ≤20字符 |
| `task_obj.assigned_to[].date_of_joining` | string(date) | — | — | 可空 |
| `task_obj.assigned_to[].is_active` | boolean | — | — | — |
| `task_obj.assigned_to[].created_at` | string(date-time) | ✅ | — | 只读 |
| `task_obj.tags` | [Tags] | ✅ | — | 只读 |
| `task_obj.tags[].id` | string(uuid) | ✅ | — | 只读 |
| `task_obj.tags[].name` | string | ✅ | — | ≤50字符 |
| `task_obj.tags[].slug` | string | ✅ | — | 只读 |
| `task_obj.tags[].color` | → ColorEnum | — | — | — |
| `task_obj.tags[].description` | string | — | — | — |
| `task_obj.tags[].is_active` | boolean | — | — | — |
| `task_obj.tags[].created_at` | string(date-time) | ✅ | — | 只读 |
| `task_obj.task_attachment` | [Attachments] | ✅ | — | 只读 |
| `task_obj.task_attachment[].id` | string(uuid) | ✅ | — | 只读 |
| `task_obj.task_attachment[].created_by` | string(uuid) | — | — | 可空 |
| `task_obj.task_attachment[].file_name` | string | ✅ | — | ≤60字符 |
| `task_obj.task_attachment[].created_at` | string(date-time) | ✅ | — | 只读 |
| `task_obj.task_attachment[].file_path` | string | ✅ | — | 只读 |
| `task_obj.task_attachment[].content_type` | string | ✅ | Python model class name | 只读 |
| `task_obj.task_attachment[].object_id` | string(uuid) | ✅ | — | — |
| `task_obj.task_attachment[].org` | string(uuid) | ✅ | — | — |
| `task_obj.task_comments` | [Comment] | ✅ | — | 只读 |
| `task_obj.task_comments[].id` | string(uuid) | ✅ | — | 只读 |
| `task_obj.task_comments[].comment` | string | ✅ | — | ≤255字符 |
| `task_obj.task_comments[].commented_on` | string(date-time) | ✅ | — | 只读 |
| `task_obj.task_comments[].commented_by` | string(uuid) | — | — | 可空 |
| `task_obj.task_comments[].content_type` | string | ✅ | Python model class name | 只读 |
| `task_obj.task_comments[].object_id` | string(uuid) | ✅ | — | — |
| `task_obj.task_comments[].org` | string(uuid) | ✅ | — | — |
| `attachments` | [Attachments] | ✅ | — | — |
| `attachments[].id` | string(uuid) | ✅ | — | 只读 |
| `attachments[].created_by` | string(uuid) | — | — | 可空 |
| `attachments[].file_name` | string | ✅ | — | ≤60字符 |
| `attachments[].created_at` | string(date-time) | ✅ | — | 只读 |
| `attachments[].file_path` | string | ✅ | — | 只读 |
| `attachments[].content_type` | string | ✅ | Python model class name | 只读 |
| `attachments[].object_id` | string(uuid) | ✅ | — | — |
| `attachments[].org` | string(uuid) | ✅ | — | — |
| `comments` | [Comment] | ✅ | — | — |
| `comments[].id` | string(uuid) | ✅ | — | 只读 |
| `comments[].comment` | string | ✅ | — | ≤255字符 |
| `comments[].commented_on` | string(date-time) | ✅ | — | 只读 |
| `comments[].commented_by` | string(uuid) | — | — | 可空 |
| `comments[].content_type` | string | ✅ | Python model class name | 只读 |
| `comments[].object_id` | string(uuid) | ✅ | — | — |
| `comments[].org` | string(uuid) | ✅ | — | — |

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### PUT `/api/tasks/{id}/` 🔒

新建任务

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**请求体** `application/json`

> 新建任务

**Schema: `TaskCreateSwaggerRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `title` | string | ✅ | — | ≤200字符 |
| `status` | → TaskStatusEnum | ✅ | — | — |
| `priority` | → TaskPriorityEnum | ✅ | — | — |
| `due_date` | string(date) | — | — | 可空 |
| `description` | string | — | Notes | 可空 |
| `account` | string(uuid) | — | — | 可空 |
| `opportunity` | string(uuid) | — | — | 可空 |
| `case` | string(uuid) | — | — | 可空 |
| `lead` | string(uuid) | — | — | 可空 |
| `contacts` | [string] | ✅ | — | — |
| `teams` | [string] | ✅ | — | — |
| `assigned_to` | [string] | ✅ | — | — |
| `tags` | [string] | — | — | — |

**200** → `TaskUpdateResponse`

**Schema: `TaskUpdateResponse`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `error` | boolean | ✅ | — | — |
| `message` | string | ✅ | — | — |

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### PATCH `/api/tasks/{id}/move/` 🔒

移动任务到不同列/位置 .

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |

**请求体** `application/json`

**Schema: `PatchedTaskMoveRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `stage_id` | string(uuid) | — | — | 可空 |
| `status` | → TaskStatusEnum | — | — | — |
| `kanban_order` | string(decimal) | — | — | 正则: ^-?\d{0,9}(?:\.\d{0,6})?$ |
| `above_task_id` | string(uuid) | — | — | 可空 |
| `below_task_id` | string(uuid) | — | — | 可空 |

**200** → 推断: object

> OpenAPI 未标注；动作 `move` 返回 JSON

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---