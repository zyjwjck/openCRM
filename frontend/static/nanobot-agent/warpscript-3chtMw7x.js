import { g as i } from "./react-vendor-ASUsaCHq.js";
function c(r, p) {
  for (var a = 0; a < p.length; a++) {
    const e = p[a];
    if (typeof e != "string" && !Array.isArray(e)) {
      for (const t in e)
        if (t !== "default" && !(t in r)) {
          const o = Object.getOwnPropertyDescriptor(e, t);
          o && Object.defineProperty(r, t, o.get ? o : {
            enumerable: !0,
            get: () => e[t]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(r, Symbol.toStringTag, { value: "Module" }));
}
var s = n;
n.displayName = "warpscript";
n.aliases = [];
function n(r) {
  r.languages.warpscript = {
    comment: /#.*|\/\/.*|\/\*[\s\S]*?\*\//,
    string: {
      pattern: /"(?:[^"\\\r\n]|\\.)*"|'(?:[^'\\\r\n]|\\.)*'|<'(?:[^\\']|'(?!>)|\\.)*'>/,
      greedy: !0
    },
    variable: /\$\S+/,
    macro: {
      pattern: /@\S+/,
      alias: "property"
    },
    // WarpScript doesn't have any keywords, these are all functions under the control category
    // https://www.warp10.io/tags/control
    keyword: /\b(?:BREAK|CHECKMACRO|CONTINUE|CUDF|DEFINED|DEFINEDMACRO|EVAL|FAIL|FOR|FOREACH|FORSTEP|IFT|IFTE|MSGFAIL|NRETURN|RETHROW|RETURN|SWITCH|TRY|UDF|UNTIL|WHILE)\b/,
    number: /[+-]?\b(?:NaN|Infinity|\d+(?:\.\d*)?(?:[Ee][+-]?\d+)?|0x[\da-fA-F]+|0b[01]+)\b/,
    boolean: /\b(?:F|T|false|true)\b/,
    punctuation: /<%|%>|[{}[\]()]/,
    // Some operators from the "operators" category
    // https://www.warp10.io/tags/operators
    operator: /==|&&?|\|\|?|\*\*?|>>>?|<<|[<>!~]=?|[-/%^]|\+!?|\b(?:AND|NOT|OR)\b/
  };
}
const f = /* @__PURE__ */ i(s), l = /* @__PURE__ */ c({
  __proto__: null,
  default: f
}, [s]);
export {
  l as w
};
