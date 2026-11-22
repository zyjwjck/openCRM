import { g as f } from "./react-vendor-ASUsaCHq.js";
function u(e, n) {
  for (var o = 0; o < n.length; o++) {
    const t = n[o];
    if (typeof t != "string" && !Array.isArray(t)) {
      for (const r in t)
        if (r !== "default" && !(r in e)) {
          const a = Object.getOwnPropertyDescriptor(t, r);
          a && Object.defineProperty(e, r, a.get ? a : {
            enumerable: !0,
            get: () => t[r]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }));
}
var c = s;
s.displayName = "csv";
s.aliases = [];
function s(e) {
  e.languages.csv = {
    value: /[^\r\n,"]+|"(?:[^"]|"")*"(?!")/,
    punctuation: /,/
  };
}
const i = /* @__PURE__ */ f(c), g = /* @__PURE__ */ u({
  __proto__: null,
  default: i
}, [c]);
export {
  g as c
};
