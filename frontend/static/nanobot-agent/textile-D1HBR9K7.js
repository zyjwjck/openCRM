import { g as m } from "./react-vendor-ASUsaCHq.js";
function f(s, o) {
  for (var u = 0; u < o.length; u++) {
    const r = o[u];
    if (typeof r != "string" && !Array.isArray(r)) {
      for (const e in r)
        if (e !== "default" && !(e in s)) {
          const n = Object.getOwnPropertyDescriptor(r, e);
          n && Object.defineProperty(s, e, n.get ? n : {
            enumerable: !0,
            get: () => r[e]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(s, Symbol.toStringTag, { value: "Module" }));
}
var p = l;
l.displayName = "textile";
l.aliases = [];
function l(s) {
  (function(o) {
    var u = /\([^|()\n]+\)|\[[^\]\n]+\]|\{[^}\n]+\}/.source, r = /\)|\((?![^|()\n]+\))/.source;
    function e(k, b) {
      return RegExp(
        k.replace(/<MOD>/g, function() {
          return "(?:" + u + ")";
        }).replace(/<PAR>/g, function() {
          return "(?:" + r + ")";
        }),
        b || ""
      );
    }
    var n = {
      css: {
        pattern: /\{[^{}]+\}/,
        inside: {
          rest: o.languages.css
        }
      },
      "class-id": {
        pattern: /(\()[^()]+(?=\))/,
        lookbehind: !0,
        alias: "attr-value"
      },
      lang: {
        pattern: /(\[)[^\[\]]+(?=\])/,
        lookbehind: !0,
        alias: "attr-value"
      },
      // Anything else is punctuation (the first pattern is for row/col spans inside tables)
      punctuation: /[\\\/]\d+|\S/
    }, c = o.languages.textile = o.languages.extend("markup", {
      phrase: {
        pattern: /(^|\r|\n)\S[\s\S]*?(?=$|\r?\n\r?\n|\r\r)/,
        lookbehind: !0,
        inside: {
          // h1. Header 1
          "block-tag": {
            pattern: e(/^[a-z]\w*(?:<MOD>|<PAR>|[<>=])*\./.source),
            inside: {
              modifier: {
                pattern: e(
                  /(^[a-z]\w*)(?:<MOD>|<PAR>|[<>=])+(?=\.)/.source
                ),
                lookbehind: !0,
                inside: n
              },
              tag: /^[a-z]\w*/,
              punctuation: /\.$/
            }
          },
          // # List item
          // * List item
          list: {
            pattern: e(/^[*#]+<MOD>*\s+\S.*/.source, "m"),
            inside: {
              modifier: {
                pattern: e(/(^[*#]+)<MOD>+/.source),
                lookbehind: !0,
                inside: n
              },
              punctuation: /^[*#]+/
            }
          },
          // | cell | cell | cell |
          table: {
            // Modifiers can be applied to the row: {color:red}.|1|2|3|
            // or the cell: |{color:red}.1|2|3|
            pattern: e(
              /^(?:(?:<MOD>|<PAR>|[<>=^~])+\.\s*)?(?:\|(?:(?:<MOD>|<PAR>|[<>=^~_]|[\\/]\d+)+\.|(?!(?:<MOD>|<PAR>|[<>=^~_]|[\\/]\d+)+\.))[^|]*)+\|/.source,
              "m"
            ),
            inside: {
              modifier: {
                // Modifiers for rows after the first one are
                // preceded by a pipe and a line feed
                pattern: e(
                  /(^|\|(?:\r?\n|\r)?)(?:<MOD>|<PAR>|[<>=^~_]|[\\/]\d+)+(?=\.)/.source
                ),
                lookbehind: !0,
                inside: n
              },
              punctuation: /\||^\./
            }
          },
          inline: {
            // eslint-disable-next-line regexp/no-super-linear-backtracking
            pattern: e(
              /(^|[^a-zA-Z\d])(\*\*|__|\?\?|[*_%@+\-^~])<MOD>*.+?\2(?![a-zA-Z\d])/.source
            ),
            lookbehind: !0,
            inside: {
              // Note: superscripts and subscripts are not handled specifically
              // *bold*, **bold**
              bold: {
                // eslint-disable-next-line regexp/no-super-linear-backtracking
                pattern: e(/(^(\*\*?)<MOD>*).+?(?=\2)/.source),
                lookbehind: !0
              },
              // _italic_, __italic__
              italic: {
                // eslint-disable-next-line regexp/no-super-linear-backtracking
                pattern: e(/(^(__?)<MOD>*).+?(?=\2)/.source),
                lookbehind: !0
              },
              // ??cite??
              cite: {
                // eslint-disable-next-line regexp/no-super-linear-backtracking
                pattern: e(/(^\?\?<MOD>*).+?(?=\?\?)/.source),
                lookbehind: !0,
                alias: "string"
              },
              // @code@
              code: {
                // eslint-disable-next-line regexp/no-super-linear-backtracking
                pattern: e(/(^@<MOD>*).+?(?=@)/.source),
                lookbehind: !0,
                alias: "keyword"
              },
              // +inserted+
              inserted: {
                // eslint-disable-next-line regexp/no-super-linear-backtracking
                pattern: e(/(^\+<MOD>*).+?(?=\+)/.source),
                lookbehind: !0
              },
              // -deleted-
              deleted: {
                // eslint-disable-next-line regexp/no-super-linear-backtracking
                pattern: e(/(^-<MOD>*).+?(?=-)/.source),
                lookbehind: !0
              },
              // %span%
              span: {
                // eslint-disable-next-line regexp/no-super-linear-backtracking
                pattern: e(/(^%<MOD>*).+?(?=%)/.source),
                lookbehind: !0
              },
              modifier: {
                pattern: e(
                  /(^\*\*|__|\?\?|[*_%@+\-^~])<MOD>+/.source
                ),
                lookbehind: !0,
                inside: n
              },
              punctuation: /[*_%?@+\-^~]+/
            }
          },
          // [alias]http://example.com
          "link-ref": {
            pattern: /^\[[^\]]+\]\S+$/m,
            inside: {
              string: {
                pattern: /(^\[)[^\]]+(?=\])/,
                lookbehind: !0
              },
              url: {
                pattern: /(^\])\S+$/,
                lookbehind: !0
              },
              punctuation: /[\[\]]/
            }
          },
          // "text":http://example.com
          // "text":link-ref
          link: {
            // eslint-disable-next-line regexp/no-super-linear-backtracking
            pattern: e(
              /"<MOD>*[^"]+":.+?(?=[^\w/]?(?:\s|$))/.source
            ),
            inside: {
              text: {
                // eslint-disable-next-line regexp/no-super-linear-backtracking
                pattern: e(/(^"<MOD>*)[^"]+(?=")/.source),
                lookbehind: !0
              },
              modifier: {
                pattern: e(/(^")<MOD>+/.source),
                lookbehind: !0,
                inside: n
              },
              url: {
                pattern: /(:).+/,
                lookbehind: !0
              },
              punctuation: /[":]/
            }
          },
          // !image.jpg!
          // !image.jpg(Title)!:http://example.com
          image: {
            pattern: e(
              /!(?:<MOD>|<PAR>|[<>=])*(?![<>=])[^!\s()]+(?:\([^)]+\))?!(?::.+?(?=[^\w/]?(?:\s|$)))?/.source
            ),
            inside: {
              source: {
                pattern: e(
                  /(^!(?:<MOD>|<PAR>|[<>=])*)(?![<>=])[^!\s()]+(?:\([^)]+\))?(?=!)/.source
                ),
                lookbehind: !0,
                alias: "url"
              },
              modifier: {
                pattern: e(/(^!)(?:<MOD>|<PAR>|[<>=])+/.source),
                lookbehind: !0,
                inside: n
              },
              url: {
                pattern: /(:).+/,
                lookbehind: !0
              },
              punctuation: /[!:]/
            }
          },
          // Footnote[1]
          footnote: {
            pattern: /\b\[\d+\]/,
            alias: "comment",
            inside: {
              punctuation: /\[|\]/
            }
          },
          // CSS(Cascading Style Sheet)
          acronym: {
            pattern: /\b[A-Z\d]+\([^)]+\)/,
            inside: {
              comment: {
                pattern: /(\()[^()]+(?=\))/,
                lookbehind: !0
              },
              punctuation: /[()]/
            }
          },
          // Prism(C)
          mark: {
            pattern: /\b\((?:C|R|TM)\)/,
            alias: "comment",
            inside: {
              punctuation: /[()]/
            }
          }
        }
      }
    }), i = c.phrase.inside, t = {
      inline: i.inline,
      link: i.link,
      image: i.image,
      footnote: i.footnote,
      acronym: i.acronym,
      mark: i.mark
    };
    c.tag.pattern = /<\/?(?!\d)[a-z0-9]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+))?)*\s*\/?>/i;
    var d = i.inline.inside;
    d.bold.inside = t, d.italic.inside = t, d.inserted.inside = t, d.deleted.inside = t, d.span.inside = t;
    var a = i.table.inside;
    a.inline = t.inline, a.link = t.link, a.image = t.image, a.footnote = t.footnote, a.acronym = t.acronym, a.mark = t.mark;
  })(s);
}
const g = /* @__PURE__ */ m(p), O = /* @__PURE__ */ f({
  __proto__: null,
  default: g
}, [p]);
export {
  O as t
};
