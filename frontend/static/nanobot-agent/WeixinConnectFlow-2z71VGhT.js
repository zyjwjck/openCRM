import { r as w, j as i } from "./react-vendor-ASUsaCHq.js";
import { u as _, I as E, B as j, q as S } from "./hosted-entry-Cdi4J4JT.js";
import { C as N } from "./ChannelQrConnectFlow-CoFxncWV.js";
const g = "WeChat login expired. Scan again to reconnect.";
function o(e) {
  return "challenge" in e && e.challenge === "verify_code" && (!("verification_failed" in e) || typeof e.verification_failed == "boolean");
}
function h(e, n) {
  return e.status === "succeeded" ? n("custom.connected", "WeChat is connected.") : e.status === "expired" ? n("custom.expired", g) : e.status === "failed" ? e.message ?? n("custom.failed", "Unable to connect WeChat. Try again.") : e.status === "cancelled" ? n("custom.stopped", "WeChat login stopped.") : o(e) ? e.verification_failed ? n(
    "custom.verifyMismatch",
    "That code did not match. Enter the new number shown in WeChat."
  ) : n(
    "custom.verifyDescription",
    "Enter the number shown in WeChat to continue."
  ) : n("custom.waiting", "Waiting for WeChat scan...");
}
function D({
  token: e,
  feature: n,
  idleLabel: p,
  connectRequestId: C,
  onFeaturesUpdate: x
}) {
  const { t: c } = _(), t = S(c, "weixin"), [a, u] = w.useState(""), l = n.runtime_error === g, d = c("settings.channels.scanAgain", {
    defaultValue: "Scan again"
  }), v = ({
    connect: s,
    busy: W,
    poll: b
  }) => o(s) ? /* @__PURE__ */ i.jsxs(
    "form",
    {
      className: "mt-3 space-y-2",
      onSubmit: (r) => {
        r.preventDefault();
        const f = a.trim();
        f && b({ verify_code: f }).then((m) => {
          m && !o(m) && u("");
        });
      },
      children: [
        /* @__PURE__ */ i.jsx("div", { className: "text-[12px] font-semibold text-foreground", children: t("custom.verifyTitle", "Verification required") }),
        /* @__PURE__ */ i.jsx("p", { className: "text-[12px] leading-5 text-muted-foreground", children: h(s, t) }),
        /* @__PURE__ */ i.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ i.jsx(
            E,
            {
              value: a,
              onChange: (r) => u(r.target.value),
              inputMode: "numeric",
              autoComplete: "one-time-code",
              placeholder: t("custom.verifyPlaceholder", "Code"),
              className: "h-8 max-w-40",
              "aria-invalid": s.verification_failed || void 0
            }
          ),
          /* @__PURE__ */ i.jsx(
            j,
            {
              type: "submit",
              size: "sm",
              className: "h-8 rounded-full px-3 text-[12px] font-semibold",
              disabled: W || !a.trim(),
              children: t("custom.verifySubmit", "Verify")
            }
          )
        ] })
      ]
    }
  ) : null;
  return /* @__PURE__ */ i.jsx(
    N,
    {
      token: e,
      channelName: "weixin",
      startOptions: { force: l },
      idleLabel: l ? d : p,
      connectRequestId: C,
      forceOnRepeat: !0,
      onFeaturesUpdate: x,
      pausePolling: o,
      suppressSucceeded: n.runtime_status === "failed",
      renderPending: v,
      resolveMessage: (s) => h(s, t),
      labels: {
        qrAlt: t("custom.qrAlt", "WeChat login QR code"),
        scanTitle: t("custom.scanTitle", "Scan with WeChat"),
        scanDescription: t(
          "custom.scanDescription",
          "Use WeChat on your phone to scan this code. nanobot saves the account state locally after login."
        ),
        waiting: t("custom.waiting", "Waiting for WeChat scan..."),
        connected: t("custom.connected", "WeChat is connected."),
        stopped: t("custom.stopped", "WeChat login stopped."),
        connecting: t("custom.connecting", "Connecting..."),
        scanAgain: d,
        connect: c("settings.channels.connect", { defaultValue: "Connect" })
      }
    }
  );
}
export {
  g as WEIXIN_AUTH_EXPIRED_MESSAGE,
  D as WeixinConnectFlow
};
