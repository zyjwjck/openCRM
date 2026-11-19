# 客户关系管理 — 工单

> 共 30 个端点。🔒 = 需要登录（JWT），🟢 = 无需鉴权。
> 工单 CRUD + 看板管道/阶段 + 知识库解决方案 + 评论/附件。GET /api/cases/ 返回**聚合 dict**（cases + accounts_list + contacts_list + 下拉选项）。

## 端点速览

| 方法 | 路径 | 鉴权 | 说明 |
|------|------|------|------|
| GET | `/api/cases/` | 🔒 | 列表查询 |
| POST | `/api/cases/` | 🔒 | 新建工单 |
| DELETE | `/api/cases/attachment/{id}/` | 🔒 | 删除 |
| DELETE | `/api/cases/comment/{id}/` | 🔒 | 删除评论 |
| PATCH | `/api/cases/comment/{id}/` | 🔒 | 部分更新评论 |
| PUT | `/api/cases/comment/{id}/` | 🔒 | 全量更新 |
| GET | `/api/cases/kanban/` | 🔒 | 获取看板数据 . |
| GET | `/api/cases/pipelines/` | 🔒 | 列出组织的所有管道 . |
| POST | `/api/cases/pipelines/` | 🔒 | 新建管道 . |
| DELETE | `/api/cases/pipelines/{id}/` | 🔒 | 管道详情/更新/删除 . |
| GET | `/api/cases/pipelines/{id}/` | 🔒 | 管道详情/更新/删除 . |
| PUT | `/api/cases/pipelines/{id}/` | 🔒 | 管道详情/更新/删除 . |
| POST | `/api/cases/pipelines/{pipeline_pk}/stages/` | 🔒 | 在管道中创建阶段 . |
| POST | `/api/cases/pipelines/{pipeline_pk}/stages/reorder/` | 🔒 | 批量重排管道阶段 . |
| GET | `/api/cases/solutions/` | 🔒 | 列出所有解决方案（可筛选） |
| POST | `/api/cases/solutions/` | 🔒 | 新建解决方案 |
| DELETE | `/api/cases/solutions/{id}/` | 🔒 | 删除解决方案 |
| GET | `/api/cases/solutions/{id}/` | 🔒 | 获取解决方案详情 |
| PATCH | `/api/cases/solutions/{id}/` | 🔒 | 部分更新解决方案 |
| PUT | `/api/cases/solutions/{id}/` | 🔒 | 全量更新解决方案 |
| POST | `/api/cases/solutions/{id}/publish/` | 🔒 | 发布已审核的解决方案 |
| POST | `/api/cases/solutions/{id}/unpublish/` | 🔒 | 取消发布解决方案 |
| DELETE | `/api/cases/stages/{id}/` | 🔒 | 阶段更新/删除 . |
| PUT | `/api/cases/stages/{id}/` | 🔒 | 阶段更新/删除 . |
| DELETE | `/api/cases/{id}/` | 🔒 | 删除 |
| GET | `/api/cases/{id}/` | 🔒 | 获取详情 |
| PATCH | `/api/cases/{id}/` | 🔒 | 部分更新工单 |
| POST | `/api/cases/{id}/` | 🔒 | 编辑工单详情（含附件/评论） |
| PUT | `/api/cases/{id}/` | 🔒 | 新建工单 |
| PATCH | `/api/cases/{id}/move/` | 🔒 | 移动工单到不同列/位置 . |

## 端点详情

### GET `/api/cases/` 🔒

列表查询

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `account` | query | string | — | — |
| `name` | query | string | — | — |
| `org` | header | string | — | — |
| `priority` | query | string | — | — |
| `status` | query | string | — | — |

**200** → `cases`

> ✅ 后端实测: 自定义 dict（OpenAPI 未标注）；顶层字段: accounts_list, cases, cases_count, contacts_list, offset, priority, status, type_of_case

**Schema: `cases → 响应（后端实测）`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `cases_count` | integer | — | — | — |
| `offset` | integer | — | — | — |
| `cases` | [object] | — | — | — |
| `status` | [array] | — | — | — |
| `priority` | [array] | — | — | — |
| `type_of_case` | [array] | — | — | — |
| `accounts_list` | [object] | — | — | — |
| `contacts_list` | [object] | — | — | — |

**可能的错误响应（DRF 标准）**

- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）
- **400**: 请求参数校验失败（query/header/body 不合法）

---
### POST `/api/cases/` 🔒

新建工单

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `org` | header | string | — | — |

**请求体** `application/json`

> 新建工单

