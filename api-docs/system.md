# 系统与设置

> 共 47 个端点。🔒 = 需要登录（JWT），🟢 = 无需鉴权。
> 系统级：认证（JWT 登录/注册/刷新/切换组织）、组织、用户、团队、标签、文档、API 设置、个人资料。

## 端点速览

| 方法 | 路径 | 鉴权 | 说明 |
|------|------|------|------|
| GET | `/api/api-settings/` | 🔒 | 列表查询 |
| POST | `/api/api-settings/` | 🔒 | 新建/编辑 API 设置（域名） |
| DELETE | `/api/api-settings/{id}/` | 🔒 | 删除 |
| GET | `/api/api-settings/{id}/` | 🔒 | 获取详情 |
| PATCH | `/api/api-settings/{id}/` | 🔒 | 部分更新 API 设置 |
| PUT | `/api/api-settings/{id}/` | 🔒 | 新建/编辑 API 设置（域名） |
| POST | `/api/auth/login/` | 🟢 | 邮箱密码登录 |
| GET | `/api/auth/me/` | 🔒 | 获取当前登录用户及其组织信息 |
| GET | `/api/auth/profile/` | 🔒 | 获取当前用户在指定组织的个人资料 |
| POST | `/api/auth/refresh-token/` | 🟢 | 刷新访问令牌（校验组织成员资格） |
| POST | `/api/auth/register/` | 🟢 | 注册新用户 account |
| POST | `/api/auth/switch-org/` | 🔒 | 切换组织并获取新 JWT |
| GET | `/api/documents/` | 🔒 | 列表查询 |
| POST | `/api/documents/` | 🔒 | 新建文档 |
| DELETE | `/api/documents/{id}/` | 🔒 | 删除 |
| GET | `/api/documents/{id}/` | 🔒 | 获取详情 |
| PATCH | `/api/documents/{id}/` | 🔒 | 部分更新文档 |
| PUT | `/api/documents/{id}/` | 🔒 | 编辑文档 |
| GET | `/api/org/` | 🔒 | 获取当前用户关联的组织列表 |
| POST | `/api/org/` | 🔒 | 创建组织 + 个人资料 |
| GET | `/api/org/settings/` | 🔒 | 获取当前组织设置 . |
| PATCH | `/api/org/settings/` | 🔒 | 更新组织设置 (admin only). |
| GET | `/api/org/{id}/` | 🔒 | 获取组织详情 |
| PATCH | `/api/org/{id}/` | 🔒 | 部分更新组织详情 |
| PUT | `/api/org/{id}/` | 🔒 | 更新组织详情 |
| GET | `/api/profile/` | 🔒 | 列表查询 |
| PATCH | `/api/profile/` | 🔒 | 部分更新 |
| GET | `/api/tags/` | 🔒 | 列出组织的所有标签 . |
| POST | `/api/tags/` | 🔒 | 新建标签 (admin only). |
| DELETE | `/api/tags/{id}/` | 🔒 | 归档标签（软删除） (admin only). |
| GET | `/api/tags/{id}/` | 🔒 | 获取单个标签 . |
| PUT | `/api/tags/{id}/` | 🔒 | 更新标签 (admin only). |
| POST | `/api/tags/{id}/restore/` | 🔒 | 恢复已归档标签 (admin only). |
| GET | `/api/teams/` | 🔒 | 列表查询 |
| POST | `/api/teams/` | 🔒 | 新建/编辑团队 |
| DELETE | `/api/teams/{id}/` | 🔒 | 删除 |
| GET | `/api/teams/{id}/` | 🔒 | 获取详情 |
| PATCH | `/api/teams/{id}/` | 🔒 | 部分更新团队 |
| PUT | `/api/teams/{id}/` | 🔒 | 新建/编辑团队 |
| DELETE | `/api/user/{id}/` | 🔒 | 删除 |
| GET | `/api/user/{id}/` | 🔒 | 获取详情 |
| PATCH | `/api/user/{id}/` | 🔒 | 部分更新用户 |
| PUT | `/api/user/{id}/` | 🔒 | 新建/编辑用户 |
| POST | `/api/user/{id}/status/` | 🔒 | 用户状态管理 |
| GET | `/api/users/` | 🔒 | 列表查询 |
| POST | `/api/users/` | 🔒 | 新建/编辑用户 |
| GET | `/api/users/get-teams-and-users/` | 🔒 | 列表查询 |

## 端点详情

### GET `/api/api-settings/` 🔒

列表查询

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `org` | header | string | — | — |

**200** → `api-settings`

> ✅ 后端实测: 自定义 dict（OpenAPI 未标注）；顶层字段: api_settings, error, users

