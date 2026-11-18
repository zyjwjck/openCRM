# 系统与设置

> 共 47 个端点。🔒 = 需要登录（JWT），🟢 = 无需鉴权。

## 端点速览

| 方法 | 路径 | 鉴权 | 说明 |
|------|------|------|------|
| GET | `/api/api-settings/` | 🔒 |  |
| POST | `/api/api-settings/` | 🔒 |  |
| DELETE | `/api/api-settings/{id}/` | 🔒 |  |
| GET | `/api/api-settings/{id}/` | 🔒 |  |
| PATCH | `/api/api-settings/{id}/` | 🔒 | Partial API Settings Update |
| PUT | `/api/api-settings/{id}/` | 🔒 |  |
| POST | `/api/auth/login/` | 🟢 | Login with email and password |
| GET | `/api/auth/me/` | 🔒 | Get current authenticated user with organizations |
| GET | `/api/auth/profile/` | 🔒 | Get profile for current user in specified organization |
| POST | `/api/auth/refresh-token/` | 🟢 | Refresh access token with org membership validation |
| POST | `/api/auth/register/` | 🟢 | Register a new user account |
| POST | `/api/auth/switch-org/` | 🔒 | Switch to a different organization and get new JWT tokens |
| GET | `/api/documents/` | 🔒 |  |
| POST | `/api/documents/` | 🔒 |  |
| DELETE | `/api/documents/{id}/` | 🔒 |  |
| GET | `/api/documents/{id}/` | 🔒 |  |
| PATCH | `/api/documents/{id}/` | 🔒 | Partial Document Update |
| PUT | `/api/documents/{id}/` | 🔒 |  |
| GET | `/api/org/` | 🔒 | Just Pass the token, will return ORG list, associated with user |
| POST | `/api/org/` | 🔒 | Organization and profile Creation api |
| GET | `/api/org/settings/` | 🔒 | Get current organization settings. |
| PATCH | `/api/org/settings/` | 🔒 | Update organization settings (admin only). |
| GET | `/api/org/{id}/` | 🔒 | Get organization details |
| PATCH | `/api/org/{id}/` | 🔒 | Partial update organization details |
| PUT | `/api/org/{id}/` | 🔒 | Update organization details |
| GET | `/api/profile/` | 🔒 |  |
| PATCH | `/api/profile/` | 🔒 |  |
| GET | `/api/tags/` | 🔒 | List all tags for the organization. |
| POST | `/api/tags/` | 🔒 | Create a new tag (admin only). |
| DELETE | `/api/tags/{id}/` | 🔒 | Archive a tag - soft delete (admin only). |
| GET | `/api/tags/{id}/` | 🔒 | Get a single tag by ID. |
| PUT | `/api/tags/{id}/` | 🔒 | Update a tag (admin only). |
| POST | `/api/tags/{id}/restore/` | 🔒 | Restore an archived tag (admin only). |
| GET | `/api/teams/` | 🔒 |  |
| POST | `/api/teams/` | 🔒 |  |
| DELETE | `/api/teams/{id}/` | 🔒 |  |
| GET | `/api/teams/{id}/` | 🔒 |  |
| PATCH | `/api/teams/{id}/` | 🔒 | Partial Team Update |
| PUT | `/api/teams/{id}/` | 🔒 |  |
| DELETE | `/api/user/{id}/` | 🔒 |  |
| GET | `/api/user/{id}/` | 🔒 |  |
| PATCH | `/api/user/{id}/` | 🔒 | Partial User Update |
| PUT | `/api/user/{id}/` | 🔒 |  |
| POST | `/api/user/{id}/status/` | 🔒 | User Status View |
| GET | `/api/users/` | 🔒 |  |
| POST | `/api/users/` | 🔒 |  |
| GET | `/api/users/get-teams-and-users/` | 🔒 |  |

## 端点详情

### GET `/api/api-settings/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `org` | header | string | — |  |

**响应**

- **200** `DomainListResponse` 

