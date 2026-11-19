# 销售 — 所有发票

> 共 22 个端点。🔒 = 需要登录（JWT），🟢 = 无需鉴权。
> 发票核心：CRUD + 发送/取消/复制/标记已付/生成 PDF/从商机生成 + 行项目 + 支付 + 评论/附件。GET /api/invoices/ 返回 **DRF 标准分页**。

## 端点速览

| 方法 | 路径 | 鉴权 | 说明 |
|------|------|------|------|
| GET | `/api/invoices/` | 🔒 | 列表查询 + 新建 invoices |
| POST | `/api/invoices/` | 🔒 | 列表查询 + 新建 invoices |
| DELETE | `/api/invoices/attachments/{id}/` | 🔒 | 删除附件 |
| DELETE | `/api/invoices/comments/{id}/` | 🔒 | 评论更新/删除 |
| PUT | `/api/invoices/comments/{id}/` | 🔒 | 评论更新/删除 |
| POST | `/api/invoices/from-opportunity/{opportunity_id}/` | 🔒 | 从已赢商机（CLOSED_WON）及其行项目生成发票 |
| GET | `/api/invoices/{id}/` | 🔒 | 获取详情 + 全量更新 a single invoice |
| PUT | `/api/invoices/{id}/` | 🔒 | 获取详情 + 全量更新 a single invoice |
| POST | `/api/invoices/{id}/cancel/` | 🔒 | 取消发票 |
| POST | `/api/invoices/{id}/duplicate/` | 🔒 | 复制发票 |
| POST | `/api/invoices/{id}/mark-paid/` | 🔒 | 标记发票为已支付 |
| GET | `/api/invoices/{id}/pdf/` | 🔒 | 生成并下载发票 PDF |
| POST | `/api/invoices/{id}/send/` | 🔒 | 通过邮件发送发票给客户 |
| POST | `/api/invoices/{invoice_id}/attachments/` | 🔒 | 管理 attachments on an invoice |
| POST | `/api/invoices/{invoice_id}/comments/` | 🔒 | 管理 comments on an invoice |
| GET | `/api/invoices/{invoice_id}/line-items/` | 🔒 | 管理 line items for an invoice |
| POST | `/api/invoices/{invoice_id}/line-items/` | 🔒 | 管理 line items for an invoice |
| DELETE | `/api/invoices/{invoice_id}/line-items/{id}/` | 🔒 | 行项目更新/删除 |
| PUT | `/api/invoices/{invoice_id}/line-items/{id}/` | 🔒 | 行项目更新/删除 |
| GET | `/api/invoices/{invoice_id}/payments/` | 🔒 | 列表查询 + 新建 payments for an invoice |
| POST | `/api/invoices/{invoice_id}/payments/` | 🔒 | 列表查询 + 新建 payments for an invoice |
| DELETE | `/api/invoices/{invoice_id}/payments/{id}/` | 🔒 | 删除支付记录 |

## 端点详情

### GET `/api/invoices/` 🔒

列表查询 + 新建 invoices

**200** → `Paginated[Invoice]`

> ✅ 后端实测: DRF 分页响应，19 字段