**Schema: `api-settings → 响应（后端实测）`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `error` | boolean | — | — | — |
| `api_settings` | [string] | — | — | — |
| `users` | [object] | — | — | — |

**可能的错误响应（DRF 标准）**

- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）
- **400**: 请求参数校验失败（query/header/body 不合法）

---
### POST `/api/api-settings/` 🔒

新建/编辑 API 设置（域名）

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `org` | header | string | — | — |

**请求体** `application/json`

> 新建/编辑 API 设置（域名）

**Schema: `APISettingsSwaggerRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `title` | string | ✅ | — | — |
| `website` | string(uri) | — | — | 可空; ≤255字符 |
| `lead_assigned_to` | [string] | ✅ | — | — |
| `tags` | [string] | — | — | — |

**201** → `DomainCreateResponse`

**Schema: `DomainCreateResponse`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `error` | boolean | ✅ | — | — |
| `message` | string | ✅ | — | — |

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### DELETE `/api/api-settings/{id}/` 🔒

删除

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**200** → `DomainDeleteResponse`

**Schema: `DomainDeleteResponse`**

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
### GET `/api/api-settings/{id}/` 🔒

获取详情

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**200** → `DomainDetailResponse`

**Schema: `DomainDetailResponse`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `error` | boolean | ✅ | — | — |
| `domain` | → APISettingsList | ✅ | — | — |
| `domain.title` | string | ✅ | — | — |
| `domain.apikey` | string | — | — | ≤64字符 |
| `domain.website` | string(uri) | — | — | 可空; ≤255字符 |
| `domain.created_at` | string(date-time) | ✅ | — | 只读 |
| `domain.created_by` | → User | ✅ | — | — |
| `domain.created_by.id` | string(uuid) | ✅ | — | 只读 |
| `domain.created_by.email` | string(email) | — | Email address | ≤254字符 |
| `domain.created_by.profile_pic` | string | — | — | 可空; ≤1000字符 |
| `domain.lead_assigned_to` | [Profile] | ✅ | — | 只读 |
| `domain.lead_assigned_to[].id` | string(uuid) | ✅ | — | 只读 |
| `domain.lead_assigned_to[].user_details` | object | ✅ | — | 只读 |
| `domain.lead_assigned_to[].role` | → ProfileRoleEnum | — | — | — |
| `domain.lead_assigned_to[].address` | string(uuid) | — | — | 可空 |
| `domain.lead_assigned_to[].has_marketing_access` | boolean | — | — | — |
| `domain.lead_assigned_to[].has_sales_access` | boolean | — | — | — |
| `domain.lead_assigned_to[].phone` | string | — | — | 可空; ≤20字符 |
| `domain.lead_assigned_to[].date_of_joining` | string(date) | — | — | 可空 |
| `domain.lead_assigned_to[].is_active` | boolean | — | — | — |
| `domain.lead_assigned_to[].created_at` | string(date-time) | ✅ | — | 只读 |
| `domain.tags` | [any] | ✅ | — | 只读 |
| `domain.org` | → Organization | ✅ | — | — |
| `domain.org.id` | string(uuid) | ✅ | — | 只读 |
| `domain.org.name` | string | — | — | 可空; ≤100字符 |
| `domain.org.api_key` | string | ✅ | — | 只读 |

**可能的错误响应（DRF 标准）**

- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）
- **400**: 请求参数校验失败（query/header/body 不合法）

---
### PATCH `/api/api-settings/{id}/` 🔒

部分更新 API 设置

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**请求体** `application/json`

**Schema: `PatchedAPISettingsSwaggerRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `title` | string | — | — | — |
| `website` | string(uri) | — | — | 可空; ≤255字符 |
| `lead_assigned_to` | [string] | — | — | — |
| `tags` | [string] | — | — | — |

**200** → `DomainPatchResponse`

**Schema: `DomainPatchResponse`**

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
### PUT `/api/api-settings/{id}/` 🔒

新建/编辑 API 设置（域名）

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**请求体** `application/json`

> 新建/编辑 API 设置（域名）

**Schema: `APISettingsSwaggerRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `title` | string | ✅ | — | — |
| `website` | string(uri) | — | — | 可空; ≤255字符 |
| `lead_assigned_to` | [string] | ✅ | — | — |
| `tags` | [string] | — | — | — |

**200** → `DomainUpdateResponse`

**Schema: `DomainUpdateResponse`**

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
### POST `/api/auth/login/` 🟢

邮箱密码登录

**请求体** `application/json`

> 登录凭证

**Schema: `LoginRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `email` | string(email) | ✅ | — | — |
| `password` | string | ✅ | — | — |