---

### POST `/api/api-settings/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `org` | header | string | — |  |

**请求体** `application/json`

```
APISettingsSwaggerRequest
```

**响应**

- **201** `DomainCreateResponse` 

---

### DELETE `/api/api-settings/{id}/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**响应**

- **200** `DomainDeleteResponse` 

---

### GET `/api/api-settings/{id}/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**响应**

- **200** `DomainDetailResponse` 

---

### PATCH `/api/api-settings/{id}/` 🔒

Partial API Settings Update

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**请求体** `application/json`

```
PatchedAPISettingsSwaggerRequest
```

**响应**

- **200** `DomainPatchResponse` 

---

### PUT `/api/api-settings/{id}/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**请求体** `application/json`

```
APISettingsSwaggerRequest
```

**响应**

- **200** `DomainUpdateResponse` 

---

### POST `/api/auth/login/` 🟢

Login with email and password

**请求体** `application/json`

```
LoginRequest
```

**响应**

- **200** `object` 

---

### GET `/api/auth/me/` 🔒

Get current authenticated user with organizations

**响应**

- **200** `UserDetail` 

---

### GET `/api/auth/profile/` 🔒

Get profile for current user in specified organization

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `org` | header | string | ✅ | Organization ID |

**响应**

- **200** `ProfileDetail` 

---

### POST `/api/auth/refresh-token/` 🟢

Refresh access token with org membership validation

**请求体** `application/json`

```
OrgAwareTokenRefreshRequestRequest
```

**响应**

- **200** `OrgAwareTokenRefreshResponse` 

---

### POST `/api/auth/register/` 🟢

Register a new user account

**请求体** `application/json`

```
RegisterRequest
```

**响应**

- **201** `object` 

---

### POST `/api/auth/switch-org/` 🔒

Switch to a different organization and get new JWT tokens

**请求体** `application/json`

```
OrgSwitchRequestRequest
```

**响应**

- **200** `OrgSwitchResponse` 

---

### GET `/api/documents/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `org` | header | string | — |  |
| `shared_to` | query | string | — |  |
| `status` | query | string | — |  |
| `title` | query | string | — |  |

**响应**

- **200** `DocumentListResponse` 

---

### POST `/api/documents/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `org` | header | string | — |  |

**请求体** `application/json`

```
DocumentCreateSwaggerRequest
```

**响应**

- **201** `DocumentCreateResponse` 

---

### DELETE `/api/documents/{id}/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**响应**

- **200** `DocumentDeleteResponse` 

---

### GET `/api/documents/{id}/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**响应**

- **200** `DocumentDetailResponse` 

---

### PATCH `/api/documents/{id}/` 🔒

Partial Document Update

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**请求体** `application/json`

```
PatchedDocumentEditSwaggerRequest
```

**响应**

- **200** `DocumentPatchResponse` 

---

### PUT `/api/documents/{id}/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**请求体** `application/json`

```
DocumentEditSwaggerRequest
```

**响应**

- **200** `DocumentUpdateResponse` 

---

### GET `/api/org/` 🔒

Just Pass the token, will return ORG list, associated with user

**响应**

- **200** `OrgProfileCreate` 

---

### POST `/api/org/` 🔒

Organization and profile Creation api

**请求体** `application/json`

```
OrgProfileCreateRequest
```

**响应**

- **200** `OrgProfileCreate` 

---

### GET `/api/org/settings/` 🔒

Get current organization settings.

**响应**

- **200** `` No response body

---

### PATCH `/api/org/settings/` 🔒

Update organization settings (admin only).

**响应**

- **200** `` No response body

---

### GET `/api/org/{id}/` 🔒

Get organization details

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |

**响应**

- **200** `Organization` 

---

### PATCH `/api/org/{id}/` 🔒

Partial update organization details

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |

**请求体** `application/json`

```
PatchedOrganizationRequest
```

**响应**

- **200** `Organization` 

---

### PUT `/api/org/{id}/` 🔒