**Schema: `CaseCreateSwaggerRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `name` | string | ✅ | — | ≤64字符 |
| `status` | → CaseStatusEnum | ✅ | — | — |
| `priority` | → CasePriorityEnum | ✅ | — | — |
| `case_type` | enum(CaseTypeEnum) | — | — | 枚举: Question, Incident, Problem; 可空 |
| `closed_on` | string(date) | — | — | 可空 |
| `teams` | [string] | ✅ | — | — |
| `assigned_to` | [string] | ✅ | — | — |
| `account` | string(uuid) | — | — | 可空 |
| `contacts` | [string] | ✅ | — | — |
| `tags` | [string] | — | — | — |
| `description` | string | — | — | 可空 |

**200** → `CaseCreateResponse`

**Schema: `CaseCreateResponse`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `error` | boolean | ✅ | — | — |
| `message` | string | ✅ | — | — |
| `id` | string | ✅ | — | — |
| `cases_obj` | → Case | ✅ | — | — |
| `cases_obj.id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.name` | string | ✅ | — | ≤64字符 |
| `cases_obj.status` | → CaseStatusEnum | ✅ | — | — |
| `cases_obj.priority` | → CasePriorityEnum | ✅ | — | — |
| `cases_obj.case_type` | enum(CaseTypeEnum) | — | — | 枚举: Question, Incident, Problem; 可空 |
| `cases_obj.closed_on` | string(date) | — | — | 可空 |
| `cases_obj.description` | string | — | — | 可空 |
| `cases_obj.created_by` | any | ✅ | — | 只读 |
| `cases_obj.created_at` | string(date-time) | ✅ | — | 只读 |
| `cases_obj.is_active` | boolean | — | — | — |
| `cases_obj.account` | → Account | ✅ | — | — |
| `cases_obj.account.id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.account.name` | string | ✅ | Account Name | ≤255字符 |
| `cases_obj.account.email` | string(email) | — | — | 可空; ≤254字符 |
| `cases_obj.account.phone` | string | — | — | 可空; ≤25字符; 正则: ^[\d\s\-\(\)\+\.]{7,25}$ |
| `cases_obj.account.website` | string(uri) | — | — | 可空; ≤200字符 |
| `cases_obj.account.industry` | enum(IndustryEnum) | — | — | 枚举: ADVERTISING, AGRICULTURE, APPAREL & ACCESSORIES, AUTOMOTIVE, BANKING, BIOTECHNOLOGY, BUILDING MATERIALS & EQUIPMENT, CHEMICAL, COMPUTER, EDUCATION, ELECTRONICS, ENERGY, ENTERTAINMENT & LEISURE, FINANCE, FOOD & BEVERAGE, GROCERY, HEALTHCARE, INSURANCE, LEGAL, MANUFACTURING, PUBLISHING, REAL ESTATE, SERVICE, SOFTWARE, SPORTS, TECHNOLOGY, TELECOMMUNICATIONS, TELEVISION, TRANSPORTATION, VENTURE CAPITAL; 可空 |
| `cases_obj.account.number_of_employees` | integer(int64) | — | — | 可空 |
| `cases_obj.account.annual_revenue` | string(decimal) | — | — | 可空; 正则: ^-?\d{0,13}(?:\.\d{0,2})?$ |
| `cases_obj.account.currency` | enum(CurrencyEnum) | — | — | 枚举: USD, EUR, GBP, INR, CAD, AUD, JPY, CNY, CHF, SGD, AED, BRL, MXN; 可空 |
| `cases_obj.account.address_line` | string | — | Address | 可空; ≤255字符 |
| `cases_obj.account.city` | string | — | — | 可空; ≤255字符 |
| `cases_obj.account.state` | string | — | — | 可空; ≤255字符 |
| `cases_obj.account.postcode` | string | — | Postal Code | 可空; ≤64字符 |
| `cases_obj.account.country` | enum(ClientCountryEnum) | — | — | 枚举: GB, AF, AX, AL, DZ, AS, AD, AO, AI, AQ, AG, AR, AM, AW, AU, AT, AZ, BS, BH, BD, BB, BY, BE, BZ, BJ, BM, BT, BO, BA, BW, BV, BR, IO, BN, BG, BF, BI, KH, CM, CA, CV, KY, CF, TD, CL, CN, CX, CC, CO, KM, CG, CD, CK, CR, CI, HR, CU, CY, CZ, DK, DJ, DM, DO, EC, EG, SV, GQ, ER, EE, ET, FK, FO, FJ, FI, FR, GF, PF, TF, GA, GM, GE, DE, GH, GI, GR, GL, GD, GP, GU, GT, GG, GN, GW, GY, HT, HM, VA, HN, HK, HU, IS, IN, ID, IR, IQ, IE, IM, IL, IT, JM, JP, JE, JO, KZ, KE, KI, KP, KR, KW, KG, LA, LV, LB, LS, LR, LY, LI, LT, LU, MO, MK, MG, MW, MY, MV, ML, MT, MH, MQ, MR, MU, YT, MX, FM, MD, MC, MN, ME, MS, MA, MZ, MM, NA, NR, NP, NL, AN, NC, NZ, NI, NE, NG, NU, NF, MP, NO, OM, PK, PW, PS, PA, PG, PY, PE, PH, PN, PL, PT, PR, QA, RE, RO, RU, RW, BL, SH, KN, LC, MF, PM, VC, WS, SM, ST, SA, SN, RS, SC, SL, SG, SK, SI, SB, SO, ZA, GS, ES, LK, SD, SR, SJ, SZ, SE, CH, SY, TW, TJ, TZ, TH, TL, TG, TK, TO, TT, TN, TR, TM, TC, TV, UG, UA, AE, US, UM, UY, UZ, VU, VE, VN, VG, VI, WF, EH, YE, ZM, ZW; 可空 |
| `cases_obj.account.country_display` | string | ✅ | — | 只读 |
| `cases_obj.account.assigned_to` | [Profile] | ✅ | — | 只读 |
| `cases_obj.account.assigned_to[].id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.account.assigned_to[].user_details` | object | ✅ | — | 只读 |
| `cases_obj.account.assigned_to[].role` | → ProfileRoleEnum | — | — | — |
| `cases_obj.account.assigned_to[].address` | string(uuid) | — | — | 可空 |
| `cases_obj.account.assigned_to[].has_marketing_access` | boolean | — | — | — |
| `cases_obj.account.assigned_to[].has_sales_access` | boolean | — | — | — |
| `cases_obj.account.assigned_to[].phone` | string | — | — | 可空; ≤20字符 |
| `cases_obj.account.assigned_to[].date_of_joining` | string(date) | — | — | 可空 |
| `cases_obj.account.assigned_to[].is_active` | boolean | — | — | — |
| `cases_obj.account.assigned_to[].created_at` | string(date-time) | ✅ | — | 只读 |
| `cases_obj.account.teams` | [Teams] | ✅ | — | 只读 |
| `cases_obj.account.teams[].id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.account.teams[].name` | string | ✅ | — | ≤100字符 |
| `cases_obj.account.teams[].description` | string | ✅ | — | — |
| `cases_obj.account.teams[].users` | [Profile] | ✅ | — | 只读 |
| `cases_obj.account.teams[].users[].id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.account.teams[].users[].user_details` | object | ✅ | — | 只读 |
| `cases_obj.account.teams[].users[].role` | → ProfileRoleEnum | — | — | — |
| `cases_obj.account.teams[].users[].address` | string(uuid) | — | — | 可空 |
| `cases_obj.account.teams[].users[].has_marketing_access` | boolean | — | — | — |
| `cases_obj.account.teams[].users[].has_sales_access` | boolean | — | — | — |
| `cases_obj.account.teams[].users[].phone` | string | — | — | 可空; ≤20字符 |
| `cases_obj.account.teams[].users[].date_of_joining` | string(date) | — | — | 可空 |
| `cases_obj.account.teams[].users[].is_active` | boolean | — | — | — |
| `cases_obj.account.teams[].users[].created_at` | string(date-time) | ✅ | — | 只读 |
| `cases_obj.account.teams[].created_at` | string(date-time) | ✅ | — | 只读 |
| `cases_obj.account.teams[].created_by` | → User | ✅ | — | — |
| `cases_obj.account.teams[].created_by.id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.account.teams[].created_by.email` | string(email) | — | Email address | ≤254字符 |
| `cases_obj.account.teams[].created_by.profile_pic` | string | — | — | 可空; ≤1000字符 |
| `cases_obj.account.contacts` | [Contact] | ✅ | — | 只读 |
| `cases_obj.account.contacts[].id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.account.contacts[].first_name` | string | ✅ | — | ≤255字符 |
| `cases_obj.account.contacts[].last_name` | string | ✅ | — | ≤255字符 |
| `cases_obj.account.contacts[].email` | string(email) | — | — | 可空; ≤254字符 |
| `cases_obj.account.contacts[].phone` | string | — | — | 可空; ≤25字符; 正则: ^[\d\s\-\(\)\+\.]{7,25}$ |
| `cases_obj.account.contacts[].organization` | string | — | Company | 可空; ≤255字符 |
| `cases_obj.account.contacts[].title` | string | — | Job Title | 可空; ≤255字符 |
| `cases_obj.account.contacts[].department` | string | — | — | 可空; ≤255字符 |
| `cases_obj.account.contacts[].do_not_call` | boolean | — | — | — |
| `cases_obj.account.contacts[].linkedin_url` | string(uri) | — | — | 可空; ≤200字符 |
| `cases_obj.account.contacts[].address_line` | string | — | Address | 可空; ≤255字符 |
| `cases_obj.account.contacts[].city` | string | — | — | 可空; ≤255字符 |
| `cases_obj.account.contacts[].state` | string | — | — | 可空; ≤255字符 |
| `cases_obj.account.contacts[].postcode` | string | — | Postal Code | 可空; ≤64字符 |
| `cases_obj.account.contacts[].country` | enum(ClientCountryEnum) | — | — | 枚举: GB, AF, AX, AL, DZ, AS, AD, AO, AI, AQ, AG, AR, AM, AW, AU, AT, AZ, BS, BH, BD, BB, BY, BE, BZ, BJ, BM, BT, BO, BA, BW, BV, BR, IO, BN, BG, BF, BI, KH, CM, CA, CV, KY, CF, TD, CL, CN, CX, CC, CO, KM, CG, CD, CK, CR, CI, HR, CU, CY, CZ, DK, DJ, DM, DO, EC, EG, SV, GQ, ER, EE, ET, FK, FO, FJ, FI, FR, GF, PF, TF, GA, GM, GE, DE, GH, GI, GR, GL, GD, GP, GU, GT, GG, GN, GW, GY, HT, HM, VA, HN, HK, HU, IS, IN, ID, IR, IQ, IE, IM, IL, IT, JM, JP, JE, JO, KZ, KE, KI, KP, KR, KW, KG, LA, LV, LB, LS, LR, LY, LI, LT, LU, MO, MK, MG, MW, MY, MV, ML, MT, MH, MQ, MR, MU, YT, MX, FM, MD, MC, MN, ME, MS, MA, MZ, MM, NA, NR, NP, NL, AN, NC, NZ, NI, NE, NG, NU, NF, MP, NO, OM, PK, PW, PS, PA, PG, PY, PE, PH, PN, PL, PT, PR, QA, RE, RO, RU, RW, BL, SH, KN, LC, MF, PM, VC, WS, SM, ST, SA, SN, RS, SC, SL, SG, SK, SI, SB, SO, ZA, GS, ES, LK, SD, SR, SJ, SZ, SE, CH, SY, TW, TJ, TZ, TH, TL, TG, TK, TO, TT, TN, TR, TM, TC, TV, UG, UA, AE, US, UM, UY, UZ, VU, VE, VN, VG, VI, WF, EH, YE, ZM, ZW; 可空 |
| `cases_obj.account.contacts[].assigned_to` | [Profile] | ✅ | — | 只读 |
| `cases_obj.account.contacts[].assigned_to[].id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.account.contacts[].assigned_to[].user_details` | object | ✅ | — | 只读 |
| `cases_obj.account.contacts[].assigned_to[].role` | → ProfileRoleEnum | — | — | — |
| `cases_obj.account.contacts[].assigned_to[].address` | string(uuid) | — | — | 可空 |
| `cases_obj.account.contacts[].assigned_to[].has_marketing_access` | boolean | — | — | — |
| `cases_obj.account.contacts[].assigned_to[].has_sales_access` | boolean | — | — | — |
| `cases_obj.account.contacts[].assigned_to[].phone` | string | — | — | 可空; ≤20字符 |
| `cases_obj.account.contacts[].assigned_to[].date_of_joining` | string(date) | — | — | 可空 |
| `cases_obj.account.contacts[].assigned_to[].is_active` | boolean | — | — | — |
| `cases_obj.account.contacts[].assigned_to[].created_at` | string(date-time) | ✅ | — | 只读 |
| `cases_obj.account.contacts[].teams` | [Teams] | ✅ | — | 只读 |
| `cases_obj.account.contacts[].teams[].id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.account.contacts[].teams[].name` | string | ✅ | — | ≤100字符 |
| `cases_obj.account.contacts[].teams[].description` | string | ✅ | — | — |
| `cases_obj.account.contacts[].teams[].users` | [Profile] | ✅ | — | 只读 |
| `cases_obj.account.contacts[].teams[].users[].id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.account.contacts[].teams[].users[].user_details` | object | ✅ | — | 只读 |
| `cases_obj.account.contacts[].teams[].users[].role` | → ProfileRoleEnum | — | — | — |
| `cases_obj.account.contacts[].teams[].users[].address` | string(uuid) | — | — | 可空 |
| `cases_obj.account.contacts[].teams[].users[].has_marketing_access` | boolean | — | — | — |
| `cases_obj.account.contacts[].teams[].users[].has_sales_access` | boolean | — | — | — |
| `cases_obj.account.contacts[].teams[].users[].phone` | string | — | — | 可空; ≤20字符 |
| `cases_obj.account.contacts[].teams[].users[].date_of_joining` | string(date) | — | — | 可空 |
| `cases_obj.account.contacts[].teams[].users[].is_active` | boolean | — | — | — |
| `cases_obj.account.contacts[].teams[].users[].created_at` | string(date-time) | ✅ | — | 只读 |
| `cases_obj.account.contacts[].teams[].created_at` | string(date-time) | ✅ | — | 只读 |
| `cases_obj.account.contacts[].teams[].created_by` | → User | ✅ | — | — |
| `cases_obj.account.contacts[].teams[].created_by.id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.account.contacts[].teams[].created_by.email` | string(email) | — | Email address | ≤254字符 |
| `cases_obj.account.contacts[].teams[].created_by.profile_pic` | string | — | — | 可空; ≤1000字符 |
| `cases_obj.account.contacts[].tags` | [string] | — | — | — |
| `cases_obj.account.contacts[].description` | string | — | Notes | 可空 |
| `cases_obj.account.contacts[].created_by` | string(uuid) | — | — | 可空 |
| `cases_obj.account.contacts[].created_at` | string(date-time) | ✅ | — | 只读 |
| `cases_obj.account.contacts[].is_active` | boolean | — | — | — |
| `cases_obj.account.contacts[].org` | → Organization | ✅ | — | — |
| `cases_obj.account.contacts[].org.id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.account.contacts[].org.name` | string | — | — | 可空; ≤100字符 |
| `cases_obj.account.contacts[].org.api_key` | string | ✅ | — | 只读 |
| `cases_obj.account.contacts[].account` | string(uuid) | — | Primary account this contact belongs to | 可空 |
| `cases_obj.account.contacts[].contact_attachment` | [Attachments] | ✅ | — | 只读 |
| `cases_obj.account.contacts[].contact_attachment[].id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.account.contacts[].contact_attachment[].created_by` | string(uuid) | — | — | 可空 |
| `cases_obj.account.contacts[].contact_attachment[].file_name` | string | ✅ | — | ≤60字符 |
| `cases_obj.account.contacts[].contact_attachment[].created_at` | string(date-time) | ✅ | — | 只读 |
| `cases_obj.account.contacts[].contact_attachment[].file_path` | string | ✅ | — | 只读 |
| `cases_obj.account.contacts[].contact_attachment[].content_type` | string | ✅ | Python model class name | 只读 |
| `cases_obj.account.contacts[].contact_attachment[].object_id` | string(uuid) | ✅ | — | — |
| `cases_obj.account.contacts[].contact_attachment[].org` | string(uuid) | ✅ | — | — |
| `cases_obj.account.tags` | [Tags] | ✅ | — | 只读 |
| `cases_obj.account.tags[].id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.account.tags[].name` | string | ✅ | — | ≤50字符 |
| `cases_obj.account.tags[].slug` | string | ✅ | — | 只读 |
| `cases_obj.account.tags[].color` | → ColorEnum | — | — | — |
| `cases_obj.account.tags[].description` | string | — | — | — |
| `cases_obj.account.tags[].is_active` | boolean | — | — | — |
| `cases_obj.account.tags[].created_at` | string(date-time) | ✅ | — | 只读 |
| `cases_obj.account.description` | string | — | Notes | 可空 |
| `cases_obj.account.account_attachment` | [Attachments] | ✅ | — | 只读 |
| `cases_obj.account.account_attachment[].id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.account.account_attachment[].created_by` | string(uuid) | — | — | 可空 |
| `cases_obj.account.account_attachment[].file_name` | string | ✅ | — | ≤60字符 |
| `cases_obj.account.account_attachment[].created_at` | string(date-time) | ✅ | — | 只读 |
| `cases_obj.account.account_attachment[].file_path` | string | ✅ | — | 只读 |
| `cases_obj.account.account_attachment[].content_type` | string | ✅ | Python model class name | 只读 |
| `cases_obj.account.account_attachment[].object_id` | string(uuid) | ✅ | — | — |
| `cases_obj.account.account_attachment[].org` | string(uuid) | ✅ | — | — |
| `cases_obj.account.cases` | [any] | ✅ | Return cases linked to this account | 只读 |
| `cases_obj.account.tasks` | [any] | ✅ | Return tasks linked to this account | 只读 |
| `cases_obj.account.opportunities` | [any] | ✅ | Return opportunities linked to this account | 只读 |
| `cases_obj.account.created_by` | → User | ✅ | — | — |
| `cases_obj.account.created_by.id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.account.created_by.email` | string(email) | — | Email address | ≤254字符 |
| `cases_obj.account.created_by.profile_pic` | string | — | — | 可空; ≤1000字符 |
| `cases_obj.account.created_at` | string(date-time) | ✅ | — | 只读 |
| `cases_obj.account.is_active` | boolean | — | — | — |
| `cases_obj.account.org` | → Organization | ✅ | — | — |
| `cases_obj.account.org.id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.account.org.name` | string | — | — | 可空; ≤100字符 |
| `cases_obj.account.org.api_key` | string | ✅ | — | 只读 |
| `cases_obj.contacts` | [Contact] | ✅ | — | 只读 |
| `cases_obj.contacts[].id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.contacts[].first_name` | string | ✅ | — | ≤255字符 |
| `cases_obj.contacts[].last_name` | string | ✅ | — | ≤255字符 |
| `cases_obj.contacts[].email` | string(email) | — | — | 可空; ≤254字符 |
| `cases_obj.contacts[].phone` | string | — | — | 可空; ≤25字符; 正则: ^[\d\s\-\(\)\+\.]{7,25}$ |
| `cases_obj.contacts[].organization` | string | — | Company | 可空; ≤255字符 |
| `cases_obj.contacts[].title` | string | — | Job Title | 可空; ≤255字符 |
| `cases_obj.contacts[].department` | string | — | — | 可空; ≤255字符 |
| `cases_obj.contacts[].do_not_call` | boolean | — | — | — |
| `cases_obj.contacts[].linkedin_url` | string(uri) | — | — | 可空; ≤200字符 |
| `cases_obj.contacts[].address_line` | string | — | Address | 可空; ≤255字符 |
| `cases_obj.contacts[].city` | string | — | — | 可空; ≤255字符 |
| `cases_obj.contacts[].state` | string | — | — | 可空; ≤255字符 |
| `cases_obj.contacts[].postcode` | string | — | Postal Code | 可空; ≤64字符 |
| `cases_obj.contacts[].country` | enum(ClientCountryEnum) | — | — | 枚举: GB, AF, AX, AL, DZ, AS, AD, AO, AI, AQ, AG, AR, AM, AW, AU, AT, AZ, BS, BH, BD, BB, BY, BE, BZ, BJ, BM, BT, BO, BA, BW, BV, BR, IO, BN, BG, BF, BI, KH, CM, CA, CV, KY, CF, TD, CL, CN, CX, CC, CO, KM, CG, CD, CK, CR, CI, HR, CU, CY, CZ, DK, DJ, DM, DO, EC, EG, SV, GQ, ER, EE, ET, FK, FO, FJ, FI, FR, GF, PF, TF, GA, GM, GE, DE, GH, GI, GR, GL, GD, GP, GU, GT, GG, GN, GW, GY, HT, HM, VA, HN, HK, HU, IS, IN, ID, IR, IQ, IE, IM, IL, IT, JM, JP, JE, JO, KZ, KE, KI, KP, KR, KW, KG, LA, LV, LB, LS, LR, LY, LI, LT, LU, MO, MK, MG, MW, MY, MV, ML, MT, MH, MQ, MR, MU, YT, MX, FM, MD, MC, MN, ME, MS, MA, MZ, MM, NA, NR, NP, NL, AN, NC, NZ, NI, NE, NG, NU, NF, MP, NO, OM, PK, PW, PS, PA, PG, PY, PE, PH, PN, PL, PT, PR, QA, RE, RO, RU, RW, BL, SH, KN, LC, MF, PM, VC, WS, SM, ST, SA, SN, RS, SC, SL, SG, SK, SI, SB, SO, ZA, GS, ES, LK, SD, SR, SJ, SZ, SE, CH, SY, TW, TJ, TZ, TH, TL, TG, TK, TO, TT, TN, TR, TM, TC, TV, UG, UA, AE, US, UM, UY, UZ, VU, VE, VN, VG, VI, WF, EH, YE, ZM, ZW; 可空 |
| `cases_obj.contacts[].assigned_to` | [Profile] | ✅ | — | 只读 |
| `cases_obj.contacts[].assigned_to[].id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.contacts[].assigned_to[].user_details` | object | ✅ | — | 只读 |
| `cases_obj.contacts[].assigned_to[].role` | → ProfileRoleEnum | — | — | — |
| `cases_obj.contacts[].assigned_to[].address` | string(uuid) | — | — | 可空 |
| `cases_obj.contacts[].assigned_to[].has_marketing_access` | boolean | — | — | — |
| `cases_obj.contacts[].assigned_to[].has_sales_access` | boolean | — | — | — |
| `cases_obj.contacts[].assigned_to[].phone` | string | — | — | 可空; ≤20字符 |
| `cases_obj.contacts[].assigned_to[].date_of_joining` | string(date) | — | — | 可空 |
| `cases_obj.contacts[].assigned_to[].is_active` | boolean | — | — | — |
| `cases_obj.contacts[].assigned_to[].created_at` | string(date-time) | ✅ | — | 只读 |
| `cases_obj.contacts[].teams` | [Teams] | ✅ | — | 只读 |
| `cases_obj.contacts[].teams[].id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.contacts[].teams[].name` | string | ✅ | — | ≤100字符 |
| `cases_obj.contacts[].teams[].description` | string | ✅ | — | — |
| `cases_obj.contacts[].teams[].users` | [Profile] | ✅ | — | 只读 |
| `cases_obj.contacts[].teams[].users[].id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.contacts[].teams[].users[].user_details` | object | ✅ | — | 只读 |
| `cases_obj.contacts[].teams[].users[].role` | → ProfileRoleEnum | — | — | — |
| `cases_obj.contacts[].teams[].users[].address` | string(uuid) | — | — | 可空 |
| `cases_obj.contacts[].teams[].users[].has_marketing_access` | boolean | — | — | — |
| `cases_obj.contacts[].teams[].users[].has_sales_access` | boolean | — | — | — |
| `cases_obj.contacts[].teams[].users[].phone` | string | — | — | 可空; ≤20字符 |
| `cases_obj.contacts[].teams[].users[].date_of_joining` | string(date) | — | — | 可空 |
| `cases_obj.contacts[].teams[].users[].is_active` | boolean | — | — | — |
| `cases_obj.contacts[].teams[].users[].created_at` | string(date-time) | ✅ | — | 只读 |
| `cases_obj.contacts[].teams[].created_at` | string(date-time) | ✅ | — | 只读 |
| `cases_obj.contacts[].teams[].created_by` | → User | ✅ | — | — |
| `cases_obj.contacts[].teams[].created_by.id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.contacts[].teams[].created_by.email` | string(email) | — | Email address | ≤254字符 |
| `cases_obj.contacts[].teams[].created_by.profile_pic` | string | — | — | 可空; ≤1000字符 |
| `cases_obj.contacts[].tags` | [string] | — | — | — |
| `cases_obj.contacts[].description` | string | — | Notes | 可空 |
| `cases_obj.contacts[].created_by` | string(uuid) | — | — | 可空 |
| `cases_obj.contacts[].created_at` | string(date-time) | ✅ | — | 只读 |
| `cases_obj.contacts[].is_active` | boolean | — | — | — |
| `cases_obj.contacts[].org` | → Organization | ✅ | — | — |
| `cases_obj.contacts[].org.id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.contacts[].org.name` | string | — | — | 可空; ≤100字符 |
| `cases_obj.contacts[].org.api_key` | string | ✅ | — | 只读 |
| `cases_obj.contacts[].account` | string(uuid) | — | Primary account this contact belongs to | 可空 |
| `cases_obj.contacts[].contact_attachment` | [Attachments] | ✅ | — | 只读 |
| `cases_obj.contacts[].contact_attachment[].id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.contacts[].contact_attachment[].created_by` | string(uuid) | — | — | 可空 |
| `cases_obj.contacts[].contact_attachment[].file_name` | string | ✅ | — | ≤60字符 |
| `cases_obj.contacts[].contact_attachment[].created_at` | string(date-time) | ✅ | — | 只读 |
| `cases_obj.contacts[].contact_attachment[].file_path` | string | ✅ | — | 只读 |
| `cases_obj.contacts[].contact_attachment[].content_type` | string | ✅ | Python model class name | 只读 |
| `cases_obj.contacts[].contact_attachment[].object_id` | string(uuid) | ✅ | — | — |
| `cases_obj.contacts[].contact_attachment[].org` | string(uuid) | ✅ | — | — |
| `cases_obj.teams` | [Teams] | ✅ | — | 只读 |
| `cases_obj.teams[].id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.teams[].name` | string | ✅ | — | ≤100字符 |
| `cases_obj.teams[].description` | string | ✅ | — | — |
| `cases_obj.teams[].users` | [Profile] | ✅ | — | 只读 |
| `cases_obj.teams[].users[].id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.teams[].users[].user_details` | object | ✅ | — | 只读 |
| `cases_obj.teams[].users[].role` | → ProfileRoleEnum | — | — | — |
| `cases_obj.teams[].users[].address` | string(uuid) | — | — | 可空 |
| `cases_obj.teams[].users[].has_marketing_access` | boolean | — | — | — |
| `cases_obj.teams[].users[].has_sales_access` | boolean | — | — | — |
| `cases_obj.teams[].users[].phone` | string | — | — | 可空; ≤20字符 |
| `cases_obj.teams[].users[].date_of_joining` | string(date) | — | — | 可空 |
| `cases_obj.teams[].users[].is_active` | boolean | — | — | — |
| `cases_obj.teams[].users[].created_at` | string(date-time) | ✅ | — | 只读 |
| `cases_obj.teams[].created_at` | string(date-time) | ✅ | — | 只读 |
| `cases_obj.teams[].created_by` | → User | ✅ | — | — |
| `cases_obj.teams[].created_by.id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.teams[].created_by.email` | string(email) | — | Email address | ≤254字符 |
| `cases_obj.teams[].created_by.profile_pic` | string | — | — | 可空; ≤1000字符 |
| `cases_obj.assigned_to` | [Profile] | ✅ | — | 只读 |
| `cases_obj.assigned_to[].id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.assigned_to[].user_details` | object | ✅ | — | 只读 |
| `cases_obj.assigned_to[].role` | → ProfileRoleEnum | — | — | — |
| `cases_obj.assigned_to[].address` | string(uuid) | — | — | 可空 |
| `cases_obj.assigned_to[].has_marketing_access` | boolean | — | — | — |
| `cases_obj.assigned_to[].has_sales_access` | boolean | — | — | — |
| `cases_obj.assigned_to[].phone` | string | — | — | 可空; ≤20字符 |
| `cases_obj.assigned_to[].date_of_joining` | string(date) | — | — | 可空 |
| `cases_obj.assigned_to[].is_active` | boolean | — | — | — |
| `cases_obj.assigned_to[].created_at` | string(date-time) | ✅ | — | 只读 |
| `cases_obj.tags` | [Tags] | ✅ | — | 只读 |
| `cases_obj.tags[].id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.tags[].name` | string | ✅ | — | ≤50字符 |
| `cases_obj.tags[].slug` | string | ✅ | — | 只读 |
| `cases_obj.tags[].color` | → ColorEnum | — | — | — |
| `cases_obj.tags[].description` | string | — | — | — |
| `cases_obj.tags[].is_active` | boolean | — | — | — |
| `cases_obj.tags[].created_at` | string(date-time) | ✅ | — | 只读 |
| `cases_obj.org` | → Organization | ✅ | — | — |
| `cases_obj.org.id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.org.name` | string | — | — | 可空; ≤100字符 |
| `cases_obj.org.api_key` | string | ✅ | — | 只读 |

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### DELETE `/api/cases/attachment/{id}/` 🔒

删除

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**200** → `CaseAttachmentDeleteResponse`

**Schema: `CaseAttachmentDeleteResponse`**

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
### DELETE `/api/cases/comment/{id}/` 🔒

删除评论

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**200** → `CaseCommentDeleteResponse`

**Schema: `CaseCommentDeleteResponse`**

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
### PATCH `/api/cases/comment/{id}/` 🔒

部分更新评论

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**请求体** `application/json`

**Schema: `PatchedCaseCommentEditSwaggerRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `comment` | string | — | — | — |