**Schema: `Paginated[Invoice]（后端实测）`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `count` | integer(int64) | ✅ | 总记录数 | — |
| `next` | string(uri) | ✅ | 下一页 URL | 可空 |
| `previous` | string(uri) | ✅ | 上一页 URL | 可空 |
| `results` | [Invoice] | ✅ | 当前页 `Invoice` 列表 | — |
| `results[].id` | string(uuid) | ✅ | — | 只读 |
| `results[].invoice_number` | string | ✅ | — | ≤50字符 |
| `results[].invoice_title` | string | ✅ | — | ≤100字符 |
| `results[].status` | → InvoiceStatusEnum | — | — | — |
| `results[].account` | any | ✅ | — | 只读 |
| `results[].contact` | any | ✅ | — | 只读 |
| `results[].opportunity` | any | ✅ | — | 只读 |
| `results[].client_name` | string | — | — | ≤255字符 |
| `results[].client_email` | string(email) | — | — | ≤254字符 |
| `results[].client_phone` | string | — | — | ≤25字符 |
| `results[].billing_address_line` | string | — | Billing Address | ≤255字符 |
| `results[].billing_city` | string | — | — | ≤100字符 |
| `results[].billing_state` | string | — | — | ≤100字符 |
| `results[].billing_postcode` | string | — | Billing Postal Code | ≤20字符 |
| `results[].billing_country` | enum(ClientCountryEnum) | — | — | 枚举: GB, AF, AX, AL, DZ, AS, AD, AO, AI, AQ, AG, AR, AM, AW, AU, AT, AZ, BS, BH, BD, BB, BY, BE, BZ, BJ, BM, BT, BO, BA, BW, BV, BR, IO, BN, BG, BF, BI, KH, CM, CA, CV, KY, CF, TD, CL, CN, CX, CC, CO, KM, CG, CD, CK, CR, CI, HR, CU, CY, CZ, DK, DJ, DM, DO, EC, EG, SV, GQ, ER, EE, ET, FK, FO, FJ, FI, FR, GF, PF, TF, GA, GM, GE, DE, GH, GI, GR, GL, GD, GP, GU, GT, GG, GN, GW, GY, HT, HM, VA, HN, HK, HU, IS, IN, ID, IR, IQ, IE, IM, IL, IT, JM, JP, JE, JO, KZ, KE, KI, KP, KR, KW, KG, LA, LV, LB, LS, LR, LY, LI, LT, LU, MO, MK, MG, MW, MY, MV, ML, MT, MH, MQ, MR, MU, YT, MX, FM, MD, MC, MN, ME, MS, MA, MZ, MM, NA, NR, NP, NL, AN, NC, NZ, NI, NE, NG, NU, NF, MP, NO, OM, PK, PW, PS, PA, PG, PY, PE, PH, PN, PL, PT, PR, QA, RE, RO, RU, RW, BL, SH, KN, LC, MF, PM, VC, WS, SM, ST, SA, SN, RS, SC, SL, SG, SK, SI, SB, SO, ZA, GS, ES, LK, SD, SR, SJ, SZ, SE, CH, SY, TW, TJ, TZ, TH, TL, TG, TK, TO, TT, TN, TR, TM, TC, TV, UG, UA, AE, US, UM, UY, UZ, VU, VE, VN, VG, VI, WF, EH, YE, ZM, ZW |
| `results[].client_address_line` | string | — | Client Address | ≤255字符 |
| `results[].client_city` | string | — | — | ≤100字符 |
| `results[].client_state` | string | — | — | ≤100字符 |
| `results[].client_postcode` | string | — | Client Postal Code | ≤20字符 |
| `results[].client_country` | enum(ClientCountryEnum) | — | — | 枚举: GB, AF, AX, AL, DZ, AS, AD, AO, AI, AQ, AG, AR, AM, AW, AU, AT, AZ, BS, BH, BD, BB, BY, BE, BZ, BJ, BM, BT, BO, BA, BW, BV, BR, IO, BN, BG, BF, BI, KH, CM, CA, CV, KY, CF, TD, CL, CN, CX, CC, CO, KM, CG, CD, CK, CR, CI, HR, CU, CY, CZ, DK, DJ, DM, DO, EC, EG, SV, GQ, ER, EE, ET, FK, FO, FJ, FI, FR, GF, PF, TF, GA, GM, GE, DE, GH, GI, GR, GL, GD, GP, GU, GT, GG, GN, GW, GY, HT, HM, VA, HN, HK, HU, IS, IN, ID, IR, IQ, IE, IM, IL, IT, JM, JP, JE, JO, KZ, KE, KI, KP, KR, KW, KG, LA, LV, LB, LS, LR, LY, LI, LT, LU, MO, MK, MG, MW, MY, MV, ML, MT, MH, MQ, MR, MU, YT, MX, FM, MD, MC, MN, ME, MS, MA, MZ, MM, NA, NR, NP, NL, AN, NC, NZ, NI, NE, NG, NU, NF, MP, NO, OM, PK, PW, PS, PA, PG, PY, PE, PH, PN, PL, PT, PR, QA, RE, RO, RU, RW, BL, SH, KN, LC, MF, PM, VC, WS, SM, ST, SA, SN, RS, SC, SL, SG, SK, SI, SB, SO, ZA, GS, ES, LK, SD, SR, SJ, SZ, SE, CH, SY, TW, TJ, TZ, TH, TL, TG, TK, TO, TT, TN, TR, TM, TC, TV, UG, UA, AE, US, UM, UY, UZ, VU, VE, VN, VG, VI, WF, EH, YE, ZM, ZW |
| `results[].subtotal` | string(decimal) | — | — | 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `results[].discount_type` | enum(DiscountTypeEnum) | — | — | 枚举: PERCENTAGE, FIXED |
| `results[].discount_value` | string(decimal) | — | — | 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `results[].discount_amount` | string(decimal) | — | — | 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `results[].tax_rate` | string(decimal) | — | Tax Rate (%) | 正则: ^-?\d{0,3}(?:\.\d{0,2})?$ |
| `results[].tax_amount` | string(decimal) | — | — | 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `results[].shipping_amount` | string(decimal) | — | Shipping | 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `results[].total_amount` | string(decimal) | — | — | 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `results[].currency` | → CurrencyEnum | — | — | — |
| `results[].amount_paid` | string(decimal) | — | — | 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `results[].amount_due` | string(decimal) | — | — | 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `results[].issue_date` | string(date) | — | — | — |
| `results[].due_date` | string(date) | — | — | 可空 |
| `results[].payment_terms` | → PaymentTermsEnum | — | — | — |
| `results[].sent_at` | string(date-time) | — | — | 可空 |
| `results[].viewed_at` | string(date-time) | — | — | 可空 |
| `results[].paid_at` | string(date-time) | — | — | 可空 |
| `results[].reminder_enabled` | boolean | — | Reminders Enabled | — |
| `results[].reminder_days_before` | integer(int64) | — | Remind Days Before Due | — |
| `results[].reminder_days_after` | integer(int64) | — | Remind Days After Due | — |
| `results[].reminder_frequency` | → ReminderFrequencyEnum | — | — | — |
| `results[].last_reminder_sent` | string(date-time) | — | — | 可空 |
| `results[].reminder_count` | integer(int64) | — | Reminders Sent | — |
| `results[].public_token` | string | — | — | ≤64字符 |
| `results[].public_link_enabled` | boolean | — | — | — |
| `results[].public_url` | string | ✅ | — | 只读 |
| `results[].template` | any | ✅ | — | 只读 |
| `results[].notes` | string | — | — | — |
| `results[].terms` | string | — | Terms & Conditions | — |
| `results[].details` | string | — | Internal Details | 可空 |
| `results[].billing_period` | string | — | — | 可空; ≤100字符 |
| `results[].po_number` | string | — | — | 可空; ≤100字符 |
| `results[].line_items` | [InvoiceLineItem] | ✅ | — | 只读 |
| `results[].line_items[].id` | string(uuid) | ✅ | — | 只读 |
| `results[].line_items[].product` | string(uuid) | — | — | 可空 |
| `results[].line_items[].product_name` | string | ✅ | — | 只读 |
| `results[].line_items[].name` | string | — | Item Name | 可空; ≤255字符 |
| `results[].line_items[].description` | string | — | — | ≤500字符 |
| `results[].line_items[].quantity` | string(decimal) | — | — | 正则: ^-?\d{0,8}(?:\.\d{0,2})?$ |
| `results[].line_items[].unit_price` | string(decimal) | — | — | 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `results[].line_items[].discount_type` | enum(DiscountTypeEnum) | — | — | 枚举: PERCENTAGE, FIXED |
| `results[].line_items[].discount_value` | string(decimal) | — | — | 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `results[].line_items[].discount_amount` | string(decimal) | ✅ | — | 只读; 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `results[].line_items[].tax_rate` | string(decimal) | — | Tax Rate (%) | 正则: ^-?\d{0,3}(?:\.\d{0,2})?$ |
| `results[].line_items[].tax_amount` | string(decimal) | ✅ | — | 只读; 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `results[].line_items[].subtotal` | string(decimal) | ✅ | — | 只读; 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `results[].line_items[].total` | string(decimal) | ✅ | — | 只读; 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `results[].line_items[].order` | integer(int64) | — | — | — |
| `results[].line_items[].formatted_unit_price` | string | ✅ | — | 只读 |
| `results[].line_items[].formatted_total` | string | ✅ | — | 只读 |
| `results[].payments` | [Payment] | ✅ | — | 只读 |
| `results[].payments[].id` | string(uuid) | ✅ | — | 只读 |
| `results[].payments[].invoice` | string(uuid) | ✅ | — | — |
| `results[].payments[].amount` | string(decimal) | ✅ | — | 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `results[].payments[].payment_date` | string(date) | ✅ | — | — |
| `results[].payments[].payment_method` | → PaymentMethodEnum | ✅ | — | — |
| `results[].payments[].reference_number` | string | — | — | ≤100字符 |
| `results[].payments[].notes` | string | — | — | — |
| `results[].payments[].created_at` | string(date-time) | ✅ | — | 只读 |
| `results[].assigned_to` | [Profile] | ✅ | — | 只读 |
| `results[].assigned_to[].id` | string(uuid) | ✅ | — | 只读 |
| `results[].assigned_to[].user_details` | object | ✅ | — | 只读 |
| `results[].assigned_to[].role` | → ProfileRoleEnum | — | — | — |
| `results[].assigned_to[].address` | string(uuid) | — | — | 可空 |
| `results[].assigned_to[].has_marketing_access` | boolean | — | — | — |
| `results[].assigned_to[].has_sales_access` | boolean | — | — | — |
| `results[].assigned_to[].phone` | string | — | — | 可空; ≤20字符 |
| `results[].assigned_to[].date_of_joining` | string(date) | — | — | 可空 |
| `results[].assigned_to[].is_active` | boolean | — | — | — |
| `results[].assigned_to[].created_at` | string(date-time) | ✅ | — | 只读 |
| `results[].teams` | [Teams] | ✅ | — | 只读 |
| `results[].teams[].id` | string(uuid) | ✅ | — | 只读 |
| `results[].teams[].name` | string | ✅ | — | ≤100字符 |
| `results[].teams[].description` | string | ✅ | — | — |
| `results[].teams[].users` | [Profile] | ✅ | — | 只读 |
| `results[].teams[].users[].id` | string(uuid) | ✅ | — | 只读 |
| `results[].teams[].users[].user_details` | object | ✅ | — | 只读 |
| `results[].teams[].users[].role` | → ProfileRoleEnum | — | — | — |
| `results[].teams[].users[].address` | string(uuid) | — | — | 可空 |
| `results[].teams[].users[].has_marketing_access` | boolean | — | — | — |
| `results[].teams[].users[].has_sales_access` | boolean | — | — | — |
| `results[].teams[].users[].phone` | string | — | — | 可空; ≤20字符 |
| `results[].teams[].users[].date_of_joining` | string(date) | — | — | 可空 |
| `results[].teams[].users[].is_active` | boolean | — | — | — |
| `results[].teams[].users[].created_at` | string(date-time) | ✅ | — | 只读 |
| `results[].teams[].created_at` | string(date-time) | ✅ | — | 只读 |
| `results[].teams[].created_by` | → User | ✅ | — | — |
| `results[].teams[].created_by.id` | string(uuid) | ✅ | — | 只读 |
| `results[].teams[].created_by.email` | string(email) | — | Email address | ≤254字符 |
| `results[].teams[].created_by.profile_pic` | string | — | — | 可空; ≤1000字符 |
| `results[].is_overdue` | boolean | ✅ | — | 只读 |
| `results[].created_at` | string(date-time) | ✅ | — | 只读 |
| `results[].updated_at` | string(date-time) | ✅ | Last Modified At | 只读 |
| `results[].created_by` | any | ✅ | — | 只读 |
| `results[].org` | any | ✅ | — | 只读 |

