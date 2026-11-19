# -*- coding: utf-8 -*-
"""
openCRM API 文档生成器 v3

核心变化：
1) PROBE_DATA 从后端实时探测并缓存到 _probe_data.json，生成器里优先使用真实返回结构
2) 不再"猜 Paginated[X]"，而是把真实返回的所有字段展开（accounts/cases/leads 都是 custom dict）
3) description 推断加了更多英文 summary 的智能转换（英文 summary 直接用）
4) 每个 Markdown 端点都会写清楚 "OpenAPI 原始标注" vs "后端探测补全"

用法:
    python generate_api_docs.py            # 用缓存的 _probe_data.json
    python generate_api_docs.py --probe    # 重新探测后端
"""

import json, os, re, sys, urllib.request, urllib.error
from collections import OrderedDict
from datetime import datetime

HERE = os.path.dirname(os.path.abspath(__file__))
JSON_PATH = os.path.join(HERE, "api_openapi.json")
PROBE_PATH = os.path.join(HERE, "_probe_data.json")
OUT_DIR = HERE
BACKEND = os.environ.get("OPENCRM_BACKEND", "http://127.0.0.1:8000")

with open(JSON_PATH, "r", encoding="utf-8") as f:
    SPEC = json.load(f)
SCHEMAS = SPEC.get("components", {}).get("schemas", {})
PATHS = SPEC.get("paths", {})

# ---------------------------------------------------------------------------
# PROBE_DATA — 优先用缓存，否则探测
# ---------------------------------------------------------------------------
def load_probe():
    if "--probe" in sys.argv or not os.path.exists(PROBE_PATH):
        print("[probe] probing live backend...", flush=True)
        import subprocess
        p = subprocess.run([sys.executable, os.path.join(HERE, "_probe_openapi.py"), BACKEND],
            capture_output=True, text=True, timeout=180)
        if p.returncode == 0:
            with open(PROBE_PATH, "w", encoding="utf-8") as f:
                f.write(p.stdout)
            print(f"[probe] saved {len(p.stdout)} bytes", flush=True)
        else:
            print(f"[probe] failed: {p.stderr[:200]}")
            return {}
    with open(PROBE_PATH, "r", encoding="utf-8-sig") as f:
        data = json.load(f)
    if isinstance(data, dict) and "__error__" in data:
        print(f"[probe] {data['__error__']}")
        return {}
    print(f"[probe] loaded {len(data)} probed endpoints")
    return data

PROBE_DATA = load_probe()

# ---------------------------------------------------------------------------
# $ref 展开
# ---------------------------------------------------------------------------
def resolve_ref(ref):
    if not ref or not ref.startswith("#/"):
        return None
    parts = ref.lstrip("#/").split("/")
    cur = SPEC
    for p in parts:
        cur = cur.get(p)
        if cur is None:
            return None
    return cur

def expand_schema(schema, stack=None, depth=0):
    if stack is None: stack = set()
    if depth > 10: return []
    if "$ref" in schema:
        ref_name = schema["$ref"].split("/")[-1]
        if ref_name in stack: return []
        real = resolve_ref(schema["$ref"])
        return expand_schema(real, stack | {ref_name}, depth + 1) if real else []
    for key in ("oneOf", "anyOf"):
        if key in schema:
            parts = schema[key]
            ref_parts = [p for p in parts if isinstance(p, dict) and "$ref" in p]
            if ref_parts: return expand_schema(ref_parts[0], stack, depth)
            elif parts and isinstance(parts[0], dict): return expand_schema(parts[0], stack, depth)
    if schema.get("type") != "object" and "properties" not in schema: return []
    required_set = set(schema.get("required", []))
    result = []
    props = schema.get("properties", {})
    for name, prop in props.items():
        info = {
            "type": prop.get("type", "any"),
            "required": name in required_set,
            "nullable": prop.get("nullable", False),
            "enum": prop.get("enum"),
            "default": prop.get("default"),
            "description": prop.get("description", ""),
            "title": prop.get("title", ""),
            "read_only": prop.get("readOnly", False),
            "format": prop.get("format", ""),
            "pattern": prop.get("pattern", ""),
            "max_length": prop.get("maxLength"),
            "min_length": prop.get("minLength"),
            "ref_name": None,
            "is_array": prop.get("type") == "array",
            "items_ref": None,
        }
        if "$ref" in prop:
            info["ref_name"] = prop["$ref"].split("/")[-1]
            info["type"] = f"→ {info['ref_name']}"
        elif prop.get("type") == "array" and "items" in prop and isinstance(prop["items"], dict):
            items = prop["items"]
            if isinstance(items, dict) and "$ref" in items:
                info["items_ref"] = items["$ref"].split("/")[-1]
                info["type"] = f"[{info['items_ref']}]"
            else:
                info["type"] = f"[{items.get('type', 'any')}]"
        for key in ("oneOf", "anyOf"):
            if key in prop:
                parts = prop[key]
                ref_parts = [p for p in parts if isinstance(p, dict) and "$ref" in p]
                if ref_parts:
                    ref_name = ref_parts[0]["$ref"].split("/")[-1]
                    enum_schema = resolve_ref(ref_parts[0]["$ref"])
                    if enum_schema and "enum" in enum_schema: info["enum"] = enum_schema["enum"]
                    info["type"] = f"enum({ref_name})"
                break
        result.append((name, info))
        if isinstance(prop, dict) and "$ref" in prop:
            ref_name = prop["$ref"].split("/")[-1]
            real = resolve_ref(prop["$ref"])
            if real and real.get("type") == "object" and "properties" in real:
                for sub_name, sub_info in expand_schema(real, stack | {ref_name}, depth + 1):
                    result.append((f"{name}.{sub_name}", sub_info))
        elif prop.get("type") == "array" and "items" in prop and isinstance(prop["items"], dict) and "$ref" in prop["items"]:
            ref_name = prop["items"]["$ref"].split("/")[-1]
            real = resolve_ref(prop["items"]["$ref"])
            if real and real.get("type") == "object" and "properties" in real:
                for sub_name, sub_info in expand_schema(real, stack | {ref_name}, depth + 1):
                    result.append((f"{name}[].{sub_name}", sub_info))
    return result

