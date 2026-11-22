import { r as a, j as n } from "./react-vendor-ASUsaCHq.js";
import { i as Fe, u as Ce, j as _e, k as te, l as ye, B as Ee, L as B, n as ke, o as Le, c as de, p as Re, q as Te, r as We, s as Ve, W as ae, t as ue, w as me, E as Ie, x as ie, y as ze } from "./hosted-entry-CvKOmP9q.js";
import { d as le, c as Ae, T as Be, C as re } from "./CredentialForm-CpWNbHdk.js";
import { WeixinConnectFlow as Ue, WEIXIN_AUTH_EXPIRED_MESSAGE as Me } from "./WeixinConnectFlow-TXY50BTM.js";
function Ze({
  token: s,
  feature: e,
  actionKey: c,
  chatAppsDocsUrl: i,
  showBrandLogos: r,
  onAction: u,
  onFeaturesUpdate: m
}) {
  var ne, se;
  const { client: d } = Fe(), { t: p, i18n: j } = Ce(), o = (t, l) => p(t, { defaultValue: l }), g = Te(p, "weixin"), S = $e(e.runtime_error, g), F = g("displayName", "WeChat"), f = c === `enable:${e.name}`, ge = c === `disable:${e.name}`, U = f || ge, M = e.runtime_status === "running" || e.runtime_status === "starting", xe = e.enabled && !e.installed, q = ((ne = e.capabilities) == null ? void 0 : ne.includes("always_enabled")) ?? !1, D = q || M, he = q || U || !e.install_supported && !e.installed && !e.enabled, [pe, fe] = a.useState(0), [K, E] = a.useState({}), [k, O] = a.useState(() => /* @__PURE__ */ new Set()), [C, X] = a.useState(!1), [L, be] = a.useState(0), [P, ve] = a.useState(0), [_, y] = a.useState("idle"), [$, R] = a.useState(null), we = JSON.stringify(e.config_values ?? {}), je = JSON.stringify(((se = e.setup) == null ? void 0 : se.fields) ?? []), G = a.useMemo(
    () => new Set(e.configured_fields ?? []),
    [e.configured_fields]
  ), T = o("settings.values.on", "On"), W = o("settings.values.off", "Off"), Y = qe(
    e,
    j.resolvedLanguage ?? j.language
  ), V = ce(Y.primary, T, W), I = ce(Y.advanced, T, W), b = [...V, ...I], Se = _e(te("wechat"), i) ?? te("wechat"), [z, J] = a.useState(
    () => le(b, e.config_values)
  ), x = a.useRef(z), v = a.useRef(k), H = a.useRef(b), Z = a.useRef({
    token: s,
    enabled: e.enabled,
    onFeaturesUpdate: m
  });
  H.current = b, Z.current = {
    token: s,
    enabled: e.enabled,
    onFeaturesUpdate: m
  }, a.useEffect(() => {
    const t = le(b, e.config_values);
    for (const l of v.current)
      t[l] = x.current[l] ?? "";
    x.current = t, J(t), E({});
  }, [we, je]), a.useEffect(() => {
    if (_ !== "saved") return;
    const t = window.setTimeout(() => y("idle"), 1500);
    return () => window.clearTimeout(t);
  }, [_]);
  const Q = a.useCallback(async (t, l) => {
    const N = Z.current;
    X(!0), R(null), y("idle");
    try {
      const h = await ye(
        d,
        "weixin",
        Ae(H.current, t),
        { enable: N.enabled }
      ), w = new Set(v.current);
      for (const A of l)
        x.current[A] === t[A] && w.delete(A);
      v.current = w, O(w), y(w.size ? "idle" : "saved"), h.nanobot_features && N.onFeaturesUpdate(h.nanobot_features);
    } catch (h) {
      R(h.message);
    } finally {
      X(!1);
    }
  }, [d]);
  a.useEffect(() => {
    if (!b.length || !k.size || C || L <= P) return;
    const t = window.setTimeout(() => {
      ve(L), Q(
        { ...x.current },
        new Set(v.current)
      );
    }, 500);
    return () => window.clearTimeout(t);
  }, [
    P,
    b.length,
    L,
    Q,
    C,
    k.size
  ]);
  const ee = (t, l) => {
    if (x.current[t] === l) return;
    const N = { ...x.current, [t]: l }, h = new Set(v.current).add(t);
    x.current = N, v.current = h, J(N), O(h), R(null), y("idle"), be((w) => w + 1);
  }, Ne = p("settings.channels.toggleChannel", {
    name: F,
    defaultValue: "{{name}} channel"
  });
  return /* @__PURE__ */ n.jsxs("aside", { className: "min-h-full rounded-panel bg-settings-surface p-5", children: [
    /* @__PURE__ */ n.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
      /* @__PURE__ */ n.jsxs("div", { className: "flex min-w-0 items-start gap-3", children: [
        /* @__PURE__ */ n.jsx(Ke, { showBrandLogos: r }),
        /* @__PURE__ */ n.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ n.jsx("h3", { className: "truncate text-[18px] font-semibold leading-6 text-foreground", children: F }),
          /* @__PURE__ */ n.jsx("p", { className: "mt-1 text-[13px] leading-5 text-muted-foreground", children: g("description", "Use nanobot from WeChat conversations.") }),
          xe && e.install_supported ? /* @__PURE__ */ n.jsxs(
            Ee,
            {
              type: "button",
              size: "sm",
              variant: "secondary",
              disabled: f,
              onClick: () => u("enable", e.name),
              className: "mt-2 h-8 rounded-full px-3 text-[12px] font-semibold",
              children: [
                f ? /* @__PURE__ */ n.jsx(B, { className: "mr-1.5 h-3.5 w-3.5 animate-spin", "aria-hidden": !0 }) : /* @__PURE__ */ n.jsx(ke, { className: "mr-1.5 h-3.5 w-3.5", "aria-hidden": !0 }),
                o("settings.nanobotFeatures.installSupport", "Install support")
              ]
            }
          ) : null
        ] })
      ] }),
      /* @__PURE__ */ n.jsxs("div", { className: "flex shrink-0 items-center gap-2 pt-1", children: [
        /* @__PURE__ */ n.jsx(Xe, { status: e.runtime_status, children: Pe(e, o) }),
        U ? /* @__PURE__ */ n.jsx(B, { className: "h-3.5 w-3.5 animate-spin text-muted-foreground", "aria-hidden": !0 }) : null,
        /* @__PURE__ */ n.jsx(
          Be,
          {
            checked: D,
            disabled: he,
            ariaLabel: Ne,
            label: D ? T : W,
            onChange: (t) => {
              if (t && !M && e.configured === !1) {
                fe((l) => l + 1);
                return;
              }
              u(t ? "enable" : "disable", e.name);
            }
          }
        )
      ] })
    ] }),
    S ? /* @__PURE__ */ n.jsx("div", { className: "mt-4 rounded-control border border-destructive/20 bg-destructive/5 px-3 py-2 text-[12px] leading-5 text-destructive", children: S }) : null,
    /* @__PURE__ */ n.jsxs("div", { className: "mt-4 space-y-4", children: [
      /* @__PURE__ */ n.jsx(
        Ue,
        {
          token: s,
          feature: e,
          idleLabel: g("setup.primaryAction", "Connect WeChat"),
          connectRequestId: pe,
          onFeaturesUpdate: m
        }
      ),
      V.length ? /* @__PURE__ */ n.jsx(
        re,
        {
          fields: V,
          values: z,
          configuredFields: G,
          visibleSecrets: K,
          onChange: ee,
          onToggleSecret: (t) => {
            E((l) => ({ ...l, [t]: !l[t] }));
          },
          compact: !0
        }
      ) : null,
      /* @__PURE__ */ n.jsx(
        "div",
        {
          role: "status",
          "aria-live": "polite",
          "aria-atomic": "true",
          className: de(
            "flex items-center justify-end gap-1.5 text-[11px] leading-4 text-muted-foreground",
            !C && _ !== "saved" && "sr-only"
          ),
          children: C ? /* @__PURE__ */ n.jsxs(n.Fragment, { children: [
            /* @__PURE__ */ n.jsx(B, { className: "h-3 w-3 animate-spin", "aria-hidden": !0 }),
            o("settings.actions.saving", "Saving")
          ] }) : _ === "saved" ? /* @__PURE__ */ n.jsxs(n.Fragment, { children: [
            /* @__PURE__ */ n.jsx(Le, { className: "h-3 w-3", "aria-hidden": !0 }),
            o("settings.channels.savedSettings", "Saved settings.")
          ] }) : null
        }
      ),
      $ ? /* @__PURE__ */ n.jsx(
        "div",
        {
          role: "alert",
          className: "rounded-control border border-destructive/20 bg-destructive/5 px-3 py-2 text-[12px] leading-5 text-destructive",
          children: $
        }
      ) : null,
      I.length ? /* @__PURE__ */ n.jsxs("details", { className: "group text-[12px] leading-5 text-muted-foreground", children: [
        /* @__PURE__ */ n.jsx("summary", { className: "cursor-pointer list-none text-[12px] font-semibold text-foreground", children: /* @__PURE__ */ n.jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
          o("settings.channels.advanced", "Advanced"),
          /* @__PURE__ */ n.jsx(
            Re,
            {
              className: "h-3.5 w-3.5 transition-transform group-open:rotate-180",
              "aria-hidden": !0
            }
          )
        ] }) }),
        /* @__PURE__ */ n.jsx("div", { className: "mt-3", children: /* @__PURE__ */ n.jsx(
          re,
          {
            fields: I,
            values: z,
            configuredFields: G,
            visibleSecrets: K,
            onChange: ee,
            onToggleSecret: (t) => {
              E((l) => ({ ...l, [t]: !l[t] }));
            },
            compact: !0
          }
        ) })
      ] }) : null,
      /* @__PURE__ */ n.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ n.jsx(
        Oe,
        {
          url: Se,
          label: g("setup.docsLabel", "Open WeChat setup")
        }
      ) })
    ] })
  ] });
}
function qe(s, e) {
  var p, j;
  const c = ((p = s.setup) == null ? void 0 : p.fields) ?? [], i = new Map(c.map((o) => [o.key, o])), r = (j = We("weixin", Ve(e))) == null ? void 0 : j.setup, u = /* @__PURE__ */ new Set([
    ...ie,
    ...ae
  ]), m = c.map((o) => o.key).filter((o) => !u.has(o)), d = (o) => o.flatMap((g) => {
    var f;
    const S = i.get(g);
    if (!S) return [];
    const F = (f = r == null ? void 0 : r.fields) == null ? void 0 : f[ze("weixin", g)];
    return [De(S, F)];
  });
  return {
    primary: d(ie),
    advanced: d([...ae, ...m])
  };
}
function De(s, e) {
  const c = s.kind === "bool" ? ["true", "false"] : s.choices;
  return {
    key: s.key,
    label: (e == null ? void 0 : e.label) ?? oe(s.field),
    placeholder: e == null ? void 0 : e.placeholder,
    help: e == null ? void 0 : e.help,
    secret: s.kind === "secret",
    optional: !s.required,
    inputType: s.kind === "int" ? "number" : void 0,
    defaultValue: s.default_value,
    options: s.kind === "enum" || s.kind === "bool" ? c.map((i) => {
      var r;
      return {
        value: i,
        label: ((r = e == null ? void 0 : e.choices) == null ? void 0 : r[i]) ?? oe(i)
      };
    }) : void 0
  };
}
function oe(s) {
  const e = s.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/[_-]+/g, " ").trim();
  return e ? e[0].toUpperCase() + e.slice(1) : s;
}
function Ke({ showBrandLogos: s }) {
  const e = a.useMemo(() => ue("https://weixin.qq.com/favicon.ico"), []), { logoUrl: c, onLogoError: i, onLogoLoad: r } = me(e);
  return s && c ? /* @__PURE__ */ n.jsx("span", { className: "grid h-10 w-10 shrink-0 place-items-center rounded-control bg-background", children: /* @__PURE__ */ n.jsx(
    "img",
    {
      src: c,
      alt: "",
      decoding: "async",
      loading: "lazy",
      className: "h-5.5 w-5.5 max-h-6 max-w-6 object-contain",
      onLoad: r,
      onError: i
    }
  ) }) : /* @__PURE__ */ n.jsx(
    "span",
    {
      className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-control bg-background text-[11px] font-bold",
      style: { color: "#07C160" },
      "aria-hidden": !0,
      children: "WX"
    }
  );
}
function Oe({ url: s, label: e }) {
  const c = a.useMemo(() => ue("https://weixin.qq.com/favicon.ico"), []), { logoUrl: i, onLogoError: r, onLogoLoad: u } = me(c);
  return /* @__PURE__ */ n.jsxs(
    "a",
    {
      href: s,
      target: "_blank",
      rel: "noreferrer",
      className: "inline-flex max-w-full items-center gap-2 rounded-full bg-background/80 py-1 pl-1 pr-2.5 text-[11.5px] font-semibold text-foreground transition-colors hover:bg-background",
      children: [
        /* @__PURE__ */ n.jsx(
          "span",
          {
            className: "grid h-5 w-5 shrink-0 place-items-center overflow-hidden rounded-full bg-muted/70 text-[9px] font-bold",
            style: { color: "#07C160" },
            "aria-hidden": !0,
            children: i ? /* @__PURE__ */ n.jsx(
              "img",
              {
                src: i,
                alt: "",
                decoding: "async",
                loading: "lazy",
                className: "h-3.5 w-3.5 object-contain",
                onLoad: u,
                onError: r
              }
            ) : "WX"
          }
        ),
        /* @__PURE__ */ n.jsx("span", { className: "truncate", children: e }),
        /* @__PURE__ */ n.jsx(Ie, { className: "h-3.5 w-3.5 shrink-0 text-muted-foreground", "aria-hidden": !0 })
      ]
    }
  );
}
function Xe({
  children: s,
  status: e
}) {
  return /* @__PURE__ */ n.jsx("span", { className: de(
    "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium leading-4",
    e === "failed" ? "bg-destructive/10 text-destructive" : e === "running" ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-200" : "bg-muted/75 text-muted-foreground"
  ), children: s });
}
function Pe(s, e) {
  return s.runtime_status === "failed" ? e("settings.channels.runtimeFailed", "Failed") : s.runtime_status === "starting" ? e("settings.channels.runtimeStarting", "Starting") : s.runtime_status === "running" ? e("settings.values.on", "On") : s.enabled ? e("settings.channels.runtimeStopped", "Not running") : e("settings.values.off", "Off");
}
function $e(s, e) {
  return s === Me ? e("custom.expired", s) : s;
}
function ce(s, e, c) {
  return s.map((i) => {
    var u, m;
    const r = new Set((u = i.options) == null ? void 0 : u.map((d) => d.value));
    return r.size !== 2 || !r.has("true") || !r.has("false") ? i : {
      ...i,
      options: (m = i.options) == null ? void 0 : m.map((d) => ({
        ...d,
        label: d.value === "true" ? e : c
      }))
    };
  });
}
export {
  Ze as WeixinPanel
};