**可能的错误响应（DRF 标准）**

- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### POST `/api/invoices/` 🔒

列表查询 + 新建 invoices

**200** → 推断: Invoice

> OpenAPI 未标注；创建成功推断返回 `Invoice`

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### DELETE `/api/invoices/attachments/{id}/` 🔒

删除附件

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string(uuid) | ✅ | — |

**204** → 无响应体（删除成功）

**可能的错误响应（DRF 标准）**

- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）
- **400**: 请求参数校验失败（query/header/body 不合法）

---
### DELETE `/api/invoices/comments/{id}/` 🔒

评论更新/删除

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string(uuid) | ✅ | — |

**204** → 无响应体（删除成功）

**可能的错误响应（DRF 标准）**

- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）
- **400**: 请求参数校验失败（query/header/body 不合法）

---
### PUT `/api/invoices/comments/{id}/` 🔒

评论更新/删除

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string(uuid) | ✅ | — |

**200** → 推断: Comment

> OpenAPI 未标注；操作成功推断返回 `Comment`

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### POST `/api/invoices/from-opportunity/{opportunity_id}/` 🔒

从已赢商机（CLOSED_WON）及其行项目生成发票

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `opportunity_id` | path | string(uuid) | ✅ | — |

**201** → `Invoice`

**Schema: `Invoice`**

