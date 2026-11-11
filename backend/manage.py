#!/usr/bin/env python
import os
import sys


def _port_in_use(port: int) -> bool:
    """快速检测本地端口是否被占用。"""
    import socket
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            return s.connect_ex(("127.0.0.1", port)) == 0
    except OSError:
        return True


def _start_mcp_server():
    """在后台启动 openCRM MCP Server（streamable_http :8001）。
    与 Django runserver 同 console group，Ctrl+C 会一起退出。
    """
    import subprocess
    mcp_path = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                            "mcp", "opencrm_server.py")
    if not os.path.exists(mcp_path):
        print(f"[openCRM] ⚠ MCP server 脚本不存在: {mcp_path}", file=sys.stderr)
        return

    if _port_in_use(8001):
        print("[openCRM] 端口 8001 已被占用，跳过 MCP 启动（可能已在运行）",
              file=sys.stderr)
        return

    # 用当前 Python 起 subprocess，cwd 设为 mcp/ 目录
    subprocess.Popen(
        [sys.executable, mcp_path, "--http"],
        cwd=os.path.dirname(mcp_path),
        creationflags=0,  # 同 console group — Ctrl+C 会一起收到
    )
    print("[openCRM] ✅ MCP Server 已后台启动 → http://127.0.0.1:8001/mcp",
          file=sys.stderr)


if __name__ == "__main__":
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "crm.settings")
    os.environ["DJANGO_SETTINGS_MODULE"] = "crm.settings"

    # ---- runserver 时自动拉起 MCP server ----
    if len(sys.argv) >= 2 and sys.argv[1] == "runserver":
        _start_mcp_server()

    try:
        from django.core.management import execute_from_command_line
    except ImportError:
        try:
            pass
        except ImportError:
            raise ImportError(
                "Couldn't import Django. Are you sure it's installed and "
                "available on your PYTHONPATH environment variable? Did you "
                "forget to activate a virtual environment?"
            )
        raise
    execute_from_command_line(sys.argv)
