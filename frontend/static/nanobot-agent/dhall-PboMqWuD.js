import { g as s } from "./react-vendor-ASUsaCHq.js";
function u(e, l) {
  for (var n = 0; n < l.length; n++) {
    const t = l[n];
    if (typeof t != "string" && !Array.isArray(t)) {
      for (const a in t)
        if (a !== "default" && !(a in e)) {
          const r = Object.getOwnPropertyDescriptor(t, a);
          r && Object.defineProperty(e, a, r.get ? r : {
            enumerable: !0,
            get: () => t[a]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }));
}
var o = i;
i.displayName = "dhall";
i.aliases = [];
function i(e) {
  e.languages.dhall = {
    // Multi-line comments can be nested. E.g. {- foo {- bar -} -}
    // The multi-line pattern is essentially this:
    //   \{-(?:[^-{]|-(?!\})|\{(?!-)|<SELF>)*-\}
    comment: /--.*|\{-(?:[^-{]|-(?!\})|\{(?!-)|\{-(?:[^-{]|-(?!\})|\{(?!-))*-\})*-\}/,
    string: {
      pattern: /"(?:[^"\\]|\\.)*"|''(?:[^']|'(?!')|'''|''\$\{)*''(?!'|\$)/,
      greedy: !0,
      inside: {
        interpolation: {
          pattern: /\$\{[^{}]*\}/,
          inside: {
            expression: {
              pattern: /(^\$\{)[\s\S]+(?=\}$)/,
              lookbehind: !0,
              alias: "language-dhall",
              inside: null
              // see blow
            },
            punctuation: /\$\{|\}/
          }
        }
      }
    },
    label: {
      pattern: /`[^`]*`/,
      greedy: !0
    },
    url: {
      // https://github.com/dhall-lang/dhall-lang/blob/5fde8ef1bead6fb4e999d3c1ffe7044cd019d63a/standard/dhall.abnf#L596
      pattern: /\bhttps?:\/\/[\w.:%!$&'*+;=@~-]+(?:\/[\w.:%!$&'*+;=@~-]*)*(?:\?[/?\w.:%!$&'*+;=@~-]*)?/,
      greedy: !0
    },
    env: {
      // https://github.com/dhall-lang/dhall-lang/blob/5fde8ef1bead6fb4e999d3c1ffe7044cd019d63a/standard/dhall.abnf#L661
      pattern: /\benv:(?:(?!\d)\w+|"(?:[^"\\=]|\\.)*")/,
      greedy: !0,
      inside: {
        function: /^env/,
        operator: /^:/,
        variable: /[\s\S]+/
      }
    },
    hash: {
      // https://github.com/dhall-lang/dhall-lang/blob/5fde8ef1bead6fb4e999d3c1ffe7044cd019d63a/standard/dhall.abnf#L725
      pattern: /\bsha256:[\da-fA-F]{64}\b/,
      inside: {
        function: /sha256/,
        operator: /:/,
        number: /[\da-fA-F]{64}/
      }
    },
    // https://github.com/dhall-lang/dhall-lang/blob/5fde8ef1bead6fb4e999d3c1ffe7044cd019d63a/standard/dhall.abnf#L359
    keyword: /\b(?:as|assert|else|forall|if|in|let|merge|missing|then|toMap|using|with)\b|\u2200/,
    builtin: /\b(?:None|Some)\b/,
    boolean: /\b(?:False|True)\b/,
    number: /\bNaN\b|-?\bInfinity\b|[+-]?\b(?:0x[\da-fA-F]+|\d+(?:\.\d+)?(?:e[+-]?\d+)?)\b/,
    operator: /\/\\|\/\/\\\\|&&|\|\||===|[!=]=|\/\/|->|\+\+|::|[+*#@=:?<>|\\\u2227\u2a53\u2261\u2afd\u03bb\u2192]/,
    punctuation: /\.\.|[{}\[\](),./]/,
    // we'll just assume that every capital word left is a type name
    "class-name": /\b[A-Z]\w*\b/
  }, e.languages.dhall.string.inside.interpolation.inside.expression.inside = e.languages.dhall;
}
const d = /* @__PURE__ */ s(o), p = /* @__PURE__ */ u({
  __proto__: null,
  default: d
}, [o]);
export {
  p as d
};
