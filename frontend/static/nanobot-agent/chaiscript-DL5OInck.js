import { g as c } from "./react-vendor-ASUsaCHq.js";
import { a as p } from "./cpp-B25c52v4.js";
function l(e, o) {
  for (var a = 0; a < o.length; a++) {
    const t = o[a];
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
var u = p, s = i;
i.displayName = "chaiscript";
i.aliases = [];
function i(e) {
  e.register(u), e.languages.chaiscript = e.languages.extend("clike", {
    string: {
      pattern: /(^|[^\\])'(?:[^'\\]|\\[\s\S])*'/,
      lookbehind: !0,
      greedy: !0
    },
    "class-name": [
      {
        // e.g. class Rectangle { ... }
        pattern: /(\bclass\s+)\w+/,
        lookbehind: !0
      },
      {
        // e.g. attr Rectangle::height, def Rectangle::area() { ... }
        pattern: /(\b(?:attr|def)\s+)\w+(?=\s*::)/,
        lookbehind: !0
      }
    ],
    keyword: /\b(?:attr|auto|break|case|catch|class|continue|def|default|else|finally|for|fun|global|if|return|switch|this|try|var|while)\b/,
    number: [e.languages.cpp.number, /\b(?:Infinity|NaN)\b/],
    operator: />>=?|<<=?|\|\||&&|:[:=]?|--|\+\+|[=!<>+\-*/%|&^]=?|[?~]|`[^`\r\n]{1,4}`/
  }), e.languages.insertBefore("chaiscript", "operator", {
    "parameter-type": {
      // e.g. def foo(int x, Vector y) {...}
      pattern: /([,(]\s*)\w+(?=\s+\w)/,
      lookbehind: !0,
      alias: "class-name"
    }
  }), e.languages.insertBefore("chaiscript", "string", {
    "string-interpolation": {
      pattern: /(^|[^\\])"(?:[^"$\\]|\\[\s\S]|\$(?!\{)|\$\{(?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*\})*"/,
      lookbehind: !0,
      greedy: !0,
      inside: {
        interpolation: {
          pattern: /((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*\}/,
          lookbehind: !0,
          inside: {
            "interpolation-expression": {
              pattern: /(^\$\{)[\s\S]+(?=\}$)/,
              lookbehind: !0,
              inside: e.languages.chaiscript
            },
            "interpolation-punctuation": {
              pattern: /^\$\{|\}$/,
              alias: "punctuation"
            }
          }
        },
        string: /[\s\S]+/
      }
    }
  });
}
const g = /* @__PURE__ */ c(s), b = /* @__PURE__ */ l({
  __proto__: null,
  default: g
}, [s]);
export {
  b as c
};
