import { g as c } from "./react-vendor-ASUsaCHq.js";
function f(e, i) {
  for (var r = 0; r < i.length; r++) {
    const t = i[r];
    if (typeof t != "string" && !Array.isArray(t)) {
      for (const o in t)
        if (o !== "default" && !(o in e)) {
          const n = Object.getOwnPropertyDescriptor(t, o);
          n && Object.defineProperty(e, o, n.get ? n : {
            enumerable: !0,
            get: () => t[o]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }));
}
var s = a;
a.displayName = "editorconfig";
a.aliases = [];
function a(e) {
  e.languages.editorconfig = {
    // https://editorconfig-specification.readthedocs.io
    comment: /[;#].*/,
    section: {
      pattern: /(^[ \t]*)\[.+\]/m,
      lookbehind: !0,
      alias: "selector",
      inside: {
        regex: /\\\\[\[\]{},!?.*]/,
        // Escape special characters with '\\'
        operator: /[!?]|\.\.|\*{1,2}/,
        punctuation: /[\[\]{},]/
      }
    },
    key: {
      pattern: /(^[ \t]*)[^\s=]+(?=[ \t]*=)/m,
      lookbehind: !0,
      alias: "attr-name"
    },
    value: {
      pattern: /=.*/,
      alias: "attr-value",
      inside: {
        punctuation: /^=/
      }
    }
  };
}
const l = /* @__PURE__ */ c(s), g = /* @__PURE__ */ f({
  __proto__: null,
  default: l
}, [s]);
export {
  g as e
};
