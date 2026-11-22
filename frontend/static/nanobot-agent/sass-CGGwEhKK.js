import { g as u } from "./react-vendor-ASUsaCHq.js";
function p(a, e) {
  for (var r = 0; r < e.length; r++) {
    const t = e[r];
    if (typeof t != "string" && !Array.isArray(t)) {
      for (const s in t)
        if (s !== "default" && !(s in a)) {
          const n = Object.getOwnPropertyDescriptor(t, s);
          n && Object.defineProperty(a, s, n.get ? n : {
            enumerable: !0,
            get: () => t[s]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(a, Symbol.toStringTag, { value: "Module" }));
}
var l = o;
o.displayName = "sass";
o.aliases = [];
function o(a) {
  (function(e) {
    e.languages.sass = e.languages.extend("css", {
      // Sass comments don't need to be closed, only indented
      comment: {
        pattern: /^([ \t]*)\/[\/*].*(?:(?:\r?\n|\r)\1[ \t].+)*/m,
        lookbehind: !0,
        greedy: !0
      }
    }), e.languages.insertBefore("sass", "atrule", {
      // We want to consume the whole line
      "atrule-line": {
        // Includes support for = and + shortcuts
        pattern: /^(?:[ \t]*)[@+=].+/m,
        greedy: !0,
        inside: {
          atrule: /(?:@[\w-]+|[+=])/
        }
      }
    }), delete e.languages.sass.atrule;
    var r = /\$[-\w]+|#\{\$[-\w]+\}/, t = [
      /[+*\/%]|[=!]=|<=?|>=?|\b(?:and|not|or)\b/,
      {
        pattern: /(\s)-(?=\s)/,
        lookbehind: !0
      }
    ];
    e.languages.insertBefore("sass", "property", {
      // We want to consume the whole line
      "variable-line": {
        pattern: /^[ \t]*\$.+/m,
        greedy: !0,
        inside: {
          punctuation: /:/,
          variable: r,
          operator: t
        }
      },
      // We want to consume the whole line
      "property-line": {
        pattern: /^[ \t]*(?:[^:\s]+ *:.*|:[^:\s].*)/m,
        greedy: !0,
        inside: {
          property: [
            /[^:\s]+(?=\s*:)/,
            {
              pattern: /(:)[^:\s]+/,
              lookbehind: !0
            }
          ],
          punctuation: /:/,
          variable: r,
          operator: t,
          important: e.languages.sass.important
        }
      }
    }), delete e.languages.sass.property, delete e.languages.sass.important, e.languages.insertBefore("sass", "punctuation", {
      selector: {
        pattern: /^([ \t]*)\S(?:,[^,\r\n]+|[^,\r\n]*)(?:,[^,\r\n]+)*(?:,(?:\r?\n|\r)\1[ \t]+\S(?:,[^,\r\n]+|[^,\r\n]*)(?:,[^,\r\n]+)*)*/m,
        lookbehind: !0,
        greedy: !0
      }
    });
  })(a);
}
const g = /* @__PURE__ */ u(l), d = /* @__PURE__ */ p({
  __proto__: null,
  default: g
}, [l]);
export {
  d as s
};
