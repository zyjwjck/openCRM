# openCRM API 接口文档

> 自动生成。最后更新时间：2026-11-19 22:35。
> PROBE 后端探测: **33** 端点

## 数据来源

- **OpenAPI JSON**: 256 schema + 121 path + 232 端点，来自 Django drf-spectacular `/schema/`
- **后端实测**: 对每个 GET list 端点发真实请求，探测真实返回结构（DRF 分页 vs 自定义 dict vs 数组）
- **推断补全**: OpenAPI 未标注的响应体用路径模式 + 命名推断；每个推断端点都带 ✅/⚠ 标注

## 响应体形状总览（后端实测）

### DRF 标准分页 `{count, next, previous, results:[X]}`
- `/api/contacts/`
- `/api/invoices/`
- `/api/invoices/estimates/`
- `/api/invoices/products/`
- `/api/invoices/recurring/`
- `/api/invoices/templates/`
- `/api/boards/`

### 自定义聚合 dict（主数据 + 下拉选项一起返回）
- `/api/accounts/` → open_accounts + closed_accounts + contacts + countries + industries + users
- `/api/leads/` → open_leads + close_leads + countries + industries + users
- `/api/cases/` → cases + accounts_list + contacts_list + priority/status/type_of_case
- `/api/opportunities/` → opportunities + accounts_list + contacts_list + currency/lead_source/stage/tags
- `/api/tasks/` → tasks + accounts_list + contacts_list + priority/status
- `/api/users/` → active_users + inactive_users + roles + status
- `/api/documents/` → documents_active + documents_inactive + users + status_choices
- `/api/tags/`, `/api/teams/`, `/api/activities/`, `/api/dashboard/`

### 其他
- `/api/cases/kanban/`, `/api/leads/kanban/`, `/api/tasks/kanban/` → kanban 结构 dict
- `/api/cases/solutions/` → **后端 HTTP 500**（可能是 bug，接口暂不可用）
- `/api/auth/me/`, `/api/auth/profile/`, `/api/org/`, `/api/org/settings/`, `/api/profile/` → 用户/组织详情 dict

## 文档列表

### 客户关系管理

- [客户关系管理 — 仪表盘](dashboard.md) — **2** 个端点
- [客户关系管理 — 线索](leads.md) — **25** 个端点
- [客户关系管理 — 联系人](contacts.md) — **11** 个端点
- [客户关系管理 — 账户](accounts.md) — **12** 个端点
- [客户关系管理 — 交易（商机）](opportunities.md) — **16** 个端点
- [客户关系管理 — 工单](cases.md) — **30** 个端点
- [客户关系管理 — 任务 & 看板](tasks.md) — **34** 个端点

### 销售

- [销售 — 所有发票](sales_invoices.md) — **22** 个端点
- [销售 — 报价单](sales_estimates.md) — **8** 个端点
- [销售 — 产品](sales_products.md) — **5** 个端点
- [销售 — 循环发票](sales_recurring.md) — **6** 个端点
- [销售 — 模板](sales_templates.md) — **5** 个端点
- [销售 — 报表](sales_reports.md) — **3** 个端点

### 公共门户

- [公共门户（无鉴权）](public_portal.md) — **6** 个端点

### 系统与设置

- [系统与设置](system.md) — **47** 个端点

**总计：232 个 HTTP 端点**

## HTTP 方法分布

- **GET**: 69
- **POST**: 63
- **DELETE**: 41
- **PUT**: 35
- **PATCH**: 24

## 鉴权说明

- **🔒 需要登录**：请求头带 `Authorization: Bearer <JWT>`，JWT 由 `POST /api/auth/login/` 获取（路径 `/api/auth/*` 内的 refresh 端点和注册端点除外）。
- **🟢 无需鉴权**：公共门户 `/api/public/*`（通过 token 鉴权，非 JWT）、注册、刷新 token、健康检查等。

## 多租户隔离

所有业务端点通过 JWT 中的 `org_id` claim 实现行级隔离（RLS），不同租户数据严格隔离。部分 tasks/boards 端点将 `org` 作为 **query 必填参数**。

## 符号说明

- ✅  = OpenAPI 原始标注 或 后端实测
- ⚠  = OpenAPI 未标注，文档为推断结果（可能不完整或有偏差）
- 🟢 = 无需鉴权；🔒 = 需要 JWT
- 所有字段表均展开到最深 10 层 `$ref` 递归，并标注 enum / nullable / 约束（maxLength / pattern / readOnly）

## 重新生成

```bash
# 1) 确保后端在跑 (python manage.py runserver)
# 2) 拉最新 schema
curl http://127.0.0.1:8000/schema/ -o api_openapi.json
# 3) 探测后端 + 生成 Markdown（推荐）
python generate_api_docs.py --probe
# 4) 跳过探测（用 _probe_data.json 缓存）
python generate_api_docs.py
# 覆盖后端地址 / 令牌
# OPENCRM_BACKEND=http://192.168.1.100:8000 python generate_api_docs.py --probe
```

## 原始 OpenAPI

- [`api_openapi.json`](api_openapi.json) — 完整 OpenAPI 3.0 schema（256 schema, 121 path, ~713 KB），可直接喂给 OpenAPI-to-MCP 转换器。
- [`_probe_data.json`](_probe_data.json) — 后端探测缓存（可删，下次生成会重新探测）。
- Django Swagger UI: http://127.0.0.1:8000/swagger-ui/
- Django ReDoc: http://127.0.0.1:8000/api/schema/redoc/