| 字段 | 类型 | 必填 | 说明 | 约束 |
|------|------|------|------|------|
| `id` | string(uuid) | ✅ | — | 只读 |
| `invoice_number` | string | ✅ | — | ≤50字符 |
| `invoice_title` | string | ✅ | — | ≤100字符 |
| `status` | → InvoiceStatusEnum | — | — | — |
| `account` | any | ✅ | — | 只读 |
| `contact` | any | ✅ | — | 只读 |
| `opportunity` | any | ✅ | — | 只读 |
| `client_name` | string | — | — | ≤255字符 |
| `client_email` | string(email) | — | — | ≤254字符 |
| `client_phone` | string | — | — | ≤25字符 |
| `billing_address_line` | string | — | Billing Address | ≤255字符 |
| `billing_city` | string | — | — | ≤100字符 |
| `billing_state` | string | — | — | ≤100字符 |
| `billing_postcode` | string | — | Billing Postal Code | ≤20字符 |
| `billing_country` | enum(ClientCountryEnum) | — | — | 枚举: GB, AF, AX, AL, DZ, AS, AD, AO, AI, AQ, AG, AR, AM, AW, AU, AT, AZ, BS, BH, BD, BB, BY, BE, BZ, BJ, BM, BT, BO, BA, BW, BV, BR, IO, BN, BG, BF, BI, KH, CM, CA, CV, KY, CF, TD, CL, CN, CX, CC, CO, KM, CG, CD, CK, CR, CI, HR, CU, CY, CZ, DK, DJ, DM, DO, EC, EG, SV, GQ, ER, EE, ET, FK, FO, FJ, FI, FR, GF, PF, TF, GA, GM, GE, DE, GH, GI, GR, GL, GD, GP, GU, GT, GG, GN, GW, GY, HT, HM, VA, HN, HK, HU, IS, IN, ID, IR, IQ, IE, IM, IL, IT, JM, JP, JE, JO, KZ, KE, KI, KP, KR, KW, KG, LA, LV, LB, LS, LR, LY, LI, LT, LU, MO, MK, MG, MW, MY, MV, ML, MT, MH, MQ, MR, MU, YT, MX, FM, MD, MC, MN, ME, MS, MA, MZ, MM, NA, NR, NP, NL, AN, NC, NZ, NI, NE, NG, NU, NF, MP, NO, OM, PK, PW, PS, PA, PG, PY, PE, PH, PN, PL, PT, PR, QA, RE, RO, RU, RW, BL, SH, KN, LC, MF, PM, VC, WS, SM, ST, SA, SN, RS, SC, SL, SG, SK, SI, SB, SO, ZA, GS, ES, LK, SD, SR, SJ, SZ, SE, CH, SY, TW, TJ, TZ, TH, TL, TG, TK, TO, TT, TN, TR, TM, TC, TV, UG, UA, AE, US, UM, UY, UZ, VU, VE, VN, VG, VI, WF, EH, YE, ZM, ZW |
| `client_address_line` | string | — | Client Address | ≤255字符 |
| `client_city` | string | — | — | ≤100字符 |
| `client_state` | string | — | — | ≤100字符 |
| `client_postcode` | string | — | Client Postal Code | ≤20字符 |
| `client_country` | enum(ClientCountryEnum) | — | — | 枚举: GB, AF, AX, AL, DZ, AS, AD, AO, AI, AQ, AG, AR, AM, AW, AU, AT, AZ, BS, BH, BD, BB, BY, BE, BZ, BJ, BM, BT, BO, BA, BW, BV, BR, IO, BN, BG, BF, BI, KH, CM, CA, CV, KY, CF, TD, CL, CN, CX, CC, CO, KM, CG, CD, CK, CR, CI, HR, CU, CY, CZ, DK, DJ, DM, DO, EC, EG, SV, GQ, ER, EE, ET, FK, FO, FJ, FI, FR, GF, PF, TF, GA, GM, GE, DE, GH, GI, GR, GL, GD, GP, GU, GT, GG, GN, GW, GY, HT, HM, VA, HN, HK, HU, IS, IN, ID, IR, IQ, IE, IM, IL, IT, JM, JP, JE, JO, KZ, KE, KI, KP, KR, KW, KG, LA, LV, LB, LS, LR, LY, LI, LT, LU, MO, MK, MG, MW, MY, MV, ML, MT, MH, MQ, MR, MU, YT, MX, FM, MD, MC, MN, ME, MS, MA, MZ, MM, NA, NR, NP, NL, AN, NC, NZ, NI, NE, NG, NU, NF, MP, NO, OM, PK, PW, PS, PA, PG, PY, PE, PH, PN, PL, PT, PR, QA, RE, RO, RU, RW, BL, SH, KN, LC, MF, PM, VC, WS, SM, ST, SA, SN, RS, SC, SL, SG, SK, SI, SB, SO, ZA, GS, ES, LK, SD, SR, SJ, SZ, SE, CH, SY, TW, TJ, TZ, TH, TL, TG, TK, TO, TT, TN, TR, TM, TC, TV, UG, UA, AE, US, UM, UY, UZ, VU, VE, VN, VG, VI, WF, EH, YE, ZM, ZW |
| `subtotal` | string(decimal) | — | — | 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `discount_type` | enum(DiscountTypeEnum) | — | — | 枚举: PERCENTAGE, FIXED |
| `discount_value` | string(decimal) | — | — | 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `discount_amount` | string(decimal) | — | — | 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `tax_rate` | string(decimal) | — | Tax Rate (%) | 正则: ^-?\d{0,3}(?:\.\d{0,2})?$ |
| `tax_amount` | string(decimal) | — | — | 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `shipping_amount` | string(decimal) | — | Shipping | 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `total_amount` | string(decimal) | — | — | 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `currency` | → CurrencyEnum | — | — | — |
| `amount_paid` | string(decimal) | — | — | 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `amount_due` | string(decimal) | — | — | 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `issue_date` | string(date) | — | — | — |
| `due_date` | string(date) | — | — | 可空 |
| `payment_terms` | → PaymentTermsEnum | — | — | — |
| `sent_at` | string(date-time) | — | — | 可空 |
| `viewed_at` | string(date-time) | — | — | 可空 |
| `paid_at` | string(date-time) | — | — | 可空 |
| `reminder_enabled` | boolean | — | Reminders Enabled | — |
| `reminder_days_before` | integer(int64) | — | Remind Days Before Due | — |
| `reminder_days_after` | integer(int64) | — | Remind Days After Due | — |
| `reminder_frequency` | → ReminderFrequencyEnum | — | — | — |
| `last_reminder_sent` | string(date-time) | — | — | 可空 |
| `reminder_count` | integer(int64) | — | Reminders Sent | — |
| `public_token` | string | — | — | ≤64字符 |
| `public_link_enabled` | boolean | — | — | — |
| `public_url` | string | ✅ | — | 只读 |
| `template` | any | ✅ | — | 只读 |
| `notes` | string | — | — | — |
| `terms` | string | — | Terms & Conditions | — |
| `details` | string | — | Internal Details | 可空 |
| `billing_period` | string | — | — | 可空; ≤100字符 |
| `po_number` | string | — | — | 可空; ≤100字符 |
| `line_items` | [InvoiceLineItem] | ✅ | — | 只读 |
| `line_items[].id` | string(uuid) | ✅ | — | 只读 |
| `line_items[].product` | string(uuid) | — | — | 可空 |
| `line_items[].product_name` | string | ✅ | — | 只读 |
| `line_items[].name` | string | — | Item Name | 可空; ≤255字符 |
| `line_items[].description` | string | — | — | ≤500字符 |
| `line_items[].quantity` | string(decimal) | — | — | 正则: ^-?\d{0,8}(?:\.\d{0,2})?$ |
| `line_items[].unit_price` | string(decimal) | — | — | 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `line_items[].discount_type` | enum(DiscountTypeEnum) | — | — | 枚举: PERCENTAGE, FIXED |
| `line_items[].discount_value` | string(decimal) | — | — | 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `line_items[].discount_amount` | string(decimal) | ✅ | — | 只读; 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `line_items[].tax_rate` | string(decimal) | — | Tax Rate (%) | 正则: ^-?\d{0,3}(?:\.\d{0,2})?$ |
| `line_items[].tax_amount` | string(decimal) | ✅ | — | 只读; 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `line_items[].subtotal` | string(decimal) | ✅ | — | 只读; 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `line_items[].total` | string(decimal) | ✅ | — | 只读; 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `line_items[].order` | integer(int64) | — | — | — |
| `line_items[].formatted_unit_price` | string | ✅ | — | 只读 |
| `line_items[].formatted_total` | string | ✅ | — | 只读 |
| `payments` | [Payment] | ✅ | — | 只读 |
| `payments[].id` | string(uuid) | ✅ | — | 只读 |
| `payments[].invoice` | string(uuid) | ✅ | — | — |
| `payments[].amount` | string(decimal) | ✅ | — | 正则: ^-?\d{0,10}(?:\.\d{0,2})?$ |
| `payments[].payment_date` | string(date) | ✅ | — | — |
| `payments[].payment_method` | → PaymentMethodEnum | ✅ | — | — |
| `payments[].reference_number` | string | — | — | ≤100字符 |
| `payments[].notes` | string | — | — | — |
| `payments[].created_at` | string(date-time) | ✅ | — | 只读 |
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
| `is_overdue` | boolean | ✅ | — | 只读 |
| `created_at` | string(date-time) | ✅ | — | 只读 |
| `updated_at` | string(date-time) | ✅ | Last Modified At | 只读 |
| `created_by` | any | ✅ | — | 只读 |
| `org` | any | ✅ | — | 只读 |

