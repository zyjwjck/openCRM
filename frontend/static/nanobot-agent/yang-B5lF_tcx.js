import { g as i } from "./react-vendor-ASUsaCHq.js";
function u(e, s) {
  for (var a = 0; a < s.length; a++) {
    const t = s[a];
    if (typeof t != "string" && !Array.isArray(t)) {
      for (const r in t)
        if (r !== "default" && !(r in e)) {
          const n = Object.getOwnPropertyDescriptor(t, r);
          n && Object.defineProperty(e, r, n.get ? n : {
            enumerable: !0,
            get: () => t[r]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }));
}
var g = o;
o.displayName = "yang";
o.aliases = [];
function o(e) {
  e.languages.yang = {
    // https://tools.ietf.org/html/rfc6020#page-34
    // http://www.yang-central.org/twiki/bin/view/Main/YangExamples
    comment: /\/\*[\s\S]*?\*\/|\/\/.*/,
    string: {
      pattern: /"(?:[^\\"]|\\.)*"|'[^']*'/,
      greedy: !0
    },
    keyword: {
      pattern: /(^|[{};\r\n][ \t]*)[a-z_][\w.-]*/i,
      lookbehind: !0
    },
    namespace: {
      pattern: /(\s)[a-z_][\w.-]*(?=:)/i,
      lookbehind: !0
    },
    boolean: /\b(?:false|true)\b/,
    operator: /\+/,
    punctuation: /[{};:]/
  };
}
const l = /* @__PURE__ */ i(g), p = /* @__PURE__ */ u({
  __proto__: null,
  default: l
}, [g]);
export {
  p as y
};