Update organization details

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |

**请求体** `application/json`

```
OrganizationRequest
```

**响应**

- **200** `Organization` 

---

### GET `/api/profile/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `org` | header | string | — |  |

**响应**

- **200** `ProfileViewResponse` 

---

### PATCH `/api/profile/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `org` | header | string | — |  |

**请求体** `application/json`

```
PatchedProfilePatchRequestRequest
```

**响应**

- **200** `ProfilePatchUpdateResponse` 

---

### GET `/api/tags/` 🔒

List all tags for the organization.

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `org` | header | string | — |  |

**响应**

- **200** `TagsListResponse` 

---

### POST `/api/tags/` 🔒

Create a new tag (admin only).

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `org` | header | string | — |  |

**请求体** `application/json`

```
TagsRequest
```

**响应**

- **200** `TagCreateResponse` 

---

### DELETE `/api/tags/{id}/` 🔒

Archive a tag - soft delete (admin only).

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**响应**

- **200** `TagArchiveResponse` 

---

### GET `/api/tags/{id}/` 🔒

Get a single tag by ID.

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**响应**

- **200** `TagDetailResponse` 

---

### PUT `/api/tags/{id}/` 🔒

Update a tag (admin only).

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**请求体** `application/json`

```
TagsRequest
```

**响应**

- **200** `TagUpdateResponse` 

---

### POST `/api/tags/{id}/restore/` 🔒

Restore an archived tag (admin only).

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**响应**

- **200** `TagRestoreResponse` 

---

### GET `/api/teams/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `assigned_users` | query | string | — |  |
| `created_by` | query | string | — |  |
| `org` | header | string | — |  |
| `team_name` | query | string | — |  |

**响应**

- **200** `TeamsListResponse` 

---

### POST `/api/teams/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `org` | header | string | — |  |

**请求体** `application/json`

```
TeamswaggerCreateRequest
```

**响应**

- **200** `TeamCreateResponse` 

---

### DELETE `/api/teams/{id}/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**响应**

- **200** `TeamDeleteResponse` 

---

### GET `/api/teams/{id}/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**响应**

- **200** `TeamDetailResponse` 

---

### PATCH `/api/teams/{id}/` 🔒

Partial Team Update

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**请求体** `application/json`

```
PatchedTeamswaggerCreateRequest
```

**响应**

- **200** `TeamPatchResponse` 

---

### PUT `/api/teams/{id}/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**请求体** `application/json`

```
TeamswaggerCreateRequest
```

**响应**

- **200** `TeamUpdateResponse` 

---

### DELETE `/api/user/{id}/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**响应**

- **200** `UserDeleteResponse` 

---

### GET `/api/user/{id}/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**响应**

- **200** `UserDetailResponse` 

---

### PATCH `/api/user/{id}/` 🔒

Partial User Update

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**请求体** `application/json`

```
PatchedUserCreateSwaggerRequest
```

**响应**

- **200** `UserPatchResponse` 

---

### PUT `/api/user/{id}/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**请求体** `application/json`

```
UserCreateSwaggerRequest
```

**响应**

- **200** `UserUpdateResponse` 

---

### POST `/api/user/{id}/status/` 🔒

User Status View

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ |  |
| `org` | header | string | — |  |

**请求体** `application/json`

```
UserUpdateStatusSwaggerRequest
```

**响应**

- **200** `UserStatusResponse` 

---

### GET `/api/users/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `email` | query | string | — |  |
| `org` | header | string | — |  |
| `role` | query | string | — |  |
| `status` | query | string | — |  |

**响应**

- **200** `UsersListResponse` 

---

### POST `/api/users/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `org` | header | string | — |  |

**请求体** `application/json`

```
UserCreateSwaggerRequest
```

**响应**

- **201** `UserCreateResponse` 

---

### GET `/api/users/get-teams-and-users/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `org` | header | string | — |  |

**响应**

- **200** `TeamsAndUsersResponse` 

---
