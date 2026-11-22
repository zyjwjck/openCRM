import { g as u } from "./react-vendor-ASUsaCHq.js";
import { a as i } from "./bash-KE62vJQD.js";
function c(s, e) {
  for (var r = 0; r < e.length; r++) {
    const t = e[r];
    if (typeof t != "string" && !Array.isArray(t)) {
      for (const n in t)
        if (n !== "default" && !(n in s)) {
          const a = Object.getOwnPropertyDescriptor(t, n);
          a && Object.defineProperty(s, n, a.get ? a : {
            enumerable: !0,
            get: () => t[n]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(s, Symbol.toStringTag, { value: "Module" }));
}
var g = i, l = o;
o.displayName = "shellSession";
o.aliases = [];
function o(s) {
  s.register(g), function(e) {
    var r = [
      // normal string
      /"(?:\\[\s\S]|\$\([^)]+\)|\$(?!\()|`[^`]+`|[^"\\`$])*"/.source,
      /'[^']*'/.source,
      /\$'(?:[^'\\]|\\[\s\S])*'/.source,
      // here doc
      // 2 capturing groups
      /<<-?\s*(["']?)(\w+)\1\s[\s\S]*?[\r\n]\2/.source
    ].join("|");
    e.languages["shell-session"] = {
      command: {
        pattern: RegExp(
          // user info
          /^/.source + "(?:" + // <user> ":" ( <path> )?
          (/[^\s@:$#%*!/\\]+@[^\r\n@:$#%*!/\\]+(?::[^\0-\x1F$#%*?"<>:;|]+)?/.source + "|" + // <path>
          // Since the path pattern is quite general, we will require it to start with a special character to
          // prevent false positives.
          /[/~.][^\0-\x1F$#%*?"<>@:;|]*/.source) + ")?" + // shell symbol
          /[$#%](?=\s)/.source + // bash command
          /(?:[^\\\r\n \t'"<$]|[ \t](?:(?!#)|#.*$)|\\(?:[^\r]|\r\n?)|\$(?!')|<(?!<)|<<str>>)+/.source.replace(
            /<<str>>/g,
            function() {
              return r;
            }
          ),
          "m"
        ),
        greedy: !0,
        inside: {
          info: {
            // foo@bar:~/files$ exit
            // foo@bar$ exit
            // ~/files$ exit
            pattern: /^[^#$%]+/,
            alias: "punctuation",
            inside: {
              user: /^[^\s@:$#%*!/\\]+@[^\r\n@:$#%*!/\\]+/,
              punctuation: /:/,
              path: /[\s\S]+/
            }
          },
          bash: {
            pattern: /(^[$#%]\s*)\S[\s\S]*/,
            lookbehind: !0,
            alias: "language-bash",
            inside: e.languages.bash
          },
          "shell-symbol": {
            pattern: /^[$#%]/,
            alias: "important"
          }
        }
      },
      output: /.(?:.*(?:[\r\n]|.$))*/
    }, e.languages["sh-session"] = e.languages.shellsession = e.languages["shell-session"];
  }(s);
}
const p = /* @__PURE__ */ u(l), h = /* @__PURE__ */ c({
  __proto__: null,
  default: p
}, [l]);
export {
  h as s
};