**200** → `application/json`（OpenAPI 未标注 schema）

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）

---
### GET `/api/auth/me/` 🔒

获取当前登录用户及其组织信息

**200** → `UserDetail`

**Schema: `UserDetail`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `id` | string(uuid) | ✅ | — | 只读 |
| `email` | string(email) | — | Email address | ≤254字符 |
| `profile_pic` | string | — | — | 可空; ≤1000字符 |
| `is_active` | boolean | — | — | — |
| `organizations` | [any] | ✅ | Get all organizations the user belongs to | 只读 |

**可能的错误响应（DRF 标准）**

- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### GET `/api/auth/profile/` 🔒

获取当前用户在指定组织的个人资料

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `org` | header | string(uuid) | ✅ | Organization ID |

**200** → `ProfileDetail`

**Schema: `ProfileDetail`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `id` | string(uuid) | ✅ | — | 只读 |
| `user` | any | ✅ | — | 只读 |
| `org` | any | ✅ | — | 只读 |
| `role` | → ProfileRoleEnum | — | — | — |
| `is_organization_admin` | boolean | — | — | — |
| `has_sales_access` | boolean | — | — | — |
| `has_marketing_access` | boolean | — | — | — |
| `phone` | string | — | — | 可空; ≤20字符 |
| `date_of_joining` | string(date) | — | — | 可空 |
| `is_active` | boolean | — | — | — |

**可能的错误响应（DRF 标准）**

- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）
- **400**: 请求参数校验失败（query/header/body 不合法）

---
### POST `/api/auth/refresh-token/` 🟢

刷新访问令牌（校验组织成员资格）

**请求体** `application/json`

**Schema: `OrgAwareTokenRefreshRequestRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `refresh` | string | ✅ | Refresh token | — |

**200** → `OrgAwareTokenRefreshResponse`

**Schema: `OrgAwareTokenRefreshResponse`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `access` | string | ✅ | — | — |
| `refresh` | string | ✅ | — | — |

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）

---
### POST `/api/auth/register/` 🟢

注册新用户 account

**请求体** `application/json`

> 注册新用户

**Schema: `RegisterRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `email` | string(email) | — | Email address | ≤254字符 |
| `password` | string | ✅ | — | — |
| `confirm_password` | string | ✅ | — | — |

**201** → `application/json`（OpenAPI 未标注 schema）

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）

---
### POST `/api/auth/switch-org/` 🔒

切换组织并获取新 JWT

**请求体** `application/json`

> 切换组织

**Schema: `OrgSwitchRequestRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `org_id` | string(uuid) | ✅ | Target organization ID | — |

**200** → `OrgSwitchResponse`

**Schema: `OrgSwitchResponse`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `access_token` | string | ✅ | — | — |
| `refresh_token` | string | ✅ | — | — |
| `current_org` | object | ✅ | — | — |
| `profile` | object | ✅ | — | — |

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### GET `/api/documents/` 🔒

列表查询

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `org` | header | string | — | — |
| `shared_to` | query | string | — | — |
| `status` | query | string | — | 枚举: Active, In Active |
| `title` | query | string | — | — |

**200** → `documents`

> ✅ 后端实测: 自定义 dict（OpenAPI 未标注）；顶层字段: documents_active, documents_inactive, search, status_choices, users

**Schema: `documents → 响应（后端实测）`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `search` | boolean | — | — | — |
| `documents_active` | object | — | — | — |
| `documents_inactive` | object | — | — | — |
| `users` | [object] | — | — | — |
| `status_choices` | [array] | — | — | — |

**可能的错误响应（DRF 标准）**

- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）
- **400**: 请求参数校验失败（query/header/body 不合法）

---
### POST `/api/documents/` 🔒

新建文档

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `org` | header | string | — | — |

**请求体** `application/json`

> 新建文档

**Schema: `DocumentCreateSwaggerRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `title` | string | — | — | 可空 |
| `document_file` | string(binary) | ✅ | — | — |
| `teams` | [string] | ✅ | — | — |
| `shared_to` | [string] | ✅ | — | — |

**201** → `DocumentCreateResponse`

**Schema: `DocumentCreateResponse`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `error` | boolean | ✅ | — | — |
| `message` | string | ✅ | — | — |

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### DELETE `/api/documents/{id}/` 🔒

删除

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**200** → `DocumentDeleteResponse`

**Schema: `DocumentDeleteResponse`**

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
### GET `/api/documents/{id}/` 🔒

获取详情

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**200** → `DocumentDetailResponse`

