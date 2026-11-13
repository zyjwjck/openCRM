r"""
openCRM MCP Server — v1 (Leads + 通用 CRM 模块)
=======================================

把 openCRM Django 后端 (http://127.0.0.1:8000) 的 REST API 暴露成 MCP tools,
让 AI agent 可以用自然语言操作 CRM 数据。

架构:  FastMCP (stdio 传输) + requests (HTTP client) + JWT 自动登录
认证:  email + password → 自动调用 /api/auth/login/ 拿 access_token
        也可以直接传入 access_token 跳过登录

运行:  .openCRM-venv\Scripts\python.exe Agent\mcp\opencrm_server.py
配置:  Agent\mcp\config.json (email/password/base_url) — 首次运行会自动生成 config.example.json

工具列表 (v1):
  --- Leads 线索 ---
  lead_list         — 列表查询 (聚合 dict, 含下拉选项)
  lead_detail       — 获取详情 (含附件/评论)
  lead_create       — 新建线索
  lead_update       — 全量更新
  lead_patch        — 部分更新 (可用于 convert)
  lead_delete       — 删除线索
  lead_kanban       — 获取看板数据
  lead_move         — 看板移动 (换阶段/状态/位置)

  --- Leads Pipeline/Stage ---
  lead_pipeline_list    — 列出所有管道
  lead_pipeline_create  — 新建管道
  lead_pipeline_detail  — 管道详情
  lead_pipeline_update  — 管道更新
  lead_pipeline_delete  — 管道删除
  lead_stage_create     — 新建管道阶段
  lead_stage_update     — 阶段更新
  lead_stage_delete     — 阶段删除
  lead_stage_reorder    — 阶段重排

  --- 通用业务模块列表（具名工具，默认按创建倒序，limit 取前 N 即最新）---
  contact_list      — 联系人(Contact)列表
  account_list      — 客户/账户(Account)列表（返回活跃/关闭分组）
  opportunity_list  — 商机(Opportunity)列表（需销售权限）
  case_list         — 工单(Case)列表
  task_list         — 任务(Task)列表

  --- Auth / 权限 ---
  auth_status       — 检查 token 是否有效
  org_list          — 获取当前用户关联的组织
  my_permissions    — 返回当前用户在组织内的权限(role/admin/sales/marketing)

  --- 权限感知通用调用 (覆盖全部 230+ 业务接口) ---
  crm_api           — 任意 REST 端点调用(GET/POST/PUT/PATCH/DELETE + path/params/body)，
                      发送前按路径+方法做权限预检(admin/sales)，权限不足返回明确 403
"""

from __future__ import annotations

import json
import os
import sys
import traceback
from pathlib import Path
from typing import Any

import re

import requests
from mcp.server.fastmcp import FastMCP

# ============================================================
# 1. 初始化 FastMCP
# ============================================================

# 默认 host/port — HTTP 模式时生效，stdio 模式时被忽略
# 端口由 DEFAULT_PORT 控制（当前 8100，HTTP 模式生效）；启动: python opencrm_server.py --http
DEFAULT_HOST = "127.0.0.1"
DEFAULT_PORT = 8100

mcp = FastMCP(
    "openCRM-MCP",
    instructions=(
        "openCRM CRM 系统 API 工具集。"
        "已为常用模块提供具名列表工具，请优先使用它们来回答查询类问题"
        "(例如用户问「最新的客户是谁」时，应调用 account_list 或 contact_list，"
        "而不要默认用 lead_list——线索只是其中一种对象)："
        "lead_list(线索) / contact_list(联系人) / account_list(客户) / "
        "opportunity_list(商机) / case_list(工单) / task_list(任务)。"
        "这些列表默认按创建时间倒序，传 limit=5 即可拿到最新的 5 条。"
        "当没有对应的具名工具，或需要写操作/访问其它端点(发票/报价/产品/用户/团队/标签/文档等)时，"
        "用 crm_api 直接调用任意 REST 端点，路径形如 /api/contacts/、/api/accounts/、"
        "/api/opportunities/、/api/invoices/ 等。"
        "所有写入与管理操作会按当前登录用户的权限(管理员/销售/营销)做预检，"
        "权限不足会返回明确错误，最终鉴权仍由后端兜底。"
    ),
    host=DEFAULT_HOST,
    port=DEFAULT_PORT,
)

# ============================================================
# 2. 配置 & 认证
# ============================================================

MCP_DIR = Path(__file__).resolve().parent
CONFIG_PATH = MCP_DIR / "config.json"
CONFIG_EXAMPLE_PATH = MCP_DIR / "config.example.json"

# 默认值
DEFAULT_BASE_URL = "http://127.0.0.1:8000"
CONFIG_EXAMPLE = {
    "base_url": "http://127.0.0.1:8000",
    "email": "admin@example.com",
    "password": "CHANGE_ME",
    "access_token": None,
    "org_name": None,  # 可选: 指定切换到哪个组织
}