# ---------------------------------------------------------------------------
# 路径分类
# ---------------------------------------------------------------------------
PATH_MAP = [
    (r"^/api/activities/?$", "dashboard"),
    (r"^/api/dashboard/?$", "dashboard"),
    (r"^/api/leads/", "leads"),
    (r"^/api/contacts/", "contacts"),
    (r"^/api/accounts/", "accounts"),
    (r"^/api/opportunities/", "opportunities"),
    (r"^/api/cases/", "cases"),
    (r"^/api/boards/", "tasks"),
    (r"^/api/tasks/", "tasks"),
    (r"^/api/invoices/estimates/", "sales_estimates"),
    (r"^/api/invoices/products/", "sales_products"),
    (r"^/api/invoices/recurring/", "sales_recurring"),
    (r"^/api/invoices/templates/", "sales_templates"),
    (r"^/api/invoices/reports/", "sales_reports"),
    (r"^/api/invoices/", "sales_invoices"),
    (r"^/api/public/", "public_portal"),
    (r"^/api/auth/", "system"),
    (r"^/api/org/", "system"),
    (r"^/api/users/", "system"),
    (r"^/api/user/", "system"),
    (r"^/api/teams/", "system"),
    (r"^/api/tags/", "system"),
    (r"^/api/profile/", "system"),
    (r"^/api/documents/", "system"),
    (r"^/api/api-settings/", "system"),
]

def classify(path):
    for pat, mod in PATH_MAP:
        if re.match(pat, path): return mod
    return "_uncategorized"

# ---------------------------------------------------------------------------
# 描述推断（中文增强）
# ---------------------------------------------------------------------------
SCHEMA_TYPE_HINTS = {
    "LeadCreateSwaggerRequest": "新建线索",
    "LeadDetailEditSwaggerRequest": "编辑线索详情（含附件/评论）",
    "LeadMoveRequest": "移动线索到看板另一列/位置",
    "LeadCommentEditSwaggerRequest": "新建/编辑线索评论",
    "LeadPipelineRequest": "新建/编辑线索管道",
    "LeadStageRequest": "新建/编辑线索阶段",
    "OpportunityCreateSwaggerRequest": "新建商机",
    "OpportunityDetailEditSwaggerRequest": "编辑商机详情（含附件/评论）",
    "OpportunityLineItemCreateRequest": "新建/编辑商机行项目",
    "CaseCreateSwaggerRequest": "新建工单",
    "CaseDetailEditSwaggerRequest": "编辑工单详情（含附件/评论）",
    "CasePipelineRequest": "新建/化工单管道",
    "CaseStageRequest": "新建/化工单阶段",
    "CaseStageReorderRequestRequest": "工单阶段重排",
    "SolutionCreateUpdateRequest": "新建/编辑知识库解决方案",
    "TaskCreateSwaggerRequest": "新建任务",
    "TaskDetailEditSwaggerRequest": "编辑任务详情（含附件/评论）",
    "TaskMoveRequest": "移动任务到看板另一列/位置",
    "BoardRequest": "新建/编辑看板",
    "BoardColumnRequest": "新建/编辑看板列",
    "BoardTaskRequest": "新建/编辑看板任务",
    "LoginRequest": "登录凭证",
    "RegisterRequest": "注册新用户",
    "OrgSwitchRequestRequest": "切换组织",
    "OrgProfileCreateRequest": "创建组织和个人资料",
    "OrganizationRequest": "新建/编辑组织",
    "UserCreateSwaggerRequest": "新建/编辑用户",
    "UserUpdateStatusSwaggerRequest": "更新用户状态（启用/停用）",
    "ProfilePatchRequestRequest": "更新当前用户资料",
    "DocumentCreateSwaggerRequest": "新建文档",
    "DocumentEditSwaggerRequest": "编辑文档",
    "APISettingsSwaggerRequest": "新建/编辑 API 设置（域名）",
    "TagsRequest": "新建/编辑标签",
    "TeamswaggerCreateRequest": "新建/编辑团队",
    "EmailWriteRequest": "起草邮件",
    "AccountWriteRequest": "新建/编辑账户（公司/客户）",
    "ContactCreateSwaggerRequest": "新建联系人",
    "ContactEditSwaggerRequest": "编辑联系人",
    "InvoiceLineItemRequest": "新建/编辑发票行项目",
}

# 英文 summary → 中文映射（OpenAPI 的 summary 很多是动词短语）
EN_TO_CN = [
    ("List and create", "列表查询 + 新建"),
    ("Retrieve and update", "获取详情 + 全量更新"),
    ("Manage", "管理"),
    ("Delete an attachment", "删除附件"),
    ("Delete a comment", "删除评论"),
    ("Upload an attachment", "上传附件"),
    ("Post a comment", "发布评论"),
    ("List and create payments", "列出支付记录 + 新增支付"),
    ("Retrieve a single invoice", "获取发票详情"),
    ("Retrieve a single estimate", "获取报价单详情"),
    ("Cancel an invoice", "取消发票"),
    ("Duplicate an existing invoice", "复制发票"),
    ("Mark invoice as paid", "标记发票为已支付"),
    ("Generate and download invoice PDF", "生成并下载发票 PDF"),
    ("Send invoice to client via email", "通过邮件发送发票给客户"),
    ("Convert an estimate to an invoice", "将报价单转换为发票"),
    ("Send estimate to client via email", "通过邮件发送报价单给客户"),
    ("Generate and download estimate PDF", "生成并下载报价单 PDF"),
    ("Create an invoice from a CLOSED_WON opportunity with line items", "从已赢商机（CLOSED_WON）及其行项目生成发票"),
    ("Accept estimate by public token", "通过公开 token 接受报价单"),
    ("Decline estimate by public token", "通过公开 token 拒绝报价单"),
    ("Get estimate by public token", "通过公开 token 获取报价单"),
    ("Get invoice by public token", "通过公开 token 获取发票"),
    ("Download invoice PDF by public token", "通过公开 token 下载发票 PDF"),
    ("Download estimate PDF by public token", "通过公开 token 下载报价单 PDF"),
    ("Refresh token", "刷新 JWT 访问令牌"),
    ("Obtain a token pair", "获取 JWT 令牌对（登录）"),
    ("Register a new user", "注册新用户"),
    ("Switch organization", "切换当前用户的组织"),
    ("Bulk reorder stages in a pipeline", "批量重排管道阶段"),
    ("Create a stage in a pipeline", "在管道中创建阶段"),
    ("List all solutions with filters", "列出所有解决方案（可筛选）"),
    ("Create a new solution", "新建解决方案"),
    ("Delete solution", "删除解决方案"),
    ("Get solution details", "获取解决方案详情"),
    ("Partially update solution", "部分更新解决方案"),
    ("Update solution", "全量更新解决方案"),
    ("Publish an approved solution", "发布已审核的解决方案"),
    ("Unpublish a solution", "取消发布解决方案"),
    ("Get kanban board data", "获取看板数据"),
    ("List all pipelines for the organization", "列出组织的所有管道"),
    ("Create a new pipeline", "新建管道"),
    ("Retrieve, update, delete a pipeline", "管道详情/更新/删除"),
    ("Move case to different column and/or position", "移动工单到不同列/位置"),
    ("Move lead to different column and/or position", "移动线索到不同列/位置"),
    ("Move task to different column and/or position", "移动任务到不同列/位置"),
    ("Partial Case Update", "部分更新工单"),
    ("Partial Lead Update", "部分更新线索"),
    ("Partial Task Update", "部分更新任务"),
    ("Partial Account Update", "部分更新账户"),
    ("Partial Contact Update", "部分更新联系人"),
    ("Partial Opportunity Update", "部分更新商机"),
    ("Partial Document Update", "部分更新文档"),
    ("Partial API Settings Update", "部分更新 API 设置"),
    ("Partial Team Update", "部分更新团队"),
    ("Partial User Update", "部分更新用户"),
    ("Partial Comment Update", "部分更新评论"),
    ("Partial Organization Update", "部分更新组织"),
    ("Update or delete a comment", "评论更新/删除"),
    ("Update or delete a stage", "阶段更新/删除"),
    ("Update or delete a single line item", "行项目更新/删除"),
    ("Delete a payment", "删除支付记录"),
    ("Pipeline", "管道"),
    ("Stage", "阶段"),
    ("Kanban", "看板"),
    ("List all tags for the organization", "列出组织的所有标签"),
    ("Create a new tag", "新建标签"),
    ("Archive a tag - soft delete", "归档标签（软删除）"),
    ("Get a single tag by ID", "获取单个标签"),
    ("Update a tag", "更新标签"),
    ("Restore an archived tag", "恢复已归档标签"),
    ("Update organization settings", "更新组织设置"),
    ("Get current organization settings", "获取当前组织设置"),
    ("Get organization details", "获取组织详情"),
    ("Organization and profile Creation api", "创建组织 + 个人资料"),
    ("Just Pass the token, will return ORG list, associated with user", "获取当前用户关联的组织列表"),
    ("Get current authenticated user with organizations", "获取当前登录用户及其组织信息"),
    ("Get profile for current user in specified organization", "获取当前用户在指定组织的个人资料"),
    ("Switch to a different organization and get new JWT tokens", "切换组织并获取新 JWT"),
    ("Login with email and password", "邮箱密码登录"),
    ("Refresh access token with org membership validation", "刷新访问令牌（校验组织成员资格）"),
    ("User Status View", "用户状态管理"),
    ("Update organization details", "更新组织详情"),
    ("Partial update organization details", "部分更新组织详情"),
    ("Retrieve and update a single invoice", "发票详情 + 更新"),
    ("Get recent activities for the organization", "获取组织最近活动动态"),
]