**Schema: `DocumentDetailResponse`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `doc_obj` | → Document | ✅ | — | — |
| `doc_obj.id` | string(uuid) | ✅ | — | 只读 |
| `doc_obj.title` | string | — | — | 可空 |
| `doc_obj.document_file` | string(uri) | ✅ | — | — |
| `doc_obj.status` | → DocumentStatusEnum | — | — | — |
| `doc_obj.shared_to` | [Profile] | ✅ | — | 只读 |
| `doc_obj.shared_to[].id` | string(uuid) | ✅ | — | 只读 |
| `doc_obj.shared_to[].user_details` | object | ✅ | — | 只读 |
| `doc_obj.shared_to[].role` | → ProfileRoleEnum | — | — | — |
| `doc_obj.shared_to[].address` | string(uuid) | — | — | 可空 |
| `doc_obj.shared_to[].has_marketing_access` | boolean | — | — | — |
| `doc_obj.shared_to[].has_sales_access` | boolean | — | — | — |
| `doc_obj.shared_to[].phone` | string | — | — | 可空; ≤20字符 |
| `doc_obj.shared_to[].date_of_joining` | string(date) | — | — | 可空 |
| `doc_obj.shared_to[].is_active` | boolean | — | — | — |
| `doc_obj.shared_to[].created_at` | string(date-time) | ✅ | — | 只读 |
| `doc_obj.teams` | [any] | ✅ | — | 只读 |
| `doc_obj.created_at` | string(date-time) | ✅ | — | 只读 |
| `doc_obj.created_by` | → User | ✅ | — | — |
| `doc_obj.created_by.id` | string(uuid) | ✅ | — | 只读 |
| `doc_obj.created_by.email` | string(email) | — | Email address | ≤254字符 |
| `doc_obj.created_by.profile_pic` | string | — | — | 可空; ≤1000字符 |
| `doc_obj.org` | → Organization | ✅ | — | — |
| `doc_obj.org.id` | string(uuid) | ✅ | — | 只读 |
| `doc_obj.org.name` | string | — | — | 可空; ≤100字符 |
| `doc_obj.org.api_key` | string | ✅ | — | 只读 |
| `file_type_code` | string | ✅ | — | — |
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

**可能的错误响应（DRF 标准）**

- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）
- **400**: 请求参数校验失败（query/header/body 不合法）

---
### PATCH `/api/documents/{id}/` 🔒

部分更新文档

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**请求体** `application/json`

**Schema: `PatchedDocumentEditSwaggerRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `title` | string | — | — | 可空 |
| `document_file` | string(binary) | — | — | — |
| `teams` | [string] | — | — | — |
| `shared_to` | [string] | — | — | — |
| `status` | → DocumentStatusEnum | — | — | — |

**200** → `DocumentPatchResponse`

**Schema: `DocumentPatchResponse`**

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
### PUT `/api/documents/{id}/` 🔒

编辑文档

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**请求体** `application/json`

> 编辑文档

**Schema: `DocumentEditSwaggerRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `title` | string | — | — | 可空 |
| `document_file` | string(binary) | ✅ | — | — |
| `teams` | [string] | ✅ | — | — |
| `shared_to` | [string] | ✅ | — | — |
| `status` | → DocumentStatusEnum | — | — | — |

**200** → `DocumentUpdateResponse`

**Schema: `DocumentUpdateResponse`**

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
### GET `/api/org/` 🔒

获取当前用户关联的组织列表

**200** → `org`

> ✅ 后端实测: 自定义 dict（OpenAPI 未标注）；顶层字段: error, profile_org_list, status

**Schema: `org → 响应（后端实测）`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `error` | boolean | — | — | — |
| `status` | integer | — | — | — |
| `profile_org_list` | [object] | — | — | — |

**可能的错误响应（DRF 标准）**

- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### POST `/api/org/` 🔒

创建组织 + 个人资料

**请求体** `application/json`

> 创建组织和个人资料

