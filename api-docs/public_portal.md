# 公共门户（无鉴权）

> 共 6 个端点。🔒 = 需要登录（JWT），🟢 = 无需鉴权。
> 对外公开门户，**🟢 无鉴权**。客户通过 public_token 访问自己的发票/报价单。接受/拒绝报价单也在此。

## 端点速览

| 方法 | 路径 | 鉴权 | 说明 |
|------|------|------|------|
| GET | `/api/public/estimate/{token}/` | 🟢 | 通过公开 token 获取报价单 |
| POST | `/api/public/estimate/{token}/accept/` | 🟢 | 通过公开 token 接受报价单 |
| POST | `/api/public/estimate/{token}/decline/` | 🟢 | 通过公开 token 拒绝报价单 |
| GET | `/api/public/estimate/{token}/pdf/` | 🟢 | 通过公开 token 下载报价单 PDF |
| GET | `/api/public/invoice/{token}/` | 🟢 | 通过公开 token 获取发票 |
| GET | `/api/public/invoice/{token}/pdf/` | 🟢 | 通过公开 token 下载发票 PDF |

## 端点详情

### GET `/api/public/estimate/{token}/` 🟢

通过公开 token 获取报价单

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `token` | path | string | ✅ | — |

**200** → 推断: Invoice

> OpenAPI 未标注；推断返回 `Invoice`

**可能的错误响应（DRF 标准）**

- **404**: 资源不存在（指定的 id/token 未找到）
- **400**: 请求参数校验失败（query/header/body 不合法）

---
### POST `/api/public/estimate/{token}/accept/` 🟢

通过公开 token 接受报价单

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `token` | path | string | ✅ | — |

**200** → 推断: Invoice

> OpenAPI 未标注；动作 `accept` 推断返回 `Invoice`

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **404**: 资源不存在（指定的 id/token 未找到）

---
### POST `/api/public/estimate/{token}/decline/` 🟢

通过公开 token 拒绝报价单

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `token` | path | string | ✅ | — |

**200** → 推断: Invoice

> OpenAPI 未标注；动作 `decline` 推断返回 `Invoice`

**可能的错误响应（DRF 标准）**

- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）
- **404**: 资源不存在（指定的 id/token 未找到）

---
### GET `/api/public/estimate/{token}/pdf/` 🟢

通过公开 token 下载报价单 PDF

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `token` | path | string | ✅ | — |

**200** → 推断: application/pdf

> OpenAPI 未标注；根据命名推断返回 PDF 二进制流

**可能的错误响应（DRF 标准）**

- **404**: 资源不存在（指定的 id/token 未找到）
- **400**: 请求参数校验失败（query/header/body 不合法）

---
### GET `/api/public/invoice/{token}/` 🟢

通过公开 token 获取发票

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `token` | path | string | ✅ | — |

**200** → 推断: Invoice

> OpenAPI 未标注；推断返回 `Invoice`

**可能的错误响应（DRF 标准）**

- **404**: 资源不存在（指定的 id/token 未找到）
- **400**: 请求参数校验失败（query/header/body 不合法）

---
### GET `/api/public/invoice/{token}/pdf/` 🟢

通过公开 token 下载发票 PDF

**参数**

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `token` | path | string | ✅ | — |

**200** → 推断: application/pdf

> OpenAPI 未标注；根据命名推断返回 PDF 二进制流

**可能的错误响应（DRF 标准）**

- **404**: 资源不存在（指定的 id/token 未找到）
- **400**: 请求参数校验失败（query/header/body 不合法）

---