# 客户关系管理 — 线索

> 共 25 个端点。🔒 = 需要登录（JWT），🟢 = 无需鉴权。
> 线索（潜在客户）CRUD + 看板管道/阶段 + 评论/附件 + 从官网创建 + 导入。GET /api/leads/ 返回**聚合 dict**（open_leads + close_leads + 下拉选项）。

## 端点速览

| 方法 | 路径 | 鉴权 | 说明 |
|------|------|------|------|
| GET | `/api/leads/` | 🔒 | 列表查询 |
| POST | `/api/leads/` | 🔒 | Leads Create |
| DELETE | `/api/leads/attachment/{id}/` | 🔒 | 删除 |
| DELETE | `/api/leads/comment/{id}/` | 🔒 | 删除评论 |
| PATCH | `/api/leads/comment/{id}/` | 🔒 | 部分更新评论 |
| POST | `/api/leads/comment/{id}/` | 🔒 | Create a new comment for a lead |
| PUT | `/api/leads/comment/{id}/` | 🔒 | 新建/编辑线索评论 |
| POST | `/api/leads/create-from-site/` | 🔒 | 新建 |
| GET | `/api/leads/kanban/` | 🔒 | 获取看板数据 . |
| GET | `/api/leads/pipelines/` | 🔒 | 列出组织的所有管道 . |
| POST | `/api/leads/pipelines/` | 🔒 | 新建管道 . |
| DELETE | `/api/leads/pipelines/{id}/` | 🔒 | Delete pipeline (soft delete by setting is_active=False). |
| GET | `/api/leads/pipelines/{id}/` | 🔒 | Get pipeline details with all stages. |
| PUT | `/api/leads/pipelines/{id}/` | 🔒 | Update pipeline. |
| POST | `/api/leads/pipelines/{pipeline_pk}/stages/` | 🔒 | Add a new stage to pipeline. |
| POST | `/api/leads/pipelines/{pipeline_pk}/stages/reorder/` | 🔒 | Reorder stages by providing ordered list of stage IDs. |
| DELETE | `/api/leads/stages/{id}/` | 🔒 | Delete stage. |
| PUT | `/api/leads/stages/{id}/` | 🔒 | Update stage. |
| POST | `/api/leads/upload/` | 🔒 | 新建 |
| DELETE | `/api/leads/{id}/` | 🔒 | Lead Delete |
| GET | `/api/leads/{id}/` | 🔒 | Lead Detail |
| PATCH | `/api/leads/{id}/` | 🔒 | 部分更新线索 |
| POST | `/api/leads/{id}/` | 🔒 | 编辑线索详情（含附件/评论） |
| PUT | `/api/leads/{id}/` | 🔒 | 新建线索 |
| PATCH | `/api/leads/{id}/move/` | 🔒 | 移动线索到不同列/位置 . |

## 端点详情

### GET `/api/leads/` 🔒

列表查询

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `assigned_to` | query | string | — | — |
| `org` | header | string | — | — |
| `source` | query | string | — | — |
| `status` | query | string | — | 枚举: assigned, closed, converted, in process, recycled |
| `tags` | query | string | — | — |
| `title` | query | string | — | — |

**200** → `leads`

> ✅ 后端实测: 自定义 dict（OpenAPI 未标注）；顶层字段: close_leads, contacts, countries, industries, open_leads, page_number, per_page, source, status, tags, users

**Schema: `leads → 响应（后端实测）`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `per_page` | integer | — | — | — |
| `page_number` | [string] | — | — | — |
| `open_leads` | object | — | — | — |
| `close_leads` | object | — | — | — |
| `contacts` | [object] | — | — | — |
| `status` | [array] | — | — | — |
| `source` | [array] | — | — | — |
| `tags` | [object] | — | — | — |
| `users` | [object] | — | — | — |
| `countries` | [array] | — | — | — |
| `industries` | [array] | — | — | — |

**可能的错误响应（DRF 标准）**

- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）
- **400**: 请求参数校验失败（query/header/body 不合法）

---
### POST `/api/leads/` 🔒

Leads Create

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `org` | header | string | — | — |

**请求体** `application/json`

> 新建线索

**Schema: `LeadCreateSwaggerRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `title` | string | — | Lead name/subject (e.g., 'Enterprise Deal', 'Website Inquiry') | 可空; ≤255字符 |
| `salutation` | string | — | e.g., Mr, Mrs, Ms, Dr | 可空; ≤64字符 |
| `first_name` | string | — | — | 可空; ≤255字符 |
| `last_name` | string | — | — | 可空; ≤255字符 |
| `email` | string(email) | — | — | 可空; ≤254字符 |
| `phone` | string | — | — | 可空; ≤25字符; 正则: ^[\d\s\-\(\)\+\.]{7,25}$ |
| `job_title` | string | — | Person's job title (e.g., 'VP of Sales', 'CTO') | 可空; ≤255字符 |
| `website` | string | — | — | 可空; ≤255字符 |
| `linkedin_url` | string(uri) | — | — | 可空; ≤500字符 |
| `status` | enum(LeadStatusEnum) | — | — | 枚举: assigned, in process, converted, recycled, closed; 可空 |
| `source` | enum(SourceEnum) | — | — | 枚举: call, email, existing customer, partner, public relations, compaign, other; 可空 |
| `industry` | enum(IndustryEnum) | — | — | 枚举: ADVERTISING, AGRICULTURE, APPAREL & ACCESSORIES, AUTOMOTIVE, BANKING, BIOTECHNOLOGY, BUILDING MATERIALS & EQUIPMENT, CHEMICAL, COMPUTER, EDUCATION, ELECTRONICS, ENERGY, ENTERTAINMENT & LEISURE, FINANCE, FOOD & BEVERAGE, GROCERY, HEALTHCARE, INSURANCE, LEGAL, MANUFACTURING, PUBLISHING, REAL ESTATE, SERVICE, SOFTWARE, SPORTS, TECHNOLOGY, TELECOMMUNICATIONS, TELEVISION, TRANSPORTATION, VENTURE CAPITAL; 可空 |
| `rating` | enum(RatingEnum) | — | — | 枚举: HOT, WARM, COLD; 可空 |
| `opportunity_amount` | string(decimal) | — | Deal Value | 可空; 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `probability` | integer(int64) | — | Win Probability % | 可空 |
| `close_date` | string(date) | — | Expected Close Date | 可空 |
| `address_line` | string | — | Address | 可空; ≤255字符 |
| `city` | string | — | — | 可空; ≤255字符 |
| `state` | string | — | — | 可空; ≤255字符 |
| `postcode` | string | — | Postal Code | 可空; ≤64字符 |
| `country` | enum(ClientCountryEnum) | — | — | 枚举: GB, AF, AX, AL, DZ, AS, AD, AO, AI, AQ, AG, AR, AM, AW, AU, AT, AZ, BS, BH, BD, BB, BY, BE, BZ, BJ, BM, BT, BO, BA, BW, BV, BR, IO, BN, BG, BF, BI, KH, CM, CA, CV, KY, CF, TD, CL, CN, CX, CC, CO, KM, CG, CD, CK, CR, CI, HR, CU, CY, CZ, DK, DJ, DM, DO, EC, EG, SV, GQ, ER, EE, ET, FK, FO, FJ, FI, FR, GF, PF, TF, GA, GM, GE, DE, GH, GI, GR, GL, GD, GP, GU, GT, GG, GN, GW, GY, HT, HM, VA, HN, HK, HU, IS, IN, ID, IR, IQ, IE, IM, IL, IT, JM, JP, JE, JO, KZ, KE, KI, KP, KR, KW, KG, LA, LV, LB, LS, LR, LY, LI, LT, LU, MO, MK, MG, MW, MY, MV, ML, MT, MH, MQ, MR, MU, YT, MX, FM, MD, MC, MN, ME, MS, MA, MZ, MM, NA, NR, NP, NL, AN, NC, NZ, NI, NE, NG, NU, NF, MP, NO, OM, PK, PW, PS, PA, PG, PY, PE, PH, PN, PL, PT, PR, QA, RE, RO, RU, RW, BL, SH, KN, LC, MF, PM, VC, WS, SM, ST, SA, SN, RS, SC, SL, SG, SK, SI, SB, SO, ZA, GS, ES, LK, SD, SR, SJ, SZ, SE, CH, SY, TW, TJ, TZ, TH, TL, TG, TK, TO, TT, TN, TR, TM, TC, TV, UG, UA, AE, US, UM, UY, UZ, VU, VE, VN, VG, VI, WF, EH, YE, ZM, ZW; 可空 |
| `assigned_to` | [string] | ✅ | — | — |
| `teams` | [string] | ✅ | — | — |
| `contacts` | [string] | ✅ | — | — |
| `tags` | [string] | — | — | — |
| `last_contacted` | string(date) | — | — | 可空 |
| `next_follow_up` | string(date) | — | — | 可空 |
| `description` | string | — | Notes | 可空 |
| `company_name` | string | — | — | 可空; ≤255字符 |

**200** → `LeadCreateResponse`

**Schema: `LeadCreateResponse`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `error` | boolean | ✅ | — | — |
| `message` | string | ✅ | — | — |
| `account_id` | string | — | — | — |
| `contact_id` | string | — | — | 可空 |
| `opportunity_id` | string | — | — | 可空 |

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### DELETE `/api/leads/attachment/{id}/` 🔒

删除

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**200** → `LeadAttachmentDeleteResponse`

**Schema: `LeadAttachmentDeleteResponse`**

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
### DELETE `/api/leads/comment/{id}/` 🔒

删除评论

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**200** → `LeadCommentDeleteResponse`

**Schema: `LeadCommentDeleteResponse`**

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
### PATCH `/api/leads/comment/{id}/` 🔒

部分更新评论

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**请求体** `application/json`

**Schema: `PatchedLeadCommentEditSwaggerRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `comment` | string | — | — | — |