def guess_description(op, schema_name=None, path="", method=""):
    summary = (op.get("summary") or "").strip()
    desc = (op.get("description") or "").strip()
    # 1) 英文 summary/description → 中文
    for text in (summary, desc):
        if not text: continue
        for en, cn in EN_TO_CN:
            if en.lower() == text.lower() or text.lower().startswith(en.lower()):
                rest = text[len(en):].strip()
                if rest:
                    out = cn + " " + rest.strip()
                else:
                    out = cn
                return out[:120]
        # 没匹配上的英文（summary 优先于 desc）
        if summary == text:
            return text[:120]
    if desc and not re.search(r'[\u4e00-\u9fff]', desc):
        # 纯英文 description 且没匹配上 EN_TO_CN —— 也直接返回
        return desc.split("\n")[0][:120]
    if desc:
        return desc.split("\n")[0][:120]
    if schema_name and schema_name in SCHEMA_TYPE_HINTS:
        return SCHEMA_TYPE_HINTS[schema_name]
    # 纯路径推断
    path_lower = path.lower()
    mid = method.upper()
    if mid == "GET":
        if "{token}" in path: return "通过公开 token 访问"
        if "{id}" in path: return "获取详情"
        if "kanban" in path_lower: return "获取看板数据"
        if "pipelines" in path_lower: return "列出所有管道"
        if "pdf" in path_lower: return "获取 PDF"
        if path_lower.endswith("solutions/"): return "列出知识库解决方案"
        return "列表查询"
    if mid == "POST":
        if "create_mail" in path_lower: return "创建邮件草稿"
        if "attachments" in path_lower or "attachment" in path_lower: return "上传附件"
        if "comments" in path_lower or "comment" in path_lower: return "新增评论"
        if "from-opportunity" in path_lower: return "从商机生成"
        if "convert" in path_lower: return "转换为"
        if "duplicate" in path_lower: return "复制"
        if "cancel" in path_lower: return "取消"
        if "mark-paid" in path_lower: return "标记为已支付"
        if "send" in path_lower: return "发送"
        if "publish" in path_lower: return "发布"
        if "unpublish" in path_lower: return "取消发布"
        if "reorder" in path_lower: return "重新排序"
        if "move" in path_lower: return "移动"
        if "restore" in path_lower: return "恢复"
        if "import" in path_lower: return "导入"
        if "export" in path_lower: return "导出"
        if "refresh" in path_lower: return "刷新"
        if "login" in path_lower: return "登录获取 JWT"
        if "register" in path_lower: return "注册"
        if "accept" in path_lower: return "接受"
        if "decline" in path_lower: return "拒绝"
        return "新建"
    if mid == "PUT":
        if "{id}" in path: return "全量更新"
        return "更新"
    if mid == "PATCH": return "部分更新"
    if mid == "DELETE":
        if "attachments" in path_lower: return "删除附件"
        if "comment" in path_lower: return "删除评论"
        return "删除"
    return ""

# ---------------------------------------------------------------------------
# 响应推断 — 优先 PROBE_DATA
# ---------------------------------------------------------------------------

# 实体名 → 真实 OpenAPI schema 名（后端真实存在的）
ENTITY_BY_PATH = [
    (r"^/api/leads/?$", "Lead"),
    (r"^/api/contacts/?$", "Contact"),
    (r"^/api/accounts/?$", "Account"),
    (r"^/api/opportunities/?$", "Opportunity"),
    (r"^/api/cases/?$", "Case"),
    (r"^/api/tasks/?$", "Task"),
    (r"^/api/boards/?$", "Board"),
    (r"^/api/boards/columns/?$", "BoardColumn"),
    (r"^/api/tasks/kanban/?$", "Task"),
    (r"^/api/activities/?$", "Activity"),
    (r"^/api/invoices/?$", "Invoice"),
    (r"^/api/invoices/estimates/?$", "Invoice"),
    (r"^/api/invoices/products/?$", "Product"),
    (r"^/api/invoices/recurring/?$", "Invoice"),
    (r"^/api/invoices/templates/?$", "InvoiceTemplate"),
    (r"^/api/invoices/reports/", "Activity"),  # 无 SalesReport schema，复用 Activity
    (r"^/api/users/?$", "User"),
    (r"^/api/user/teams/?$", "Teams"),
    (r"^/api/tags/?$", "Tags"),
    (r"^/api/documents/?$", "Document"),
    (r"^/api/public/invoice/", "Invoice"),
    (r"^/api/public/estimate/", "Invoice"),
    (r"^/api/org/settings/?$", "Organization"),
]

