import { r as l, j as a } from "./react-vendor-ASUsaCHq.js";
import { R as x, u as g, P as u, C as i, b as N, X as y, c as t, m as j, e as n, D as r, O as d, g as D } from "./hosted-entry-FxMcpATj.js";
const P = x, h = u, c = l.forwardRef(({ className: e, ...s }, o) => /* @__PURE__ */ a.jsx(
  d,
  {
    ref: o,
    className: t(
      D,
      e
    ),
    ...s
  }
));
c.displayName = d.displayName;
const v = l.forwardRef(({ className: e, children: s, showCloseButton: o = !0, ...m }, f) => {
  const { t: p } = g();
  return /* @__PURE__ */ a.jsxs(h, { children: [
    /* @__PURE__ */ a.jsx(c, {}),
    /* @__PURE__ */ a.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", children: /* @__PURE__ */ a.jsxs(
      i,
      {
        ref: f,
        className: t(
          j,
          "grid w-full max-w-lg origin-center gap-4 rounded-modal p-6 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          e
        ),
        ...m,
        children: [
          s,
          o ? /* @__PURE__ */ a.jsxs(N, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none", children: [
            /* @__PURE__ */ a.jsx(y, { className: "h-4 w-4" }),
            /* @__PURE__ */ a.jsx("span", { className: "sr-only", children: p("common.close") })
          ] }) : null
        ]
      }
    ) })
  ] });
});
v.displayName = i.displayName;
const w = ({
  className: e,
  ...s
}) => /* @__PURE__ */ a.jsx(
  "div",
  {
    className: t(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      e
    ),
    ...s
  }
);
w.displayName = "DialogHeader";
const R = ({
  className: e,
  ...s
}) => /* @__PURE__ */ a.jsx(
  "div",
  {
    className: t(
      "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
      e
    ),
    ...s
  }
);
R.displayName = "DialogFooter";
const b = l.forwardRef(({ className: e, ...s }, o) => /* @__PURE__ */ a.jsx(
  n,
  {
    ref: o,
    className: t(
      "text-lg font-semibold leading-none tracking-tight",
      e
    ),
    ...s
  }
));
b.displayName = n.displayName;
const C = l.forwardRef(({ className: e, ...s }, o) => /* @__PURE__ */ a.jsx(
  r,
  {
    ref: o,
    className: t("text-sm text-muted-foreground", e),
    ...s
  }
));
C.displayName = r.displayName;
export {
  P as D,
  v as a,
  b,
  C as c,
  w as d,
  R as e
};