**可能的错误响应（DRF 标准）**

- **400**: —
- **404**: —
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### GET `/api/invoices/{id}/` 🔒

获取详情 + 全量更新 a single invoice

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string(uuid) | ✅ | — |

**200** → 推断: Invoice

> OpenAPI 未标注；推断返回 `Invoice`

**可能的错误响应（DRF 标准）**

- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）
- **400**: 请求参数校验失败（query/header/body 不合法）

---
### PUT `/api/invoices/{id}/` 🔒

获取详情 + 全量更新 a single invoice

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string(uuid) | ✅ | — |

**200** → 推断: Invoice

> OpenAPI 未标注；操作成功推断返回 `Invoice`

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### POST `/api/invoices/{id}/cancel/` 🔒

取消发票

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string(uuid) | ✅ | — |

**200** → 推断: object

> OpenAPI 未标注；动作 `cancel` 返回 JSON

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### POST `/api/invoices/{id}/duplicate/` 🔒

复制发票

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string(uuid) | ✅ | — |

**200** → 推断: object

> OpenAPI 未标注；动作 `duplicate` 返回 JSON

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### POST `/api/invoices/{id}/mark-paid/` 🔒

标记发票为已支付

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string(uuid) | ✅ | — |

**200** → 推断: object

> OpenAPI 未标注；动作 `mark-paid` 返回 JSON

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### GET `/api/invoices/{id}/pdf/` 🔒

