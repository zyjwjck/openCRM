# 客户关系管理 — 账户

> 共 12 个端点。🔒 = 需要登录（JWT），🟢 = 无需鉴权。
> 账户（公司/客户）CRUD + 评论/附件 + 为账户创建邮件草稿。GET /api/accounts/ 返回**聚合 dict**（open_accounts + closed_accounts + contacts/countries/industries 等下拉）。

## 端点速览

| 方法 | 路径 | 鉴权 | 说明 |
|------|------|------|------|
| GET | `/api/accounts/` | 🔒 | 列表查询 |
| POST | `/api/accounts/` | 🔒 | 新建 |
| DELETE | `/api/accounts/attachment/{id}/` | 🔒 | 删除 |
| DELETE | `/api/accounts/comment/{id}/` | 🔒 | 删除评论 |
| PATCH | `/api/accounts/comment/{id}/` | 🔒 | 部分更新评论 |
| PUT | `/api/accounts/comment/{id}/` | 🔒 | 全量更新 |
| DELETE | `/api/accounts/{id}/` | 🔒 | 删除 |
| GET | `/api/accounts/{id}/` | 🔒 | 获取详情 |
| PATCH | `/api/accounts/{id}/` | 🔒 | 部分更新账户 |
| POST | `/api/accounts/{id}/` | 🔒 | 新建 |
| PUT | `/api/accounts/{id}/` | 🔒 | 新建/编辑账户（公司/客户） |
| POST | `/api/accounts/{id}/create_mail/` | 🔒 | 起草邮件 |

## 端点详情

### GET `/api/accounts/` 🔒

列表查询

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `city` | query | string | — | — |
| `name` | query | string | — | — |
| `org` | header | string | — | — |
| `tags` | query | string | — | — |

**200** → `accounts`

> ✅ 后端实测: 自定义 dict（OpenAPI 未标注）；顶层字段: active_accounts, closed_accounts, contacts, countries, industries, leads, page_number, per_page, status, tags, teams, users

**Schema: `accounts → 响应（后端实测）`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `per_page` | integer | — | — | — |
| `page_number` | [string] | — | — | — |
| `active_accounts` | object | — | — | — |
| `contacts` | [object] | — | — | — |
| `closed_accounts` | object | — | — | — |
| `teams` | [object] | — | — | — |
| `countries` | [array] | — | — | — |
| `industries` | [array] | — | — | — |
| `tags` | [object] | — | — | — |
| `users` | [object] | — | — | — |
| `leads` | [object] | — | — | — |
| `status` | [string] | — | — | — |

**可能的错误响应（DRF 标准）**

- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）
- **400**: 请求参数校验失败（query/header/body 不合法）

---
### POST `/api/accounts/` 🔒

新建

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `org` | header | string | — | — |

**请求体** `application/json`

