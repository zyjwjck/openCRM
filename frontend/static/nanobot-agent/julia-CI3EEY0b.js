import { g as u } from "./react-vendor-ASUsaCHq.js";
function s(e, i) {
  for (var a = 0; a < i.length; a++) {
    const t = i[a];
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
var l = o;
o.displayName = "julia";
o.aliases = [];
function o(e) {
  e.languages.julia = {
    comment: {
      // support one level of nested comments
      // https://github.com/JuliaLang/julia/pull/6128
      pattern: /(^|[^\\])(?:#=(?:[^#=]|=(?!#)|#(?!=)|#=(?:[^#=]|=(?!#)|#(?!=))*=#)*=#|#.*)/,
      lookbehind: !0
    },
    regex: {
      // https://docs.julialang.org/en/v1/manual/strings/#Regular-Expressions-1
      pattern: /r"(?:\\.|[^"\\\r\n])*"[imsx]{0,4}/,
      greedy: !0
    },
    string: {
      // https://docs.julialang.org/en/v1/manual/strings/#String-Basics-1
      // https://docs.julialang.org/en/v1/manual/strings/#non-standard-string-literals-1
      // https://docs.julialang.org/en/v1/manual/running-external-programs/#Running-External-Programs-1
      pattern: /"""[\s\S]+?"""|(?:\b\w+)?"(?:\\.|[^"\\\r\n])*"|`(?:[^\\`\r\n]|\\.)*`/,
      greedy: !0
    },
    char: {
      // https://docs.julialang.org/en/v1/manual/strings/#man-characters-1
      pattern: /(^|[^\w'])'(?:\\[^\r\n][^'\r\n]*|[^\\\r\n])'/,
      lookbehind: !0,
      greedy: !0
    },
    keyword: /\b(?:abstract|baremodule|begin|bitstype|break|catch|ccall|const|continue|do|else|elseif|end|export|finally|for|function|global|if|immutable|import|importall|in|let|local|macro|module|print|println|quote|return|struct|try|type|typealias|using|while)\b/,
    boolean: /\b(?:false|true)\b/,
    number: /(?:\b(?=\d)|\B(?=\.))(?:0[box])?(?:[\da-f]+(?:_[\da-f]+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[efp][+-]?\d+(?:_\d+)*)?j?/i,
    // https://docs.julialang.org/en/v1/manual/mathematical-operations/
    // https://docs.julialang.org/en/v1/manual/mathematical-operations/#Operator-Precedence-and-Associativity-1
    operator: /&&|\|\||[-+*^%÷⊻&$\\]=?|\/[\/=]?|!=?=?|\|[=>]?|<(?:<=?|[=:|])?|>(?:=|>>?=?)?|==?=?|[~≠≤≥'√∛]/,
    punctuation: /::?|[{}[\]();,.?]/,
    // https://docs.julialang.org/en/v1/base/numbers/#Base.im
    constant: /\b(?:(?:Inf|NaN)(?:16|32|64)?|im|pi)\b|[πℯ]/
  };
}
const c = /* @__PURE__ */ u(l), p = /* @__PURE__ */ s({
  __proto__: null,
  default: c
}, [l]);
export {
  p as j
};
