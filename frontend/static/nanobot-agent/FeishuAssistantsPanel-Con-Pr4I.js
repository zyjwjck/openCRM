import { j as s, r as h } from "./react-vendor-ASUsaCHq.js";
import { u as m, q as f, i as x, B as b, L as C, G as j } from "./hosted-entry-Dbp-ZpRx.js";
import { C as y } from "./ChannelInstancesPanel-DSJdZ6YA.js";
import { C as A } from "./ChannelQrConnectFlow-DjtnbZ5C.js";
import { R as N } from "./rotate-ccw-BtFYjp5j.js";
function g({
  token: e,
  instanceId: n = "default",
  mode: c = "replace",
  idleLabel: r,
  connectRequestId: i,
  onFeaturesUpdate: u
}) {
  const { t } = m(), o = f(t, "feishu");
  return /* @__PURE__ */ s.jsx(
    A,
    {
      token: e,
      channelName: "feishu",
      startOptions: { domain: "feishu", instanceId: n, mode: c },
      idleLabel: r,
      connectRequestId: i,
      onFeaturesUpdate: u,
      labels: {
        qrAlt: o("custom.qrAlt", "Feishu connection QR code"),
        scanTitle: o("custom.scanTitle", "Scan with Feishu"),
        scanDescription: o(
          "custom.scanDescription",
          "Use Feishu or Lark on your phone to scan this code. nanobot will finish setup automatically after authorization."
        ),
        waiting: o("custom.waiting", "Waiting for authorization..."),
        connected: o("custom.connected", "Feishu is connected."),
        stopped: o("custom.stopped", "Connection stopped."),
        connecting: o("custom.connecting", "Connecting..."),
        scanAgain: t("settings.channels.scanAgain", { defaultValue: "Scan again" }),
        connect: t("settings.channels.connect", { defaultValue: "Connect" })
      }
    }
  );
}
function B({
  token: e,
  feature: n,
  showBrandLogos: c,
  chatAppsDocsUrl: r,
  onFeaturesUpdate: i
}) {
  var l;
  const { t: u } = m(), t = f(u, "feishu"), o = (l = n.instances) != null && l.length ? n.instances : [w(n)];
  return /* @__PURE__ */ s.jsx(
    y,
    {
      feature: n,
      showBrandLogos: c,
      chatAppsDocsUrl: r,
      instances: o,
      onFeaturesUpdate: i,
      customization: {
        countLabel: (a) => F(a, t),
        toggleAriaLabel: (a) => t("custom.toggleAssistant", "{{name}} assistant", {
          name: L(a)
        }),
        configuredLabel: t("custom.configured", "Connected"),
        needsSetupLabel: t("custom.needsSetup", "Needs authorization"),
        renderInstanceSummary: (a) => {
          var d;
          return I((d = a.config_values) == null ? void 0 : d["channels.feishu.appId"]) || t("custom.noAppId", "No App ID");
        },
        renderInstanceAction: (a) => /* @__PURE__ */ s.jsx(
          v,
          {
            token: e,
            instance: a,
            onFeaturesUpdate: i
          },
          a.id
        ),
        footer: /* @__PURE__ */ s.jsxs("div", { className: "mt-4 overflow-hidden rounded-floating border border-border/70 bg-background px-4 py-4", children: [
          /* @__PURE__ */ s.jsx("div", { className: "text-[13px] font-semibold text-foreground", children: t("custom.createAnother", "Create another assistant") }),
          /* @__PURE__ */ s.jsx("p", { className: "mt-1 text-[12.5px] leading-5 text-muted-foreground", children: t(
            "custom.createHint",
            "Create a separate Feishu bot for another team, space, or workflow."
          ) }),
          /* @__PURE__ */ s.jsx(
            g,
            {
              token: e,
              instanceId: "default",
              mode: "create",
              idleLabel: t("custom.createAssistant", "Create assistant"),
              onFeaturesUpdate: i
            }
          )
        ] })
      }
    }
  );
}
function v({
  token: e,
  instance: n,
  onFeaturesUpdate: c
}) {
  const { client: r } = x(), { t: i } = m(), u = f(i, "feishu"), [t, o] = h.useState(!1), [l, a] = h.useState(null);
  if (!n.configured)
    return /* @__PURE__ */ s.jsx(
      g,
      {
        token: e,
        instanceId: n.id,
        mode: "replace",
        idleLabel: i("settings.channels.connect", { defaultValue: "Connect" }),
        onFeaturesUpdate: c
      }
    );
  const d = async () => {
    o(!0), a(null);
    try {
      c(
        await j(r, "feishu", { instanceId: n.id })
      );
    } catch (p) {
      a(p.message);
    } finally {
      o(!1);
    }
  };
  return /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
    /* @__PURE__ */ s.jsx("div", { className: "mt-3 flex justify-end", children: /* @__PURE__ */ s.jsxs(
      b,
      {
        type: "button",
        size: "sm",
        variant: "outline",
        className: "h-8 rounded-full border-border/65 bg-background/80 px-3 text-[12px] font-semibold hover:bg-muted/70",
        onClick: () => void d(),
        disabled: t || !n.enabled,
        children: [
          t ? /* @__PURE__ */ s.jsx(C, { className: "mr-1.5 h-3.5 w-3.5 animate-spin", "aria-hidden": !0 }) : /* @__PURE__ */ s.jsx(N, { className: "mr-1.5 h-3.5 w-3.5", "aria-hidden": !0 }),
          u("custom.reconnect", "Reconnect")
        ]
      }
    ) }),
    l ? /* @__PURE__ */ s.jsx("div", { className: "mt-3 rounded-control border border-destructive/20 px-3 py-2 text-[12px] leading-5 text-destructive", children: l }) : null
  ] });
}
function w(e) {
  return {
    id: "default",
    name: "nanobot",
    enabled: e.enabled,
    configured: !!e.configured,
    config_values: e.config_values ?? {},
    configured_fields: e.configured_fields ?? []
  };
}
function F(e, n) {
  return e === 0 ? n("custom.countNone", "No assistant connected") : e === 1 ? n("custom.countOne", "1 assistant connected") : n("custom.countMany", "{{count}} assistants connected", { count: e });
}
function L(e) {
  var n;
  return ((n = e.display_name) == null ? void 0 : n.trim()) || e.name.trim() || e.id;
}
function I(e) {
  return e ? e.length <= 10 ? e : `${e.slice(0, 7)}...${e.slice(-4)}` : "";
}
export {
  B as FeishuAssistantsPanel
};