**Schema: `AccountCreateRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `name` | string | ✅ | Account Name | ≤255字符 |
| `email` | string(email) | — | — | 可空; ≤254字符 |
| `phone` | string | — | — | 可空; ≤25字符; 正则: ^[\d\s\-\(\)\+\.]{7,25}$ |
| `website` | string(uri) | — | — | 可空; ≤200字符 |
| `industry` | enum(IndustryEnum) | — | — | 枚举: ADVERTISING, AGRICULTURE, APPAREL & ACCESSORIES, AUTOMOTIVE, BANKING, BIOTECHNOLOGY, BUILDING MATERIALS & EQUIPMENT, CHEMICAL, COMPUTER, EDUCATION, ELECTRONICS, ENERGY, ENTERTAINMENT & LEISURE, FINANCE, FOOD & BEVERAGE, GROCERY, HEALTHCARE, INSURANCE, LEGAL, MANUFACTURING, PUBLISHING, REAL ESTATE, SERVICE, SOFTWARE, SPORTS, TECHNOLOGY, TELECOMMUNICATIONS, TELEVISION, TRANSPORTATION, VENTURE CAPITAL; 可空 |
| `number_of_employees` | integer(int64) | — | — | 可空 |
| `annual_revenue` | string(decimal) | — | — | 可空; 正则: ^-?\d{0,13}(?:\.\d{0,2})?$ |
| `currency` | enum(CurrencyEnum) | — | — | 枚举: USD, EUR, GBP, INR, CAD, AUD, JPY, CNY, CHF, SGD, AED, BRL, MXN; 可空 |
| `address_line` | string | — | Address | 可空; ≤255字符 |
| `city` | string | — | — | 可空; ≤255字符 |
| `state` | string | — | — | 可空; ≤255字符 |
| `postcode` | string | — | Postal Code | 可空; ≤64字符 |
| `country` | enum(ClientCountryEnum) | — | — | 枚举: GB, AF, AX, AL, DZ, AS, AD, AO, AI, AQ, AG, AR, AM, AW, AU, AT, AZ, BS, BH, BD, BB, BY, BE, BZ, BJ, BM, BT, BO, BA, BW, BV, BR, IO, BN, BG, BF, BI, KH, CM, CA, CV, KY, CF, TD, CL, CN, CX, CC, CO, KM, CG, CD, CK, CR, CI, HR, CU, CY, CZ, DK, DJ, DM, DO, EC, EG, SV, GQ, ER, EE, ET, FK, FO, FJ, FI, FR, GF, PF, TF, GA, GM, GE, DE, GH, GI, GR, GL, GD, GP, GU, GT, GG, GN, GW, GY, HT, HM, VA, HN, HK, HU, IS, IN, ID, IR, IQ, IE, IM, IL, IT, JM, JP, JE, JO, KZ, KE, KI, KP, KR, KW, KG, LA, LV, LB, LS, LR, LY, LI, LT, LU, MO, MK, MG, MW, MY, MV, ML, MT, MH, MQ, MR, MU, YT, MX, FM, MD, MC, MN, ME, MS, MA, MZ, MM, NA, NR, NP, NL, AN, NC, NZ, NI, NE, NG, NU, NF, MP, NO, OM, PK, PW, PS, PA, PG, PY, PE, PH, PN, PL, PT, PR, QA, RE, RO, RU, RW, BL, SH, KN, LC, MF, PM, VC, WS, SM, ST, SA, SN, RS, SC, SL, SG, SK, SI, SB, SO, ZA, GS, ES, LK, SD, SR, SJ, SZ, SE, CH, SY, TW, TJ, TZ, TH, TL, TG, TK, TO, TT, TN, TR, TM, TC, TV, UG, UA, AE, US, UM, UY, UZ, VU, VE, VN, VG, VI, WF, EH, YE, ZM, ZW; 可空 |
| `description` | string | — | Notes | 可空 |
| `is_active` | boolean | — | — | — |

**200** → `Account`

**Schema: `Account`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `id` | string(uuid) | ✅ | — | 只读 |
| `name` | string | ✅ | Account Name | ≤255字符 |
| `email` | string(email) | — | — | 可空; ≤254字符 |
| `phone` | string | — | — | 可空; ≤25字符; 正则: ^[\d\s\-\(\)\+\.]{7,25}$ |
| `website` | string(uri) | — | — | 可空; ≤200字符 |
| `industry` | enum(IndustryEnum) | — | — | 枚举: ADVERTISING, AGRICULTURE, APPAREL & ACCESSORIES, AUTOMOTIVE, BANKING, BIOTECHNOLOGY, BUILDING MATERIALS & EQUIPMENT, CHEMICAL, COMPUTER, EDUCATION, ELECTRONICS, ENERGY, ENTERTAINMENT & LEISURE, FINANCE, FOOD & BEVERAGE, GROCERY, HEALTHCARE, INSURANCE, LEGAL, MANUFACTURING, PUBLISHING, REAL ESTATE, SERVICE, SOFTWARE, SPORTS, TECHNOLOGY, TELECOMMUNICATIONS, TELEVISION, TRANSPORTATION, VENTURE CAPITAL; 可空 |
| `number_of_employees` | integer(int64) | — | — | 可空 |
| `annual_revenue` | string(decimal) | — | — | 可空; 正则: ^-?\d{0,13}(?:\.\d{0,2})?$ |
| `currency` | enum(CurrencyEnum) | — | — | 枚举: USD, EUR, GBP, INR, CAD, AUD, JPY, CNY, CHF, SGD, AED, BRL, MXN; 可空 |
| `address_line` | string | — | Address | 可空; ≤255字符 |
| `city` | string | — | — | 可空; ≤255字符 |
| `state` | string | — | — | 可空; ≤255字符 |
| `postcode` | string | — | Postal Code | 可空; ≤64字符 |
| `country` | enum(ClientCountryEnum) | — | — | 枚举: GB, AF, AX, AL, DZ, AS, AD, AO, AI, AQ, AG, AR, AM, AW, AU, AT, AZ, BS, BH, BD, BB, BY, BE, BZ, BJ, BM, BT, BO, BA, BW, BV, BR, IO, BN, BG, BF, BI, KH, CM, CA, CV, KY, CF, TD, CL, CN, CX, CC, CO, KM, CG, CD, CK, CR, CI, HR, CU, CY, CZ, DK, DJ, DM, DO, EC, EG, SV, GQ, ER, EE, ET, FK, FO, FJ, FI, FR, GF, PF, TF, GA, GM, GE, DE, GH, GI, GR, GL, GD, GP, GU, GT, GG, GN, GW, GY, HT, HM, VA, HN, HK, HU, IS, IN, ID, IR, IQ, IE, IM, IL, IT, JM, JP, JE, JO, KZ, KE, KI, KP, KR, KW, KG, LA, LV, LB, LS, LR, LY, LI, LT, LU, MO, MK, MG, MW, MY, MV, ML, MT, MH, MQ, MR, MU, YT, MX, FM, MD, MC, MN, ME, MS, MA, MZ, MM, NA, NR, NP, NL, AN, NC, NZ, NI, NE, NG, NU, NF, MP, NO, OM, PK, PW, PS, PA, PG, PY, PE, PH, PN, PL, PT, PR, QA, RE, RO, RU, RW, BL, SH, KN, LC, MF, PM, VC, WS, SM, ST, SA, SN, RS, SC, SL, SG, SK, SI, SB, SO, ZA, GS, ES, LK, SD, SR, SJ, SZ, SE, CH, SY, TW, TJ, TZ, TH, TL, TG, TK, TO, TT, TN, TR, TM, TC, TV, UG, UA, AE, US, UM, UY, UZ, VU, VE, VN, VG, VI, WF, EH, YE, ZM, ZW; 可空 |
| `country_display` | string | ✅ | — | 只读 |
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
| `teams` | [Teams] | ✅ | — | 只读 |
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
| `contacts` | [Contact] | ✅ | — | 只读 |
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
| `tags` | [Tags] | ✅ | — | 只读 |
| `tags[].id` | string(uuid) | ✅ | — | 只读 |
| `tags[].name` | string | ✅ | — | ≤50字符 |
| `tags[].slug` | string | ✅ | — | 只读 |
| `tags[].color` | → ColorEnum | — | — | — |
| `tags[].description` | string | — | — | — |
| `tags[].is_active` | boolean | — | — | — |
| `tags[].created_at` | string(date-time) | ✅ | — | 只读 |
| `description` | string | — | Notes | 可空 |
| `account_attachment` | [Attachments] | ✅ | — | 只读 |
| `account_attachment[].id` | string(uuid) | ✅ | — | 只读 |
| `account_attachment[].created_by` | string(uuid) | — | — | 可空 |
| `account_attachment[].file_name` | string | ✅ | — | ≤60字符 |
| `account_attachment[].created_at` | string(date-time) | ✅ | — | 只读 |
| `account_attachment[].file_path` | string | ✅ | — | 只读 |
| `account_attachment[].content_type` | string | ✅ | Python model class name | 只读 |
| `account_attachment[].object_id` | string(uuid) | ✅ | — | — |
| `account_attachment[].org` | string(uuid) | ✅ | — | — |
| `cases` | [any] | ✅ | Return cases linked to this account | 只读 |
| `tasks` | [any] | ✅ | Return tasks linked to this account | 只读 |
| `opportunities` | [any] | ✅ | Return opportunities linked to this account | 只读 |
| `created_by` | → User | ✅ | — | — |
| `created_by.id` | string(uuid) | ✅ | — | 只读 |
| `created_by.email` | string(email) | — | Email address | ≤254字符 |
| `created_by.profile_pic` | string | — | — | 可空; ≤1000字符 |
| `created_at` | string(date-time) | ✅ | — | 只读 |
| `is_active` | boolean | — | — | — |
| `org` | → Organization | ✅ | — | — |
| `org.id` | string(uuid) | ✅ | — | 只读 |
| `org.name` | string | — | — | 可空; ≤100字符 |
| `org.api_key` | string | ✅ | — | 只读 |

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### DELETE `/api/accounts/attachment/{id}/` 🔒

删除

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**204** → 无响应体（删除成功）

**可能的错误响应（DRF 标准）**

- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）
- **400**: 请求参数校验失败（query/header/body 不合法）

---
### DELETE `/api/accounts/comment/{id}/` 🔒

删除评论

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**204** → 无响应体（删除成功）

**可能的错误响应（DRF 标准）**

- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）
- **400**: 请求参数校验失败（query/header/body 不合法）

---
### PATCH `/api/accounts/comment/{id}/` 🔒

部分更新评论

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**请求体** `application/json`

**Schema: `PatchedAccountCommentEditSwaggerRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `comment` | string | — | — | — |