**200** → `CaseCommentPatchResponse`

**Schema: `CaseCommentPatchResponse`**

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
### PUT `/api/cases/comment/{id}/` 🔒

全量更新

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**请求体** `application/json`

**Schema: `CaseCommentEditSwaggerRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `comment` | string | ✅ | — | — |

**200** → `CaseCommentUpdateResponse`

**Schema: `CaseCommentUpdateResponse`**

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
### GET `/api/cases/kanban/` 🔒

获取看板数据 .

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `account` | query | string | — | Filter by account ID |
| `assigned_to` | query | string | — | Filter by assigned user ID |
| `case_type` | query | string | — | Filter by case type (Question/Incident/Problem) |
| `org` | query | string | ✅ | — |
| `pipeline_id` | query | string | — | Pipeline ID. If not provided, uses status-based columns |
| `priority` | query | string | — | Filter by priority (Low/Normal/High/Urgent) |
| `search` | query | string | — | Search in name and description |

**200** → `kanban`

> ✅ 后端实测: 自定义 dict（OpenAPI 未标注）；顶层字段: columns, mode, pipeline, total_cases

**Schema: `kanban → 响应（后端实测）`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `mode` | string | — | — | — |
| `pipeline` | string | — | — | 可空 |
| `columns` | [object] | — | — | — |
| `total_cases` | integer | — | — | — |

**可能的错误响应（DRF 标准）**

- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）
- **400**: 请求参数校验失败（query/header/body 不合法）

---
### GET `/api/cases/pipelines/` 🔒

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
### POST `/api/cases/pipelines/` 🔒

新建管道 .

**请求体** `application/json`

> 新建/化工单管道

**Schema: `CasePipelineRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `name` | string | ✅ | Pipeline Name | ≤255字符 |
| `description` | string | — | — | 可空 |
| `is_default` | boolean | — | If true, new cases without explicit pipeline go here | — |
| `is_active` | boolean | — | — | — |

**201** → `CasePipeline`

**Schema: `CasePipeline`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `id` | string(uuid) | ✅ | — | 只读 |
| `name` | string | ✅ | Pipeline Name | ≤255字符 |
| `description` | string | — | — | 可空 |
| `is_default` | boolean | — | If true, new cases without explicit pipeline go here | — |
| `is_active` | boolean | — | — | — |
| `stages` | [CaseStage] | ✅ | — | 只读 |
| `stages[].id` | string(uuid) | ✅ | — | 只读 |
| `stages[].name` | string | ✅ | Stage Name | ≤100字符 |
| `stages[].order` | integer(int64) | — | — | — |
| `stages[].color` | string | — | — | ≤7字符 |
| `stages[].stage_type` | → CaseStageStageTypeEnum | — | — | — |
| `stages[].maps_to_status` | enum(CaseStatusEnum) | — | When case enters this stage, also update Case.status

* `New` - New
* `Assigned` - Assigned
* `Pending` - Pending
* `Closed` - Closed
* `Rejected` - Rejected
* `Duplicate` - Duplicate | 枚举: New, Assigned, Pending, Closed, Rejected, Duplicate; 可空 |
| `stages[].wip_limit` | integer(int64) | — | Maximum cases allowed in this stage (null = unlimited) | 可空 |
| `stages[].case_count` | string | ✅ | — | 只读 |
| `stages[].created_at` | string(date-time) | ✅ | — | 只读 |
| `stages[].updated_at` | string(date-time) | ✅ | Last Modified At | 只读 |
| `stage_count` | string | ✅ | — | 只读 |
| `case_count` | string | ✅ | — | 只读 |
| `created_at` | string(date-time) | ✅ | — | 只读 |
| `updated_at` | string(date-time) | ✅ | Last Modified At | 只读 |

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### DELETE `/api/cases/pipelines/{id}/` 🔒

管道详情/更新/删除 .

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
### GET `/api/cases/pipelines/{id}/` 🔒

管道详情/更新/删除 .

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |

**200** → `CasePipeline`

**Schema: `CasePipeline`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `id` | string(uuid) | ✅ | — | 只读 |
| `name` | string | ✅ | Pipeline Name | ≤255字符 |
| `description` | string | — | — | 可空 |
| `is_default` | boolean | — | If true, new cases without explicit pipeline go here | — |
| `is_active` | boolean | — | — | — |
| `stages` | [CaseStage] | ✅ | — | 只读 |
| `stages[].id` | string(uuid) | ✅ | — | 只读 |
| `stages[].name` | string | ✅ | Stage Name | ≤100字符 |
| `stages[].order` | integer(int64) | — | — | — |
| `stages[].color` | string | — | — | ≤7字符 |
| `stages[].stage_type` | → CaseStageStageTypeEnum | — | — | — |
| `stages[].maps_to_status` | enum(CaseStatusEnum) | — | When case enters this stage, also update Case.status

* `New` - New
* `Assigned` - Assigned
* `Pending` - Pending
* `Closed` - Closed
* `Rejected` - Rejected
* `Duplicate` - Duplicate | 枚举: New, Assigned, Pending, Closed, Rejected, Duplicate; 可空 |
| `stages[].wip_limit` | integer(int64) | — | Maximum cases allowed in this stage (null = unlimited) | 可空 |
| `stages[].case_count` | string | ✅ | — | 只读 |
| `stages[].created_at` | string(date-time) | ✅ | — | 只读 |
| `stages[].updated_at` | string(date-time) | ✅ | Last Modified At | 只读 |
| `stage_count` | string | ✅ | — | 只读 |
| `case_count` | string | ✅ | — | 只读 |
| `created_at` | string(date-time) | ✅ | — | 只读 |
| `updated_at` | string(date-time) | ✅ | Last Modified At | 只读 |

**可能的错误响应（DRF 标准）**

- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）
- **400**: 请求参数校验失败（query/header/body 不合法）

---
### PUT `/api/cases/pipelines/{id}/` 🔒

管道详情/更新/删除 .

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |

**请求体** `application/json`

> 新建/化工单管道

**Schema: `CasePipelineRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `name` | string | ✅ | Pipeline Name | ≤255字符 |
| `description` | string | — | — | 可空 |
| `is_default` | boolean | — | If true, new cases without explicit pipeline go here | — |
| `is_active` | boolean | — | — | — |

**200** → `CasePipeline`

**Schema: `CasePipeline`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `id` | string(uuid) | ✅ | — | 只读 |
| `name` | string | ✅ | Pipeline Name | ≤255字符 |
| `description` | string | — | — | 可空 |
| `is_default` | boolean | — | If true, new cases without explicit pipeline go here | — |
| `is_active` | boolean | — | — | — |
| `stages` | [CaseStage] | ✅ | — | 只读 |
| `stages[].id` | string(uuid) | ✅ | — | 只读 |
| `stages[].name` | string | ✅ | Stage Name | ≤100字符 |
| `stages[].order` | integer(int64) | — | — | — |
| `stages[].color` | string | — | — | ≤7字符 |
| `stages[].stage_type` | → CaseStageStageTypeEnum | — | — | — |
| `stages[].maps_to_status` | enum(CaseStatusEnum) | — | When case enters this stage, also update Case.status

* `New` - New
* `Assigned` - Assigned
* `Pending` - Pending
* `Closed` - Closed
* `Rejected` - Rejected
* `Duplicate` - Duplicate | 枚举: New, Assigned, Pending, Closed, Rejected, Duplicate; 可空 |
| `stages[].wip_limit` | integer(int64) | — | Maximum cases allowed in this stage (null = unlimited) | 可空 |
| `stages[].case_count` | string | ✅ | — | 只读 |
| `stages[].created_at` | string(date-time) | ✅ | — | 只读 |
| `stages[].updated_at` | string(date-time) | ✅ | Last Modified At | 只读 |
| `stage_count` | string | ✅ | — | 只读 |
| `case_count` | string | ✅ | — | 只读 |
| `created_at` | string(date-time) | ✅ | — | 只读 |
| `updated_at` | string(date-time) | ✅ | Last Modified At | 只读 |

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### POST `/api/cases/pipelines/{pipeline_pk}/stages/` 🔒

在管道中创建阶段 .

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `pipeline_pk` | path | string | ✅ | — |

**请求体** `application/json`

> 新建/化工单阶段

**Schema: `CaseStageRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `name` | string | ✅ | Stage Name | ≤100字符 |
| `order` | integer(int64) | — | — | — |
| `color` | string | — | — | ≤7字符 |
| `stage_type` | → CaseStageStageTypeEnum | — | — | — |
| `maps_to_status` | enum(CaseStatusEnum) | — | When case enters this stage, also update Case.status

