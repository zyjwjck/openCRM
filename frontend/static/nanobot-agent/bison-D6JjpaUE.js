import { g as c } from "./react-vendor-ASUsaCHq.js";
import { a as u } from "./c-CMrkL8iu.js";
function g(e, i) {
  for (var a = 0; a < i.length; a++) {
    const t = i[a];
    if (typeof t != "string" && !Array.isArray(t)) {
      for (const n in t)
        if (n !== "default" && !(n in e)) {
          const r = Object.getOwnPropertyDescriptor(t, n);
          r && Object.defineProperty(e, n, r.get ? r : {
            enumerable: !0,
            get: () => t[n]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }));
}
var l = u, s = o;
o.displayName = "bison";
o.aliases = [];
function o(e) {
  e.register(l), e.languages.bison = e.languages.extend("c", {}), e.languages.insertBefore("bison", "comment", {
    bison: {
      // This should match all the beginning of the file
      // including the prologue(s), the bison declarations and
      // the grammar rules.
      pattern: /^(?:[^%]|%(?!%))*%%[\s\S]*?%%/,
      inside: {
        c: {
          // Allow for one level of nested braces
          pattern: /%\{[\s\S]*?%\}|\{(?:\{[^}]*\}|[^{}])*\}/,
          inside: {
            delimiter: {
              pattern: /^%?\{|%?\}$/,
              alias: "punctuation"
            },
            "bison-variable": {
              pattern: /[$@](?:<[^\s>]+>)?[\w$]+/,
              alias: "variable",
              inside: {
                punctuation: /<|>/
              }
            },
            rest: e.languages.c
          }
        },
        comment: e.languages.c.comment,
        string: e.languages.c.string,
        property: /\S+(?=:)/,
        keyword: /%\w+/,
        number: {
          pattern: /(^|[^@])\b(?:0x[\da-f]+|\d+)/i,
          lookbehind: !0
        },
        punctuation: /%[%?]|[|:;\[\]<>]/
      }
    }
  });
}
const p = /* @__PURE__ */ c(s), d = /* @__PURE__ */ g({
  __proto__: null,
  default: p
}, [s]);
export {
  d as b
};