**200** → `AccountCommentEditSwagger`

**Schema: `AccountCommentEditSwagger`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `comment` | string | ✅ | — | — |

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### PUT `/api/accounts/comment/{id}/` 🔒

全量更新

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**请求体** `application/json`

**Schema: `AccountCommentEditSwaggerRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `comment` | string | ✅ | — | — |

**200** → `AccountCommentEditSwagger`

**Schema: `AccountCommentEditSwagger`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `comment` | string | ✅ | — | — |

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### DELETE `/api/accounts/{id}/` 🔒

删除

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**204** → 无响应体（删除成功）

**可能的错误响应（DRF 标准）**

- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）
- **400**: 请求参数校验失败（query/header/body 不合法）

---
### GET `/api/accounts/{id}/` 🔒

获取详情

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**200** → `Account`

**Schema: `Account`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `id` | string(uuid) | ✅ | — | 只读 |
| `name` | string | ✅ | Account Name | ≤255字符 |
| `email` | string(email) | — | — | 可空; ≤254字符 |
| `phone` | string | — | — | 可空; ≤25字符; 正则: ^[\d\s\-\(\)\+\.]{7,25}$ |
| `website` | string(uri) | — | — | 可空; ≤200字符 |
| `industry` | enum(IndustryEnum) | — | — | 枚举: ADVERTISING, AGRICULTURE, APPAREL & ACCESSORIES, AUTOMOTIVE, BANKING, BIOTECHNOLOGY, BUILDING MATERIALS & EQUIPMENT, CHEMICAL, COMPUTER, EDUCATION, ELECTRONICS, ENERGY, ENTERTAINMENT & LEISURE, FINANCE, FOOD & BEVERAGE, GROCERY, HEALTHCARE, INSURANCE, LEGAL, MANUFACTURING, PUBLISHING, REAL ESTATE, SERVICE, SOFTWARE, SPORTS, TECHNOLOGY, TELECOMMUNICATIONS, TELEVISION, TRANSPORTATION, VENTURE CAPITAL; 可空 |
| `number_of_employees` | integer(int64) | — | — | 可空 |
| `annual_revenue` | string(decimal) | — | — | 可空; 正则: ^-?\d{0,13}(?:\.\d{0,2})?$ |
| `currency` | enum(CurrencyEnum) | — | — | 枚举: USD, EUR, GBP, INR, CAD, AUD, JPY, CNY, CHF, SGD, AED, BRL, MXN; 可空 |
| `address_line` | string | — | Address | 可空; ≤255字符 |
| `city` | string | — | — | 可空; ≤255字符 |
| `state` | string | — | — | 可空; ≤255字符 |
| `postcode` | string | — | Postal Code | 可空; ≤64字符 |
| `country` | enum(ClientCountryEnum) | — | — | 枚举: GB, AF, AX, AL, DZ, AS, AD, AO, AI, AQ, AG, AR, AM, AW, AU, AT, AZ, BS, BH, BD, BB, BY, BE, BZ, BJ, BM, BT, BO, BA, BW, BV, BR, IO, BN, BG, BF, BI, KH, CM, CA, CV, KY, CF, TD, CL, CN, CX, CC, CO, KM, CG, CD, CK, CR, CI, HR, CU, CY, CZ, DK, DJ, DM, DO, EC, EG, SV, GQ, ER, EE, ET, FK, FO, FJ, FI, FR, GF, PF, TF, GA, GM, GE, DE, GH, GI, GR, GL, GD, GP, GU, GT, GG, GN, GW, GY, HT, HM, VA, HN, HK, HU, IS, IN, ID, IR, IQ, IE, IM, IL, IT, JM, JP, JE, JO, KZ, KE, KI, KP, KR, KW, KG, LA, LV, LB, LS, LR, LY, LI, LT, LU, MO, MK, MG, MW, MY, MV, ML, MT, MH, MQ, MR, MU, YT, MX, FM, MD, MC, MN, ME, MS, MA, MZ, MM, NA, NR, NP, NL, AN, NC, NZ, NI, NE, NG, NU, NF, MP, NO, OM, PK, PW, PS, PA, PG, PY, PE, PH, PN, PL, PT, PR, QA, RE, RO, RU, RW, BL, SH, KN, LC, MF, PM, VC, WS, SM, ST, SA, SN, RS, SC, SL, SG, SK, SI, SB, SO, ZA, GS, ES, LK, SD, SR, SJ, SZ, SE, CH, SY, TW, TJ, TZ, TH, TL, TG, TK, TO, TT, TN, TR, TM, TC, TV, UG, UA, AE, US, UM, UY, UZ, VU, VE, VN, VG, VI, WF, EH, YE, ZM, ZW; 可空 |
| `country_display` | string | ✅ | — | 只读 |
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
| `teams` | [Teams] | ✅ | — | 只读 |
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
| `contacts` | [Contact] | ✅ | — | 只读 |
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
| `tags` | [Tags] | ✅ | — | 只读 |
| `tags[].id` | string(uuid) | ✅ | — | 只读 |
| `tags[].name` | string | ✅ | — | ≤50字符 |
| `tags[].slug` | string | ✅ | — | 只读 |
| `tags[].color` | → ColorEnum | — | — | — |
| `tags[].description` | string | — | — | — |
| `tags[].is_active` | boolean | — | — | — |
| `tags[].created_at` | string(date-time) | ✅ | — | 只读 |
| `description` | string | — | Notes | 可空 |
| `account_attachment` | [Attachments] | ✅ | — | 只读 |
| `account_attachment[].id` | string(uuid) | ✅ | — | 只读 |
| `account_attachment[].created_by` | string(uuid) | — | — | 可空 |
| `account_attachment[].file_name` | string | ✅ | — | ≤60字符 |
| `account_attachment[].created_at` | string(date-time) | ✅ | — | 只读 |
| `account_attachment[].file_path` | string | ✅ | — | 只读 |
| `account_attachment[].content_type` | string | ✅ | Python model class name | 只读 |
| `account_attachment[].object_id` | string(uuid) | ✅ | — | — |
| `account_attachment[].org` | string(uuid) | ✅ | — | — |
| `cases` | [any] | ✅ | Return cases linked to this account | 只读 |
| `tasks` | [any] | ✅ | Return tasks linked to this account | 只读 |
| `opportunities` | [any] | ✅ | Return opportunities linked to this account | 只读 |
| `created_by` | → User | ✅ | — | — |
| `created_by.id` | string(uuid) | ✅ | — | 只读 |
| `created_by.email` | string(email) | — | Email address | ≤254字符 |
| `created_by.profile_pic` | string | — | — | 可空; ≤1000字符 |
| `created_at` | string(date-time) | ✅ | — | 只读 |
| `is_active` | boolean | — | — | — |
| `org` | → Organization | ✅ | — | — |
| `org.id` | string(uuid) | ✅ | — | 只读 |
| `org.name` | string | — | — | 可空; ≤100字符 |
| `org.api_key` | string | ✅ | — | 只读 |

**可能的错误响应（DRF 标准）**

- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）
- **400**: 请求参数校验失败（query/header/body 不合法）

---
### PATCH `/api/accounts/{id}/` 🔒

部分更新账户

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**请求体** `application/json`

**Schema: `PatchedAccountWriteRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `name` | string | — | Account Name | ≤255字符 |
| `phone` | string | — | — | 可空; ≤25字符; 正则: ^[\d\s\-\(\)\+\.]{7,25}$ |
| `email` | string(email) | — | — | 可空; ≤254字符 |
| `website` | string(uri) | — | — | 可空; ≤200字符 |
| `industry` | enum(IndustryEnum) | — | — | 枚举: ADVERTISING, AGRICULTURE, APPAREL & ACCESSORIES, AUTOMOTIVE, BANKING, BIOTECHNOLOGY, BUILDING MATERIALS & EQUIPMENT, CHEMICAL, COMPUTER, EDUCATION, ELECTRONICS, ENERGY, ENTERTAINMENT & LEISURE, FINANCE, FOOD & BEVERAGE, GROCERY, HEALTHCARE, INSURANCE, LEGAL, MANUFACTURING, PUBLISHING, REAL ESTATE, SERVICE, SOFTWARE, SPORTS, TECHNOLOGY, TELECOMMUNICATIONS, TELEVISION, TRANSPORTATION, VENTURE CAPITAL; 可空 |
| `number_of_employees` | integer(int64) | — | — | 可空 |
| `annual_revenue` | string(decimal) | — | — | 可空; 正则: ^-?\d{0,13}(?:\.\d{0,2})?$ |
| `address_line` | string | — | Address | 可空; ≤255字符 |
| `city` | string | — | — | 可空; ≤255字符 |
| `state` | string | — | — | 可空; ≤255字符 |
| `postcode` | string | — | Postal Code | 可空; ≤64字符 |
| `country` | enum(ClientCountryEnum) | — | — | 枚举: GB, AF, AX, AL, DZ, AS, AD, AO, AI, AQ, AG, AR, AM, AW, AU, AT, AZ, BS, BH, BD, BB, BY, BE, BZ, BJ, BM, BT, BO, BA, BW, BV, BR, IO, BN, BG, BF, BI, KH, CM, CA, CV, KY, CF, TD, CL, CN, CX, CC, CO, KM, CG, CD, CK, CR, CI, HR, CU, CY, CZ, DK, DJ, DM, DO, EC, EG, SV, GQ, ER, EE, ET, FK, FO, FJ, FI, FR, GF, PF, TF, GA, GM, GE, DE, GH, GI, GR, GL, GD, GP, GU, GT, GG, GN, GW, GY, HT, HM, VA, HN, HK, HU, IS, IN, ID, IR, IQ, IE, IM, IL, IT, JM, JP, JE, JO, KZ, KE, KI, KP, KR, KW, KG, LA, LV, LB, LS, LR, LY, LI, LT, LU, MO, MK, MG, MW, MY, MV, ML, MT, MH, MQ, MR, MU, YT, MX, FM, MD, MC, MN, ME, MS, MA, MZ, MM, NA, NR, NP, NL, AN, NC, NZ, NI, NE, NG, NU, NF, MP, NO, OM, PK, PW, PS, PA, PG, PY, PE, PH, PN, PL, PT, PR, QA, RE, RO, RU, RW, BL, SH, KN, LC, MF, PM, VC, WS, SM, ST, SA, SN, RS, SC, SL, SG, SK, SI, SB, SO, ZA, GS, ES, LK, SD, SR, SJ, SZ, SE, CH, SY, TW, TJ, TZ, TH, TL, TG, TK, TO, TT, TN, TR, TM, TC, TV, UG, UA, AE, US, UM, UY, UZ, VU, VE, VN, VG, VI, WF, EH, YE, ZM, ZW; 可空 |
| `description` | string | — | Notes | 可空 |