生成并下载发票 PDF

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string(uuid) | ✅ | — |

**200** → 推断: application/pdf

> OpenAPI 未标注；根据命名推断返回 PDF 二进制流

**可能的错误响应（DRF 标准）**

- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）
- **400**: 请求参数校验失败（query/header/body 不合法）

---
### POST `/api/invoices/{id}/send/` 🔒

通过邮件发送发票给客户

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string(uuid) | ✅ | — |

**200** → 推断: object

> OpenAPI 未标注；动作 `send` 返回 JSON

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### POST `/api/invoices/{invoice_id}/attachments/` 🔒

管理 attachments on an invoice

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `invoice_id` | path | string(uuid) | ✅ | — |

**200** → 推断: Attachments

> OpenAPI 未标注；操作成功推断返回 `Attachments`

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### POST `/api/invoices/{invoice_id}/comments/` 🔒

管理 comments on an invoice

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `invoice_id` | path | string(uuid) | ✅ | — |

**200** → 推断: Comment

> OpenAPI 未标注；操作成功推断返回 `Comment`

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### GET `/api/invoices/{invoice_id}/line-items/` 🔒

管理 line items for an invoice

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `invoice_id` | path | string(uuid) | ✅ | — |

**200** → 推断: InvoiceLineItem

> OpenAPI 未标注；推断返回 `InvoiceLineItem`

