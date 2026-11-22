import { j as o, r as s } from "./react-vendor-ASUsaCHq.js";
import { R as H, H as u, P as z, J as A, K as G, C as B, M as V, e as W, D as Y, b as D, O as q, N as J, Q as K, c as n, m as Q, U as v, g as U } from "./hosted-entry-Co83LjLZ.js";
var k = Symbol("radix.slottable");
// @__NO_SIDE_EFFECTS__
function X(a) {
  const e = ({ children: t }) => /* @__PURE__ */ o.jsx(o.Fragment, { children: t });
  return e.displayName = `${a}.Slottable`, e.__radixId = k, e;
}
var N = "AlertDialog", [Z] = J(N, [
  u
]), i = u(), x = (a) => {
  const { __scopeAlertDialog: e, ...t } = a, r = i(e);
  return /* @__PURE__ */ o.jsx(H, { ...r, ...t, modal: !0 });
};
x.displayName = N;
var ee = "AlertDialogTrigger", ae = s.forwardRef(
  (a, e) => {
    const { __scopeAlertDialog: t, ...r } = a, l = i(t);
    return /* @__PURE__ */ o.jsx(K, { ...l, ...r, ref: e });
  }
);
ae.displayName = ee;
var te = "AlertDialogPortal", y = (a) => {
  const { __scopeAlertDialog: e, ...t } = a, r = i(e);
  return /* @__PURE__ */ o.jsx(z, { ...r, ...t });
};
y.displayName = te;
var oe = "AlertDialogOverlay", R = s.forwardRef(
  (a, e) => {
    const { __scopeAlertDialog: t, ...r } = a, l = i(t);
    return /* @__PURE__ */ o.jsx(q, { ...l, ...r, ref: e });
  }
);
R.displayName = oe;
var c = "AlertDialogContent", [re, se] = Z(c), le = /* @__PURE__ */ X("AlertDialogContent"), _ = s.forwardRef(
  (a, e) => {
    const { __scopeAlertDialog: t, children: r, ...l } = a, g = i(t), p = s.useRef(null), L = A(e, p), m = s.useRef(null);
    return /* @__PURE__ */ o.jsx(
      G,
      {
        contentName: c,
        titleName: j,
        docsSlug: "alert-dialog",
        children: /* @__PURE__ */ o.jsx(re, { scope: t, cancelRef: m, children: /* @__PURE__ */ o.jsxs(
          B,
          {
            role: "alertdialog",
            ...g,
            ...l,
            ref: L,
            onOpenAutoFocus: V(l.onOpenAutoFocus, (d) => {
              var f;
              d.preventDefault(), (f = m.current) == null || f.focus({ preventScroll: !0 });
            }),
            onPointerDownOutside: (d) => d.preventDefault(),
            onInteractOutside: (d) => d.preventDefault(),
            children: [
              /* @__PURE__ */ o.jsx(le, { children: r }),
              /* @__PURE__ */ o.jsx(ne, { contentRef: p })
            ]
          }
        ) })
      }
    );
  }
);
_.displayName = c;
var j = "AlertDialogTitle", C = s.forwardRef(
  (a, e) => {
    const { __scopeAlertDialog: t, ...r } = a, l = i(t);
    return /* @__PURE__ */ o.jsx(W, { ...l, ...r, ref: e });
  }
);
C.displayName = j;
var E = "AlertDialogDescription", S = s.forwardRef((a, e) => {
  const { __scopeAlertDialog: t, ...r } = a, l = i(t);
  return /* @__PURE__ */ o.jsx(Y, { ...l, ...r, ref: e });
});
S.displayName = E;
var ie = "AlertDialogAction", b = s.forwardRef(
  (a, e) => {
    const { __scopeAlertDialog: t, ...r } = a, l = i(t);
    return /* @__PURE__ */ o.jsx(D, { ...l, ...r, ref: e });
  }
);
b.displayName = ie;
var h = "AlertDialogCancel", w = s.forwardRef(
  (a, e) => {
    const { __scopeAlertDialog: t, ...r } = a, { cancelRef: l } = se(h, t), g = i(t), p = A(e, l);
    return /* @__PURE__ */ o.jsx(D, { ...g, ...r, ref: p });
  }
);
w.displayName = h;
var ne = ({ contentRef: a }) => {
  const e = `\`${c}\` requires a description for the component to be accessible for screen reader users.

You can add a description to the \`${c}\` by passing a \`${E}\` component as a child, which also benefits sighted users by adding visible context to the dialog.

Alternatively, you can use your own component as a description by assigning it an \`id\` and passing the same value to the \`aria-describedby\` prop in \`${c}\`. If the description is confusing or duplicative for sighted users, you can use the \`@radix-ui/react-visually-hidden\` primitive as a wrapper around your description component.

For more information, see https://radix-ui.com/primitives/docs/components/alert-dialog`;
  return s.useEffect(() => {
    var r;
    document.getElementById(
      (r = a.current) == null ? void 0 : r.getAttribute("aria-describedby")
    ) || console.warn(e);
  }, [e, a]), null;
}, ce = x, de = y, P = R, T = _, O = b, $ = w, I = C, M = S;
const ye = ce, pe = de, F = s.forwardRef(({ className: a, ...e }, t) => /* @__PURE__ */ o.jsx(
  P,
  {
    ref: t,
    className: n(
      U,
      a
    ),
    ...e
  }
));
F.displayName = P.displayName;
const ge = s.forwardRef(({ className: a, ...e }, t) => /* @__PURE__ */ o.jsxs(pe, { children: [
  /* @__PURE__ */ o.jsx(F, {}),
  /* @__PURE__ */ o.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", children: /* @__PURE__ */ o.jsx(
    T,
    {
      ref: t,
      className: n(
        Q,
        "grid w-full max-w-lg origin-center gap-4 rounded-modal p-6 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        a
      ),
      ...e
    }
  ) })
] }));
ge.displayName = T.displayName;
const me = ({
  className: a,
  ...e
}) => /* @__PURE__ */ o.jsx(
  "div",
  {
    className: n("flex flex-col space-y-2 text-center sm:text-left", a),
    ...e
  }
);
me.displayName = "AlertDialogHeader";
const fe = ({
  className: a,
  ...e
}) => /* @__PURE__ */ o.jsx(
  "div",
  {
    className: n(
      "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
      a
    ),
    ...e
  }
);
fe.displayName = "AlertDialogFooter";
const ue = s.forwardRef(({ className: a, ...e }, t) => /* @__PURE__ */ o.jsx(
  I,
  {
    ref: t,
    className: n("text-lg font-semibold", a),
    ...e
  }
));
ue.displayName = I.displayName;
const Ae = s.forwardRef(({ className: a, ...e }, t) => /* @__PURE__ */ o.jsx(
  M,
  {
    ref: t,
    className: n("text-sm text-muted-foreground", a),
    ...e
  }
));
Ae.displayName = M.displayName;
const De = s.forwardRef(({ className: a, ...e }, t) => /* @__PURE__ */ o.jsx(
  O,
  {
    ref: t,
    className: n(v(), a),
    ...e
  }
));
De.displayName = O.displayName;
const ve = s.forwardRef(({ className: a, ...e }, t) => /* @__PURE__ */ o.jsx(
  $,
  {
    ref: t,
    className: n(
      v({ variant: "outline" }),
      "mt-2 sm:mt-0",
      a
    ),
    ...e
  }
));
ve.displayName = $.displayName;
export {
  ye as A,
  ge as a,
  me as b,
  ue as c,
  Ae as d,
  fe as e,
  ve as f,
  De as g
};