**200** → `LeadCommentPatchResponse`

**Schema: `LeadCommentPatchResponse`**

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
### POST `/api/leads/comment/{id}/` 🔒

Create a new comment for a lead

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**请求体** `application/json`

> 新建/编辑线索评论

**Schema: `LeadCommentEditSwaggerRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `comment` | string | ✅ | — | — |

**200** → `LeadCommentCreateResponse`

**Schema: `LeadCommentCreateResponse`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `error` | boolean | ✅ | — | — |
| `message` | string | ✅ | — | — |
| `comment` | → LeadComment | ✅ | — | — |
| `comment.id` | string(uuid) | ✅ | — | 只读 |
| `comment.comment` | string | ✅ | — | ≤255字符 |
| `comment.commented_on` | string(date-time) | ✅ | — | 只读 |
| `comment.commented_by` | any | ✅ | — | 只读 |

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### PUT `/api/leads/comment/{id}/` 🔒

新建/编辑线索评论

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**请求体** `application/json`

> 新建/编辑线索评论

**Schema: `LeadCommentEditSwaggerRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `comment` | string | ✅ | — | — |

**200** → `LeadCommentUpdateResponse`

**Schema: `LeadCommentUpdateResponse`**

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
### POST `/api/leads/create-from-site/` 🔒

新建

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `org` | header | string | — | — |

**请求体** `application/json`

**Schema: `CreateLeadFromSiteSwaggerRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `apikey` | string | ✅ | — | — |
| `title` | string | ✅ | — | — |
| `first_name` | string | ✅ | — | — |
| `last_name` | string | ✅ | — | — |
| `phone` | string | ✅ | — | — |
| `email` | string | ✅ | — | — |
| `source` | string | ✅ | — | — |
| `description` | string | ✅ | — | — |

**200** → `CreateLeadFromSiteResponse`

**Schema: `CreateLeadFromSiteResponse`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `error` | boolean | ✅ | — | — |
| `message` | string | ✅ | — | — |

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### GET `/api/leads/kanban/` 🔒

获取看板数据 .

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `assigned_to` | query | string | — | Filter by assigned user ID |
| `org` | query | string | ✅ | — |
| `pipeline_id` | query | string | — | Pipeline ID. If not provided, uses status-based columns |
| `rating` | query | string | — | Filter by rating (HOT/WARM/COLD) |
| `search` | query | string | — | Search in name, company, email |

**200** → `kanban`

> ✅ 后端实测: 自定义 dict（OpenAPI 未标注）；顶层字段: columns, mode, pipeline, total_leads

**Schema: `kanban → 响应（后端实测）`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `mode` | string | — | — | — |
| `pipeline` | string | — | — | 可空 |
| `columns` | [object] | — | — | — |
| `total_leads` | integer | — | — | — |

**可能的错误响应（DRF 标准）**

- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）
- **400**: 请求参数校验失败（query/header/body 不合法）

---
### GET `/api/leads/pipelines/` 🔒

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
### POST `/api/leads/pipelines/` 🔒

新建管道 .

**请求体** `application/json`

> 新建/编辑线索管道

**Schema: `LeadPipelineRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `name` | string | ✅ | Pipeline Name | ≤255字符 |
| `description` | string | — | — | 可空 |
| `is_default` | boolean | — | If true, new leads without explicit pipeline go here | — |
| `is_active` | boolean | — | — | — |

**201** → `LeadPipeline`

**Schema: `LeadPipeline`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `id` | string(uuid) | ✅ | — | 只读 |
| `name` | string | ✅ | Pipeline Name | ≤255字符 |
| `description` | string | — | — | 可空 |
| `is_default` | boolean | — | If true, new leads without explicit pipeline go here | — |
| `is_active` | boolean | — | — | — |
| `stages` | [LeadStage] | ✅ | — | 只读 |
| `stages[].id` | string(uuid) | ✅ | — | 只读 |
| `stages[].name` | string | ✅ | Stage Name | ≤100字符 |
| `stages[].order` | integer(int64) | — | — | — |
| `stages[].color` | string | — | — | ≤7字符 |
| `stages[].stage_type` | → LeadStageStageTypeEnum | — | — | — |
| `stages[].maps_to_status` | enum(LeadStatusEnum) | — | When lead enters this stage, also update Lead.status

* `assigned` - Assigned
* `in process` - In Process
* `converted` - Converted
* `recycled` - Recycled
* `closed` - Closed | 枚举: assigned, in process, converted, recycled, closed; 可空 |
| `stages[].win_probability` | integer(int64) | — | Default probability when lead enters this stage | — |
| `stages[].wip_limit` | integer(int64) | — | Maximum leads allowed in this stage (null = unlimited) | 可空 |
| `stages[].lead_count` | string | ✅ | — | 只读 |
| `stages[].created_at` | string(date-time) | ✅ | — | 只读 |
| `stages[].updated_at` | string(date-time) | ✅ | Last Modified At | 只读 |
| `stage_count` | string | ✅ | — | 只读 |
| `lead_count` | string | ✅ | — | 只读 |
| `created_at` | string(date-time) | ✅ | — | 只读 |
| `updated_at` | string(date-time) | ✅ | Last Modified At | 只读 |

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### DELETE `/api/leads/pipelines/{id}/` 🔒

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
### GET `/api/leads/pipelines/{id}/` 🔒

Get pipeline details with all stages.

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |

**200** → `LeadPipeline`

**Schema: `LeadPipeline`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `id` | string(uuid) | ✅ | — | 只读 |
| `name` | string | ✅ | Pipeline Name | ≤255字符 |
| `description` | string | — | — | 可空 |
| `is_default` | boolean | — | If true, new leads without explicit pipeline go here | — |
| `is_active` | boolean | — | — | — |
| `stages` | [LeadStage] | ✅ | — | 只读 |
| `stages[].id` | string(uuid) | ✅ | — | 只读 |
| `stages[].name` | string | ✅ | Stage Name | ≤100字符 |
| `stages[].order` | integer(int64) | — | — | — |
| `stages[].color` | string | — | — | ≤7字符 |
| `stages[].stage_type` | → LeadStageStageTypeEnum | — | — | — |
| `stages[].maps_to_status` | enum(LeadStatusEnum) | — | When lead enters this stage, also update Lead.status

* `assigned` - Assigned
* `in process` - In Process
* `converted` - Converted
* `recycled` - Recycled
* `closed` - Closed | 枚举: assigned, in process, converted, recycled, closed; 可空 |
| `stages[].win_probability` | integer(int64) | — | Default probability when lead enters this stage | — |
| `stages[].wip_limit` | integer(int64) | — | Maximum leads allowed in this stage (null = unlimited) | 可空 |
| `stages[].lead_count` | string | ✅ | — | 只读 |
| `stages[].created_at` | string(date-time) | ✅ | — | 只读 |
| `stages[].updated_at` | string(date-time) | ✅ | Last Modified At | 只读 |
| `stage_count` | string | ✅ | — | 只读 |
| `lead_count` | string | ✅ | — | 只读 |
| `created_at` | string(date-time) | ✅ | — | 只读 |
| `updated_at` | string(date-time) | ✅ | Last Modified At | 只读 |

**可能的错误响应（DRF 标准）**

- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）
- **400**: 请求参数校验失败（query/header/body 不合法）

---
### PUT `/api/leads/pipelines/{id}/` 🔒

Update pipeline.

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |

**请求体** `application/json`

> 新建/编辑线索管道

