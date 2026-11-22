"""Tests that MCP tool calls carry the session-bound caller credential via _meta."""

import asyncio
import os
import unittest
from types import SimpleNamespace
from unittest.mock import patch

from mcp import types

from nanobot.agent.tools.context import RequestContext, request_context
from nanobot.agent.tools.mcp import (
    MCP_CALLER_META_KEY,
    MCP_REQUIRE_IDENTITY_ENV,
    MCPToolWrapper,
)
from nanobot.webui.identity import MCP_CALL_CREDENTIAL_METADATA_KEY

CRED_A = "cred-alice"
CRED_B = "cred-bob"


def _text(text: str) -> types.TextContent:
    return types.TextContent(type="text", text=text)


def _make_wrapper(session):
    tool_def = SimpleNamespace(
        name="demo",
        description="demo",
        inputSchema={"type": "object", "properties": {}},
    )
    return MCPToolWrapper(session, "test", tool_def, tool_timeout=1.0)


class _RecordingSession:
    def __init__(self):
        self.calls = []

    async def call_tool(self, name, *, arguments=None, meta=None):
        self.calls.append({"name": name, "arguments": arguments, "meta": meta})
        return SimpleNamespace(content=[_text("ok")], isError=False)


def _ctx_with_credential(credential: str) -> RequestContext:
    return RequestContext(
        channel="websocket",
        chat_id="chat-1",
        metadata={MCP_CALL_CREDENTIAL_METADATA_KEY: credential},
    )


class McpCallerCredentialTests(unittest.TestCase):
    def test_credential_goes_into_meta_not_arguments(self):
        session = _RecordingSession()
        wrapper = _make_wrapper(session)
        with request_context(_ctx_with_credential(CRED_A)):
            asyncio.run(wrapper.execute(value=1))

        self.assertEqual(len(session.calls), 1)
        call = session.calls[0]
        self.assertEqual(call["arguments"], {"value": 1})
        self.assertNotIn(CRED_A, str(call["arguments"]))
        self.assertEqual(call["meta"].get(MCP_CALLER_META_KEY), CRED_A)

    def test_different_sessions_produce_distinct_meta(self):
        for credential in (CRED_A, CRED_B):
            session = _RecordingSession()
            wrapper = _make_wrapper(session)
            with request_context(_ctx_with_credential(credential)):
                asyncio.run(wrapper.execute())
            self.assertEqual(session.calls[0]["meta"].get(MCP_CALLER_META_KEY), credential)

    def test_no_context_does_not_pass_meta(self):
        session = _RecordingSession()
        wrapper = _make_wrapper(session)

        async def run():
            return await wrapper.execute()

        # Use a call_tool that does not accept meta at all, mirroring legacy clients.
        async def legacy_call_tool(name, *, arguments=None):
            session.calls.append({"name": name, "arguments": arguments, "meta": None})
            return SimpleNamespace(content=[_text("ok")], isError=False)

        session.call_tool = legacy_call_tool
        asyncio.run(run())
        self.assertIsNone(session.calls[0]["meta"])

    def test_identity_required_rejects_call_without_credential(self):
        session = _RecordingSession()
        wrapper = _make_wrapper(session)
        with patch.dict(os.environ, {MCP_REQUIRE_IDENTITY_ENV: "1"}):
            result = asyncio.run(wrapper.execute())
        self.assertTrue(result.is_error)
        self.assertIn("no session-bound CRM identity", str(result))
        self.assertEqual(len(session.calls), 0)

    def test_identity_required_allows_call_with_credential(self):
        session = _RecordingSession()
        wrapper = _make_wrapper(session)
        with patch.dict(os.environ, {MCP_REQUIRE_IDENTITY_ENV: "1"}):
            with request_context(_ctx_with_credential(CRED_A)):
                result = asyncio.run(wrapper.execute())
        self.assertEqual(str(result), "ok")
        self.assertEqual(session.calls[0]["meta"].get(MCP_CALLER_META_KEY), CRED_A)


if __name__ == "__main__":
    unittest.main()
