# 客户关系管理 — 交易（商机）

> 共 16 个端点。🔒 = 需要登录（JWT），🟢 = 无需鉴权。
> 交易（商机）CRUD + 行项目 + 评论/附件。GET /api/opportunities/ 返回**聚合 dict**（opportunities + accounts_list + 下拉选项）。

## 端点速览

| 方法 | 路径 | 鉴权 | 说明 |
|------|------|------|------|
| GET | `/api/opportunities/` | 🔒 | 列表查询 |
| POST | `/api/opportunities/` | 🔒 | 新建商机 |
| DELETE | `/api/opportunities/attachment/{id}/` | 🔒 | 删除 |
| DELETE | `/api/opportunities/comment/{id}/` | 🔒 | 删除评论 |
| PATCH | `/api/opportunities/comment/{id}/` | 🔒 | 部分更新评论 |
| PUT | `/api/opportunities/comment/{id}/` | 🔒 | 全量更新 |
| DELETE | `/api/opportunities/{id}/` | 🔒 | 删除 |
| GET | `/api/opportunities/{id}/` | 🔒 | 获取详情 |
| PATCH | `/api/opportunities/{id}/` | 🔒 | 部分更新商机 |
| POST | `/api/opportunities/{id}/` | 🔒 | 编辑商机详情（含附件/评论） |
| PUT | `/api/opportunities/{id}/` | 🔒 | 新建商机 |
| GET | `/api/opportunities/{opportunity_id}/line-items/` | 🔒 | List all line items for an opportunity |
| POST | `/api/opportunities/{opportunity_id}/line-items/` | 🔒 | Create a new line item for an opportunity |
| DELETE | `/api/opportunities/{opportunity_id}/line-items/{line_item_id}/` | 🔒 | Delete a line item |
| GET | `/api/opportunities/{opportunity_id}/line-items/{line_item_id}/` | 🔒 | Retrieve a single line item |
| PUT | `/api/opportunities/{opportunity_id}/line-items/{line_item_id}/` | 🔒 | Update a line item |

## 端点详情

### GET `/api/opportunities/` 🔒

列表查询

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `account` | query | string | — | — |
| `lead_source` | query | string | — | — |
| `name` | query | string | — | — |
| `org` | header | string | — | — |
| `stage` | query | string | — | — |
| `tags` | query | string | — | — |

**200** → `opportunities`

> ✅ 后端实测: 自定义 dict（OpenAPI 未标注）；顶层字段: accounts_list, contacts_list, currency, lead_source, offset, opportunities, opportunities_count, page_number, per_page, stage, tags

**Schema: `opportunities → 响应（后端实测）`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `per_page` | integer | — | — | — |
| `page_number` | [string] | — | — | — |
| `opportunities_count` | integer | — | — | — |
| `offset` | integer | — | — | — |
| `opportunities` | [object] | — | — | — |
| `accounts_list` | [object] | — | — | — |
| `contacts_list` | [object] | — | — | — |
| `tags` | [object] | — | — | — |
| `stage` | [array] | — | — | — |
| `lead_source` | [array] | — | — | — |
| `currency` | [array] | — | — | — |

**可能的错误响应（DRF 标准）**

- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）
- **400**: 请求参数校验失败（query/header/body 不合法）

---
### POST `/api/opportunities/` 🔒

新建商机

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `org` | header | string | — | — |

**请求体** `application/json`

> 新建商机

**Schema: `OpportunityCreateSwaggerRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `name` | string | ✅ | Opportunity Name | ≤255字符 |
| `account` | string(uuid) | — | — | 可空 |
| `stage` | → StageEnum | — | — | — |
| `opportunity_type` | enum(OpportunityTypeEnum) | — | Type | 枚举: NEW_BUSINESS, EXISTING_BUSINESS, RENEWAL, UPSELL, CROSS_SELL; 可空 |
| `amount` | string(decimal) | — | — | 可空; 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `currency` | enum(CurrencyEnum) | — | — | 枚举: USD, EUR, GBP, INR, CAD, AUD, JPY, CNY, CHF, SGD, AED, BRL, MXN; 可空 |
| `probability` | integer(int64) | — | Probability (%) | 可空 |
| `closed_on` | string(date) | ✅ | — | — |
| `lead_source` | enum(LeadSourceEnum) | — | — | 枚举: NONE, CALL, EMAIL, EXISTING CUSTOMER, PARTNER, PUBLIC RELATIONS, CAMPAIGN, WEBSITE, OTHER; 可空 |
| `description` | string | — | Notes | 可空 |
| `assigned_to` | [string] | ✅ | — | — |
| `contacts` | [string] | ✅ | — | — |
| `teams` | [string] | ✅ | — | — |
| `tags` | [string] | — | — | — |

**200** → `OpportunityCreateResponse`

**Schema: `OpportunityCreateResponse`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `error` | boolean | ✅ | — | — |
| `message` | string | ✅ | — | — |

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### DELETE `/api/opportunities/attachment/{id}/` 🔒

删除

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**200** → `OpportunityAttachmentDeleteResponse`

**Schema: `OpportunityAttachmentDeleteResponse`**

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
### DELETE `/api/opportunities/comment/{id}/` 🔒

删除评论

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**200** → `OpportunityCommentDeleteResponse`

**Schema: `OpportunityCommentDeleteResponse`**

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
### PATCH `/api/opportunities/comment/{id}/` 🔒

部分更新评论

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**请求体** `application/json`

**Schema: `PatchedOpportunityCommentEditSwaggerRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `comment` | string | — | — | — |

**200** → `OpportunityCommentPatchResponse`

**Schema: `OpportunityCommentPatchResponse`**

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
### PUT `/api/opportunities/comment/{id}/` 🔒

全量更新

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**请求体** `application/json`

**Schema: `OpportunityCommentEditSwaggerRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `comment` | string | ✅ | — | — |

**200** → `OpportunityCommentUpdateResponse`

**Schema: `OpportunityCommentUpdateResponse`**

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
### DELETE `/api/opportunities/{id}/` 🔒

删除

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**200** → `OpportunityDetailDeleteResponse`

**Schema: `OpportunityDetailDeleteResponse`**

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
### GET `/api/opportunities/{id}/` 🔒

获取详情

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**200** → `OpportunityDetailResponse`

**Schema: `OpportunityDetailResponse`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `opportunity_obj` | → Opportunity | ✅ | — | — |
| `opportunity_obj.id` | string(uuid) | ✅ | — | 只读 |
| `opportunity_obj.name` | string | ✅ | Opportunity Name | ≤255字符 |
| `opportunity_obj.account` | → Account | ✅ | — | — |
| `opportunity_obj.account.id` | string(uuid) | ✅ | — | 只读 |
| `opportunity_obj.account.name` | string | ✅ | Account Name | ≤255字符 |
| `opportunity_obj.account.email` | string(email) | — | — | 可空; ≤254字符 |
| `opportunity_obj.account.phone` | string | — | — | 可空; ≤25字符; 正则: ^[\d\s\-\(\)\+\.]{7,25}$ |
| `opportunity_obj.account.website` | string(uri) | — | — | 可空; ≤200字符 |
| `opportunity_obj.account.industry` | enum(IndustryEnum) | — | — | 枚举: ADVERTISING, AGRICULTURE, APPAREL & ACCESSORIES, AUTOMOTIVE, BANKING, BIOTECHNOLOGY, BUILDING MATERIALS & EQUIPMENT, CHEMICAL, COMPUTER, EDUCATION, ELECTRONICS, ENERGY, ENTERTAINMENT & LEISURE, FINANCE, FOOD & BEVERAGE, GROCERY, HEALTHCARE, INSURANCE, LEGAL, MANUFACTURING, PUBLISHING, REAL ESTATE, SERVICE, SOFTWARE, SPORTS, TECHNOLOGY, TELECOMMUNICATIONS, TELEVISION, TRANSPORTATION, VENTURE CAPITAL; 可空 |
| `opportunity_obj.account.number_of_employees` | integer(int64) | — | — | 可空 |
| `opportunity_obj.account.annual_revenue` | string(decimal) | — | — | 可空; 正则: ^-?\d{0,13}(?:\.\d{0,2})?$ |
| `opportunity_obj.account.currency` | enum(CurrencyEnum) | — | — | 枚举: USD, EUR, GBP, INR, CAD, AUD, JPY, CNY, CHF, SGD, AED, BRL, MXN; 可空 |
| `opportunity_obj.account.address_line` | string | — | Address | 可空; ≤255字符 |
| `opportunity_obj.account.city` | string | — | — | 可空; ≤255字符 |
| `opportunity_obj.account.state` | string | — | — | 可空; ≤255字符 |
| `opportunity_obj.account.postcode` | string | — | Postal Code | 可空; ≤64字符 |
| `opportunity_obj.account.country` | enum(ClientCountryEnum) | — | — | 枚举: GB, AF, AX, AL, DZ, AS, AD, AO, AI, AQ, AG, AR, AM, AW, AU, AT, AZ, BS, BH, BD, BB, BY, BE, BZ, BJ, BM, BT, BO, BA, BW, BV, BR, IO, BN, BG, BF, BI, KH, CM, CA, CV, KY, CF, TD, CL, CN, CX, CC, CO, KM, CG, CD, CK, CR, CI, HR, CU, CY, CZ, DK, DJ, DM, DO, EC, EG, SV, GQ, ER, EE, ET, FK, FO, FJ, FI, FR, GF, PF, TF, GA, GM, GE, DE, GH, GI, GR, GL, GD, GP, GU, GT, GG, GN, GW, GY, HT, HM, VA, HN, HK, HU, IS, IN, ID, IR, IQ, IE, IM, IL, IT, JM, JP, JE, JO, KZ, KE, KI, KP, KR, KW, KG, LA, LV, LB, LS, LR, LY, LI, LT, LU, MO, MK, MG, MW, MY, MV, ML, MT, MH, MQ, MR, MU, YT, MX, FM, MD, MC, MN, ME, MS, MA, MZ, MM, NA, NR, NP, NL, AN, NC, NZ, NI, NE, NG, NU, NF, MP, NO, OM, PK, PW, PS, PA, PG, PY, PE, PH, PN, PL, PT, PR, QA, RE, RO, RU, RW, BL, SH, KN, LC, MF, PM, VC, WS, SM, ST, SA, SN, RS, SC, SL, SG, SK, SI, SB, SO, ZA, GS, ES, LK, SD, SR, SJ, SZ, SE, CH, SY, TW, TJ, TZ, TH, TL, TG, TK, TO, TT, TN, TR, TM, TC, TV, UG, UA, AE, US, UM, UY, UZ, VU, VE, VN, VG, VI, WF, EH, YE, ZM, ZW; 可空 |
| `opportunity_obj.account.country_display` | string | ✅ | — | 只读 |
| `opportunity_obj.account.assigned_to` | [Profile] | ✅ | — | 只读 |
| `opportunity_obj.account.assigned_to[].id` | string(uuid) | ✅ | — | 只读 |
| `opportunity_obj.account.assigned_to[].user_details` | object | ✅ | — | 只读 |
| `opportunity_obj.account.assigned_to[].role` | → ProfileRoleEnum | — | — | — |
| `opportunity_obj.account.assigned_to[].address` | string(uuid) | — | — | 可空 |
| `opportunity_obj.account.assigned_to[].has_marketing_access` | boolean | — | — | — |
| `opportunity_obj.account.assigned_to[].has_sales_access` | boolean | — | — | — |
| `opportunity_obj.account.assigned_to[].phone` | string | — | — | 可空; ≤20字符 |
| `opportunity_obj.account.assigned_to[].date_of_joining` | string(date) | — | — | 可空 |
| `opportunity_obj.account.assigned_to[].is_active` | boolean | — | — | — |
| `opportunity_obj.account.assigned_to[].created_at` | string(date-time) | ✅ | — | 只读 |
| `opportunity_obj.account.teams` | [Teams] | ✅ | — | 只读 |
| `opportunity_obj.account.teams[].id` | string(uuid) | ✅ | — | 只读 |
| `opportunity_obj.account.teams[].name` | string | ✅ | — | ≤100字符 |
| `opportunity_obj.account.teams[].description` | string | ✅ | — | — |
| `opportunity_obj.account.teams[].users` | [Profile] | ✅ | — | 只读 |
| `opportunity_obj.account.teams[].users[].id` | string(uuid) | ✅ | — | 只读 |
| `opportunity_obj.account.teams[].users[].user_details` | object | ✅ | — | 只读 |
| `opportunity_obj.account.teams[].users[].role` | → ProfileRoleEnum | — | — | — |
| `opportunity_obj.account.teams[].users[].address` | string(uuid) | — | — | 可空 |
| `opportunity_obj.account.teams[].users[].has_marketing_access` | boolean | — | — | — |
| `opportunity_obj.account.teams[].users[].has_sales_access` | boolean | — | — | — |
| `opportunity_obj.account.teams[].users[].phone` | string | — | — | 可空; ≤20字符 |
| `opportunity_obj.account.teams[].users[].date_of_joining` | string(date) | — | — | 可空 |
| `opportunity_obj.account.teams[].users[].is_active` | boolean | — | — | — |
| `opportunity_obj.account.teams[].users[].created_at` | string(date-time) | ✅ | — | 只读 |
| `opportunity_obj.account.teams[].created_at` | string(date-time) | ✅ | — | 只读 |
| `opportunity_obj.account.teams[].created_by` | → User | ✅ | — | — |
| `opportunity_obj.account.teams[].created_by.id` | string(uuid) | ✅ | — | 只读 |
| `opportunity_obj.account.teams[].created_by.email` | string(email) | — | Email address | ≤254字符 |
| `opportunity_obj.account.teams[].created_by.profile_pic` | string | — | — | 可空; ≤1000字符 |
| `opportunity_obj.account.contacts` | [Contact] | ✅ | — | 只读 |
| `opportunity_obj.account.contacts[].id` | string(uuid) | ✅ | — | 只读 |
| `opportunity_obj.account.contacts[].first_name` | string | ✅ | — | ≤255字符 |
| `opportunity_obj.account.contacts[].last_name` | string | ✅ | — | ≤255字符 |
| `opportunity_obj.account.contacts[].email` | string(email) | — | — | 可空; ≤254字符 |
| `opportunity_obj.account.contacts[].phone` | string | — | — | 可空; ≤25字符; 正则: ^[\d\s\-\(\)\+\.]{7,25}$ |
| `opportunity_obj.account.contacts[].organization` | string | — | Company | 可空; ≤255字符 |
| `opportunity_obj.account.contacts[].title` | string | — | Job Title | 可空; ≤255字符 |
| `opportunity_obj.account.contacts[].department` | string | — | — | 可空; ≤255字符 |
| `opportunity_obj.account.contacts[].do_not_call` | boolean | — | — | — |
| `opportunity_obj.account.contacts[].linkedin_url` | string(uri) | — | — | 可空; ≤200字符 |
| `opportunity_obj.account.contacts[].address_line` | string | — | Address | 可空; ≤255字符 |
| `opportunity_obj.account.contacts[].city` | string | — | — | 可空; ≤255字符 |
| `opportunity_obj.account.contacts[].state` | string | — | — | 可空; ≤255字符 |
| `opportunity_obj.account.contacts[].postcode` | string | — | Postal Code | 可空; ≤64字符 |
| `opportunity_obj.account.contacts[].country` | enum(ClientCountryEnum) | — | — | 枚举: GB, AF, AX, AL, DZ, AS, AD, AO, AI, AQ, AG, AR, AM, AW, AU, AT, AZ, BS, BH, BD, BB, BY, BE, BZ, BJ, BM, BT, BO, BA, BW, BV, BR, IO, BN, BG, BF, BI, KH, CM, CA, CV, KY, CF, TD, CL, CN, CX, CC, CO, KM, CG, CD, CK, CR, CI, HR, CU, CY, CZ, DK, DJ, DM, DO, EC, EG, SV, GQ, ER, EE, ET, FK, FO, FJ, FI, FR, GF, PF, TF, GA, GM, GE, DE, GH, GI, GR, GL, GD, GP, GU, GT, GG, GN, GW, GY, HT, HM, VA, HN, HK, HU, IS, IN, ID, IR, IQ, IE, IM, IL, IT, JM, JP, JE, JO, KZ, KE, KI, KP, KR, KW, KG, LA, LV, LB, LS, LR, LY, LI, LT, LU, MO, MK, MG, MW, MY, MV, ML, MT, MH, MQ, MR, MU, YT, MX, FM, MD, MC, MN, ME, MS, MA, MZ, MM, NA, NR, NP, NL, AN, NC, NZ, NI, NE, NG, NU, NF, MP, NO, OM, PK, PW, PS, PA, PG, PY, PE, PH, PN, PL, PT, PR, QA, RE, RO, RU, RW, BL, SH, KN, LC, MF, PM, VC, WS, SM, ST, SA, SN, RS, SC, SL, SG, SK, SI, SB, SO, ZA, GS, ES, LK, SD, SR, SJ, SZ, SE, CH, SY, TW, TJ, TZ, TH, TL, TG, TK, TO, TT, TN, TR, TM, TC, TV, UG, UA, AE, US, UM, UY, UZ, VU, VE, VN, VG, VI, WF, EH, YE, ZM, ZW; 可空 |
| `opportunity_obj.account.contacts[].assigned_to` | [Profile] | ✅ | — | 只读 |
| `opportunity_obj.account.contacts[].assigned_to[].id` | string(uuid) | ✅ | — | 只读 |
| `opportunity_obj.account.contacts[].assigned_to[].user_details` | object | ✅ | — | 只读 |
| `opportunity_obj.account.contacts[].assigned_to[].role` | → ProfileRoleEnum | — | — | — |
| `opportunity_obj.account.contacts[].assigned_to[].address` | string(uuid) | — | — | 可空 |
| `opportunity_obj.account.contacts[].assigned_to[].has_marketing_access` | boolean | — | — | — |
| `opportunity_obj.account.contacts[].assigned_to[].has_sales_access` | boolean | — | — | — |
| `opportunity_obj.account.contacts[].assigned_to[].phone` | string | — | — | 可空; ≤20字符 |
| `opportunity_obj.account.contacts[].assigned_to[].date_of_joining` | string(date) | — | — | 可空 |
| `opportunity_obj.account.contacts[].assigned_to[].is_active` | boolean | — | — | — |
| `opportunity_obj.account.contacts[].assigned_to[].created_at` | string(date-time) | ✅ | — | 只读 |
| `opportunity_obj.account.contacts[].teams` | [Teams] | ✅ | — | 只读 |
| `opportunity_obj.account.contacts[].teams[].id` | string(uuid) | ✅ | — | 只读 |
| `opportunity_obj.account.contacts[].teams[].name` | string | ✅ | — | ≤100字符 |
| `opportunity_obj.account.contacts[].teams[].description` | string | ✅ | — | — |
| `opportunity_obj.account.contacts[].teams[].users` | [Profile] | ✅ | — | 只读 |
| `opportunity_obj.account.contacts[].teams[].users[].id` | string(uuid) | ✅ | — | 只读 |
| `opportunity_obj.account.contacts[].teams[].users[].user_details` | object | ✅ | — | 只读 |
| `opportunity_obj.account.contacts[].teams[].users[].role` | → ProfileRoleEnum | — | — | — |
| `opportunity_obj.account.contacts[].teams[].users[].address` | string(uuid) | — | — | 可空 |
| `opportunity_obj.account.contacts[].teams[].users[].has_marketing_access` | boolean | — | — | — |
| `opportunity_obj.account.contacts[].teams[].users[].has_sales_access` | boolean | — | — | — |
| `opportunity_obj.account.contacts[].teams[].users[].phone` | string | — | — | 可空; ≤20字符 |
| `opportunity_obj.account.contacts[].teams[].users[].date_of_joining` | string(date) | — | — | 可空 |
| `opportunity_obj.account.contacts[].teams[].users[].is_active` | boolean | — | — | — |
| `opportunity_obj.account.contacts[].teams[].users[].created_at` | string(date-time) | ✅ | — | 只读 |
| `opportunity_obj.account.contacts[].teams[].created_at` | string(date-time) | ✅ | — | 只读 |
| `opportunity_obj.account.contacts[].teams[].created_by` | → User | ✅ | — | — |
| `opportunity_obj.account.contacts[].teams[].created_by.id` | string(uuid) | ✅ | — | 只读 |
| `opportunity_obj.account.contacts[].teams[].created_by.email` | string(email) | — | Email address | ≤254字符 |
| `opportunity_obj.account.contacts[].teams[].created_by.profile_pic` | string | — | — | 可空; ≤1000字符 |
| `opportunity_obj.account.contacts[].tags` | [string] | — | — | — |
| `opportunity_obj.account.contacts[].description` | string | — | Notes | 可空 |
| `opportunity_obj.account.contacts[].created_by` | string(uuid) | — | — | 可空 |
| `opportunity_obj.account.contacts[].created_at` | string(date-time) | ✅ | — | 只读 |
| `opportunity_obj.account.contacts[].is_active` | boolean | — | — | — |
| `opportunity_obj.account.contacts[].org` | → Organization | ✅ | — | — |
| `opportunity_obj.account.contacts[].org.id` | string(uuid) | ✅ | — | 只读 |
| `opportunity_obj.account.contacts[].org.name` | string | — | — | 可空; ≤100字符 |
| `opportunity_obj.account.contacts[].org.api_key` | string | ✅ | — | 只读 |
| `opportunity_obj.account.contacts[].account` | string(uuid) | — | Primary account this contact belongs to | 可空 |
| `opportunity_obj.account.contacts[].contact_attachment` | [Attachments] | ✅ | — | 只读 |
| `opportunity_obj.account.contacts[].contact_attachment[].id` | string(uuid) | ✅ | — | 只读 |
| `opportunity_obj.account.contacts[].contact_attachment[].created_by` | string(uuid) | — | — | 可空 |
| `opportunity_obj.account.contacts[].contact_attachment[].file_name` | string | ✅ | — | ≤60字符 |
| `opportunity_obj.account.contacts[].contact_attachment[].created_at` | string(date-time) | ✅ | — | 只读 |
| `opportunity_obj.account.contacts[].contact_attachment[].file_path` | string | ✅ | — | 只读 |
| `opportunity_obj.account.contacts[].contact_attachment[].content_type` | string | ✅ | Python model class name | 只读 |
| `opportunity_obj.account.contacts[].contact_attachment[].object_id` | string(uuid) | ✅ | — | — |
| `opportunity_obj.account.contacts[].contact_attachment[].org` | string(uuid) | ✅ | — | — |
| `opportunity_obj.account.tags` | [Tags] | ✅ | — | 只读 |
| `opportunity_obj.account.tags[].id` | string(uuid) | ✅ | — | 只读 |
| `opportunity_obj.account.tags[].name` | string | ✅ | — | ≤50字符 |
| `opportunity_obj.account.tags[].slug` | string | ✅ | — | 只读 |
| `opportunity_obj.account.tags[].color` | → ColorEnum | — | — | — |
| `opportunity_obj.account.tags[].description` | string | — | — | — |
| `opportunity_obj.account.tags[].is_active` | boolean | — | — | — |
| `opportunity_obj.account.tags[].created_at` | string(date-time) | ✅ | — | 只读 |
| `opportunity_obj.account.description` | string | — | Notes | 可空 |
| `opportunity_obj.account.account_attachment` | [Attachments] | ✅ | — | 只读 |
| `opportunity_obj.account.account_attachment[].id` | string(uuid) | ✅ | — | 只读 |
| `opportunity_obj.account.account_attachment[].created_by` | string(uuid) | — | — | 可空 |
| `opportunity_obj.account.account_attachment[].file_name` | string | ✅ | — | ≤60字符 |
| `opportunity_obj.account.account_attachment[].created_at` | string(date-time) | ✅ | — | 只读 |
| `opportunity_obj.account.account_attachment[].file_path` | string | ✅ | — | 只读 |
| `opportunity_obj.account.account_attachment[].content_type` | string | ✅ | Python model class name | 只读 |
| `opportunity_obj.account.account_attachment[].object_id` | string(uuid) | ✅ | — | — |
| `opportunity_obj.account.account_attachment[].org` | string(uuid) | ✅ | — | — |
| `opportunity_obj.account.cases` | [any] | ✅ | Return cases linked to this account | 只读 |
| `opportunity_obj.account.tasks` | [any] | ✅ | Return tasks linked to this account | 只读 |
| `opportunity_obj.account.opportunities` | [any] | ✅ | Return opportunities linked to this account | 只读 |
| `opportunity_obj.account.created_by` | → User | ✅ | — | — |
| `opportunity_obj.account.created_by.id` | string(uuid) | ✅ | — | 只读 |
| `opportunity_obj.account.created_by.email` | string(email) | — | Email address | ≤254字符 |
| `opportunity_obj.account.created_by.profile_pic` | string | — | — | 可空; ≤1000字符 |
| `opportunity_obj.account.created_at` | string(date-time) | ✅ | — | 只读 |
| `opportunity_obj.account.is_active` | boolean | — | — | — |
| `opportunity_obj.account.org` | → Organization | ✅ | — | — |
| `opportunity_obj.account.org.id` | string(uuid) | ✅ | — | 只读 |
| `opportunity_obj.account.org.name` | string | — | — | 可空; ≤100字符 |
| `opportunity_obj.account.org.api_key` | string | ✅ | — | 只读 |
| `opportunity_obj.stage` | → StageEnum | — | — | — |
| `opportunity_obj.opportunity_type` | enum(OpportunityTypeEnum) | — | Type | 枚举: NEW_BUSINESS, EXISTING_BUSINESS, RENEWAL, UPSELL, CROSS_SELL; 可空 |
| `opportunity_obj.currency` | enum(CurrencyEnum) | — | — | 枚举: USD, EUR, GBP, INR, CAD, AUD, JPY, CNY, CHF, SGD, AED, BRL, MXN; 可空 |
| `opportunity_obj.amount` | string(decimal) | — | — | 可空; 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `opportunity_obj.amount_source` | → AmountSourceEnum | — | — | — |
| `opportunity_obj.probability` | integer(int64) | — | Probability (%) | 可空 |
| `opportunity_obj.closed_on` | string(date) | — | Expected Close Date | 可空 |
| `opportunity_obj.lead_source` | enum(LeadSourceEnum) | — | — | 枚举: NONE, CALL, EMAIL, EXISTING CUSTOMER, PARTNER, PUBLIC RELATIONS, CAMPAIGN, WEBSITE, OTHER; 可空 |
| `opportunity_obj.contacts` | [Contact] | ✅ | — | 只读 |
| `opportunity_obj.contacts[].id` | string(uuid) | ✅ | — | 只读 |
| `opportunity_obj.contacts[].first_name` | string | ✅ | — | ≤255字符 |
| `opportunity_obj.contacts[].last_name` | string | ✅ | — | ≤255字符 |
| `opportunity_obj.contacts[].email` | string(email) | — | — | 可空; ≤254字符 |
| `opportunity_obj.contacts[].phone` | string | — | — | 可空; ≤25字符; 正则: ^[\d\s\-\(\)\+\.]{7,25}$ |
| `opportunity_obj.contacts[].organization` | string | — | Company | 可空; ≤255字符 |
| `opportunity_obj.contacts[].title` | string | — | Job Title | 可空; ≤255字符 |
| `opportunity_obj.contacts[].department` | string | — | — | 可空; ≤255字符 |
| `opportunity_obj.contacts[].do_not_call` | boolean | — | — | — |
| `opportunity_obj.contacts[].linkedin_url` | string(uri) | — | — | 可空; ≤200字符 |
| `opportunity_obj.contacts[].address_line` | string | — | Address | 可空; ≤255字符 |
| `opportunity_obj.contacts[].city` | string | — | — | 可空; ≤255字符 |
| `opportunity_obj.contacts[].state` | string | — | — | 可空; ≤255字符 |
| `opportunity_obj.contacts[].postcode` | string | — | Postal Code | 可空; ≤64字符 |
| `opportunity_obj.contacts[].country` | enum(ClientCountryEnum) | — | — | 枚举: GB, AF, AX, AL, DZ, AS, AD, AO, AI, AQ, AG, AR, AM, AW, AU, AT, AZ, BS, BH, BD, BB, BY, BE, BZ, BJ, BM, BT, BO, BA, BW, BV, BR, IO, BN, BG, BF, BI, KH, CM, CA, CV, KY, CF, TD, CL, CN, CX, CC, CO, KM, CG, CD, CK, CR, CI, HR, CU, CY, CZ, DK, DJ, DM, DO, EC, EG, SV, GQ, ER, EE, ET, FK, FO, FJ, FI, FR, GF, PF, TF, GA, GM, GE, DE, GH, GI, GR, GL, GD, GP, GU, GT, GG, GN, GW, GY, HT, HM, VA, HN, HK, HU, IS, IN, ID, IR, IQ, IE, IM, IL, IT, JM, JP, JE, JO, KZ, KE, KI, KP, KR, KW, KG, LA, LV, LB, LS, LR, LY, LI, LT, LU, MO, MK, MG, MW, MY, MV, ML, MT, MH, MQ, MR, MU, YT, MX, FM, MD, MC, MN, ME, MS, MA, MZ, MM, NA, NR, NP, NL, AN, NC, NZ, NI, NE, NG, NU, NF, MP, NO, OM, PK, PW, PS, PA, PG, PY, PE, PH, PN, PL, PT, PR, QA, RE, RO, RU, RW, BL, SH, KN, LC, MF, PM, VC, WS, SM, ST, SA, SN, RS, SC, SL, SG, SK, SI, SB, SO, ZA, GS, ES, LK, SD, SR, SJ, SZ, SE, CH, SY, TW, TJ, TZ, TH, TL, TG, TK, TO, TT, TN, TR, TM, TC, TV, UG, UA, AE, US, UM, UY, UZ, VU, VE, VN, VG, VI, WF, EH, YE, ZM, ZW; 可空 |
| `opportunity_obj.contacts[].assigned_to` | [Profile] | ✅ | — | 只读 |
| `opportunity_obj.contacts[].assigned_to[].id` | string(uuid) | ✅ | — | 只读 |
| `opportunity_obj.contacts[].assigned_to[].user_details` | object | ✅ | — | 只读 |
| `opportunity_obj.contacts[].assigned_to[].role` | → ProfileRoleEnum | — | — | — |
| `opportunity_obj.contacts[].assigned_to[].address` | string(uuid) | — | — | 可空 |
| `opportunity_obj.contacts[].assigned_to[].has_marketing_access` | boolean | — | — | — |
| `opportunity_obj.contacts[].assigned_to[].has_sales_access` | boolean | — | — | — |
| `opportunity_obj.contacts[].assigned_to[].phone` | string | — | — | 可空; ≤20字符 |
| `opportunity_obj.contacts[].assigned_to[].date_of_joining` | string(date) | — | — | 可空 |
| `opportunity_obj.contacts[].assigned_to[].is_active` | boolean | — | — | — |
| `opportunity_obj.contacts[].assigned_to[].created_at` | string(date-time) | ✅ | — | 只读 |
| `opportunity_obj.contacts[].teams` | [Teams] | ✅ | — | 只读 |
| `opportunity_obj.contacts[].teams[].id` | string(uuid) | ✅ | — | 只读 |
| `opportunity_obj.contacts[].teams[].name` | string | ✅ | — | ≤100字符 |
| `opportunity_obj.contacts[].teams[].description` | string | ✅ | — | — |
| `opportunity_obj.contacts[].teams[].users` | [Profile] | ✅ | — | 只读 |
| `opportunity_obj.contacts[].teams[].users[].id` | string(uuid) | ✅ | — | 只读 |
| `opportunity_obj.contacts[].teams[].users[].user_details` | object | ✅ | — | 只读 |
| `opportunity_obj.contacts[].teams[].users[].role` | → ProfileRoleEnum | — | — | — |
| `opportunity_obj.contacts[].teams[].users[].address` | string(uuid) | — | — | 可空 |
| `opportunity_obj.contacts[].teams[].users[].has_marketing_access` | boolean | — | — | — |
| `opportunity_obj.contacts[].teams[].users[].has_sales_access` | boolean | — | — | — |
| `opportunity_obj.contacts[].teams[].users[].phone` | string | — | — | 可空; ≤20字符 |
| `opportunity_obj.contacts[].teams[].users[].date_of_joining` | string(date) | — | — | 可空 |
| `opportunity_obj.contacts[].teams[].users[].is_active` | boolean | — | — | — |
| `opportunity_obj.contacts[].teams[].users[].created_at` | string(date-time) | ✅ | — | 只读 |
| `opportunity_obj.contacts[].teams[].created_at` | string(date-time) | ✅ | — | 只读 |
| `opportunity_obj.contacts[].teams[].created_by` | → User | ✅ | — | — |
| `opportunity_obj.contacts[].teams[].created_by.id` | string(uuid) | ✅ | — | 只读 |
| `opportunity_obj.contacts[].teams[].created_by.email` | string(email) | — | Email address | ≤254字符 |
| `opportunity_obj.contacts[].teams[].created_by.profile_pic` | string | — | — | 可空; ≤1000字符 |
| `opportunity_obj.contacts[].tags` | [string] | — | — | — |
| `opportunity_obj.contacts[].description` | string | — | Notes | 可空 |
| `opportunity_obj.contacts[].created_by` | string(uuid) | — | — | 可空 |
| `opportunity_obj.contacts[].created_at` | string(date-time) | ✅ | — | 只读 |
| `opportunity_obj.contacts[].is_active` | boolean | — | — | — |
| `opportunity_obj.contacts[].org` | → Organization | ✅ | — | — |
| `opportunity_obj.contacts[].org.id` | string(uuid) | ✅ | — | 只读 |
| `opportunity_obj.contacts[].org.name` | string | — | — | 可空; ≤100字符 |
| `opportunity_obj.contacts[].org.api_key` | string | ✅ | — | 只读 |
| `opportunity_obj.contacts[].account` | string(uuid) | — | Primary account this contact belongs to | 可空 |
| `opportunity_obj.contacts[].contact_attachment` | [Attachments] | ✅ | — | 只读 |
| `opportunity_obj.contacts[].contact_attachment[].id` | string(uuid) | ✅ | — | 只读 |
| `opportunity_obj.contacts[].contact_attachment[].created_by` | string(uuid) | — | — | 可空 |
| `opportunity_obj.contacts[].contact_attachment[].file_name` | string | ✅ | — | ≤60字符 |
| `opportunity_obj.contacts[].contact_attachment[].created_at` | string(date-time) | ✅ | — | 只读 |
| `opportunity_obj.contacts[].contact_attachment[].file_path` | string | ✅ | — | 只读 |
| `opportunity_obj.contacts[].contact_attachment[].content_type` | string | ✅ | Python model class name | 只读 |
| `opportunity_obj.contacts[].contact_attachment[].object_id` | string(uuid) | ✅ | — | — |
| `opportunity_obj.contacts[].contact_attachment[].org` | string(uuid) | ✅ | — | — |
| `opportunity_obj.line_items` | [OpportunityLineItem] | ✅ | — | 只读 |
| `opportunity_obj.line_items[].id` | string(uuid) | ✅ | — | 只读 |
| `opportunity_obj.line_items[].product` | any | ✅ | — | 只读 |
| `opportunity_obj.line_items[].name` | string | — | Item Name | ≤255字符 |
| `opportunity_obj.line_items[].description` | string | — | — | ≤500字符 |
| `opportunity_obj.line_items[].quantity` | string(decimal) | — | — | 正则: ^-?\d{0,8}(?:\.\d{0,2})?$ |
| `opportunity_obj.line_items[].unit_price` | string(decimal) | — | — | 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `opportunity_obj.line_items[].discount_type` | enum(DiscountTypeEnum) | — | — | 枚举: PERCENTAGE, FIXED |
| `opportunity_obj.line_items[].discount_value` | string(decimal) | — | — | 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `opportunity_obj.line_items[].discount_amount` | string(decimal) | ✅ | — | 只读; 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `opportunity_obj.line_items[].subtotal` | string(decimal) | ✅ | — | 只读; 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `opportunity_obj.line_items[].total` | string(decimal) | ✅ | — | 只读; 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `opportunity_obj.line_items[].order` | integer(int64) | — | — | — |
| `opportunity_obj.line_items[].formatted_unit_price` | string | ✅ | — | 只读 |
| `opportunity_obj.line_items[].formatted_total` | string | ✅ | — | 只读 |
| `opportunity_obj.line_items[].created_at` | string(date-time) | ✅ | — | 只读 |
| `opportunity_obj.line_items[].updated_at` | string(date-time) | ✅ | Last Modified At | 只读 |
| `opportunity_obj.line_items_total` | number(double) | ✅ | Calculate total from line items | 只读 |
| `opportunity_obj.assigned_to` | [Profile] | ✅ | — | 只读 |
| `opportunity_obj.assigned_to[].id` | string(uuid) | ✅ | — | 只读 |
| `opportunity_obj.assigned_to[].user_details` | object | ✅ | — | 只读 |
| `opportunity_obj.assigned_to[].role` | → ProfileRoleEnum | — | — | — |
| `opportunity_obj.assigned_to[].address` | string(uuid) | — | — | 可空 |
| `opportunity_obj.assigned_to[].has_marketing_access` | boolean | — | — | — |
| `opportunity_obj.assigned_to[].has_sales_access` | boolean | — | — | — |
| `opportunity_obj.assigned_to[].phone` | string | — | — | 可空; ≤20字符 |
| `opportunity_obj.assigned_to[].date_of_joining` | string(date) | — | — | 可空 |
| `opportunity_obj.assigned_to[].is_active` | boolean | — | — | — |
| `opportunity_obj.assigned_to[].created_at` | string(date-time) | ✅ | — | 只读 |
| `opportunity_obj.teams` | [Teams] | ✅ | — | 只读 |
| `opportunity_obj.teams[].id` | string(uuid) | ✅ | — | 只读 |
| `opportunity_obj.teams[].name` | string | ✅ | — | ≤100字符 |
| `opportunity_obj.teams[].description` | string | ✅ | — | — |
| `opportunity_obj.teams[].users` | [Profile] | ✅ | — | 只读 |
| `opportunity_obj.teams[].users[].id` | string(uuid) | ✅ | — | 只读 |
| `opportunity_obj.teams[].users[].user_details` | object | ✅ | — | 只读 |
| `opportunity_obj.teams[].users[].role` | → ProfileRoleEnum | — | — | — |
| `opportunity_obj.teams[].users[].address` | string(uuid) | — | — | 可空 |
| `opportunity_obj.teams[].users[].has_marketing_access` | boolean | — | — | — |
| `opportunity_obj.teams[].users[].has_sales_access` | boolean | — | — | — |
| `opportunity_obj.teams[].users[].phone` | string | — | — | 可空; ≤20字符 |
| `opportunity_obj.teams[].users[].date_of_joining` | string(date) | — | — | 可空 |
| `opportunity_obj.teams[].users[].is_active` | boolean | — | — | — |
| `opportunity_obj.teams[].users[].created_at` | string(date-time) | ✅ | — | 只读 |
| `opportunity_obj.teams[].created_at` | string(date-time) | ✅ | — | 只读 |
| `opportunity_obj.teams[].created_by` | → User | ✅ | — | — |
| `opportunity_obj.teams[].created_by.id` | string(uuid) | ✅ | — | 只读 |
| `opportunity_obj.teams[].created_by.email` | string(email) | — | Email address | ≤254字符 |
| `opportunity_obj.teams[].created_by.profile_pic` | string | — | — | 可空; ≤1000字符 |
| `opportunity_obj.closed_by` | → Profile | ✅ | — | — |
| `opportunity_obj.closed_by.id` | string(uuid) | ✅ | — | 只读 |
| `opportunity_obj.closed_by.user_details` | object | ✅ | — | 只读 |
| `opportunity_obj.closed_by.role` | → ProfileRoleEnum | — | — | — |
| `opportunity_obj.closed_by.address` | string(uuid) | — | — | 可空 |
| `opportunity_obj.closed_by.has_marketing_access` | boolean | — | — | — |
| `opportunity_obj.closed_by.has_sales_access` | boolean | — | — | — |
| `opportunity_obj.closed_by.phone` | string | — | — | 可空; ≤20字符 |
| `opportunity_obj.closed_by.date_of_joining` | string(date) | — | — | 可空 |
| `opportunity_obj.closed_by.is_active` | boolean | — | — | — |
| `opportunity_obj.closed_by.created_at` | string(date-time) | ✅ | — | 只读 |
| `opportunity_obj.tags` | [Tags] | ✅ | — | 只读 |
| `opportunity_obj.tags[].id` | string(uuid) | ✅ | — | 只读 |
| `opportunity_obj.tags[].name` | string | ✅ | — | ≤50字符 |
| `opportunity_obj.tags[].slug` | string | ✅ | — | 只读 |
| `opportunity_obj.tags[].color` | → ColorEnum | — | — | — |
| `opportunity_obj.tags[].description` | string | — | — | — |
| `opportunity_obj.tags[].is_active` | boolean | — | — | — |
| `opportunity_obj.tags[].created_at` | string(date-time) | ✅ | — | 只读 |
| `opportunity_obj.description` | string | — | Notes | 可空 |
| `opportunity_obj.created_by` | → User | ✅ | — | — |
| `opportunity_obj.created_by.id` | string(uuid) | ✅ | — | 只读 |
| `opportunity_obj.created_by.email` | string(email) | — | Email address | ≤254字符 |
| `opportunity_obj.created_by.profile_pic` | string | — | — | 可空; ≤1000字符 |
| `opportunity_obj.created_at` | string(date-time) | ✅ | — | 只读 |
| `opportunity_obj.is_active` | boolean | — | — | — |
| `opportunity_obj.org` | → Organization | ✅ | — | — |
| `opportunity_obj.org.id` | string(uuid) | ✅ | — | 只读 |
| `opportunity_obj.org.name` | string | — | — | 可空; ≤100字符 |
| `opportunity_obj.org.api_key` | string | ✅ | — | 只读 |
| `opportunity_obj.created_on_arrow` | string | ✅ | — | 只读 |
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
| `contacts` | [Contact] | ✅ | — | — |
| `contacts[].id` | string(uuid) | ✅ | — | 只读 |
| `contacts[].first_name` | string | ✅ | — | ≤255字符 |
| `contacts[].last_name` | string | ✅ | — | ≤255字符 |
| `contacts[].email` | string(email) | — | — | 可空; ≤254字符 |
| `contacts[].phone` | string | — | — | 可空; ≤25字符; 正则: ^[\d\s\-\(\)\+\.]{7,25}$ |
| `contacts[].organization` | string | — | Company | 可空; ≤255字符 |
| `contacts[].title` | string | — | Job Title | 可空; ≤255字符 |
| `contacts[].department` | string | — | — | 可空; ≤255字符 |
| `contacts[].do_not_call` | boolean | — | — | — |
| `contacts[].linkedin_url` | string(uri) | — | — | 可空; ≤200字符 |
| `contacts[].address_line` | string | — | Address | 可空; ≤255字符 |
| `contacts[].city` | string | — | — | 可空; ≤255字符 |
| `contacts[].state` | string | — | — | 可空; ≤255字符 |
| `contacts[].postcode` | string | — | Postal Code | 可空; ≤64字符 |
| `contacts[].country` | enum(ClientCountryEnum) | — | — | 枚举: GB, AF, AX, AL, DZ, AS, AD, AO, AI, AQ, AG, AR, AM, AW, AU, AT, AZ, BS, BH, BD, BB, BY, BE, BZ, BJ, BM, BT, BO, BA, BW, BV, BR, IO, BN, BG, BF, BI, KH, CM, CA, CV, KY, CF, TD, CL, CN, CX, CC, CO, KM, CG, CD, CK, CR, CI, HR, CU, CY, CZ, DK, DJ, DM, DO, EC, EG, SV, GQ, ER, EE, ET, FK, FO, FJ, FI, FR, GF, PF, TF, GA, GM, GE, DE, GH, GI, GR, GL, GD, GP, GU, GT, GG, GN, GW, GY, HT, HM, VA, HN, HK, HU, IS, IN, ID, IR, IQ, IE, IM, IL, IT, JM, JP, JE, JO, KZ, KE, KI, KP, KR, KW, KG, LA, LV, LB, LS, LR, LY, LI, LT, LU, MO, MK, MG, MW, MY, MV, ML, MT, MH, MQ, MR, MU, YT, MX, FM, MD, MC, MN, ME, MS, MA, MZ, MM, NA, NR, NP, NL, AN, NC, NZ, NI, NE, NG, NU, NF, MP, NO, OM, PK, PW, PS, PA, PG, PY, PE, PH, PN, PL, PT, PR, QA, RE, RO, RU, RW, BL, SH, KN, LC, MF, PM, VC, WS, SM, ST, SA, SN, RS, SC, SL, SG, SK, SI, SB, SO, ZA, GS, ES, LK, SD, SR, SJ, SZ, SE, CH, SY, TW, TJ, TZ, TH, TL, TG, TK, TO, TT, TN, TR, TM, TC, TV, UG, UA, AE, US, UM, UY, UZ, VU, VE, VN, VG, VI, WF, EH, YE, ZM, ZW; 可空 |
| `contacts[].assigned_to` | [Profile] | ✅ | — | 只读 |
| `contacts[].assigned_to[].id` | string(uuid) | ✅ | — | 只读 |
| `contacts[].assigned_to[].user_details` | object | ✅ | — | 只读 |
| `contacts[].assigned_to[].role` | → ProfileRoleEnum | — | — | — |
| `contacts[].assigned_to[].address` | string(uuid) | — | — | 可空 |
| `contacts[].assigned_to[].has_marketing_access` | boolean | — | — | — |
| `contacts[].assigned_to[].has_sales_access` | boolean | — | — | — |
| `contacts[].assigned_to[].phone` | string | — | — | 可空; ≤20字符 |
| `contacts[].assigned_to[].date_of_joining` | string(date) | — | — | 可空 |
| `contacts[].assigned_to[].is_active` | boolean | — | — | — |
| `contacts[].assigned_to[].created_at` | string(date-time) | ✅ | — | 只读 |
| `contacts[].teams` | [Teams] | ✅ | — | 只读 |
| `contacts[].teams[].id` | string(uuid) | ✅ | — | 只读 |
| `contacts[].teams[].name` | string | ✅ | — | ≤100字符 |
| `contacts[].teams[].description` | string | ✅ | — | — |
| `contacts[].teams[].users` | [Profile] | ✅ | — | 只读 |
| `contacts[].teams[].users[].id` | string(uuid) | ✅ | — | 只读 |
| `contacts[].teams[].users[].user_details` | object | ✅ | — | 只读 |
| `contacts[].teams[].users[].role` | → ProfileRoleEnum | — | — | — |
| `contacts[].teams[].users[].address` | string(uuid) | — | — | 可空 |
| `contacts[].teams[].users[].has_marketing_access` | boolean | — | — | — |
| `contacts[].teams[].users[].has_sales_access` | boolean | — | — | — |
| `contacts[].teams[].users[].phone` | string | — | — | 可空; ≤20字符 |
| `contacts[].teams[].users[].date_of_joining` | string(date) | — | — | 可空 |
| `contacts[].teams[].users[].is_active` | boolean | — | — | — |
| `contacts[].teams[].users[].created_at` | string(date-time) | ✅ | — | 只读 |
| `contacts[].teams[].created_at` | string(date-time) | ✅ | — | 只读 |
| `contacts[].teams[].created_by` | → User | ✅ | — | — |
| `contacts[].teams[].created_by.id` | string(uuid) | ✅ | — | 只读 |
| `contacts[].teams[].created_by.email` | string(email) | — | Email address | ≤254字符 |
| `contacts[].teams[].created_by.profile_pic` | string | — | — | 可空; ≤1000字符 |
| `contacts[].tags` | [string] | — | — | — |
| `contacts[].description` | string | — | Notes | 可空 |
| `contacts[].created_by` | string(uuid) | — | — | 可空 |
| `contacts[].created_at` | string(date-time) | ✅ | — | 只读 |
| `contacts[].is_active` | boolean | — | — | — |
| `contacts[].org` | → Organization | ✅ | — | — |
| `contacts[].org.id` | string(uuid) | ✅ | — | 只读 |
| `contacts[].org.name` | string | — | — | 可空; ≤100字符 |
| `contacts[].org.api_key` | string | ✅ | — | 只读 |
| `contacts[].account` | string(uuid) | — | Primary account this contact belongs to | 可空 |
| `contacts[].contact_attachment` | [Attachments] | ✅ | — | 只读 |
| `contacts[].contact_attachment[].id` | string(uuid) | ✅ | — | 只读 |
| `contacts[].contact_attachment[].created_by` | string(uuid) | — | — | 可空 |
| `contacts[].contact_attachment[].file_name` | string | ✅ | — | ≤60字符 |
| `contacts[].contact_attachment[].created_at` | string(date-time) | ✅ | — | 只读 |
| `contacts[].contact_attachment[].file_path` | string | ✅ | — | 只读 |
| `contacts[].contact_attachment[].content_type` | string | ✅ | Python model class name | 只读 |
| `contacts[].contact_attachment[].object_id` | string(uuid) | ✅ | — | — |
| `contacts[].contact_attachment[].org` | string(uuid) | ✅ | — | — |
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
| `stage` | [any] | ✅ | — | — |
| `lead_source` | [any] | ✅ | — | — |
| `currency` | [any] | ✅ | — | — |
| `comment_permission` | boolean | ✅ | — | — |
| `users_mention` | [any] | ✅ | — | — |

**可能的错误响应（DRF 标准）**

- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）
- **400**: 请求参数校验失败（query/header/body 不合法）

---
### PATCH `/api/opportunities/{id}/` 🔒

部分更新商机

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**请求体** `application/json`

**Schema: `PatchedOpportunityCreateSwaggerRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `name` | string | — | Opportunity Name | ≤255字符 |
| `account` | string(uuid) | — | — | 可空 |
| `stage` | → StageEnum | — | — | — |
| `opportunity_type` | enum(OpportunityTypeEnum) | — | Type | 枚举: NEW_BUSINESS, EXISTING_BUSINESS, RENEWAL, UPSELL, CROSS_SELL; 可空 |
| `amount` | string(decimal) | — | — | 可空; 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `currency` | enum(CurrencyEnum) | — | — | 枚举: USD, EUR, GBP, INR, CAD, AUD, JPY, CNY, CHF, SGD, AED, BRL, MXN; 可空 |
| `probability` | integer(int64) | — | Probability (%) | 可空 |
| `closed_on` | string(date) | — | — | — |
| `lead_source` | enum(LeadSourceEnum) | — | — | 枚举: NONE, CALL, EMAIL, EXISTING CUSTOMER, PARTNER, PUBLIC RELATIONS, CAMPAIGN, WEBSITE, OTHER; 可空 |
| `description` | string | — | Notes | 可空 |
| `assigned_to` | [string] | — | — | — |
| `contacts` | [string] | — | — | — |
| `teams` | [string] | — | — | — |
| `tags` | [string] | — | — | — |