**Schema: `LeadPipelineRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `name` | string | ✅ | Pipeline Name | ≤255字符 |
| `description` | string | — | — | 可空 |
| `is_default` | boolean | — | If true, new leads without explicit pipeline go here | — |
| `is_active` | boolean | — | — | — |

**200** → `LeadPipeline`

**Schema: `LeadPipeline`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `id` | string(uuid) | ✅ | — | 只读 |
| `name` | string | ✅ | Pipeline Name | ≤255字符 |
| `description` | string | — | — | 可空 |
| `is_default` | boolean | — | If true, new leads without explicit pipeline go here | — |
| `is_active` | boolean | — | — | — |
| `stages` | [LeadStage] | ✅ | — | 只读 |
| `stages[].id` | string(uuid) | ✅ | — | 只读 |
| `stages[].name` | string | ✅ | Stage Name | ≤100字符 |
| `stages[].order` | integer(int64) | — | — | — |
| `stages[].color` | string | — | — | ≤7字符 |
| `stages[].stage_type` | → LeadStageStageTypeEnum | — | — | — |
| `stages[].maps_to_status` | enum(LeadStatusEnum) | — | When lead enters this stage, also update Lead.status

* `assigned` - Assigned
* `in process` - In Process
* `converted` - Converted
* `recycled` - Recycled
* `closed` - Closed | 枚举: assigned, in process, converted, recycled, closed; 可空 |
| `stages[].win_probability` | integer(int64) | — | Default probability when lead enters this stage | — |
| `stages[].wip_limit` | integer(int64) | — | Maximum leads allowed in this stage (null = unlimited) | 可空 |
| `stages[].lead_count` | string | ✅ | — | 只读 |
| `stages[].created_at` | string(date-time) | ✅ | — | 只读 |
| `stages[].updated_at` | string(date-time) | ✅ | Last Modified At | 只读 |
| `stage_count` | string | ✅ | — | 只读 |
| `lead_count` | string | ✅ | — | 只读 |
| `created_at` | string(date-time) | ✅ | — | 只读 |
| `updated_at` | string(date-time) | ✅ | Last Modified At | 只读 |

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### POST `/api/leads/pipelines/{pipeline_pk}/stages/` 🔒

Add a new stage to pipeline.

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `pipeline_pk` | path | string | ✅ | — |

**请求体** `application/json`

> 新建/编辑线索阶段

**Schema: `LeadStageRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `name` | string | ✅ | Stage Name | ≤100字符 |
| `order` | integer(int64) | — | — | — |
| `color` | string | — | — | ≤7字符 |
| `stage_type` | → LeadStageStageTypeEnum | — | — | — |
| `maps_to_status` | enum(LeadStatusEnum) | — | When lead enters this stage, also update Lead.status

* `assigned` - Assigned
* `in process` - In Process
* `converted` - Converted
* `recycled` - Recycled
* `closed` - Closed | 枚举: assigned, in process, converted, recycled, closed; 可空 |
| `win_probability` | integer(int64) | — | Default probability when lead enters this stage | — |
| `wip_limit` | integer(int64) | — | Maximum leads allowed in this stage (null = unlimited) | 可空 |

**201** → `LeadStage`

**Schema: `LeadStage`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `id` | string(uuid) | ✅ | — | 只读 |
| `name` | string | ✅ | Stage Name | ≤100字符 |
| `order` | integer(int64) | — | — | — |
| `color` | string | — | — | ≤7字符 |
| `stage_type` | → LeadStageStageTypeEnum | — | — | — |
| `maps_to_status` | enum(LeadStatusEnum) | — | When lead enters this stage, also update Lead.status

* `assigned` - Assigned
* `in process` - In Process
* `converted` - Converted
* `recycled` - Recycled
* `closed` - Closed | 枚举: assigned, in process, converted, recycled, closed; 可空 |
| `win_probability` | integer(int64) | — | Default probability when lead enters this stage | — |
| `wip_limit` | integer(int64) | — | Maximum leads allowed in this stage (null = unlimited) | 可空 |
| `lead_count` | string | ✅ | — | 只读 |
| `created_at` | string(date-time) | ✅ | — | 只读 |
| `updated_at` | string(date-time) | ✅ | Last Modified At | 只读 |

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### POST `/api/leads/pipelines/{pipeline_pk}/stages/reorder/` 🔒

Reorder stages by providing ordered list of stage IDs.

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `pipeline_pk` | path | string | ✅ | — |

**请求体** `application/json`

**Schema: `StageReorderRequestRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `stage_ids` | [string] | ✅ | — | — |

**200** → 推断: LeadPipeline

> OpenAPI 未标注；动作 `reorder` 推断返回 `LeadPipeline`

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### DELETE `/api/leads/stages/{id}/` 🔒

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
### PUT `/api/leads/stages/{id}/` 🔒

Update stage.

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |

**请求体** `application/json`

> 新建/编辑线索阶段

**Schema: `LeadStageRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `name` | string | ✅ | Stage Name | ≤100字符 |
| `order` | integer(int64) | — | — | — |
| `color` | string | — | — | ≤7字符 |
| `stage_type` | → LeadStageStageTypeEnum | — | — | — |
| `maps_to_status` | enum(LeadStatusEnum) | — | When lead enters this stage, also update Lead.status

* `assigned` - Assigned
* `in process` - In Process
* `converted` - Converted
* `recycled` - Recycled
* `closed` - Closed | 枚举: assigned, in process, converted, recycled, closed; 可空 |
| `win_probability` | integer(int64) | — | Default probability when lead enters this stage | — |
| `wip_limit` | integer(int64) | — | Maximum leads allowed in this stage (null = unlimited) | 可空 |

**200** → `LeadStage`

**Schema: `LeadStage`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `id` | string(uuid) | ✅ | — | 只读 |
| `name` | string | ✅ | Stage Name | ≤100字符 |
| `order` | integer(int64) | — | — | — |
| `color` | string | — | — | ≤7字符 |
| `stage_type` | → LeadStageStageTypeEnum | — | — | — |
| `maps_to_status` | enum(LeadStatusEnum) | — | When lead enters this stage, also update Lead.status

* `assigned` - Assigned
* `in process` - In Process
* `converted` - Converted
* `recycled` - Recycled
* `closed` - Closed | 枚举: assigned, in process, converted, recycled, closed; 可空 |
| `win_probability` | integer(int64) | — | Default probability when lead enters this stage | — |
| `wip_limit` | integer(int64) | — | Maximum leads allowed in this stage (null = unlimited) | 可空 |
| `lead_count` | string | ✅ | — | 只读 |
| `created_at` | string(date-time) | ✅ | — | 只读 |
| `updated_at` | string(date-time) | ✅ | Last Modified At | 只读 |

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### POST `/api/leads/upload/` 🔒

新建

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `org` | header | string | — | — |

**请求体** `application/json`