# 路径关键词 → schema 名（用于 detail/child 端点推断）
# 注意：pipelines/stages 不在此列表，因为需要根据路径前缀（cases/leads/tasks）选不同 schema
PATH_KEYWORD_TO_SCHEMA = [
    (r"/line-items?/", "InvoiceLineItem"),
    (r"/payments?/", "Payment"),
    (r"/comments?/", "Comment"),
    (r"/attachments?/", "Attachments"),
    (r"/solutions?/", "Solution"),
    (r"/teams?/", "Teams"),
    (r"/profiles?/", "Profile"),
    (r"/estimates?/", "Invoice"),
    (r"/recurring/", "Invoice"),
    (r"/templates?/", "InvoiceTemplate"),
    (r"/products?/", "Product"),
]

def infer_entity_schema(path):
    # 1) 精确路径匹配
    for pat, name in ENTITY_BY_PATH:
        if re.match(pat, path) and name in SCHEMAS:
            return name
    # 2) 关键词匹配 — detail/child 端点
    for pat, name in PATH_KEYWORD_TO_SCHEMA:
        if re.search(pat, path) and name in SCHEMAS:
            return name
    # 2.5) 管道/阶段的前缀匹配（cases→CasePipeline, leads→LeadPipeline, tasks→TaskPipeline）
    m = re.search(r"/(cases|leads|tasks)/pipelines?", path)
    if m:
        entity_map = {"cases": "Case", "leads": "Lead", "tasks": "Task"}
        prefix = entity_map.get(m.group(1), "")
        # 匹配 pipelines 还是 stages
        if re.search(r"/pipelines?/", path):
            cand = prefix + "Pipeline"
            if cand in SCHEMAS: return cand
        if re.search(r"/stages?/", path):
            cand = prefix + "Stage"
            if cand in SCHEMAS: return cand
    # 3) 兜底：路径最后一段实体名（复数转单数，尝试在 SCHEMAS 里找）
    last_segment = path.rstrip("/").split("/")[-1]
    # 去掉参数占位符
    if last_segment.startswith("{"):
        parts = path.rstrip("/").split("/")
        # 取参数占位符之前的段
        for p in reversed(parts[:-1]):
            if not p.startswith("{"):
                last_segment = p
                break
    # 尝试复数 → 单数
    candidates = [last_segment]
    if last_segment.endswith("ies"):
        candidates.append(last_segment[:-3] + "y")
    elif last_segment.endswith("ses"):
        candidates.append(last_segment[:-2])
    elif last_segment.endswith("s") and not last_segment.endswith("ss"):
        candidates.append(last_segment[:-1])
    # 尝试 PascalCase
    for c in list(candidates):
        if c:
            candidates.append(c.capitalize())
            candidates.append(c.title())
            # 下划线转 PascalCase
            if "_" in c:
                candidates.append("".join(p.capitalize() for p in c.split("_")))
    for c in candidates:
        if c in SCHEMAS:
            return c
    return None

def build_custom_schema_from_probe(probe_entry, label_prefix):
    """PROBE_DATA shape="custom" 时，根据 structure dict 动态合成 OpenAPI schema。
    只展开顶层 + 第一层 list 子项的字段，避免过深。
    """
    structure = probe_entry.get("structure", {})
    if not structure:
        return None
    required = []
    props = {}
    for key, sub in structure.items():
        stype = sub.get("type", "")
        if stype == "list[dict]":
            item_schema = {"type": "object", "properties": {}}
            for k in sub.get("keys", []):
                item_schema["properties"][k] = {"type": "string"}  # 简化
            props[key] = {"type": "array", "items": item_schema}
        elif stype == "list[list]":
            props[key] = {"type": "array", "items": {"type": "array", "items": {"type": "string"}}}
        elif stype == "list":
            props[key] = {"type": "array", "items": {"type": "string"}}
        elif stype == "dict":
            sub_keys = sub.get("keys", [])
            props[key] = {"type": "object", "properties": {k: {"type": "string"} for k in sub_keys[:20]}}
        elif stype in ("int", "bool", "float"):
            tmap = {"int": "integer", "bool": "boolean", "float": "number"}
            props[key] = {"type": tmap.get(stype, "string")}
        elif stype == "NoneType":
            props[key] = {"type": "string", "nullable": True}
        else:
            props[key] = {"type": "string"}
    schema = {
        "type": "object",
        "description": f"后端实测返回结构（{label_prefix}）",
        "x_display_name": f"{label_prefix} → 响应（后端实测）",
        "properties": props,
    }
    return schema

def build_paginated_schema(entity_name):
    entity = SCHEMAS.get(entity_name)
    if not entity:
        return None
    return {
        "type": "object",
        "description": f"DRF 标准分页响应 — results 每项为 `{entity_name}`。",
        "x_display_name": f"Paginated[{entity_name}]（后端实测）",
        "properties": {
            "count": {"type": "integer", "format": "int64", "description": "总记录数"},
            "next": {"type": "string", "format": "uri", "nullable": True, "description": "下一页 URL"},
            "previous": {"type": "string", "format": "uri", "nullable": True, "description": "上一页 URL"},
            "results": {
                "type": "array",
                "description": f"当前页 `{entity_name}` 列表",
                "items": {"$ref": f"#/components/schemas/{entity_name}"},
            },
        },
        "required": ["count", "next", "previous", "results"],
    }