# ============================================================
# 权限规则 (permission-aware routing)
# ============================================================
# 每条业务接口在后端已有 JWT + RLS 鉴权；此处做 MCP 层 best-effort 预检，
# 让 AI agent 在真正发请求前就拿到明确的「权限不足」提示，而不是盲区调用。
# 规则: (编译后的路径正则, 需要的 HTTP 方法集合 或 None=全部方法, 所需权限)
#   权限级别:
#     "admin"     — role=ADMIN 或 is_organization_admin
#     "sales"     — has_sales_access
#     "marketing" — has_marketing_access
# 设计原则: GET 等只读操作通常对所有成员开放，只对「写/管理」操作设限。
PERMISSION_RULES = [
    # --- 仅管理员可写/管理的接口 ---
    (re.compile(r"^/api/api-settings/"), None, "admin"),
    (re.compile(r"^/api/org/settings/"), {"PUT", "PATCH"}, "admin"),
    (re.compile(r"^/api/org/$"), {"POST"}, "admin"),
    (re.compile(r"^/api/tags/"), {"POST", "PUT", "DELETE"}, "admin"),
    (re.compile(r"^/api/leads/pipelines/"), {"POST", "PUT", "PATCH", "DELETE"}, "admin"),
    (re.compile(r"^/api/leads/stages/"), {"POST", "PUT", "PATCH", "DELETE"}, "admin"),
    (re.compile(r"^/api/user/"), {"POST", "PUT", "PATCH", "DELETE"}, "admin"),
    (re.compile(r"^/api/teams/"), {"POST", "PUT", "PATCH", "DELETE"}, "admin"),
    # --- 销售模块（全部方法都需要销售权限）---
    (re.compile(r"^/api/invoices/"), None, "sales"),
    (re.compile(r"^/api/opportunities/"), None, "sales"),
]


def _required_permission(method: str, path: str):
    """根据路径 + 方法返回所需权限级别；无限制返回 None。"""
    m = (method or "GET").upper()
    for rx, methods, perm in PERMISSION_RULES:
        if rx.match(path):
            if methods is None or m in methods:
                return perm
    return None