**Schema: `LeadUploadSwaggerRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `leads_file` | string(binary) | ✅ | — | — |

**200** → `LeadUploadResponse`

**Schema: `LeadUploadResponse`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `error` | boolean | ✅ | — | — |
| `message` | string | ✅ | — | — |

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### DELETE `/api/leads/{id}/` 🔒

Lead Delete

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**200** → `LeadDeleteResponse`

**Schema: `LeadDeleteResponse`**

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
### GET `/api/leads/{id}/` 🔒

Lead Detail

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**200** → `LeadDetailResponse`

**Schema: `LeadDetailResponse`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `lead_obj` | → Lead | ✅ | — | — |
| `lead_obj.id` | string(uuid) | ✅ | — | 只读 |
| `lead_obj.title` | string | — | Lead name/subject (e.g., 'Enterprise Deal', 'Website Inquiry') | 可空; ≤255字符 |
| `lead_obj.salutation` | string | — | e.g., Mr, Mrs, Ms, Dr | 可空; ≤64字符 |
| `lead_obj.first_name` | string | — | — | 可空; ≤255字符 |
| `lead_obj.last_name` | string | — | — | 可空; ≤255字符 |
| `lead_obj.email` | string(email) | — | — | 可空; ≤254字符 |
| `lead_obj.phone` | string | — | — | 可空; ≤25字符; 正则: ^[\d\s\-\(\)\+\.]{7,25}$ |
| `lead_obj.job_title` | string | — | Person's job title (e.g., 'VP of Sales', 'CTO') | 可空; ≤255字符 |
| `lead_obj.website` | string | — | — | 可空; ≤255字符 |
| `lead_obj.linkedin_url` | string(uri) | — | — | 可空; ≤500字符 |
| `lead_obj.status` | enum(LeadStatusEnum) | — | — | 枚举: assigned, in process, converted, recycled, closed; 可空 |
| `lead_obj.source` | enum(SourceEnum) | — | — | 枚举: call, email, existing customer, partner, public relations, compaign, other; 可空 |
| `lead_obj.industry` | enum(IndustryEnum) | — | — | 枚举: ADVERTISING, AGRICULTURE, APPAREL & ACCESSORIES, AUTOMOTIVE, BANKING, BIOTECHNOLOGY, BUILDING MATERIALS & EQUIPMENT, CHEMICAL, COMPUTER, EDUCATION, ELECTRONICS, ENERGY, ENTERTAINMENT & LEISURE, FINANCE, FOOD & BEVERAGE, GROCERY, HEALTHCARE, INSURANCE, LEGAL, MANUFACTURING, PUBLISHING, REAL ESTATE, SERVICE, SOFTWARE, SPORTS, TECHNOLOGY, TELECOMMUNICATIONS, TELEVISION, TRANSPORTATION, VENTURE CAPITAL; 可空 |
| `lead_obj.rating` | enum(RatingEnum) | — | — | 枚举: HOT, WARM, COLD; 可空 |
| `lead_obj.opportunity_amount` | string(decimal) | — | Deal Value | 可空; 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `lead_obj.currency` | enum(CurrencyEnum) | — | — | 枚举: USD, EUR, GBP, INR, CAD, AUD, JPY, CNY, CHF, SGD, AED, BRL, MXN; 可空 |
| `lead_obj.probability` | integer(int64) | — | Win Probability % | 可空 |
| `lead_obj.close_date` | string(date) | — | Expected Close Date | 可空 |
| `lead_obj.address_line` | string | — | Address | 可空; ≤255字符 |
| `lead_obj.city` | string | — | — | 可空; ≤255字符 |
| `lead_obj.state` | string | — | — | 可空; ≤255字符 |
| `lead_obj.postcode` | string | — | Postal Code | 可空; ≤64字符 |
| `lead_obj.country` | enum(ClientCountryEnum) | — | — | 枚举: GB, AF, AX, AL, DZ, AS, AD, AO, AI, AQ, AG, AR, AM, AW, AU, AT, AZ, BS, BH, BD, BB, BY, BE, BZ, BJ, BM, BT, BO, BA, BW, BV, BR, IO, BN, BG, BF, BI, KH, CM, CA, CV, KY, CF, TD, CL, CN, CX, CC, CO, KM, CG, CD, CK, CR, CI, HR, CU, CY, CZ, DK, DJ, DM, DO, EC, EG, SV, GQ, ER, EE, ET, FK, FO, FJ, FI, FR, GF, PF, TF, GA, GM, GE, DE, GH, GI, GR, GL, GD, GP, GU, GT, GG, GN, GW, GY, HT, HM, VA, HN, HK, HU, IS, IN, ID, IR, IQ, IE, IM, IL, IT, JM, JP, JE, JO, KZ, KE, KI, KP, KR, KW, KG, LA, LV, LB, LS, LR, LY, LI, LT, LU, MO, MK, MG, MW, MY, MV, ML, MT, MH, MQ, MR, MU, YT, MX, FM, MD, MC, MN, ME, MS, MA, MZ, MM, NA, NR, NP, NL, AN, NC, NZ, NI, NE, NG, NU, NF, MP, NO, OM, PK, PW, PS, PA, PG, PY, PE, PH, PN, PL, PT, PR, QA, RE, RO, RU, RW, BL, SH, KN, LC, MF, PM, VC, WS, SM, ST, SA, SN, RS, SC, SL, SG, SK, SI, SB, SO, ZA, GS, ES, LK, SD, SR, SJ, SZ, SE, CH, SY, TW, TJ, TZ, TH, TL, TG, TK, TO, TT, TN, TR, TM, TC, TV, UG, UA, AE, US, UM, UY, UZ, VU, VE, VN, VG, VI, WF, EH, YE, ZM, ZW; 可空 |
| `lead_obj.assigned_to` | [Profile] | ✅ | — | 只读 |
| `lead_obj.assigned_to[].id` | string(uuid) | ✅ | — | 只读 |
| `lead_obj.assigned_to[].user_details` | object | ✅ | — | 只读 |
| `lead_obj.assigned_to[].role` | → ProfileRoleEnum | — | — | — |
| `lead_obj.assigned_to[].address` | string(uuid) | — | — | 可空 |
| `lead_obj.assigned_to[].has_marketing_access` | boolean | — | — | — |
| `lead_obj.assigned_to[].has_sales_access` | boolean | — | — | — |
| `lead_obj.assigned_to[].phone` | string | — | — | 可空; ≤20字符 |
| `lead_obj.assigned_to[].date_of_joining` | string(date) | — | — | 可空 |
| `lead_obj.assigned_to[].is_active` | boolean | — | — | — |
| `lead_obj.assigned_to[].created_at` | string(date-time) | ✅ | — | 只读 |
| `lead_obj.teams` | [Teams] | ✅ | — | 只读 |
| `lead_obj.teams[].id` | string(uuid) | ✅ | — | 只读 |
| `lead_obj.teams[].name` | string | ✅ | — | ≤100字符 |
| `lead_obj.teams[].description` | string | ✅ | — | — |
| `lead_obj.teams[].users` | [Profile] | ✅ | — | 只读 |
| `lead_obj.teams[].users[].id` | string(uuid) | ✅ | — | 只读 |
| `lead_obj.teams[].users[].user_details` | object | ✅ | — | 只读 |
| `lead_obj.teams[].users[].role` | → ProfileRoleEnum | — | — | — |
| `lead_obj.teams[].users[].address` | string(uuid) | — | — | 可空 |
| `lead_obj.teams[].users[].has_marketing_access` | boolean | — | — | — |
| `lead_obj.teams[].users[].has_sales_access` | boolean | — | — | — |
| `lead_obj.teams[].users[].phone` | string | — | — | 可空; ≤20字符 |
| `lead_obj.teams[].users[].date_of_joining` | string(date) | — | — | 可空 |
| `lead_obj.teams[].users[].is_active` | boolean | — | — | — |
| `lead_obj.teams[].users[].created_at` | string(date-time) | ✅ | — | 只读 |
| `lead_obj.teams[].created_at` | string(date-time) | ✅ | — | 只读 |
| `lead_obj.teams[].created_by` | → User | ✅ | — | — |
| `lead_obj.teams[].created_by.id` | string(uuid) | ✅ | — | 只读 |
| `lead_obj.teams[].created_by.email` | string(email) | — | Email address | ≤254字符 |
| `lead_obj.teams[].created_by.profile_pic` | string | — | — | 可空; ≤1000字符 |
| `lead_obj.last_contacted` | string(date) | — | — | 可空 |
| `lead_obj.next_follow_up` | string(date) | — | — | 可空 |
| `lead_obj.description` | string | — | Notes | 可空 |
| `lead_obj.contacts` | [Contact] | ✅ | — | 只读 |
| `lead_obj.contacts[].id` | string(uuid) | ✅ | — | 只读 |
| `lead_obj.contacts[].first_name` | string | ✅ | — | ≤255字符 |
| `lead_obj.contacts[].last_name` | string | ✅ | — | ≤255字符 |
| `lead_obj.contacts[].email` | string(email) | — | — | 可空; ≤254字符 |
| `lead_obj.contacts[].phone` | string | — | — | 可空; ≤25字符; 正则: ^[\d\s\-\(\)\+\.]{7,25}$ |
| `lead_obj.contacts[].organization` | string | — | Company | 可空; ≤255字符 |
| `lead_obj.contacts[].title` | string | — | Job Title | 可空; ≤255字符 |
| `lead_obj.contacts[].department` | string | — | — | 可空; ≤255字符 |
| `lead_obj.contacts[].do_not_call` | boolean | — | — | — |
| `lead_obj.contacts[].linkedin_url` | string(uri) | — | — | 可空; ≤200字符 |
| `lead_obj.contacts[].address_line` | string | — | Address | 可空; ≤255字符 |
| `lead_obj.contacts[].city` | string | — | — | 可空; ≤255字符 |
| `lead_obj.contacts[].state` | string | — | — | 可空; ≤255字符 |
| `lead_obj.contacts[].postcode` | string | — | Postal Code | 可空; ≤64字符 |
| `lead_obj.contacts[].country` | enum(ClientCountryEnum) | — | — | 枚举: GB, AF, AX, AL, DZ, AS, AD, AO, AI, AQ, AG, AR, AM, AW, AU, AT, AZ, BS, BH, BD, BB, BY, BE, BZ, BJ, BM, BT, BO, BA, BW, BV, BR, IO, BN, BG, BF, BI, KH, CM, CA, CV, KY, CF, TD, CL, CN, CX, CC, CO, KM, CG, CD, CK, CR, CI, HR, CU, CY, CZ, DK, DJ, DM, DO, EC, EG, SV, GQ, ER, EE, ET, FK, FO, FJ, FI, FR, GF, PF, TF, GA, GM, GE, DE, GH, GI, GR, GL, GD, GP, GU, GT, GG, GN, GW, GY, HT, HM, VA, HN, HK, HU, IS, IN, ID, IR, IQ, IE, IM, IL, IT, JM, JP, JE, JO, KZ, KE, KI, KP, KR, KW, KG, LA, LV, LB, LS, LR, LY, LI, LT, LU, MO, MK, MG, MW, MY, MV, ML, MT, MH, MQ, MR, MU, YT, MX, FM, MD, MC, MN, ME, MS, MA, MZ, MM, NA, NR, NP, NL, AN, NC, NZ, NI, NE, NG, NU, NF, MP, NO, OM, PK, PW, PS, PA, PG, PY, PE, PH, PN, PL, PT, PR, QA, RE, RO, RU, RW, BL, SH, KN, LC, MF, PM, VC, WS, SM, ST, SA, SN, RS, SC, SL, SG, SK, SI, SB, SO, ZA, GS, ES, LK, SD, SR, SJ, SZ, SE, CH, SY, TW, TJ, TZ, TH, TL, TG, TK, TO, TT, TN, TR, TM, TC, TV, UG, UA, AE, US, UM, UY, UZ, VU, VE, VN, VG, VI, WF, EH, YE, ZM, ZW; 可空 |
| `lead_obj.contacts[].assigned_to` | [Profile] | ✅ | — | 只读 |
| `lead_obj.contacts[].assigned_to[].id` | string(uuid) | ✅ | — | 只读 |
| `lead_obj.contacts[].assigned_to[].user_details` | object | ✅ | — | 只读 |
| `lead_obj.contacts[].assigned_to[].role` | → ProfileRoleEnum | — | — | — |
| `lead_obj.contacts[].assigned_to[].address` | string(uuid) | — | — | 可空 |
| `lead_obj.contacts[].assigned_to[].has_marketing_access` | boolean | — | — | — |
| `lead_obj.contacts[].assigned_to[].has_sales_access` | boolean | — | — | — |
| `lead_obj.contacts[].assigned_to[].phone` | string | — | — | 可空; ≤20字符 |
| `lead_obj.contacts[].assigned_to[].date_of_joining` | string(date) | — | — | 可空 |
| `lead_obj.contacts[].assigned_to[].is_active` | boolean | — | — | — |
| `lead_obj.contacts[].assigned_to[].created_at` | string(date-time) | ✅ | — | 只读 |
| `lead_obj.contacts[].teams` | [Teams] | ✅ | — | 只读 |
| `lead_obj.contacts[].teams[].id` | string(uuid) | ✅ | — | 只读 |
| `lead_obj.contacts[].teams[].name` | string | ✅ | — | ≤100字符 |
| `lead_obj.contacts[].teams[].description` | string | ✅ | — | — |
| `lead_obj.contacts[].teams[].users` | [Profile] | ✅ | — | 只读 |
| `lead_obj.contacts[].teams[].users[].id` | string(uuid) | ✅ | — | 只读 |
| `lead_obj.contacts[].teams[].users[].user_details` | object | ✅ | — | 只读 |
| `lead_obj.contacts[].teams[].users[].role` | → ProfileRoleEnum | — | — | — |
| `lead_obj.contacts[].teams[].users[].address` | string(uuid) | — | — | 可空 |
| `lead_obj.contacts[].teams[].users[].has_marketing_access` | boolean | — | — | — |
| `lead_obj.contacts[].teams[].users[].has_sales_access` | boolean | — | — | — |
| `lead_obj.contacts[].teams[].users[].phone` | string | — | — | 可空; ≤20字符 |
| `lead_obj.contacts[].teams[].users[].date_of_joining` | string(date) | — | — | 可空 |
| `lead_obj.contacts[].teams[].users[].is_active` | boolean | — | — | — |
| `lead_obj.contacts[].teams[].users[].created_at` | string(date-time) | ✅ | — | 只读 |
| `lead_obj.contacts[].teams[].created_at` | string(date-time) | ✅ | — | 只读 |
| `lead_obj.contacts[].teams[].created_by` | → User | ✅ | — | — |
| `lead_obj.contacts[].teams[].created_by.id` | string(uuid) | ✅ | — | 只读 |
| `lead_obj.contacts[].teams[].created_by.email` | string(email) | — | Email address | ≤254字符 |
| `lead_obj.contacts[].teams[].created_by.profile_pic` | string | — | — | 可空; ≤1000字符 |
| `lead_obj.contacts[].tags` | [string] | — | — | — |
| `lead_obj.contacts[].description` | string | — | Notes | 可空 |
| `lead_obj.contacts[].created_by` | string(uuid) | — | — | 可空 |
| `lead_obj.contacts[].created_at` | string(date-time) | ✅ | — | 只读 |
| `lead_obj.contacts[].is_active` | boolean | — | — | — |
| `lead_obj.contacts[].org` | → Organization | ✅ | — | — |
| `lead_obj.contacts[].org.id` | string(uuid) | ✅ | — | 只读 |
| `lead_obj.contacts[].org.name` | string | — | — | 可空; ≤100字符 |
| `lead_obj.contacts[].org.api_key` | string | ✅ | — | 只读 |
| `lead_obj.contacts[].account` | string(uuid) | — | Primary account this contact belongs to | 可空 |
| `lead_obj.contacts[].contact_attachment` | [Attachments] | ✅ | — | 只读 |
| `lead_obj.contacts[].contact_attachment[].id` | string(uuid) | ✅ | — | 只读 |
| `lead_obj.contacts[].contact_attachment[].created_by` | string(uuid) | — | — | 可空 |
| `lead_obj.contacts[].contact_attachment[].file_name` | string | ✅ | — | ≤60字符 |
| `lead_obj.contacts[].contact_attachment[].created_at` | string(date-time) | ✅ | — | 只读 |
| `lead_obj.contacts[].contact_attachment[].file_path` | string | ✅ | — | 只读 |
| `lead_obj.contacts[].contact_attachment[].content_type` | string | ✅ | Python model class name | 只读 |
| `lead_obj.contacts[].contact_attachment[].object_id` | string(uuid) | ✅ | — | — |
| `lead_obj.contacts[].contact_attachment[].org` | string(uuid) | ✅ | — | — |
| `lead_obj.lead_attachment` | [Attachments] | ✅ | — | 只读 |
| `lead_obj.lead_attachment[].id` | string(uuid) | ✅ | — | 只读 |
| `lead_obj.lead_attachment[].created_by` | string(uuid) | — | — | 可空 |
| `lead_obj.lead_attachment[].file_name` | string | ✅ | — | ≤60字符 |
| `lead_obj.lead_attachment[].created_at` | string(date-time) | ✅ | — | 只读 |
| `lead_obj.lead_attachment[].file_path` | string | ✅ | — | 只读 |
| `lead_obj.lead_attachment[].content_type` | string | ✅ | Python model class name | 只读 |
| `lead_obj.lead_attachment[].object_id` | string(uuid) | ✅ | — | — |
| `lead_obj.lead_attachment[].org` | string(uuid) | ✅ | — | — |
| `lead_obj.lead_comments` | string | ✅ | — | 只读 |
| `lead_obj.tags` | [Tags] | ✅ | — | 只读 |
| `lead_obj.tags[].id` | string(uuid) | ✅ | — | 只读 |
| `lead_obj.tags[].name` | string | ✅ | — | ≤50字符 |
| `lead_obj.tags[].slug` | string | ✅ | — | 只读 |
| `lead_obj.tags[].color` | → ColorEnum | — | — | — |
| `lead_obj.tags[].description` | string | — | — | — |
| `lead_obj.tags[].is_active` | boolean | — | — | — |
| `lead_obj.tags[].created_at` | string(date-time) | ✅ | — | 只读 |
| `lead_obj.created_by` | → User | ✅ | — | — |
| `lead_obj.created_by.id` | string(uuid) | ✅ | — | 只读 |
| `lead_obj.created_by.email` | string(email) | — | Email address | ≤254字符 |
| `lead_obj.created_by.profile_pic` | string | — | — | 可空; ≤1000字符 |
| `lead_obj.created_at` | string(date-time) | ✅ | — | 只读 |
| `lead_obj.is_active` | boolean | — | — | — |
| `lead_obj.company_name` | string | — | — | 可空; ≤255字符 |
| `lead_obj.stage` | string(uuid) | — | Current pipeline stage (null = use status-based kanban) | 可空 |
| `lead_obj.kanban_order` | string(decimal) | — | Order within the kanban column for drag-drop | 正则: ^-?\d{0,9}(?:\.\d{0,6})?$ |
| `attachments` | [Attachments] | ✅ | — | — |
| `attachments[].id` | string(uuid) | ✅ | — | 只读 |
| `attachments[].created_by` | string(uuid) | — | — | 可空 |
| `attachments[].file_name` | string | ✅ | — | ≤60字符 |
| `attachments[].created_at` | string(date-time) | ✅ | — | 只读 |
| `attachments[].file_path` | string | ✅ | — | 只读 |
| `attachments[].content_type` | string | ✅ | Python model class name | 只读 |
| `attachments[].object_id` | string(uuid) | ✅ | — | — |
| `attachments[].org` | string(uuid) | ✅ | — | — |
| `comments` | [LeadComment] | ✅ | — | — |
| `comments[].id` | string(uuid) | ✅ | — | 只读 |
| `comments[].comment` | string | ✅ | — | ≤255字符 |
| `comments[].commented_on` | string(date-time) | ✅ | — | 只读 |
| `comments[].commented_by` | any | ✅ | — | 只读 |
| `users_mention` | [any] | ✅ | — | — |
| `assigned_data` | [any] | ✅ | — | — |
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
| `source` | [any] | ✅ | — | — |
| `status` | [any] | ✅ | — | — |
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
| `countries` | [any] | ✅ | — | — |

**可能的错误响应（DRF 标准）**

- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）
- **400**: 请求参数校验失败（query/header/body 不合法）

---
### PATCH `/api/leads/{id}/` 🔒

部分更新线索

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**请求体** `application/json`

**Schema: `PatchedLeadDetailEditSwaggerRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `comment` | string | — | — | — |
| `lead_attachment` | string(binary) | — | — | — |

