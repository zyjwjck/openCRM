# 客户关系管理 — 联系人

> 共 11 个端点。🔒 = 需要登录（JWT），🟢 = 无需鉴权。
> 联系人 CRUD + 评论/附件。GET /api/contacts/ 返回**DRF 标准分页**（count + results），附加 users/countries 下拉选项。

## 端点速览

| 方法 | 路径 | 鉴权 | 说明 |
|------|------|------|------|
| GET | `/api/contacts/` | 🔒 | 列表查询 |
| POST | `/api/contacts/` | 🔒 | 新建 |
| DELETE | `/api/contacts/attachment/{id}/` | 🔒 | 删除 |
| DELETE | `/api/contacts/comment/{id}/` | 🔒 | 删除评论 |
| PATCH | `/api/contacts/comment/{id}/` | 🔒 | 部分更新评论 |
| PUT | `/api/contacts/comment/{id}/` | 🔒 | 全量更新 |
| DELETE | `/api/contacts/{id}/` | 🔒 | 删除 |
| GET | `/api/contacts/{id}/` | 🔒 | 获取详情 |
| PATCH | `/api/contacts/{id}/` | 🔒 | 部分更新联系人 |
| POST | `/api/contacts/{id}/` | 🔒 | 新建 |
| PUT | `/api/contacts/{id}/` | 🔒 | 全量更新 |

## 端点详情

### GET `/api/contacts/` 🔒

列表查询

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `assigned_to` | query | string | — | — |
| `city` | query | string | — | — |
| `name` | query | string | — | — |
| `org` | header | string | — | — |

**200** → `contacts`

> ✅ 后端实测: 自定义 dict（OpenAPI 未标注）；顶层字段: contact_obj_list, contacts_count, count, countries, offset, page_number, per_page, results, users

**Schema: `contacts → 响应（后端实测）`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `per_page` | integer | — | — | — |
| `page_number` | [string] | — | — | — |
| `count` | integer | — | — | — |
| `results` | [object] | — | — | — |
| `contacts_count` | integer | — | — | — |
| `offset` | integer | — | — | — |
| `contact_obj_list` | [object] | — | — | — |
| `countries` | [array] | — | — | — |
| `users` | [object] | — | — | — |

**可能的错误响应（DRF 标准）**

- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）
- **400**: 请求参数校验失败（query/header/body 不合法）

---
### POST `/api/contacts/` 🔒

新建

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `org` | header | string | — | — |

**请求体** `application/json`

**Schema: `CreateContactRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `first_name` | string | ✅ | — | ≤255字符 |
| `last_name` | string | ✅ | — | ≤255字符 |
| `email` | string(email) | — | — | 可空; ≤254字符 |
| `phone` | string | — | — | 可空; ≤25字符; 正则: ^[\d\s\-\(\)\+\.]{7,25}$ |
| `organization` | string | — | Company | 可空; ≤255字符 |
| `title` | string | — | Job Title | 可空; ≤255字符 |
| `department` | string | — | — | 可空; ≤255字符 |
| `do_not_call` | boolean | — | — | — |
| `linkedin_url` | string(uri) | — | — | 可空; ≤200字符 |
| `address_line` | string | — | Address | 可空; ≤255字符 |
| `city` | string | — | — | 可空; ≤255字符 |
| `state` | string | — | — | 可空; ≤255字符 |
| `postcode` | string | — | Postal Code | 可空; ≤64字符 |
| `country` | enum(ClientCountryEnum) | — | — | 枚举: GB, AF, AX, AL, DZ, AS, AD, AO, AI, AQ, AG, AR, AM, AW, AU, AT, AZ, BS, BH, BD, BB, BY, BE, BZ, BJ, BM, BT, BO, BA, BW, BV, BR, IO, BN, BG, BF, BI, KH, CM, CA, CV, KY, CF, TD, CL, CN, CX, CC, CO, KM, CG, CD, CK, CR, CI, HR, CU, CY, CZ, DK, DJ, DM, DO, EC, EG, SV, GQ, ER, EE, ET, FK, FO, FJ, FI, FR, GF, PF, TF, GA, GM, GE, DE, GH, GI, GR, GL, GD, GP, GU, GT, GG, GN, GW, GY, HT, HM, VA, HN, HK, HU, IS, IN, ID, IR, IQ, IE, IM, IL, IT, JM, JP, JE, JO, KZ, KE, KI, KP, KR, KW, KG, LA, LV, LB, LS, LR, LY, LI, LT, LU, MO, MK, MG, MW, MY, MV, ML, MT, MH, MQ, MR, MU, YT, MX, FM, MD, MC, MN, ME, MS, MA, MZ, MM, NA, NR, NP, NL, AN, NC, NZ, NI, NE, NG, NU, NF, MP, NO, OM, PK, PW, PS, PA, PG, PY, PE, PH, PN, PL, PT, PR, QA, RE, RO, RU, RW, BL, SH, KN, LC, MF, PM, VC, WS, SM, ST, SA, SN, RS, SC, SL, SG, SK, SI, SB, SO, ZA, GS, ES, LK, SD, SR, SJ, SZ, SE, CH, SY, TW, TJ, TZ, TH, TL, TG, TK, TO, TT, TN, TR, TM, TC, TV, UG, UA, AE, US, UM, UY, UZ, VU, VE, VN, VG, VI, WF, EH, YE, ZM, ZW; 可空 |
| `description` | string | — | Notes | 可空 |
| `account` | string(uuid) | — | Primary account this contact belongs to | 可空 |
| `is_active` | boolean | — | — | — |

**200** → `ContactCreateResponse`

**Schema: `ContactCreateResponse`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `error` | boolean | ✅ | — | — |
| `message` | string | ✅ | — | — |

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### DELETE `/api/contacts/attachment/{id}/` 🔒

删除

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**200** → `ContactAttachmentDeleteResponse`

**Schema: `ContactAttachmentDeleteResponse`**

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
### DELETE `/api/contacts/comment/{id}/` 🔒

删除评论

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**200** → `ContactCommentDeleteResponse`

**Schema: `ContactCommentDeleteResponse`**

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
### PATCH `/api/contacts/comment/{id}/` 🔒

部分更新评论

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**请求体** `application/json`

**Schema: `PatchedContactCommentEditSwaggerRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `comment` | string | — | — | — |