**200** → `OpportunityPatchResponse`

**Schema: `OpportunityPatchResponse`**

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
### POST `/api/opportunities/{id}/` 🔒

编辑商机详情（含附件/评论）

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**请求体** `application/json`

> 编辑商机详情（含附件/评论）

**Schema: `OpportunityDetailEditSwaggerRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `comment` | string | ✅ | — | — |

**200** → `OpportunityCommentAttachmentResponse`

**Schema: `OpportunityCommentAttachmentResponse`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `opportunity_obj` | → Opportunity | ✅ | — | — |
| `opportunity_obj.id` | string(uuid) | ✅ | — | 只读 |
| `opportunity_obj.name` | string | ✅ | Opportunity Name | ≤255字符 |
| `opportunity_obj.account` | → Account | ✅ | — | — |
| `opportunity_obj.account.id` | string(uuid) | ✅ | — | 只读 |
| `opportunity_obj.account.name` | string | ✅ | Account Name | ≤255字符 |
| `opportunity_obj.account.email` | string(email) | — | — | 可空; ≤254字符 |
| `opportunity_obj.account.phone` | string | — | — | 可空; ≤25字符; 正则: ^[\d\s\-\(\)\+\.]{7,25}$ |
| `opportunity_obj.account.website` | string(uri) | — | — | 可空; ≤200字符 |
| `opportunity_obj.account.industry` | enum(IndustryEnum) | — | — | 枚举: ADVERTISING, AGRICULTURE, APPAREL & ACCESSORIES, AUTOMOTIVE, BANKING, BIOTECHNOLOGY, BUILDING MATERIALS & EQUIPMENT, CHEMICAL, COMPUTER, EDUCATION, ELECTRONICS, ENERGY, ENTERTAINMENT & LEISURE, FINANCE, FOOD & BEVERAGE, GROCERY, HEALTHCARE, INSURANCE, LEGAL, MANUFACTURING, PUBLISHING, REAL ESTATE, SERVICE, SOFTWARE, SPORTS, TECHNOLOGY, TELECOMMUNICATIONS, TELEVISION, TRANSPORTATION, VENTURE CAPITAL; 可空 |
| `opportunity_obj.account.number_of_employees` | integer(int64) | — | — | 可空 |
| `opportunity_obj.account.annual_revenue` | string(decimal) | — | — | 可空; 正则: ^-?\d{0,13}(?:\.\d{0,2})?$ |
| `opportunity_obj.account.currency` | enum(CurrencyEnum) | — | — | 枚举: USD, EUR, GBP, INR, CAD, AUD, JPY, CNY, CHF, SGD, AED, BRL, MXN; 可空 |
| `opportunity_obj.account.address_line` | string | — | Address | 可空; ≤255字符 |
| `opportunity_obj.account.city` | string | — | — | 可空; ≤255字符 |
| `opportunity_obj.account.state` | string | — | — | 可空; ≤255字符 |
| `opportunity_obj.account.postcode` | string | — | Postal Code | 可空; ≤64字符 |
| `opportunity_obj.account.country` | enum(ClientCountryEnum) | — | — | 枚举: GB, AF, AX, AL, DZ, AS, AD, AO, AI, AQ, AG, AR, AM, AW, AU, AT, AZ, BS, BH, BD, BB, BY, BE, BZ, BJ, BM, BT, BO, BA, BW, BV, BR, IO, BN, BG, BF, BI, KH, CM, CA, CV, KY, CF, TD, CL, CN, CX, CC, CO, KM, CG, CD, CK, CR, CI, HR, CU, CY, CZ, DK, DJ, DM, DO, EC, EG, SV, GQ, ER, EE, ET, FK, FO, FJ, FI, FR, GF, PF, TF, GA, GM, GE, DE, GH, GI, GR, GL, GD, GP, GU, GT, GG, GN, GW, GY, HT, HM, VA, HN, HK, HU, IS, IN, ID, IR, IQ, IE, IM, IL, IT, JM, JP, JE, JO, KZ, KE, KI, KP, KR, KW, KG, LA, LV, LB, LS, LR, LY, LI, LT, LU, MO, MK, MG, MW, MY, MV, ML, MT, MH, MQ, MR, MU, YT, MX, FM, MD, MC, MN, ME, MS, MA, MZ, MM, NA, NR, NP, NL, AN, NC, NZ, NI, NE, NG, NU, NF, MP, NO, OM, PK, PW, PS, PA, PG, PY, PE, PH, PN, PL, PT, PR, QA, RE, RO, RU, RW, BL, SH, KN, LC, MF, PM, VC, WS, SM, ST, SA, SN, RS, SC, SL, SG, SK, SI, SB, SO, ZA, GS, ES, LK, SD, SR, SJ, SZ, SE, CH, SY, TW, TJ, TZ, TH, TL, TG, TK, TO, TT, TN, TR, TM, TC, TV, UG, UA, AE, US, UM, UY, UZ, VU, VE, VN, VG, VI, WF, EH, YE, ZM, ZW; 可空 |
| `opportunity_obj.account.country_display` | string | ✅ | — | 只读 |
| `opportunity_obj.account.assigned_to` | [Profile] | ✅ | — | 只读 |
| `opportunity_obj.account.assigned_to[].id` | string(uuid) | ✅ | — | 只读 |
| `opportunity_obj.account.assigned_to[].user_details` | object | ✅ | — | 只读 |
| `opportunity_obj.account.assigned_to[].role` | → ProfileRoleEnum | — | — | — |
| `opportunity_obj.account.assigned_to[].address` | string(uuid) | — | — | 可空 |
| `opportunity_obj.account.assigned_to[].has_marketing_access` | boolean | — | — | — |
| `opportunity_obj.account.assigned_to[].has_sales_access` | boolean | — | — | — |
| `opportunity_obj.account.assigned_to[].phone` | string | — | — | 可空; ≤20字符 |
| `opportunity_obj.account.assigned_to[].date_of_joining` | string(date) | — | — | 可空 |
| `opportunity_obj.account.assigned_to[].is_active` | boolean | — | — | — |
| `opportunity_obj.account.assigned_to[].created_at` | string(date-time) | ✅ | — | 只读 |
| `opportunity_obj.account.teams` | [Teams] | ✅ | — | 只读 |
| `opportunity_obj.account.teams[].id` | string(uuid) | ✅ | — | 只读 |
| `opportunity_obj.account.teams[].name` | string | ✅ | — | ≤100字符 |
| `opportunity_obj.account.teams[].description` | string | ✅ | — | — |
| `opportunity_obj.account.teams[].users` | [Profile] | ✅ | — | 只读 |
| `opportunity_obj.account.teams[].users[].id` | string(uuid) | ✅ | — | 只读 |
| `opportunity_obj.account.teams[].users[].user_details` | object | ✅ | — | 只读 |
| `opportunity_obj.account.teams[].users[].role` | → ProfileRoleEnum | — | — | — |
| `opportunity_obj.account.teams[].users[].address` | string(uuid) | — | — | 可空 |
| `opportunity_obj.account.teams[].users[].has_marketing_access` | boolean | — | — | — |
| `opportunity_obj.account.teams[].users[].has_sales_access` | boolean | — | — | — |
| `opportunity_obj.account.teams[].users[].phone` | string | — | — | 可空; ≤20字符 |
| `opportunity_obj.account.teams[].users[].date_of_joining` | string(date) | — | — | 可空 |
| `opportunity_obj.account.teams[].users[].is_active` | boolean | — | — | — |
| `opportunity_obj.account.teams[].users[].created_at` | string(date-time) | ✅ | — | 只读 |
| `opportunity_obj.account.teams[].created_at` | string(date-time) | ✅ | — | 只读 |
| `opportunity_obj.account.teams[].created_by` | → User | ✅ | — | — |
| `opportunity_obj.account.teams[].created_by.id` | string(uuid) | ✅ | — | 只读 |
| `opportunity_obj.account.teams[].created_by.email` | string(email) | — | Email address | ≤254字符 |
| `opportunity_obj.account.teams[].created_by.profile_pic` | string | — | — | 可空; ≤1000字符 |
| `opportunity_obj.account.contacts` | [Contact] | ✅ | — | 只读 |
| `opportunity_obj.account.contacts[].id` | string(uuid) | ✅ | — | 只读 |
| `opportunity_obj.account.contacts[].first_name` | string | ✅ | — | ≤255字符 |
| `opportunity_obj.account.contacts[].last_name` | string | ✅ | — | ≤255字符 |
| `opportunity_obj.account.contacts[].email` | string(email) | — | — | 可空; ≤254字符 |
| `opportunity_obj.account.contacts[].phone` | string | — | — | 可空; ≤25字符; 正则: ^[\d\s\-\(\)\+\.]{7,25}$ |
| `opportunity_obj.account.contacts[].organization` | string | — | Company | 可空; ≤255字符 |
| `opportunity_obj.account.contacts[].title` | string | — | Job Title | 可空; ≤255字符 |
| `opportunity_obj.account.contacts[].department` | string | — | — | 可空; ≤255字符 |
| `opportunity_obj.account.contacts[].do_not_call` | boolean | — | — | — |
| `opportunity_obj.account.contacts[].linkedin_url` | string(uri) | — | — | 可空; ≤200字符 |
| `opportunity_obj.account.contacts[].address_line` | string | — | Address | 可空; ≤255字符 |
| `opportunity_obj.account.contacts[].city` | string | — | — | 可空; ≤255字符 |
| `opportunity_obj.account.contacts[].state` | string | — | — | 可空; ≤255字符 |
| `opportunity_obj.account.contacts[].postcode` | string | — | Postal Code | 可空; ≤64字符 |
| `opportunity_obj.account.contacts[].country` | enum(ClientCountryEnum) | — | — | 枚举: GB, AF, AX, AL, DZ, AS, AD, AO, AI, AQ, AG, AR, AM, AW, AU, AT, AZ, BS, BH, BD, BB, BY, BE, BZ, BJ, BM, BT, BO, BA, BW, BV, BR, IO, BN, BG, BF, BI, KH, CM, CA, CV, KY, CF, TD, CL, CN, CX, CC, CO, KM, CG, CD, CK, CR, CI, HR, CU, CY, CZ, DK, DJ, DM, DO, EC, EG, SV, GQ, ER, EE, ET, FK, FO, FJ, FI, FR, GF, PF, TF, GA, GM, GE, DE, GH, GI, GR, GL, GD, GP, GU, GT, GG, GN, GW, GY, HT, HM, VA, HN, HK, HU, IS, IN, ID, IR, IQ, IE, IM, IL, IT, JM, JP, JE, JO, KZ, KE, KI, KP, KR, KW, KG, LA, LV, LB, LS, LR, LY, LI, LT, LU, MO, MK, MG, MW, MY, MV, ML, MT, MH, MQ, MR, MU, YT, MX, FM, MD, MC, MN, ME, MS, MA, MZ, MM, NA, NR, NP, NL, AN, NC, NZ, NI, NE, NG, NU, NF, MP, NO, OM, PK, PW, PS, PA, PG, PY, PE, PH, PN, PL, PT, PR, QA, RE, RO, RU, RW, BL, SH, KN, LC, MF, PM, VC, WS, SM, ST, SA, SN, RS, SC, SL, SG, SK, SI, SB, SO, ZA, GS, ES, LK, SD, SR, SJ, SZ, SE, CH, SY, TW, TJ, TZ, TH, TL, TG, TK, TO, TT, TN, TR, TM, TC, TV, UG, UA, AE, US, UM, UY, UZ, VU, VE, VN, VG, VI, WF, EH, YE, ZM, ZW; 可空 |
| `opportunity_obj.account.contacts[].assigned_to` | [Profile] | ✅ | — | 只读 |
| `opportunity_obj.account.contacts[].assigned_to[].id` | string(uuid) | ✅ | — | 只读 |
| `opportunity_obj.account.contacts[].assigned_to[].user_details` | object | ✅ | — | 只读 |
| `opportunity_obj.account.contacts[].assigned_to[].role` | → ProfileRoleEnum | — | — | — |
| `opportunity_obj.account.contacts[].assigned_to[].address` | string(uuid) | — | — | 可空 |
| `opportunity_obj.account.contacts[].assigned_to[].has_marketing_access` | boolean | — | — | — |
| `opportunity_obj.account.contacts[].assigned_to[].has_sales_access` | boolean | — | — | — |
| `opportunity_obj.account.contacts[].assigned_to[].phone` | string | — | — | 可空; ≤20字符 |
| `opportunity_obj.account.contacts[].assigned_to[].date_of_joining` | string(date) | — | — | 可空 |
| `opportunity_obj.account.contacts[].assigned_to[].is_active` | boolean | — | — | — |
| `opportunity_obj.account.contacts[].assigned_to[].created_at` | string(date-time) | ✅ | — | 只读 |
| `opportunity_obj.account.contacts[].teams` | [Teams] | ✅ | — | 只读 |
| `opportunity_obj.account.contacts[].teams[].id` | string(uuid) | ✅ | — | 只读 |
| `opportunity_obj.account.contacts[].teams[].name` | string | ✅ | — | ≤100字符 |
| `opportunity_obj.account.contacts[].teams[].description` | string | ✅ | — | — |
| `opportunity_obj.account.contacts[].teams[].users` | [Profile] | ✅ | — | 只读 |
| `opportunity_obj.account.contacts[].teams[].users[].id` | string(uuid) | ✅ | — | 只读 |
| `opportunity_obj.account.contacts[].teams[].users[].user_details` | object | ✅ | — | 只读 |
| `opportunity_obj.account.contacts[].teams[].users[].role` | → ProfileRoleEnum | — | — | — |
| `opportunity_obj.account.contacts[].teams[].users[].address` | string(uuid) | — | — | 可空 |
| `opportunity_obj.account.contacts[].teams[].users[].has_marketing_access` | boolean | — | — | — |
| `opportunity_obj.account.contacts[].teams[].users[].has_sales_access` | boolean | — | — | — |
| `opportunity_obj.account.contacts[].teams[].users[].phone` | string | — | — | 可空; ≤20字符 |
| `opportunity_obj.account.contacts[].teams[].users[].date_of_joining` | string(date) | — | — | 可空 |
| `opportunity_obj.account.contacts[].teams[].users[].is_active` | boolean | — | — | — |
| `opportunity_obj.account.contacts[].teams[].users[].created_at` | string(date-time) | ✅ | — | 只读 |
| `opportunity_obj.account.contacts[].teams[].created_at` | string(date-time) | ✅ | — | 只读 |
| `opportunity_obj.account.contacts[].teams[].created_by` | → User | ✅ | — | — |
| `opportunity_obj.account.contacts[].teams[].created_by.id` | string(uuid) | ✅ | — | 只读 |
| `opportunity_obj.account.contacts[].teams[].created_by.email` | string(email) | — | Email address | ≤254字符 |
| `opportunity_obj.account.contacts[].teams[].created_by.profile_pic` | string | — | — | 可空; ≤1000字符 |
| `opportunity_obj.account.contacts[].tags` | [string] | — | — | — |
| `opportunity_obj.account.contacts[].description` | string | — | Notes | 可空 |
| `opportunity_obj.account.contacts[].created_by` | string(uuid) | — | — | 可空 |
| `opportunity_obj.account.contacts[].created_at` | string(date-time) | ✅ | — | 只读 |
| `opportunity_obj.account.contacts[].is_active` | boolean | — | — | — |
| `opportunity_obj.account.contacts[].org` | → Organization | ✅ | — | — |
| `opportunity_obj.account.contacts[].org.id` | string(uuid) | ✅ | — | 只读 |
| `opportunity_obj.account.contacts[].org.name` | string | — | — | 可空; ≤100字符 |
| `opportunity_obj.account.contacts[].org.api_key` | string | ✅ | — | 只读 |
| `opportunity_obj.account.contacts[].account` | string(uuid) | — | Primary account this contact belongs to | 可空 |
| `opportunity_obj.account.contacts[].contact_attachment` | [Attachments] | ✅ | — | 只读 |
| `opportunity_obj.account.contacts[].contact_attachment[].id` | string(uuid) | ✅ | — | 只读 |
| `opportunity_obj.account.contacts[].contact_attachment[].created_by` | string(uuid) | — | — | 可空 |
| `opportunity_obj.account.contacts[].contact_attachment[].file_name` | string | ✅ | — | ≤60字符 |
| `opportunity_obj.account.contacts[].contact_attachment[].created_at` | string(date-time) | ✅ | — | 只读 |
| `opportunity_obj.account.contacts[].contact_attachment[].file_path` | string | ✅ | — | 只读 |
| `opportunity_obj.account.contacts[].contact_attachment[].content_type` | string | ✅ | Python model class name | 只读 |
| `opportunity_obj.account.contacts[].contact_attachment[].object_id` | string(uuid) | ✅ | — | — |
| `opportunity_obj.account.contacts[].contact_attachment[].org` | string(uuid) | ✅ | — | — |
| `opportunity_obj.account.tags` | [Tags] | ✅ | — | 只读 |
| `opportunity_obj.account.tags[].id` | string(uuid) | ✅ | — | 只读 |
| `opportunity_obj.account.tags[].name` | string | ✅ | — | ≤50字符 |
| `opportunity_obj.account.tags[].slug` | string | ✅ | — | 只读 |
| `opportunity_obj.account.tags[].color` | → ColorEnum | — | — | — |
| `opportunity_obj.account.tags[].description` | string | — | — | — |
| `opportunity_obj.account.tags[].is_active` | boolean | — | — | — |
| `opportunity_obj.account.tags[].created_at` | string(date-time) | ✅ | — | 只读 |
| `opportunity_obj.account.description` | string | — | Notes | 可空 |
| `opportunity_obj.account.account_attachment` | [Attachments] | ✅ | — | 只读 |
| `opportunity_obj.account.account_attachment[].id` | string(uuid) | ✅ | — | 只读 |
| `opportunity_obj.account.account_attachment[].created_by` | string(uuid) | — | — | 可空 |
| `opportunity_obj.account.account_attachment[].file_name` | string | ✅ | — | ≤60字符 |
| `opportunity_obj.account.account_attachment[].created_at` | string(date-time) | ✅ | — | 只读 |
| `opportunity_obj.account.account_attachment[].file_path` | string | ✅ | — | 只读 |
| `opportunity_obj.account.account_attachment[].content_type` | string | ✅ | Python model class name | 只读 |
| `opportunity_obj.account.account_attachment[].object_id` | string(uuid) | ✅ | — | — |
| `opportunity_obj.account.account_attachment[].org` | string(uuid) | ✅ | — | — |
| `opportunity_obj.account.cases` | [any] | ✅ | Return cases linked to this account | 只读 |
| `opportunity_obj.account.tasks` | [any] | ✅ | Return tasks linked to this account | 只读 |
| `opportunity_obj.account.opportunities` | [any] | ✅ | Return opportunities linked to this account | 只读 |
| `opportunity_obj.account.created_by` | → User | ✅ | — | — |
| `opportunity_obj.account.created_by.id` | string(uuid) | ✅ | — | 只读 |
| `opportunity_obj.account.created_by.email` | string(email) | — | Email address | ≤254字符 |
| `opportunity_obj.account.created_by.profile_pic` | string | — | — | 可空; ≤1000字符 |
| `opportunity_obj.account.created_at` | string(date-time) | ✅ | — | 只读 |
| `opportunity_obj.account.is_active` | boolean | — | — | — |
| `opportunity_obj.account.org` | → Organization | ✅ | — | — |
| `opportunity_obj.account.org.id` | string(uuid) | ✅ | — | 只读 |
| `opportunity_obj.account.org.name` | string | — | — | 可空; ≤100字符 |
| `opportunity_obj.account.org.api_key` | string | ✅ | — | 只读 |
| `opportunity_obj.stage` | → StageEnum | — | — | — |
| `opportunity_obj.opportunity_type` | enum(OpportunityTypeEnum) | — | Type | 枚举: NEW_BUSINESS, EXISTING_BUSINESS, RENEWAL, UPSELL, CROSS_SELL; 可空 |
| `opportunity_obj.currency` | enum(CurrencyEnum) | — | — | 枚举: USD, EUR, GBP, INR, CAD, AUD, JPY, CNY, CHF, SGD, AED, BRL, MXN; 可空 |
| `opportunity_obj.amount` | string(decimal) | — | — | 可空; 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `opportunity_obj.amount_source` | → AmountSourceEnum | — | — | — |
| `opportunity_obj.probability` | integer(int64) | — | Probability (%) | 可空 |
| `opportunity_obj.closed_on` | string(date) | — | Expected Close Date | 可空 |
| `opportunity_obj.lead_source` | enum(LeadSourceEnum) | — | — | 枚举: NONE, CALL, EMAIL, EXISTING CUSTOMER, PARTNER, PUBLIC RELATIONS, CAMPAIGN, WEBSITE, OTHER; 可空 |
| `opportunity_obj.contacts` | [Contact] | ✅ | — | 只读 |
| `opportunity_obj.contacts[].id` | string(uuid) | ✅ | — | 只读 |
| `opportunity_obj.contacts[].first_name` | string | ✅ | — | ≤255字符 |
| `opportunity_obj.contacts[].last_name` | string | ✅ | — | ≤255字符 |
| `opportunity_obj.contacts[].email` | string(email) | — | — | 可空; ≤254字符 |
| `opportunity_obj.contacts[].phone` | string | — | — | 可空; ≤25字符; 正则: ^[\d\s\-\(\)\+\.]{7,25}$ |
| `opportunity_obj.contacts[].organization` | string | — | Company | 可空; ≤255字符 |
| `opportunity_obj.contacts[].title` | string | — | Job Title | 可空; ≤255字符 |
| `opportunity_obj.contacts[].department` | string | — | — | 可空; ≤255字符 |
| `opportunity_obj.contacts[].do_not_call` | boolean | — | — | — |
| `opportunity_obj.contacts[].linkedin_url` | string(uri) | — | — | 可空; ≤200字符 |
| `opportunity_obj.contacts[].address_line` | string | — | Address | 可空; ≤255字符 |
| `opportunity_obj.contacts[].city` | string | — | — | 可空; ≤255字符 |
| `opportunity_obj.contacts[].state` | string | — | — | 可空; ≤255字符 |
| `opportunity_obj.contacts[].postcode` | string | — | Postal Code | 可空; ≤64字符 |
| `opportunity_obj.contacts[].country` | enum(ClientCountryEnum) | — | — | 枚举: GB, AF, AX, AL, DZ, AS, AD, AO, AI, AQ, AG, AR, AM, AW, AU, AT, AZ, BS, BH, BD, BB, BY, BE, BZ, BJ, BM, BT, BO, BA, BW, BV, BR, IO, BN, BG, BF, BI, KH, CM, CA, CV, KY, CF, TD, CL, CN, CX, CC, CO, KM, CG, CD, CK, CR, CI, HR, CU, CY, CZ, DK, DJ, DM, DO, EC, EG, SV, GQ, ER, EE, ET, FK, FO, FJ, FI, FR, GF, PF, TF, GA, GM, GE, DE, GH, GI, GR, GL, GD, GP, GU, GT, GG, GN, GW, GY, HT, HM, VA, HN, HK, HU, IS, IN, ID, IR, IQ, IE, IM, IL, IT, JM, JP, JE, JO, KZ, KE, KI, KP, KR, KW, KG, LA, LV, LB, LS, LR, LY, LI, LT, LU, MO, MK, MG, MW, MY, MV, ML, MT, MH, MQ, MR, MU, YT, MX, FM, MD, MC, MN, ME, MS, MA, MZ, MM, NA, NR, NP, NL, AN, NC, NZ, NI, NE, NG, NU, NF, MP, NO, OM, PK, PW, PS, PA, PG, PY, PE, PH, PN, PL, PT, PR, QA, RE, RO, RU, RW, BL, SH, KN, LC, MF, PM, VC, WS, SM, ST, SA, SN, RS, SC, SL, SG, SK, SI, SB, SO, ZA, GS, ES, LK, SD, SR, SJ, SZ, SE, CH, SY, TW, TJ, TZ, TH, TL, TG, TK, TO, TT, TN, TR, TM, TC, TV, UG, UA, AE, US, UM, UY, UZ, VU, VE, VN, VG, VI, WF, EH, YE, ZM, ZW; 可空 |
| `opportunity_obj.contacts[].assigned_to` | [Profile] | ✅ | — | 只读 |
| `opportunity_obj.contacts[].assigned_to[].id` | string(uuid) | ✅ | — | 只读 |
| `opportunity_obj.contacts[].assigned_to[].user_details` | object | ✅ | — | 只读 |
| `opportunity_obj.contacts[].assigned_to[].role` | → ProfileRoleEnum | — | — | — |
| `opportunity_obj.contacts[].assigned_to[].address` | string(uuid) | — | — | 可空 |
| `opportunity_obj.contacts[].assigned_to[].has_marketing_access` | boolean | — | — | — |
| `opportunity_obj.contacts[].assigned_to[].has_sales_access` | boolean | — | — | — |
| `opportunity_obj.contacts[].assigned_to[].phone` | string | — | — | 可空; ≤20字符 |
| `opportunity_obj.contacts[].assigned_to[].date_of_joining` | string(date) | — | — | 可空 |
| `opportunity_obj.contacts[].assigned_to[].is_active` | boolean | — | — | — |
| `opportunity_obj.contacts[].assigned_to[].created_at` | string(date-time) | ✅ | — | 只读 |
| `opportunity_obj.contacts[].teams` | [Teams] | ✅ | — | 只读 |
| `opportunity_obj.contacts[].teams[].id` | string(uuid) | ✅ | — | 只读 |
| `opportunity_obj.contacts[].teams[].name` | string | ✅ | — | ≤100字符 |
| `opportunity_obj.contacts[].teams[].description` | string | ✅ | — | — |
| `opportunity_obj.contacts[].teams[].users` | [Profile] | ✅ | — | 只读 |
| `opportunity_obj.contacts[].teams[].users[].id` | string(uuid) | ✅ | — | 只读 |
| `opportunity_obj.contacts[].teams[].users[].user_details` | object | ✅ | — | 只读 |
| `opportunity_obj.contacts[].teams[].users[].role` | → ProfileRoleEnum | — | — | — |
| `opportunity_obj.contacts[].teams[].users[].address` | string(uuid) | — | — | 可空 |
| `opportunity_obj.contacts[].teams[].users[].has_marketing_access` | boolean | — | — | — |
| `opportunity_obj.contacts[].teams[].users[].has_sales_access` | boolean | — | — | — |
| `opportunity_obj.contacts[].teams[].users[].phone` | string | — | — | 可空; ≤20字符 |
| `opportunity_obj.contacts[].teams[].users[].date_of_joining` | string(date) | — | — | 可空 |
| `opportunity_obj.contacts[].teams[].users[].is_active` | boolean | — | — | — |
| `opportunity_obj.contacts[].teams[].users[].created_at` | string(date-time) | ✅ | — | 只读 |
| `opportunity_obj.contacts[].teams[].created_at` | string(date-time) | ✅ | — | 只读 |
| `opportunity_obj.contacts[].teams[].created_by` | → User | ✅ | — | — |
| `opportunity_obj.contacts[].teams[].created_by.id` | string(uuid) | ✅ | — | 只读 |
| `opportunity_obj.contacts[].teams[].created_by.email` | string(email) | — | Email address | ≤254字符 |
| `opportunity_obj.contacts[].teams[].created_by.profile_pic` | string | — | — | 可空; ≤1000字符 |
| `opportunity_obj.contacts[].tags` | [string] | — | — | — |
| `opportunity_obj.contacts[].description` | string | — | Notes | 可空 |
| `opportunity_obj.contacts[].created_by` | string(uuid) | — | — | 可空 |
| `opportunity_obj.contacts[].created_at` | string(date-time) | ✅ | — | 只读 |
| `opportunity_obj.contacts[].is_active` | boolean | — | — | — |
| `opportunity_obj.contacts[].org` | → Organization | ✅ | — | — |
| `opportunity_obj.contacts[].org.id` | string(uuid) | ✅ | — | 只读 |
| `opportunity_obj.contacts[].org.name` | string | — | — | 可空; ≤100字符 |
| `opportunity_obj.contacts[].org.api_key` | string | ✅ | — | 只读 |
| `opportunity_obj.contacts[].account` | string(uuid) | — | Primary account this contact belongs to | 可空 |
| `opportunity_obj.contacts[].contact_attachment` | [Attachments] | ✅ | — | 只读 |
| `opportunity_obj.contacts[].contact_attachment[].id` | string(uuid) | ✅ | — | 只读 |
| `opportunity_obj.contacts[].contact_attachment[].created_by` | string(uuid) | — | — | 可空 |
| `opportunity_obj.contacts[].contact_attachment[].file_name` | string | ✅ | — | ≤60字符 |
| `opportunity_obj.contacts[].contact_attachment[].created_at` | string(date-time) | ✅ | — | 只读 |
| `opportunity_obj.contacts[].contact_attachment[].file_path` | string | ✅ | — | 只读 |
| `opportunity_obj.contacts[].contact_attachment[].content_type` | string | ✅ | Python model class name | 只读 |
| `opportunity_obj.contacts[].contact_attachment[].object_id` | string(uuid) | ✅ | — | — |
| `opportunity_obj.contacts[].contact_attachment[].org` | string(uuid) | ✅ | — | — |
| `opportunity_obj.line_items` | [OpportunityLineItem] | ✅ | — | 只读 |
| `opportunity_obj.line_items[].id` | string(uuid) | ✅ | — | 只读 |
| `opportunity_obj.line_items[].product` | any | ✅ | — | 只读 |
| `opportunity_obj.line_items[].name` | string | — | Item Name | ≤255字符 |
| `opportunity_obj.line_items[].description` | string | — | — | ≤500字符 |
| `opportunity_obj.line_items[].quantity` | string(decimal) | — | — | 正则: ^-?\d{0,8}(?:\.\d{0,2})?$ |
| `opportunity_obj.line_items[].unit_price` | string(decimal) | — | — | 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `opportunity_obj.line_items[].discount_type` | enum(DiscountTypeEnum) | — | — | 枚举: PERCENTAGE, FIXED |
| `opportunity_obj.line_items[].discount_value` | string(decimal) | — | — | 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `opportunity_obj.line_items[].discount_amount` | string(decimal) | ✅ | — | 只读; 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `opportunity_obj.line_items[].subtotal` | string(decimal) | ✅ | — | 只读; 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `opportunity_obj.line_items[].total` | string(decimal) | ✅ | — | 只读; 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `opportunity_obj.line_items[].order` | integer(int64) | — | — | — |
| `opportunity_obj.line_items[].formatted_unit_price` | string | ✅ | — | 只读 |
| `opportunity_obj.line_items[].formatted_total` | string | ✅ | — | 只读 |
| `opportunity_obj.line_items[].created_at` | string(date-time) | ✅ | — | 只读 |
| `opportunity_obj.line_items[].updated_at` | string(date-time) | ✅ | Last Modified At | 只读 |
| `opportunity_obj.line_items_total` | number(double) | ✅ | Calculate total from line items | 只读 |
| `opportunity_obj.assigned_to` | [Profile] | ✅ | — | 只读 |
| `opportunity_obj.assigned_to[].id` | string(uuid) | ✅ | — | 只读 |
| `opportunity_obj.assigned_to[].user_details` | object | ✅ | — | 只读 |
| `opportunity_obj.assigned_to[].role` | → ProfileRoleEnum | — | — | — |
| `opportunity_obj.assigned_to[].address` | string(uuid) | — | — | 可空 |
| `opportunity_obj.assigned_to[].has_marketing_access` | boolean | — | — | — |
| `opportunity_obj.assigned_to[].has_sales_access` | boolean | — | — | — |
| `opportunity_obj.assigned_to[].phone` | string | — | — | 可空; ≤20字符 |
| `opportunity_obj.assigned_to[].date_of_joining` | string(date) | — | — | 可空 |
| `opportunity_obj.assigned_to[].is_active` | boolean | — | — | — |
| `opportunity_obj.assigned_to[].created_at` | string(date-time) | ✅ | — | 只读 |
| `opportunity_obj.teams` | [Teams] | ✅ | — | 只读 |
| `opportunity_obj.teams[].id` | string(uuid) | ✅ | — | 只读 |
| `opportunity_obj.teams[].name` | string | ✅ | — | ≤100字符 |
| `opportunity_obj.teams[].description` | string | ✅ | — | — |
| `opportunity_obj.teams[].users` | [Profile] | ✅ | — | 只读 |
| `opportunity_obj.teams[].users[].id` | string(uuid) | ✅ | — | 只读 |
| `opportunity_obj.teams[].users[].user_details` | object | ✅ | — | 只读 |
| `opportunity_obj.teams[].users[].role` | → ProfileRoleEnum | — | — | — |
| `opportunity_obj.teams[].users[].address` | string(uuid) | — | — | 可空 |
| `opportunity_obj.teams[].users[].has_marketing_access` | boolean | — | — | — |
| `opportunity_obj.teams[].users[].has_sales_access` | boolean | — | — | — |
| `opportunity_obj.teams[].users[].phone` | string | — | — | 可空; ≤20字符 |
| `opportunity_obj.teams[].users[].date_of_joining` | string(date) | — | — | 可空 |
| `opportunity_obj.teams[].users[].is_active` | boolean | — | — | — |
| `opportunity_obj.teams[].users[].created_at` | string(date-time) | ✅ | — | 只读 |
| `opportunity_obj.teams[].created_at` | string(date-time) | ✅ | — | 只读 |
| `opportunity_obj.teams[].created_by` | → User | ✅ | — | — |
| `opportunity_obj.teams[].created_by.id` | string(uuid) | ✅ | — | 只读 |
| `opportunity_obj.teams[].created_by.email` | string(email) | — | Email address | ≤254字符 |
| `opportunity_obj.teams[].created_by.profile_pic` | string | — | — | 可空; ≤1000字符 |
| `opportunity_obj.closed_by` | → Profile | ✅ | — | — |
| `opportunity_obj.closed_by.id` | string(uuid) | ✅ | — | 只读 |
| `opportunity_obj.closed_by.user_details` | object | ✅ | — | 只读 |
| `opportunity_obj.closed_by.role` | → ProfileRoleEnum | — | — | — |
| `opportunity_obj.closed_by.address` | string(uuid) | — | — | 可空 |
| `opportunity_obj.closed_by.has_marketing_access` | boolean | — | — | — |
| `opportunity_obj.closed_by.has_sales_access` | boolean | — | — | — |
| `opportunity_obj.closed_by.phone` | string | — | — | 可空; ≤20字符 |
| `opportunity_obj.closed_by.date_of_joining` | string(date) | — | — | 可空 |
| `opportunity_obj.closed_by.is_active` | boolean | — | — | — |
| `opportunity_obj.closed_by.created_at` | string(date-time) | ✅ | — | 只读 |
| `opportunity_obj.tags` | [Tags] | ✅ | — | 只读 |
| `opportunity_obj.tags[].id` | string(uuid) | ✅ | — | 只读 |
| `opportunity_obj.tags[].name` | string | ✅ | — | ≤50字符 |
| `opportunity_obj.tags[].slug` | string | ✅ | — | 只读 |
| `opportunity_obj.tags[].color` | → ColorEnum | — | — | — |
| `opportunity_obj.tags[].description` | string | — | — | — |
| `opportunity_obj.tags[].is_active` | boolean | — | — | — |
| `opportunity_obj.tags[].created_at` | string(date-time) | ✅ | — | 只读 |
| `opportunity_obj.description` | string | — | Notes | 可空 |
| `opportunity_obj.created_by` | → User | ✅ | — | — |
| `opportunity_obj.created_by.id` | string(uuid) | ✅ | — | 只读 |
| `opportunity_obj.created_by.email` | string(email) | — | Email address | ≤254字符 |
| `opportunity_obj.created_by.profile_pic` | string | — | — | 可空; ≤1000字符 |
| `opportunity_obj.created_at` | string(date-time) | ✅ | — | 只读 |
| `opportunity_obj.is_active` | boolean | — | — | — |
| `opportunity_obj.org` | → Organization | ✅ | — | — |
| `opportunity_obj.org.id` | string(uuid) | ✅ | — | 只读 |
| `opportunity_obj.org.name` | string | — | — | 可空; ≤100字符 |
| `opportunity_obj.org.api_key` | string | ✅ | — | 只读 |
| `opportunity_obj.created_on_arrow` | string | ✅ | — | 只读 |
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
### PUT `/api/opportunities/{id}/` 🔒

新建商机

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**请求体** `application/json`

> 新建商机

**Schema: `OpportunityCreateSwaggerRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `name` | string | ✅ | Opportunity Name | ≤255字符 |
| `account` | string(uuid) | — | — | 可空 |
| `stage` | → StageEnum | — | — | — |
| `opportunity_type` | enum(OpportunityTypeEnum) | — | Type | 枚举: NEW_BUSINESS, EXISTING_BUSINESS, RENEWAL, UPSELL, CROSS_SELL; 可空 |
| `amount` | string(decimal) | — | — | 可空; 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `currency` | enum(CurrencyEnum) | — | — | 枚举: USD, EUR, GBP, INR, CAD, AUD, JPY, CNY, CHF, SGD, AED, BRL, MXN; 可空 |
| `probability` | integer(int64) | — | Probability (%) | 可空 |
| `closed_on` | string(date) | ✅ | — | — |
| `lead_source` | enum(LeadSourceEnum) | — | — | 枚举: NONE, CALL, EMAIL, EXISTING CUSTOMER, PARTNER, PUBLIC RELATIONS, CAMPAIGN, WEBSITE, OTHER; 可空 |
| `description` | string | — | Notes | 可空 |
| `assigned_to` | [string] | ✅ | — | — |
| `contacts` | [string] | ✅ | — | — |
| `teams` | [string] | ✅ | — | — |
| `tags` | [string] | — | — | — |