**可能的错误响应（DRF 标准）**

- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）
- **400**: 请求参数校验失败（query/header/body 不合法）

---
### POST `/api/invoices/{invoice_id}/line-items/` 🔒

管理 line items for an invoice

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `invoice_id` | path | string(uuid) | ✅ | — |

**200** → 推断: InvoiceLineItem

> OpenAPI 未标注；操作成功推断返回 `InvoiceLineItem`

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### DELETE `/api/invoices/{invoice_id}/line-items/{id}/` 🔒

行项目更新/删除

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string(uuid) | ✅ | — |
| `invoice_id` | path | string(uuid) | ✅ | — |

**204** → 无响应体（删除成功）

**可能的错误响应（DRF 标准）**

- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）
- **400**: 请求参数校验失败（query/header/body 不合法）

---
### PUT `/api/invoices/{invoice_id}/line-items/{id}/` 🔒

行项目更新/删除

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string(uuid) | ✅ | — |
| `invoice_id` | path | string(uuid) | ✅ | — |

**200** → 推断: InvoiceLineItem

> OpenAPI 未标注；操作成功推断返回 `InvoiceLineItem`

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### GET `/api/invoices/{invoice_id}/payments/` 🔒

列表查询 + 新建 payments for an invoice

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `invoice_id` | path | string(uuid) | ✅ | — |

**200** → 推断: Payment

> OpenAPI 未标注；推断返回 `Payment`

**可能的错误响应（DRF 标准）**

- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）
- **400**: 请求参数校验失败（query/header/body 不合法）

---
### POST `/api/invoices/{invoice_id}/payments/` 🔒

列表查询 + 新建 payments for an invoice

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `invoice_id` | path | string(uuid) | ✅ | — |

**200** → 推断: Payment

> OpenAPI 未标注；操作成功推断返回 `Payment`

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）

---
### DELETE `/api/invoices/{invoice_id}/payments/{id}/` 🔒

删除支付记录

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | path | string(uuid) | ✅ | — |
| `invoice_id` | path | string(uuid) | ✅ | — |

**204** → 无响应体（删除成功）

**可能的错误响应（DRF 标准）**

- **404**: 资源不存在（指定的 id/token 未找到）
- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）
- **403**: 无权限访问该资源（org 不匹配或无角色）
- **400**: 请求参数校验失败（query/header/body 不合法）

---