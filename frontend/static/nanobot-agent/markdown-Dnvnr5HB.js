import { g as x } from "./react-vendor-ASUsaCHq.js";
function $(c, e) {
  for (var f = 0; f < e.length; f++) {
    const o = e[f];
    if (typeof o != "string" && !Array.isArray(o)) {
      for (const s in o)
        if (s !== "default" && !(s in c)) {
          const i = Object.getOwnPropertyDescriptor(o, s);
          i && Object.defineProperty(c, s, i.get ? i : {
            enumerable: !0,
            get: () => o[s]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(c, Symbol.toStringTag, { value: "Module" }));
}
var m = k;
k.displayName = "markdown";
k.aliases = ["md"];
function k(c) {
  (function(e) {
    var f = /(?:\\.|[^\\\n\r]|(?:\n|\r\n?)(?![\r\n]))/.source;
    function o(t) {
      return t = t.replace(/<inner>/g, function() {
        return f;
      }), RegExp(/((?:^|[^\\])(?:\\{2})*)/.source + "(?:" + t + ")");
    }
    var s = /(?:\\.|``(?:[^`\r\n]|`(?!`))+``|`[^`\r\n]+`|[^\\|\r\n`])+/.source, i = /\|?__(?:\|__)+\|?(?:(?:\n|\r\n?)|(?![\s\S]))/.source.replace(
      /__/g,
      function() {
        return s;
      }
    ), b = /\|?[ \t]*:?-{3,}:?[ \t]*(?:\|[ \t]*:?-{3,}:?[ \t]*)+\|?(?:\n|\r\n?)/.source;
    e.languages.markdown = e.languages.extend("markup", {}), e.languages.insertBefore("markdown", "prolog", {
      "front-matter-block": {
        pattern: /(^(?:\s*[\r\n])?)---(?!.)[\s\S]*?[\r\n]---(?!.)/,
        lookbehind: !0,
        greedy: !0,
        inside: {
          punctuation: /^---|---$/,
          "front-matter": {
            pattern: /\S+(?:\s+\S+)*/,
            alias: ["yaml", "language-yaml"],
            inside: e.languages.yaml
          }
        }
      },
      blockquote: {
        // > ...
        pattern: /^>(?:[\t ]*>)*/m,
        alias: "punctuation"
      },
      table: {
        pattern: RegExp(
          "^" + i + b + "(?:" + i + ")*",
          "m"
        ),
        inside: {
          "table-data-rows": {
            pattern: RegExp(
              "^(" + i + b + ")(?:" + i + ")*$"
            ),
            lookbehind: !0,
            inside: {
              "table-data": {
                pattern: RegExp(s),
                inside: e.languages.markdown
              },
              punctuation: /\|/
            }
          },
          "table-line": {
            pattern: RegExp("^(" + i + ")" + b + "$"),
            lookbehind: !0,
            inside: {
              punctuation: /\||:?-{3,}:?/
            }
          },
          "table-header-row": {
            pattern: RegExp("^" + i + "$"),
            inside: {
              "table-header": {
                pattern: RegExp(s),
                alias: "important",
                inside: e.languages.markdown
              },
              punctuation: /\|/
            }
          }
        }
      },
      code: [
        {
          // Prefixed by 4 spaces or 1 tab and preceded by an empty line
          pattern: /((?:^|\n)[ \t]*\n|(?:^|\r\n?)[ \t]*\r\n?)(?: {4}|\t).+(?:(?:\n|\r\n?)(?: {4}|\t).+)*/,
          lookbehind: !0,
          alias: "keyword"
        },
        {
          // ```optional language
          // code block
          // ```
          pattern: /^```[\s\S]*?^```$/m,
          greedy: !0,
          inside: {
            "code-block": {
              pattern: /^(```.*(?:\n|\r\n?))[\s\S]+?(?=(?:\n|\r\n?)^```$)/m,
              lookbehind: !0
            },
            "code-language": {
              pattern: /^(```).+/,
              lookbehind: !0
            },
            punctuation: /```/
          }
        }
      ],
      title: [
        {
          // title 1
          // =======
          // title 2
          // -------
          pattern: /\S.*(?:\n|\r\n?)(?:==+|--+)(?=[ \t]*$)/m,
          alias: "important",
          inside: {
            punctuation: /==+$|--+$/
          }
        },
        {
          // # title 1
          // ###### title 6
          pattern: /(^\s*)#.+/m,
          lookbehind: !0,
          alias: "important",
          inside: {
            punctuation: /^#+|#+$/
          }
        }
      ],
      hr: {
        // ***
        // ---
        // * * *
        // -----------
        pattern: /(^\s*)([*-])(?:[\t ]*\2){2,}(?=\s*$)/m,
        lookbehind: !0,
        alias: "punctuation"
      },
      list: {
        // * item
        // + item
        // - item
        // 1. item
        pattern: /(^\s*)(?:[*+-]|\d+\.)(?=[\t ].)/m,
        lookbehind: !0,
        alias: "punctuation"
      },
      "url-reference": {
        // [id]: http://example.com "Optional title"
        // [id]: http://example.com 'Optional title'
        // [id]: http://example.com (Optional title)
        // [id]: <http://example.com> "Optional title"
        pattern: /!?\[[^\]]+\]:[\t ]+(?:\S+|<(?:\\.|[^>\\])+>)(?:[\t ]+(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\)))?/,
        inside: {
          variable: {
            pattern: /^(!?\[)[^\]]+/,
            lookbehind: !0
          },
          string: /(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\))$/,
          punctuation: /^[\[\]!:]|[<>]/
        },
        alias: "url"
      },
      bold: {
        // **strong**
        // __strong__
        // allow one nested instance of italic text using the same delimiter
        pattern: o(
          /\b__(?:(?!_)<inner>|_(?:(?!_)<inner>)+_)+__\b|\*\*(?:(?!\*)<inner>|\*(?:(?!\*)<inner>)+\*)+\*\*/.source
        ),
        lookbehind: !0,
        greedy: !0,
        inside: {
          content: {
            pattern: /(^..)[\s\S]+(?=..$)/,
            lookbehind: !0,
            inside: {}
            // see below
          },
          punctuation: /\*\*|__/
        }
      },
      italic: {
        // *em*
        // _em_
        // allow one nested instance of bold text using the same delimiter
        pattern: o(
          /\b_(?:(?!_)<inner>|__(?:(?!_)<inner>)+__)+_\b|\*(?:(?!\*)<inner>|\*\*(?:(?!\*)<inner>)+\*\*)+\*/.source
        ),
        lookbehind: !0,
        greedy: !0,
        inside: {
          content: {
            pattern: /(^.)[\s\S]+(?=.$)/,
            lookbehind: !0,
            inside: {}
            // see below
          },
          punctuation: /[*_]/
        }
      },
      strike: {
        // ~~strike through~~
        // ~strike~
        // eslint-disable-next-line regexp/strict
        pattern: o(/(~~?)(?:(?!~)<inner>)+\2/.source),
        lookbehind: !0,
        greedy: !0,
        inside: {
          content: {
            pattern: /(^~~?)[\s\S]+(?=\1$)/,
            lookbehind: !0,
            inside: {}
            // see below
          },
          punctuation: /~~?/
        }
      },
      "code-snippet": {
        // `code`
        // ``code``
        pattern: /(^|[^\\`])(?:``[^`\r\n]+(?:`[^`\r\n]+)*``(?!`)|`[^`\r\n]+`(?!`))/,
        lookbehind: !0,
        greedy: !0,
        alias: ["code", "keyword"]
      },
      url: {
        // [example](http://example.com "Optional title")
        // [example][id]
        // [example] [id]
        pattern: o(
          /!?\[(?:(?!\])<inner>)+\](?:\([^\s)]+(?:[\t ]+"(?:\\.|[^"\\])*")?\)|[ \t]?\[(?:(?!\])<inner>)+\])/.source
        ),
        lookbehind: !0,
        greedy: !0,
        inside: {
          operator: /^!/,
          content: {
            pattern: /(^\[)[^\]]+(?=\])/,
            lookbehind: !0,
            inside: {}
            // see below
          },
          variable: {
            pattern: /(^\][ \t]?\[)[^\]]+(?=\]$)/,
            lookbehind: !0
          },
          url: {
            pattern: /(^\]\()[^\s)]+/,
            lookbehind: !0
          },
          string: {
            pattern: /(^[ \t]+)"(?:\\.|[^"\\])*"(?=\)$)/,
            lookbehind: !0
          }
        }
      }
    }), ["url", "bold", "italic", "strike"].forEach(function(t) {
      ["url", "bold", "italic", "strike", "code-snippet"].forEach(function(n) {
        t !== n && (e.languages.markdown[t].inside.content.inside[n] = e.languages.markdown[n]);
      });
    }), e.hooks.add("after-tokenize", function(t) {
      if (t.language !== "markdown" && t.language !== "md")
        return;
      function n(u) {
        if (!(!u || typeof u == "string"))
          for (var r = 0, p = u.length; r < p; r++) {
            var l = u[r];
            if (l.type !== "code") {
              n(l.content);
              continue;
            }
            var d = l.content[1], a = l.content[3];
            if (d && a && d.type === "code-language" && a.type === "code-block" && typeof d.content == "string") {
              var g = d.content.replace(/\b#/g, "sharp").replace(/\b\+\+/g, "pp");
              g = (/[a-z][\w-]*/i.exec(g) || [""])[0].toLowerCase();
              var h = "language-" + g;
              a.alias ? typeof a.alias == "string" ? a.alias = [a.alias, h] : a.alias.push(h) : a.alias = [h];
            }
          }
      }
      n(t.tokens);
    }), e.hooks.add("wrap", function(t) {
      if (t.type === "code-block") {
        for (var n = "", u = 0, r = t.classes.length; u < r; u++) {
          var p = t.classes[u], l = /language-(.+)/.exec(p);
          if (l) {
            n = l[1];
            break;
          }
        }
        var d = e.languages[n];
        if (d)
          t.content = e.highlight(
            v(t.content.value),
            d,
            n
          );
        else if (n && n !== "none" && e.plugins.autoloader) {
          var a = "md-" + (/* @__PURE__ */ new Date()).valueOf() + "-" + Math.floor(Math.random() * 1e16);
          t.attributes.id = a, e.plugins.autoloader.loadLanguages(n, function() {
            var g = document.getElementById(a);
            g && (g.innerHTML = e.highlight(
              g.textContent,
              e.languages[n],
              n
            ));
          });
        }
      }
    });
    var _ = RegExp(e.languages.markup.tag.pattern.source, "gi"), y = {
      amp: "&",
      lt: "<",
      gt: ">",
      quot: '"'
    }, w = String.fromCodePoint || String.fromCharCode;
    function v(t) {
      var n = t.replace(_, "");
      return n = n.replace(/&(\w{1,8}|#x?[\da-f]{1,8});/gi, function(u, r) {
        if (r = r.toLowerCase(), r[0] === "#") {
          var p;
          return r[1] === "x" ? p = parseInt(r.slice(2), 16) : p = Number(r.slice(1)), w(p);
        } else {
          var l = y[r];
          return l || u;
        }
      }), n;
    }
    e.languages.md = e.languages.markdown;
  })(c);
}
const S = /* @__PURE__ */ x(m), C = /* @__PURE__ */ $({
  __proto__: null,
  default: S
}, [m]);
export {
  C as m
};
