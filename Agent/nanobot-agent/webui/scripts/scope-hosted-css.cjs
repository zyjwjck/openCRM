/** Post-process the hosted CSS build so every rule is scoped to the WebUI
 *  mount container. Without this, Tailwind 3 utilities (e.g. `.hidden`) leak
 *  into the host document and override the host app's Tailwind 4 responsive
 *  classes (e.g. `md:block`), hiding the CRM sidebar.
 *
 *  Run automatically by `npm run build:hosted`.
 */
const fs = require("node:fs");
const path = require("node:path");
const postcss = require("postcss");

const cssPath = path.resolve(
  __dirname,
  "../../../../frontend/static/nanobot-agent/style.css",
);
const SCOPE = ":where(.nanobot-hosted)";

function scopeSelector(selector) {
  return selector
    .split(",")
    .map((part) => {
      const s = part.trim();
      if (!s || /^\d+(\.\d+)?%$/.test(s)) return part;
      if (s.includes(SCOPE)) return part;
      if (s === ":root") return SCOPE;
      if (s.startsWith(":root ")) return `${SCOPE} ${s.slice(6)}`;
      if (s === ".dark") return `.dark ${SCOPE}`;
      if (s.startsWith(".dark ")) return `.dark ${SCOPE} ${s.slice(6)}`;
      return `${SCOPE} ${s}`;
    })
    .join(",");
}

const css = fs.readFileSync(cssPath, "utf8");
postcss([
  {
    postcssPlugin: "scope-hosted-css",
    OnceExit(root) {
      // Convert viewport width media queries to container queries so the
      // WebUI's responsive (compact/"phone") layout follows the width of its
      // mount container (e.g. the leads AI drawer), not the browser viewport.
      root.walkAtRules("media", (atRule) => {
        // Only width-based queries; leave prefers-reduced-motion, pointer, etc.
        if (/\b(min|max)-width\s*:/.test(atRule.params)) {
          atRule.name = "container";
          atRule.params = `nanobot ${atRule.params}`;
        }
      });
    },
    Rule(rule) {
      const parent = rule.parent;
      if (!parent) return;
      if (
        parent.type === "atrule" &&
        /keyframes|font-face|font-palette-values/i.test(parent.name)
      ) {
        return;
      }
      rule.selector = scopeSelector(rule.selector);
    },
  },
])
  .process(css, { from: cssPath })
  .then((result) => {
    fs.writeFileSync(cssPath, result.css);
    // The gzip plugin ran before scoping; its precompressed CSS would serve
    // the unscoped bytes. Drop precompressed files so static servers use the
    // freshly scoped source CSS.
    const outDir = path.dirname(cssPath);
    for (const entry of fs.readdirSync(outDir)) {
      if (entry.endsWith(".gz")) fs.unlinkSync(path.join(outDir, entry));
    }
    console.log("scoped hosted CSS:", cssPath, result.css.length, "bytes");
  });