**200** → `ContactCommentPatchResponse`

**Schema: `ContactCommentPatchResponse`**

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
### PUT `/api/contacts/comment/{id}/` 🔒

全量更新

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**请求体** `application/json`

**Schema: `ContactCommentEditSwaggerRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `comment` | string | ✅ | — | — |

**200** → `ContactCommentUpdateResponse`

**Schema: `ContactCommentUpdateResponse`**

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
### DELETE `/api/contacts/{id}/` 🔒

删除

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**200** → `ContactDetailDeleteResponse`

**Schema: `ContactDetailDeleteResponse`**

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
### GET `/api/contacts/{id}/` 🔒

获取详情

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**200** → `ContactDetailResponse`

**Schema: `ContactDetailResponse`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `contact_obj` | → Contact | ✅ | — | — |
| `contact_obj.id` | string(uuid) | ✅ | — | 只读 |
| `contact_obj.first_name` | string | ✅ | — | ≤255字符 |
| `contact_obj.last_name` | string | ✅ | — | ≤255字符 |
| `contact_obj.email` | string(email) | — | — | 可空; ≤254字符 |
| `contact_obj.phone` | string | — | — | 可空; ≤25字符; 正则: ^[\d\s\-\(\)\+\.]{7,25}$ |
| `contact_obj.organization` | string | — | Company | 可空; ≤255字符 |
| `contact_obj.title` | string | — | Job Title | 可空; ≤255字符 |
| `contact_obj.department` | string | — | — | 可空; ≤255字符 |
| `contact_obj.do_not_call` | boolean | — | — | — |
| `contact_obj.linkedin_url` | string(uri) | — | — | 可空; ≤200字符 |
| `contact_obj.address_line` | string | — | Address | 可空; ≤255字符 |
| `contact_obj.city` | string | — | — | 可空; ≤255字符 |
| `contact_obj.state` | string | — | — | 可空; ≤255字符 |
| `contact_obj.postcode` | string | — | Postal Code | 可空; ≤64字符 |
| `contact_obj.country` | enum(ClientCountryEnum) | — | — | 枚举: GB, AF, AX, AL, DZ, AS, AD, AO, AI, AQ, AG, AR, AM, AW, AU, AT, AZ, BS, BH, BD, BB, BY, BE, BZ, BJ, BM, BT, BO, BA, BW, BV, BR, IO, BN, BG, BF, BI, KH, CM, CA, CV, KY, CF, TD, CL, CN, CX, CC, CO, KM, CG, CD, CK, CR, CI, HR, CU, CY, CZ, DK, DJ, DM, DO, EC, EG, SV, GQ, ER, EE, ET, FK, FO, FJ, FI, FR, GF, PF, TF, GA, GM, GE, DE, GH, GI, GR, GL, GD, GP, GU, GT, GG, GN, GW, GY, HT, HM, VA, HN, HK, HU, IS, IN, ID, IR, IQ, IE, IM, IL, IT, JM, JP, JE, JO, KZ, KE, KI, KP, KR, KW, KG, LA, LV, LB, LS, LR, LY, LI, LT, LU, MO, MK, MG, MW, MY, MV, ML, MT, MH, MQ, MR, MU, YT, MX, FM, MD, MC, MN, ME, MS, MA, MZ, MM, NA, NR, NP, NL, AN, NC, NZ, NI, NE, NG, NU, NF, MP, NO, OM, PK, PW, PS, PA, PG, PY, PE, PH, PN, PL, PT, PR, QA, RE, RO, RU, RW, BL, SH, KN, LC, MF, PM, VC, WS, SM, ST, SA, SN, RS, SC, SL, SG, SK, SI, SB, SO, ZA, GS, ES, LK, SD, SR, SJ, SZ, SE, CH, SY, TW, TJ, TZ, TH, TL, TG, TK, TO, TT, TN, TR, TM, TC, TV, UG, UA, AE, US, UM, UY, UZ, VU, VE, VN, VG, VI, WF, EH, YE, ZM, ZW; 可空 |
| `contact_obj.assigned_to` | [Profile] | ✅ | — | 只读 |
| `contact_obj.assigned_to[].id` | string(uuid) | ✅ | — | 只读 |
| `contact_obj.assigned_to[].user_details` | object | ✅ | — | 只读 |
| `contact_obj.assigned_to[].role` | → ProfileRoleEnum | — | — | — |
| `contact_obj.assigned_to[].address` | string(uuid) | — | — | 可空 |
| `contact_obj.assigned_to[].has_marketing_access` | boolean | — | — | — |
| `contact_obj.assigned_to[].has_sales_access` | boolean | — | — | — |
| `contact_obj.assigned_to[].phone` | string | — | — | 可空; ≤20字符 |
| `contact_obj.assigned_to[].date_of_joining` | string(date) | — | — | 可空 |
| `contact_obj.assigned_to[].is_active` | boolean | — | — | — |
| `contact_obj.assigned_to[].created_at` | string(date-time) | ✅ | — | 只读 |
| `contact_obj.teams` | [Teams] | ✅ | — | 只读 |
| `contact_obj.teams[].id` | string(uuid) | ✅ | — | 只读 |
| `contact_obj.teams[].name` | string | ✅ | — | ≤100字符 |
| `contact_obj.teams[].description` | string | ✅ | — | — |
| `contact_obj.teams[].users` | [Profile] | ✅ | — | 只读 |
| `contact_obj.teams[].users[].id` | string(uuid) | ✅ | — | 只读 |
| `contact_obj.teams[].users[].user_details` | object | ✅ | — | 只读 |
| `contact_obj.teams[].users[].role` | → ProfileRoleEnum | — | — | — |
| `contact_obj.teams[].users[].address` | string(uuid) | — | — | 可空 |
| `contact_obj.teams[].users[].has_marketing_access` | boolean | — | — | — |
| `contact_obj.teams[].users[].has_sales_access` | boolean | — | — | — |
| `contact_obj.teams[].users[].phone` | string | — | — | 可空; ≤20字符 |
| `contact_obj.teams[].users[].date_of_joining` | string(date) | — | — | 可空 |
| `contact_obj.teams[].users[].is_active` | boolean | — | — | — |
| `contact_obj.teams[].users[].created_at` | string(date-time) | ✅ | — | 只读 |
| `contact_obj.teams[].created_at` | string(date-time) | ✅ | — | 只读 |
| `contact_obj.teams[].created_by` | → User | ✅ | — | — |
| `contact_obj.teams[].created_by.id` | string(uuid) | ✅ | — | 只读 |
| `contact_obj.teams[].created_by.email` | string(email) | — | Email address | ≤254字符 |
| `contact_obj.teams[].created_by.profile_pic` | string | — | — | 可空; ≤1000字符 |
| `contact_obj.tags` | [string] | — | — | — |
| `contact_obj.description` | string | — | Notes | 可空 |
| `contact_obj.created_by` | string(uuid) | — | — | 可空 |
| `contact_obj.created_at` | string(date-time) | ✅ | — | 只读 |
| `contact_obj.is_active` | boolean | — | — | — |
| `contact_obj.org` | → Organization | ✅ | — | — |
| `contact_obj.org.id` | string(uuid) | ✅ | — | 只读 |
| `contact_obj.org.name` | string | — | — | 可空; ≤100字符 |
| `contact_obj.org.api_key` | string | ✅ | — | 只读 |
| `contact_obj.account` | string(uuid) | — | Primary account this contact belongs to | 可空 |
| `contact_obj.contact_attachment` | [Attachments] | ✅ | — | 只读 |
| `contact_obj.contact_attachment[].id` | string(uuid) | ✅ | — | 只读 |
| `contact_obj.contact_attachment[].created_by` | string(uuid) | — | — | 可空 |
| `contact_obj.contact_attachment[].file_name` | string | ✅ | — | ≤60字符 |
| `contact_obj.contact_attachment[].created_at` | string(date-time) | ✅ | — | 只读 |
| `contact_obj.contact_attachment[].file_path` | string | ✅ | — | 只读 |
| `contact_obj.contact_attachment[].content_type` | string | ✅ | Python model class name | 只读 |
| `contact_obj.contact_attachment[].object_id` | string(uuid) | ✅ | — | — |
| `contact_obj.contact_attachment[].org` | string(uuid) | ✅ | — | — |
| `address_obj` | object | ✅ | — | — |
| `comments` | [Comment] | ✅ | — | — |
| `comments[].id` | string(uuid) | ✅ | — | 只读 |
| `comments[].comment` | string | ✅ | — | ≤255字符 |
| `comments[].commented_on` | string(date-time) | ✅ | — | 只读 |
| `comments[].commented_by` | string(uuid) | — | — | 可空 |
| `comments[].content_type` | string | ✅ | Python model class name | 只读 |
| `comments[].object_id` | string(uuid) | ✅ | — | — |
| `comments[].org` | string(uuid) | ✅ | — | — |
| `attachments` | [Attachments] | ✅ | — | — |
| `attachments[].id` | string(uuid) | ✅ | — | 只读 |
| `attachments[].created_by` | string(uuid) | — | — | 可空 |
| `attachments[].file_name` | string | ✅ | — | ≤60字符 |
| `attachments[].created_at` | string(date-time) | ✅ | — | 只读 |
| `attachments[].file_path` | string | ✅ | — | 只读 |
| `attachments[].content_type` | string | ✅ | Python model class name | 只读 |
| `attachments[].object_id` | string(uuid) | ✅ | — | — |
| `attachments[].org` | string(uuid) | ✅ | — | — |
| `assigned_data` | [any] | ✅ | — | — |
| `tasks` | [Task] | ✅ | — | — |
| `tasks[].id` | string(uuid) | ✅ | — | 只读 |
| `tasks[].title` | string | ✅ | — | ≤200字符 |
| `tasks[].status` | → TaskStatusEnum | ✅ | — | — |
| `tasks[].priority` | → TaskPriorityEnum | ✅ | — | — |
| `tasks[].due_date` | string(date) | — | — | 可空 |
| `tasks[].description` | string | — | Notes | 可空 |
| `tasks[].account` | string(uuid) | — | — | 可空 |
| `tasks[].opportunity` | string(uuid) | — | — | 可空 |
| `tasks[].case` | string(uuid) | — | — | 可空 |
| `tasks[].lead` | string(uuid) | — | — | 可空 |
| `tasks[].created_by` | → User | ✅ | — | — |
| `tasks[].created_by.id` | string(uuid) | ✅ | — | 只读 |
| `tasks[].created_by.email` | string(email) | — | Email address | ≤254字符 |
| `tasks[].created_by.profile_pic` | string | — | — | 可空; ≤1000字符 |
| `tasks[].created_at` | string(date-time) | ✅ | — | 只读 |
| `tasks[].contacts` | [Contact] | ✅ | — | 只读 |
| `tasks[].contacts[].id` | string(uuid) | ✅ | — | 只读 |
| `tasks[].contacts[].first_name` | string | ✅ | — | ≤255字符 |
| `tasks[].contacts[].last_name` | string | ✅ | — | ≤255字符 |
| `tasks[].contacts[].email` | string(email) | — | — | 可空; ≤254字符 |
| `tasks[].contacts[].phone` | string | — | — | 可空; ≤25字符; 正则: ^[\d\s\-\(\)\+\.]{7,25}$ |
| `tasks[].contacts[].organization` | string | — | Company | 可空; ≤255字符 |
| `tasks[].contacts[].title` | string | — | Job Title | 可空; ≤255字符 |
| `tasks[].contacts[].department` | string | — | — | 可空; ≤255字符 |
| `tasks[].contacts[].do_not_call` | boolean | — | — | — |
| `tasks[].contacts[].linkedin_url` | string(uri) | — | — | 可空; ≤200字符 |
| `tasks[].contacts[].address_line` | string | — | Address | 可空; ≤255字符 |
| `tasks[].contacts[].city` | string | — | — | 可空; ≤255字符 |
| `tasks[].contacts[].state` | string | — | — | 可空; ≤255字符 |
| `tasks[].contacts[].postcode` | string | — | Postal Code | 可空; ≤64字符 |
| `tasks[].contacts[].country` | enum(ClientCountryEnum) | — | — | 枚举: GB, AF, AX, AL, DZ, AS, AD, AO, AI, AQ, AG, AR, AM, AW, AU, AT, AZ, BS, BH, BD, BB, BY, BE, BZ, BJ, BM, BT, BO, BA, BW, BV, BR, IO, BN, BG, BF, BI, KH, CM, CA, CV, KY, CF, TD, CL, CN, CX, CC, CO, KM, CG, CD, CK, CR, CI, HR, CU, CY, CZ, DK, DJ, DM, DO, EC, EG, SV, GQ, ER, EE, ET, FK, FO, FJ, FI, FR, GF, PF, TF, GA, GM, GE, DE, GH, GI, GR, GL, GD, GP, GU, GT, GG, GN, GW, GY, HT, HM, VA, HN, HK, HU, IS, IN, ID, IR, IQ, IE, IM, IL, IT, JM, JP, JE, JO, KZ, KE, KI, KP, KR, KW, KG, LA, LV, LB, LS, LR, LY, LI, LT, LU, MO, MK, MG, MW, MY, MV, ML, MT, MH, MQ, MR, MU, YT, MX, FM, MD, MC, MN, ME, MS, MA, MZ, MM, NA, NR, NP, NL, AN, NC, NZ, NI, NE, NG, NU, NF, MP, NO, OM, PK, PW, PS, PA, PG, PY, PE, PH, PN, PL, PT, PR, QA, RE, RO, RU, RW, BL, SH, KN, LC, MF, PM, VC, WS, SM, ST, SA, SN, RS, SC, SL, SG, SK, SI, SB, SO, ZA, GS, ES, LK, SD, SR, SJ, SZ, SE, CH, SY, TW, TJ, TZ, TH, TL, TG, TK, TO, TT, TN, TR, TM, TC, TV, UG, UA, AE, US, UM, UY, UZ, VU, VE, VN, VG, VI, WF, EH, YE, ZM, ZW; 可空 |
| `tasks[].contacts[].assigned_to` | [Profile] | ✅ | — | 只读 |
| `tasks[].contacts[].assigned_to[].id` | string(uuid) | ✅ | — | 只读 |
| `tasks[].contacts[].assigned_to[].user_details` | object | ✅ | — | 只读 |
| `tasks[].contacts[].assigned_to[].role` | → ProfileRoleEnum | — | — | — |
| `tasks[].contacts[].assigned_to[].address` | string(uuid) | — | — | 可空 |
| `tasks[].contacts[].assigned_to[].has_marketing_access` | boolean | — | — | — |
| `tasks[].contacts[].assigned_to[].has_sales_access` | boolean | — | — | — |
| `tasks[].contacts[].assigned_to[].phone` | string | — | — | 可空; ≤20字符 |
| `tasks[].contacts[].assigned_to[].date_of_joining` | string(date) | — | — | 可空 |
| `tasks[].contacts[].assigned_to[].is_active` | boolean | — | — | — |
| `tasks[].contacts[].assigned_to[].created_at` | string(date-time) | ✅ | — | 只读 |
| `tasks[].contacts[].teams` | [Teams] | ✅ | — | 只读 |
| `tasks[].contacts[].teams[].id` | string(uuid) | ✅ | — | 只读 |
| `tasks[].contacts[].teams[].name` | string | ✅ | — | ≤100字符 |
| `tasks[].contacts[].teams[].description` | string | ✅ | — | — |
| `tasks[].contacts[].teams[].users` | [Profile] | ✅ | — | 只读 |
| `tasks[].contacts[].teams[].users[].id` | string(uuid) | ✅ | — | 只读 |
| `tasks[].contacts[].teams[].users[].user_details` | object | ✅ | — | 只读 |
| `tasks[].contacts[].teams[].users[].role` | → ProfileRoleEnum | — | — | — |
| `tasks[].contacts[].teams[].users[].address` | string(uuid) | — | — | 可空 |
| `tasks[].contacts[].teams[].users[].has_marketing_access` | boolean | — | — | — |
| `tasks[].contacts[].teams[].users[].has_sales_access` | boolean | — | — | — |
| `tasks[].contacts[].teams[].users[].phone` | string | — | — | 可空; ≤20字符 |
| `tasks[].contacts[].teams[].users[].date_of_joining` | string(date) | — | — | 可空 |
| `tasks[].contacts[].teams[].users[].is_active` | boolean | — | — | — |
| `tasks[].contacts[].teams[].users[].created_at` | string(date-time) | ✅ | — | 只读 |
| `tasks[].contacts[].teams[].created_at` | string(date-time) | ✅ | — | 只读 |
| `tasks[].contacts[].teams[].created_by` | → User | ✅ | — | — |
| `tasks[].contacts[].teams[].created_by.id` | string(uuid) | ✅ | — | 只读 |
| `tasks[].contacts[].teams[].created_by.email` | string(email) | — | Email address | ≤254字符 |
| `tasks[].contacts[].teams[].created_by.profile_pic` | string | — | — | 可空; ≤1000字符 |
| `tasks[].contacts[].tags` | [string] | — | — | — |
| `tasks[].contacts[].description` | string | — | Notes | 可空 |
| `tasks[].contacts[].created_by` | string(uuid) | — | — | 可空 |
| `tasks[].contacts[].created_at` | string(date-time) | ✅ | — | 只读 |
| `tasks[].contacts[].is_active` | boolean | — | — | — |
| `tasks[].contacts[].org` | → Organization | ✅ | — | — |
| `tasks[].contacts[].org.id` | string(uuid) | ✅ | — | 只读 |
| `tasks[].contacts[].org.name` | string | — | — | 可空; ≤100字符 |
| `tasks[].contacts[].org.api_key` | string | ✅ | — | 只读 |
| `tasks[].contacts[].account` | string(uuid) | — | Primary account this contact belongs to | 可空 |
| `tasks[].contacts[].contact_attachment` | [Attachments] | ✅ | — | 只读 |
| `tasks[].contacts[].contact_attachment[].id` | string(uuid) | ✅ | — | 只读 |
| `tasks[].contacts[].contact_attachment[].created_by` | string(uuid) | — | — | 可空 |
| `tasks[].contacts[].contact_attachment[].file_name` | string | ✅ | — | ≤60字符 |
| `tasks[].contacts[].contact_attachment[].created_at` | string(date-time) | ✅ | — | 只读 |
| `tasks[].contacts[].contact_attachment[].file_path` | string | ✅ | — | 只读 |
| `tasks[].contacts[].contact_attachment[].content_type` | string | ✅ | Python model class name | 只读 |
| `tasks[].contacts[].contact_attachment[].object_id` | string(uuid) | ✅ | — | — |
| `tasks[].contacts[].contact_attachment[].org` | string(uuid) | ✅ | — | — |
| `tasks[].teams` | [Teams] | ✅ | — | 只读 |
| `tasks[].teams[].id` | string(uuid) | ✅ | — | 只读 |
| `tasks[].teams[].name` | string | ✅ | — | ≤100字符 |
| `tasks[].teams[].description` | string | ✅ | — | — |
| `tasks[].teams[].users` | [Profile] | ✅ | — | 只读 |
| `tasks[].teams[].users[].id` | string(uuid) | ✅ | — | 只读 |
| `tasks[].teams[].users[].user_details` | object | ✅ | — | 只读 |
| `tasks[].teams[].users[].role` | → ProfileRoleEnum | — | — | — |
| `tasks[].teams[].users[].address` | string(uuid) | — | — | 可空 |
| `tasks[].teams[].users[].has_marketing_access` | boolean | — | — | — |
| `tasks[].teams[].users[].has_sales_access` | boolean | — | — | — |
| `tasks[].teams[].users[].phone` | string | — | — | 可空; ≤20字符 |
| `tasks[].teams[].users[].date_of_joining` | string(date) | — | — | 可空 |
| `tasks[].teams[].users[].is_active` | boolean | — | — | — |
| `tasks[].teams[].users[].created_at` | string(date-time) | ✅ | — | 只读 |
| `tasks[].teams[].created_at` | string(date-time) | ✅ | — | 只读 |
| `tasks[].teams[].created_by` | → User | ✅ | — | — |
| `tasks[].teams[].created_by.id` | string(uuid) | ✅ | — | 只读 |
| `tasks[].teams[].created_by.email` | string(email) | — | Email address | ≤254字符 |
| `tasks[].teams[].created_by.profile_pic` | string | — | — | 可空; ≤1000字符 |
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
| `tasks[].tags` | [Tags] | ✅ | — | 只读 |
| `tasks[].tags[].id` | string(uuid) | ✅ | — | 只读 |
| `tasks[].tags[].name` | string | ✅ | — | ≤50字符 |
| `tasks[].tags[].slug` | string | ✅ | — | 只读 |
| `tasks[].tags[].color` | → ColorEnum | — | — | — |
| `tasks[].tags[].description` | string | — | — | — |
| `tasks[].tags[].is_active` | boolean | — | — | — |
| `tasks[].tags[].created_at` | string(date-time) | ✅ | — | 只读 |
| `tasks[].task_attachment` | [Attachments] | ✅ | — | 只读 |
| `tasks[].task_attachment[].id` | string(uuid) | ✅ | — | 只读 |
| `tasks[].task_attachment[].created_by` | string(uuid) | — | — | 可空 |
| `tasks[].task_attachment[].file_name` | string | ✅ | — | ≤60字符 |
| `tasks[].task_attachment[].created_at` | string(date-time) | ✅ | — | 只读 |
| `tasks[].task_attachment[].file_path` | string | ✅ | — | 只读 |
| `tasks[].task_attachment[].content_type` | string | ✅ | Python model class name | 只读 |
| `tasks[].task_attachment[].object_id` | string(uuid) | ✅ | — | — |
| `tasks[].task_attachment[].org` | string(uuid) | ✅ | — | — |
| `tasks[].task_comments` | [Comment] | ✅ | — | 只读 |
| `tasks[].task_comments[].id` | string(uuid) | ✅ | — | 只读 |
| `tasks[].task_comments[].comment` | string | ✅ | — | ≤255字符 |
| `tasks[].task_comments[].commented_on` | string(date-time) | ✅ | — | 只读 |
| `tasks[].task_comments[].commented_by` | string(uuid) | — | — | 可空 |
| `tasks[].task_comments[].content_type` | string | ✅ | Python model class name | 只读 |
| `tasks[].task_comments[].object_id` | string(uuid) | ✅ | — | — |
| `tasks[].task_comments[].org` | string(uuid) | ✅ | — | — |
| `users_mention` | [any] | ✅ | — | — |

**可能的错误响应（DRF 标准）**

- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）
- **400**: 请求参数校验失败（query/header/body 不合法）

---
### PATCH `/api/contacts/{id}/` 🔒

部分更新联系人

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**请求体** `application/json`

**Schema: `PatchedCreateContactRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `first_name` | string | — | — | ≤255字符 |
| `last_name` | string | — | — | ≤255字符 |
| `email` | string(email) | — | — | 可空; ≤254字符 |
| `phone` | string | — | — | 可空; ≤25字符; 正则: ^[\d\s\-\(\)\+\.]{7,25}$ |
| `organization` | string | — | Company | 可空; ≤255字符 |
| `title` | string | — | Job Title | 可空; ≤255字符 |
| `department` | string | — | — | 可空; ≤255字符 |
| `do_not_call` | boolean | — | — | — |
| `linkedin_url` | string(uri) | — | — | 可空; ≤200字符 |
| `address_line` | string | — | Address | 可空; ≤255字符 |
| `city` | string | — | — | 可空; ≤255字符 |
| `state` | string | — | — | 可空; ≤255字符 |
| `postcode` | string | — | Postal Code | 可空; ≤64字符 |
| `country` | enum(ClientCountryEnum) | — | — | 枚举: GB, AF, AX, AL, DZ, AS, AD, AO, AI, AQ, AG, AR, AM, AW, AU, AT, AZ, BS, BH, BD, BB, BY, BE, BZ, BJ, BM, BT, BO, BA, BW, BV, BR, IO, BN, BG, BF, BI, KH, CM, CA, CV, KY, CF, TD, CL, CN, CX, CC, CO, KM, CG, CD, CK, CR, CI, HR, CU, CY, CZ, DK, DJ, DM, DO, EC, EG, SV, GQ, ER, EE, ET, FK, FO, FJ, FI, FR, GF, PF, TF, GA, GM, GE, DE, GH, GI, GR, GL, GD, GP, GU, GT, GG, GN, GW, GY, HT, HM, VA, HN, HK, HU, IS, IN, ID, IR, IQ, IE, IM, IL, IT, JM, JP, JE, JO, KZ, KE, KI, KP, KR, KW, KG, LA, LV, LB, LS, LR, LY, LI, LT, LU, MO, MK, MG, MW, MY, MV, ML, MT, MH, MQ, MR, MU, YT, MX, FM, MD, MC, MN, ME, MS, MA, MZ, MM, NA, NR, NP, NL, AN, NC, NZ, NI, NE, NG, NU, NF, MP, NO, OM, PK, PW, PS, PA, PG, PY, PE, PH, PN, PL, PT, PR, QA, RE, RO, RU, RW, BL, SH, KN, LC, MF, PM, VC, WS, SM, ST, SA, SN, RS, SC, SL, SG, SK, SI, SB, SO, ZA, GS, ES, LK, SD, SR, SJ, SZ, SE, CH, SY, TW, TJ, TZ, TH, TL, TG, TK, TO, TT, TN, TR, TM, TC, TV, UG, UA, AE, US, UM, UY, UZ, VU, VE, VN, VG, VI, WF, EH, YE, ZM, ZW; 可空 |
| `description` | string | — | Notes | 可空 |
| `account` | string(uuid) | — | Primary account this contact belongs to | 可空 |
| `is_active` | boolean | — | — | — |