**200** → `LeadPatchResponse`

**Schema: `LeadPatchResponse`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `error` | boolean | ✅ | — | — |
| `message` | string | ✅ | — | — |
| `account_id` | string | — | — | — |
| `contact_id` | string | — | — | 可空 |
| `opportunity_id` | string | — | — | 可空 |

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### POST `/api/leads/{id}/` 🔒

编辑线索详情（含附件/评论）

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**请求体** `application/json`

> 编辑线索详情（含附件/评论）

**Schema: `LeadDetailEditSwaggerRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `comment` | string | ✅ | — | — |
| `lead_attachment` | string(binary) | ✅ | — | — |

**200** → `LeadCommentAttachmentResponse`

**Schema: `LeadCommentAttachmentResponse`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `lead_obj` | → Lead | ✅ | — | — |
| `lead_obj.id` | string(uuid) | ✅ | — | 只读 |
| `lead_obj.title` | string | — | Lead name/subject (e.g., 'Enterprise Deal', 'Website Inquiry') | 可空; ≤255字符 |
| `lead_obj.salutation` | string | — | e.g., Mr, Mrs, Ms, Dr | 可空; ≤64字符 |
| `lead_obj.first_name` | string | — | — | 可空; ≤255字符 |
| `lead_obj.last_name` | string | — | — | 可空; ≤255字符 |
| `lead_obj.email` | string(email) | — | — | 可空; ≤254字符 |
| `lead_obj.phone` | string | — | — | 可空; ≤25字符; 正则: ^[\d\s\-\(\)\+\.]{7,25}$ |
| `lead_obj.job_title` | string | — | Person's job title (e.g., 'VP of Sales', 'CTO') | 可空; ≤255字符 |
| `lead_obj.website` | string | — | — | 可空; ≤255字符 |
| `lead_obj.linkedin_url` | string(uri) | — | — | 可空; ≤500字符 |
| `lead_obj.status` | enum(LeadStatusEnum) | — | — | 枚举: assigned, in process, converted, recycled, closed; 可空 |
| `lead_obj.source` | enum(SourceEnum) | — | — | 枚举: call, email, existing customer, partner, public relations, compaign, other; 可空 |
| `lead_obj.industry` | enum(IndustryEnum) | — | — | 枚举: ADVERTISING, AGRICULTURE, APPAREL & ACCESSORIES, AUTOMOTIVE, BANKING, BIOTECHNOLOGY, BUILDING MATERIALS & EQUIPMENT, CHEMICAL, COMPUTER, EDUCATION, ELECTRONICS, ENERGY, ENTERTAINMENT & LEISURE, FINANCE, FOOD & BEVERAGE, GROCERY, HEALTHCARE, INSURANCE, LEGAL, MANUFACTURING, PUBLISHING, REAL ESTATE, SERVICE, SOFTWARE, SPORTS, TECHNOLOGY, TELECOMMUNICATIONS, TELEVISION, TRANSPORTATION, VENTURE CAPITAL; 可空 |
| `lead_obj.rating` | enum(RatingEnum) | — | — | 枚举: HOT, WARM, COLD; 可空 |
| `lead_obj.opportunity_amount` | string(decimal) | — | Deal Value | 可空; 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `lead_obj.currency` | enum(CurrencyEnum) | — | — | 枚举: USD, EUR, GBP, INR, CAD, AUD, JPY, CNY, CHF, SGD, AED, BRL, MXN; 可空 |
| `lead_obj.probability` | integer(int64) | — | Win Probability % | 可空 |
| `lead_obj.close_date` | string(date) | — | Expected Close Date | 可空 |
| `lead_obj.address_line` | string | — | Address | 可空; ≤255字符 |
| `lead_obj.city` | string | — | — | 可空; ≤255字符 |
| `lead_obj.state` | string | — | — | 可空; ≤255字符 |
| `lead_obj.postcode` | string | — | Postal Code | 可空; ≤64字符 |
| `lead_obj.country` | enum(ClientCountryEnum) | — | — | 枚举: GB, AF, AX, AL, DZ, AS, AD, AO, AI, AQ, AG, AR, AM, AW, AU, AT, AZ, BS, BH, BD, BB, BY, BE, BZ, BJ, BM, BT, BO, BA, BW, BV, BR, IO, BN, BG, BF, BI, KH, CM, CA, CV, KY, CF, TD, CL, CN, CX, CC, CO, KM, CG, CD, CK, CR, CI, HR, CU, CY, CZ, DK, DJ, DM, DO, EC, EG, SV, GQ, ER, EE, ET, FK, FO, FJ, FI, FR, GF, PF, TF, GA, GM, GE, DE, GH, GI, GR, GL, GD, GP, GU, GT, GG, GN, GW, GY, HT, HM, VA, HN, HK, HU, IS, IN, ID, IR, IQ, IE, IM, IL, IT, JM, JP, JE, JO, KZ, KE, KI, KP, KR, KW, KG, LA, LV, LB, LS, LR, LY, LI, LT, LU, MO, MK, MG, MW, MY, MV, ML, MT, MH, MQ, MR, MU, YT, MX, FM, MD, MC, MN, ME, MS, MA, MZ, MM, NA, NR, NP, NL, AN, NC, NZ, NI, NE, NG, NU, NF, MP, NO, OM, PK, PW, PS, PA, PG, PY, PE, PH, PN, PL, PT, PR, QA, RE, RO, RU, RW, BL, SH, KN, LC, MF, PM, VC, WS, SM, ST, SA, SN, RS, SC, SL, SG, SK, SI, SB, SO, ZA, GS, ES, LK, SD, SR, SJ, SZ, SE, CH, SY, TW, TJ, TZ, TH, TL, TG, TK, TO, TT, TN, TR, TM, TC, TV, UG, UA, AE, US, UM, UY, UZ, VU, VE, VN, VG, VI, WF, EH, YE, ZM, ZW; 可空 |
| `lead_obj.assigned_to` | [Profile] | ✅ | — | 只读 |
| `lead_obj.assigned_to[].id` | string(uuid) | ✅ | — | 只读 |
| `lead_obj.assigned_to[].user_details` | object | ✅ | — | 只读 |
| `lead_obj.assigned_to[].role` | → ProfileRoleEnum | — | — | — |
| `lead_obj.assigned_to[].address` | string(uuid) | — | — | 可空 |
| `lead_obj.assigned_to[].has_marketing_access` | boolean | — | — | — |
| `lead_obj.assigned_to[].has_sales_access` | boolean | — | — | — |
| `lead_obj.assigned_to[].phone` | string | — | — | 可空; ≤20字符 |
| `lead_obj.assigned_to[].date_of_joining` | string(date) | — | — | 可空 |
| `lead_obj.assigned_to[].is_active` | boolean | — | — | — |
| `lead_obj.assigned_to[].created_at` | string(date-time) | ✅ | — | 只读 |
| `lead_obj.teams` | [Teams] | ✅ | — | 只读 |
| `lead_obj.teams[].id` | string(uuid) | ✅ | — | 只读 |
| `lead_obj.teams[].name` | string | ✅ | — | ≤100字符 |
| `lead_obj.teams[].description` | string | ✅ | — | — |
| `lead_obj.teams[].users` | [Profile] | ✅ | — | 只读 |
| `lead_obj.teams[].users[].id` | string(uuid) | ✅ | — | 只读 |
| `lead_obj.teams[].users[].user_details` | object | ✅ | — | 只读 |
| `lead_obj.teams[].users[].role` | → ProfileRoleEnum | — | — | — |
| `lead_obj.teams[].users[].address` | string(uuid) | — | — | 可空 |
| `lead_obj.teams[].users[].has_marketing_access` | boolean | — | — | — |
| `lead_obj.teams[].users[].has_sales_access` | boolean | — | — | — |
| `lead_obj.teams[].users[].phone` | string | — | — | 可空; ≤20字符 |
| `lead_obj.teams[].users[].date_of_joining` | string(date) | — | — | 可空 |
| `lead_obj.teams[].users[].is_active` | boolean | — | — | — |
| `lead_obj.teams[].users[].created_at` | string(date-time) | ✅ | — | 只读 |
| `lead_obj.teams[].created_at` | string(date-time) | ✅ | — | 只读 |
| `lead_obj.teams[].created_by` | → User | ✅ | — | — |
| `lead_obj.teams[].created_by.id` | string(uuid) | ✅ | — | 只读 |
| `lead_obj.teams[].created_by.email` | string(email) | — | Email address | ≤254字符 |
| `lead_obj.teams[].created_by.profile_pic` | string | — | — | 可空; ≤1000字符 |
| `lead_obj.last_contacted` | string(date) | — | — | 可空 |
| `lead_obj.next_follow_up` | string(date) | — | — | 可空 |
| `lead_obj.description` | string | — | Notes | 可空 |
| `lead_obj.contacts` | [Contact] | ✅ | — | 只读 |
| `lead_obj.contacts[].id` | string(uuid) | ✅ | — | 只读 |
| `lead_obj.contacts[].first_name` | string | ✅ | — | ≤255字符 |
| `lead_obj.contacts[].last_name` | string | ✅ | — | ≤255字符 |
| `lead_obj.contacts[].email` | string(email) | — | — | 可空; ≤254字符 |
| `lead_obj.contacts[].phone` | string | — | — | 可空; ≤25字符; 正则: ^[\d\s\-\(\)\+\.]{7,25}$ |
| `lead_obj.contacts[].organization` | string | — | Company | 可空; ≤255字符 |
| `lead_obj.contacts[].title` | string | — | Job Title | 可空; ≤255字符 |
| `lead_obj.contacts[].department` | string | — | — | 可空; ≤255字符 |
| `lead_obj.contacts[].do_not_call` | boolean | — | — | — |
| `lead_obj.contacts[].linkedin_url` | string(uri) | — | — | 可空; ≤200字符 |
| `lead_obj.contacts[].address_line` | string | — | Address | 可空; ≤255字符 |
| `lead_obj.contacts[].city` | string | — | — | 可空; ≤255字符 |
| `lead_obj.contacts[].state` | string | — | — | 可空; ≤255字符 |
| `lead_obj.contacts[].postcode` | string | — | Postal Code | 可空; ≤64字符 |
| `lead_obj.contacts[].country` | enum(ClientCountryEnum) | — | — | 枚举: GB, AF, AX, AL, DZ, AS, AD, AO, AI, AQ, AG, AR, AM, AW, AU, AT, AZ, BS, BH, BD, BB, BY, BE, BZ, BJ, BM, BT, BO, BA, BW, BV, BR, IO, BN, BG, BF, BI, KH, CM, CA, CV, KY, CF, TD, CL, CN, CX, CC, CO, KM, CG, CD, CK, CR, CI, HR, CU, CY, CZ, DK, DJ, DM, DO, EC, EG, SV, GQ, ER, EE, ET, FK, FO, FJ, FI, FR, GF, PF, TF, GA, GM, GE, DE, GH, GI, GR, GL, GD, GP, GU, GT, GG, GN, GW, GY, HT, HM, VA, HN, HK, HU, IS, IN, ID, IR, IQ, IE, IM, IL, IT, JM, JP, JE, JO, KZ, KE, KI, KP, KR, KW, KG, LA, LV, LB, LS, LR, LY, LI, LT, LU, MO, MK, MG, MW, MY, MV, ML, MT, MH, MQ, MR, MU, YT, MX, FM, MD, MC, MN, ME, MS, MA, MZ, MM, NA, NR, NP, NL, AN, NC, NZ, NI, NE, NG, NU, NF, MP, NO, OM, PK, PW, PS, PA, PG, PY, PE, PH, PN, PL, PT, PR, QA, RE, RO, RU, RW, BL, SH, KN, LC, MF, PM, VC, WS, SM, ST, SA, SN, RS, SC, SL, SG, SK, SI, SB, SO, ZA, GS, ES, LK, SD, SR, SJ, SZ, SE, CH, SY, TW, TJ, TZ, TH, TL, TG, TK, TO, TT, TN, TR, TM, TC, TV, UG, UA, AE, US, UM, UY, UZ, VU, VE, VN, VG, VI, WF, EH, YE, ZM, ZW; 可空 |
| `lead_obj.contacts[].assigned_to` | [Profile] | ✅ | — | 只读 |
| `lead_obj.contacts[].assigned_to[].id` | string(uuid) | ✅ | — | 只读 |
| `lead_obj.contacts[].assigned_to[].user_details` | object | ✅ | — | 只读 |
| `lead_obj.contacts[].assigned_to[].role` | → ProfileRoleEnum | — | — | — |
| `lead_obj.contacts[].assigned_to[].address` | string(uuid) | — | — | 可空 |
| `lead_obj.contacts[].assigned_to[].has_marketing_access` | boolean | — | — | — |
| `lead_obj.contacts[].assigned_to[].has_sales_access` | boolean | — | — | — |
| `lead_obj.contacts[].assigned_to[].phone` | string | — | — | 可空; ≤20字符 |
| `lead_obj.contacts[].assigned_to[].date_of_joining` | string(date) | — | — | 可空 |
| `lead_obj.contacts[].assigned_to[].is_active` | boolean | — | — | — |
| `lead_obj.contacts[].assigned_to[].created_at` | string(date-time) | ✅ | — | 只读 |
| `lead_obj.contacts[].teams` | [Teams] | ✅ | — | 只读 |
| `lead_obj.contacts[].teams[].id` | string(uuid) | ✅ | — | 只读 |
| `lead_obj.contacts[].teams[].name` | string | ✅ | — | ≤100字符 |
| `lead_obj.contacts[].teams[].description` | string | ✅ | — | — |
| `lead_obj.contacts[].teams[].users` | [Profile] | ✅ | — | 只读 |
| `lead_obj.contacts[].teams[].users[].id` | string(uuid) | ✅ | — | 只读 |
| `lead_obj.contacts[].teams[].users[].user_details` | object | ✅ | — | 只读 |
| `lead_obj.contacts[].teams[].users[].role` | → ProfileRoleEnum | — | — | — |
| `lead_obj.contacts[].teams[].users[].address` | string(uuid) | — | — | 可空 |
| `lead_obj.contacts[].teams[].users[].has_marketing_access` | boolean | — | — | — |
| `lead_obj.contacts[].teams[].users[].has_sales_access` | boolean | — | — | — |
| `lead_obj.contacts[].teams[].users[].phone` | string | — | — | 可空; ≤20字符 |
| `lead_obj.contacts[].teams[].users[].date_of_joining` | string(date) | — | — | 可空 |
| `lead_obj.contacts[].teams[].users[].is_active` | boolean | — | — | — |
| `lead_obj.contacts[].teams[].users[].created_at` | string(date-time) | ✅ | — | 只读 |
| `lead_obj.contacts[].teams[].created_at` | string(date-time) | ✅ | — | 只读 |
| `lead_obj.contacts[].teams[].created_by` | → User | ✅ | — | — |
| `lead_obj.contacts[].teams[].created_by.id` | string(uuid) | ✅ | — | 只读 |
| `lead_obj.contacts[].teams[].created_by.email` | string(email) | — | Email address | ≤254字符 |
| `lead_obj.contacts[].teams[].created_by.profile_pic` | string | — | — | 可空; ≤1000字符 |
| `lead_obj.contacts[].tags` | [string] | — | — | — |
| `lead_obj.contacts[].description` | string | — | Notes | 可空 |
| `lead_obj.contacts[].created_by` | string(uuid) | — | — | 可空 |
| `lead_obj.contacts[].created_at` | string(date-time) | ✅ | — | 只读 |
| `lead_obj.contacts[].is_active` | boolean | — | — | — |
| `lead_obj.contacts[].org` | → Organization | ✅ | — | — |
| `lead_obj.contacts[].org.id` | string(uuid) | ✅ | — | 只读 |
| `lead_obj.contacts[].org.name` | string | — | — | 可空; ≤100字符 |
| `lead_obj.contacts[].org.api_key` | string | ✅ | — | 只读 |
| `lead_obj.contacts[].account` | string(uuid) | — | Primary account this contact belongs to | 可空 |
| `lead_obj.contacts[].contact_attachment` | [Attachments] | ✅ | — | 只读 |
| `lead_obj.contacts[].contact_attachment[].id` | string(uuid) | ✅ | — | 只读 |
| `lead_obj.contacts[].contact_attachment[].created_by` | string(uuid) | — | — | 可空 |
| `lead_obj.contacts[].contact_attachment[].file_name` | string | ✅ | — | ≤60字符 |
| `lead_obj.contacts[].contact_attachment[].created_at` | string(date-time) | ✅ | — | 只读 |
| `lead_obj.contacts[].contact_attachment[].file_path` | string | ✅ | — | 只读 |
| `lead_obj.contacts[].contact_attachment[].content_type` | string | ✅ | Python model class name | 只读 |
| `lead_obj.contacts[].contact_attachment[].object_id` | string(uuid) | ✅ | — | — |
| `lead_obj.contacts[].contact_attachment[].org` | string(uuid) | ✅ | — | — |
| `lead_obj.lead_attachment` | [Attachments] | ✅ | — | 只读 |
| `lead_obj.lead_attachment[].id` | string(uuid) | ✅ | — | 只读 |
| `lead_obj.lead_attachment[].created_by` | string(uuid) | — | — | 可空 |
| `lead_obj.lead_attachment[].file_name` | string | ✅ | — | ≤60字符 |
| `lead_obj.lead_attachment[].created_at` | string(date-time) | ✅ | — | 只读 |
| `lead_obj.lead_attachment[].file_path` | string | ✅ | — | 只读 |
| `lead_obj.lead_attachment[].content_type` | string | ✅ | Python model class name | 只读 |
| `lead_obj.lead_attachment[].object_id` | string(uuid) | ✅ | — | — |
| `lead_obj.lead_attachment[].org` | string(uuid) | ✅ | — | — |
| `lead_obj.lead_comments` | string | ✅ | — | 只读 |
| `lead_obj.tags` | [Tags] | ✅ | — | 只读 |
| `lead_obj.tags[].id` | string(uuid) | ✅ | — | 只读 |
| `lead_obj.tags[].name` | string | ✅ | — | ≤50字符 |
| `lead_obj.tags[].slug` | string | ✅ | — | 只读 |
| `lead_obj.tags[].color` | → ColorEnum | — | — | — |
| `lead_obj.tags[].description` | string | — | — | — |
| `lead_obj.tags[].is_active` | boolean | — | — | — |
| `lead_obj.tags[].created_at` | string(date-time) | ✅ | — | 只读 |
| `lead_obj.created_by` | → User | ✅ | — | — |
| `lead_obj.created_by.id` | string(uuid) | ✅ | — | 只读 |
| `lead_obj.created_by.email` | string(email) | — | Email address | ≤254字符 |
| `lead_obj.created_by.profile_pic` | string | — | — | 可空; ≤1000字符 |
| `lead_obj.created_at` | string(date-time) | ✅ | — | 只读 |
| `lead_obj.is_active` | boolean | — | — | — |
| `lead_obj.company_name` | string | — | — | 可空; ≤255字符 |
| `lead_obj.stage` | string(uuid) | — | Current pipeline stage (null = use status-based kanban) | 可空 |
| `lead_obj.kanban_order` | string(decimal) | — | Order within the kanban column for drag-drop | 正则: ^-?\d{0,9}(?:\.\d{0,6})?$ |
| `attachments` | [Attachments] | ✅ | — | — |
| `attachments[].id` | string(uuid) | ✅ | — | 只读 |
| `attachments[].created_by` | string(uuid) | — | — | 可空 |
| `attachments[].file_name` | string | ✅ | — | ≤60字符 |
| `attachments[].created_at` | string(date-time) | ✅ | — | 只读 |
| `attachments[].file_path` | string | ✅ | — | 只读 |
| `attachments[].content_type` | string | ✅ | Python model class name | 只读 |
| `attachments[].object_id` | string(uuid) | ✅ | — | — |
| `attachments[].org` | string(uuid) | ✅ | — | — |
| `comments` | [LeadComment] | ✅ | — | — |
| `comments[].id` | string(uuid) | ✅ | — | 只读 |
| `comments[].comment` | string | ✅ | — | ≤255字符 |
| `comments[].commented_on` | string(date-time) | ✅ | — | 只读 |
| `comments[].commented_by` | any | ✅ | — | 只读 |

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### PUT `/api/leads/{id}/` 🔒

新建线索

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**请求体** `application/json`

> 新建线索

**Schema: `LeadCreateSwaggerRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `title` | string | — | Lead name/subject (e.g., 'Enterprise Deal', 'Website Inquiry') | 可空; ≤255字符 |
| `salutation` | string | — | e.g., Mr, Mrs, Ms, Dr | 可空; ≤64字符 |
| `first_name` | string | — | — | 可空; ≤255字符 |
| `last_name` | string | — | — | 可空; ≤255字符 |
| `email` | string(email) | — | — | 可空; ≤254字符 |
| `phone` | string | — | — | 可空; ≤25字符; 正则: ^[\d\s\-\(\)\+\.]{7,25}$ |
| `job_title` | string | — | Person's job title (e.g., 'VP of Sales', 'CTO') | 可空; ≤255字符 |
| `website` | string | — | — | 可空; ≤255字符 |
| `linkedin_url` | string(uri) | — | — | 可空; ≤500字符 |
| `status` | enum(LeadStatusEnum) | — | — | 枚举: assigned, in process, converted, recycled, closed; 可空 |
| `source` | enum(SourceEnum) | — | — | 枚举: call, email, existing customer, partner, public relations, compaign, other; 可空 |
| `industry` | enum(IndustryEnum) | — | — | 枚举: ADVERTISING, AGRICULTURE, APPAREL & ACCESSORIES, AUTOMOTIVE, BANKING, BIOTECHNOLOGY, BUILDING MATERIALS & EQUIPMENT, CHEMICAL, COMPUTER, EDUCATION, ELECTRONICS, ENERGY, ENTERTAINMENT & LEISURE, FINANCE, FOOD & BEVERAGE, GROCERY, HEALTHCARE, INSURANCE, LEGAL, MANUFACTURING, PUBLISHING, REAL ESTATE, SERVICE, SOFTWARE, SPORTS, TECHNOLOGY, TELECOMMUNICATIONS, TELEVISION, TRANSPORTATION, VENTURE CAPITAL; 可空 |
| `rating` | enum(RatingEnum) | — | — | 枚举: HOT, WARM, COLD; 可空 |
| `opportunity_amount` | string(decimal) | — | Deal Value | 可空; 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `probability` | integer(int64) | — | Win Probability % | 可空 |
| `close_date` | string(date) | — | Expected Close Date | 可空 |
| `address_line` | string | — | Address | 可空; ≤255字符 |
| `city` | string | — | — | 可空; ≤255字符 |
| `state` | string | — | — | 可空; ≤255字符 |
| `postcode` | string | — | Postal Code | 可空; ≤64字符 |
| `country` | enum(ClientCountryEnum) | — | — | 枚举: GB, AF, AX, AL, DZ, AS, AD, AO, AI, AQ, AG, AR, AM, AW, AU, AT, AZ, BS, BH, BD, BB, BY, BE, BZ, BJ, BM, BT, BO, BA, BW, BV, BR, IO, BN, BG, BF, BI, KH, CM, CA, CV, KY, CF, TD, CL, CN, CX, CC, CO, KM, CG, CD, CK, CR, CI, HR, CU, CY, CZ, DK, DJ, DM, DO, EC, EG, SV, GQ, ER, EE, ET, FK, FO, FJ, FI, FR, GF, PF, TF, GA, GM, GE, DE, GH, GI, GR, GL, GD, GP, GU, GT, GG, GN, GW, GY, HT, HM, VA, HN, HK, HU, IS, IN, ID, IR, IQ, IE, IM, IL, IT, JM, JP, JE, JO, KZ, KE, KI, KP, KR, KW, KG, LA, LV, LB, LS, LR, LY, LI, LT, LU, MO, MK, MG, MW, MY, MV, ML, MT, MH, MQ, MR, MU, YT, MX, FM, MD, MC, MN, ME, MS, MA, MZ, MM, NA, NR, NP, NL, AN, NC, NZ, NI, NE, NG, NU, NF, MP, NO, OM, PK, PW, PS, PA, PG, PY, PE, PH, PN, PL, PT, PR, QA, RE, RO, RU, RW, BL, SH, KN, LC, MF, PM, VC, WS, SM, ST, SA, SN, RS, SC, SL, SG, SK, SI, SB, SO, ZA, GS, ES, LK, SD, SR, SJ, SZ, SE, CH, SY, TW, TJ, TZ, TH, TL, TG, TK, TO, TT, TN, TR, TM, TC, TV, UG, UA, AE, US, UM, UY, UZ, VU, VE, VN, VG, VI, WF, EH, YE, ZM, ZW; 可空 |
| `assigned_to` | [string] | ✅ | — | — |
| `teams` | [string] | ✅ | — | — |
| `contacts` | [string] | ✅ | — | — |
| `tags` | [string] | — | — | — |
| `last_contacted` | string(date) | — | — | 可空 |
| `next_follow_up` | string(date) | — | — | 可空 |
| `description` | string | — | Notes | 可空 |
| `company_name` | string | — | — | 可空; ≤255字符 |

**200** → `LeadUpdateResponse`

**Schema: `LeadUpdateResponse`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `error` | boolean | ✅ | — | — |
| `message` | string | ✅ | — | — |
| `account_id` | string | — | — | — |
| `contact_id` | string | — | — | 可空 |
| `opportunity_id` | string | — | — | 可空 |

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### PATCH `/api/leads/{id}/move/` 🔒

移动线索到不同列/位置 .

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |

**请求体** `application/json`

**Schema: `PatchedLeadMoveRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `stage_id` | string(uuid) | — | — | 可空 |
| `status` | → LeadStatusEnum | — | — | — |
| `kanban_order` | string(decimal) | — | — | 正则: ^-?\d{0,9}(?:\.\d{0,6})?$ |
| `above_lead_id` | string(uuid) | — | — | 可空 |
| `below_lead_id` | string(uuid) | — | — | 可空 |

**200** → 推断: object

> OpenAPI 未标注；动作 `move` 返回 JSON

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---