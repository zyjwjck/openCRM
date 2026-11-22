import { j as n } from "./react-vendor-ASUsaCHq.js";
import { c as m, u as S, I as V, z as T, A as F, o as N, X as w, F as p } from "./hosted-entry-Co83LjLZ.js";
function E({
  checked: e,
  disabled: a,
  onChange: r,
  ariaLabel: s,
  label: o
}) {
  return /* @__PURE__ */ n.jsxs(
    "button",
    {
      type: "button",
      role: "switch",
      "aria-checked": e,
      "aria-label": s ?? o,
      disabled: a,
      onClick: () => {
        a || r(!e);
      },
      className: m(
        "relative inline-flex h-[22px] w-[38px] shrink-0 items-center rounded-full p-[2px]",
        "transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        e ? "bg-[#2997FF]" : "bg-muted-foreground/20 hover:bg-muted-foreground/25",
        a && "cursor-default opacity-60",
        a && e && "hover:bg-[#2997FF]",
        a && !e && "hover:bg-muted-foreground/20"
      ),
      children: [
        /* @__PURE__ */ n.jsx(
          "span",
          {
            "aria-hidden": !0,
            className: m(
              "h-[18px] w-[18px] rounded-full bg-background",
              "transition-transform duration-200 ease-out",
              e ? "translate-x-[16px]" : "translate-x-0"
            )
          }
        ),
        /* @__PURE__ */ n.jsx("span", { className: "sr-only", children: o })
      ]
    }
  );
}
function x(e, a) {
  var r, s;
  return a[e.key] ?? e.defaultValue ?? ((s = (r = e.options) == null ? void 0 : r[0]) == null ? void 0 : s.value) ?? "";
}
function O(e, a = void 0) {
  return Object.fromEntries(
    e.map((r) => {
      var s, o;
      return [
        r.key,
        (a == null ? void 0 : a[r.key]) ?? r.defaultValue ?? ((o = (s = r.options) == null ? void 0 : s[0]) == null ? void 0 : o.value) ?? ""
      ];
    })
  );
}
function A(e, a) {
  const r = {};
  for (const s of e) {
    const o = x(s, a);
    s.secret && !o.trim() || (r[s.key] = o);
  }
  return r;
}
function M(e, a, r) {
  var o;
  const s = {};
  for (const l of e) {
    const i = r.has(l.key), c = x(l, a);
    l.secret && !c.trim() || !i && !c.trim() || !i && ((o = l.options) != null && o.length) || (s[l.key] = c);
  }
  return s;
}
function $(e, a) {
  const r = {
    connected: "Connected",
    configured: "Configured manually",
    needs_setup: "Needs setup",
    invalid: "Invalid",
    unsupported: "Manual setup"
  };
  return a(`settings.channels.validation.${e}`, {
    defaultValue: r[e] ?? "Checked"
  });
}
function z(e) {
  return e === "connected" ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-200" : e === "configured" ? "bg-blue-500/10 text-blue-700 dark:text-blue-200" : e === "invalid" ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground";
}
function H(e) {
  return e === "connected" || e === "configured" ? /* @__PURE__ */ n.jsx(N, { className: "h-3.5 w-3.5", "aria-hidden": !0 }) : e === "invalid" ? /* @__PURE__ */ n.jsx(w, { className: "h-3.5 w-3.5", "aria-hidden": !0 }) : /* @__PURE__ */ n.jsx(p, { className: "h-3.5 w-3.5", "aria-hidden": !0 });
}
function L(e) {
  return e === "pass" ? /* @__PURE__ */ n.jsx(N, { className: "h-3.5 w-3.5", "aria-hidden": !0 }) : e === "fail" ? /* @__PURE__ */ n.jsx(w, { className: "h-3.5 w-3.5", "aria-hidden": !0 }) : e === "warn" ? /* @__PURE__ */ n.jsx(p, { className: "h-3.5 w-3.5", "aria-hidden": !0 }) : /* @__PURE__ */ n.jsx(p, { className: "h-3.5 w-3.5", "aria-hidden": !0 });
}
function P(e) {
  return e === "pass" ? "text-emerald-600" : e === "fail" ? "text-destructive" : e === "warn" ? "text-amber-600" : "text-muted-foreground";
}
function R({
  fields: e,
  values: a,
  configuredFields: r,
  visibleSecrets: s,
  onChange: o,
  onToggleSecret: l,
  compact: i = !1
}) {
  const { t: c } = S(), d = (t, h) => c(t, { defaultValue: h });
  return /* @__PURE__ */ n.jsx("div", { className: m(i ? "space-y-2.5" : "mt-3 space-y-2.5"), children: e.map((t) => {
    var k;
    const h = !!s[t.key], g = a[t.key] ?? "", b = !!(t.secret && (r != null && r.has(t.key)) && !g.trim()), f = !!(t.secret && g.trim()), C = t.secret && !h ? "password" : t.inputType ?? "text", v = x(t, a), y = /* @__PURE__ */ n.jsxs("span", { className: "flex items-center justify-between gap-2 text-[11px] font-medium text-foreground/85", children: [
      /* @__PURE__ */ n.jsx("span", { children: t.label }),
      b ? /* @__PURE__ */ n.jsx("span", { className: "font-normal text-muted-foreground", children: d("settings.channels.savedSecret", "Saved") }) : t.optional && !i ? /* @__PURE__ */ n.jsx("span", { className: "font-normal text-muted-foreground", children: d("settings.channels.optional", "Optional") }) : null
    ] }), j = t.help ? /* @__PURE__ */ n.jsx("span", { className: "mt-1 block text-[11px] leading-4 text-muted-foreground", children: t.help }) : null;
    return (k = t.options) != null && k.length ? /* @__PURE__ */ n.jsxs("div", { className: "block", children: [
      y,
      /* @__PURE__ */ n.jsx(
        "span",
        {
          role: "radiogroup",
          "aria-label": t.label,
          className: "mt-1 grid rounded-control bg-muted p-0.5 text-[12px] font-medium text-muted-foreground",
          style: { gridTemplateColumns: `repeat(${t.options.length}, minmax(0, 1fr))` },
          children: t.options.map((u) => /* @__PURE__ */ n.jsx(
            "button",
            {
              type: "button",
              role: "radio",
              "aria-checked": v === u.value,
              onClick: () => o(t.key, u.value),
              className: m(
                "min-h-8 rounded-compact px-2 py-1.5 transition-colors hover:text-foreground",
                v === u.value && "bg-background text-foreground ring-1 ring-inset ring-border/45"
              ),
              children: u.label
            },
            u.value
          ))
        }
      ),
      j
    ] }, t.key) : /* @__PURE__ */ n.jsxs("label", { className: "block", children: [
      y,
      /* @__PURE__ */ n.jsxs("span", { className: "relative mt-1 block", children: [
        /* @__PURE__ */ n.jsx(
          V,
          {
            "aria-label": t.label,
            type: C,
            autoComplete: t.secret ? "off" : void 0,
            inputMode: t.inputType === "number" ? "numeric" : void 0,
            placeholder: b ? d("settings.channels.savedSecretPlaceholder", "Saved secret") : t.placeholder,
            value: a[t.key] ?? "",
            onChange: (u) => o(t.key, u.target.value),
            className: m(
              "h-9 rounded-control border-border/60 bg-muted/35 text-[13px]",
              f && "pr-9"
            )
          }
        ),
        f ? /* @__PURE__ */ n.jsx(
          "button",
          {
            type: "button",
            "aria-label": h ? d("settings.channels.hideSecret", "Hide secret") : d("settings.channels.showSecret", "Show secret"),
            onClick: () => l(t.key),
            className: "absolute right-2 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:bg-background hover:text-foreground",
            children: h ? /* @__PURE__ */ n.jsx(T, { className: "h-3.5 w-3.5", "aria-hidden": !0 }) : /* @__PURE__ */ n.jsx(F, { className: "h-3.5 w-3.5", "aria-hidden": !0 })
          }
        ) : null
      ] }),
      j
    ] }, t.key);
  }) });
}
export {
  R as C,
  E as T,
  $ as a,
  H as b,
  A as c,
  O as d,
  z as e,
  L as f,
  P as g,
  M as h
};