**200** → `ContactPatchResponse`

**Schema: `ContactPatchResponse`**

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
### POST `/api/contacts/{id}/` 🔒

新建

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**请求体** `application/json`

**Schema: `ContactDetailEditSwaggerRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `comment` | string | ✅ | — | — |
| `contact_attachment` | string(binary) | ✅ | — | — |

**200** → `ContactCommentAttachmentResponse`

**Schema: `ContactCommentAttachmentResponse`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `contact_obj` | → Contact | ✅ | — | — |
| `contact_obj.id` | string(uuid) | ✅ | — | 只读 |
| `contact_obj.first_name` | string | ✅ | — | ≤255字符 |
| `contact_obj.last_name` | string | ✅ | — | ≤255字符 |
| `contact_obj.email` | string(email) | — | — | 可空; ≤254字符 |
| `contact_obj.phone` | string | — | — | 可空; ≤25字符; 正则: ^[\d\s\-\(\)\+\.]{7,25}$ |
| `contact_obj.organization` | string | — | Company | 可空; ≤255字符 |
| `contact_obj.title` | string | — | Job Title | 可空; ≤255字符 |
| `contact_obj.department` | string | — | — | 可空; ≤255字符 |
| `contact_obj.do_not_call` | boolean | — | — | — |
| `contact_obj.linkedin_url` | string(uri) | — | — | 可空; ≤200字符 |
| `contact_obj.address_line` | string | — | Address | 可空; ≤255字符 |
| `contact_obj.city` | string | — | — | 可空; ≤255字符 |
| `contact_obj.state` | string | — | — | 可空; ≤255字符 |
| `contact_obj.postcode` | string | — | Postal Code | 可空; ≤64字符 |
| `contact_obj.country` | enum(ClientCountryEnum) | — | — | 枚举: GB, AF, AX, AL, DZ, AS, AD, AO, AI, AQ, AG, AR, AM, AW, AU, AT, AZ, BS, BH, BD, BB, BY, BE, BZ, BJ, BM, BT, BO, BA, BW, BV, BR, IO, BN, BG, BF, BI, KH, CM, CA, CV, KY, CF, TD, CL, CN, CX, CC, CO, KM, CG, CD, CK, CR, CI, HR, CU, CY, CZ, DK, DJ, DM, DO, EC, EG, SV, GQ, ER, EE, ET, FK, FO, FJ, FI, FR, GF, PF, TF, GA, GM, GE, DE, GH, GI, GR, GL, GD, GP, GU, GT, GG, GN, GW, GY, HT, HM, VA, HN, HK, HU, IS, IN, ID, IR, IQ, IE, IM, IL, IT, JM, JP, JE, JO, KZ, KE, KI, KP, KR, KW, KG, LA, LV, LB, LS, LR, LY, LI, LT, LU, MO, MK, MG, MW, MY, MV, ML, MT, MH, MQ, MR, MU, YT, MX, FM, MD, MC, MN, ME, MS, MA, MZ, MM, NA, NR, NP, NL, AN, NC, NZ, NI, NE, NG, NU, NF, MP, NO, OM, PK, PW, PS, PA, PG, PY, PE, PH, PN, PL, PT, PR, QA, RE, RO, RU, RW, BL, SH, KN, LC, MF, PM, VC, WS, SM, ST, SA, SN, RS, SC, SL, SG, SK, SI, SB, SO, ZA, GS, ES, LK, SD, SR, SJ, SZ, SE, CH, SY, TW, TJ, TZ, TH, TL, TG, TK, TO, TT, TN, TR, TM, TC, TV, UG, UA, AE, US, UM, UY, UZ, VU, VE, VN, VG, VI, WF, EH, YE, ZM, ZW; 可空 |
| `contact_obj.assigned_to` | [Profile] | ✅ | — | 只读 |
| `contact_obj.assigned_to[].id` | string(uuid) | ✅ | — | 只读 |
| `contact_obj.assigned_to[].user_details` | object | ✅ | — | 只读 |
| `contact_obj.assigned_to[].role` | → ProfileRoleEnum | — | — | — |
| `contact_obj.assigned_to[].address` | string(uuid) | — | — | 可空 |
| `contact_obj.assigned_to[].has_marketing_access` | boolean | — | — | — |
| `contact_obj.assigned_to[].has_sales_access` | boolean | — | — | — |
| `contact_obj.assigned_to[].phone` | string | — | — | 可空; ≤20字符 |
| `contact_obj.assigned_to[].date_of_joining` | string(date) | — | — | 可空 |
| `contact_obj.assigned_to[].is_active` | boolean | — | — | — |
| `contact_obj.assigned_to[].created_at` | string(date-time) | ✅ | — | 只读 |
| `contact_obj.teams` | [Teams] | ✅ | — | 只读 |
| `contact_obj.teams[].id` | string(uuid) | ✅ | — | 只读 |
| `contact_obj.teams[].name` | string | ✅ | — | ≤100字符 |
| `contact_obj.teams[].description` | string | ✅ | — | — |
| `contact_obj.teams[].users` | [Profile] | ✅ | — | 只读 |
| `contact_obj.teams[].users[].id` | string(uuid) | ✅ | — | 只读 |
| `contact_obj.teams[].users[].user_details` | object | ✅ | — | 只读 |
| `contact_obj.teams[].users[].role` | → ProfileRoleEnum | — | — | — |
| `contact_obj.teams[].users[].address` | string(uuid) | — | — | 可空 |
| `contact_obj.teams[].users[].has_marketing_access` | boolean | — | — | — |
| `contact_obj.teams[].users[].has_sales_access` | boolean | — | — | — |
| `contact_obj.teams[].users[].phone` | string | — | — | 可空; ≤20字符 |
| `contact_obj.teams[].users[].date_of_joining` | string(date) | — | — | 可空 |
| `contact_obj.teams[].users[].is_active` | boolean | — | — | — |
| `contact_obj.teams[].users[].created_at` | string(date-time) | ✅ | — | 只读 |
| `contact_obj.teams[].created_at` | string(date-time) | ✅ | — | 只读 |
| `contact_obj.teams[].created_by` | → User | ✅ | — | — |
| `contact_obj.teams[].created_by.id` | string(uuid) | ✅ | — | 只读 |
| `contact_obj.teams[].created_by.email` | string(email) | — | Email address | ≤254字符 |
| `contact_obj.teams[].created_by.profile_pic` | string | — | — | 可空; ≤1000字符 |
| `contact_obj.tags` | [string] | — | — | — |
| `contact_obj.description` | string | — | Notes | 可空 |
| `contact_obj.created_by` | string(uuid) | — | — | 可空 |
| `contact_obj.created_at` | string(date-time) | ✅ | — | 只读 |
| `contact_obj.is_active` | boolean | — | — | — |
| `contact_obj.org` | → Organization | ✅ | — | — |
| `contact_obj.org.id` | string(uuid) | ✅ | — | 只读 |
| `contact_obj.org.name` | string | — | — | 可空; ≤100字符 |
| `contact_obj.org.api_key` | string | ✅ | — | 只读 |
| `contact_obj.account` | string(uuid) | — | Primary account this contact belongs to | 可空 |
| `contact_obj.contact_attachment` | [Attachments] | ✅ | — | 只读 |
| `contact_obj.contact_attachment[].id` | string(uuid) | ✅ | — | 只读 |
| `contact_obj.contact_attachment[].created_by` | string(uuid) | — | — | 可空 |
| `contact_obj.contact_attachment[].file_name` | string | ✅ | — | ≤60字符 |
| `contact_obj.contact_attachment[].created_at` | string(date-time) | ✅ | — | 只读 |
| `contact_obj.contact_attachment[].file_path` | string | ✅ | — | 只读 |
| `contact_obj.contact_attachment[].content_type` | string | ✅ | Python model class name | 只读 |
| `contact_obj.contact_attachment[].object_id` | string(uuid) | ✅ | — | — |
| `contact_obj.contact_attachment[].org` | string(uuid) | ✅ | — | — |
| `comments` | [Comment] | ✅ | — | — |
| `comments[].id` | string(uuid) | ✅ | — | 只读 |
| `comments[].comment` | string | ✅ | — | ≤255字符 |
| `comments[].commented_on` | string(date-time) | ✅ | — | 只读 |
| `comments[].commented_by` | string(uuid) | — | — | 可空 |
| `comments[].content_type` | string | ✅ | Python model class name | 只读 |
| `comments[].object_id` | string(uuid) | ✅ | — | — |
| `comments[].org` | string(uuid) | ✅ | — | — |
| `attachments` | [Attachments] | ✅ | — | — |
| `attachments[].id` | string(uuid) | ✅ | — | 只读 |
| `attachments[].created_by` | string(uuid) | — | — | 可空 |
| `attachments[].file_name` | string | ✅ | — | ≤60字符 |
| `attachments[].created_at` | string(date-time) | ✅ | — | 只读 |
| `attachments[].file_path` | string | ✅ | — | 只读 |
| `attachments[].content_type` | string | ✅ | Python model class name | 只读 |
| `attachments[].object_id` | string(uuid) | ✅ | — | — |
| `attachments[].org` | string(uuid) | ✅ | — | — |

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### PUT `/api/contacts/{id}/` 🔒

全量更新

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `address_line` | query | string | — | — |
| `assigned_to` | query | string | — | — |
| `city` | query | string | — | — |
| `contact_attachment` | query | string(binary) | — | — |
| `country` | query | string | — | — |
| `date_of_birth` | query | string | — | — |
| `department` | query | string | — | — |
| `description` | query | string | — | — |
| `do_not_call` | query | boolean | — | — |
| `email` | query | string | — | — |
| `facebook_url` | query | string | — | — |
| `first_name` | query | string | — | — |
| `id` | path | string | ✅ | — |
| `language` | query | string | — | — |
| `last_name` | query | string | — | — |
| `linkedin_url` | query | string | — | — |
| `org` | header | string | — | — |
| `organization` | query | string | — | — |
| `phone` | query | string | — | — |
| `pincode` | query | string | — | — |
| `salutation` | query | string | — | — |
| `secondary_email` | query | string | — | — |
| `secondary_number` | query | string | — | — |
| `state` | query | string | — | — |
| `street` | query | string | — | — |
| `teams` | query | string | — | — |
| `title` | query | string | — | — |
| `twitter_username` | query | string | — | — |

**请求体** `application/json`

**Schema: `CreateContactRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `first_name` | string | ✅ | — | ≤255字符 |
| `last_name` | string | ✅ | — | ≤255字符 |
| `email` | string(email) | — | — | 可空; ≤254字符 |
| `phone` | string | — | — | 可空; ≤25字符; 正则: ^[\d\s\-\(\)\+\.]{7,25}$ |
| `organization` | string | — | Company | 可空; ≤255字符 |
| `title` | string | — | Job Title | 可空; ≤255字符 |
| `department` | string | — | — | 可空; ≤255字符 |
| `do_not_call` | boolean | — | — | — |
| `linkedin_url` | string(uri) | — | — | 可空; ≤200字符 |
| `address_line` | string | — | Address | 可空; ≤255字符 |
| `city` | string | — | — | 可空; ≤255字符 |
| `state` | string | — | — | 可空; ≤255字符 |
| `postcode` | string | — | Postal Code | 可空; ≤64字符 |
| `country` | enum(ClientCountryEnum) | — | — | 枚举: GB, AF, AX, AL, DZ, AS, AD, AO, AI, AQ, AG, AR, AM, AW, AU, AT, AZ, BS, BH, BD, BB, BY, BE, BZ, BJ, BM, BT, BO, BA, BW, BV, BR, IO, BN, BG, BF, BI, KH, CM, CA, CV, KY, CF, TD, CL, CN, CX, CC, CO, KM, CG, CD, CK, CR, CI, HR, CU, CY, CZ, DK, DJ, DM, DO, EC, EG, SV, GQ, ER, EE, ET, FK, FO, FJ, FI, FR, GF, PF, TF, GA, GM, GE, DE, GH, GI, GR, GL, GD, GP, GU, GT, GG, GN, GW, GY, HT, HM, VA, HN, HK, HU, IS, IN, ID, IR, IQ, IE, IM, IL, IT, JM, JP, JE, JO, KZ, KE, KI, KP, KR, KW, KG, LA, LV, LB, LS, LR, LY, LI, LT, LU, MO, MK, MG, MW, MY, MV, ML, MT, MH, MQ, MR, MU, YT, MX, FM, MD, MC, MN, ME, MS, MA, MZ, MM, NA, NR, NP, NL, AN, NC, NZ, NI, NE, NG, NU, NF, MP, NO, OM, PK, PW, PS, PA, PG, PY, PE, PH, PN, PL, PT, PR, QA, RE, RO, RU, RW, BL, SH, KN, LC, MF, PM, VC, WS, SM, ST, SA, SN, RS, SC, SL, SG, SK, SI, SB, SO, ZA, GS, ES, LK, SD, SR, SJ, SZ, SE, CH, SY, TW, TJ, TZ, TH, TL, TG, TK, TO, TT, TN, TR, TM, TC, TV, UG, UA, AE, US, UM, UY, UZ, VU, VE, VN, VG, VI, WF, EH, YE, ZM, ZW; 可空 |
| `description` | string | — | Notes | 可空 |
| `account` | string(uuid) | — | Primary account this contact belongs to | 可空 |
| `is_active` | boolean | — | — | — |

**200** → `ContactUpdateResponse`

**Schema: `ContactUpdateResponse`**

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