r"""
openCRM MCP Server — v1 (Leads Module)
=======================================

把 openCRM Django 后端 (http://127.0.0.1:8000) 的 REST API 暴露成 MCP tools,
让 AI agent 可以用自然语言操作 CRM 数据。

架构:  FastMCP (stdio 传输) + requests (HTTP client) + JWT 自动登录
认证:  email + password → 自动调用 /api/auth/login/ 拿 access_token
        也可以直接传入 access_token 跳过登录

运行:  .openCRM-venv\Scripts\python.exe mcp\opencrm_server.py
配置:  mcp\config.json (email/password/base_url) — 首次运行会自动生成 config.example.json

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

  --- Auth ---
  auth_status       — 检查 token 是否有效
  org_list          — 获取当前用户关联的组织
"""

from __future__ import annotations

import json
import os
import sys
import traceback
from pathlib import Path
from typing import Any

import requests
from mcp.server.fastmcp import FastMCP

# ============================================================
# 1. 初始化 FastMCP
# ============================================================

# 默认 host/port — HTTP 模式时生效，stdio 模式时被忽略
# 可以通过启动参数覆盖: python opencrm_server.py --http --port 8001
DEFAULT_HOST = "127.0.0.1"
DEFAULT_PORT = 8001

mcp = FastMCP(
    "openCRM",
    instructions=(
        "openCRM CRM 系统 API 工具集。"
        "操作线索(Lead)的完整 CRUD + 看板管理 + 管道/阶段管理。"
        "所有写入操作(create/update/delete/move)都会调用真实后端。"
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
        self._login()

    # --------- 认证 ---------
    def _login(self):
        """JWT 登录拿 access_token。自动重试（兼容 Django 稍后启动的场景）。"""
        if self.access_token:
            return  # 已有 token
        url = f"{self.base_url}/api/auth/login/"
        import time as _time
        last_err = None
        for attempt in range(10):  # 最多重试 10 次，每次等 2 秒
            try:
                r = self.session.post(url, json={
                    "email": self.email, "password": self.password
                }, timeout=10)
                if r.status_code == 200:
                    data = r.json()
                    self.access_token = data.get("access_token") or data.get("access")
                    if not self.access_token:
                        raise RuntimeError(f"登录成功但没拿到 token: {data}")
                    return  # 登录成功
                else:
                    raise RuntimeError(f"登录失败 HTTP {r.status_code}: {r.text[:200]}")
            except requests.ConnectionError as e:
                last_err = e
                if attempt < 9:
                    print(f"  ⏳ 等待后端就绪... ({attempt + 1}/10)  [{e}]", file=sys.stderr)
                    _time.sleep(2)
                else:
                    raise RuntimeError(
                        f"无法连接后端 {self.base_url}（重试 10 次均失败）。请先启动 Django 服务 (manage.py runserver)。"
                    ) from last_err

    def _headers(self) -> dict:
        headers = {"Authorization": f"Bearer {self.access_token}"}
        if self.org_name:
            headers["X-Org-Name"] = self.org_name
        return headers

    # --------- HTTP 封装 ---------
    def request(self, method: str, path: str, **kwargs) -> dict | list | Any:
        """统一请求封装：附加 headers、错误处理、返回解析后的 JSON。"""
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
    print(f"openCRM MCP Server ({transport}) — v1 Leads", file=sys.stderr)
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