**Schema: `OrgProfileCreateRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `name` | string | ✅ | — | ≤255字符 |

**200** → `OrgProfileCreate`

**Schema: `OrgProfileCreate`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `name` | string | ✅ | — | ≤255字符 |

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### GET `/api/org/settings/` 🔒

获取当前组织设置 .

**200** → `settings`

> ✅ 后端实测: 自定义 dict（OpenAPI 未标注）；顶层字段: address_line, city, company_name, country, currency_symbol, default_country, default_currency, email, id, logo, logo_url, name...

**Schema: `settings → 响应（后端实测）`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `id` | string | — | — | — |
| `name` | string | — | — | — |
| `company_name` | string | — | — | — |
| `logo` | string | — | — | 可空 |
| `logo_url` | string | — | — | 可空 |
| `address_line` | string | — | — | — |
| `city` | string | — | — | — |
| `state` | string | — | — | — |
| `postcode` | string | — | — | — |
| `country` | string | — | — | — |
| `phone` | string | — | — | — |
| `email` | string | — | — | — |
| `website` | string | — | — | — |
| `tax_id` | string | — | — | — |
| `default_currency` | string | — | — | — |
| `default_country` | string | — | — | — |
| `currency_symbol` | string | — | — | — |

**可能的错误响应（DRF 标准）**

- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### PATCH `/api/org/settings/` 🔒

更新组织设置 (admin only).

**200** → 推断: Organization

> OpenAPI 未标注；更新成功推断返回 `Organization`

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### GET `/api/org/{id}/` 🔒

获取组织详情

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |

**200** → `Organization`

**Schema: `Organization`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `id` | string(uuid) | ✅ | — | 只读 |
| `name` | string | — | — | 可空; ≤100字符 |
| `api_key` | string | ✅ | — | 只读 |

**可能的错误响应（DRF 标准）**

- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）
- **400**: 请求参数校验失败（query/header/body 不合法）

---
### PATCH `/api/org/{id}/` 🔒

部分更新组织详情

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |

**请求体** `application/json`

**Schema: `PatchedOrganizationRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `name` | string | — | — | 可空; ≤100字符 |

**200** → `Organization`

**Schema: `Organization`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `id` | string(uuid) | ✅ | — | 只读 |
| `name` | string | — | — | 可空; ≤100字符 |
| `api_key` | string | ✅ | — | 只读 |

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### PUT `/api/org/{id}/` 🔒

更新组织详情

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |

**请求体** `application/json`

> 新建/编辑组织

**Schema: `OrganizationRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `name` | string | — | — | 可空; ≤100字符 |

**200** → `Organization`

**Schema: `Organization`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `id` | string(uuid) | ✅ | — | 只读 |
| `name` | string | — | — | 可空; ≤100字符 |
| `api_key` | string | ✅ | — | 只读 |

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### GET `/api/profile/` 🔒

列表查询

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `org` | header | string | — | — |

**200** → `profile`

> ✅ 后端实测: 自定义 dict（OpenAPI 未标注）；顶层字段: user_obj

**Schema: `profile → 响应（后端实测）`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `user_obj` | object | — | — | — |

**可能的错误响应（DRF 标准）**

- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）
- **400**: 请求参数校验失败（query/header/body 不合法）

---
### PATCH `/api/profile/` 🔒

部分更新

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `org` | header | string | — | — |

**请求体** `application/json`

**Schema: `PatchedProfilePatchRequestRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `phone` | string | — | — | — |

**200** → `ProfilePatchUpdateResponse`

**Schema: `ProfilePatchUpdateResponse`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `message` | string | ✅ | — | — |
| `user_obj` | → Profile | ✅ | — | — |
| `user_obj.id` | string(uuid) | ✅ | — | 只读 |
| `user_obj.user_details` | object | ✅ | — | 只读 |
| `user_obj.role` | → ProfileRoleEnum | — | — | — |
| `user_obj.address` | string(uuid) | — | — | 可空 |
| `user_obj.has_marketing_access` | boolean | — | — | — |
| `user_obj.has_sales_access` | boolean | — | — | — |
| `user_obj.phone` | string | — | — | 可空; ≤20字符 |
| `user_obj.date_of_joining` | string(date) | — | — | 可空 |
| `user_obj.is_active` | boolean | — | — | — |
| `user_obj.created_at` | string(date-time) | ✅ | — | 只读 |

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### GET `/api/tags/` 🔒

列出组织的所有标签 .

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `org` | header | string | — | — |

**200** → `tags`

> ✅ 后端实测: 自定义 dict（OpenAPI 未标注）；顶层字段: tags, tags_count

**Schema: `tags → 响应（后端实测）`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `tags_count` | integer | — | — | — |
| `tags` | [object] | — | — | — |

**可能的错误响应（DRF 标准）**

- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）
- **400**: 请求参数校验失败（query/header/body 不合法）

---
### POST `/api/tags/` 🔒

新建标签 (admin only).

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `org` | header | string | — | — |

**请求体** `application/json`

> 新建/编辑标签

