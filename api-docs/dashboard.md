# 客户关系管理 — 仪表盘

> 共 2 个端点。🔒 = 需要登录（JWT），🟢 = 无需鉴权。

## 端点速览

| 方法 | 路径 | 鉴权 | 说明 |
|------|------|------|------|
| GET | `/api/activities/` | 🔒 | Get recent activities for the organization
Returns the last 10 activities by default |
| GET | `/api/dashboard/` | 🔒 |  |

## 端点详情

### GET `/api/activities/` 🔒

Get recent activities for the organization
Returns the last 10 activities by default

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `entity_type` | query | string | — | Filter by entity type (Account, Lead, Contact, etc.) |
| `limit` | query | integer | — | Number of activities to return (default: 10, max: 50) |
| `org` | header | string | — |  |

**响应**

- **200** `array` 

---

### GET `/api/dashboard/` 🔒

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `org` | header | string | — |  |

**响应**

- **200** `ApiHomeResponse` 

---