class CRMClient:
    """openCRM API 客户端 — 处理 JWT 认证、headers、错误格式化。"""

    def __init__(self, base_url: str, email: str, password: str,
                 access_token: str | None = None, org_name: str | None = None):
        self.base_url = base_url.rstrip("/")
        self.email = email
        self.password = password
        self.access_token = access_token
        self.org_name = org_name
        self.session = requests.Session()
        self.permissions = {"resolved": False}
        self._org = None
        self._login()
        self._resolve_permissions()

    # --------- 认证 ---------
    def _login(self):
        """JWT 登录拿 access_token。"""
        if self.access_token:
            return  # 已有 token
        url = f"{self.base_url}/api/auth/login/"
        try:
            r = self.session.post(url, json={
                "email": self.email, "password": self.password
            }, timeout=10)
            if r.status_code == 200:
                data = r.json()
                self.access_token = data.get("access_token") or data.get("access")
                if not self.access_token:
                    raise RuntimeError(f"登录成功但没拿到 token: {data}")
            else:
                raise RuntimeError(f"登录失败 HTTP {r.status_code}: {r.text[:200]}")
        except requests.ConnectionError:
            raise RuntimeError(
                f"无法连接后端 {self.base_url}。请先启动 Django 服务 (manage.py runserver)。"
            )

    def _headers(self) -> dict:
        headers = {"Authorization": f"Bearer {self.access_token}"}
        if self.org_name:
            headers["X-Org-Name"] = self.org_name
        return headers

    # --------- 权限解析 ---------
    def _resolve_permissions(self):
        """从 /api/auth/me/ 拿到当前用户在每个组织的权限，挑出当前 org 的权限缓存。"""
        try:
            me = self.get("/api/auth/me/")
            if isinstance(me, dict) and not me.get("__error__"):
                orgs = me.get("organizations") or []
                chosen = None
                if self.org_name:
                    chosen = next((o for o in orgs if o.get("name") == self.org_name), None)
                if chosen is None and orgs:
                    chosen = orgs[0]
                if chosen:
                    self._org = chosen.get("id")
                    self.permissions = {
                        "resolved": True,
                        "org_id": chosen.get("id"),
                        "org_name": chosen.get("name"),
                        "role": chosen.get("role"),
                        "is_organization_admin": chosen.get("is_organization_admin"),
                        "has_sales_access": chosen.get("has_sales_access"),
                        "has_marketing_access": chosen.get("has_marketing_access"),
                        "is_active": chosen.get("is_active"),
                    }
                    return
            self.permissions = {"resolved": False}
        except Exception:
            self.permissions = {"resolved": False}

    def _check_permission(self, perm: str):
        """返回 None 表示通过；否则返回权限不足的错误 dict（MCP 层 best-effort）。"""
        p = self.permissions
        if not p.get("resolved"):
            return None  # 解析失败则放行，交由后端兜底鉴权
        if perm == "active":
            if p.get("is_active") is False:
                return {"__error__": True, "status_code": 403,
                        "message": "权限不足：当前账户已被停用 (is_active=False)"}
            return None
        if perm == "admin":
            if p.get("role") == "ADMIN" or p.get("is_organization_admin"):
                return None
            return {"__error__": True, "status_code": 403,
                    "message": "权限不足：需要管理员权限 (role=ADMIN 或 is_organization_admin=True)，"
                               "当前 role=%s, is_organization_admin=%s" % (
                                   p.get("role"), p.get("is_organization_admin"))}
        if perm == "sales":
            if p.get("has_sales_access"):
                return None
            return {"__error__": True, "status_code": 403,
                    "message": "权限不足：需要销售访问权限 (has_sales_access=True)，"
                               "当前 has_sales_access=%s" % p.get("has_sales_access")}
        if perm == "marketing":
            if p.get("has_marketing_access"):
                return None
            return {"__error__": True, "status_code": 403,
                    "message": "权限不足：需要营销访问权限 (has_marketing_access=True)，"
                               "当前 has_marketing_access=%s" % p.get("has_marketing_access")}
        return None

    # --------- HTTP 封装 ---------
    def request(self, method: str, path: str, **kwargs) -> dict | list | Any:
        """统一请求封装：附加 headers、错误处理、返回解析后的 JSON。"""
        # 权限预检（best-effort，后端仍会最终鉴权）
        required = _required_permission(method, path)
        if required:
            denied = self._check_permission(required)
            if denied:
                return denied
        url = f"{self.base_url}{path}"
        kwargs.setdefault("headers", self._headers())
        kwargs.setdefault("timeout", 30)
        try:
            r = self.session.request(method, url, **kwargs)
        except requests.ConnectionError as e:
            return {"__error__": True, "message": f"连接失败: {e}"}

        body_text = r.text[:500] if r.text else ""
        try:
            body = r.json()
        except Exception:
            body = body_text

        # 非 2xx 都包装成错误结构
        if not (200 <= r.status_code < 300):
            return {
                "__error__": True,
                "status_code": r.status_code,
                "message": (
                    body.get("errors") if isinstance(body, dict) and body.get("errors")
                    else body.get("error") if isinstance(body, dict) and body.get("error")
                    else body
                ),
            }

        return body

    def get(self, path, **kw): return self.request("GET", path, **kw)
    def post(self, path, **kw): return self.request("POST", path, **kw)
    def put(self, path, **kw): return self.request("PUT", path, **kw)
    def patch(self, path, **kw): return self.request("PATCH", path, **kw)
    def delete(self, path, **kw): return self.request("DELETE", path, **kw)


