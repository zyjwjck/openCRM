import { g as N } from "./react-vendor-ASUsaCHq.js";
function i(e, a) {
  for (var n = 0; n < a.length; n++) {
    const r = a[n];
    if (typeof r != "string" && !Array.isArray(r)) {
      for (const t in r)
        if (t !== "default" && !(t in e)) {
          const E = Object.getOwnPropertyDescriptor(r, t);
          E && Object.defineProperty(e, t, E.get ? E : {
            enumerable: !0,
            get: () => r[t]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }));
}
var s = o;
o.displayName = "cypher";
o.aliases = [];
function o(e) {
  e.languages.cypher = {
    // https://neo4j.com/docs/cypher-manual/current/syntax/comments/
    comment: /\/\/.*/,
    string: {
      pattern: /"(?:[^"\\\r\n]|\\.)*"|'(?:[^'\\\r\n]|\\.)*'/,
      greedy: !0
    },
    "class-name": {
      pattern: /(:\s*)(?:\w+|`(?:[^`\\\r\n])*`)(?=\s*[{):])/,
      lookbehind: !0,
      greedy: !0
    },
    relationship: {
      pattern: /(-\[\s*(?:\w+\s*|`(?:[^`\\\r\n])*`\s*)?:\s*|\|\s*:\s*)(?:\w+|`(?:[^`\\\r\n])*`)/,
      lookbehind: !0,
      greedy: !0,
      alias: "property"
    },
    identifier: {
      pattern: /`(?:[^`\\\r\n])*`/,
      greedy: !0
    },
    variable: /\$\w+/,
    // https://neo4j.com/docs/cypher-manual/current/syntax/reserved/
    keyword: /\b(?:ADD|ALL|AND|AS|ASC|ASCENDING|ASSERT|BY|CALL|CASE|COMMIT|CONSTRAINT|CONTAINS|CREATE|CSV|DELETE|DESC|DESCENDING|DETACH|DISTINCT|DO|DROP|ELSE|END|ENDS|EXISTS|FOR|FOREACH|IN|INDEX|IS|JOIN|KEY|LIMIT|LOAD|MANDATORY|MATCH|MERGE|NODE|NOT|OF|ON|OPTIONAL|OR|ORDER(?=\s+BY)|PERIODIC|REMOVE|REQUIRE|RETURN|SCALAR|SCAN|SET|SKIP|START|STARTS|THEN|UNION|UNIQUE|UNWIND|USING|WHEN|WHERE|WITH|XOR|YIELD)\b/i,
    function: /\b\w+\b(?=\s*\()/,
    boolean: /\b(?:false|null|true)\b/i,
    number: /\b(?:0x[\da-fA-F]+|\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)\b/,
    // https://neo4j.com/docs/cypher-manual/current/syntax/operators/
    operator: /:|<--?|--?>?|<>|=~?|[<>]=?|[+*/%^|]|\.\.\.?/,
    punctuation: /[()[\]{},;.]/
  };
}
const A = /* @__PURE__ */ N(s), S = /* @__PURE__ */ i({
  __proto__: null,
  default: A
}, [s]);
export {
  S as c
};