def infer_response(path, method, status="200"):
    """优先 PROBE_DATA，其次路径模式推断。"""
    method_upper = method.upper()
    has_id_param = bool(re.search(r"\{[^}]+\}", path))

    # 1) PROBE_DATA 命中 — 最可靠
    if method_upper == "GET" and path in PROBE_DATA:
        pd = PROBE_DATA[path]
        shape = pd.get("shape", "error")
        if shape == "error":
            code = pd.get("code", 0)
            return (f"HTTP {code}（后端报错）", None, f"后端实测: GET {path} 返回 HTTP {code}（可能是后端 bug 或权限问题）")
        if shape == "paginated":
            results_keys = pd.get("results_keys") or []
            entity = infer_entity_schema(path)
            # 判断 entity 是否匹配（从 results_keys 里找）
            if entity and entity in SCHEMAS:
                schema = build_paginated_schema(entity)
                if schema:
                    return (f"Paginated[{entity}]", schema,
                        f"✅ 后端实测: DRF 分页响应，{len(results_keys)} 字段")
            # 退而求其次：用探测到的 results_keys 生成合成 schema
            if results_keys:
                schema = {
                    "type": "object",
                    "description": "后端实测分页响应",
                    "x_display_name": f"Paginated → 响应（后端实测，实体未知）",
                    "properties": {
                        "count": {"type": "integer"},
                        "next": {"type": "string", "nullable": True},
                        "previous": {"type": "string", "nullable": True},
                        "results": {
                            "type": "array",
                            "items": {"type": "object", "properties": {k: {"type": "string"} for k in results_keys[:30]}},
                        },
                    },
                    "required": ["count", "next", "previous", "results"],
                }
                return ("Paginated（后端实测）", schema,
                    f"✅ 后端实测: DRF 分页响应（OpenAPI 未标注，results 每项 {len(results_keys)} 字段）")
        elif shape == "custom":
            label = path.rstrip("/").split("/")[-1] or "响应"
            schema = build_custom_schema_from_probe(pd, label)
            note_parts = [f"✅ 后端实测: 自定义 dict（OpenAPI 未标注）"]
            if pd.get("keys"):
                note_parts.append(f"顶层字段: {', '.join(pd['keys'][:12])}{'...' if len(pd['keys']) > 12 else ''}")
            return (label, schema, "；".join(note_parts))
        elif shape == "list":
            keys = pd.get("keys") or []
            schema = {
                "type": "array",
                "description": "后端实测返回数组",
                "x_display_name": f"{path} → 数组响应（后端实测）",
                "items": {"type": "object", "properties": {k: {"type": "string"} for k in keys[:30]}},
            }
            return ("list[]", schema, f"✅ 后端实测: 直接数组，每项 {len(keys)} 字段")

    # 2) OpenAPI 原始响应体已有标注
    path_spec = PATHS.get(path, {}).get(method)
    if path_spec:
        resp = (path_spec.get("responses") or {}).get(status) or {}
        content = resp.get("content") or {}
        if content:
            ctype = next(iter(content))
            schema = content[ctype].get("schema") or {}
            if "$ref" in schema:
                name = schema["$ref"].split("/")[-1]
                if name in SCHEMAS:
                    return (name, schema, None)  # 无 note —— OpenAPI 原始的
            if schema.get("type") == "array" and "items" in schema:
                items = schema["items"]
                if isinstance(items, dict) and "$ref" in items:
                    name = items["$ref"].split("/")[-1]
                    return (f"[{name}]", None, None)

    # 3) 动作端点 — 命名推断
    action_match = re.search(r"/(cancel|send|mark-paid|duplicate|pdf|from-opportunity|convert|publish|unpublish|restore|reorder|move|import|export|create_mail|accept|decline)/(?:\?|$|/)", path, re.I)
    if action_match:
        action = action_match.group(1)
        if action == "pdf":
            return ("application/pdf", None, "OpenAPI 未标注；根据命名推断返回 PDF 二进制流")
        entity = infer_entity_schema(path)
        if entity:
            return (entity, None, f"OpenAPI 未标注；动作 `{action}` 推断返回 `{entity}`")
        return ("object", {"type": "object"}, f"OpenAPI 未标注；动作 `{action}` 返回 JSON")

    # 4) GET detail（含 {id}/{token}）
    if method_upper == "GET" and has_id_param:
        entity = infer_entity_schema(path)
        if entity:
            return (entity, None, f"OpenAPI 未标注；推断返回 `{entity}`")

    # 5) POST/PUT/PATCH detail — 通常返回新建/更新的实体
    if method_upper in ("POST", "PUT", "PATCH") and has_id_param:
        entity = infer_entity_schema(path)
        if entity and method_upper != "DELETE":
            return (entity, None, f"OpenAPI 未标注；操作成功推断返回 `{entity}`")

    # 6) POST list 端点 — 新建后通常返回实体
    if method_upper == "POST" and not has_id_param and path.endswith("/"):
        entity = infer_entity_schema(path)
        if entity:
            return (entity, None, f"OpenAPI 未标注；创建成功推断返回 `{entity}`")

    # 7) PATCH/PUT 无参数 singleton 端点 — 更新后通常返回实体
    #    例如 PATCH /api/org/settings/ 更新组织设置
    if method_upper in ("PATCH", "PUT") and not has_id_param:
        entity = infer_entity_schema(path)
        if entity:
            return (entity, None, f"OpenAPI 未标注；更新成功推断返回 `{entity}`")

    return (None, None, "OpenAPI 未标注；无法推断响应结构")


# ---------------------------------------------------------------------------
# 参数表 / schema 表
# ---------------------------------------------------------------------------
def build_param_table(params):
    if not params: return ""
    lines = ["| 参数 | 位置 | 类型 | 必填 | 说明 |", "|------|------|------|------|------|"]
    for p in params:
        name = p.get("name", "")
        loc = p.get("in", "")
        req = "✅" if p.get("required") else "—"
        schema = p.get("schema", {})
        ptype = schema.get("type", "string")
        fmt = schema.get("format", "")
        enum_str = ""
        if schema.get("enum"):
            enum_str = " 枚举: " + ", ".join(str(e) for e in schema["enum"])
        desc = (p.get("description") or "") + enum_str
        desc = desc.strip() or "—"
        t = ptype + (f"({fmt})" if fmt else "")
        lines.append(f"| `{name}` | {loc} | {t} | {req} | {desc} |")
    return "\n".join(lines)

def build_schema_table_from_name(schema_name):
    if not schema_name: return ""
    if isinstance(schema_name, dict):
        schema_raw = schema_name
        name = schema_raw.get("x_display_name", schema_raw.get("description", "推断 schema"))
    elif schema_name in SCHEMAS:
        schema_raw = SCHEMAS[schema_name]
        name = schema_name
    else:
        return ""
    fields = expand_schema(schema_raw)
    if not fields: return ""
    lines = [f"**Schema: `{name}`**", "", "| 字段 | 类型 | 必填 | 说明 | 约束 |", "|------|------|------|------|------|"]
    for fname, finfo in fields:
        ftype = finfo["type"]
        if finfo.get("format") and "(" not in ftype and not ftype.startswith(("→", "[", "enum")):
            ftype = f"{ftype}({finfo['format']})"
        req = "✅" if finfo["required"] else "—"
        desc = finfo.get("description") or finfo.get("title") or ""
        val_notes = []
        if finfo.get("enum"): val_notes.append("枚举: " + ", ".join(str(e) for e in finfo["enum"]))
        if finfo.get("default") is not None: val_notes.append(f"默认: {finfo['default']}")
        if finfo.get("read_only"): val_notes.append("只读")
        if finfo.get("nullable"): val_notes.append("可空")
        if finfo.get("max_length"): val_notes.append(f"≤{finfo['max_length']}字符")
        if finfo.get("pattern"): val_notes.append(f"正则: {finfo['pattern'][:60]}")
        val_str = "; ".join(val_notes)
        lines.append(f"| `{fname}` | {ftype} | {req} | {desc or '—'} | {val_str or '—'} |")
    return "\n".join(lines)

