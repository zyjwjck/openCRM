# openCRM API 接口文档

> 从 Django drf-spectacular OpenAPI 3.0 schema 自动生成。最后更新时间：2026-11-10。

## 文档列表

- [客户关系管理 — 仪表盘](dashboard.md) — **2** 个端点
- [客户关系管理 — 线索](leads.md) — **25** 个端点
- [客户关系管理 — 联系人](contacts.md) — **11** 个端点
- [客户关系管理 — 账户](accounts.md) — **12** 个端点
- [客户关系管理 — 交易（商机）](opportunities.md) — **16** 个端点
- [客户关系管理 — 工单](cases.md) — **30** 个端点
- [客户关系管理 — 任务 & 看板](tasks.md) — **34** 个端点
- [销售 — 所有发票](sales_invoices.md) — **22** 个端点
- [销售 — 报价单](sales_estimates.md) — **8** 个端点
- [销售 — 产品](sales_products.md) — **5** 个端点
- [销售 — 循环发票](sales_recurring.md) — **6** 个端点
- [销售 — 模板](sales_templates.md) — **5** 个端点
- [销售 — 报表](sales_reports.md) — **3** 个端点
- [公共门户（无鉴权）](public_portal.md) — **6** 个端点
- [系统与设置](system.md) — **47** 个端点

**总计：232 个 HTTP 端点**

## HTTP 方法分布

- **GET**: 69
- **POST**: 63
- **PUT**: 35
- **PATCH**: 24
- **DELETE**: 41

## 鉴权说明

- **🔒 需要登录**：请求头带 `Authorization: Bearer <JWT>`，JWT 由 `/api/auth/login/` 获取。
- **🟢 无需鉴权**：公开门户 `/api/public/*` 和 `create-from-site` 等端点。

## 多租户

所有业务端点都通过请求头 `X-Organization-ID`（或当前 JWT 中的 org）实现行级隔离（RLS），不同租户数据严格隔离。

## 原始 OpenAPI

- [`api_openapi.json`](api_openapi.json) — 完整 OpenAPI 3.0 schema，可直接喂给 OpenAPI-to-MCP 转换器。