* `New` - New
* `Assigned` - Assigned
* `Pending` - Pending
* `Closed` - Closed
* `Rejected` - Rejected
* `Duplicate` - Duplicate | 枚举: New, Assigned, Pending, Closed, Rejected, Duplicate; 可空 |
| `wip_limit` | integer(int64) | — | Maximum cases allowed in this stage (null = unlimited) | 可空 |

**201** → `CaseStage`

**Schema: `CaseStage`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `id` | string(uuid) | ✅ | — | 只读 |
| `name` | string | ✅ | Stage Name | ≤100字符 |
| `order` | integer(int64) | — | — | — |
| `color` | string | — | — | ≤7字符 |
| `stage_type` | → CaseStageStageTypeEnum | — | — | — |
| `maps_to_status` | enum(CaseStatusEnum) | — | When case enters this stage, also update Case.status

* `New` - New
* `Assigned` - Assigned
* `Pending` - Pending
* `Closed` - Closed
* `Rejected` - Rejected
* `Duplicate` - Duplicate | 枚举: New, Assigned, Pending, Closed, Rejected, Duplicate; 可空 |
| `wip_limit` | integer(int64) | — | Maximum cases allowed in this stage (null = unlimited) | 可空 |
| `case_count` | string | ✅ | — | 只读 |
| `created_at` | string(date-time) | ✅ | — | 只读 |
| `updated_at` | string(date-time) | ✅ | Last Modified At | 只读 |

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### POST `/api/cases/pipelines/{pipeline_pk}/stages/reorder/` 🔒

批量重排管道阶段 .

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `pipeline_pk` | path | string | ✅ | — |

**请求体** `application/json`

> 工单阶段重排

**Schema: `CaseStageReorderRequestRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `stage_ids` | [string] | ✅ | — | — |

**200** → 推断: CasePipeline

> OpenAPI 未标注；动作 `reorder` 推断返回 `CasePipeline`

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### GET `/api/cases/solutions/` 🔒

列出所有解决方案（可筛选）

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `is_published` | query | boolean | — | Filter by published status |
| `search` | query | string | — | Search in title and description |
| `status` | query | string | — | Filter by status (draft/reviewed/approved) |

**200** → 后端实测: HTTP 500（后端报错）

**可能的错误响应（DRF 标准）**

- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）
- **400**: 请求参数校验失败（query/header/body 不合法）

---
### POST `/api/cases/solutions/` 🔒

新建解决方案

**请求体** `application/json`

> 新建/编辑知识库解决方案

**Schema: `SolutionCreateUpdateRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `title` | string | ✅ | — | ≤255字符 |
| `description` | string | ✅ | — | — |
| `status` | → SolutionStatusEnum | — | — | — |
| `is_published` | boolean | — | — | — |

**201** → `Solution`

**Schema: `Solution`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `id` | string(uuid) | ✅ | — | 只读 |
| `title` | string | ✅ | — | ≤255字符 |
| `description` | string | ✅ | — | — |
| `status` | → SolutionStatusEnum | — | — | — |
| `is_published` | boolean | — | — | — |
| `org` | any | ✅ | — | 只读 |
| `case_count` | integer | ✅ | Get number of cases using this solution | 只读 |
| `created_at` | string(date-time) | ✅ | — | 只读 |
| `updated_at` | string(date-time) | ✅ | Last Modified At | 只读 |
| `created_by` | string(uuid) | ✅ | — | 只读; 可空 |
| `updated_by` | string(uuid) | ✅ | Last Modified By | 只读; 可空 |

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### DELETE `/api/cases/solutions/{id}/` 🔒

删除解决方案

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
### GET `/api/cases/solutions/{id}/` 🔒

获取解决方案详情

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |

**200** → `SolutionDetail`

**Schema: `SolutionDetail`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `id` | string(uuid) | ✅ | — | 只读 |
| `title` | string | ✅ | — | ≤255字符 |
| `description` | string | ✅ | — | — |
| `status` | → SolutionStatusEnum | — | — | — |
| `is_published` | boolean | — | — | — |
| `org` | any | ✅ | — | 只读 |
| `linked_cases` | [any] | ✅ | Get cases that use this solution | 只读 |
| `created_at` | string(date-time) | ✅ | — | 只读 |
| `updated_at` | string(date-time) | ✅ | Last Modified At | 只读 |
| `created_by` | string(uuid) | — | — | 可空 |
| `updated_by` | string(uuid) | — | Last Modified By | 可空 |

**可能的错误响应（DRF 标准）**

- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）
- **400**: 请求参数校验失败（query/header/body 不合法）

---
### PATCH `/api/cases/solutions/{id}/` 🔒

部分更新解决方案

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |

**请求体** `application/json`

**Schema: `PatchedSolutionCreateUpdateRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `title` | string | — | — | ≤255字符 |
| `description` | string | — | — | — |
| `status` | → SolutionStatusEnum | — | — | — |
| `is_published` | boolean | — | — | — |

**200** → `Solution`

**Schema: `Solution`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `id` | string(uuid) | ✅ | — | 只读 |
| `title` | string | ✅ | — | ≤255字符 |
| `description` | string | ✅ | — | — |
| `status` | → SolutionStatusEnum | — | — | — |
| `is_published` | boolean | — | — | — |
| `org` | any | ✅ | — | 只读 |
| `case_count` | integer | ✅ | Get number of cases using this solution | 只读 |
| `created_at` | string(date-time) | ✅ | — | 只读 |
| `updated_at` | string(date-time) | ✅ | Last Modified At | 只读 |
| `created_by` | string(uuid) | ✅ | — | 只读; 可空 |
| `updated_by` | string(uuid) | ✅ | Last Modified By | 只读; 可空 |

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### PUT `/api/cases/solutions/{id}/` 🔒

全量更新解决方案

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |

**请求体** `application/json`

> 新建/编辑知识库解决方案

**Schema: `SolutionCreateUpdateRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `title` | string | ✅ | — | ≤255字符 |
| `description` | string | ✅ | — | — |
| `status` | → SolutionStatusEnum | — | — | — |
| `is_published` | boolean | — | — | — |

**200** → `Solution`

**Schema: `Solution`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `id` | string(uuid) | ✅ | — | 只读 |
| `title` | string | ✅ | — | ≤255字符 |
| `description` | string | ✅ | — | — |
| `status` | → SolutionStatusEnum | — | — | — |
| `is_published` | boolean | — | — | — |
| `org` | any | ✅ | — | 只读 |
| `case_count` | integer | ✅ | Get number of cases using this solution | 只读 |
| `created_at` | string(date-time) | ✅ | — | 只读 |
| `updated_at` | string(date-time) | ✅ | Last Modified At | 只读 |
| `created_by` | string(uuid) | ✅ | — | 只读; 可空 |
| `updated_by` | string(uuid) | ✅ | Last Modified By | 只读; 可空 |

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### POST `/api/cases/solutions/{id}/publish/` 🔒

发布已审核的解决方案

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |

**200** → `Solution`

**Schema: `Solution`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `id` | string(uuid) | ✅ | — | 只读 |
| `title` | string | ✅ | — | ≤255字符 |
| `description` | string | ✅ | — | — |
| `status` | → SolutionStatusEnum | — | — | — |
| `is_published` | boolean | — | — | — |
| `org` | any | ✅ | — | 只读 |
| `case_count` | integer | ✅ | Get number of cases using this solution | 只读 |
| `created_at` | string(date-time) | ✅ | — | 只读 |
| `updated_at` | string(date-time) | ✅ | Last Modified At | 只读 |
| `created_by` | string(uuid) | ✅ | — | 只读; 可空 |
| `updated_by` | string(uuid) | ✅ | Last Modified By | 只读; 可空 |

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### POST `/api/cases/solutions/{id}/unpublish/` 🔒

取消发布解决方案

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |

**200** → `Solution`

**Schema: `Solution`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `id` | string(uuid) | ✅ | — | 只读 |
| `title` | string | ✅ | — | ≤255字符 |
| `description` | string | ✅ | — | — |
| `status` | → SolutionStatusEnum | — | — | — |
| `is_published` | boolean | — | — | — |
| `org` | any | ✅ | — | 只读 |
| `case_count` | integer | ✅ | Get number of cases using this solution | 只读 |
| `created_at` | string(date-time) | ✅ | — | 只读 |
| `updated_at` | string(date-time) | ✅ | Last Modified At | 只读 |
| `created_by` | string(uuid) | ✅ | — | 只读; 可空 |
| `updated_by` | string(uuid) | ✅ | Last Modified By | 只读; 可空 |

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### DELETE `/api/cases/stages/{id}/` 🔒

阶段更新/删除 .

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
### PUT `/api/cases/stages/{id}/` 🔒

阶段更新/删除 .

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |

**请求体** `application/json`

> 新建/化工单阶段