def extract_request_schema(op):
    rb = op.get("requestBody") or {}
    content = rb.get("content") or {}
    ctype = None
    for ct in ("application/json", "multipart/form-data", "application/x-www-form-urlencoded"):
        if ct in content: ctype = ct; break
    if ctype is None: return None, None
    schema = content[ctype].get("schema") or {}
    name = schema["$ref"].split("/")[-1] if "$ref" in schema else None
    return ctype, name

def extract_openapi_response(op, status="200"):
    resp = (op.get("responses") or {}).get(status) or {}
    content = resp.get("content") or {}
    if not content: return None, None
    ctype = next(iter(content))
    schema = content[ctype].get("schema") or {}
    name = None
    if "$ref" in schema: name = schema["$ref"].split("/")[-1]
    elif schema.get("type") == "array" and "items" in schema and "$ref" in (schema["items"] or {}):
        name = "[{}]".format(schema["items"]["$ref"].split("/")[-1])
    return ctype, name

def collect_endpoints():
    out = []
    for path, methods in PATHS.items():
        mod = classify(path)
        for m, op in methods.items():
            if m == "parameters": continue
            out.append((path, m, op, mod))
    return out

# ---------------------------------------------------------------------------
# Markdown 渲染
# ---------------------------------------------------------------------------
def render_endpoint(path, method, op):
    lines = []
    mid = method.upper()
    sec = op.get("security") or SPEC.get("security")
    is_public = sec is None or len(sec) == 0 or sec == [{}]
    auth = "🟢" if is_public else "🔒"
    rb_ctype, rb_schema = extract_request_schema(op)
    desc = guess_description(op, rb_schema, path, method)

    lines.append(f"### {mid} `{path}` {auth}")
    lines.append("")
    if desc:
        lines.append(desc)
        lines.append("")

    # 参数
    params = op.get("parameters") or []
    if params:
        lines.append("**参数**")
        lines.append("")
        lines.append(build_param_table(params))
        lines.append("")

    # 请求体
    if rb_ctype:
        lines.append(f"**请求体** `{rb_ctype}`")
        lines.append("")
        if rb_schema:
            hint = SCHEMA_TYPE_HINTS.get(rb_schema, "")
            if hint:
                lines.append(f"> {hint}")
                lines.append("")
            table = build_schema_table_from_name(rb_schema)
            if table:
                lines.append(table)
            else:
                lines.append(f"`{rb_schema}`")
        else:
            lines.append("（multipart/form-data，可能含文件上传）")
        lines.append("")

    # 成功响应
    success_statuses = [s for s in (op.get("responses") or {}).keys() if s.startswith("2")]
    rendered_any = False
    openapi_has_body = False

    # ★ PROBE_DATA 优先 —— 覆盖 OpenAPI 可能的错误标注
    #    比如 drf-spectacular 把 /api/accounts/ 标成单个 Account，
    #    但后端实际返回 custom dict，此时 PROBE_DATA 才是真相
    if mid == "GET" and path in PROBE_DATA:
        pd = PROBE_DATA[path]
        shape = pd.get("shape", "")
        if shape == "error":
            code = pd.get("code", 0)
            lines.append(f"**200** → 后端实测: HTTP {code}（后端报错）"); lines.append("")
            note = pd.get("note", "")
            if note:
                lines.append(f"> ⚠ {note}"); lines.append("")
            rendered_any = True
        elif shape in ("custom", "kanban", "paginated", "list", "detail"):
            label, schema, note = infer_response(path, method)
            if label:
                lines.append(f"**200** → `{label}`"); lines.append("")
                if note:
                    lines.append(f"> {note}"); lines.append("")
                if schema is not None:
                    table = build_schema_table_from_name(schema)
                    if table:
                        lines.append(table); lines.append("")
                rendered_any = True

    if not rendered_any:
        for st in success_statuses:
            ctype, schema_name = extract_openapi_response(op, st)
            resp_raw = (op.get("responses") or {}).get(st) or {}
            if resp_raw.get("content"): openapi_has_body = True
            if schema_name:
                label = f"**{st}** → `{schema_name}`"
                lines.append(label); lines.append("")
                table = build_schema_table_from_name(schema_name.strip("[]")) if schema_name.startswith("[") else build_schema_table_from_name(schema_name)
                if table:
                    lines.append(table); lines.append("")
                rendered_any = True
            elif ctype:
                lines.append(f"**{st}** → `{ctype}`（OpenAPI 未标注 schema）"); lines.append("")
                rendered_any = True

    if not rendered_any:
        # DELETE 204
        if mid == "DELETE":
            lines.append("**204** → 无响应体（删除成功）"); lines.append("")
        else:
            # 用推断补
            label, schema, note = infer_response(path, method)
            if label:
                tag = "" if label.startswith("推断:") else "推断: "
                label_display = label if label.startswith("推断:") else f"推断: {label}"
                lines.append(f"**200** → {label_display}"); lines.append("")
                if note:
                    lines.append(f"> {note}"); lines.append("")
                if schema is not None:
                    table = build_schema_table_from_name(schema)
                    if table:
                        lines.append(table); lines.append("")
                rendered_any = True
            else:
                lines.append("**响应**"); lines.append(""); lines.append("→ 未知"); lines.append("")

    # 错误响应
    error_lines = []
    if op.get("responses"):
        explicit_errors = [s for s in op["responses"].keys() if s.startswith("4") or s.startswith("5")]
        for st in sorted(explicit_errors):
            edesc = (op["responses"][st] or {}).get("description", "")
            error_lines.append(f"- **{st}**: {edesc or '—'}")

    has_any_param = any(p.get("required") for p in params) or bool(re.search(r"\{[^}]+\}", path))
    if mid in ("POST", "PUT", "PATCH") and not any("400" in e or "422" in e for e in error_lines):
        error_lines.append("- **400 / 422**: 请求体校验失败（字段缺失、类型错误、约束违反）")
    if has_any_param and not any("404" in e for e in error_lines):
        error_lines.append("- **404**: 资源不存在（指定的 id/token 未找到）")
    if auth == "🔒":
        if not any("401" in e for e in error_lines):
            error_lines.append("- **401**: 未登录或 JWT 过期（`Authorization: Bearer <token>`）")
        if not any("403" in e for e in error_lines):
            error_lines.append("- **403**: 无权限访问该资源（org 不匹配或无角色）")
    if (params or mid in ("POST", "PUT", "PATCH")) and not any("400" in e for e in error_lines):
        error_lines.append("- **400**: 请求参数校验失败（query/header/body 不合法）")

    if error_lines:
        seen = set(); dedup = []
        for e in error_lines:
            if e not in seen: seen.add(e); dedup.append(e)
        lines.append("**可能的错误响应（DRF 标准）**"); lines.append("")
        lines.extend(dedup); lines.append("")

    lines.append("---")
    return "\n".join(lines)

