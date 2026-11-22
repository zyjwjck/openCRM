import { g as b } from "./react-vendor-ASUsaCHq.js";
function u(e, l) {
  for (var n = 0; n < l.length; n++) {
    const t = l[n];
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
var i = o;
o.displayName = "erlang";
o.aliases = [];
function o(e) {
  e.languages.erlang = {
    comment: /%.+/,
    string: {
      pattern: /"(?:\\.|[^\\"\r\n])*"/,
      greedy: !0
    },
    "quoted-function": {
      pattern: /'(?:\\.|[^\\'\r\n])+'(?=\()/,
      alias: "function"
    },
    "quoted-atom": {
      pattern: /'(?:\\.|[^\\'\r\n])+'/,
      alias: "atom"
    },
    boolean: /\b(?:false|true)\b/,
    keyword: /\b(?:after|case|catch|end|fun|if|of|receive|try|when)\b/,
    number: [
      /\$\\?./,
      /\b\d+#[a-z0-9]+/i,
      /(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i
    ],
    function: /\b[a-z][\w@]*(?=\()/,
    variable: {
      // Look-behind is used to prevent wrong highlighting of atoms containing "@"
      pattern: /(^|[^@])(?:\b|\?)[A-Z_][\w@]*/,
      lookbehind: !0
    },
    operator: [
      /[=\/<>:]=|=[:\/]=|\+\+?|--?|[=*\/!]|\b(?:and|andalso|band|bnot|bor|bsl|bsr|bxor|div|not|or|orelse|rem|xor)\b/,
      {
        // We don't want to match <<
        pattern: /(^|[^<])<(?!<)/,
        lookbehind: !0
      },
      {
        // We don't want to match >>
        pattern: /(^|[^>])>(?!>)/,
        lookbehind: !0
      }
    ],
    atom: /\b[a-z][\w@]*/,
    punctuation: /[()[\]{}:;,.#|]|<<|>>/
  };
}
const s = /* @__PURE__ */ b(i), f = /* @__PURE__ */ u({
  __proto__: null,
  default: s
}, [i]);
export {
  f as e
};
