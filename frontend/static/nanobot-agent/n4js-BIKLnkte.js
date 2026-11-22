import { g as i } from "./react-vendor-ASUsaCHq.js";
function c(e, s) {
  for (var a = 0; a < s.length; a++) {
    const t = s[a];
    if (typeof t != "string" && !Array.isArray(t)) {
      for (const n in t)
        if (n !== "default" && !(n in e)) {
          const r = Object.getOwnPropertyDescriptor(t, n);
          r && Object.defineProperty(e, n, r.get ? r : {
            enumerable: !0,
            get: () => t[n]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }));
}
var l = o;
o.displayName = "n4js";
o.aliases = ["n4jsd"];
function o(e) {
  e.languages.n4js = e.languages.extend("javascript", {
    // Keywords from N4JS language spec: https://numberfour.github.io/n4js/spec/N4JSSpec.html
    keyword: /\b(?:Array|any|boolean|break|case|catch|class|const|constructor|continue|debugger|declare|default|delete|do|else|enum|export|extends|false|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|module|new|null|number|package|private|protected|public|return|set|static|string|super|switch|this|throw|true|try|typeof|var|void|while|with|yield)\b/
  }), e.languages.insertBefore("n4js", "constant", {
    // Annotations in N4JS spec: https://numberfour.github.io/n4js/spec/N4JSSpec.html#_annotations
    annotation: {
      pattern: /@+\w+/,
      alias: "operator"
    }
  }), e.languages.n4jsd = e.languages.n4js;
}
const u = /* @__PURE__ */ i(l), g = /* @__PURE__ */ c({
  __proto__: null,
  default: u
}, [l]);
export {
  g as n
};