**200** → `Account`

**Schema: `Account`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `id` | string(uuid) | ✅ | — | 只读 |
| `name` | string | ✅ | Account Name | ≤255字符 |
| `email` | string(email) | — | — | 可空; ≤254字符 |
| `phone` | string | — | — | 可空; ≤25字符; 正则: ^[\d\s\-\(\)\+\.]{7,25}$ |
| `website` | string(uri) | — | — | 可空; ≤200字符 |
| `industry` | enum(IndustryEnum) | — | — | 枚举: ADVERTISING, AGRICULTURE, APPAREL & ACCESSORIES, AUTOMOTIVE, BANKING, BIOTECHNOLOGY, BUILDING MATERIALS & EQUIPMENT, CHEMICAL, COMPUTER, EDUCATION, ELECTRONICS, ENERGY, ENTERTAINMENT & LEISURE, FINANCE, FOOD & BEVERAGE, GROCERY, HEALTHCARE, INSURANCE, LEGAL, MANUFACTURING, PUBLISHING, REAL ESTATE, SERVICE, SOFTWARE, SPORTS, TECHNOLOGY, TELECOMMUNICATIONS, TELEVISION, TRANSPORTATION, VENTURE CAPITAL; 可空 |
| `number_of_employees` | integer(int64) | — | — | 可空 |
| `annual_revenue` | string(decimal) | — | — | 可空; 正则: ^-?\d{0,13}(?:\.\d{0,2})?$ |
| `currency` | enum(CurrencyEnum) | — | — | 枚举: USD, EUR, GBP, INR, CAD, AUD, JPY, CNY, CHF, SGD, AED, BRL, MXN; 可空 |
| `address_line` | string | — | Address | 可空; ≤255字符 |
| `city` | string | — | — | 可空; ≤255字符 |
| `state` | string | — | — | 可空; ≤255字符 |
| `postcode` | string | — | Postal Code | 可空; ≤64字符 |
| `country` | enum(ClientCountryEnum) | — | — | 枚举: GB, AF, AX, AL, DZ, AS, AD, AO, AI, AQ, AG, AR, AM, AW, AU, AT, AZ, BS, BH, BD, BB, BY, BE, BZ, BJ, BM, BT, BO, BA, BW, BV, BR, IO, BN, BG, BF, BI, KH, CM, CA, CV, KY, CF, TD, CL, CN, CX, CC, CO, KM, CG, CD, CK, CR, CI, HR, CU, CY, CZ, DK, DJ, DM, DO, EC, EG, SV, GQ, ER, EE, ET, FK, FO, FJ, FI, FR, GF, PF, TF, GA, GM, GE, DE, GH, GI, GR, GL, GD, GP, GU, GT, GG, GN, GW, GY, HT, HM, VA, HN, HK, HU, IS, IN, ID, IR, IQ, IE, IM, IL, IT, JM, JP, JE, JO, KZ, KE, KI, KP, KR, KW, KG, LA, LV, LB, LS, LR, LY, LI, LT, LU, MO, MK, MG, MW, MY, MV, ML, MT, MH, MQ, MR, MU, YT, MX, FM, MD, MC, MN, ME, MS, MA, MZ, MM, NA, NR, NP, NL, AN, NC, NZ, NI, NE, NG, NU, NF, MP, NO, OM, PK, PW, PS, PA, PG, PY, PE, PH, PN, PL, PT, PR, QA, RE, RO, RU, RW, BL, SH, KN, LC, MF, PM, VC, WS, SM, ST, SA, SN, RS, SC, SL, SG, SK, SI, SB, SO, ZA, GS, ES, LK, SD, SR, SJ, SZ, SE, CH, SY, TW, TJ, TZ, TH, TL, TG, TK, TO, TT, TN, TR, TM, TC, TV, UG, UA, AE, US, UM, UY, UZ, VU, VE, VN, VG, VI, WF, EH, YE, ZM, ZW; 可空 |
| `country_display` | string | ✅ | — | 只读 |
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
| `teams` | [Teams] | ✅ | — | 只读 |
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
| `contacts` | [Contact] | ✅ | — | 只读 |
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
| `tags` | [Tags] | ✅ | — | 只读 |
| `tags[].id` | string(uuid) | ✅ | — | 只读 |
| `tags[].name` | string | ✅ | — | ≤50字符 |
| `tags[].slug` | string | ✅ | — | 只读 |
| `tags[].color` | → ColorEnum | — | — | — |
| `tags[].description` | string | — | — | — |
| `tags[].is_active` | boolean | — | — | — |
| `tags[].created_at` | string(date-time) | ✅ | — | 只读 |
| `description` | string | — | Notes | 可空 |
| `account_attachment` | [Attachments] | ✅ | — | 只读 |
| `account_attachment[].id` | string(uuid) | ✅ | — | 只读 |
| `account_attachment[].created_by` | string(uuid) | — | — | 可空 |
| `account_attachment[].file_name` | string | ✅ | — | ≤60字符 |
| `account_attachment[].created_at` | string(date-time) | ✅ | — | 只读 |
| `account_attachment[].file_path` | string | ✅ | — | 只读 |
| `account_attachment[].content_type` | string | ✅ | Python model class name | 只读 |
| `account_attachment[].object_id` | string(uuid) | ✅ | — | — |
| `account_attachment[].org` | string(uuid) | ✅ | — | — |
| `cases` | [any] | ✅ | Return cases linked to this account | 只读 |
| `tasks` | [any] | ✅ | Return tasks linked to this account | 只读 |
| `opportunities` | [any] | ✅ | Return opportunities linked to this account | 只读 |
| `created_by` | → User | ✅ | — | — |
| `created_by.id` | string(uuid) | ✅ | — | 只读 |
| `created_by.email` | string(email) | — | Email address | ≤254字符 |
| `created_by.profile_pic` | string | — | — | 可空; ≤1000字符 |
| `created_at` | string(date-time) | ✅ | — | 只读 |
| `is_active` | boolean | — | — | — |
| `org` | → Organization | ✅ | — | — |
| `org.id` | string(uuid) | ✅ | — | 只读 |
| `org.name` | string | — | — | 可空; ≤100字符 |
| `org.api_key` | string | ✅ | — | 只读 |

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### POST `/api/accounts/{id}/` 🔒