**200** → `OpportunityUpdateResponse`

**Schema: `OpportunityUpdateResponse`**

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
### GET `/api/opportunities/{opportunity_id}/line-items/` 🔒

List all line items for an opportunity

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `opportunity_id` | path | string | ✅ | — |

**200** → `OpportunityLineItemListResponse`

**Schema: `OpportunityLineItemListResponse`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `line_items` | [OpportunityLineItem] | ✅ | — | — |
| `line_items[].id` | string(uuid) | ✅ | — | 只读 |
| `line_items[].product` | any | ✅ | — | 只读 |
| `line_items[].name` | string | — | Item Name | ≤255字符 |
| `line_items[].description` | string | — | — | ≤500字符 |
| `line_items[].quantity` | string(decimal) | — | — | 正则: ^-?\d{0,8}(?:\.\d{0,2})?$ |
| `line_items[].unit_price` | string(decimal) | — | — | 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `line_items[].discount_type` | enum(DiscountTypeEnum) | — | — | 枚举: PERCENTAGE, FIXED |
| `line_items[].discount_value` | string(decimal) | — | — | 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `line_items[].discount_amount` | string(decimal) | ✅ | — | 只读; 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `line_items[].subtotal` | string(decimal) | ✅ | — | 只读; 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `line_items[].total` | string(decimal) | ✅ | — | 只读; 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `line_items[].order` | integer(int64) | — | — | — |
| `line_items[].formatted_unit_price` | string | ✅ | — | 只读 |
| `line_items[].formatted_total` | string | ✅ | — | 只读 |
| `line_items[].created_at` | string(date-time) | ✅ | — | 只读 |
| `line_items[].updated_at` | string(date-time) | ✅ | Last Modified At | 只读 |
| `products` | [Product] | ✅ | — | — |
| `products[].id` | string(uuid) | ✅ | — | 只读 |
| `products[].name` | string | ✅ | Product Name | ≤255字符 |
| `products[].description` | string | — | — | 可空 |
| `products[].sku` | string | — | — | 可空; ≤100字符 |
| `products[].price` | string(decimal) | — | — | 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `products[].currency` | enum(CurrencyEnum) | — | — | 枚举: USD, EUR, GBP, INR, CAD, AUD, JPY, CNY, CHF, SGD, AED, BRL, MXN; 可空 |
| `products[].category` | string | — | — | 可空; ≤100字符 |
| `products[].is_active` | boolean | — | — | — |
| `products[].created_at` | string(date-time) | ✅ | — | 只读 |
| `products[].updated_at` | string(date-time) | ✅ | Last Modified At | 只读 |
| `opportunity_amount` | string(decimal) | ✅ | — | 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `opportunity_amount_source` | string | ✅ | — | — |