def build_module_doc(title_cn, endpoints, extra_intro=""):
    lines = [f"# {title_cn}", ""]
    total = len(endpoints)
    lines.append(f"> 共 {total} 个端点。🔒 = 需要登录（JWT），🟢 = 无需鉴权。")
    if extra_intro:
        lines.append(f"> {extra_intro}")
    lines.append("")
    lines.append("## 端点速览")
    lines.append("")
    lines.append("| 方法 | 路径 | 鉴权 | 说明 |")
    lines.append("|------|------|------|------|")
    for path, m, op, mod in endpoints:
        mid = m.upper()
        sec = op.get("security") or SPEC.get("security")
        is_public = sec is None or len(sec) == 0 or sec == [{}]
        auth = "🟢" if is_public else "🔒"
        rb_ctype, rb_schema = extract_request_schema(op)
        desc = guess_description(op, rb_schema, path, m)
        desc = desc.replace("|", "\\|") or "—"
        lines.append(f"| {mid} | `{path}` | {auth} | {desc} |")
    lines.append("")
    lines.append("## 端点详情")
    lines.append("")
    for path, m, op, mod in endpoints:
        lines.append(render_endpoint(path, m, op))
    return "\n".join(lines)

# ---------------------------------------------------------------------------
# 模块配置
# ---------------------------------------------------------------------------
MODULE_TITLE = {
    "dashboard": "客户关系管理 — 仪表盘",
    "leads": "客户关系管理 — 线索",
    "contacts": "客户关系管理 — 联系人",
    "accounts": "客户关系管理 — 账户",
    "opportunities": "客户关系管理 — 交易（商机）",
    "cases": "客户关系管理 — 工单",
    "tasks": "客户关系管理 — 任务 & 看板",
    "sales_invoices": "销售 — 所有发票",
    "sales_estimates": "销售 — 报价单",
    "sales_products": "销售 — 产品",
    "sales_recurring": "销售 — 循环发票",
    "sales_templates": "销售 — 模板",
    "sales_reports": "销售 — 报表",
    "public_portal": "公共门户（无鉴权）",
    "system": "系统与设置",
}
MODULE_FILE = {
    "dashboard": "dashboard.md", "leads": "leads.md", "contacts": "contacts.md",
    "accounts": "accounts.md", "opportunities": "opportunities.md", "cases": "cases.md",
    "tasks": "tasks.md", "sales_invoices": "sales_invoices.md", "sales_estimates": "sales_estimates.md",
    "sales_products": "sales_products.md", "sales_recurring": "sales_recurring.md",
    "sales_templates": "sales_templates.md", "sales_reports": "sales_reports.md",
    "public_portal": "public_portal.md", "system": "system.md",
}
MODULE_INTRO = {
    "dashboard": "仪表盘：活动动态流 + 首页统计概览。GET 返回的是**聚合 dict**（accounts/leads/cases/opportunities 各列表 + 下拉选项），不是分页列表。",
    "leads": "线索（潜在客户）CRUD + 看板管道/阶段 + 评论/附件 + 从官网创建 + 导入。GET /api/leads/ 返回**聚合 dict**（open_leads + close_leads + 下拉选项）。",
    "contacts": "联系人 CRUD + 评论/附件。GET /api/contacts/ 返回**DRF 标准分页**（count + results），附加 users/countries 下拉选项。",
    "accounts": "账户（公司/客户）CRUD + 评论/附件 + 为账户创建邮件草稿。GET /api/accounts/ 返回**聚合 dict**（open_accounts + closed_accounts + contacts/countries/industries 等下拉）。",
    "opportunities": "交易（商机）CRUD + 行项目 + 评论/附件。GET /api/opportunities/ 返回**聚合 dict**（opportunities + accounts_list + 下拉选项）。",
    "cases": "工单 CRUD + 看板管道/阶段 + 知识库解决方案 + 评论/附件。GET /api/cases/ 返回**聚合 dict**（cases + accounts_list + contacts_list + 下拉选项）。",
    "tasks": "任务 CRUD + 看板管道/阶段 + 独立看板 Boards（Board/Column/BoardTask）API。GET /api/tasks/ 返回**聚合 dict**（tasks + accounts_list + contacts_list + 下拉选项）。",
    "sales_invoices": "发票核心：CRUD + 发送/取消/复制/标记已付/生成 PDF/从商机生成 + 行项目 + 支付 + 评论/附件。GET /api/invoices/ 返回 **DRF 标准分页**。",
    "sales_estimates": "报价单（Estimate）CRUD + 转换为发票 + 发送/生成 PDF。GET /api/invoices/estimates/ 返回 **DRF 标准分页**（OpenAPI 无 Estimate schema，推断用 Invoice）。",
    "sales_products": "产品目录 CRUD（用于发票/报价单行项目）。GET /api/invoices/products/ 返回 **DRF 标准分页**。",
    "sales_recurring": "循环发票（Recurring Invoice）CRUD。GET /api/invoices/recurring/ 返回 **DRF 标准分页**（OpenAPI 无 RecurringInvoice schema，推断用 Invoice）。",
    "sales_templates": "发票/报价单模板 CRUD。GET /api/invoices/templates/ 返回 **DRF 标准分页**。",
    "sales_reports": "销售报表数据（aging/dashboard/revenue 三个 GET 端点）。",
    "public_portal": "对外公开门户，**🟢 无鉴权**。客户通过 public_token 访问自己的发票/报价单。接受/拒绝报价单也在此。",
    "system": "系统级：认证（JWT 登录/注册/刷新/切换组织）、组织、用户、团队、标签、文档、API 设置、个人资料。",
}