新建

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**请求体** `application/json`

**Schema: `AccountDetailEditSwaggerRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `comment` | string | ✅ | — | — |
| `account_attachment` | string(binary) | ✅ | — | — |

**200** → `Account`

**Schema: `Account`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `id` | string(uuid) | ✅ | — | 只读 |
| `name` | string | ✅ | Account Name | ≤255字符 |
| `email` | string(email) | — | — | 可空; ≤254字符 |
| `phone` | string | — | — | 可空; ≤25字符; 正则: ^[\d\s\-\(\)\+\.]{7,25}$ |
| `website` | string(uri) | — | — | 可空; ≤200字符 |
| `industry` | enum(IndustryEnum) | — | — | 枚举: ADVERTISING, AGRICULTURE, APPAREL & ACCESSORIES, AUTOMOTIVE, BANKING, BIOTECHNOLOGY, BUILDING MATERIALS & EQUIPMENT, CHEMICAL, COMPUTER, EDUCATION, ELECTRONICS, ENERGY, ENTERTAINMENT & LEISURE, FINANCE, FOOD & BEVERAGE, GROCERY, HEALTHCARE, INSURANCE, LEGAL, MANUFACTURING, PUBLISHING, REAL ESTATE, SERVICE, SOFTWARE, SPORTS, TECHNOLOGY, TELECOMMUNICATIONS, TELEVISION, TRANSPORTATION, VENTURE CAPITAL; 可空 |
| `number_of_employees` | integer(int64) | — | — | 可空 |
| `annual_revenue` | string(decimal) | — | — | 可空; 正则: ^-?\d{0,13}(?:\.\d{0,2})?$ |
| `currency` | enum(CurrencyEnum) | — | — | 枚举: USD, EUR, GBP, INR, CAD, AUD, JPY, CNY, CHF, SGD, AED, BRL, MXN; 可空 |
| `address_line` | string | — | Address | 可空; ≤255字符 |
| `city` | string | — | — | 可空; ≤255字符 |
| `state` | string | — | — | 可空; ≤255字符 |
| `postcode` | string | — | Postal Code | 可空; ≤64字符 |
| `country` | enum(ClientCountryEnum) | — | — | 枚举: GB, AF, AX, AL, DZ, AS, AD, AO, AI, AQ, AG, AR, AM, AW, AU, AT, AZ, BS, BH, BD, BB, BY, BE, BZ, BJ, BM, BT, BO, BA, BW, BV, BR, IO, BN, BG, BF, BI, KH, CM, CA, CV, KY, CF, TD, CL, CN, CX, CC, CO, KM, CG, CD, CK, CR, CI, HR, CU, CY, CZ, DK, DJ, DM, DO, EC, EG, SV, GQ, ER, EE, ET, FK, FO, FJ, FI, FR, GF, PF, TF, GA, GM, GE, DE, GH, GI, GR, GL, GD, GP, GU, GT, GG, GN, GW, GY, HT, HM, VA, HN, HK, HU, IS, IN, ID, IR, IQ, IE, IM, IL, IT, JM, JP, JE, JO, KZ, KE, KI, KP, KR, KW, KG, LA, LV, LB, LS, LR, LY, LI, LT, LU, MO, MK, MG, MW, MY, MV, ML, MT, MH, MQ, MR, MU, YT, MX, FM, MD, MC, MN, ME, MS, MA, MZ, MM, NA, NR, NP, NL, AN, NC, NZ, NI, NE, NG, NU, NF, MP, NO, OM, PK, PW, PS, PA, PG, PY, PE, PH, PN, PL, PT, PR, QA, RE, RO, RU, RW, BL, SH, KN, LC, MF, PM, VC, WS, SM, ST, SA, SN, RS, SC, SL, SG, SK, SI, SB, SO, ZA, GS, ES, LK, SD, SR, SJ, SZ, SE, CH, SY, TW, TJ, TZ, TH, TL, TG, TK, TO, TT, TN, TR, TM, TC, TV, UG, UA, AE, US, UM, UY, UZ, VU, VE, VN, VG, VI, WF, EH, YE, ZM, ZW; 可空 |
| `country_display` | string | ✅ | — | 只读 |
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
| `teams` | [Teams] | ✅ | — | 只读 |
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
| `contacts` | [Contact] | ✅ | — | 只读 |
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
| `tags` | [Tags] | ✅ | — | 只读 |
| `tags[].id` | string(uuid) | ✅ | — | 只读 |
| `tags[].name` | string | ✅ | — | ≤50字符 |
| `tags[].slug` | string | ✅ | — | 只读 |
| `tags[].color` | → ColorEnum | — | — | — |
| `tags[].description` | string | — | — | — |
| `tags[].is_active` | boolean | — | — | — |
| `tags[].created_at` | string(date-time) | ✅ | — | 只读 |
| `description` | string | — | Notes | 可空 |
| `account_attachment` | [Attachments] | ✅ | — | 只读 |
| `account_attachment[].id` | string(uuid) | ✅ | — | 只读 |
| `account_attachment[].created_by` | string(uuid) | — | — | 可空 |
| `account_attachment[].file_name` | string | ✅ | — | ≤60字符 |
| `account_attachment[].created_at` | string(date-time) | ✅ | — | 只读 |
| `account_attachment[].file_path` | string | ✅ | — | 只读 |
| `account_attachment[].content_type` | string | ✅ | Python model class name | 只读 |
| `account_attachment[].object_id` | string(uuid) | ✅ | — | — |
| `account_attachment[].org` | string(uuid) | ✅ | — | — |
| `cases` | [any] | ✅ | Return cases linked to this account | 只读 |
| `tasks` | [any] | ✅ | Return tasks linked to this account | 只读 |
| `opportunities` | [any] | ✅ | Return opportunities linked to this account | 只读 |
| `created_by` | → User | ✅ | — | — |
| `created_by.id` | string(uuid) | ✅ | — | 只读 |
| `created_by.email` | string(email) | — | Email address | ≤254字符 |
| `created_by.profile_pic` | string | — | — | 可空; ≤1000字符 |
| `created_at` | string(date-time) | ✅ | — | 只读 |
| `is_active` | boolean | — | — | — |
| `org` | → Organization | ✅ | — | — |
| `org.id` | string(uuid) | ✅ | — | 只读 |
| `org.name` | string | — | — | 可空; ≤100字符 |
| `org.api_key` | string | ✅ | — | 只读 |

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### PUT `/api/accounts/{id}/` 🔒

新建/编辑账户（公司/客户）

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**请求体** `application/json`

> 新建/编辑账户（公司/客户）

**Schema: `AccountWriteRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `name` | string | ✅ | Account Name | ≤255字符 |
| `phone` | string | — | — | 可空; ≤25字符; 正则: ^[\d\s\-\(\)\+\.]{7,25}$ |
| `email` | string(email) | — | — | 可空; ≤254字符 |
| `website` | string(uri) | — | — | 可空; ≤200字符 |
| `industry` | enum(IndustryEnum) | — | — | 枚举: ADVERTISING, AGRICULTURE, APPAREL & ACCESSORIES, AUTOMOTIVE, BANKING, BIOTECHNOLOGY, BUILDING MATERIALS & EQUIPMENT, CHEMICAL, COMPUTER, EDUCATION, ELECTRONICS, ENERGY, ENTERTAINMENT & LEISURE, FINANCE, FOOD & BEVERAGE, GROCERY, HEALTHCARE, INSURANCE, LEGAL, MANUFACTURING, PUBLISHING, REAL ESTATE, SERVICE, SOFTWARE, SPORTS, TECHNOLOGY, TELECOMMUNICATIONS, TELEVISION, TRANSPORTATION, VENTURE CAPITAL; 可空 |
| `number_of_employees` | integer(int64) | — | — | 可空 |
| `annual_revenue` | string(decimal) | — | — | 可空; 正则: ^-?\d{0,13}(?:\.\d{0,2})?$ |
| `address_line` | string | — | Address | 可空; ≤255字符 |
| `city` | string | — | — | 可空; ≤255字符 |
| `state` | string | — | — | 可空; ≤255字符 |
| `postcode` | string | — | Postal Code | 可空; ≤64字符 |
| `country` | enum(ClientCountryEnum) | — | — | 枚举: GB, AF, AX, AL, DZ, AS, AD, AO, AI, AQ, AG, AR, AM, AW, AU, AT, AZ, BS, BH, BD, BB, BY, BE, BZ, BJ, BM, BT, BO, BA, BW, BV, BR, IO, BN, BG, BF, BI, KH, CM, CA, CV, KY, CF, TD, CL, CN, CX, CC, CO, KM, CG, CD, CK, CR, CI, HR, CU, CY, CZ, DK, DJ, DM, DO, EC, EG, SV, GQ, ER, EE, ET, FK, FO, FJ, FI, FR, GF, PF, TF, GA, GM, GE, DE, GH, GI, GR, GL, GD, GP, GU, GT, GG, GN, GW, GY, HT, HM, VA, HN, HK, HU, IS, IN, ID, IR, IQ, IE, IM, IL, IT, JM, JP, JE, JO, KZ, KE, KI, KP, KR, KW, KG, LA, LV, LB, LS, LR, LY, LI, LT, LU, MO, MK, MG, MW, MY, MV, ML, MT, MH, MQ, MR, MU, YT, MX, FM, MD, MC, MN, ME, MS, MA, MZ, MM, NA, NR, NP, NL, AN, NC, NZ, NI, NE, NG, NU, NF, MP, NO, OM, PK, PW, PS, PA, PG, PY, PE, PH, PN, PL, PT, PR, QA, RE, RO, RU, RW, BL, SH, KN, LC, MF, PM, VC, WS, SM, ST, SA, SN, RS, SC, SL, SG, SK, SI, SB, SO, ZA, GS, ES, LK, SD, SR, SJ, SZ, SE, CH, SY, TW, TJ, TZ, TH, TL, TG, TK, TO, TT, TN, TR, TM, TC, TV, UG, UA, AE, US, UM, UY, UZ, VU, VE, VN, VG, VI, WF, EH, YE, ZM, ZW; 可空 |
| `description` | string | — | Notes | 可空 |

