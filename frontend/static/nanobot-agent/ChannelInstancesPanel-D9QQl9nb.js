import { r as h, j as n } from "./react-vendor-ASUsaCHq.js";
import { h as me, q as G, V as $, Y as F, r as ge, s as he, y as Q, t as P, w as D, u as _, j as fe, c as w, E as K, L as R, B as ne, Z as xe, i as pe, p as X, G as be, _ as je, l as ye } from "./hosted-entry-C42kbos-.js";
import { a as Ne, b as se, e as ae, f as ve, g as ke, d as M, T as we, C as Ce, c as Le } from "./CredentialForm-Br7qWygM.js";
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Se = me("Clipboard", [
  ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1", ry: "1", key: "tgr4d6" }],
  [
    "path",
    {
      d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
      key: "116196"
    }
  ]
]);
function _e(e, l = "en") {
  var y, U, C, d, k;
  const s = (y = F(e.name, e.webui)) == null ? void 0 : y.setup, t = $(e.name), i = ge(t, he(l)), a = i == null ? void 0 : i.setup, o = (r) => {
    var L;
    const m = (L = a == null ? void 0 : a.fields) == null ? void 0 : L[Q(e.name, r)];
    return {
      key: r,
      label: (m == null ? void 0 : m.label) ?? O(r.split(".").at(-1) ?? r),
      placeholder: m == null ? void 0 : m.placeholder,
      help: m == null ? void 0 : m.help
    };
  }, u = {
    ...s,
    primaryActionLabel: a == null ? void 0 : a.primaryAction,
    docsLabel: a == null ? void 0 : a.docsLabel,
    officialLabel: a == null ? void 0 : a.officialLabel,
    summary: (a == null ? void 0 : a.summary) ?? "Enable turns on this channel in nanobot, but this integration still needs platform-specific setup before it can receive messages.",
    tryIt: a == null ? void 0 : a.tryIt,
    steps: (a == null ? void 0 : a.steps) ?? [
      `Open ~/.nanobot/config.json and find channels.${e.name}.`,
      "Add the credentials required by that platform, using the channel documentation as the source of truth.",
      "Restart nanobot, then send a small test message from that platform."
    ],
    fields: (U = s == null ? void 0 : s.fields) == null ? void 0 : U.map((r) => o(r.key)),
    manualFields: (C = s == null ? void 0 : s.manualFields) == null ? void 0 : C.map((r) => o(r.key)),
    actions: (d = s == null ? void 0 : s.actions) == null ? void 0 : d.map((r) => {
      var m;
      return {
        ...r,
        label: ((m = a == null ? void 0 : a.actions) == null ? void 0 : m[r.id]) ?? O(r.id)
      };
    }),
    presets: (k = s == null ? void 0 : s.presets) == null ? void 0 : k.map((r) => {
      var m;
      return {
        ...r,
        label: ((m = a == null ? void 0 : a.presets) == null ? void 0 : m[r.id]) ?? O(r.id)
      };
    })
  }, g = e.setup;
  if (!g) return u;
  const f = new Map(
    (u.fields ?? []).map((r) => [r.key, r])
  ), p = new Map(
    (u.manualFields ?? []).map((r) => [r.key, r])
  ), x = g.fields.map((r) => {
    var E, T;
    const L = f.get(r.key) ?? p.get(r.key) ?? o(r.key), q = ((T = (E = a == null ? void 0 : a.fields) == null ? void 0 : E[Q(e.name, r.key)]) == null ? void 0 : T.choices) ?? {}, A = r.kind === "bool" ? ["true", "false"] : r.choices;
    return {
      ...L,
      key: r.key,
      label: L.label,
      secret: r.kind === "secret",
      optional: !r.required,
      inputType: r.kind === "int" ? "number" : void 0,
      defaultValue: r.default_value,
      options: r.kind === "enum" || r.kind === "bool" ? A.map((V) => ({
        value: V,
        label: q[V] ?? O(V)
      })) : void 0
    };
  }), b = new Set(p.keys()), v = x.filter((r) => !b.has(r.key)), j = x.filter((r) => b.has(r.key));
  return {
    ...u,
    officialUrl: g.official_url,
    officialLabel: u.officialLabel ?? (g.official_url ? "Open official setup" : void 0),
    fields: v.length ? v : void 0,
    manualFields: j.length ? j : void 0
  };
}
function O(e) {
  const l = e.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/[_-]+/g, " ").trim();
  return l ? l[0].toUpperCase() + l.slice(1) : e;
}
function Ue({
  feature: e,
  showBrandLogos: l
}) {
  const s = F(e.name, e.webui), t = (s == null ? void 0 : s.initials) ?? e.display_name.slice(0, 2).toUpperCase(), i = (s == null ? void 0 : s.color) ?? "#6B7280", a = s == null ? void 0 : s.icon, o = h.useMemo(() => P(s == null ? void 0 : s.logoUrl), [s == null ? void 0 : s.logoUrl]), { logoUrl: u, onLogoError: g, onLogoLoad: f } = D(o);
  return l && u ? /* @__PURE__ */ n.jsx(
    "span",
    {
      className: "grid h-10 w-10 shrink-0 place-items-center rounded-control bg-background",
      children: /* @__PURE__ */ n.jsx(
        "img",
        {
          src: u,
          alt: "",
          decoding: "async",
          loading: "lazy",
          className: "h-5.5 w-5.5 max-h-6 max-w-6 object-contain",
          onLoad: f,
          onError: g
        }
      )
    }
  ) : a ? /* @__PURE__ */ n.jsx(
    "span",
    {
      className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-control bg-background",
      style: { color: i },
      "aria-hidden": !0,
      children: /* @__PURE__ */ n.jsx(a, { className: "h-5 w-5", strokeWidth: 2.25 })
    }
  ) : /* @__PURE__ */ n.jsx(
    "span",
    {
      className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-control bg-background text-[11px] font-bold",
      style: { color: i },
      "aria-hidden": !0,
      children: t
    }
  );
}
function Z(e) {
  var l;
  return ((l = F(e.name, e.webui)) == null ? void 0 : l.displayName) ?? e.display_name;
}
function le(e, l) {
  const s = Z(e);
  return G(l, $(e.name))("displayName", s);
}
function Fe(e, l) {
  const s = `Use nanobot from ${Z(e)}.`;
  return G(l, $(e.name))("description", s);
}
function Ve(e, l) {
  return G(l, $(e.name))("requirements", "Channel credentials and gateway settings");
}
function We(e, l) {
  return l === "on" ? W(e) : l === "off" ? !W(e) : !0;
}
function W(e) {
  return e.runtime_status === "running";
}
function Ge(e) {
  return e.runtime_status === "running" || e.runtime_status === "starting";
}
function Ie(e, l) {
  return e.runtime_status === "failed" ? l("settings.channels.runtimeFailed", "Failed") : e.runtime_status === "starting" ? l("settings.channels.runtimeStarting", "Starting") : W(e) ? l("settings.values.on", "On") : e.enabled ? l("settings.channels.runtimeStopped", "Not running") : l("settings.values.off", "Off");
}
function Ke(e, l) {
  return [
    l ? le(e, l) : void 0,
    Z(e),
    e.display_name,
    e.name,
    e.status,
    l ? Fe(e, l) : void 0,
    l ? Ve(e, l) : void 0
  ].join(" ").toLowerCase();
}
function Ee({
  children: e,
  status: l
}) {
  return /* @__PURE__ */ n.jsx("span", { className: [
    "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium leading-4",
    l === "failed" ? "bg-destructive/10 text-destructive" : l === "running" ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-200" : "bg-muted/75 text-muted-foreground"
  ].join(" "), children: e });
}
function Te({
  message: e,
  className: l = "mt-3"
}) {
  return e ? /* @__PURE__ */ n.jsx("div", { className: `${l} rounded-control border border-destructive/20 bg-destructive/5 px-3 py-2 text-[12px] leading-5 text-destructive`, children: e }) : null;
}
function te({
  feature: e,
  setup: l,
  chatAppsDocsUrl: s,
  compact: t = !1
}) {
  const { t: i } = _(), a = (y, U) => i(y, { defaultValue: U }), o = F(e.name, e.webui), u = h.useMemo(
    () => P(l.docsLogoUrl ?? (o == null ? void 0 : o.logoUrl)),
    [o == null ? void 0 : o.logoUrl, l.docsLogoUrl]
  ), { logoUrl: g, onLogoError: f, onLogoLoad: p } = D(u), x = o == null ? void 0 : o.icon, b = (o == null ? void 0 : o.initials) ?? e.display_name.slice(0, 2).toUpperCase(), v = (o == null ? void 0 : o.color) ?? "#6B7280", j = fe(l.docsUrl, s);
  return j ? /* @__PURE__ */ n.jsxs(
    "a",
    {
      href: j,
      target: "_blank",
      rel: "noreferrer",
      className: w(
        "inline-flex max-w-full items-center gap-2 bg-background/80 font-semibold text-foreground transition-colors hover:bg-background",
        t ? "shrink-0 rounded-full py-1 pl-1 pr-2.5 text-[11.5px]" : "mt-3 rounded-control py-1.5 pl-1.5 pr-3 text-[12px]"
      ),
      children: [
        /* @__PURE__ */ n.jsx(
          "span",
          {
            className: w(
              "grid shrink-0 place-items-center overflow-hidden bg-muted/70 font-bold",
              t ? "h-5 w-5 rounded-full text-[9px]" : "h-6 w-6 rounded-compact text-[10px]"
            ),
            style: { color: v },
            "aria-hidden": !0,
            children: g ? /* @__PURE__ */ n.jsx(
              "img",
              {
                src: g,
                alt: "",
                decoding: "async",
                loading: "lazy",
                className: w("object-contain", t ? "h-3.5 w-3.5" : "h-4 w-4"),
                onLoad: p,
                onError: f
              }
            ) : x ? /* @__PURE__ */ n.jsx(x, { className: t ? "h-3 w-3" : "h-3.5 w-3.5", strokeWidth: 2.25 }) : b
          }
        ),
        /* @__PURE__ */ n.jsx("span", { className: "truncate", children: l.docsLabel ?? a("settings.channels.officialGuide", "Official guide") }),
        /* @__PURE__ */ n.jsx(K, { className: "h-3.5 w-3.5 shrink-0 text-muted-foreground", "aria-hidden": !0 })
      ]
    }
  ) : null;
}
function Ze({
  feature: e,
  setup: l,
  chatAppsDocsUrl: s
}) {
  return /* @__PURE__ */ n.jsxs("div", { className: "mt-3 flex flex-wrap items-center gap-2", children: [
    /* @__PURE__ */ n.jsx(Ae, { feature: e, setup: l }),
    /* @__PURE__ */ n.jsx(te, { feature: e, setup: l, chatAppsDocsUrl: s, compact: !0 })
  ] });
}
function Ae({
  feature: e,
  setup: l
}) {
  const s = F(e.name, e.webui), t = h.useMemo(
    () => P(l.docsLogoUrl ?? (s == null ? void 0 : s.logoUrl)),
    [s == null ? void 0 : s.logoUrl, l.docsLogoUrl]
  ), { logoUrl: i, onLogoError: a, onLogoLoad: o } = D(t), u = s == null ? void 0 : s.icon, g = (s == null ? void 0 : s.initials) ?? e.display_name.slice(0, 2).toUpperCase(), f = (s == null ? void 0 : s.color) ?? "#6B7280", p = l.officialLabel;
  return !l.officialUrl || !p ? null : /* @__PURE__ */ n.jsxs(
    "a",
    {
      href: l.officialUrl,
      target: "_blank",
      rel: "noreferrer",
      className: "inline-flex max-w-full shrink-0 items-center gap-2 rounded-full bg-background/80 py-1 pl-1 pr-2.5 text-[11.5px] font-semibold text-foreground transition-colors hover:bg-background",
      children: [
        /* @__PURE__ */ n.jsx(
          "span",
          {
            className: "grid h-5 w-5 shrink-0 place-items-center overflow-hidden rounded-full bg-muted/70",
            style: { color: f },
            "aria-hidden": !0,
            children: i ? /* @__PURE__ */ n.jsx(
              "img",
              {
                src: i,
                alt: "",
                decoding: "async",
                loading: "lazy",
                className: "h-3.5 w-3.5 object-contain",
                onLoad: o,
                onError: a
              }
            ) : u ? /* @__PURE__ */ n.jsx(u, { className: "h-3 w-3", strokeWidth: 2.25 }) : /* @__PURE__ */ n.jsx("span", { className: "text-[8px] font-bold", children: g })
          }
        ),
        /* @__PURE__ */ n.jsx("span", { className: "truncate", children: p }),
        /* @__PURE__ */ n.jsx(K, { className: "h-3.5 w-3.5 shrink-0 text-muted-foreground", "aria-hidden": !0 })
      ]
    }
  );
}
function He({
  feature: e,
  setup: l,
  onNotice: s
}) {
  var i, a;
  const { t } = _();
  return (i = l.actions) != null && i.length ? /* @__PURE__ */ n.jsxs("div", { className: "mt-3 flex flex-wrap items-center gap-2", children: [
    l.actions.map((o) => /* @__PURE__ */ n.jsxs(
      ne,
      {
        type: "button",
        size: "sm",
        variant: "secondary",
        className: "h-8 rounded-full bg-background/80 px-3 text-[12px] font-semibold hover:bg-background",
        onClick: () => {
          o.copyText && xe(o.copyText).then(
            (u) => s(
              u ? t("settings.channels.helperCopied", {
                name: o.label,
                defaultValue: "{{name}} copied."
              }) : t("settings.channels.helperCopyFailed", {
                name: o.label,
                defaultValue: "Could not copy {{name}}."
              })
            )
          );
        },
        children: [
          o.copyText ? /* @__PURE__ */ n.jsx(Se, { className: "mr-1.5 h-3.5 w-3.5", "aria-hidden": !0 }) : null,
          o.label
        ]
      },
      o.id
    )),
    /* @__PURE__ */ n.jsx("span", { className: "sr-only", children: ((a = F(e.name, e.webui)) == null ? void 0 : a.displayName) ?? e.display_name })
  ] }) : null;
}
function Je({
  presets: e,
  onApply: l
}) {
  const { t: s } = _(), [t, i] = h.useState("");
  return e.length ? /* @__PURE__ */ n.jsxs("div", { className: "mt-3", children: [
    /* @__PURE__ */ n.jsx("div", { className: "mb-1 text-[11px] font-medium text-foreground/85", children: s("settings.channels.providerPreset", { defaultValue: "Provider" }) }),
    /* @__PURE__ */ n.jsx(
      "div",
      {
        role: "radiogroup",
        "aria-label": s("settings.channels.providerPreset", { defaultValue: "Provider" }),
        className: "grid rounded-control bg-muted p-0.5 text-[12px] font-medium text-muted-foreground",
        style: { gridTemplateColumns: `repeat(${e.length}, minmax(0, 1fr))` },
        children: e.map((a) => /* @__PURE__ */ n.jsx(
          "button",
          {
            type: "button",
            role: "radio",
            "aria-checked": t === a.id,
            onClick: () => {
              i(a.id), l(a);
            },
            className: w(
              "min-h-8 rounded-compact px-2 py-1.5 transition-colors hover:text-foreground",
              t === a.id && "bg-background text-foreground"
            ),
            children: a.label
          },
          a.id
        ))
      }
    )
  ] }) : null;
}
function Ye({
  validation: e,
  validating: l,
  feature: s
}) {
  const { t } = _(), i = (e == null ? void 0 : e.status) ?? (s.configured ? "configured" : "needs_setup"), a = l ? t("settings.channels.checking", { defaultValue: "Checking..." }) : Ne(i, t);
  return /* @__PURE__ */ n.jsxs(
    "span",
    {
      className: w(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-medium",
        ae(i)
      ),
      children: [
        l ? /* @__PURE__ */ n.jsx(R, { className: "h-3.5 w-3.5 animate-spin", "aria-hidden": !0 }) : se(i),
        a
      ]
    }
  );
}
function Qe({ validation: e }) {
  var s, t;
  const l = e == null ? void 0 : e.message;
  return !((s = e == null ? void 0 : e.identity) != null && s.name) && !l ? null : /* @__PURE__ */ n.jsx("div", { className: "mt-2 truncate text-[11.5px] text-muted-foreground", children: (t = e == null ? void 0 : e.identity) != null && t.name ? e.identity.workspace ? `${e.identity.name} · ${e.identity.workspace}` : e.identity.name : l });
}
function Xe({ validation: e }) {
  const { t: l } = _();
  return e.checks.length ? /* @__PURE__ */ n.jsxs("div", { children: [
    /* @__PURE__ */ n.jsx("div", { className: "mb-2 text-[12px] font-semibold text-foreground", children: l("settings.channels.connectionChecks") }),
    /* @__PURE__ */ n.jsx("div", { className: "space-y-2", children: e.checks.slice(0, 6).map((s) => /* @__PURE__ */ n.jsxs("div", { className: "flex gap-2 text-[12px] leading-5", children: [
      /* @__PURE__ */ n.jsx("span", { className: w("mt-0.5", ke(s.status)), children: ve(s.status) }),
      /* @__PURE__ */ n.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ n.jsx("div", { className: "font-medium text-foreground/85", children: s.label }),
        s.message ? /* @__PURE__ */ n.jsx("div", { className: "text-muted-foreground", children: s.message }) : null,
        s.action_url ? /* @__PURE__ */ n.jsxs(
          "a",
          {
            href: s.action_url,
            target: "_blank",
            rel: "noreferrer",
            className: "inline-flex items-center gap-1 text-foreground underline decoration-border underline-offset-4",
            children: [
              l("settings.channels.open"),
              /* @__PURE__ */ n.jsx(K, { className: "h-3 w-3", "aria-hidden": !0 })
            ]
          }
        ) : null
      ] })
    ] }, s.id)) })
  ] }) : null;
}
function Be({
  steps: e,
  action: l,
  tryIt: s
}) {
  const { t } = _(), i = (a, o) => t(a, { defaultValue: o });
  return /* @__PURE__ */ n.jsxs("div", { className: "text-[12.5px] leading-5 text-muted-foreground", children: [
    /* @__PURE__ */ n.jsxs("div", { className: "mb-2 flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ n.jsx("div", { className: "text-[12px] font-semibold text-foreground", children: i("settings.channels.setupSteps", "Next steps") }),
      l
    ] }),
    /* @__PURE__ */ n.jsx("ol", { className: "space-y-1.5", children: e.map((a, o) => /* @__PURE__ */ n.jsxs("li", { className: "flex gap-2", children: [
      /* @__PURE__ */ n.jsx("span", { className: "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground", children: o + 1 }),
      /* @__PURE__ */ n.jsx("span", { children: a })
    ] }, a)) }),
    s ? /* @__PURE__ */ n.jsxs("div", { className: "mt-3 rounded-control bg-background/75 px-3 py-2 text-[12px] text-muted-foreground", children: [
      /* @__PURE__ */ n.jsx("span", { className: "font-medium text-foreground", children: i("settings.channels.tryIt", "Try it") }),
      /* @__PURE__ */ n.jsx("span", { className: "ml-2", children: s })
    ] }) : null
  ] });
}
function Me({
  feature: e,
  showBrandLogos: l,
  chatAppsDocsUrl: s,
  instances: t,
  onFeaturesUpdate: i,
  customization: a = {}
}) {
  var H;
  const { client: o } = pe(), { t: u, i18n: g } = _(), f = (c, S) => u(c, { defaultValue: S }), p = le(e, u), x = t ?? e.instances ?? [], [b, v] = h.useState(null), [j, y] = h.useState(null), [U, C] = h.useState(null), d = b ? x.find((c) => c.id === b) : void 0, k = h.useMemo(
    () => _e(e, g.resolvedLanguage ?? g.language),
    [e.name, e.setup, g.language, g.resolvedLanguage]
  ), r = h.useMemo(
    () => Pe(e, k.fields, k.manualFields),
    [e, k.fields, k.manualFields]
  ), [m, L] = h.useState(
    () => M(r, d == null ? void 0 : d.config_values)
  ), [q, A] = h.useState({}), [E, T] = h.useState(!1), V = x.filter((c) => c.configured).length, re = x.filter((c) => c.runtime_status === "running").length, ie = JSON.stringify((d == null ? void 0 : d.config_values) ?? {}), oe = h.useMemo(
    () => new Set((d == null ? void 0 : d.configured_fields) ?? []),
    [d == null ? void 0 : d.configured_fields]
  );
  h.useEffect(() => {
    b && !x.some((c) => c.id === b) && v(null);
  }, [x, b]), h.useEffect(() => {
    L(M(r, d == null ? void 0 : d.config_values)), A({});
  }, [r, d == null ? void 0 : d.id, ie]);
  const ce = async (c, S) => {
    y(c.id), C(null);
    try {
      const I = S ? await be(o, e.name, { instanceId: c.id }) : await je(o, e.name, { instanceId: c.id });
      i(I);
    } catch (I) {
      C(I.message);
    } finally {
      y(null);
    }
  }, de = async () => {
    if (d) {
      T(!0), C(null);
      try {
        const c = await ye(
          o,
          e.name,
          Le(r, m),
          { enable: d.enabled, instanceId: d.id }
        );
        c.nanobot_features && i(c.nanobot_features), C(f("settings.channels.savedSettings", "Saved settings."));
      } catch (c) {
        C(c.message);
      } finally {
        T(!1);
      }
    }
  };
  return /* @__PURE__ */ n.jsxs("aside", { className: "min-h-full rounded-panel bg-settings-surface p-5", children: [
    /* @__PURE__ */ n.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
      /* @__PURE__ */ n.jsxs("div", { className: "flex min-w-0 items-start gap-3", children: [
        /* @__PURE__ */ n.jsx(Ue, { feature: e, showBrandLogos: l }),
        /* @__PURE__ */ n.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ n.jsx("h3", { className: "truncate text-[18px] font-semibold leading-6 text-foreground", children: p }),
          /* @__PURE__ */ n.jsx("p", { className: "mt-1 text-[13px] leading-5 text-muted-foreground", children: ((H = a.countLabel) == null ? void 0 : H.call(a, re)) ?? u("settings.channels.configuredInstances", {
            count: V,
            defaultValue: `${V} instances configured`
          }) })
        ] })
      ] }),
      /* @__PURE__ */ n.jsx("div", { className: "flex shrink-0 items-center gap-2", children: /* @__PURE__ */ n.jsx(Ee, { status: e.runtime_status, children: Ie(e, f) }) })
    ] }),
    /* @__PURE__ */ n.jsx(Te, { message: e.runtime_error }),
    /* @__PURE__ */ n.jsx("div", { className: "mt-5 space-y-3", children: x.map((c) => {
      var I, J, Y;
      const S = (d == null ? void 0 : d.id) === c.id;
      return /* @__PURE__ */ n.jsxs(
        "article",
        {
          className: w(
            "overflow-hidden rounded-floating transition-colors",
            S ? "bg-background" : "bg-background/70 hover:bg-muted"
          ),
          children: [
            /* @__PURE__ */ n.jsxs("div", { className: "flex items-center gap-3 px-3 py-3", children: [
              /* @__PURE__ */ n.jsxs(
                "button",
                {
                  type: "button",
                  className: "flex min-w-0 flex-1 items-center gap-3 text-left",
                  onClick: () => v((N) => N === c.id ? null : c.id),
                  "aria-expanded": S,
                  children: [
                    /* @__PURE__ */ n.jsx(
                      $e,
                      {
                        feature: e,
                        instance: c,
                        showBrandLogos: l
                      }
                    ),
                    /* @__PURE__ */ n.jsx("span", { className: "min-w-0 flex-1 truncate text-[13px] font-semibold text-foreground", children: z(c) }),
                    /* @__PURE__ */ n.jsx(
                      X,
                      {
                        className: w(
                          "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                          S && "rotate-180"
                        ),
                        "aria-hidden": !0
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ n.jsxs("div", { className: "flex shrink-0 items-center gap-2", children: [
                j === c.id ? /* @__PURE__ */ n.jsx(R, { className: "h-3.5 w-3.5 animate-spin text-muted-foreground", "aria-hidden": !0 }) : null,
                /* @__PURE__ */ n.jsx(
                  we,
                  {
                    checked: ee(c),
                    disabled: j === c.id || !c.configured,
                    ariaLabel: ((I = a.toggleAriaLabel) == null ? void 0 : I.call(a, c)) ?? u("settings.channels.toggleInstance", {
                      name: z(c),
                      defaultValue: "{{name}} instance"
                    }),
                    label: ee(c) ? f("settings.values.on", "On") : f("settings.values.off", "Off"),
                    onChange: (N) => void ce(c, N)
                  }
                )
              ] })
            ] }),
            S ? /* @__PURE__ */ n.jsxs("div", { className: "space-y-5 px-4 pb-4", children: [
              /* @__PURE__ */ n.jsxs("section", { className: "pt-4", children: [
                /* @__PURE__ */ n.jsxs("div", { className: "mb-3 flex items-start justify-between gap-3", children: [
                  /* @__PURE__ */ n.jsx("p", { className: "min-w-0 flex-1 truncate font-mono text-[11.5px] leading-6 text-muted-foreground", children: ((J = a.renderInstanceSummary) == null ? void 0 : J.call(a, c)) ?? c.id }),
                  /* @__PURE__ */ n.jsx(
                    Oe,
                    {
                      instance: c,
                      configuredLabel: a.configuredLabel,
                      needsSetupLabel: a.needsSetupLabel
                    }
                  )
                ] }),
                (Y = a.renderInstanceAction) == null ? void 0 : Y.call(a, c)
              ] }),
              /* @__PURE__ */ n.jsx(
                Be,
                {
                  steps: k.steps,
                  action: /* @__PURE__ */ n.jsx(
                    te,
                    {
                      feature: e,
                      setup: k,
                      chatAppsDocsUrl: s,
                      compact: !0
                    }
                  )
                }
              ),
              r.length ? /* @__PURE__ */ n.jsxs("details", { className: "group text-[12px] leading-5 text-muted-foreground", children: [
                /* @__PURE__ */ n.jsx("summary", { className: "cursor-pointer list-none text-[12px] font-semibold text-foreground", children: /* @__PURE__ */ n.jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
                  f("settings.channels.advanced", "Advanced"),
                  /* @__PURE__ */ n.jsx(
                    X,
                    {
                      className: "h-3.5 w-3.5 transition-transform group-open:rotate-180",
                      "aria-hidden": !0
                    }
                  )
                ] }) }),
                /* @__PURE__ */ n.jsxs(
                  "form",
                  {
                    className: "mt-3",
                    onSubmit: (N) => {
                      N.preventDefault(), de();
                    },
                    children: [
                      /* @__PURE__ */ n.jsx(
                        Ce,
                        {
                          fields: r,
                          values: m,
                          configuredFields: oe,
                          visibleSecrets: q,
                          onChange: (N, B) => L((ue) => ({ ...ue, [N]: B })),
                          onToggleSecret: (N) => A((B) => ({ ...B, [N]: !B[N] })),
                          compact: !0
                        }
                      ),
                      /* @__PURE__ */ n.jsx("div", { className: "mt-3 flex justify-end", children: /* @__PURE__ */ n.jsxs(
                        ne,
                        {
                          type: "submit",
                          size: "sm",
                          variant: "secondary",
                          className: "h-8 rounded-full bg-muted/70 px-3 text-[12px] font-semibold hover:bg-muted",
                          disabled: E,
                          children: [
                            E ? /* @__PURE__ */ n.jsx(R, { className: "mr-1.5 h-3.5 w-3.5 animate-spin", "aria-hidden": !0 }) : null,
                            f("settings.channels.saveSettings", "Save settings")
                          ]
                        }
                      ) })
                    ]
                  }
                )
              ] }) : null
            ] }) : null
          ]
        },
        c.id
      );
    }) }),
    a.footer,
    U ? /* @__PURE__ */ n.jsx("div", { className: "mt-3 rounded-control border border-destructive/20 px-3 py-2 text-[12px] leading-5 text-destructive", children: U }) : null
  ] });
}
function z(e) {
  var t, i;
  const l = (t = e.display_name) == null ? void 0 : t.trim();
  if (l) return l;
  const s = (i = e.name) == null ? void 0 : i.trim();
  return s || e.id;
}
function ee(e) {
  return e.runtime_status === "running" || e.runtime_status === "starting";
}
function Oe({
  instance: e,
  configuredLabel: l,
  needsSetupLabel: s
}) {
  const { t } = _();
  let i = e.configured ? "configured" : "needs_setup", a = e.configured ? t("settings.channels.instanceConfigured", { defaultValue: "Configured" }) : s ?? t("settings.channels.instanceNeedsSetup", { defaultValue: "Needs setup" });
  return e.runtime_status === "failed" ? (i = "invalid", a = t("settings.channels.runtimeFailed", { defaultValue: "Failed" })) : e.runtime_status === "starting" ? a = t("settings.channels.runtimeStarting", { defaultValue: "Starting" }) : e.enabled && e.runtime_status !== "running" ? a = t("settings.channels.runtimeStopped", { defaultValue: "Not running" }) : e.runtime_status === "running" && (i = "connected", a = l ?? t("settings.channels.validation.connected", { defaultValue: "Connected" })), /* @__PURE__ */ n.jsxs(
    "span",
    {
      className: w(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-medium",
        ae(i)
      ),
      children: [
        se(i),
        a
      ]
    }
  );
}
function $e({
  feature: e,
  instance: l,
  showBrandLogos: s
}) {
  var y;
  const t = F(e.name, e.webui), [i, a] = h.useState(!1), o = h.useMemo(() => P(t == null ? void 0 : t.logoUrl), [t == null ? void 0 : t.logoUrl]), { logoUrl: u, onLogoError: g, onLogoLoad: f } = D(o), p = i ? "" : (y = l.avatar_url) == null ? void 0 : y.trim(), x = p || (s ? u : ""), b = t == null ? void 0 : t.icon, v = (t == null ? void 0 : t.initials) ?? e.display_name.slice(0, 2).toUpperCase(), j = (t == null ? void 0 : t.color) ?? "#3370FF";
  return h.useEffect(() => {
    a(!1);
  }, [l.avatar_url]), /* @__PURE__ */ n.jsx(
    "span",
    {
      className: "grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full bg-background text-[10px] font-bold",
      style: { color: j },
      "aria-hidden": !0,
      children: p ? /* @__PURE__ */ n.jsx(
        "img",
        {
          src: p,
          alt: "",
          decoding: "async",
          loading: "lazy",
          className: "h-full w-full object-cover",
          onError: () => a(!0)
        }
      ) : x ? /* @__PURE__ */ n.jsx(
        "img",
        {
          src: x,
          alt: "",
          decoding: "async",
          loading: "lazy",
          className: "h-6 w-6 object-contain",
          onLoad: f,
          onError: g
        }
      ) : b ? /* @__PURE__ */ n.jsx(b, { className: "h-5 w-5", strokeWidth: 2.25 }) : v
    }
  );
}
function Pe(e, l, s) {
  const t = new Map(
    [...l ?? [], ...s ?? []].map((i) => [i.key, i])
  );
  return e.setup ? e.setup.fields.flatMap((i) => {
    const a = t.get(i.key);
    return a ? [a] : [];
  }) : [...t.values()];
}
export {
  Me as C,
  Se as a,
  Ue as b,
  Fe as c,
  Ee as d,
  Ie as e,
  Ge as f,
  _e as g,
  Te as h,
  Ve as i,
  Ye as j,
  Qe as k,
  le as l,
  Ze as m,
  He as n,
  Je as o,
  Be as p,
  Xe as q,
  Ke as r,
  We as s,
  W as t
};
