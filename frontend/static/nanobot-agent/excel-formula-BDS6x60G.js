import { g as u } from "./react-vendor-ASUsaCHq.js";
function s(e, l) {
  for (var a = 0; a < l.length; a++) {
    const t = l[a];
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
var i = o;
o.displayName = "excelFormula";
o.aliases = [];
function o(e) {
  e.languages["excel-formula"] = {
    comment: {
      pattern: /(\bN\(\s*)"(?:[^"]|"")*"(?=\s*\))/i,
      lookbehind: !0,
      greedy: !0
    },
    string: {
      pattern: /"(?:[^"]|"")*"(?!")/,
      greedy: !0
    },
    reference: {
      // https://www.ablebits.com/office-addins-blog/2015/12/08/excel-reference-another-sheet-workbook/
      // Sales!B2
      // 'Winter sales'!B2
      // [Sales.xlsx]Jan!B2:B5
      // D:\Reports\[Sales.xlsx]Jan!B2:B5
      // '[Sales.xlsx]Jan sales'!B2:B5
      // 'D:\Reports\[Sales.xlsx]Jan sales'!B2:B5
      pattern: /(?:'[^']*'|(?:[^\s()[\]{}<>*?"';,$&]*\[[^^\s()[\]{}<>*?"']+\])?\w+)!/,
      greedy: !0,
      alias: "string",
      inside: {
        operator: /!$/,
        punctuation: /'/,
        sheet: {
          pattern: /[^[\]]+$/,
          alias: "function"
        },
        file: {
          pattern: /\[[^[\]]+\]$/,
          inside: {
            punctuation: /[[\]]/
          }
        },
        path: /[\s\S]+/
      }
    },
    "function-name": {
      pattern: /\b[A-Z]\w*(?=\()/i,
      alias: "keyword"
    },
    range: {
      pattern: /\$?\b(?:[A-Z]+\$?\d+:\$?[A-Z]+\$?\d+|[A-Z]+:\$?[A-Z]+|\d+:\$?\d+)\b/i,
      alias: "property",
      inside: {
        operator: /:/,
        cell: /\$?[A-Z]+\$?\d+/i,
        column: /\$?[A-Z]+/i,
        row: /\$?\d+/
      }
    },
    cell: {
      // Excel is case insensitive, so the string "foo1" could be either a variable or a cell.
      // To combat this, we match cells case insensitive, if the contain at least one "$", and case sensitive otherwise.
      pattern: /\b[A-Z]+\d+\b|\$[A-Za-z]+\$?\d+\b|\b[A-Za-z]+\$\d+\b/,
      alias: "property"
    },
    number: /(?:\b\d+(?:\.\d+)?|\B\.\d+)(?:e[+-]?\d+)?\b/i,
    boolean: /\b(?:FALSE|TRUE)\b/i,
    operator: /[-+*/^%=&,]|<[=>]?|>=?/,
    punctuation: /[[\]();{}|]/
  }, e.languages.xlsx = e.languages.xls = e.languages["excel-formula"];
}
const c = /* @__PURE__ */ u(i), d = /* @__PURE__ */ s({
  __proto__: null,
  default: c
}, [i]);
export {
  d as e
};