def _load_config() -> dict:
    """加载配置，首次运行时生成示例文件。"""
    if CONFIG_PATH.exists():
        with open(CONFIG_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    # 生成示例
    with open(CONFIG_EXAMPLE_PATH, "w", encoding="utf-8") as f:
        json.dump(CONFIG_EXAMPLE, f, indent=2, ensure_ascii=False)
    # 返回默认 — 提示用户
    return CONFIG_EXAMPLE.copy()


def _get_client() -> CRMClient:
    """懒加载 client（每个 tool 调用时都会重新获取，确保 auth 有效）。"""
    cfg = _load_config()
    if cfg.get("password") == "CHANGE_ME" and not cfg.get("access_token"):
        raise RuntimeError(
            f"请先在 {CONFIG_PATH} 中配置 email 和 password，"
            f"或直接写入 access_token。已生成 {CONFIG_EXAMPLE_PATH} 作为参考。"
        )
    return CRMClient(
        base_url=cfg.get("base_url", DEFAULT_BASE_URL),
        email=cfg.get("email", ""),
        password=cfg.get("password", ""),
        access_token=cfg.get("access_token"),
        org_name=cfg.get("org_name"),
    )


# ============================================================
# 3. 通用错误处理装饰器
# ============================================================

def safe_call(fn):
    """捕获异常，统一返回 {'__error__': True, ...} 格式。"""
    def wrapper(*args, **kwargs):
        try:
            return fn(*args, **kwargs)
        except RuntimeError as e:
            return {"__error__": True, "message": str(e)}
        except Exception as e:
            return {
                "__error__": True,
                "message": f"{type(e).__name__}: {e}",
                "traceback": traceback.format_exc()[:500],
            }
    # 保留原函数签名给 FastMCP 解析
    wrapper.__name__ = fn.__name__
    wrapper.__qualname__ = fn.__qualname__
    wrapper.__doc__ = fn.__doc__
    wrapper.__annotations__ = fn.__annotations__
    wrapper.__signature__ = __import__("inspect").signature(fn)
    return wrapper


# ============================================================
# 4. Leads Tools
# ============================================================

@mcp.tool()
@safe_call
def lead_list(
    status: str | None = None,
    source: str | None = None,
    assigned_to: str | None = None,
    search: str | None = None,
    rating: str | None = None,
    offset: int = 0,
    limit: int = 10,
) -> dict:
    """查询线索列表，返回聚合 dict（含 open_leads / close_leads / 下拉选项）。

    Args:
        status: 按状态筛选 — 'assigned' | 'in process' | 'closed' | 'recycled' | 'converted'
        source: 按来源筛选
        assigned_to: 分配给的用户 ID
        search: 全文搜索（名字/公司/邮箱/标题）
        rating: 评级 — 'HOT' | 'WARM' | 'COLD'
        offset: 分页偏移
        limit: 每页数量，默认 10
    """
    c = _get_client()
    params = {"offset": offset, "limit": limit}
    if status: params["status"] = status
    if source: params["source"] = source
    if assigned_to: params["assigned_to"] = assigned_to
    if search: params["search"] = search
    if rating: params["rating"] = rating
    return c.get("/api/leads/", params=params)


@mcp.tool()
@safe_call
def lead_detail(lead_id: str) -> dict:
    """获取单个线索的完整详情（含附件、评论、可分配用户列表等）。

    Args:
        lead_id: Lead UUID（从 lead_list 或 lead_kanban 返回的 id 字段获取）
    """
    c = _get_client()
    return c.get(f"/api/leads/{lead_id}/")


@mcp.tool()
@safe_call
def lead_create(
    first_name: str | None = None,
    last_name: str | None = None,
    email: str | None = None,
    title: str | None = None,
    company_name: str | None = None,
    phone: str | None = None,
    status: str | None = None,
    source: str | None = None,
    rating: str | None = None,
    opportunity_amount: float | None = None,
    probability: int | None = None,
    close_date: str | None = None,
    country: str | None = None,
    city: str | None = None,
    description: str | None = None,
    assigned_to: list[str] | None = None,
    tags: list[str] | None = None,
    teams: list[str] | None = None,
    stage_id: str | None = None,
    convert_to_account: bool = False,
) -> dict:
    """新建线索。如果设置 convert_to_account=True 会调用后端 convert_lead_to_account 服务，
    自动创建 Account + Contact + Opportunity。

    Args:
        first_name: 名
        last_name: 姓
        email: 邮箱（convert 时必填）
        title: 线索标题/主题
        company_name: 公司名
        phone: 电话
        status: 状态 'assigned' | 'in process' | 'closed' | 'recycled' | 'converted'
        source: 来源
        rating: 'HOT' | 'WARM' | 'COLD'
        opportunity_amount: 机会金额
        probability: 胜率 % (0-100)
        close_date: 预计成交日期 YYYY-MM-DD
        country: 国家代码
        city: 城市
        description: 备注
        assigned_to: 分配给的 Profile ID 列表
        tags: 标签 ID 列表
        teams: 团队 ID 列表
        stage_id: Pipeline 阶段 ID
        convert_to_account: 是否创建后立即转换（会同时创建 Account/Contact/Opportunity）
    """
    c = _get_client()
    data: dict[str, Any] = {}
    for key, val in locals().items():
        if key in ("c", "convert_to_account"): continue
        if val is not None: data[key] = val

    if convert_to_account:
        data["status"] = "converted"
        if not data.get("email"):
            return {"__error__": True, "message": "convert_to_account=True 时 email 必填"}

    return c.post("/api/leads/", json=data)


@mcp.tool()
@safe_call
def lead_update(lead_id: str, **fields: Any) -> dict:
    """全量更新线索（PUT）。传入任意字段名=值，覆盖整个 Lead。

    Args:
        lead_id: Lead UUID
        **fields: 要更新的字段，如 first_name='张三', status='in process'
    """
    c = _get_client()
    return c.put(f"/api/leads/{lead_id}/", json=fields)


@mcp.tool()
@safe_call
def lead_patch(lead_id: str, **fields: Any) -> dict:
    """部分更新线索（PATCH）。只更新传入的字段。
    特例：传入 status='converted' 或 is_converted=True 时会触发 convert 流程。

    Args:
        lead_id: Lead UUID
        **fields: 要更新的字段，如 status='closed', rating='HOT'
    """
    c = _get_client()
    return c.patch(f"/api/leads/{lead_id}/", json=fields)


@mcp.tool()
@safe_call
def lead_convert(lead_id: str) -> dict:
    """将线索转换为客户（Account）+ 联系人（Contact）+ 商机（Opportunity）。
    自动设置 status='converted'，返回创建出的 account_id / contact_id / opportunity_id。

    Args:
        lead_id: Lead UUID
    """
    c = _get_client()
    return c.patch(f"/api/leads/{lead_id}/", json={"status": "converted"})


@mcp.tool()
@safe_call
def lead_delete(lead_id: str) -> dict:
    """删除线索。只有创建者或管理员可以删除。

    Args:
        lead_id: Lead UUID
    """
    c = _get_client()
    return c.delete(f"/api/leads/{lead_id}/")


# ---------- Leads Kanban ----------

@mcp.tool()
@safe_call
def lead_kanban(
    pipeline_id: str | None = None,
    assigned_to: str | None = None,
    rating: str | None = None,
    search: str | None = None,
) -> dict:
    """获取线索看板数据。

    Args:
        pipeline_id: Pipeline ID — 不传则返回 status-based 看板（按 Lead.status 分列）
        assigned_to: 按分配用户 ID 筛选
        rating: 'HOT' | 'WARM' | 'COLD'
        search: 搜索关键词（名字/公司/邮箱/标题）
    """
    c = _get_client()
    params = {}
    if pipeline_id: params["pipeline_id"] = pipeline_id
    if assigned_to: params["assigned_to"] = assigned_to
    if rating: params["rating"] = rating
    if search: params["search"] = search
    return c.get("/api/leads/kanban/", params=params)


@mcp.tool()
@safe_call
def lead_move(
    lead_id: str,
    stage_id: str | None = None,
    status: str | None = None,
    above_lead_id: str | None = None,
    below_lead_id: str | None = None,
    kanban_order: float | None = None,
) -> dict:
    """在看板上移动线索到不同阶段/状态/位置。
    stage_id 和 status 至少传一个。above/below/kanban_order 选一种定位方式。

    Args:
        lead_id: Lead UUID
        stage_id: Pipeline 阶段 ID（自定义看板）
        status: Lead 状态（status-based 看板）'assigned' | 'in process' | 'closed' | 'recycled'
        above_lead_id: 插入到这个 lead 之后（位置 hint）
        below_lead_id: 插入到这个 lead 之前（位置 hint）
        kanban_order: 直接设置精确排序值
    """
    c = _get_client()
    data: dict[str, Any] = {}
    if stage_id is not None: data["stage_id"] = stage_id
    if status is not None: data["status"] = status
    if above_lead_id is not None: data["above_lead_id"] = above_lead_id
    if below_lead_id is not None: data["below_lead_id"] = below_lead_id
    if kanban_order is not None: data["kanban_order"] = kanban_order
    if not stage_id and not status:
        return {"__error__": True, "message": "stage_id 和 status 至少传一个"}
    return c.patch(f"/api/leads/{lead_id}/move/", json=data)


# ---------- Leads Pipeline ----------

@mcp.tool()
@safe_call
def lead_pipeline_list() -> dict:
    """列出当前组织的所有活跃 Pipeline（含 stages）。"""
    c = _get_client()
    return c.get("/api/leads/pipelines/")


@mcp.tool()
@safe_call
def lead_pipeline_create(
    name: str,
    description: str | None = None,
    is_default: bool = False,
    create_default_stages: bool = True,
) -> dict:
    """新建 Pipeline。ADMIN 权限。

    Args:
        name: 管道名称（必填）
        description: 描述
        is_default: 是否设为默认管道
        create_default_stages: 自动创建 6 个标准阶段（New/Contacted/Qualified/Proposal/Won/Lost）
    """
    c = _get_client()
    data = {"name": name, "is_default": is_default,
            "create_default_stages": create_default_stages}
    if description: data["description"] = description
    return c.post("/api/leads/pipelines/", json=data)


@mcp.tool()
@safe_call
def lead_pipeline_detail(pipeline_id: str) -> dict:
    """Pipeline 详情（含 stages）。

    Args:
        pipeline_id: Pipeline UUID
    """
    c = _get_client()
    return c.get(f"/api/leads/pipelines/{pipeline_id}/")


@mcp.tool()
@safe_call
def lead_pipeline_update(pipeline_id: str, **fields: Any) -> dict:
    """更新 Pipeline。ADMIN 权限。

    Args:
        pipeline_id: Pipeline UUID
        **fields: 要更新的字段（name/description/is_default）
    """
    c = _get_client()
    return c.put(f"/api/leads/pipelines/{pipeline_id}/", json=fields)


@mcp.tool()
@safe_call
def lead_pipeline_delete(pipeline_id: str) -> dict:
    """软删除 Pipeline（设 is_active=False）。ADMIN 权限。
    有 leads 的 pipeline 不允许删除。

    Args:
        pipeline_id: Pipeline UUID
    """
    c = _get_client()
    return c.delete(f"/api/leads/pipelines/{pipeline_id}/")


# ---------- Leads Stage ----------

@mcp.tool()
@safe_call
def lead_stage_create(
    pipeline_pk: str,
    name: str,
    color: str | None = "#6B7280",
    stage_type: str | None = "open",
    order: int | None = None,
    maps_to_status: str | None = None,
    win_probability: int | None = None,
    wip_limit: int | None = None,
) -> dict:
    """在 Pipeline 下新建阶段。ADMIN 权限。

    Args:
        pipeline_pk: 所属 Pipeline UUID
        name: 阶段名称
        color: Hex 颜色
        stage_type: 'open' | 'won' | 'lost'
        order: 排序
        maps_to_status: 进入此阶段时自动更新 Lead.status
        win_probability: 默认胜率 %
        wip_limit: 在制品数量上限（None=不限）
    """
    c = _get_client()
    data: dict[str, Any] = {"name": name, "color": color, "stage_type": stage_type}
    if order is not None: data["order"] = order
    if maps_to_status is not None: data["maps_to_status"] = maps_to_status
    if win_probability is not None: data["win_probability"] = win_probability
    if wip_limit is not None: data["wip_limit"] = wip_limit
    return c.post(f"/api/leads/pipelines/{pipeline_pk}/stages/", json=data)


@mcp.tool()
@safe_call
def lead_stage_update(stage_id: str, **fields: Any) -> dict:
    """更新阶段。ADMIN 权限。

    Args:
        stage_id: Stage UUID
        **fields: 要更新的字段
    """
    c = _get_client()
    return c.put(f"/api/leads/stages/{stage_id}/", json=fields)


@mcp.tool()
@safe_call
def lead_stage_delete(stage_id: str) -> dict:
    """删除阶段。ADMIN 权限。有 leads 的阶段不允许删除。

    Args:
        stage_id: Stage UUID
    """
    c = _get_client()
    return c.delete(f"/api/leads/stages/{stage_id}/")


@mcp.tool()
@safe_call
def lead_stage_reorder(pipeline_pk: str, stage_ids: list[str]) -> dict:
    """批量重排 Pipeline 下的阶段顺序。ADMIN 权限。

    Args:
        pipeline_pk: Pipeline UUID
        stage_ids: 按目标顺序排列的 stage ID 列表
    """
    c = _get_client()
    return c.post(
        f"/api/leads/pipelines/{pipeline_pk}/stages/reorder/",
        json={"stage_ids": stage_ids},
    )


# ============================================================
# 4.1 通用业务模块列表工具（联系人/账户/商机/工单/任务）
# ============================================================
# 让 AI 能像使用 lead_list 一样自然查询非线索模块。
# 后端统一使用 LimitOffsetPagination，标准返回 {count, next, previous, results}。

def _build_params(**kwargs) -> dict:
    """收集非 None、非空的 query 参数（空 list 也跳过）。"""
    out: dict[str, Any] = {}
    for k, v in kwargs.items():
        if v is None:
            continue
        if isinstance(v, list) and len(v) == 0:
            continue
        out[k] = v
    return out


@mcp.tool()
@safe_call
def contact_list(
    search: str | None = None,
    assigned_to: list[str] | None = None,
    tags: list[str] | None = None,
    created_at_gte: str | None = None,
    created_at_lte: str | None = None,
    offset: int = 0,
    limit: int = 10,
) -> dict:
    """查询联系人(Contact)列表，返回标准分页结构 {count, results, ...}（按 id 倒序，最新在前）。

    取「最新联系人」：读 results[0]（字段含 first_name / last_name / email / created_at 等）。

    Args:
        search: 全文搜索（名/姓/邮箱/电话）
        assigned_to: 分配给的用户 Profile ID 列表
        tags: 标签 ID 列表
        created_at_gte: 创建时间下限 YYYY-MM-DD
        created_at_lte: 创建时间上限 YYYY-MM-DD
        offset: 分页偏移，默认 0
        limit: 每页数量，默认 10（取前 N 条即最新 N 条）
    """
    c = _get_client()
    params = _build_params(
        search=search,
        assigned_to=assigned_to,
        tags=tags,
        created_at__gte=created_at_gte,
        created_at__lte=created_at_lte,
        offset=offset,
        limit=limit,
    )
    return c.get("/api/contacts/", params=params)


@mcp.tool()
@safe_call
def account_list(
    search: str | None = None,
    industry: str | None = None,
    assigned_to: list[str] | None = None,
    tags: list[str] | None = None,
    status: str | None = None,
    created_at_gte: str | None = None,
    created_at_lte: str | None = None,
    offset: int = 0,
    limit: int = 10,
) -> dict:
    """查询客户/账户(Account)列表。返回结构包含活跃账户(active_accounts)与关闭账户(closed_accounts)两组，按 id 倒序（最新在前）。

    取「最新客户」：读 active_accounts.open_accounts[0]（字段含 name / created_at / industry 等）；
    关闭客户在 closed_accounts.closed_accounts。传 limit=5 即可拿到最新 5 个。

    Args:
        search: 全文搜索（名称/邮箱/电话/网站）
        industry: 按行业筛选
        assigned_to: 分配给的用户 Profile ID 列表
        tags: 标签 ID 列表
        status: 'open'（活跃客户）或 'closed'（已关闭）；不传返回全部
        created_at_gte: 创建时间下限 YYYY-MM-DD
        created_at_lte: 创建时间上限 YYYY-MM-DD
        offset: 分页偏移，默认 0
        limit: 每页数量，默认 10
    """
    c = _get_client()
    params = _build_params(
        search=search,
        industry=industry,
        assigned_to=assigned_to,
        tags=tags,
        status=status,
        created_at__gte=created_at_gte,
        created_at__lte=created_at_lte,
        offset=offset,
        limit=limit,
    )
    return c.get("/api/accounts/", params=params)


@mcp.tool()
@safe_call
def opportunity_list(
    search: str | None = None,
    stage: str | None = None,
    account: str | None = None,
    assigned_to: list[str] | None = None,
    tags: list[str] | None = None,
    created_at_gte: str | None = None,
    created_at_lte: str | None = None,
    closed_on_gte: str | None = None,
    closed_on_lte: str | None = None,
    offset: int = 0,
    limit: int = 10,
) -> dict:
    """查询商机(Opportunity)列表，返回标准分页结构（按 id 倒序，最新在前）。注意：商机模块需要销售权限(sales access)。

    结果在 opportunities 字段（{opportunities, opportunities_count, ...}），取最新读 opportunities[0]。

    Args:
        search: 全文搜索
        stage: 按阶段筛选（如 PROSPECTING/QUALIFICATION/PROPOSAL/NEGOTIATION/WON/LOST）
        account: 关联账户(Account) ID
        assigned_to: 分配给的用户 Profile ID 列表
        tags: 标签 ID 列表
        created_at_gte/lte: 创建时间范围 YYYY-MM-DD
        closed_on_gte/lte: 预计/实际成交日期范围 YYYY-MM-DD
        offset: 分页偏移，默认 0
        limit: 每页数量，默认 10
    """
    c = _get_client()
    params = _build_params(
        search=search,
        stage=stage,
        account=account,
        assigned_to=assigned_to,
        tags=tags,
        created_at__gte=created_at_gte,
        created_at__lte=created_at_lte,
        closed_on__gte=closed_on_gte,
        closed_on__lte=closed_on_lte,
        offset=offset,
        limit=limit,
    )
    return c.get("/api/opportunities/", params=params)


@mcp.tool()
@safe_call
def case_list(
    search: str | None = None,
    status: str | None = None,
    priority: str | None = None,
    case_type: str | None = None,
    assigned_to: list[str] | None = None,
    tags: list[str] | None = None,
    created_at_gte: str | None = None,
    created_at_lte: str | None = None,
    offset: int = 0,
    limit: int = 10,
) -> dict:
    """查询工单(Case)列表，返回标准分页结构（按 id 倒序，最新在前）。结果在 cases 字段，取最新读 cases[0]。

    Args:
        search: 全文搜索
        status: 状态 New/Assigned/Pending/Closed/Rejected/Duplicate
        priority: 优先级 Low/Normal/High/Urgent
        case_type: 类型 Question/Incident/Problem
        assigned_to: 分配给的用户 Profile ID 列表
        tags: 标签 ID 列表
        created_at_gte/lte: 创建时间范围 YYYY-MM-DD
        offset: 分页偏移，默认 0
        limit: 每页数量，默认 10
    """
    c = _get_client()
    params = _build_params(
        search=search,
        status=status,
        priority=priority,
        case_type=case_type,
        assigned_to=assigned_to,
        tags=tags,
        created_at__gte=created_at_gte,
        created_at__lte=created_at_lte,
        offset=offset,
        limit=limit,
    )
    return c.get("/api/cases/", params=params)


@mcp.tool()
@safe_call
def task_list(
    search: str | None = None,
    status: str | None = None,
    priority: str | None = None,
    assigned_to: list[str] | None = None,
    tags: list[str] | None = None,
    due_date_gte: str | None = None,
    due_date_lte: str | None = None,
    offset: int = 0,
    limit: int = 10,
) -> dict:
    """查询任务(Task)列表，返回标准分页结构（按 id 倒序，最新在前）。结果在 tasks 字段，取最新读 tasks[0]。

    Args:
        search: 全文搜索
        status: 状态 New/In Progress/Completed/Deferred
        priority: 优先级 Low/Normal/High/Urgent
        assigned_to: 分配给的用户 Profile ID 列表
        tags: 标签 ID 列表
        due_date_gte/lte: 截止日期范围 YYYY-MM-DD
        offset: 分页偏移，默认 0
        limit: 每页数量，默认 10
    """
    c = _get_client()
    params = _build_params(
        search=search,
        status=status,
        priority=priority,
        assigned_to=assigned_to,
        tags=tags,
        due_date__gte=due_date_gte,
        due_date__lte=due_date_lte,
        offset=offset,
        limit=limit,
    )
    return c.get("/api/tasks/", params=params)


# ---------- Auth ----------

@mcp.tool()
@safe_call
def auth_status() -> dict:
    """检查当前 token 是否有效，返回当前用户信息 + 可用组织列表。"""
    c = _get_client()
    return c.get("/api/auth/me/")


@mcp.tool()
@safe_call
def org_list() -> dict:
    """获取当前登录用户关联的所有组织。"""
    c = _get_client()
    # 尝试多个可能的端点
    for path in ["/api/auth/me/", "/api/org/"]:
        r = c.get(path)
        if not isinstance(r, dict) or not r.get("__error__"):
            return {"endpoint": path, "data": r}
    return {"__error__": True, "message": "无法获取组织列表"}


# ============================================================
# 4.5 权限 & 通用 API 工具
# ============================================================

@mcp.tool()
@safe_call
def my_permissions() -> dict:
    """返回当前登录用户在所属组织内的权限信息，用于在调用写/管理操作前确认自己是否有权限。

    返回字段:
        resolved                — 权限是否成功解析
        org_id / org_name       — 当前生效的组织
        role                    — 'ADMIN' | 'USER'
        is_organization_admin   — 是否组织管理员
        has_sales_access        — 是否有销售访问权限
        has_marketing_access    — 是否有营销访问权限
        is_active               — 账户是否启用
    """
    c = _get_client()
    return c.permissions


@mcp.tool()
@safe_call
def crm_api(
    method: str,
    path: str,
    params: Any = None,
    body: Any = None,
) -> dict:
    """通用 REST 调用工具：覆盖 openCRM 全部业务接口
    （联系人/账户/商机/工单/任务/销售发票/报价/产品/循环发票/模板/报表/用户/团队/标签/文档/组织 等 230+ 端点）。

    优先使用具名列表工具（lead_list / contact_list / account_list / opportunity_list / case_list / task_list）；
    当没有对应的具名工具，或需要写操作/访问其它端点时，用本工具直接调用对应 REST 端点。
    MCP 会在发送前按「路径 + HTTP 方法」做权限预检（管理员 / 销售），权限不足会返回明确的 403 错误；
    最终鉴权仍由后端兜底。

    Args:
        method: HTTP 方法 — GET / POST / PUT / PATCH / DELETE（大小写不限）
        path: 接口路径，必须以 / 开头，例如 /api/contacts/ 或 /api/opportunities/42/
        params: query 参数（dict 或 JSON 字符串），例如 {"status": "open", "limit": 20}
        body: 请求体（dict 或 JSON 字符串，POST/PUT/PATCH 用），例如 {"name": "张三", "email": "a@b.com"}
    """
    c = _get_client()
    method = (method or "GET").upper()
    if not path.startswith("/"):
        return {"__error__": True, "message": "path 必须以 / 开头，例如 /api/contacts/"}
    kw: dict[str, Any] = {}
    if params:
        if isinstance(params, str):
            try:
                params = json.loads(params)
            except Exception:
                return {"__error__": True, "message": "params 不是合法 JSON"}
        kw["params"] = params
    if body is not None and method in ("POST", "PUT", "PATCH"):
        if isinstance(body, str):
            try:
                body = json.loads(body)
            except Exception:
                return {"__error__": True, "message": "body 不是合法 JSON"}
        kw["json"] = body
    return c.request(method, path, **kw)


# ============================================================
# 5. 启动入口
# ============================================================

def _parse_args():
    import argparse
    parser = argparse.ArgumentParser(description="openCRM MCP Server")
    parser.add_argument(
        "--http", action="store_true",
        help=f"用 streamable_http 模式启动（默认 http://127.0.0.1:{DEFAULT_PORT}/mcp，给 nanobot 用）"
    )
    parser.add_argument(
        "--stdio", action="store_true",
        help="用 stdio 模式启动（给 Trae/Claude Desktop 等 MCP host 用）"
    )
    return parser.parse_args()


if __name__ == "__main__":
    args = _parse_args()
    transport = "streamable-http" if args.http else "stdio"
    url_hint = f"http://127.0.0.1:{DEFAULT_PORT}/mcp" if transport == "streamable-http" else "(stdio)"
    print(f"openCRM MCP Server ({transport}) — v1", file=sys.stderr)
    print(f"  endpoint: {url_hint}", file=sys.stderr)
    try:
        cfg = _load_config()
        print(f"  backend:  {cfg.get('base_url', DEFAULT_BASE_URL)}", file=sys.stderr)
        print(f"  email:    {cfg.get('email', 'not set')}", file=sys.stderr)
        if cfg.get("password") == "CHANGE_ME" and not cfg.get("access_token"):
            print("  ⚠ 请配置 config.json — 正在启动，但所有 tool 调用会失败", file=sys.stderr)
        mcp.run(transport=transport)
    except KeyboardInterrupt:
        print("\n⛔ MCP server stopped.", file=sys.stderr)
    except Exception as e:
        print(f"FATAL: {e}", file=sys.stderr)
        sys.exit(1)
