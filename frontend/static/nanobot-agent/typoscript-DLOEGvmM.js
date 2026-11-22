import { g as s } from "./react-vendor-ASUsaCHq.js";
function p(r, e) {
  for (var t = 0; t < e.length; t++) {
    const n = e[t];
    if (typeof n != "string" && !Array.isArray(n)) {
      for (const o in n)
        if (o !== "default" && !(o in r)) {
          const E = Object.getOwnPropertyDescriptor(n, o);
          E && Object.defineProperty(r, o, E.get ? E : {
            enumerable: !0,
            get: () => n[o]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(r, Symbol.toStringTag, { value: "Module" }));
}
var a = i;
i.displayName = "typoscript";
i.aliases = ["tsconfig"];
function i(r) {
  (function(e) {
    var t = /\b(?:ACT|ACTIFSUB|CARRAY|CASE|CLEARGIF|COA|COA_INT|CONSTANTS|CONTENT|CUR|EDITPANEL|EFFECT|EXT|FILE|FLUIDTEMPLATE|FORM|FRAME|FRAMESET|GIFBUILDER|GMENU|GMENU_FOLDOUT|GMENU_LAYERS|GP|HMENU|HRULER|HTML|IENV|IFSUB|IMAGE|IMGMENU|IMGMENUITEM|IMGTEXT|IMG_RESOURCE|INCLUDE_TYPOSCRIPT|JSMENU|JSMENUITEM|LLL|LOAD_REGISTER|NO|PAGE|RECORDS|RESTORE_REGISTER|TEMPLATE|TEXT|TMENU|TMENUITEM|TMENU_LAYERS|USER|USER_INT|_GIFBUILDER|global|globalString|globalVar)\b/;
    e.languages.typoscript = {
      comment: [
        {
          // multiline comments /* */
          pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
          lookbehind: !0
        },
        {
          // double-slash comments - ignored when backslashes or colon is found in front
          // also ignored whenever directly after an equal-sign, because it would probably be an url without protocol
          pattern: /(^|[^\\:= \t]|(?:^|[^= \t])[ \t]+)\/\/.*/,
          lookbehind: !0,
          greedy: !0
        },
        {
          // hash comments - ignored when leading quote is found for hex colors in strings
          pattern: /(^|[^"'])#.*/,
          lookbehind: !0,
          greedy: !0
        }
      ],
      function: [
        {
          // old include style
          pattern: /<INCLUDE_TYPOSCRIPT:\s*source\s*=\s*(?:"[^"\r\n]*"|'[^'\r\n]*')\s*>/,
          inside: {
            string: {
              pattern: /"[^"\r\n]*"|'[^'\r\n]*'/,
              inside: {
                keyword: t
              }
            },
            keyword: {
              pattern: /INCLUDE_TYPOSCRIPT/
            }
          }
        },
        {
          // new include style
          pattern: /@import\s*(?:"[^"\r\n]*"|'[^'\r\n]*')/,
          inside: {
            string: /"[^"\r\n]*"|'[^'\r\n]*'/
          }
        }
      ],
      string: {
        pattern: /^([^=]*=[< ]?)(?:(?!\]\n).)*/,
        lookbehind: !0,
        inside: {
          function: /\{\$.*\}/,
          // constants include
          keyword: t,
          number: /^\d+$/,
          punctuation: /[,|:]/
        }
      },
      keyword: t,
      number: {
        // special highlighting for indexes of arrays in tags
        pattern: /\b\d+\s*[.{=]/,
        inside: {
          operator: /[.{=]/
        }
      },
      tag: {
        pattern: /\.?[-\w\\]+\.?/,
        inside: {
          punctuation: /\./
        }
      },
      punctuation: /[{}[\];(),.:|]/,
      operator: /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/
    }, e.languages.tsconfig = e.languages.typoscript;
  })(r);
}
const T = /* @__PURE__ */ s(a), c = /* @__PURE__ */ p({
  __proto__: null,
  default: T
}, [a]);
export {
  c as t
};