**200** → `Account`

**Schema: `Account`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `id` | string(uuid) | ✅ | — | 只读 |
| `name` | string | ✅ | Account Name | ≤255字符 |
| `email` | string(email) | — | — | 可空; ≤254字符 |
| `phone` | string | — | — | 可空; ≤25字符; 正则: ^[\d\s\-\(\)\+\.]{7,25}$ |
| `website` | string(uri) | — | — | 可空; ≤200字符 |
| `industry` | enum(IndustryEnum) | — | — | 枚举: ADVERTISING, AGRICULTURE, APPAREL & ACCESSORIES, AUTOMOTIVE, BANKING, BIOTECHNOLOGY, BUILDING MATERIALS & EQUIPMENT, CHEMICAL, COMPUTER, EDUCATION, ELECTRONICS, ENERGY, ENTERTAINMENT & LEISURE, FINANCE, FOOD & BEVERAGE, GROCERY, HEALTHCARE, INSURANCE, LEGAL, MANUFACTURING, PUBLISHING, REAL ESTATE, SERVICE, SOFTWARE, SPORTS, TECHNOLOGY, TELECOMMUNICATIONS, TELEVISION, TRANSPORTATION, VENTURE CAPITAL; 可空 |
| `number_of_employees` | integer(int64) | — | — | 可空 |
| `annual_revenue` | string(decimal) | — | — | 可空; 正则: ^-?\d{0,13}(?:\.\d{0,2})?$ |
| `currency` | enum(CurrencyEnum) | — | — | 枚举: USD, EUR, GBP, INR, CAD, AUD, JPY, CNY, CHF, SGD, AED, BRL, MXN; 可空 |
| `address_line` | string | — | Address | 可空; ≤255字符 |
| `city` | string | — | — | 可空; ≤255字符 |
| `state` | string | — | — | 可空; ≤255字符 |
| `postcode` | string | — | Postal Code | 可空; ≤64字符 |
| `country` | enum(ClientCountryEnum) | — | — | 枚举: GB, AF, AX, AL, DZ, AS, AD, AO, AI, AQ, AG, AR, AM, AW, AU, AT, AZ, BS, BH, BD, BB, BY, BE, BZ, BJ, BM, BT, BO, BA, BW, BV, BR, IO, BN, BG, BF, BI, KH, CM, CA, CV, KY, CF, TD, CL, CN, CX, CC, CO, KM, CG, CD, CK, CR, CI, HR, CU, CY, CZ, DK, DJ, DM, DO, EC, EG, SV, GQ, ER, EE, ET, FK, FO, FJ, FI, FR, GF, PF, TF, GA, GM, GE, DE, GH, GI, GR, GL, GD, GP, GU, GT, GG, GN, GW, GY, HT, HM, VA, HN, HK, HU, IS, IN, ID, IR, IQ, IE, IM, IL, IT, JM, JP, JE, JO, KZ, KE, KI, KP, KR, KW, KG, LA, LV, LB, LS, LR, LY, LI, LT, LU, MO, MK, MG, MW, MY, MV, ML, MT, MH, MQ, MR, MU, YT, MX, FM, MD, MC, MN, ME, MS, MA, MZ, MM, NA, NR, NP, NL, AN, NC, NZ, NI, NE, NG, NU, NF, MP, NO, OM, PK, PW, PS, PA, PG, PY, PE, PH, PN, PL, PT, PR, QA, RE, RO, RU, RW, BL, SH, KN, LC, MF, PM, VC, WS, SM, ST, SA, SN, RS, SC, SL, SG, SK, SI, SB, SO, ZA, GS, ES, LK, SD, SR, SJ, SZ, SE, CH, SY, TW, TJ, TZ, TH, TL, TG, TK, TO, TT, TN, TR, TM, TC, TV, UG, UA, AE, US, UM, UY, UZ, VU, VE, VN, VG, VI, WF, EH, YE, ZM, ZW; 可空 |
| `country_display` | string | ✅ | — | 只读 |
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
| `teams` | [Teams] | ✅ | — | 只读 |
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
| `contacts` | [Contact] | ✅ | — | 只读 |
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
| `tags` | [Tags] | ✅ | — | 只读 |
| `tags[].id` | string(uuid) | ✅ | — | 只读 |
| `tags[].name` | string | ✅ | — | ≤50字符 |
| `tags[].slug` | string | ✅ | — | 只读 |
| `tags[].color` | → ColorEnum | — | — | — |
| `tags[].description` | string | — | — | — |
| `tags[].is_active` | boolean | — | — | — |
| `tags[].created_at` | string(date-time) | ✅ | — | 只读 |
| `description` | string | — | Notes | 可空 |
| `account_attachment` | [Attachments] | ✅ | — | 只读 |
| `account_attachment[].id` | string(uuid) | ✅ | — | 只读 |
| `account_attachment[].created_by` | string(uuid) | — | — | 可空 |
| `account_attachment[].file_name` | string | ✅ | — | ≤60字符 |
| `account_attachment[].created_at` | string(date-time) | ✅ | — | 只读 |
| `account_attachment[].file_path` | string | ✅ | — | 只读 |
| `account_attachment[].content_type` | string | ✅ | Python model class name | 只读 |
| `account_attachment[].object_id` | string(uuid) | ✅ | — | — |
| `account_attachment[].org` | string(uuid) | ✅ | — | — |
| `cases` | [any] | ✅ | Return cases linked to this account | 只读 |
| `tasks` | [any] | ✅ | Return tasks linked to this account | 只读 |
| `opportunities` | [any] | ✅ | Return opportunities linked to this account | 只读 |
| `created_by` | → User | ✅ | — | — |
| `created_by.id` | string(uuid) | ✅ | — | 只读 |
| `created_by.email` | string(email) | — | Email address | ≤254字符 |
| `created_by.profile_pic` | string | — | — | 可空; ≤1000字符 |
| `created_at` | string(date-time) | ✅ | — | 只读 |
| `is_active` | boolean | — | — | — |
| `org` | → Organization | ✅ | — | — |
| `org.id` | string(uuid) | ✅ | — | 只读 |
| `org.name` | string | — | — | 可空; ≤100字符 |
| `org.api_key` | string | ✅ | — | 只读 |

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### POST `/api/accounts/{id}/create_mail/` 🔒

起草邮件

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string | ✅ | — |
| `org` | header | string | — | — |

**请求体** `application/json`

> 起草邮件

**Schema: `EmailWriteRequest`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `from_email` | string(email) | ✅ | — | ≤254字符 |
| `recipients` | [string] | ✅ | — | — |
| `message_subject` | string | — | — | 可空 |
| `scheduled_later` | boolean | — | — | — |
| `timezone` | string | — | — | ≤100字符 |
| `scheduled_date_time` | string(date-time) | — | — | 可空 |
| `message_body` | string | — | — | 可空 |

**200** → `EmailWrite`

**Schema: `EmailWrite`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `from_email` | string(email) | ✅ | — | ≤254字符 |
| `recipients` | [string] | ✅ | — | — |
| `message_subject` | string | — | — | 可空 |
| `scheduled_later` | boolean | — | — | — |
| `timezone` | string | — | — | ≤100字符 |
| `scheduled_date_time` | string(date-time) | — | — | 可空 |
| `message_body` | string | — | — | 可空 |

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---