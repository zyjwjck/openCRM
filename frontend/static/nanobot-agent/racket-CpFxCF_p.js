import { g as s } from "./react-vendor-ASUsaCHq.js";
import { a as l } from "./scheme-DBOwJ0-s.js";
function f(e, c) {
  for (var a = 0; a < c.length; a++) {
    const t = c[a];
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
var u = l, g = o;
o.displayName = "racket";
o.aliases = ["rkt"];
function o(e) {
  e.register(u), e.languages.racket = e.languages.extend("scheme", {
    "lambda-parameter": {
      // the racket lambda syntax is a lot more complex, so we won't even attempt to capture it.
      // this will just prevent false positives of the `function` pattern
      pattern: /([(\[]lambda\s+[(\[])[^()\[\]'\s]+/,
      lookbehind: !0
    }
  }), e.languages.insertBefore("racket", "string", {
    lang: {
      pattern: /^#lang.+/m,
      greedy: !0,
      alias: "keyword"
    }
  }), e.languages.rkt = e.languages.racket;
}
const i = /* @__PURE__ */ s(g), k = /* @__PURE__ */ f({
  __proto__: null,
  default: i
}, [g]);
export {
  k as r
};
