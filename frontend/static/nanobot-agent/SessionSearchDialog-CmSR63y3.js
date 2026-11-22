import { r as l, j as t } from "./react-vendor-ASUsaCHq.js";
import { D as B, a as I, b as K, c as Q } from "./dialog-DZyL4ZE5.js";
import { u as V, S as q, d as z, v as S, c as C } from "./hosted-entry-Cdi4J4JT.js";
function G({
  open: n,
  sessions: o,
  activeKey: f,
  loading: x,
  titleOverrides: u = {},
  onOpenChange: g,
  onSelect: E
}) {
  const { t: s } = V(), w = l.useRef(null), d = l.useRef([]), [b, y] = l.useState(""), [m, i] = l.useState(0), c = b.trim().toLowerCase(), h = l.useMemo(() => {
    if (!n) return [];
    if (!c) return o;
    const e = c.split(/\s+/).filter(Boolean);
    return o.filter(
      (r) => H(r, e, u[r.key])
    );
  }, [c, n, o, u]), a = h.length;
  l.useEffect(() => {
    n && (y(""), i(0), window.setTimeout(() => {
      var e;
      return (e = w.current) == null ? void 0 : e.focus();
    }, 0));
  }, [n]), l.useEffect(() => {
    i(0);
  }, [c]), l.useEffect(() => {
    i(
      (e) => a === 0 ? 0 : Math.min(e, a - 1)
    );
  }, [a]), l.useEffect(() => {
    d.current = d.current.slice(0, a);
  }, [a]), l.useEffect(() => {
    var e;
    n && ((e = d.current[m]) == null || e.scrollIntoView({
      block: "nearest",
      inline: "nearest"
    }));
  }, [m, n]);
  const j = (e) => {
    g(!1), E(e);
  }, R = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault(), i(
        (r) => a === 0 ? 0 : (r + 1) % a
      );
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault(), i(
        (r) => a === 0 ? 0 : (r - 1 + a) % a
      );
      return;
    }
    if (e.key === "Enter") {
      const r = h[m];
      if (!r) return;
      e.preventDefault(), j(r.key);
    }
  }, L = s(c ? "sidebar.noSearchResults" : "chat.noSessions"), T = s(c ? "sidebar.searchResults" : "sidebar.recent");
  return n ? /* @__PURE__ */ t.jsx(B, { open: n, onOpenChange: g, children: /* @__PURE__ */ t.jsxs(
    I,
    {
      showCloseButton: !1,
      className: C(
        "flex max-h-[min(40rem,calc(100vh-2rem))] w-[calc(100vw-2rem)] max-w-[42rem] flex-col gap-0 overflow-hidden p-0"
      ),
      children: [
        /* @__PURE__ */ t.jsx(K, { className: "sr-only", children: s("sidebar.searchAria") }),
        /* @__PURE__ */ t.jsx(Q, { className: "sr-only", children: s("sidebar.searchPlaceholder") }),
        /* @__PURE__ */ t.jsxs("div", { className: "flex h-[62px] shrink-0 items-center gap-3 border-b border-border px-[18px]", children: [
          /* @__PURE__ */ t.jsx(
            q,
            {
              className: "h-[18px] w-[18px] shrink-0 text-muted-foreground",
              "aria-hidden": !0
            }
          ),
          /* @__PURE__ */ t.jsx(
            "input",
            {
              ref: w,
              value: b,
              onChange: (e) => y(e.target.value),
              onKeyDown: R,
              placeholder: s("sidebar.searchPlaceholder"),
              "aria-label": s("sidebar.searchAria"),
              className: "h-full min-w-0 flex-1 bg-transparent text-[19px] font-normal leading-none text-foreground outline-none placeholder:text-muted-foreground"
            }
          )
        ] }),
        /* @__PURE__ */ t.jsx(
          "div",
          {
            "data-testid": "session-search-scroll",
            className: "min-h-0 flex-1 overflow-y-auto overscroll-contain p-2.5 scrollbar-thin scrollbar-track-transparent",
            children: /* @__PURE__ */ t.jsxs("section", { children: [
              /* @__PURE__ */ t.jsx("div", { className: "px-2.5 pb-1.5 pt-1 text-[12px] font-medium text-muted-foreground", children: T }),
              x && o.length === 0 ? /* @__PURE__ */ t.jsx("div", { className: "px-3 py-7 text-[13px] text-muted-foreground", children: s("chat.loading") }) : h.length === 0 ? /* @__PURE__ */ t.jsx("div", { className: "px-3 py-7 text-[13px] text-muted-foreground", children: L }) : /* @__PURE__ */ t.jsx("ul", { className: "space-y-0.5", children: h.map((e, r) => {
                var N, D;
                const v = ((N = u[e.key]) == null ? void 0 : N.trim()) || ((D = e.title) == null ? void 0 : D.trim()) || z(e.preview, s("chat.newChat")), p = S(e.preview), A = p.length > 0 && p.toLowerCase() !== v.trim().toLowerCase(), M = r === m, k = e.key === f;
                return /* @__PURE__ */ t.jsx("li", { children: /* @__PURE__ */ t.jsxs(
                  "button",
                  {
                    ref: (P) => {
                      d.current[r] = P;
                    },
                    type: "button",
                    onClick: () => j(e.key),
                    onMouseEnter: () => i(r),
                    "aria-current": k ? "page" : void 0,
                    className: C(
                      "grid min-h-[54px] w-full min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-control px-3 py-2 text-left transition-colors",
                      M ? "bg-muted text-foreground" : "text-foreground hover:bg-muted"
                    ),
                    children: [
                      /* @__PURE__ */ t.jsxs("span", { className: "min-w-0 flex-1", children: [
                        /* @__PURE__ */ t.jsx("span", { className: "block truncate text-[14px] font-medium leading-5", children: v }),
                        A ? /* @__PURE__ */ t.jsx(
                          "span",
                          {
                            className: "block truncate text-[12px] leading-4 text-muted-foreground",
                            children: p
                          }
                        ) : null
                      ] }),
                      k ? /* @__PURE__ */ t.jsx("span", { className: "shrink-0 rounded-full bg-muted-foreground/10 px-2 py-0.5 text-[11px] font-medium text-muted-foreground", children: s("common.current", { defaultValue: "Current" }) }) : null
                    ]
                  }
                ) }, e.key);
              }) })
            ] })
          }
        )
      ]
    }
  ) }) : null;
}
function H(n, o, f) {
  const x = [
    f,
    n.title,
    S(n.preview)
  ].filter(Boolean).join(" ").toLowerCase();
  return o.every((u) => x.includes(u));
}
export {
  G as SessionSearchDialog
};
