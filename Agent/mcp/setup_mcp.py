"""Portable openCRM MCP + nanobot config registration.

Ensures the openCRM-MCP server is registered in nanobot's MCP list on ANY
machine, with all paths resolved relative to this project (no hardcoded
drive letters). Safe to re-run: it only merges the openCRM-MCP entry and the
workspace path, preserving every other setting.

Run from the project root:
    python Agent/mcp/setup_mcp.py

IMPORTANT: in nanobot's schema, MCP servers live UNDER `tools.mcpServers`.
A top-level `mcpServers` key is rejected as "Unknown setting" and breaks the
whole config load, so we always write there (and migrate any stray top-level
mcpServers entry down into tools.mcpServers).
"""
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))             # <root>/Agent/mcp
PROJECT_ROOT = os.path.dirname(os.path.dirname(HERE))          # <root>
NANOBOT_DIR = os.path.join(PROJECT_ROOT, ".nanobot")
WORKSPACE = os.path.join(NANOBOT_DIR, "workspace")

# Keep this in sync with Agent/mcp/opencrm_server.py (DEFAULT_PORT / --http).
# Field names mirror nanobot's accepted camelCase aliases (type/url/toolTimeout/...).
MCP_ENTRY = {
    "type": "streamableHttp",
    "auth": None,
    "command": "",
    "args": [],
    "env": {},
    "cwd": "",
    "url": "http://127.0.0.1:8100/mcp",
    "headers": {},
    "toolTimeout": 30,
    "enabledTools": ["*"],
}


def ensure_config(path):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    cfg = {}
    if os.path.exists(path):
        try:
            with open(path, encoding="utf-8") as f:
                cfg = json.load(f)
        except Exception as e:
            print(f"  ! could not parse {path}: {e} (starting fresh)")
            cfg = {}

    # MCP servers belong under tools.mcpServers in nanobot's schema.
    tools = cfg.setdefault("tools", {})
    mcp = tools.setdefault("mcpServers", {})

    # Migrate any erroneously placed top-level mcpServers entries down here,
    # then drop the invalid top-level key (it breaks config loading).
    top = cfg.get("mcpServers")
    if isinstance(top, dict):
        mcp.update(top)
        del cfg["mcpServers"]

    mcp["openCRM-MCP"] = MCP_ENTRY

    # nanobot's SSRF guard blocks loopback/private addresses by default, which
    # would make the local openCRM MCP (http://127.0.0.1:8100/mcp) fail to
    # connect with "Connection failed". Whitelist the loopback range so the
    # MCP panel can reach it. Loopback cannot reach real LAN/metadata endpoints.
    ssrf = tools.setdefault("ssrfWhitelist", [])
    if "127.0.0.0/8" not in ssrf:
        ssrf.append("127.0.0.0/8")

    # Drop a stale/duplicate "openCRM" entry that pointed at the wrong port
    # (8001) and caused a confusing "openCRM Connection failed" in the UI.
    # Only removes it when it matches that exact stale url.
    if mcp.get("openCRM", {}).get("url") == "http://127.0.0.1:8001/mcp":
        del mcp["openCRM"]

    agents = cfg.setdefault("agents", {})
    defaults = agents.setdefault("defaults", {})
    defaults["workspace"] = WORKSPACE

    with open(path, "w", encoding="utf-8") as f:
        json.dump(cfg, f, indent=2, ensure_ascii=False)
    print(f"  [ok] {path}")


def main():
    global_cfg = os.path.expanduser("~/.nanobot/config.json")
    project_cfg = os.path.join(NANOBOT_DIR, "config.json")
    project_nanobot_cfg = os.path.join(NANOBOT_DIR, "nanobot.config.json")

    print("Registering openCRM-MCP into nanobot configs (under tools.mcpServers)...")
    ensure_config(global_cfg)          # used by `nanobot webui` / direct runs
    ensure_config(project_cfg)         # project-local copy
    ensure_config(project_nanobot_cfg) # used by start-all.bat (-c)

    print(f"\nWorkspace : {WORKSPACE}")
    print("MCP URL    : http://127.0.0.1:8100/mcp")
    print("Done. Launch the stack with start-all.bat (it also starts the MCP server).")


if __name__ == "__main__":
    main()
