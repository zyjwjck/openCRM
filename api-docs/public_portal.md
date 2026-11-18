# 公共门户（无鉴权）

> 共 6 个端点。🔒 = 需要登录（JWT），🟢 = 无需鉴权。

## 端点速览

| 方法 | 路径 | 鉴权 | 说明 |
|------|------|------|------|
| GET | `/api/public/estimate/{token}/` | 🟢 | Get estimate by public token |
| POST | `/api/public/estimate/{token}/accept/` | 🟢 | Accept estimate by public token |
| POST | `/api/public/estimate/{token}/decline/` | 🟢 | Decline estimate by public token |
| GET | `/api/public/estimate/{token}/pdf/` | 🟢 | Download estimate PDF by public token |
| GET | `/api/public/invoice/{token}/` | 🟢 | Get invoice by public token |
| GET | `/api/public/invoice/{token}/pdf/` | 🟢 | Download invoice PDF by public token |

## 端点详情

### GET `/api/public/estimate/{token}/` 🟢

Get estimate by public token

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `token` | path | string | ✅ |  |

**响应**

- **200** `` No response body

---

### POST `/api/public/estimate/{token}/accept/` 🟢

Accept estimate by public token

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `token` | path | string | ✅ |  |

**响应**

- **200** `` No response body

---

### POST `/api/public/estimate/{token}/decline/` 🟢

Decline estimate by public token

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `token` | path | string | ✅ |  |

**响应**

- **200** `` No response body

---

### GET `/api/public/estimate/{token}/pdf/` 🟢

Download estimate PDF by public token

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `token` | path | string | ✅ |  |

**响应**

- **200** `` No response body

---

### GET `/api/public/invoice/{token}/` 🟢

Get invoice by public token

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `token` | path | string | ✅ |  |

**响应**

- **200** `` No response body

---

### GET `/api/public/invoice/{token}/pdf/` 🟢

Download invoice PDF by public token

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `token` | path | string | ✅ |  |

**响应**

- **200** `` No response body

---