**Schema: `TagsRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `name` | string | ✅ | — | ≤50字符 |
| `color` | → ColorEnum | — | — | — |
| `description` | string | — | — | — |
| `is_active` | boolean | — | — | — |

**200** → `TagCreateResponse`

**Schema: `TagCreateResponse`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `error` | boolean | ✅ | — | — |
| `message` | string | ✅ | — | — |
| `tag` | → Tags | ✅ | — | — |
| `tag.id` | string(uuid) | ✅ | — | 只读 |
| `tag.name` | string | ✅ | — | ≤50字符 |
| `tag.slug` | string | ✅ | — | 只读 |
| `tag.color` | → ColorEnum | — | — | — |
| `tag.description` | string | — | — | — |
| `tag.is_active` | boolean | — | — | — |
| `tag.created_at` | string(date-time) | ✅ | — | 只读 |

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### DELETE `/api/tags/{id}/` 🔒

归档标签（软删除） (admin only).

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**200** → `TagArchiveResponse`

**Schema: `TagArchiveResponse`**

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
### GET `/api/tags/{id}/` 🔒

获取单个标签 .

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**200** → `TagDetailResponse`

**Schema: `TagDetailResponse`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `tag` | → Tags | ✅ | — | — |
| `tag.id` | string(uuid) | ✅ | — | 只读 |
| `tag.name` | string | ✅ | — | ≤50字符 |
| `tag.slug` | string | ✅ | — | 只读 |
| `tag.color` | → ColorEnum | — | — | — |
| `tag.description` | string | — | — | — |
| `tag.is_active` | boolean | — | — | — |
| `tag.created_at` | string(date-time) | ✅ | — | 只读 |

**可能的错误响应（DRF 标准）**

- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）
- **400**: 请求参数校验失败（query/header/body 不合法）

---
### PUT `/api/tags/{id}/` 🔒

更新标签 (admin only).

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**请求体** `application/json`

> 新建/编辑标签

**Schema: `TagsRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `name` | string | ✅ | — | ≤50字符 |
| `color` | → ColorEnum | — | — | — |
| `description` | string | — | — | — |
| `is_active` | boolean | — | — | — |

**200** → `TagUpdateResponse`

**Schema: `TagUpdateResponse`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `error` | boolean | ✅ | — | — |
| `message` | string | ✅ | — | — |
| `tag` | → Tags | ✅ | — | — |
| `tag.id` | string(uuid) | ✅ | — | 只读 |
| `tag.name` | string | ✅ | — | ≤50字符 |
| `tag.slug` | string | ✅ | — | 只读 |
| `tag.color` | → ColorEnum | — | — | — |
| `tag.description` | string | — | — | — |
| `tag.is_active` | boolean | — | — | — |
| `tag.created_at` | string(date-time) | ✅ | — | 只读 |

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### POST `/api/tags/{id}/restore/` 🔒

恢复已归档标签 (admin only).

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**200** → `TagRestoreResponse`

**Schema: `TagRestoreResponse`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `error` | boolean | ✅ | — | — |
| `message` | string | ✅ | — | — |
| `tag` | → Tags | ✅ | — | — |
| `tag.id` | string(uuid) | ✅ | — | 只读 |
| `tag.name` | string | ✅ | — | ≤50字符 |
| `tag.slug` | string | ✅ | — | 只读 |
| `tag.color` | → ColorEnum | — | — | — |
| `tag.description` | string | — | — | — |
| `tag.is_active` | boolean | — | — | — |
| `tag.created_at` | string(date-time) | ✅ | — | 只读 |

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### GET `/api/teams/` 🔒

列表查询

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `assigned_users` | query | string | — | — |
| `created_by` | query | string | — | — |
| `org` | header | string | — | — |
| `team_name` | query | string | — | — |

**200** → `teams`

> ✅ 后端实测: 自定义 dict（OpenAPI 未标注）；顶层字段: offset, page_number, per_page, teams, teams_count

**Schema: `teams → 响应（后端实测）`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `per_page` | integer | — | — | — |
| `page_number` | [string] | — | — | — |
| `teams_count` | integer | — | — | — |
| `offset` | integer | — | — | — |
| `teams` | [object] | — | — | — |

**可能的错误响应（DRF 标准）**

- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）
- **400**: 请求参数校验失败（query/header/body 不合法）

---
### POST `/api/teams/` 🔒

新建/编辑团队

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `org` | header | string | — | — |

**请求体** `application/json`

> 新建/编辑团队