**可能的错误响应（DRF 标准）**

- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）
- **400**: 请求参数校验失败（query/header/body 不合法）

---
### POST `/api/opportunities/{opportunity_id}/line-items/` 🔒

Create a new line item for an opportunity

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `opportunity_id` | path | string | ✅ | — |

**请求体** `application/json`

> 新建/编辑商机行项目

**Schema: `OpportunityLineItemCreateRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `product_id` | string(uuid) | — | — | 可空 |
| `name` | string | — | Item Name | ≤255字符 |
| `description` | string | — | — | ≤500字符 |
| `quantity` | string(decimal) | — | — | 正则: ^-?\d{0,8}(?:\.\d{0,2})?$ |
| `unit_price` | string(decimal) | — | — | 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `discount_type` | enum(DiscountTypeEnum) | — | — | 枚举: PERCENTAGE, FIXED |
| `discount_value` | string(decimal) | — | — | 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `order` | integer(int64) | — | — | — |

**201** → `OpportunityLineItemCreateResponse`

**Schema: `OpportunityLineItemCreateResponse`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `error` | boolean | ✅ | — | — |
| `message` | string | ✅ | — | — |
| `line_item` | → OpportunityLineItem | ✅ | — | — |
| `line_item.id` | string(uuid) | ✅ | — | 只读 |
| `line_item.product` | any | ✅ | — | 只读 |
| `line_item.name` | string | — | Item Name | ≤255字符 |
| `line_item.description` | string | — | — | ≤500字符 |
| `line_item.quantity` | string(decimal) | — | — | 正则: ^-?\d{0,8}(?:\.\d{0,2})?$ |
| `line_item.unit_price` | string(decimal) | — | — | 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `line_item.discount_type` | enum(DiscountTypeEnum) | — | — | 枚举: PERCENTAGE, FIXED |
| `line_item.discount_value` | string(decimal) | — | — | 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `line_item.discount_amount` | string(decimal) | ✅ | — | 只读; 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `line_item.subtotal` | string(decimal) | ✅ | — | 只读; 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `line_item.total` | string(decimal) | ✅ | — | 只读; 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `line_item.order` | integer(int64) | — | — | — |
| `line_item.formatted_unit_price` | string | ✅ | — | 只读 |
| `line_item.formatted_total` | string | ✅ | — | 只读 |
| `line_item.created_at` | string(date-time) | ✅ | — | 只读 |
| `line_item.updated_at` | string(date-time) | ✅ | Last Modified At | 只读 |
| `opportunity_amount` | string(decimal) | ✅ | — | 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### DELETE `/api/opportunities/{opportunity_id}/line-items/{line_item_id}/` 🔒

Delete a line item

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `line_item_id` | path | string | ✅ | — |
| `opportunity_id` | path | string | ✅ | — |

**200** → `OpportunityLineItemDeleteResponse`

**Schema: `OpportunityLineItemDeleteResponse`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `error` | boolean | ✅ | — | — |
| `message` | string | ✅ | — | — |
| `opportunity_amount` | string(decimal) | ✅ | — | 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |

**可能的错误响应（DRF 标准）**

- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）
- **400**: 请求参数校验失败（query/header/body 不合法）

---
### GET `/api/opportunities/{opportunity_id}/line-items/{line_item_id}/` 🔒

Retrieve a single line item

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `line_item_id` | path | string | ✅ | — |
| `opportunity_id` | path | string | ✅ | — |

**200** → `OpportunityLineItem`

**Schema: `OpportunityLineItem`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `id` | string(uuid) | ✅ | — | 只读 |
| `product` | any | ✅ | — | 只读 |
| `name` | string | — | Item Name | ≤255字符 |
| `description` | string | — | — | ≤500字符 |
| `quantity` | string(decimal) | — | — | 正则: ^-?\d{0,8}(?:\.\d{0,2})?$ |
| `unit_price` | string(decimal) | — | — | 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `discount_type` | enum(DiscountTypeEnum) | — | — | 枚举: PERCENTAGE, FIXED |
| `discount_value` | string(decimal) | — | — | 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `discount_amount` | string(decimal) | ✅ | — | 只读; 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `subtotal` | string(decimal) | ✅ | — | 只读; 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `total` | string(decimal) | ✅ | — | 只读; 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `order` | integer(int64) | — | — | — |
| `formatted_unit_price` | string | ✅ | — | 只读 |
| `formatted_total` | string | ✅ | — | 只读 |
| `created_at` | string(date-time) | ✅ | — | 只读 |
| `updated_at` | string(date-time) | ✅ | Last Modified At | 只读 |

**可能的错误响应（DRF 标准）**

- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）
- **400**: 请求参数校验失败（query/header/body 不合法）

---
### PUT `/api/opportunities/{opportunity_id}/line-items/{line_item_id}/` 🔒

Update a line item

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `line_item_id` | path | string | ✅ | — |
| `opportunity_id` | path | string | ✅ | — |

**请求体** `application/json`

> 新建/编辑商机行项目

**Schema: `OpportunityLineItemCreateRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `product_id` | string(uuid) | — | — | 可空 |
| `name` | string | — | Item Name | ≤255字符 |
| `description` | string | — | — | ≤500字符 |
| `quantity` | string(decimal) | — | — | 正则: ^-?\d{0,8}(?:\.\d{0,2})?$ |
| `unit_price` | string(decimal) | — | — | 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `discount_type` | enum(DiscountTypeEnum) | — | — | 枚举: PERCENTAGE, FIXED |
| `discount_value` | string(decimal) | — | — | 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `order` | integer(int64) | — | — | — |

