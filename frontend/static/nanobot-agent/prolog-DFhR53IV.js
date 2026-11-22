import { g } from "./react-vendor-ASUsaCHq.js";
function l(e, p) {
  for (var o = 0; o < p.length; o++) {
    const r = p[o];
    if (typeof r != "string" && !Array.isArray(r)) {
      for (const t in r)
        if (t !== "default" && !(t in e)) {
          const n = Object.getOwnPropertyDescriptor(r, t);
          n && Object.defineProperty(e, t, n.get ? n : {
            enumerable: !0,
            get: () => r[t]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }));
}
var f = a;
a.displayName = "prolog";
a.aliases = [];
function a(e) {
  e.languages.prolog = {
    // Syntax depends on the implementation
    comment: {
      pattern: /\/\*[\s\S]*?\*\/|%.*/,
      greedy: !0
    },
    // Depending on the implementation, strings may allow escaped newlines and quote-escape
    string: {
      pattern: /(["'])(?:\1\1|\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1(?!\1)/,
      greedy: !0
    },
    builtin: /\b(?:fx|fy|xf[xy]?|yfx?)\b/,
    // FIXME: Should we list all null-ary predicates (not followed by a parenthesis) like halt, trace, etc.?
    function: /\b[a-z]\w*(?:(?=\()|\/\d+)/,
    number: /\b\d+(?:\.\d*)?/,
    // Custom operators are allowed
    operator: /[:\\=><\-?*@\/;+^|!$.]+|\b(?:is|mod|not|xor)\b/,
    punctuation: /[(){}\[\],]/
  };
}
const s = /* @__PURE__ */ g(f), u = /* @__PURE__ */ l({
  __proto__: null,
  default: s
}, [f]);
export {
  u as p
};