**Schema: `TeamswaggerCreateRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `name` | string | ✅ | — | ≤100字符 |
| `description` | string | ✅ | — | — |
| `users` | [string] | ✅ | — | — |

**200** → `TeamCreateResponse`

**Schema: `TeamCreateResponse`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `error` | boolean | ✅ | — | — |
| `message` | string | ✅ | — | — |

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### DELETE `/api/teams/{id}/` 🔒

删除

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**200** → `TeamDeleteResponse`

**Schema: `TeamDeleteResponse`**

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
### GET `/api/teams/{id}/` 🔒

获取详情

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**200** → `TeamDetailResponse`

**Schema: `TeamDetailResponse`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `team` | → Teams | ✅ | — | — |
| `team.id` | string(uuid) | ✅ | — | 只读 |
| `team.name` | string | ✅ | — | ≤100字符 |
| `team.description` | string | ✅ | — | — |
| `team.users` | [Profile] | ✅ | — | 只读 |
| `team.users[].id` | string(uuid) | ✅ | — | 只读 |
| `team.users[].user_details` | object | ✅ | — | 只读 |
| `team.users[].role` | → ProfileRoleEnum | — | — | — |
| `team.users[].address` | string(uuid) | — | — | 可空 |
| `team.users[].has_marketing_access` | boolean | — | — | — |
| `team.users[].has_sales_access` | boolean | — | — | — |
| `team.users[].phone` | string | — | — | 可空; ≤20字符 |
| `team.users[].date_of_joining` | string(date) | — | — | 可空 |
| `team.users[].is_active` | boolean | — | — | — |
| `team.users[].created_at` | string(date-time) | ✅ | — | 只读 |
| `team.created_at` | string(date-time) | ✅ | — | 只读 |
| `team.created_by` | → User | ✅ | — | — |
| `team.created_by.id` | string(uuid) | ✅ | — | 只读 |
| `team.created_by.email` | string(email) | — | Email address | ≤254字符 |
| `team.created_by.profile_pic` | string | — | — | 可空; ≤1000字符 |

**可能的错误响应（DRF 标准）**

- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）
- **400**: 请求参数校验失败（query/header/body 不合法）

---
### PATCH `/api/teams/{id}/` 🔒

部分更新团队

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**请求体** `application/json`

**Schema: `PatchedTeamswaggerCreateRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `name` | string | — | — | ≤100字符 |
| `description` | string | — | — | — |
| `users` | [string] | — | — | — |

**200** → `TeamPatchResponse`

**Schema: `TeamPatchResponse`**

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
### PUT `/api/teams/{id}/` 🔒

新建/编辑团队

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**请求体** `application/json`

> 新建/编辑团队

**Schema: `TeamswaggerCreateRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `name` | string | ✅ | — | ≤100字符 |
| `description` | string | ✅ | — | — |
| `users` | [string] | ✅ | — | — |

**200** → `TeamUpdateResponse`

**Schema: `TeamUpdateResponse`**

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
### DELETE `/api/user/{id}/` 🔒

删除

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**200** → `UserDeleteResponse`

**Schema: `UserDeleteResponse`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `status` | string | ✅ | — | — |

**可能的错误响应（DRF 标准）**

- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）
- **400**: 请求参数校验失败（query/header/body 不合法）

---
### GET `/api/user/{id}/` 🔒

获取详情

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**200** → `UserDetailResponse`

**Schema: `UserDetailResponse`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `error` | boolean | ✅ | — | — |
| `data` | object | ✅ | — | — |

**可能的错误响应（DRF 标准）**

- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）
- **400**: 请求参数校验失败（query/header/body 不合法）

---
### PATCH `/api/user/{id}/` 🔒

部分更新用户

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**请求体** `application/json`

**Schema: `PatchedUserCreateSwaggerRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `email` | string | — | — | ≤1000字符 |
| `role` | → ProfileRoleEnum | — | — | — |
| `phone` | string | — | — | ≤12字符 |
| `alternate_phone` | string | — | — | ≤12字符 |
| `address_line` | string | — | — | ≤10000字符 |
| `street` | string | — | — | ≤1000字符 |
| `city` | string | — | — | ≤1000字符 |
| `state` | string | — | — | ≤1000字符 |
| `pincode` | string | — | — | ≤1000字符 |
| `country` | string | — | — | ≤1000字符 |

**200** → `UserPatchResponse`

**Schema: `UserPatchResponse`**

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
### PUT `/api/user/{id}/` 🔒

新建/编辑用户

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**请求体** `application/json`

> 新建/编辑用户