**200** → `OpportunityLineItemUpdateResponse`

**Schema: `OpportunityLineItemUpdateResponse`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `error` | boolean | ✅ | — | — |
| `message` | string | ✅ | — | — |
| `line_item` | → OpportunityLineItem | ✅ | — | — |
| `line_item.id` | string(uuid) | ✅ | — | 只读 |
| `line_item.product` | any | ✅ | — | 只读 |
| `line_item.name` | string | — | Item Name | ≤255字符 |
| `line_item.description` | string | — | — | ≤500字符 |
| `line_item.quantity` | string(decimal) | — | — | 正则: ^-?\d{0,8}(?:\.\d{0,2})?$ |
| `line_item.unit_price` | string(decimal) | — | — | 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `line_item.discount_type` | enum(DiscountTypeEnum) | — | — | 枚举: PERCENTAGE, FIXED |
| `line_item.discount_value` | string(decimal) | — | — | 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `line_item.discount_amount` | string(decimal) | ✅ | — | 只读; 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `line_item.subtotal` | string(decimal) | ✅ | — | 只读; 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `line_item.total` | string(decimal) | ✅ | — | 只读; 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `line_item.order` | integer(int64) | — | — | — |
| `line_item.formatted_unit_price` | string | ✅ | — | 只读 |
| `line_item.formatted_total` | string | ✅ | — | 只读 |
| `line_item.created_at` | string(date-time) | ✅ | — | 只读 |
| `line_item.updated_at` | string(date-time) | ✅ | Last Modified At | 只读 |
| `opportunity_amount` | string(decimal) | ✅ | — | 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---