**Schema: `CaseStageRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `name` | string | ✅ | Stage Name | ≤100字符 |
| `order` | integer(int64) | — | — | — |
| `color` | string | — | — | ≤7字符 |
| `stage_type` | → CaseStageStageTypeEnum | — | — | — |
| `maps_to_status` | enum(CaseStatusEnum) | — | When case enters this stage, also update Case.status

* `New` - New
* `Assigned` - Assigned
* `Pending` - Pending
* `Closed` - Closed
* `Rejected` - Rejected
* `Duplicate` - Duplicate | 枚举: New, Assigned, Pending, Closed, Rejected, Duplicate; 可空 |
| `wip_limit` | integer(int64) | — | Maximum cases allowed in this stage (null = unlimited) | 可空 |

**200** → `CaseStage`

**Schema: `CaseStage`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `id` | string(uuid) | ✅ | — | 只读 |
| `name` | string | ✅ | Stage Name | ≤100字符 |
| `order` | integer(int64) | — | — | — |
| `color` | string | — | — | ≤7字符 |
| `stage_type` | → CaseStageStageTypeEnum | — | — | — |
| `maps_to_status` | enum(CaseStatusEnum) | — | When case enters this stage, also update Case.status

* `New` - New
* `Assigned` - Assigned
* `Pending` - Pending
* `Closed` - Closed
* `Rejected` - Rejected
* `Duplicate` - Duplicate | 枚举: New, Assigned, Pending, Closed, Rejected, Duplicate; 可空 |
| `wip_limit` | integer(int64) | — | Maximum cases allowed in this stage (null = unlimited) | 可空 |
| `case_count` | string | ✅ | — | 只读 |
| `created_at` | string(date-time) | ✅ | — | 只读 |
| `updated_at` | string(date-time) | ✅ | Last Modified At | 只读 |

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### DELETE `/api/cases/{id}/` 🔒

删除

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**200** → `CaseDeleteResponse`

**Schema: `CaseDeleteResponse`**

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
### GET `/api/cases/{id}/` 🔒

获取详情

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**200** → `CaseDetailResponse`

**Schema: `CaseDetailResponse`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `cases_obj` | → Case | ✅ | — | — |
| `cases_obj.id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.name` | string | ✅ | — | ≤64字符 |
| `cases_obj.status` | → CaseStatusEnum | ✅ | — | — |
| `cases_obj.priority` | → CasePriorityEnum | ✅ | — | — |
| `cases_obj.case_type` | enum(CaseTypeEnum) | — | — | 枚举: Question, Incident, Problem; 可空 |
| `cases_obj.closed_on` | string(date) | — | — | 可空 |
| `cases_obj.description` | string | — | — | 可空 |
| `cases_obj.created_by` | any | ✅ | — | 只读 |
| `cases_obj.created_at` | string(date-time) | ✅ | — | 只读 |
| `cases_obj.is_active` | boolean | — | — | — |
| `cases_obj.account` | → Account | ✅ | — | — |
| `cases_obj.account.id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.account.name` | string | ✅ | Account Name | ≤255字符 |
| `cases_obj.account.email` | string(email) | — | — | 可空; ≤254字符 |
| `cases_obj.account.phone` | string | — | — | 可空; ≤25字符; 正则: ^[\d\s\-\(\)\+\.]{7,25}$ |
| `cases_obj.account.website` | string(uri) | — | — | 可空; ≤200字符 |
| `cases_obj.account.industry` | enum(IndustryEnum) | — | — | 枚举: ADVERTISING, AGRICULTURE, APPAREL & ACCESSORIES, AUTOMOTIVE, BANKING, BIOTECHNOLOGY, BUILDING MATERIALS & EQUIPMENT, CHEMICAL, COMPUTER, EDUCATION, ELECTRONICS, ENERGY, ENTERTAINMENT & LEISURE, FINANCE, FOOD & BEVERAGE, GROCERY, HEALTHCARE, INSURANCE, LEGAL, MANUFACTURING, PUBLISHING, REAL ESTATE, SERVICE, SOFTWARE, SPORTS, TECHNOLOGY, TELECOMMUNICATIONS, TELEVISION, TRANSPORTATION, VENTURE CAPITAL; 可空 |
| `cases_obj.account.number_of_employees` | integer(int64) | — | — | 可空 |
| `cases_obj.account.annual_revenue` | string(decimal) | — | — | 可空; 正则: ^-?\d{0,13}(?:\.\d{0,2})?$ |
| `cases_obj.account.currency` | enum(CurrencyEnum) | — | — | 枚举: USD, EUR, GBP, INR, CAD, AUD, JPY, CNY, CHF, SGD, AED, BRL, MXN; 可空 |
| `cases_obj.account.address_line` | string | — | Address | 可空; ≤255字符 |
| `cases_obj.account.city` | string | — | — | 可空; ≤255字符 |
| `cases_obj.account.state` | string | — | — | 可空; ≤255字符 |
| `cases_obj.account.postcode` | string | — | Postal Code | 可空; ≤64字符 |
| `cases_obj.account.country` | enum(ClientCountryEnum) | — | — | 枚举: GB, AF, AX, AL, DZ, AS, AD, AO, AI, AQ, AG, AR, AM, AW, AU, AT, AZ, BS, BH, BD, BB, BY, BE, BZ, BJ, BM, BT, BO, BA, BW, BV, BR, IO, BN, BG, BF, BI, KH, CM, CA, CV, KY, CF, TD, CL, CN, CX, CC, CO, KM, CG, CD, CK, CR, CI, HR, CU, CY, CZ, DK, DJ, DM, DO, EC, EG, SV, GQ, ER, EE, ET, FK, FO, FJ, FI, FR, GF, PF, TF, GA, GM, GE, DE, GH, GI, GR, GL, GD, GP, GU, GT, GG, GN, GW, GY, HT, HM, VA, HN, HK, HU, IS, IN, ID, IR, IQ, IE, IM, IL, IT, JM, JP, JE, JO, KZ, KE, KI, KP, KR, KW, KG, LA, LV, LB, LS, LR, LY, LI, LT, LU, MO, MK, MG, MW, MY, MV, ML, MT, MH, MQ, MR, MU, YT, MX, FM, MD, MC, MN, ME, MS, MA, MZ, MM, NA, NR, NP, NL, AN, NC, NZ, NI, NE, NG, NU, NF, MP, NO, OM, PK, PW, PS, PA, PG, PY, PE, PH, PN, PL, PT, PR, QA, RE, RO, RU, RW, BL, SH, KN, LC, MF, PM, VC, WS, SM, ST, SA, SN, RS, SC, SL, SG, SK, SI, SB, SO, ZA, GS, ES, LK, SD, SR, SJ, SZ, SE, CH, SY, TW, TJ, TZ, TH, TL, TG, TK, TO, TT, TN, TR, TM, TC, TV, UG, UA, AE, US, UM, UY, UZ, VU, VE, VN, VG, VI, WF, EH, YE, ZM, ZW; 可空 |
| `cases_obj.account.country_display` | string | ✅ | — | 只读 |
| `cases_obj.account.assigned_to` | [Profile] | ✅ | — | 只读 |
| `cases_obj.account.assigned_to[].id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.account.assigned_to[].user_details` | object | ✅ | — | 只读 |
| `cases_obj.account.assigned_to[].role` | → ProfileRoleEnum | — | — | — |
| `cases_obj.account.assigned_to[].address` | string(uuid) | — | — | 可空 |
| `cases_obj.account.assigned_to[].has_marketing_access` | boolean | — | — | — |
| `cases_obj.account.assigned_to[].has_sales_access` | boolean | — | — | — |
| `cases_obj.account.assigned_to[].phone` | string | — | — | 可空; ≤20字符 |
| `cases_obj.account.assigned_to[].date_of_joining` | string(date) | — | — | 可空 |
| `cases_obj.account.assigned_to[].is_active` | boolean | — | — | — |
| `cases_obj.account.assigned_to[].created_at` | string(date-time) | ✅ | — | 只读 |
| `cases_obj.account.teams` | [Teams] | ✅ | — | 只读 |
| `cases_obj.account.teams[].id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.account.teams[].name` | string | ✅ | — | ≤100字符 |
| `cases_obj.account.teams[].description` | string | ✅ | — | — |
| `cases_obj.account.teams[].users` | [Profile] | ✅ | — | 只读 |
| `cases_obj.account.teams[].users[].id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.account.teams[].users[].user_details` | object | ✅ | — | 只读 |
| `cases_obj.account.teams[].users[].role` | → ProfileRoleEnum | — | — | — |
| `cases_obj.account.teams[].users[].address` | string(uuid) | — | — | 可空 |
| `cases_obj.account.teams[].users[].has_marketing_access` | boolean | — | — | — |
| `cases_obj.account.teams[].users[].has_sales_access` | boolean | — | — | — |
| `cases_obj.account.teams[].users[].phone` | string | — | — | 可空; ≤20字符 |
| `cases_obj.account.teams[].users[].date_of_joining` | string(date) | — | — | 可空 |
| `cases_obj.account.teams[].users[].is_active` | boolean | — | — | — |
| `cases_obj.account.teams[].users[].created_at` | string(date-time) | ✅ | — | 只读 |
| `cases_obj.account.teams[].created_at` | string(date-time) | ✅ | — | 只读 |
| `cases_obj.account.teams[].created_by` | → User | ✅ | — | — |
| `cases_obj.account.teams[].created_by.id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.account.teams[].created_by.email` | string(email) | — | Email address | ≤254字符 |
| `cases_obj.account.teams[].created_by.profile_pic` | string | — | — | 可空; ≤1000字符 |
| `cases_obj.account.contacts` | [Contact] | ✅ | — | 只读 |
| `cases_obj.account.contacts[].id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.account.contacts[].first_name` | string | ✅ | — | ≤255字符 |
| `cases_obj.account.contacts[].last_name` | string | ✅ | — | ≤255字符 |
| `cases_obj.account.contacts[].email` | string(email) | — | — | 可空; ≤254字符 |
| `cases_obj.account.contacts[].phone` | string | — | — | 可空; ≤25字符; 正则: ^[\d\s\-\(\)\+\.]{7,25}$ |
| `cases_obj.account.contacts[].organization` | string | — | Company | 可空; ≤255字符 |
| `cases_obj.account.contacts[].title` | string | — | Job Title | 可空; ≤255字符 |
| `cases_obj.account.contacts[].department` | string | — | — | 可空; ≤255字符 |
| `cases_obj.account.contacts[].do_not_call` | boolean | — | — | — |
| `cases_obj.account.contacts[].linkedin_url` | string(uri) | — | — | 可空; ≤200字符 |
| `cases_obj.account.contacts[].address_line` | string | — | Address | 可空; ≤255字符 |
| `cases_obj.account.contacts[].city` | string | — | — | 可空; ≤255字符 |
| `cases_obj.account.contacts[].state` | string | — | — | 可空; ≤255字符 |
| `cases_obj.account.contacts[].postcode` | string | — | Postal Code | 可空; ≤64字符 |
| `cases_obj.account.contacts[].country` | enum(ClientCountryEnum) | — | — | 枚举: GB, AF, AX, AL, DZ, AS, AD, AO, AI, AQ, AG, AR, AM, AW, AU, AT, AZ, BS, BH, BD, BB, BY, BE, BZ, BJ, BM, BT, BO, BA, BW, BV, BR, IO, BN, BG, BF, BI, KH, CM, CA, CV, KY, CF, TD, CL, CN, CX, CC, CO, KM, CG, CD, CK, CR, CI, HR, CU, CY, CZ, DK, DJ, DM, DO, EC, EG, SV, GQ, ER, EE, ET, FK, FO, FJ, FI, FR, GF, PF, TF, GA, GM, GE, DE, GH, GI, GR, GL, GD, GP, GU, GT, GG, GN, GW, GY, HT, HM, VA, HN, HK, HU, IS, IN, ID, IR, IQ, IE, IM, IL, IT, JM, JP, JE, JO, KZ, KE, KI, KP, KR, KW, KG, LA, LV, LB, LS, LR, LY, LI, LT, LU, MO, MK, MG, MW, MY, MV, ML, MT, MH, MQ, MR, MU, YT, MX, FM, MD, MC, MN, ME, MS, MA, MZ, MM, NA, NR, NP, NL, AN, NC, NZ, NI, NE, NG, NU, NF, MP, NO, OM, PK, PW, PS, PA, PG, PY, PE, PH, PN, PL, PT, PR, QA, RE, RO, RU, RW, BL, SH, KN, LC, MF, PM, VC, WS, SM, ST, SA, SN, RS, SC, SL, SG, SK, SI, SB, SO, ZA, GS, ES, LK, SD, SR, SJ, SZ, SE, CH, SY, TW, TJ, TZ, TH, TL, TG, TK, TO, TT, TN, TR, TM, TC, TV, UG, UA, AE, US, UM, UY, UZ, VU, VE, VN, VG, VI, WF, EH, YE, ZM, ZW; 可空 |
| `cases_obj.account.contacts[].assigned_to` | [Profile] | ✅ | — | 只读 |
| `cases_obj.account.contacts[].assigned_to[].id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.account.contacts[].assigned_to[].user_details` | object | ✅ | — | 只读 |
| `cases_obj.account.contacts[].assigned_to[].role` | → ProfileRoleEnum | — | — | — |
| `cases_obj.account.contacts[].assigned_to[].address` | string(uuid) | — | — | 可空 |
| `cases_obj.account.contacts[].assigned_to[].has_marketing_access` | boolean | — | — | — |
| `cases_obj.account.contacts[].assigned_to[].has_sales_access` | boolean | — | — | — |
| `cases_obj.account.contacts[].assigned_to[].phone` | string | — | — | 可空; ≤20字符 |
| `cases_obj.account.contacts[].assigned_to[].date_of_joining` | string(date) | — | — | 可空 |
| `cases_obj.account.contacts[].assigned_to[].is_active` | boolean | — | — | — |
| `cases_obj.account.contacts[].assigned_to[].created_at` | string(date-time) | ✅ | — | 只读 |
| `cases_obj.account.contacts[].teams` | [Teams] | ✅ | — | 只读 |
| `cases_obj.account.contacts[].teams[].id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.account.contacts[].teams[].name` | string | ✅ | — | ≤100字符 |
| `cases_obj.account.contacts[].teams[].description` | string | ✅ | — | — |
| `cases_obj.account.contacts[].teams[].users` | [Profile] | ✅ | — | 只读 |
| `cases_obj.account.contacts[].teams[].users[].id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.account.contacts[].teams[].users[].user_details` | object | ✅ | — | 只读 |
| `cases_obj.account.contacts[].teams[].users[].role` | → ProfileRoleEnum | — | — | — |
| `cases_obj.account.contacts[].teams[].users[].address` | string(uuid) | — | — | 可空 |
| `cases_obj.account.contacts[].teams[].users[].has_marketing_access` | boolean | — | — | — |
| `cases_obj.account.contacts[].teams[].users[].has_sales_access` | boolean | — | — | — |
| `cases_obj.account.contacts[].teams[].users[].phone` | string | — | — | 可空; ≤20字符 |
| `cases_obj.account.contacts[].teams[].users[].date_of_joining` | string(date) | — | — | 可空 |
| `cases_obj.account.contacts[].teams[].users[].is_active` | boolean | — | — | — |
| `cases_obj.account.contacts[].teams[].users[].created_at` | string(date-time) | ✅ | — | 只读 |
| `cases_obj.account.contacts[].teams[].created_at` | string(date-time) | ✅ | — | 只读 |
| `cases_obj.account.contacts[].teams[].created_by` | → User | ✅ | — | — |
| `cases_obj.account.contacts[].teams[].created_by.id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.account.contacts[].teams[].created_by.email` | string(email) | — | Email address | ≤254字符 |
| `cases_obj.account.contacts[].teams[].created_by.profile_pic` | string | — | — | 可空; ≤1000字符 |
| `cases_obj.account.contacts[].tags` | [string] | — | — | — |
| `cases_obj.account.contacts[].description` | string | — | Notes | 可空 |
| `cases_obj.account.contacts[].created_by` | string(uuid) | — | — | 可空 |
| `cases_obj.account.contacts[].created_at` | string(date-time) | ✅ | — | 只读 |
| `cases_obj.account.contacts[].is_active` | boolean | — | — | — |
| `cases_obj.account.contacts[].org` | → Organization | ✅ | — | — |
| `cases_obj.account.contacts[].org.id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.account.contacts[].org.name` | string | — | — | 可空; ≤100字符 |
| `cases_obj.account.contacts[].org.api_key` | string | ✅ | — | 只读 |
| `cases_obj.account.contacts[].account` | string(uuid) | — | Primary account this contact belongs to | 可空 |
| `cases_obj.account.contacts[].contact_attachment` | [Attachments] | ✅ | — | 只读 |
| `cases_obj.account.contacts[].contact_attachment[].id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.account.contacts[].contact_attachment[].created_by` | string(uuid) | — | — | 可空 |
| `cases_obj.account.contacts[].contact_attachment[].file_name` | string | ✅ | — | ≤60字符 |
| `cases_obj.account.contacts[].contact_attachment[].created_at` | string(date-time) | ✅ | — | 只读 |
| `cases_obj.account.contacts[].contact_attachment[].file_path` | string | ✅ | — | 只读 |
| `cases_obj.account.contacts[].contact_attachment[].content_type` | string | ✅ | Python model class name | 只读 |
| `cases_obj.account.contacts[].contact_attachment[].object_id` | string(uuid) | ✅ | — | — |
| `cases_obj.account.contacts[].contact_attachment[].org` | string(uuid) | ✅ | — | — |
| `cases_obj.account.tags` | [Tags] | ✅ | — | 只读 |
| `cases_obj.account.tags[].id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.account.tags[].name` | string | ✅ | — | ≤50字符 |
| `cases_obj.account.tags[].slug` | string | ✅ | — | 只读 |
| `cases_obj.account.tags[].color` | → ColorEnum | — | — | — |
| `cases_obj.account.tags[].description` | string | — | — | — |
| `cases_obj.account.tags[].is_active` | boolean | — | — | — |
| `cases_obj.account.tags[].created_at` | string(date-time) | ✅ | — | 只读 |
| `cases_obj.account.description` | string | — | Notes | 可空 |
| `cases_obj.account.account_attachment` | [Attachments] | ✅ | — | 只读 |
| `cases_obj.account.account_attachment[].id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.account.account_attachment[].created_by` | string(uuid) | — | — | 可空 |
| `cases_obj.account.account_attachment[].file_name` | string | ✅ | — | ≤60字符 |
| `cases_obj.account.account_attachment[].created_at` | string(date-time) | ✅ | — | 只读 |
| `cases_obj.account.account_attachment[].file_path` | string | ✅ | — | 只读 |
| `cases_obj.account.account_attachment[].content_type` | string | ✅ | Python model class name | 只读 |
| `cases_obj.account.account_attachment[].object_id` | string(uuid) | ✅ | — | — |
| `cases_obj.account.account_attachment[].org` | string(uuid) | ✅ | — | — |
| `cases_obj.account.cases` | [any] | ✅ | Return cases linked to this account | 只读 |
| `cases_obj.account.tasks` | [any] | ✅ | Return tasks linked to this account | 只读 |
| `cases_obj.account.opportunities` | [any] | ✅ | Return opportunities linked to this account | 只读 |
| `cases_obj.account.created_by` | → User | ✅ | — | — |
| `cases_obj.account.created_by.id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.account.created_by.email` | string(email) | — | Email address | ≤254字符 |
| `cases_obj.account.created_by.profile_pic` | string | — | — | 可空; ≤1000字符 |
| `cases_obj.account.created_at` | string(date-time) | ✅ | — | 只读 |
| `cases_obj.account.is_active` | boolean | — | — | — |
| `cases_obj.account.org` | → Organization | ✅ | — | — |
| `cases_obj.account.org.id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.account.org.name` | string | — | — | 可空; ≤100字符 |
| `cases_obj.account.org.api_key` | string | ✅ | — | 只读 |
| `cases_obj.contacts` | [Contact] | ✅ | — | 只读 |
| `cases_obj.contacts[].id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.contacts[].first_name` | string | ✅ | — | ≤255字符 |
| `cases_obj.contacts[].last_name` | string | ✅ | — | ≤255字符 |
| `cases_obj.contacts[].email` | string(email) | — | — | 可空; ≤254字符 |
| `cases_obj.contacts[].phone` | string | — | — | 可空; ≤25字符; 正则: ^[\d\s\-\(\)\+\.]{7,25}$ |
| `cases_obj.contacts[].organization` | string | — | Company | 可空; ≤255字符 |
| `cases_obj.contacts[].title` | string | — | Job Title | 可空; ≤255字符 |
| `cases_obj.contacts[].department` | string | — | — | 可空; ≤255字符 |
| `cases_obj.contacts[].do_not_call` | boolean | — | — | — |
| `cases_obj.contacts[].linkedin_url` | string(uri) | — | — | 可空; ≤200字符 |
| `cases_obj.contacts[].address_line` | string | — | Address | 可空; ≤255字符 |
| `cases_obj.contacts[].city` | string | — | — | 可空; ≤255字符 |
| `cases_obj.contacts[].state` | string | — | — | 可空; ≤255字符 |
| `cases_obj.contacts[].postcode` | string | — | Postal Code | 可空; ≤64字符 |
| `cases_obj.contacts[].country` | enum(ClientCountryEnum) | — | — | 枚举: GB, AF, AX, AL, DZ, AS, AD, AO, AI, AQ, AG, AR, AM, AW, AU, AT, AZ, BS, BH, BD, BB, BY, BE, BZ, BJ, BM, BT, BO, BA, BW, BV, BR, IO, BN, BG, BF, BI, KH, CM, CA, CV, KY, CF, TD, CL, CN, CX, CC, CO, KM, CG, CD, CK, CR, CI, HR, CU, CY, CZ, DK, DJ, DM, DO, EC, EG, SV, GQ, ER, EE, ET, FK, FO, FJ, FI, FR, GF, PF, TF, GA, GM, GE, DE, GH, GI, GR, GL, GD, GP, GU, GT, GG, GN, GW, GY, HT, HM, VA, HN, HK, HU, IS, IN, ID, IR, IQ, IE, IM, IL, IT, JM, JP, JE, JO, KZ, KE, KI, KP, KR, KW, KG, LA, LV, LB, LS, LR, LY, LI, LT, LU, MO, MK, MG, MW, MY, MV, ML, MT, MH, MQ, MR, MU, YT, MX, FM, MD, MC, MN, ME, MS, MA, MZ, MM, NA, NR, NP, NL, AN, NC, NZ, NI, NE, NG, NU, NF, MP, NO, OM, PK, PW, PS, PA, PG, PY, PE, PH, PN, PL, PT, PR, QA, RE, RO, RU, RW, BL, SH, KN, LC, MF, PM, VC, WS, SM, ST, SA, SN, RS, SC, SL, SG, SK, SI, SB, SO, ZA, GS, ES, LK, SD, SR, SJ, SZ, SE, CH, SY, TW, TJ, TZ, TH, TL, TG, TK, TO, TT, TN, TR, TM, TC, TV, UG, UA, AE, US, UM, UY, UZ, VU, VE, VN, VG, VI, WF, EH, YE, ZM, ZW; 可空 |
| `cases_obj.contacts[].assigned_to` | [Profile] | ✅ | — | 只读 |
| `cases_obj.contacts[].assigned_to[].id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.contacts[].assigned_to[].user_details` | object | ✅ | — | 只读 |
| `cases_obj.contacts[].assigned_to[].role` | → ProfileRoleEnum | — | — | — |
| `cases_obj.contacts[].assigned_to[].address` | string(uuid) | — | — | 可空 |
| `cases_obj.contacts[].assigned_to[].has_marketing_access` | boolean | — | — | — |
| `cases_obj.contacts[].assigned_to[].has_sales_access` | boolean | — | — | — |
| `cases_obj.contacts[].assigned_to[].phone` | string | — | — | 可空; ≤20字符 |
| `cases_obj.contacts[].assigned_to[].date_of_joining` | string(date) | — | — | 可空 |
| `cases_obj.contacts[].assigned_to[].is_active` | boolean | — | — | — |
| `cases_obj.contacts[].assigned_to[].created_at` | string(date-time) | ✅ | — | 只读 |
| `cases_obj.contacts[].teams` | [Teams] | ✅ | — | 只读 |
| `cases_obj.contacts[].teams[].id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.contacts[].teams[].name` | string | ✅ | — | ≤100字符 |
| `cases_obj.contacts[].teams[].description` | string | ✅ | — | — |
| `cases_obj.contacts[].teams[].users` | [Profile] | ✅ | — | 只读 |
| `cases_obj.contacts[].teams[].users[].id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.contacts[].teams[].users[].user_details` | object | ✅ | — | 只读 |
| `cases_obj.contacts[].teams[].users[].role` | → ProfileRoleEnum | — | — | — |
| `cases_obj.contacts[].teams[].users[].address` | string(uuid) | — | — | 可空 |
| `cases_obj.contacts[].teams[].users[].has_marketing_access` | boolean | — | — | — |
| `cases_obj.contacts[].teams[].users[].has_sales_access` | boolean | — | — | — |
| `cases_obj.contacts[].teams[].users[].phone` | string | — | — | 可空; ≤20字符 |
| `cases_obj.contacts[].teams[].users[].date_of_joining` | string(date) | — | — | 可空 |
| `cases_obj.contacts[].teams[].users[].is_active` | boolean | — | — | — |
| `cases_obj.contacts[].teams[].users[].created_at` | string(date-time) | ✅ | — | 只读 |
| `cases_obj.contacts[].teams[].created_at` | string(date-time) | ✅ | — | 只读 |
| `cases_obj.contacts[].teams[].created_by` | → User | ✅ | — | — |
| `cases_obj.contacts[].teams[].created_by.id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.contacts[].teams[].created_by.email` | string(email) | — | Email address | ≤254字符 |
| `cases_obj.contacts[].teams[].created_by.profile_pic` | string | — | — | 可空; ≤1000字符 |
| `cases_obj.contacts[].tags` | [string] | — | — | — |
| `cases_obj.contacts[].description` | string | — | Notes | 可空 |
| `cases_obj.contacts[].created_by` | string(uuid) | — | — | 可空 |
| `cases_obj.contacts[].created_at` | string(date-time) | ✅ | — | 只读 |
| `cases_obj.contacts[].is_active` | boolean | — | — | — |
| `cases_obj.contacts[].org` | → Organization | ✅ | — | — |
| `cases_obj.contacts[].org.id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.contacts[].org.name` | string | — | — | 可空; ≤100字符 |
| `cases_obj.contacts[].org.api_key` | string | ✅ | — | 只读 |
| `cases_obj.contacts[].account` | string(uuid) | — | Primary account this contact belongs to | 可空 |
| `cases_obj.contacts[].contact_attachment` | [Attachments] | ✅ | — | 只读 |
| `cases_obj.contacts[].contact_attachment[].id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.contacts[].contact_attachment[].created_by` | string(uuid) | — | — | 可空 |
| `cases_obj.contacts[].contact_attachment[].file_name` | string | ✅ | — | ≤60字符 |
| `cases_obj.contacts[].contact_attachment[].created_at` | string(date-time) | ✅ | — | 只读 |
| `cases_obj.contacts[].contact_attachment[].file_path` | string | ✅ | — | 只读 |
| `cases_obj.contacts[].contact_attachment[].content_type` | string | ✅ | Python model class name | 只读 |
| `cases_obj.contacts[].contact_attachment[].object_id` | string(uuid) | ✅ | — | — |
| `cases_obj.contacts[].contact_attachment[].org` | string(uuid) | ✅ | — | — |
| `cases_obj.teams` | [Teams] | ✅ | — | 只读 |
| `cases_obj.teams[].id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.teams[].name` | string | ✅ | — | ≤100字符 |
| `cases_obj.teams[].description` | string | ✅ | — | — |
| `cases_obj.teams[].users` | [Profile] | ✅ | — | 只读 |
| `cases_obj.teams[].users[].id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.teams[].users[].user_details` | object | ✅ | — | 只读 |
| `cases_obj.teams[].users[].role` | → ProfileRoleEnum | — | — | — |
| `cases_obj.teams[].users[].address` | string(uuid) | — | — | 可空 |
| `cases_obj.teams[].users[].has_marketing_access` | boolean | — | — | — |
| `cases_obj.teams[].users[].has_sales_access` | boolean | — | — | — |
| `cases_obj.teams[].users[].phone` | string | — | — | 可空; ≤20字符 |
| `cases_obj.teams[].users[].date_of_joining` | string(date) | — | — | 可空 |
| `cases_obj.teams[].users[].is_active` | boolean | — | — | — |
| `cases_obj.teams[].users[].created_at` | string(date-time) | ✅ | — | 只读 |
| `cases_obj.teams[].created_at` | string(date-time) | ✅ | — | 只读 |
| `cases_obj.teams[].created_by` | → User | ✅ | — | — |
| `cases_obj.teams[].created_by.id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.teams[].created_by.email` | string(email) | — | Email address | ≤254字符 |
| `cases_obj.teams[].created_by.profile_pic` | string | — | — | 可空; ≤1000字符 |
| `cases_obj.assigned_to` | [Profile] | ✅ | — | 只读 |
| `cases_obj.assigned_to[].id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.assigned_to[].user_details` | object | ✅ | — | 只读 |
| `cases_obj.assigned_to[].role` | → ProfileRoleEnum | — | — | — |
| `cases_obj.assigned_to[].address` | string(uuid) | — | — | 可空 |
| `cases_obj.assigned_to[].has_marketing_access` | boolean | — | — | — |
| `cases_obj.assigned_to[].has_sales_access` | boolean | — | — | — |
| `cases_obj.assigned_to[].phone` | string | — | — | 可空; ≤20字符 |
| `cases_obj.assigned_to[].date_of_joining` | string(date) | — | — | 可空 |
| `cases_obj.assigned_to[].is_active` | boolean | — | — | — |
| `cases_obj.assigned_to[].created_at` | string(date-time) | ✅ | — | 只读 |
| `cases_obj.tags` | [Tags] | ✅ | — | 只读 |
| `cases_obj.tags[].id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.tags[].name` | string | ✅ | — | ≤50字符 |
| `cases_obj.tags[].slug` | string | ✅ | — | 只读 |
| `cases_obj.tags[].color` | → ColorEnum | — | — | — |
| `cases_obj.tags[].description` | string | — | — | — |
| `cases_obj.tags[].is_active` | boolean | — | — | — |
| `cases_obj.tags[].created_at` | string(date-time) | ✅ | — | 只读 |
| `cases_obj.org` | → Organization | ✅ | — | — |
| `cases_obj.org.id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.org.name` | string | — | — | 可空; ≤100字符 |
| `cases_obj.org.api_key` | string | ✅ | — | 只读 |
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
| `comment_permission` | boolean | ✅ | — | — |
| `users_mention` | [any] | ✅ | — | — |

**可能的错误响应（DRF 标准）**

- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）
- **400**: 请求参数校验失败（query/header/body 不合法）

---
### PATCH `/api/cases/{id}/` 🔒

部分更新工单

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**请求体** `application/json`

**Schema: `PatchedCaseCreateSwaggerRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `name` | string | — | — | ≤64字符 |
| `status` | → CaseStatusEnum | — | — | — |
| `priority` | → CasePriorityEnum | — | — | — |
| `case_type` | enum(CaseTypeEnum) | — | — | 枚举: Question, Incident, Problem; 可空 |
| `closed_on` | string(date) | — | — | 可空 |
| `teams` | [string] | — | — | — |
| `assigned_to` | [string] | — | — | — |
| `account` | string(uuid) | — | — | 可空 |
| `contacts` | [string] | — | — | — |
| `tags` | [string] | — | — | — |
| `description` | string | — | — | 可空 |