# ---------------------------------------------------------------------------
# README
# ---------------------------------------------------------------------------
def write_readme(by_module):
    lines = [
        "# openCRM API 接口文档",
        "",
        f"> 自动生成。最后更新时间：{datetime.now().strftime('%Y-%m-%d %H:%M')}。",
        f"> PROBE 后端探测: **{len(PROBE_DATA)}** 端点",
        "",
        "## 数据来源",
        "",
        "- **OpenAPI JSON**: 256 schema + 121 path + 232 端点，来自 Django drf-spectacular `/schema/`",
        "- **后端实测**: 对每个 GET list 端点发真实请求，探测真实返回结构（DRF 分页 vs 自定义 dict vs 数组）",
        "- **推断补全**: OpenAPI 未标注的响应体用路径模式 + 命名推断；每个推断端点都带 ✅/⚠ 标注",
        "",
        "## 响应体形状总览（后端实测）",
        "",
        "### DRF 标准分页 `{count, next, previous, results:[X]}`",
        "- `/api/contacts/`",
        "- `/api/invoices/`",
        "- `/api/invoices/estimates/`",
        "- `/api/invoices/products/`",
        "- `/api/invoices/recurring/`",
        "- `/api/invoices/templates/`",
        "- `/api/boards/`",
        "",
        "### 自定义聚合 dict（主数据 + 下拉选项一起返回）",
        "- `/api/accounts/` → open_accounts + closed_accounts + contacts + countries + industries + users",
        "- `/api/leads/` → open_leads + close_leads + countries + industries + users",
        "- `/api/cases/` → cases + accounts_list + contacts_list + priority/status/type_of_case",
        "- `/api/opportunities/` → opportunities + accounts_list + contacts_list + currency/lead_source/stage/tags",
        "- `/api/tasks/` → tasks + accounts_list + contacts_list + priority/status",
        "- `/api/users/` → active_users + inactive_users + roles + status",
        "- `/api/documents/` → documents_active + documents_inactive + users + status_choices",
        "- `/api/tags/`, `/api/teams/`, `/api/activities/`, `/api/dashboard/`",
        "",
        "### 其他",
        "- `/api/cases/kanban/`, `/api/leads/kanban/`, `/api/tasks/kanban/` → kanban 结构 dict",
        "- `/api/cases/solutions/` → **后端 HTTP 500**（可能是 bug，接口暂不可用）",
        "- `/api/auth/me/`, `/api/auth/profile/`, `/api/org/`, `/api/org/settings/`, `/api/profile/` → 用户/组织详情 dict",
        "",
        "## 文档列表",
        "",
    ]
    domain_map = [
        ("客户关系管理", ["dashboard", "leads", "contacts", "accounts", "opportunities", "cases", "tasks"]),
        ("销售", ["sales_invoices", "sales_estimates", "sales_products", "sales_recurring", "sales_templates", "sales_reports"]),
        ("公共门户", ["public_portal"]),
        ("系统与设置", ["system"]),
    ]
    grand_total = 0
    for domain, mods in domain_map:
        lines.append(f"### {domain}"); lines.append("")
        for m in mods:
            if m not in by_module: continue
            title = MODULE_TITLE.get(m, m)
            fname = MODULE_FILE.get(m, m + ".md")
            cnt = len(by_module[m]); grand_total += cnt
            lines.append(f"- [{title}]({fname}) — **{cnt}** 个端点")
        lines.append("")
    lines.append(f"**总计：{grand_total} 个 HTTP 端点**"); lines.append("")

    # 方法分布
    method_counts = {}
    for eps in by_module.values():
        for _, m, _, _ in eps: method_counts[m] = method_counts.get(m, 0) + 1
    lines.append("## HTTP 方法分布"); lines.append("")
    for k, v in sorted(method_counts.items(), key=lambda x: -x[1]):
        lines.append(f"- **{k.upper()}**: {v}")
    lines.append("")

    lines.append("## 鉴权说明"); lines.append("")
    lines.append("- **🔒 需要登录**：请求头带 `Authorization: Bearer <JWT>`，JWT 由 `POST /api/auth/login/` 获取（路径 `/api/auth/*` 内的 refresh 端点和注册端点除外）。")
    lines.append("- **🟢 无需鉴权**：公共门户 `/api/public/*`（通过 token 鉴权，非 JWT）、注册、刷新 token、健康检查等。")
    lines.append("")

    lines.append("## 多租户隔离"); lines.append("")
    lines.append("所有业务端点通过 JWT 中的 `org_id` claim 实现行级隔离（RLS），不同租户数据严格隔离。部分 tasks/boards 端点将 `org` 作为 **query 必填参数**。")
    lines.append("")

    lines.append("## 符号说明"); lines.append("")
    lines.append("- ✅  = OpenAPI 原始标注 或 后端实测")
    lines.append("- ⚠  = OpenAPI 未标注，文档为推断结果（可能不完整或有偏差）")
    lines.append("- 🟢 = 无需鉴权；🔒 = 需要 JWT")
    lines.append("- 所有字段表均展开到最深 10 层 `$ref` 递归，并标注 enum / nullable / 约束（maxLength / pattern / readOnly）")
    lines.append("")

    lines.append("## 重新生成"); lines.append("")
    lines.append("```bash")
    lines.append("# 1) 确保后端在跑 (python manage.py runserver)")
    lines.append("# 2) 拉最新 schema")
    lines.append("curl http://127.0.0.1:8000/schema/ -o api_openapi.json")
    lines.append("# 3) 探测后端 + 生成 Markdown（推荐）")
    lines.append("python generate_api_docs.py --probe")
    lines.append("# 4) 跳过探测（用 _probe_data.json 缓存）")
    lines.append("python generate_api_docs.py")
    lines.append("# 覆盖后端地址 / 令牌")
    lines.append("# OPENCRM_BACKEND=http://192.168.1.100:8000 python generate_api_docs.py --probe")
    lines.append("```")
    lines.append("")

    lines.append("## 原始 OpenAPI"); lines.append("")
    lines.append("- [`api_openapi.json`](api_openapi.json) — 完整 OpenAPI 3.0 schema（256 schema, 121 path, ~713 KB），可直接喂给 OpenAPI-to-MCP 转换器。")
    lines.append("- [`_probe_data.json`](_probe_data.json) — 后端探测缓存（可删，下次生成会重新探测）。")
    lines.append("- Django Swagger UI: http://127.0.0.1:8000/swagger-ui/")
    lines.append("- Django ReDoc: http://127.0.0.1:8000/api/schema/redoc/")
    lines.append("")

    with open(os.path.join(OUT_DIR, "README.md"), "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    print(f"  ✓ README.md — updated")

# ---------------------------------------------------------------------------
# 主流程
# ---------------------------------------------------------------------------
def main():
    all_eps = collect_endpoints()
    by_module = OrderedDict()
    for ep in all_eps: by_module.setdefault(ep[3], []).append(ep)
    for mod in by_module: by_module[mod].sort(key=lambda x: (x[0], x[1]))

    write_readme(by_module)

    generated = []
    for mod, eps in by_module.items():
        if mod == "_uncategorized":
            print(f"  [WARN] 未分类端点: {eps}")
            continue
        title = MODULE_TITLE.get(mod, mod)
        fname = MODULE_FILE.get(mod, mod + ".md")
        intro = MODULE_INTRO.get(mod, "")
        content = build_module_doc(title, eps, intro)
        out_path = os.path.join(OUT_DIR, fname)
        with open(out_path, "w", encoding="utf-8") as f: f.write(content)
        sz = os.path.getsize(out_path)
        generated.append((fname, len(eps), sz))
        print(f"  ✓ {fname:25s} {len(eps):3d} eps  {sz/1024:.1f} KB")

    total = sum(c for _, c, _ in generated)
    print(f"\n=== 完成: {len(generated)} 个文件, {total} 个端点 ===")

if __name__ == "__main__":
    main()