**Schema: `UserCreateSwaggerRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `email` | string | ✅ | — | ≤1000字符 |
| `role` | → ProfileRoleEnum | ✅ | — | — |
| `phone` | string | ✅ | — | ≤12字符 |
| `alternate_phone` | string | ✅ | — | ≤12字符 |
| `address_line` | string | ✅ | — | ≤10000字符 |
| `street` | string | ✅ | — | ≤1000字符 |
| `city` | string | ✅ | — | ≤1000字符 |
| `state` | string | ✅ | — | ≤1000字符 |
| `pincode` | string | ✅ | — | ≤1000字符 |
| `country` | string | ✅ | — | ≤1000字符 |

**200** → `UserUpdateResponse`

**Schema: `UserUpdateResponse`**

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
### POST `/api/user/{id}/status/` 🔒

用户状态管理

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**请求体** `application/json`

> 更新用户状态（启用/停用）

**Schema: `UserUpdateStatusSwaggerRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `status` | → UserUpdateStatusSwaggerStatusEnum | ✅ | — | — |

**200** → `UserStatusResponse`

**Schema: `UserStatusResponse`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `active_profiles` | [Profile] | ✅ | — | — |
| `active_profiles[].id` | string(uuid) | ✅ | — | 只读 |
| `active_profiles[].user_details` | object | ✅ | — | 只读 |
| `active_profiles[].role` | → ProfileRoleEnum | — | — | — |
| `active_profiles[].address` | string(uuid) | — | — | 可空 |
| `active_profiles[].has_marketing_access` | boolean | — | — | — |
| `active_profiles[].has_sales_access` | boolean | — | — | — |
| `active_profiles[].phone` | string | — | — | 可空; ≤20字符 |
| `active_profiles[].date_of_joining` | string(date) | — | — | 可空 |
| `active_profiles[].is_active` | boolean | — | — | — |
| `active_profiles[].created_at` | string(date-time) | ✅ | — | 只读 |
| `inactive_profiles` | [Profile] | ✅ | — | — |
| `inactive_profiles[].id` | string(uuid) | ✅ | — | 只读 |
| `inactive_profiles[].user_details` | object | ✅ | — | 只读 |
| `inactive_profiles[].role` | → ProfileRoleEnum | — | — | — |
| `inactive_profiles[].address` | string(uuid) | — | — | 可空 |
| `inactive_profiles[].has_marketing_access` | boolean | — | — | — |
| `inactive_profiles[].has_sales_access` | boolean | — | — | — |
| `inactive_profiles[].phone` | string | — | — | 可空; ≤20字符 |
| `inactive_profiles[].date_of_joining` | string(date) | — | — | 可空 |
| `inactive_profiles[].is_active` | boolean | — | — | — |
| `inactive_profiles[].created_at` | string(date-time) | ✅ | — | 只读 |

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### GET `/api/users/` 🔒

列表查询

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `email` | query | string | — | — |
| `org` | header | string | — | — |
| `role` | query | string | — | 枚举: ADMIN, USER |
| `status` | query | string | — | 枚举: Active, In Active |

**200** → `users`

> ✅ 后端实测: 自定义 dict（OpenAPI 未标注）；顶层字段: active_users, admin_email, inactive_users, roles, status

**Schema: `users → 响应（后端实测）`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `active_users` | object | — | — | — |
| `inactive_users` | object | — | — | — |
| `admin_email` | string | — | — | — |
| `roles` | [array] | — | — | — |
| `status` | [array] | — | — | — |

**可能的错误响应（DRF 标准）**

- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）
- **400**: 请求参数校验失败（query/header/body 不合法）

---
### POST `/api/users/` 🔒

新建/编辑用户

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `org` | header | string | — | — |

**请求体** `application/json`

> 新建/编辑用户

**Schema: `UserCreateSwaggerRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `email` | string | ✅ | — | ≤1000字符 |
| `role` | → ProfileRoleEnum | ✅ | — | — |
| `phone` | string | ✅ | — | ≤12字符 |
| `alternate_phone` | string | ✅ | — | ≤12字符 |
| `address_line` | string | ✅ | — | ≤10000字符 |
| `street` | string | ✅ | — | ≤1000字符 |
| `city` | string | ✅ | — | ≤1000字符 |
| `state` | string | ✅ | — | ≤1000字符 |
| `pincode` | string | ✅ | — | ≤1000字符 |
| `country` | string | ✅ | — | ≤1000字符 |

**201** → `UserCreateResponse`

**Schema: `UserCreateResponse`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `error` | boolean | ✅ | — | — |
| `message` | string | ✅ | — | — |

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### GET `/api/users/get-teams-and-users/` 🔒

列表查询

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `org` | header | string | — | — |

**200** → `get-teams-and-users`

> ✅ 后端实测: 自定义 dict（OpenAPI 未标注）；顶层字段: profiles, teams

**Schema: `get-teams-and-users → 响应（后端实测）`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `teams` | [object] | — | — | — |
| `profiles` | [object] | — | — | — |

**可能的错误响应（DRF 标准）**

- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）
- **400**: 请求参数校验失败（query/header/body 不合法）

---