**200** → `CasePatchResponse`

**Schema: `CasePatchResponse`**

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
### POST `/api/cases/{id}/` 🔒

编辑工单详情（含附件/评论）

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**请求体** `application/json`

> 编辑工单详情（含附件/评论）

**Schema: `CaseDetailEditSwaggerRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `comment` | string | ✅ | — | — |
| `case_attachment` | string(binary) | ✅ | — | — |

**200** → `CaseCommentAttachmentResponse`

**Schema: `CaseCommentAttachmentResponse`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `cases_obj` | → Case | ✅ | — | — |
| `cases_obj.id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.name` | string | ✅ | — | ≤64字符 |
| `cases_obj.status` | → CaseStatusEnum | ✅ | — | — |
| `cases_obj.priority` | → CasePriorityEnum | ✅ | — | — |
| `cases_obj.case_type` | enum(CaseTypeEnum) | — | — | 枚举: Question, Incident, Problem; 可空 |
| `cases_obj.closed_on` | string(date) | — | — | 可空 |
| `cases_obj.description` | string | — | — | 可空 |
| `cases_obj.created_by` | any | ✅ | — | 只读 |
| `cases_obj.created_at` | string(date-time) | ✅ | — | 只读 |
| `cases_obj.is_active` | boolean | — | — | — |
| `cases_obj.account` | → Account | ✅ | — | — |
| `cases_obj.account.id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.account.name` | string | ✅ | Account Name | ≤255字符 |
| `cases_obj.account.email` | string(email) | — | — | 可空; ≤254字符 |
| `cases_obj.account.phone` | string | — | — | 可空; ≤25字符; 正则: ^[\d\s\-\(\)\+\.]{7,25}$ |
| `cases_obj.account.website` | string(uri) | — | — | 可空; ≤200字符 |
| `cases_obj.account.industry` | enum(IndustryEnum) | — | — | 枚举: ADVERTISING, AGRICULTURE, APPAREL & ACCESSORIES, AUTOMOTIVE, BANKING, BIOTECHNOLOGY, BUILDING MATERIALS & EQUIPMENT, CHEMICAL, COMPUTER, EDUCATION, ELECTRONICS, ENERGY, ENTERTAINMENT & LEISURE, FINANCE, FOOD & BEVERAGE, GROCERY, HEALTHCARE, INSURANCE, LEGAL, MANUFACTURING, PUBLISHING, REAL ESTATE, SERVICE, SOFTWARE, SPORTS, TECHNOLOGY, TELECOMMUNICATIONS, TELEVISION, TRANSPORTATION, VENTURE CAPITAL; 可空 |
| `cases_obj.account.number_of_employees` | integer(int64) | — | — | 可空 |
| `cases_obj.account.annual_revenue` | string(decimal) | — | — | 可空; 正则: ^-?\d{0,13}(?:\.\d{0,2})?$ |
| `cases_obj.account.currency` | enum(CurrencyEnum) | — | — | 枚举: USD, EUR, GBP, INR, CAD, AUD, JPY, CNY, CHF, SGD, AED, BRL, MXN; 可空 |
| `cases_obj.account.address_line` | string | — | Address | 可空; ≤255字符 |
| `cases_obj.account.city` | string | — | — | 可空; ≤255字符 |
| `cases_obj.account.state` | string | — | — | 可空; ≤255字符 |
| `cases_obj.account.postcode` | string | — | Postal Code | 可空; ≤64字符 |
| `cases_obj.account.country` | enum(ClientCountryEnum) | — | — | 枚举: GB, AF, AX, AL, DZ, AS, AD, AO, AI, AQ, AG, AR, AM, AW, AU, AT, AZ, BS, BH, BD, BB, BY, BE, BZ, BJ, BM, BT, BO, BA, BW, BV, BR, IO, BN, BG, BF, BI, KH, CM, CA, CV, KY, CF, TD, CL, CN, CX, CC, CO, KM, CG, CD, CK, CR, CI, HR, CU, CY, CZ, DK, DJ, DM, DO, EC, EG, SV, GQ, ER, EE, ET, FK, FO, FJ, FI, FR, GF, PF, TF, GA, GM, GE, DE, GH, GI, GR, GL, GD, GP, GU, GT, GG, GN, GW, GY, HT, HM, VA, HN, HK, HU, IS, IN, ID, IR, IQ, IE, IM, IL, IT, JM, JP, JE, JO, KZ, KE, KI, KP, KR, KW, KG, LA, LV, LB, LS, LR, LY, LI, LT, LU, MO, MK, MG, MW, MY, MV, ML, MT, MH, MQ, MR, MU, YT, MX, FM, MD, MC, MN, ME, MS, MA, MZ, MM, NA, NR, NP, NL, AN, NC, NZ, NI, NE, NG, NU, NF, MP, NO, OM, PK, PW, PS, PA, PG, PY, PE, PH, PN, PL, PT, PR, QA, RE, RO, RU, RW, BL, SH, KN, LC, MF, PM, VC, WS, SM, ST, SA, SN, RS, SC, SL, SG, SK, SI, SB, SO, ZA, GS, ES, LK, SD, SR, SJ, SZ, SE, CH, SY, TW, TJ, TZ, TH, TL, TG, TK, TO, TT, TN, TR, TM, TC, TV, UG, UA, AE, US, UM, UY, UZ, VU, VE, VN, VG, VI, WF, EH, YE, ZM, ZW; 可空 |
| `cases_obj.account.country_display` | string | ✅ | — | 只读 |
| `cases_obj.account.assigned_to` | [Profile] | ✅ | — | 只读 |
| `cases_obj.account.assigned_to[].id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.account.assigned_to[].user_details` | object | ✅ | — | 只读 |
| `cases_obj.account.assigned_to[].role` | → ProfileRoleEnum | — | — | — |
| `cases_obj.account.assigned_to[].address` | string(uuid) | — | — | 可空 |
| `cases_obj.account.assigned_to[].has_marketing_access` | boolean | — | — | — |
| `cases_obj.account.assigned_to[].has_sales_access` | boolean | — | — | — |
| `cases_obj.account.assigned_to[].phone` | string | — | — | 可空; ≤20字符 |
| `cases_obj.account.assigned_to[].date_of_joining` | string(date) | — | — | 可空 |
| `cases_obj.account.assigned_to[].is_active` | boolean | — | — | — |
| `cases_obj.account.assigned_to[].created_at` | string(date-time) | ✅ | — | 只读 |
| `cases_obj.account.teams` | [Teams] | ✅ | — | 只读 |
| `cases_obj.account.teams[].id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.account.teams[].name` | string | ✅ | — | ≤100字符 |
| `cases_obj.account.teams[].description` | string | ✅ | — | — |
| `cases_obj.account.teams[].users` | [Profile] | ✅ | — | 只读 |
| `cases_obj.account.teams[].users[].id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.account.teams[].users[].user_details` | object | ✅ | — | 只读 |
| `cases_obj.account.teams[].users[].role` | → ProfileRoleEnum | — | — | — |
| `cases_obj.account.teams[].users[].address` | string(uuid) | — | — | 可空 |
| `cases_obj.account.teams[].users[].has_marketing_access` | boolean | — | — | — |
| `cases_obj.account.teams[].users[].has_sales_access` | boolean | — | — | — |
| `cases_obj.account.teams[].users[].phone` | string | — | — | 可空; ≤20字符 |
| `cases_obj.account.teams[].users[].date_of_joining` | string(date) | — | — | 可空 |
| `cases_obj.account.teams[].users[].is_active` | boolean | — | — | — |
| `cases_obj.account.teams[].users[].created_at` | string(date-time) | ✅ | — | 只读 |
| `cases_obj.account.teams[].created_at` | string(date-time) | ✅ | — | 只读 |
| `cases_obj.account.teams[].created_by` | → User | ✅ | — | — |
| `cases_obj.account.teams[].created_by.id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.account.teams[].created_by.email` | string(email) | — | Email address | ≤254字符 |
| `cases_obj.account.teams[].created_by.profile_pic` | string | — | — | 可空; ≤1000字符 |
| `cases_obj.account.contacts` | [Contact] | ✅ | — | 只读 |
| `cases_obj.account.contacts[].id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.account.contacts[].first_name` | string | ✅ | — | ≤255字符 |
| `cases_obj.account.contacts[].last_name` | string | ✅ | — | ≤255字符 |
| `cases_obj.account.contacts[].email` | string(email) | — | — | 可空; ≤254字符 |
| `cases_obj.account.contacts[].phone` | string | — | — | 可空; ≤25字符; 正则: ^[\d\s\-\(\)\+\.]{7,25}$ |
| `cases_obj.account.contacts[].organization` | string | — | Company | 可空; ≤255字符 |
| `cases_obj.account.contacts[].title` | string | — | Job Title | 可空; ≤255字符 |
| `cases_obj.account.contacts[].department` | string | — | — | 可空; ≤255字符 |
| `cases_obj.account.contacts[].do_not_call` | boolean | — | — | — |
| `cases_obj.account.contacts[].linkedin_url` | string(uri) | — | — | 可空; ≤200字符 |
| `cases_obj.account.contacts[].address_line` | string | — | Address | 可空; ≤255字符 |
| `cases_obj.account.contacts[].city` | string | — | — | 可空; ≤255字符 |
| `cases_obj.account.contacts[].state` | string | — | — | 可空; ≤255字符 |
| `cases_obj.account.contacts[].postcode` | string | — | Postal Code | 可空; ≤64字符 |
| `cases_obj.account.contacts[].country` | enum(ClientCountryEnum) | — | — | 枚举: GB, AF, AX, AL, DZ, AS, AD, AO, AI, AQ, AG, AR, AM, AW, AU, AT, AZ, BS, BH, BD, BB, BY, BE, BZ, BJ, BM, BT, BO, BA, BW, BV, BR, IO, BN, BG, BF, BI, KH, CM, CA, CV, KY, CF, TD, CL, CN, CX, CC, CO, KM, CG, CD, CK, CR, CI, HR, CU, CY, CZ, DK, DJ, DM, DO, EC, EG, SV, GQ, ER, EE, ET, FK, FO, FJ, FI, FR, GF, PF, TF, GA, GM, GE, DE, GH, GI, GR, GL, GD, GP, GU, GT, GG, GN, GW, GY, HT, HM, VA, HN, HK, HU, IS, IN, ID, IR, IQ, IE, IM, IL, IT, JM, JP, JE, JO, KZ, KE, KI, KP, KR, KW, KG, LA, LV, LB, LS, LR, LY, LI, LT, LU, MO, MK, MG, MW, MY, MV, ML, MT, MH, MQ, MR, MU, YT, MX, FM, MD, MC, MN, ME, MS, MA, MZ, MM, NA, NR, NP, NL, AN, NC, NZ, NI, NE, NG, NU, NF, MP, NO, OM, PK, PW, PS, PA, PG, PY, PE, PH, PN, PL, PT, PR, QA, RE, RO, RU, RW, BL, SH, KN, LC, MF, PM, VC, WS, SM, ST, SA, SN, RS, SC, SL, SG, SK, SI, SB, SO, ZA, GS, ES, LK, SD, SR, SJ, SZ, SE, CH, SY, TW, TJ, TZ, TH, TL, TG, TK, TO, TT, TN, TR, TM, TC, TV, UG, UA, AE, US, UM, UY, UZ, VU, VE, VN, VG, VI, WF, EH, YE, ZM, ZW; 可空 |
| `cases_obj.account.contacts[].assigned_to` | [Profile] | ✅ | — | 只读 |
| `cases_obj.account.contacts[].assigned_to[].id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.account.contacts[].assigned_to[].user_details` | object | ✅ | — | 只读 |
| `cases_obj.account.contacts[].assigned_to[].role` | → ProfileRoleEnum | — | — | — |
| `cases_obj.account.contacts[].assigned_to[].address` | string(uuid) | — | — | 可空 |
| `cases_obj.account.contacts[].assigned_to[].has_marketing_access` | boolean | — | — | — |
| `cases_obj.account.contacts[].assigned_to[].has_sales_access` | boolean | — | — | — |
| `cases_obj.account.contacts[].assigned_to[].phone` | string | — | — | 可空; ≤20字符 |
| `cases_obj.account.contacts[].assigned_to[].date_of_joining` | string(date) | — | — | 可空 |
| `cases_obj.account.contacts[].assigned_to[].is_active` | boolean | — | — | — |
| `cases_obj.account.contacts[].assigned_to[].created_at` | string(date-time) | ✅ | — | 只读 |
| `cases_obj.account.contacts[].teams` | [Teams] | ✅ | — | 只读 |
| `cases_obj.account.contacts[].teams[].id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.account.contacts[].teams[].name` | string | ✅ | — | ≤100字符 |
| `cases_obj.account.contacts[].teams[].description` | string | ✅ | — | — |
| `cases_obj.account.contacts[].teams[].users` | [Profile] | ✅ | — | 只读 |
| `cases_obj.account.contacts[].teams[].users[].id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.account.contacts[].teams[].users[].user_details` | object | ✅ | — | 只读 |
| `cases_obj.account.contacts[].teams[].users[].role` | → ProfileRoleEnum | — | — | — |
| `cases_obj.account.contacts[].teams[].users[].address` | string(uuid) | — | — | 可空 |
| `cases_obj.account.contacts[].teams[].users[].has_marketing_access` | boolean | — | — | — |
| `cases_obj.account.contacts[].teams[].users[].has_sales_access` | boolean | — | — | — |
| `cases_obj.account.contacts[].teams[].users[].phone` | string | — | — | 可空; ≤20字符 |
| `cases_obj.account.contacts[].teams[].users[].date_of_joining` | string(date) | — | — | 可空 |
| `cases_obj.account.contacts[].teams[].users[].is_active` | boolean | — | — | — |
| `cases_obj.account.contacts[].teams[].users[].created_at` | string(date-time) | ✅ | — | 只读 |
| `cases_obj.account.contacts[].teams[].created_at` | string(date-time) | ✅ | — | 只读 |
| `cases_obj.account.contacts[].teams[].created_by` | → User | ✅ | — | — |
| `cases_obj.account.contacts[].teams[].created_by.id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.account.contacts[].teams[].created_by.email` | string(email) | — | Email address | ≤254字符 |
| `cases_obj.account.contacts[].teams[].created_by.profile_pic` | string | — | — | 可空; ≤1000字符 |
| `cases_obj.account.contacts[].tags` | [string] | — | — | — |
| `cases_obj.account.contacts[].description` | string | — | Notes | 可空 |
| `cases_obj.account.contacts[].created_by` | string(uuid) | — | — | 可空 |
| `cases_obj.account.contacts[].created_at` | string(date-time) | ✅ | — | 只读 |
| `cases_obj.account.contacts[].is_active` | boolean | — | — | — |
| `cases_obj.account.contacts[].org` | → Organization | ✅ | — | — |
| `cases_obj.account.contacts[].org.id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.account.contacts[].org.name` | string | — | — | 可空; ≤100字符 |
| `cases_obj.account.contacts[].org.api_key` | string | ✅ | — | 只读 |
| `cases_obj.account.contacts[].account` | string(uuid) | — | Primary account this contact belongs to | 可空 |
| `cases_obj.account.contacts[].contact_attachment` | [Attachments] | ✅ | — | 只读 |
| `cases_obj.account.contacts[].contact_attachment[].id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.account.contacts[].contact_attachment[].created_by` | string(uuid) | — | — | 可空 |
| `cases_obj.account.contacts[].contact_attachment[].file_name` | string | ✅ | — | ≤60字符 |
| `cases_obj.account.contacts[].contact_attachment[].created_at` | string(date-time) | ✅ | — | 只读 |
| `cases_obj.account.contacts[].contact_attachment[].file_path` | string | ✅ | — | 只读 |
| `cases_obj.account.contacts[].contact_attachment[].content_type` | string | ✅ | Python model class name | 只读 |
| `cases_obj.account.contacts[].contact_attachment[].object_id` | string(uuid) | ✅ | — | — |
| `cases_obj.account.contacts[].contact_attachment[].org` | string(uuid) | ✅ | — | — |
| `cases_obj.account.tags` | [Tags] | ✅ | — | 只读 |
| `cases_obj.account.tags[].id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.account.tags[].name` | string | ✅ | — | ≤50字符 |
| `cases_obj.account.tags[].slug` | string | ✅ | — | 只读 |
| `cases_obj.account.tags[].color` | → ColorEnum | — | — | — |
| `cases_obj.account.tags[].description` | string | — | — | — |
| `cases_obj.account.tags[].is_active` | boolean | — | — | — |
| `cases_obj.account.tags[].created_at` | string(date-time) | ✅ | — | 只读 |
| `cases_obj.account.description` | string | — | Notes | 可空 |
| `cases_obj.account.account_attachment` | [Attachments] | ✅ | — | 只读 |
| `cases_obj.account.account_attachment[].id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.account.account_attachment[].created_by` | string(uuid) | — | — | 可空 |
| `cases_obj.account.account_attachment[].file_name` | string | ✅ | — | ≤60字符 |
| `cases_obj.account.account_attachment[].created_at` | string(date-time) | ✅ | — | 只读 |
| `cases_obj.account.account_attachment[].file_path` | string | ✅ | — | 只读 |
| `cases_obj.account.account_attachment[].content_type` | string | ✅ | Python model class name | 只读 |
| `cases_obj.account.account_attachment[].object_id` | string(uuid) | ✅ | — | — |
| `cases_obj.account.account_attachment[].org` | string(uuid) | ✅ | — | — |
| `cases_obj.account.cases` | [any] | ✅ | Return cases linked to this account | 只读 |
| `cases_obj.account.tasks` | [any] | ✅ | Return tasks linked to this account | 只读 |
| `cases_obj.account.opportunities` | [any] | ✅ | Return opportunities linked to this account | 只读 |
| `cases_obj.account.created_by` | → User | ✅ | — | — |
| `cases_obj.account.created_by.id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.account.created_by.email` | string(email) | — | Email address | ≤254字符 |
| `cases_obj.account.created_by.profile_pic` | string | — | — | 可空; ≤1000字符 |
| `cases_obj.account.created_at` | string(date-time) | ✅ | — | 只读 |
| `cases_obj.account.is_active` | boolean | — | — | — |
| `cases_obj.account.org` | → Organization | ✅ | — | — |
| `cases_obj.account.org.id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.account.org.name` | string | — | — | 可空; ≤100字符 |
| `cases_obj.account.org.api_key` | string | ✅ | — | 只读 |
| `cases_obj.contacts` | [Contact] | ✅ | — | 只读 |
| `cases_obj.contacts[].id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.contacts[].first_name` | string | ✅ | — | ≤255字符 |
| `cases_obj.contacts[].last_name` | string | ✅ | — | ≤255字符 |
| `cases_obj.contacts[].email` | string(email) | — | — | 可空; ≤254字符 |
| `cases_obj.contacts[].phone` | string | — | — | 可空; ≤25字符; 正则: ^[\d\s\-\(\)\+\.]{7,25}$ |
| `cases_obj.contacts[].organization` | string | — | Company | 可空; ≤255字符 |
| `cases_obj.contacts[].title` | string | — | Job Title | 可空; ≤255字符 |
| `cases_obj.contacts[].department` | string | — | — | 可空; ≤255字符 |
| `cases_obj.contacts[].do_not_call` | boolean | — | — | — |
| `cases_obj.contacts[].linkedin_url` | string(uri) | — | — | 可空; ≤200字符 |
| `cases_obj.contacts[].address_line` | string | — | Address | 可空; ≤255字符 |
| `cases_obj.contacts[].city` | string | — | — | 可空; ≤255字符 |
| `cases_obj.contacts[].state` | string | — | — | 可空; ≤255字符 |
| `cases_obj.contacts[].postcode` | string | — | Postal Code | 可空; ≤64字符 |
| `cases_obj.contacts[].country` | enum(ClientCountryEnum) | — | — | 枚举: GB, AF, AX, AL, DZ, AS, AD, AO, AI, AQ, AG, AR, AM, AW, AU, AT, AZ, BS, BH, BD, BB, BY, BE, BZ, BJ, BM, BT, BO, BA, BW, BV, BR, IO, BN, BG, BF, BI, KH, CM, CA, CV, KY, CF, TD, CL, CN, CX, CC, CO, KM, CG, CD, CK, CR, CI, HR, CU, CY, CZ, DK, DJ, DM, DO, EC, EG, SV, GQ, ER, EE, ET, FK, FO, FJ, FI, FR, GF, PF, TF, GA, GM, GE, DE, GH, GI, GR, GL, GD, GP, GU, GT, GG, GN, GW, GY, HT, HM, VA, HN, HK, HU, IS, IN, ID, IR, IQ, IE, IM, IL, IT, JM, JP, JE, JO, KZ, KE, KI, KP, KR, KW, KG, LA, LV, LB, LS, LR, LY, LI, LT, LU, MO, MK, MG, MW, MY, MV, ML, MT, MH, MQ, MR, MU, YT, MX, FM, MD, MC, MN, ME, MS, MA, MZ, MM, NA, NR, NP, NL, AN, NC, NZ, NI, NE, NG, NU, NF, MP, NO, OM, PK, PW, PS, PA, PG, PY, PE, PH, PN, PL, PT, PR, QA, RE, RO, RU, RW, BL, SH, KN, LC, MF, PM, VC, WS, SM, ST, SA, SN, RS, SC, SL, SG, SK, SI, SB, SO, ZA, GS, ES, LK, SD, SR, SJ, SZ, SE, CH, SY, TW, TJ, TZ, TH, TL, TG, TK, TO, TT, TN, TR, TM, TC, TV, UG, UA, AE, US, UM, UY, UZ, VU, VE, VN, VG, VI, WF, EH, YE, ZM, ZW; 可空 |
| `cases_obj.contacts[].assigned_to` | [Profile] | ✅ | — | 只读 |
| `cases_obj.contacts[].assigned_to[].id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.contacts[].assigned_to[].user_details` | object | ✅ | — | 只读 |
| `cases_obj.contacts[].assigned_to[].role` | → ProfileRoleEnum | — | — | — |
| `cases_obj.contacts[].assigned_to[].address` | string(uuid) | — | — | 可空 |
| `cases_obj.contacts[].assigned_to[].has_marketing_access` | boolean | — | — | — |
| `cases_obj.contacts[].assigned_to[].has_sales_access` | boolean | — | — | — |
| `cases_obj.contacts[].assigned_to[].phone` | string | — | — | 可空; ≤20字符 |
| `cases_obj.contacts[].assigned_to[].date_of_joining` | string(date) | — | — | 可空 |
| `cases_obj.contacts[].assigned_to[].is_active` | boolean | — | — | — |
| `cases_obj.contacts[].assigned_to[].created_at` | string(date-time) | ✅ | — | 只读 |
| `cases_obj.contacts[].teams` | [Teams] | ✅ | — | 只读 |
| `cases_obj.contacts[].teams[].id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.contacts[].teams[].name` | string | ✅ | — | ≤100字符 |
| `cases_obj.contacts[].teams[].description` | string | ✅ | — | — |
| `cases_obj.contacts[].teams[].users` | [Profile] | ✅ | — | 只读 |
| `cases_obj.contacts[].teams[].users[].id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.contacts[].teams[].users[].user_details` | object | ✅ | — | 只读 |
| `cases_obj.contacts[].teams[].users[].role` | → ProfileRoleEnum | — | — | — |
| `cases_obj.contacts[].teams[].users[].address` | string(uuid) | — | — | 可空 |
| `cases_obj.contacts[].teams[].users[].has_marketing_access` | boolean | — | — | — |
| `cases_obj.contacts[].teams[].users[].has_sales_access` | boolean | — | — | — |
| `cases_obj.contacts[].teams[].users[].phone` | string | — | — | 可空; ≤20字符 |
| `cases_obj.contacts[].teams[].users[].date_of_joining` | string(date) | — | — | 可空 |
| `cases_obj.contacts[].teams[].users[].is_active` | boolean | — | — | — |
| `cases_obj.contacts[].teams[].users[].created_at` | string(date-time) | ✅ | — | 只读 |
| `cases_obj.contacts[].teams[].created_at` | string(date-time) | ✅ | — | 只读 |
| `cases_obj.contacts[].teams[].created_by` | → User | ✅ | — | — |
| `cases_obj.contacts[].teams[].created_by.id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.contacts[].teams[].created_by.email` | string(email) | — | Email address | ≤254字符 |
| `cases_obj.contacts[].teams[].created_by.profile_pic` | string | — | — | 可空; ≤1000字符 |
| `cases_obj.contacts[].tags` | [string] | — | — | — |
| `cases_obj.contacts[].description` | string | — | Notes | 可空 |
| `cases_obj.contacts[].created_by` | string(uuid) | — | — | 可空 |
| `cases_obj.contacts[].created_at` | string(date-time) | ✅ | — | 只读 |
| `cases_obj.contacts[].is_active` | boolean | — | — | — |
| `cases_obj.contacts[].org` | → Organization | ✅ | — | — |
| `cases_obj.contacts[].org.id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.contacts[].org.name` | string | — | — | 可空; ≤100字符 |
| `cases_obj.contacts[].org.api_key` | string | ✅ | — | 只读 |
| `cases_obj.contacts[].account` | string(uuid) | — | Primary account this contact belongs to | 可空 |
| `cases_obj.contacts[].contact_attachment` | [Attachments] | ✅ | — | 只读 |
| `cases_obj.contacts[].contact_attachment[].id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.contacts[].contact_attachment[].created_by` | string(uuid) | — | — | 可空 |
| `cases_obj.contacts[].contact_attachment[].file_name` | string | ✅ | — | ≤60字符 |
| `cases_obj.contacts[].contact_attachment[].created_at` | string(date-time) | ✅ | — | 只读 |
| `cases_obj.contacts[].contact_attachment[].file_path` | string | ✅ | — | 只读 |
| `cases_obj.contacts[].contact_attachment[].content_type` | string | ✅ | Python model class name | 只读 |
| `cases_obj.contacts[].contact_attachment[].object_id` | string(uuid) | ✅ | — | — |
| `cases_obj.contacts[].contact_attachment[].org` | string(uuid) | ✅ | — | — |
| `cases_obj.teams` | [Teams] | ✅ | — | 只读 |
| `cases_obj.teams[].id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.teams[].name` | string | ✅ | — | ≤100字符 |
| `cases_obj.teams[].description` | string | ✅ | — | — |
| `cases_obj.teams[].users` | [Profile] | ✅ | — | 只读 |
| `cases_obj.teams[].users[].id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.teams[].users[].user_details` | object | ✅ | — | 只读 |
| `cases_obj.teams[].users[].role` | → ProfileRoleEnum | — | — | — |
| `cases_obj.teams[].users[].address` | string(uuid) | — | — | 可空 |
| `cases_obj.teams[].users[].has_marketing_access` | boolean | — | — | — |
| `cases_obj.teams[].users[].has_sales_access` | boolean | — | — | — |
| `cases_obj.teams[].users[].phone` | string | — | — | 可空; ≤20字符 |
| `cases_obj.teams[].users[].date_of_joining` | string(date) | — | — | 可空 |
| `cases_obj.teams[].users[].is_active` | boolean | — | — | — |
| `cases_obj.teams[].users[].created_at` | string(date-time) | ✅ | — | 只读 |
| `cases_obj.teams[].created_at` | string(date-time) | ✅ | — | 只读 |
| `cases_obj.teams[].created_by` | → User | ✅ | — | — |
| `cases_obj.teams[].created_by.id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.teams[].created_by.email` | string(email) | — | Email address | ≤254字符 |
| `cases_obj.teams[].created_by.profile_pic` | string | — | — | 可空; ≤1000字符 |
| `cases_obj.assigned_to` | [Profile] | ✅ | — | 只读 |
| `cases_obj.assigned_to[].id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.assigned_to[].user_details` | object | ✅ | — | 只读 |
| `cases_obj.assigned_to[].role` | → ProfileRoleEnum | — | — | — |
| `cases_obj.assigned_to[].address` | string(uuid) | — | — | 可空 |
| `cases_obj.assigned_to[].has_marketing_access` | boolean | — | — | — |
| `cases_obj.assigned_to[].has_sales_access` | boolean | — | — | — |
| `cases_obj.assigned_to[].phone` | string | — | — | 可空; ≤20字符 |
| `cases_obj.assigned_to[].date_of_joining` | string(date) | — | — | 可空 |
| `cases_obj.assigned_to[].is_active` | boolean | — | — | — |
| `cases_obj.assigned_to[].created_at` | string(date-time) | ✅ | — | 只读 |
| `cases_obj.tags` | [Tags] | ✅ | — | 只读 |
| `cases_obj.tags[].id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.tags[].name` | string | ✅ | — | ≤50字符 |
| `cases_obj.tags[].slug` | string | ✅ | — | 只读 |
| `cases_obj.tags[].color` | → ColorEnum | — | — | — |
| `cases_obj.tags[].description` | string | — | — | — |
| `cases_obj.tags[].is_active` | boolean | — | — | — |
| `cases_obj.tags[].created_at` | string(date-time) | ✅ | — | 只读 |
| `cases_obj.org` | → Organization | ✅ | — | — |
| `cases_obj.org.id` | string(uuid) | ✅ | — | 只读 |
| `cases_obj.org.name` | string | — | — | 可空; ≤100字符 |
| `cases_obj.org.api_key` | string | ✅ | — | 只读 |
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
### PUT `/api/cases/{id}/` 🔒

新建工单

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**请求体** `application/json`

> 新建工单

**Schema: `CaseCreateSwaggerRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `name` | string | ✅ | — | ≤64字符 |
| `status` | → CaseStatusEnum | ✅ | — | — |
| `priority` | → CasePriorityEnum | ✅ | — | — |
| `case_type` | enum(CaseTypeEnum) | — | — | 枚举: Question, Incident, Problem; 可空 |
| `closed_on` | string(date) | — | — | 可空 |
| `teams` | [string] | ✅ | — | — |
| `assigned_to` | [string] | ✅ | — | — |
| `account` | string(uuid) | — | — | 可空 |
| `contacts` | [string] | ✅ | — | — |
| `tags` | [string] | — | — | — |
| `description` | string | — | — | 可空 |

**200** → `CaseUpdateResponse`

**Schema: `CaseUpdateResponse`**

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
### PATCH `/api/cases/{id}/move/` 🔒

移动工单到不同列/位置 .

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |

**请求体** `application/json`

**Schema: `PatchedCaseMoveRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `stage_id` | string(uuid) | — | — | 可空 |
| `status` | → CaseStatusEnum | — | — | — |
| `kanban_order` | string(decimal) | — | — | 正则: ^-?\d{0,9}(?:\.\d{0,6})?$ |
| `above_case_id` | string(uuid) | — | — | 可空 |
| `below_case_id` | string(uuid) | — | — | 可空 |

**200** → 推断: object

> OpenAPI 未标注；动作 `move` 返回 JSON

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---