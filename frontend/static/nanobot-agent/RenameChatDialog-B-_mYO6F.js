import { r as c, j as e } from "./react-vendor-ASUsaCHq.js";
import { u as f, I as g, B as m } from "./hosted-entry-FxMcpATj.js";
import { D as p, a as j, d as D, b, c as v, e as C } from "./dialog-CdDCfACA.js";
function S({
  open: s,
  title: r,
  dialogTitle: u,
  description: h,
  placeholder: d,
  onCancel: i,
  onConfirm: x
}) {
  const { t: a } = f(), [o, l] = c.useState(r);
  c.useEffect(() => {
    s && l(r);
  }, [s, r]);
  const n = o.trim();
  return /* @__PURE__ */ e.jsx(p, { open: s, onOpenChange: (t) => {
    t || i();
  }, children: /* @__PURE__ */ e.jsx(j, { className: "max-w-sm", children: /* @__PURE__ */ e.jsxs(
    "form",
    {
      className: "grid gap-4",
      onSubmit: (t) => {
        t.preventDefault(), n && x(n);
      },
      children: [
        /* @__PURE__ */ e.jsxs(D, { className: "text-left", children: [
          /* @__PURE__ */ e.jsx(b, { children: u ?? a("chat.renameTitle") }),
          /* @__PURE__ */ e.jsx(v, { children: h ?? a("chat.renameDescription") })
        ] }),
        /* @__PURE__ */ e.jsx(
          g,
          {
            value: o,
            onChange: (t) => l(t.target.value),
            placeholder: d ?? a("chat.renamePlaceholder"),
            autoFocus: !0,
            maxLength: 160
          }
        ),
        /* @__PURE__ */ e.jsxs(C, { children: [
          /* @__PURE__ */ e.jsx(
            m,
            {
              className: "min-w-20",
              type: "button",
              variant: "outline",
              onClick: i,
              children: a("deleteConfirm.cancel")
            }
          ),
          /* @__PURE__ */ e.jsx(m, { className: "min-w-20", type: "submit", disabled: !n, children: a("chat.renameSave") })
        ] })
      ]
    }
  ) }) });
}
export {
  S as RenameChatDialog
};
