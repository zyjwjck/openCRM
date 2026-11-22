import { R as J, g as me, c as je } from "./react-vendor-ASUsaCHq.js";
function ve(e, t) {
  for (var r = 0; r < t.length; r++) {
    const o = t[r];
    if (typeof o != "string" && !Array.isArray(o)) {
      for (const c in o)
        if (c !== "default" && !(c in e)) {
          const h = Object.getOwnPropertyDescriptor(o, c);
          h && Object.defineProperty(e, c, h.get ? h : {
            enumerable: !0,
            get: () => o[c]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }));
}
function Q(e) {
  "@babel/helpers - typeof";
  return Q = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Q(e);
}
function ot(e, t, r, o, c, h, k) {
  try {
    var s = e[h](k), b = s.value;
  } catch (w) {
    return void r(w);
  }
  s.done ? t(b) : Promise.resolve(b).then(o, c);
}
function Ct(e) {
  return function() {
    var t = this, r = arguments;
    return new Promise(function(o, c) {
      var h = e.apply(t, r);
      function k(b) {
        ot(h, o, c, k, s, "next", b);
      }
      function s(b) {
        ot(h, o, c, k, s, "throw", b);
      }
      k(void 0);
    });
  };
}
function Le() {
  return Le = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var o in r) ({}).hasOwnProperty.call(r, o) && (e[o] = r[o]);
    }
    return e;
  }, Le.apply(null, arguments);
}
function an(e, t) {
  if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
}
function ln(e, t) {
  if (Q(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var o = r.call(e, t);
    if (Q(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function At(e) {
  var t = ln(e, "string");
  return Q(t) == "symbol" ? t : t + "";
}
function at(e, t) {
  for (var r = 0; r < t.length; r++) {
    var o = t[r];
    o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, At(o.key), o);
  }
}
function cn(e, t, r) {
  return t && at(e.prototype, t), r && at(e, r), Object.defineProperty(e, "prototype", {
    writable: !1
  }), e;
}
function sn(e) {
  if (e === void 0) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function un(e, t) {
  if (t && (Q(t) == "object" || typeof t == "function")) return t;
  if (t !== void 0) throw new TypeError("Derived constructors may only return object or undefined");
  return sn(e);
}
function Ce(e) {
  return Ce = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(t) {
    return t.__proto__ || Object.getPrototypeOf(t);
  }, Ce(e);
}
function $e(e, t) {
  return $e = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(r, o) {
    return r.__proto__ = o, r;
  }, $e(e, t);
}
function pn(e, t) {
  if (typeof t != "function" && t !== null) throw new TypeError("Super expression must either be null or a function");
  e.prototype = Object.create(t && t.prototype, {
    constructor: {
      value: e,
      writable: !0,
      configurable: !0
    }
  }), Object.defineProperty(e, "prototype", {
    writable: !1
  }), t && $e(e, t);
}
function te(e, t, r) {
  return (t = At(t)) in e ? Object.defineProperty(e, t, {
    value: r,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[t] = r, e;
}
function hn(e, t) {
  if (e == null) return {};
  var r = {};
  for (var o in e) if ({}.hasOwnProperty.call(e, o)) {
    if (t.indexOf(o) !== -1) continue;
    r[o] = e[o];
  }
  return r;
}
function fn(e, t) {
  if (e == null) return {};
  var r, o, c = hn(e, t);
  if (Object.getOwnPropertySymbols) {
    var h = Object.getOwnPropertySymbols(e);
    for (o = 0; o < h.length; o++) r = h[o], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (c[r] = e[r]);
  }
  return c;
}
function Fe(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, o = Array(t); r < t; r++) o[r] = e[r];
  return o;
}
function dn(e) {
  if (Array.isArray(e)) return Fe(e);
}
function gn(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function mn(e, t) {
  if (e) {
    if (typeof e == "string") return Fe(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? Fe(e, t) : void 0;
  }
}
function vn() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function _e(e) {
  return dn(e) || gn(e) || mn(e) || vn();
}
function it(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    t && (o = o.filter(function(c) {
      return Object.getOwnPropertyDescriptor(e, c).enumerable;
    })), r.push.apply(r, o);
  }
  return r;
}
function ue(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? it(Object(r), !0).forEach(function(o) {
      te(e, o, r[o]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : it(Object(r)).forEach(function(o) {
      Object.defineProperty(e, o, Object.getOwnPropertyDescriptor(r, o));
    });
  }
  return e;
}
function bn(e) {
  var t = e.length;
  if (t === 0 || t === 1) return e;
  if (t === 2)
    return [e[0], e[1], "".concat(e[0], ".").concat(e[1]), "".concat(e[1], ".").concat(e[0])];
  if (t === 3)
    return [e[0], e[1], e[2], "".concat(e[0], ".").concat(e[1]), "".concat(e[0], ".").concat(e[2]), "".concat(e[1], ".").concat(e[0]), "".concat(e[1], ".").concat(e[2]), "".concat(e[2], ".").concat(e[0]), "".concat(e[2], ".").concat(e[1]), "".concat(e[0], ".").concat(e[1], ".").concat(e[2]), "".concat(e[0], ".").concat(e[2], ".").concat(e[1]), "".concat(e[1], ".").concat(e[0], ".").concat(e[2]), "".concat(e[1], ".").concat(e[2], ".").concat(e[0]), "".concat(e[2], ".").concat(e[0], ".").concat(e[1]), "".concat(e[2], ".").concat(e[1], ".").concat(e[0])];
  if (t >= 4)
    return [e[0], e[1], e[2], e[3], "".concat(e[0], ".").concat(e[1]), "".concat(e[0], ".").concat(e[2]), "".concat(e[0], ".").concat(e[3]), "".concat(e[1], ".").concat(e[0]), "".concat(e[1], ".").concat(e[2]), "".concat(e[1], ".").concat(e[3]), "".concat(e[2], ".").concat(e[0]), "".concat(e[2], ".").concat(e[1]), "".concat(e[2], ".").concat(e[3]), "".concat(e[3], ".").concat(e[0]), "".concat(e[3], ".").concat(e[1]), "".concat(e[3], ".").concat(e[2]), "".concat(e[0], ".").concat(e[1], ".").concat(e[2]), "".concat(e[0], ".").concat(e[1], ".").concat(e[3]), "".concat(e[0], ".").concat(e[2], ".").concat(e[1]), "".concat(e[0], ".").concat(e[2], ".").concat(e[3]), "".concat(e[0], ".").concat(e[3], ".").concat(e[1]), "".concat(e[0], ".").concat(e[3], ".").concat(e[2]), "".concat(e[1], ".").concat(e[0], ".").concat(e[2]), "".concat(e[1], ".").concat(e[0], ".").concat(e[3]), "".concat(e[1], ".").concat(e[2], ".").concat(e[0]), "".concat(e[1], ".").concat(e[2], ".").concat(e[3]), "".concat(e[1], ".").concat(e[3], ".").concat(e[0]), "".concat(e[1], ".").concat(e[3], ".").concat(e[2]), "".concat(e[2], ".").concat(e[0], ".").concat(e[1]), "".concat(e[2], ".").concat(e[0], ".").concat(e[3]), "".concat(e[2], ".").concat(e[1], ".").concat(e[0]), "".concat(e[2], ".").concat(e[1], ".").concat(e[3]), "".concat(e[2], ".").concat(e[3], ".").concat(e[0]), "".concat(e[2], ".").concat(e[3], ".").concat(e[1]), "".concat(e[3], ".").concat(e[0], ".").concat(e[1]), "".concat(e[3], ".").concat(e[0], ".").concat(e[2]), "".concat(e[3], ".").concat(e[1], ".").concat(e[0]), "".concat(e[3], ".").concat(e[1], ".").concat(e[2]), "".concat(e[3], ".").concat(e[2], ".").concat(e[0]), "".concat(e[3], ".").concat(e[2], ".").concat(e[1]), "".concat(e[0], ".").concat(e[1], ".").concat(e[2], ".").concat(e[3]), "".concat(e[0], ".").concat(e[1], ".").concat(e[3], ".").concat(e[2]), "".concat(e[0], ".").concat(e[2], ".").concat(e[1], ".").concat(e[3]), "".concat(e[0], ".").concat(e[2], ".").concat(e[3], ".").concat(e[1]), "".concat(e[0], ".").concat(e[3], ".").concat(e[1], ".").concat(e[2]), "".concat(e[0], ".").concat(e[3], ".").concat(e[2], ".").concat(e[1]), "".concat(e[1], ".").concat(e[0], ".").concat(e[2], ".").concat(e[3]), "".concat(e[1], ".").concat(e[0], ".").concat(e[3], ".").concat(e[2]), "".concat(e[1], ".").concat(e[2], ".").concat(e[0], ".").concat(e[3]), "".concat(e[1], ".").concat(e[2], ".").concat(e[3], ".").concat(e[0]), "".concat(e[1], ".").concat(e[3], ".").concat(e[0], ".").concat(e[2]), "".concat(e[1], ".").concat(e[3], ".").concat(e[2], ".").concat(e[0]), "".concat(e[2], ".").concat(e[0], ".").concat(e[1], ".").concat(e[3]), "".concat(e[2], ".").concat(e[0], ".").concat(e[3], ".").concat(e[1]), "".concat(e[2], ".").concat(e[1], ".").concat(e[0], ".").concat(e[3]), "".concat(e[2], ".").concat(e[1], ".").concat(e[3], ".").concat(e[0]), "".concat(e[2], ".").concat(e[3], ".").concat(e[0], ".").concat(e[1]), "".concat(e[2], ".").concat(e[3], ".").concat(e[1], ".").concat(e[0]), "".concat(e[3], ".").concat(e[0], ".").concat(e[1], ".").concat(e[2]), "".concat(e[3], ".").concat(e[0], ".").concat(e[2], ".").concat(e[1]), "".concat(e[3], ".").concat(e[1], ".").concat(e[0], ".").concat(e[2]), "".concat(e[3], ".").concat(e[1], ".").concat(e[2], ".").concat(e[0]), "".concat(e[3], ".").concat(e[2], ".").concat(e[0], ".").concat(e[1]), "".concat(e[3], ".").concat(e[2], ".").concat(e[1], ".").concat(e[0])];
}
var Ee = {};
function yn(e) {
  if (e.length === 0 || e.length === 1) return e;
  var t = e.join(".");
  return Ee[t] || (Ee[t] = bn(e)), Ee[t];
}
function Ot(e) {
  var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, r = arguments.length > 2 ? arguments[2] : void 0, o = e.filter(function(h) {
    return h !== "token";
  }), c = yn(o);
  return c.reduce(function(h, k) {
    return ue(ue({}, h), r[k]);
  }, t);
}
function Ne(e) {
  return e.join(" ");
}
function Et(e, t) {
  var r = 0;
  return function(o) {
    return r += 1, o.map(function(c, h) {
      return Re({
        node: c,
        stylesheet: e,
        useInlineStyles: t,
        key: "code-segment-".concat(r, "-").concat(h)
      });
    });
  };
}
function Re(e) {
  var t = e.node, r = e.stylesheet, o = e.style, c = o === void 0 ? {} : o, h = e.useInlineStyles, k = e.key, s = t.properties, b = t.type, w = t.tagName, A = t.value;
  if (b === "text")
    return A;
  if (w) {
    var L = Et(r, h), N;
    if (!h)
      N = ue(ue({}, s), {}, {
        className: Ne(s.className)
      });
    else {
      var $ = Object.keys(r).reduce(function(z, g) {
        return g.split(".").forEach(function(u) {
          z.includes(u) || z.push(u);
        }), z;
      }, []), R = s.className && s.className.includes("token") ? ["token"] : [], I = s.className && R.concat(s.className.filter(function(z) {
        return !$.includes(z);
      }));
      N = ue(ue({}, s), {}, {
        className: Ne(I) || void 0,
        style: Ot(s.className, Object.assign({}, s.style, c), r)
      });
    }
    var O = L(t.children);
    return /* @__PURE__ */ J.createElement(w, Le({
      key: k
    }, N), O);
  }
}
const cl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  createChildren: Et,
  createClassNameString: Ne,
  createStyleObject: Ot,
  default: Re
}, Symbol.toStringTag, { value: "Module" })), kn = function(e, t) {
  var r = e.listLanguages();
  return r.indexOf(t) !== -1;
};
var wn = ["language", "children", "style", "customStyle", "codeTagProps", "useInlineStyles", "showLineNumbers", "showInlineLineNumbers", "startingLineNumber", "lineNumberContainerStyle", "lineNumberStyle", "wrapLines", "wrapLongLines", "lineProps", "renderer", "PreTag", "CodeTag", "code", "astGenerator"];
function lt(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    t && (o = o.filter(function(c) {
      return Object.getOwnPropertyDescriptor(e, c).enumerable;
    })), r.push.apply(r, o);
  }
  return r;
}
function ne(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? lt(Object(r), !0).forEach(function(o) {
      te(e, o, r[o]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : lt(Object(r)).forEach(function(o) {
      Object.defineProperty(e, o, Object.getOwnPropertyDescriptor(r, o));
    });
  }
  return e;
}
var xn = /\n/g;
function Sn(e) {
  return e.match(xn);
}
function jn(e) {
  var t = e.lines, r = e.startingLineNumber, o = e.style;
  return t.map(function(c, h) {
    var k = h + r;
    return /* @__PURE__ */ J.createElement("span", {
      key: "line-".concat(h),
      className: "react-syntax-highlighter-line-number",
      style: typeof o == "function" ? o(k) : o
    }, "".concat(k, `
`));
  });
}
function Ln(e) {
  var t = e.codeString, r = e.codeStyle, o = e.containerStyle, c = o === void 0 ? {
    float: "left",
    paddingRight: "10px"
  } : o, h = e.numberStyle, k = h === void 0 ? {} : h, s = e.startingLineNumber;
  return /* @__PURE__ */ J.createElement("code", {
    style: Object.assign({}, r, c)
  }, jn({
    lines: t.replace(/\n$/, "").split(`
`),
    style: k,
    startingLineNumber: s
  }));
}
function Cn(e) {
  return "".concat(e.toString().length, ".25em");
}
function $t(e, t) {
  return {
    type: "element",
    tagName: "span",
    properties: {
      key: "line-number--".concat(e),
      className: ["comment", "linenumber", "react-syntax-highlighter-line-number"],
      style: t
    },
    children: [{
      type: "text",
      value: e
    }]
  };
}
function Ft(e, t, r) {
  var o = {
    display: "inline-block",
    minWidth: Cn(r),
    paddingRight: "1em",
    textAlign: "right",
    userSelect: "none"
  }, c = typeof e == "function" ? e(t) : e, h = ne(ne({}, o), c);
  return h;
}
function Se(e) {
  var t = e.children, r = e.lineNumber, o = e.lineNumberStyle, c = e.largestLineNumber, h = e.showInlineLineNumbers, k = e.lineProps, s = k === void 0 ? {} : k, b = e.className, w = b === void 0 ? [] : b, A = e.showLineNumbers, L = e.wrapLongLines, N = e.wrapLines, $ = N === void 0 ? !1 : N, R = $ ? ne({}, typeof s == "function" ? s(r) : s) : {};
  if (R.className = R.className ? [].concat(_e(R.className.trim().split(/\s+/)), _e(w)) : w, r && h) {
    var I = Ft(o, r, c);
    t.unshift($t(r, I));
  }
  return L & A && (R.style = ne({
    display: "flex"
  }, R.style)), {
    type: "element",
    tagName: "span",
    properties: R,
    children: t
  };
}
function _t(e) {
  for (var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [], r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : [], o = 0; o < e.length; o++) {
    var c = e[o];
    if (c.type === "text")
      r.push(Se({
        children: [c],
        className: _e(new Set(t))
      }));
    else if (c.children) {
      var h = t.concat(c.properties.className);
      _t(c.children, h).forEach(function(k) {
        return r.push(k);
      });
    }
  }
  return r;
}
function An(e, t, r, o, c, h, k, s, b) {
  var w, A = _t(e.value), L = [], N = -1, $ = 0;
  function R(v, m) {
    var S = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : [];
    return Se({
      children: v,
      lineNumber: m,
      lineNumberStyle: s,
      largestLineNumber: k,
      showInlineLineNumbers: c,
      lineProps: r,
      className: S,
      showLineNumbers: o,
      wrapLongLines: b,
      wrapLines: t
    });
  }
  function I(v, m) {
    if (o && m && c) {
      var S = Ft(s, m, k);
      v.unshift($t(m, S));
    }
    return v;
  }
  function O(v, m) {
    var S = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : [];
    return t || S.length > 0 ? R(v, m, S) : I(v, m);
  }
  for (var z = function() {
    var m = A[$], S = m.children[0].value, C = Sn(S);
    if (C) {
      var x = S.split(`
`);
      x.forEach(function(T, P) {
        var H = o && L.length + h, U = {
          type: "text",
          value: "".concat(T, `
`)
        };
        if (P === 0) {
          var B = A.slice(N + 1, $).concat(Se({
            children: [U],
            className: m.properties.className
          })), W = O(B, H);
          L.push(W);
        } else if (P === x.length - 1) {
          var l = A[$ + 1] && A[$ + 1].children && A[$ + 1].children[0], a = {
            type: "text",
            value: "".concat(T)
          };
          if (l) {
            var i = Se({
              children: [a],
              className: m.properties.className
            });
            A.splice($ + 1, 0, i);
          } else {
            var f = [a], d = O(f, H, m.properties.className);
            L.push(d);
          }
        } else {
          var p = [U], j = O(p, H, m.properties.className);
          L.push(j);
        }
      }), N = $;
    }
    $++;
  }; $ < A.length; )
    z();
  if (N !== A.length - 1) {
    var g = A.slice(N + 1, A.length);
    if (g && g.length) {
      var u = o && L.length + h, y = O(g, u);
      L.push(y);
    }
  }
  return t ? L : (w = []).concat.apply(w, L);
}
function On(e) {
  var t = e.rows, r = e.stylesheet, o = e.useInlineStyles;
  return t.map(function(c, h) {
    return Re({
      node: c,
      stylesheet: r,
      useInlineStyles: o,
      key: "code-segment-".concat(h)
    });
  });
}
function Nt(e) {
  return e && typeof e.highlightAuto < "u";
}
function En(e) {
  var t = e.astGenerator, r = e.language, o = e.code, c = e.defaultCodeValue;
  if (Nt(t)) {
    var h = kn(t, r);
    return r === "text" ? {
      value: c,
      language: "text"
    } : h ? t.highlight(r, o) : t.highlightAuto(o);
  }
  try {
    return r && r !== "text" ? {
      value: t.highlight(o, r)
    } : {
      value: c
    };
  } catch {
    return {
      value: c
    };
  }
}
function $n(e, t) {
  return function(o) {
    var c, h, k = o.language, s = o.children, b = o.style, w = b === void 0 ? t : b, A = o.customStyle, L = A === void 0 ? {} : A, N = o.codeTagProps, $ = N === void 0 ? {
      className: k ? "language-".concat(k) : void 0,
      style: ne(ne({}, w['code[class*="language-"]']), w['code[class*="language-'.concat(k, '"]')])
    } : N, R = o.useInlineStyles, I = R === void 0 ? !0 : R, O = o.showLineNumbers, z = O === void 0 ? !1 : O, g = o.showInlineLineNumbers, u = g === void 0 ? !0 : g, y = o.startingLineNumber, v = y === void 0 ? 1 : y, m = o.lineNumberContainerStyle, S = o.lineNumberStyle, C = S === void 0 ? {} : S, x = o.wrapLines, T = o.wrapLongLines, P = T === void 0 ? !1 : T, H = o.lineProps, U = H === void 0 ? {} : H, B = o.renderer, W = o.PreTag, l = W === void 0 ? "pre" : W, a = o.CodeTag, i = a === void 0 ? "code" : a, f = o.code, d = f === void 0 ? (Array.isArray(s) ? s[0] : s) || "" : f, p = o.astGenerator, j = fn(o, wn);
    p = p || e;
    var F = z ? /* @__PURE__ */ J.createElement(Ln, {
      containerStyle: m,
      codeStyle: $.style || {},
      numberStyle: C,
      startingLineNumber: v,
      codeString: d
    }) : null, E = w.hljs || w['pre[class*="language-"]'] || {
      backgroundColor: "#fff"
    }, q = Nt(p) ? "hljs" : "prismjs", M = I ? Object.assign({}, j, {
      style: Object.assign({}, E, L)
    }) : Object.assign({}, j, {
      className: j.className ? "".concat(q, " ").concat(j.className) : q,
      style: Object.assign({}, L)
    });
    if (P ? $.style = ne({
      whiteSpace: "pre-wrap"
    }, $.style) : $.style = ne({
      whiteSpace: "pre"
    }, $.style), !p)
      return /* @__PURE__ */ J.createElement(l, M, F, /* @__PURE__ */ J.createElement(i, $, d));
    (x === void 0 && B || P) && (x = !0), B = B || On;
    var D = [{
      type: "text",
      value: d
    }], oe = En({
      astGenerator: p,
      language: k,
      code: d,
      defaultCodeValue: D
    });
    oe.language === null && (oe.value = D);
    var ke = (c = (h = d.match(/\n/g)) === null || h === void 0 ? void 0 : h.length) !== null && c !== void 0 ? c : 0, he = v + ke, le = An(oe, x, U, z, u, v, he, C, P);
    return /* @__PURE__ */ J.createElement(l, M, /* @__PURE__ */ J.createElement(i, $, !u && F, B({
      rows: le,
      stylesheet: w,
      useInlineStyles: I
    })));
  };
}
function Te() {
  /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */
  Te = function() {
    return t;
  };
  var e, t = {}, r = Object.prototype, o = r.hasOwnProperty, c = Object.defineProperty || function(l, a, i) {
    l[a] = i.value;
  }, h = typeof Symbol == "function" ? Symbol : {}, k = h.iterator || "@@iterator", s = h.asyncIterator || "@@asyncIterator", b = h.toStringTag || "@@toStringTag";
  function w(l, a, i) {
    return Object.defineProperty(l, a, { value: i, enumerable: !0, configurable: !0, writable: !0 }), l[a];
  }
  try {
    w({}, "");
  } catch {
    w = function(i, f, d) {
      return i[f] = d;
    };
  }
  function A(l, a, i, f) {
    var d = a && a.prototype instanceof z ? a : z, p = Object.create(d.prototype), j = new B(f || []);
    return c(p, "_invoke", { value: T(l, i, j) }), p;
  }
  function L(l, a, i) {
    try {
      return { type: "normal", arg: l.call(a, i) };
    } catch (f) {
      return { type: "throw", arg: f };
    }
  }
  t.wrap = A;
  var N = "suspendedStart", $ = "suspendedYield", R = "executing", I = "completed", O = {};
  function z() {
  }
  function g() {
  }
  function u() {
  }
  var y = {};
  w(y, k, function() {
    return this;
  });
  var v = Object.getPrototypeOf, m = v && v(v(W([])));
  m && m !== r && o.call(m, k) && (y = m);
  var S = u.prototype = z.prototype = Object.create(y);
  function C(l) {
    ["next", "throw", "return"].forEach(function(a) {
      w(l, a, function(i) {
        return this._invoke(a, i);
      });
    });
  }
  function x(l, a) {
    function i(d, p, j, F) {
      var E = L(l[d], l, p);
      if (E.type !== "throw") {
        var q = E.arg, M = q.value;
        return M && Q(M) == "object" && o.call(M, "__await") ? a.resolve(M.__await).then(function(D) {
          i("next", D, j, F);
        }, function(D) {
          i("throw", D, j, F);
        }) : a.resolve(M).then(function(D) {
          q.value = D, j(q);
        }, function(D) {
          return i("throw", D, j, F);
        });
      }
      F(E.arg);
    }
    var f;
    c(this, "_invoke", { value: function(p, j) {
      function F() {
        return new a(function(E, q) {
          i(p, j, E, q);
        });
      }
      return f = f ? f.then(F, F) : F();
    } });
  }
  function T(l, a, i) {
    var f = N;
    return function(d, p) {
      if (f === R) throw Error("Generator is already running");
      if (f === I) {
        if (d === "throw") throw p;
        return { value: e, done: !0 };
      }
      for (i.method = d, i.arg = p; ; ) {
        var j = i.delegate;
        if (j) {
          var F = P(j, i);
          if (F) {
            if (F === O) continue;
            return F;
          }
        }
        if (i.method === "next") i.sent = i._sent = i.arg;
        else if (i.method === "throw") {
          if (f === N) throw f = I, i.arg;
          i.dispatchException(i.arg);
        } else i.method === "return" && i.abrupt("return", i.arg);
        f = R;
        var E = L(l, a, i);
        if (E.type === "normal") {
          if (f = i.done ? I : $, E.arg === O) continue;
          return { value: E.arg, done: i.done };
        }
        E.type === "throw" && (f = I, i.method = "throw", i.arg = E.arg);
      }
    };
  }
  function P(l, a) {
    var i = a.method, f = l.iterator[i];
    if (f === e) return a.delegate = null, i === "throw" && l.iterator.return && (a.method = "return", a.arg = e, P(l, a), a.method === "throw") || i !== "return" && (a.method = "throw", a.arg = new TypeError("The iterator does not provide a '" + i + "' method")), O;
    var d = L(f, l.iterator, a.arg);
    if (d.type === "throw") return a.method = "throw", a.arg = d.arg, a.delegate = null, O;
    var p = d.arg;
    return p ? p.done ? (a[l.resultName] = p.value, a.next = l.nextLoc, a.method !== "return" && (a.method = "next", a.arg = e), a.delegate = null, O) : p : (a.method = "throw", a.arg = new TypeError("iterator result is not an object"), a.delegate = null, O);
  }
  function H(l) {
    var a = { tryLoc: l[0] };
    1 in l && (a.catchLoc = l[1]), 2 in l && (a.finallyLoc = l[2], a.afterLoc = l[3]), this.tryEntries.push(a);
  }
  function U(l) {
    var a = l.completion || {};
    a.type = "normal", delete a.arg, l.completion = a;
  }
  function B(l) {
    this.tryEntries = [{ tryLoc: "root" }], l.forEach(H, this), this.reset(!0);
  }
  function W(l) {
    if (l || l === "") {
      var a = l[k];
      if (a) return a.call(l);
      if (typeof l.next == "function") return l;
      if (!isNaN(l.length)) {
        var i = -1, f = function d() {
          for (; ++i < l.length; ) if (o.call(l, i)) return d.value = l[i], d.done = !1, d;
          return d.value = e, d.done = !0, d;
        };
        return f.next = f;
      }
    }
    throw new TypeError(Q(l) + " is not iterable");
  }
  return g.prototype = u, c(S, "constructor", { value: u, configurable: !0 }), c(u, "constructor", { value: g, configurable: !0 }), g.displayName = w(u, b, "GeneratorFunction"), t.isGeneratorFunction = function(l) {
    var a = typeof l == "function" && l.constructor;
    return !!a && (a === g || (a.displayName || a.name) === "GeneratorFunction");
  }, t.mark = function(l) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(l, u) : (l.__proto__ = u, w(l, b, "GeneratorFunction")), l.prototype = Object.create(S), l;
  }, t.awrap = function(l) {
    return { __await: l };
  }, C(x.prototype), w(x.prototype, s, function() {
    return this;
  }), t.AsyncIterator = x, t.async = function(l, a, i, f, d) {
    d === void 0 && (d = Promise);
    var p = new x(A(l, a, i, f), d);
    return t.isGeneratorFunction(a) ? p : p.next().then(function(j) {
      return j.done ? j.value : p.next();
    });
  }, C(S), w(S, b, "Generator"), w(S, k, function() {
    return this;
  }), w(S, "toString", function() {
    return "[object Generator]";
  }), t.keys = function(l) {
    var a = Object(l), i = [];
    for (var f in a) i.push(f);
    return i.reverse(), function d() {
      for (; i.length; ) {
        var p = i.pop();
        if (p in a) return d.value = p, d.done = !1, d;
      }
      return d.done = !0, d;
    };
  }, t.values = W, B.prototype = { constructor: B, reset: function(a) {
    if (this.prev = 0, this.next = 0, this.sent = this._sent = e, this.done = !1, this.delegate = null, this.method = "next", this.arg = e, this.tryEntries.forEach(U), !a) for (var i in this) i.charAt(0) === "t" && o.call(this, i) && !isNaN(+i.slice(1)) && (this[i] = e);
  }, stop: function() {
    this.done = !0;
    var a = this.tryEntries[0].completion;
    if (a.type === "throw") throw a.arg;
    return this.rval;
  }, dispatchException: function(a) {
    if (this.done) throw a;
    var i = this;
    function f(q, M) {
      return j.type = "throw", j.arg = a, i.next = q, M && (i.method = "next", i.arg = e), !!M;
    }
    for (var d = this.tryEntries.length - 1; d >= 0; --d) {
      var p = this.tryEntries[d], j = p.completion;
      if (p.tryLoc === "root") return f("end");
      if (p.tryLoc <= this.prev) {
        var F = o.call(p, "catchLoc"), E = o.call(p, "finallyLoc");
        if (F && E) {
          if (this.prev < p.catchLoc) return f(p.catchLoc, !0);
          if (this.prev < p.finallyLoc) return f(p.finallyLoc);
        } else if (F) {
          if (this.prev < p.catchLoc) return f(p.catchLoc, !0);
        } else {
          if (!E) throw Error("try statement without catch or finally");
          if (this.prev < p.finallyLoc) return f(p.finallyLoc);
        }
      }
    }
  }, abrupt: function(a, i) {
    for (var f = this.tryEntries.length - 1; f >= 0; --f) {
      var d = this.tryEntries[f];
      if (d.tryLoc <= this.prev && o.call(d, "finallyLoc") && this.prev < d.finallyLoc) {
        var p = d;
        break;
      }
    }
    p && (a === "break" || a === "continue") && p.tryLoc <= i && i <= p.finallyLoc && (p = null);
    var j = p ? p.completion : {};
    return j.type = a, j.arg = i, p ? (this.method = "next", this.next = p.finallyLoc, O) : this.complete(j);
  }, complete: function(a, i) {
    if (a.type === "throw") throw a.arg;
    return a.type === "break" || a.type === "continue" ? this.next = a.arg : a.type === "return" ? (this.rval = this.arg = a.arg, this.method = "return", this.next = "end") : a.type === "normal" && i && (this.next = i), O;
  }, finish: function(a) {
    for (var i = this.tryEntries.length - 1; i >= 0; --i) {
      var f = this.tryEntries[i];
      if (f.finallyLoc === a) return this.complete(f.completion, f.afterLoc), U(f), O;
    }
  }, catch: function(a) {
    for (var i = this.tryEntries.length - 1; i >= 0; --i) {
      var f = this.tryEntries[i];
      if (f.tryLoc === a) {
        var d = f.completion;
        if (d.type === "throw") {
          var p = d.arg;
          U(f);
        }
        return p;
      }
    }
    throw Error("illegal catch attempt");
  }, delegateYield: function(a, i, f) {
    return this.delegate = { iterator: W(a), resultName: i, nextLoc: f }, this.method === "next" && (this.arg = e), O;
  } }, t;
}
function Fn(e, t, r) {
  return t = Ce(t), un(e, Tt() ? Reflect.construct(t, r || [], Ce(e).constructor) : t.apply(e, r));
}
function Tt() {
  try {
    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
  } catch {
  }
  return (Tt = function() {
    return !!e;
  })();
}
const _n = function(e) {
  var t, r = e.loader, o = e.isLanguageRegistered, c = e.registerLanguage, h = e.languageLoaders, k = e.noAsyncLoadingLanguages, s = /* @__PURE__ */ function(b) {
    function w() {
      return an(this, w), Fn(this, w, arguments);
    }
    return pn(w, b), cn(w, [{
      key: "componentDidUpdate",
      value: function() {
        !w.isRegistered(this.props.language) && h && this.loadLanguage();
      }
    }, {
      key: "componentDidMount",
      value: function() {
        var L = this;
        w.astGeneratorPromise || w.loadAstGenerator(), w.astGenerator || w.astGeneratorPromise.then(function() {
          L.forceUpdate();
        }), !w.isRegistered(this.props.language) && h && this.loadLanguage();
      }
    }, {
      key: "loadLanguage",
      value: function() {
        var L = this, N = this.props.language;
        N !== "text" && w.loadLanguage(N).then(function() {
          return L.forceUpdate();
        }).catch(function() {
        });
      }
    }, {
      key: "normalizeLanguage",
      value: function(L) {
        return w.isSupportedLanguage(L) ? L : "text";
      }
    }, {
      key: "render",
      value: function() {
        return /* @__PURE__ */ J.createElement(w.highlightInstance, Le({}, this.props, {
          language: this.normalizeLanguage(this.props.language),
          astGenerator: w.astGenerator
        }));
      }
    }], [{
      key: "preload",
      value: function() {
        return w.loadAstGenerator();
      }
    }, {
      key: "loadLanguage",
      value: function() {
        var A = Ct(/* @__PURE__ */ Te().mark(function N($) {
          var R;
          return Te().wrap(function(O) {
            for (; ; ) switch (O.prev = O.next) {
              case 0:
                if (R = h[$], typeof R != "function") {
                  O.next = 5;
                  break;
                }
                return O.abrupt("return", R(w.registerLanguage));
              case 5:
                throw new Error("Language ".concat($, " not supported"));
              case 6:
              case "end":
                return O.stop();
            }
          }, N);
        }));
        function L(N) {
          return A.apply(this, arguments);
        }
        return L;
      }()
    }, {
      key: "isSupportedLanguage",
      value: function(L) {
        return w.isRegistered(L) || typeof h[L] == "function";
      }
    }, {
      key: "loadAstGenerator",
      value: function() {
        return w.astGeneratorPromise = r().then(function(L) {
          w.astGenerator = L, c && w.languages.forEach(function(N, $) {
            return c(L, $, N);
          });
        }), w.astGeneratorPromise;
      }
    }]);
  }(J.PureComponent);
  return t = s, te(s, "astGenerator", null), te(s, "highlightInstance", $n(null, {})), te(s, "astGeneratorPromise", null), te(s, "languages", /* @__PURE__ */ new Map()), te(s, "supportedLanguages", e.supportedLanguages || Object.keys(h || {})), te(s, "isRegistered", function(b) {
    if (k)
      return !0;
    if (!c)
      throw new Error("Current syntax highlighter doesn't support registration of languages");
    return t.astGenerator ? o(t.astGenerator, b) : t.languages.has(b);
  }), te(s, "registerLanguage", function(b, w) {
    if (!c)
      throw new Error("Current syntax highlighter doesn't support registration of languages");
    if (t.astGenerator)
      return c(t.astGenerator, b, w);
    t.languages.set(b, w);
  }), s;
};
function Pe() {
  /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */
  Pe = function() {
    return t;
  };
  var e, t = {}, r = Object.prototype, o = r.hasOwnProperty, c = Object.defineProperty || function(l, a, i) {
    l[a] = i.value;
  }, h = typeof Symbol == "function" ? Symbol : {}, k = h.iterator || "@@iterator", s = h.asyncIterator || "@@asyncIterator", b = h.toStringTag || "@@toStringTag";
  function w(l, a, i) {
    return Object.defineProperty(l, a, { value: i, enumerable: !0, configurable: !0, writable: !0 }), l[a];
  }
  try {
    w({}, "");
  } catch {
    w = function(i, f, d) {
      return i[f] = d;
    };
  }
  function A(l, a, i, f) {
    var d = a && a.prototype instanceof z ? a : z, p = Object.create(d.prototype), j = new B(f || []);
    return c(p, "_invoke", { value: T(l, i, j) }), p;
  }
  function L(l, a, i) {
    try {
      return { type: "normal", arg: l.call(a, i) };
    } catch (f) {
      return { type: "throw", arg: f };
    }
  }
  t.wrap = A;
  var N = "suspendedStart", $ = "suspendedYield", R = "executing", I = "completed", O = {};
  function z() {
  }
  function g() {
  }
  function u() {
  }
  var y = {};
  w(y, k, function() {
    return this;
  });
  var v = Object.getPrototypeOf, m = v && v(v(W([])));
  m && m !== r && o.call(m, k) && (y = m);
  var S = u.prototype = z.prototype = Object.create(y);
  function C(l) {
    ["next", "throw", "return"].forEach(function(a) {
      w(l, a, function(i) {
        return this._invoke(a, i);
      });
    });
  }
  function x(l, a) {
    function i(d, p, j, F) {
      var E = L(l[d], l, p);
      if (E.type !== "throw") {
        var q = E.arg, M = q.value;
        return M && Q(M) == "object" && o.call(M, "__await") ? a.resolve(M.__await).then(function(D) {
          i("next", D, j, F);
        }, function(D) {
          i("throw", D, j, F);
        }) : a.resolve(M).then(function(D) {
          q.value = D, j(q);
        }, function(D) {
          return i("throw", D, j, F);
        });
      }
      F(E.arg);
    }
    var f;
    c(this, "_invoke", { value: function(p, j) {
      function F() {
        return new a(function(E, q) {
          i(p, j, E, q);
        });
      }
      return f = f ? f.then(F, F) : F();
    } });
  }
  function T(l, a, i) {
    var f = N;
    return function(d, p) {
      if (f === R) throw Error("Generator is already running");
      if (f === I) {
        if (d === "throw") throw p;
        return { value: e, done: !0 };
      }
      for (i.method = d, i.arg = p; ; ) {
        var j = i.delegate;
        if (j) {
          var F = P(j, i);
          if (F) {
            if (F === O) continue;
            return F;
          }
        }
        if (i.method === "next") i.sent = i._sent = i.arg;
        else if (i.method === "throw") {
          if (f === N) throw f = I, i.arg;
          i.dispatchException(i.arg);
        } else i.method === "return" && i.abrupt("return", i.arg);
        f = R;
        var E = L(l, a, i);
        if (E.type === "normal") {
          if (f = i.done ? I : $, E.arg === O) continue;
          return { value: E.arg, done: i.done };
        }
        E.type === "throw" && (f = I, i.method = "throw", i.arg = E.arg);
      }
    };
  }
  function P(l, a) {
    var i = a.method, f = l.iterator[i];
    if (f === e) return a.delegate = null, i === "throw" && l.iterator.return && (a.method = "return", a.arg = e, P(l, a), a.method === "throw") || i !== "return" && (a.method = "throw", a.arg = new TypeError("The iterator does not provide a '" + i + "' method")), O;
    var d = L(f, l.iterator, a.arg);
    if (d.type === "throw") return a.method = "throw", a.arg = d.arg, a.delegate = null, O;
    var p = d.arg;
    return p ? p.done ? (a[l.resultName] = p.value, a.next = l.nextLoc, a.method !== "return" && (a.method = "next", a.arg = e), a.delegate = null, O) : p : (a.method = "throw", a.arg = new TypeError("iterator result is not an object"), a.delegate = null, O);
  }
  function H(l) {
    var a = { tryLoc: l[0] };
    1 in l && (a.catchLoc = l[1]), 2 in l && (a.finallyLoc = l[2], a.afterLoc = l[3]), this.tryEntries.push(a);
  }
  function U(l) {
    var a = l.completion || {};
    a.type = "normal", delete a.arg, l.completion = a;
  }
  function B(l) {
    this.tryEntries = [{ tryLoc: "root" }], l.forEach(H, this), this.reset(!0);
  }
  function W(l) {
    if (l || l === "") {
      var a = l[k];
      if (a) return a.call(l);
      if (typeof l.next == "function") return l;
      if (!isNaN(l.length)) {
        var i = -1, f = function d() {
          for (; ++i < l.length; ) if (o.call(l, i)) return d.value = l[i], d.done = !1, d;
          return d.value = e, d.done = !0, d;
        };
        return f.next = f;
      }
    }
    throw new TypeError(Q(l) + " is not iterable");
  }
  return g.prototype = u, c(S, "constructor", { value: u, configurable: !0 }), c(u, "constructor", { value: g, configurable: !0 }), g.displayName = w(u, b, "GeneratorFunction"), t.isGeneratorFunction = function(l) {
    var a = typeof l == "function" && l.constructor;
    return !!a && (a === g || (a.displayName || a.name) === "GeneratorFunction");
  }, t.mark = function(l) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(l, u) : (l.__proto__ = u, w(l, b, "GeneratorFunction")), l.prototype = Object.create(S), l;
  }, t.awrap = function(l) {
    return { __await: l };
  }, C(x.prototype), w(x.prototype, s, function() {
    return this;
  }), t.AsyncIterator = x, t.async = function(l, a, i, f, d) {
    d === void 0 && (d = Promise);
    var p = new x(A(l, a, i, f), d);
    return t.isGeneratorFunction(a) ? p : p.next().then(function(j) {
      return j.done ? j.value : p.next();
    });
  }, C(S), w(S, b, "Generator"), w(S, k, function() {
    return this;
  }), w(S, "toString", function() {
    return "[object Generator]";
  }), t.keys = function(l) {
    var a = Object(l), i = [];
    for (var f in a) i.push(f);
    return i.reverse(), function d() {
      for (; i.length; ) {
        var p = i.pop();
        if (p in a) return d.value = p, d.done = !1, d;
      }
      return d.done = !0, d;
    };
  }, t.values = W, B.prototype = { constructor: B, reset: function(a) {
    if (this.prev = 0, this.next = 0, this.sent = this._sent = e, this.done = !1, this.delegate = null, this.method = "next", this.arg = e, this.tryEntries.forEach(U), !a) for (var i in this) i.charAt(0) === "t" && o.call(this, i) && !isNaN(+i.slice(1)) && (this[i] = e);
  }, stop: function() {
    this.done = !0;
    var a = this.tryEntries[0].completion;
    if (a.type === "throw") throw a.arg;
    return this.rval;
  }, dispatchException: function(a) {
    if (this.done) throw a;
    var i = this;
    function f(q, M) {
      return j.type = "throw", j.arg = a, i.next = q, M && (i.method = "next", i.arg = e), !!M;
    }
    for (var d = this.tryEntries.length - 1; d >= 0; --d) {
      var p = this.tryEntries[d], j = p.completion;
      if (p.tryLoc === "root") return f("end");
      if (p.tryLoc <= this.prev) {
        var F = o.call(p, "catchLoc"), E = o.call(p, "finallyLoc");
        if (F && E) {
          if (this.prev < p.catchLoc) return f(p.catchLoc, !0);
          if (this.prev < p.finallyLoc) return f(p.finallyLoc);
        } else if (F) {
          if (this.prev < p.catchLoc) return f(p.catchLoc, !0);
        } else {
          if (!E) throw Error("try statement without catch or finally");
          if (this.prev < p.finallyLoc) return f(p.finallyLoc);
        }
      }
    }
  }, abrupt: function(a, i) {
    for (var f = this.tryEntries.length - 1; f >= 0; --f) {
      var d = this.tryEntries[f];
      if (d.tryLoc <= this.prev && o.call(d, "finallyLoc") && this.prev < d.finallyLoc) {
        var p = d;
        break;
      }
    }
    p && (a === "break" || a === "continue") && p.tryLoc <= i && i <= p.finallyLoc && (p = null);
    var j = p ? p.completion : {};
    return j.type = a, j.arg = i, p ? (this.method = "next", this.next = p.finallyLoc, O) : this.complete(j);
  }, complete: function(a, i) {
    if (a.type === "throw") throw a.arg;
    return a.type === "break" || a.type === "continue" ? this.next = a.arg : a.type === "return" ? (this.rval = this.arg = a.arg, this.method = "return", this.next = "end") : a.type === "normal" && i && (this.next = i), O;
  }, finish: function(a) {
    for (var i = this.tryEntries.length - 1; i >= 0; --i) {
      var f = this.tryEntries[i];
      if (f.finallyLoc === a) return this.complete(f.completion, f.afterLoc), U(f), O;
    }
  }, catch: function(a) {
    for (var i = this.tryEntries.length - 1; i >= 0; --i) {
      var f = this.tryEntries[i];
      if (f.tryLoc === a) {
        var d = f.completion;
        if (d.type === "throw") {
          var p = d.arg;
          U(f);
        }
        return p;
      }
    }
    throw Error("illegal catch attempt");
  }, delegateYield: function(a, i, f) {
    return this.delegate = { iterator: W(a), resultName: i, nextLoc: f }, this.method === "next" && (this.arg = e), O;
  } }, t;
}
const n = function(e, t) {
  return /* @__PURE__ */ function() {
    var r = Ct(/* @__PURE__ */ Pe().mark(function o(c) {
      var h;
      return Pe().wrap(function(s) {
        for (; ; ) switch (s.prev = s.next) {
          case 0:
            return s.next = 2, t();
          case 2:
            h = s.sent, c(e, h.default || h);
          case 4:
          case "end":
            return s.stop();
        }
      }, o);
    }));
    return function(o) {
      return r.apply(this, arguments);
    };
  }();
}, Nn = {
  abap: n("abap", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_abap" */
      "./abap-Dt-ZkZ8d.js"
    ).then((e) => e.a);
  }),
  abnf: n("abnf", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_abnf" */
      "./abnf-K6bY5jh-.js"
    ).then((e) => e.a);
  }),
  actionscript: n("actionscript", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_actionscript" */
      "./actionscript-CXv8Z1kb.js"
    ).then((e) => e.a);
  }),
  ada: n("ada", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_ada" */
      "./ada-Be9Sqmsn.js"
    ).then((e) => e.a);
  }),
  agda: n("agda", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_agda" */
      "./agda-CblUi51N.js"
    ).then((e) => e.a);
  }),
  al: n("al", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_al" */
      "./al-NLEefinu.js"
    ).then((e) => e.a);
  }),
  antlr4: n("antlr4", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_antlr4" */
      "./antlr4-QDNUPOWd.js"
    ).then((e) => e.a);
  }),
  apacheconf: n("apacheconf", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_apacheconf" */
      "./apacheconf-z5In0AnZ.js"
    ).then((e) => e.a);
  }),
  apex: n("apex", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_apex" */
      "./apex-1KAMpWa2.js"
    ).then((e) => e.a);
  }),
  apl: n("apl", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_apl" */
      "./apl-DWa61v4l.js"
    ).then((e) => e.a);
  }),
  applescript: n("applescript", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_applescript" */
      "./applescript-D-ytfI5k.js"
    ).then((e) => e.a);
  }),
  aql: n("aql", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_aql" */
      "./aql-TiBvTiDG.js"
    ).then((e) => e.a);
  }),
  arduino: n("arduino", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_arduino" */
      "./arduino-D5E-ggGh.js"
    ).then((e) => e.a);
  }),
  arff: n("arff", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_arff" */
      "./arff-DHvsqel_.js"
    ).then((e) => e.a);
  }),
  asciidoc: n("asciidoc", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_asciidoc" */
      "./asciidoc-NM6iEyeW.js"
    ).then((e) => e.a);
  }),
  asm6502: n("asm6502", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_asm6502" */
      "./asm6502-CTUiWTie.js"
    ).then((e) => e.a);
  }),
  asmatmel: n("asmatmel", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_asmatmel" */
      "./asmatmel-OI-0jo4G.js"
    ).then((e) => e.a);
  }),
  aspnet: n("aspnet", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_aspnet" */
      "./aspnet-BkFd4aJE.js"
    ).then((e) => e.a);
  }),
  autohotkey: n("autohotkey", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_autohotkey" */
      "./autohotkey-CnIyIQyn.js"
    ).then((e) => e.a);
  }),
  autoit: n("autoit", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_autoit" */
      "./autoit-C8EFeecb.js"
    ).then((e) => e.a);
  }),
  avisynth: n("avisynth", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_avisynth" */
      "./avisynth-BIsW19gH.js"
    ).then((e) => e.a);
  }),
  avroIdl: n("avroIdl", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_avroIdl" */
      "./avro-idl-EDTR838I.js"
    ).then((e) => e.a);
  }),
  bash: n("bash", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_bash" */
      "./bash-KE62vJQD.js"
    ).then((e) => e.b);
  }),
  basic: n("basic", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_basic" */
      "./basic-Cr2hjSUo.js"
    ).then((e) => e.b);
  }),
  batch: n("batch", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_batch" */
      "./batch-CD1DByGr.js"
    ).then((e) => e.b);
  }),
  bbcode: n("bbcode", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_bbcode" */
      "./bbcode-D68WBZ9p.js"
    ).then((e) => e.b);
  }),
  bicep: n("bicep", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_bicep" */
      "./bicep-CwEWbCcM.js"
    ).then((e) => e.b);
  }),
  birb: n("birb", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_birb" */
      "./birb-FD8Sg1ds.js"
    ).then((e) => e.b);
  }),
  bison: n("bison", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_bison" */
      "./bison-D6JjpaUE.js"
    ).then((e) => e.b);
  }),
  bnf: n("bnf", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_bnf" */
      "./bnf-D_CjSF1T.js"
    ).then((e) => e.b);
  }),
  brainfuck: n("brainfuck", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_brainfuck" */
      "./brainfuck-BCGvksXZ.js"
    ).then((e) => e.b);
  }),
  brightscript: n("brightscript", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_brightscript" */
      "./brightscript-CtnnCzoq.js"
    ).then((e) => e.b);
  }),
  bro: n("bro", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_bro" */
      "./bro-DByZc0ca.js"
    ).then((e) => e.b);
  }),
  bsl: n("bsl", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_bsl" */
      "./bsl-DOE0QjNt.js"
    ).then((e) => e.b);
  }),
  c: n("c", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_c" */
      "./c-CMrkL8iu.js"
    ).then((e) => e.c);
  }),
  cfscript: n("cfscript", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_cfscript" */
      "./cfscript-Eo8oJ_BK.js"
    ).then((e) => e.c);
  }),
  chaiscript: n("chaiscript", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_chaiscript" */
      "./chaiscript-DL5OInck.js"
    ).then((e) => e.c);
  }),
  cil: n("cil", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_cil" */
      "./cil-DNvT6QAG.js"
    ).then((e) => e.c);
  }),
  clike: n("clike", function() {
    return Promise.resolve().then(() => Rn);
  }),
  clojure: n("clojure", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_clojure" */
      "./clojure--HYa2OLb.js"
    ).then((e) => e.c);
  }),
  cmake: n("cmake", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_cmake" */
      "./cmake-D5d3QtB8.js"
    ).then((e) => e.c);
  }),
  cobol: n("cobol", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_cobol" */
      "./cobol-Bj18w3aq.js"
    ).then((e) => e.c);
  }),
  coffeescript: n("coffeescript", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_coffeescript" */
      "./coffeescript-C4b7rtfn.js"
    ).then((e) => e.c);
  }),
  concurnas: n("concurnas", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_concurnas" */
      "./concurnas-Gyd8bQzV.js"
    ).then((e) => e.c);
  }),
  coq: n("coq", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_coq" */
      "./coq-Cl3sSfAQ.js"
    ).then((e) => e.c);
  }),
  cpp: n("cpp", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_cpp" */
      "./cpp-B25c52v4.js"
    ).then((e) => e.c);
  }),
  crystal: n("crystal", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_crystal" */
      "./crystal-h05TIvgC.js"
    ).then((e) => e.c);
  }),
  csharp: n("csharp", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_csharp" */
      "./csharp-CB0qOhc4.js"
    ).then((e) => e.c);
  }),
  cshtml: n("cshtml", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_cshtml" */
      "./cshtml-Dbf9lmoL.js"
    ).then((e) => e.c);
  }),
  csp: n("csp", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_csp" */
      "./csp-C0_U19IW.js"
    ).then((e) => e.c);
  }),
  cssExtras: n("cssExtras", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_cssExtras" */
      "./css-extras-BnEun_l3.js"
    ).then((e) => e.c);
  }),
  css: n("css", function() {
    return Promise.resolve().then(() => qn);
  }),
  csv: n("csv", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_csv" */
      "./csv-BEUS1c7D.js"
    ).then((e) => e.c);
  }),
  cypher: n("cypher", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_cypher" */
      "./cypher-0pFLeUax.js"
    ).then((e) => e.c);
  }),
  d: n("d", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_d" */
      "./d-DHvNyoxm.js"
    ).then((e) => e.d);
  }),
  dart: n("dart", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_dart" */
      "./dart-CPZY_k6N.js"
    ).then((e) => e.d);
  }),
  dataweave: n("dataweave", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_dataweave" */
      "./dataweave-Djxu8yPz.js"
    ).then((e) => e.d);
  }),
  dax: n("dax", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_dax" */
      "./dax-DHghljqw.js"
    ).then((e) => e.d);
  }),
  dhall: n("dhall", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_dhall" */
      "./dhall-PboMqWuD.js"
    ).then((e) => e.d);
  }),
  diff: n("diff", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_diff" */
      "./diff-CyXopcXO.js"
    ).then((e) => e.d);
  }),
  django: n("django", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_django" */
      "./django-GLcK3IVY.js"
    ).then((e) => e.d);
  }),
  dnsZoneFile: n("dnsZoneFile", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_dnsZoneFile" */
      "./dns-zone-file-DSPkTOZI.js"
    ).then((e) => e.d);
  }),
  docker: n("docker", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_docker" */
      "./docker-Cg37rMhS.js"
    ).then((e) => e.d);
  }),
  dot: n("dot", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_dot" */
      "./dot-FmXiGXKA.js"
    ).then((e) => e.d);
  }),
  ebnf: n("ebnf", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_ebnf" */
      "./ebnf-9CZqI_3-.js"
    ).then((e) => e.e);
  }),
  editorconfig: n("editorconfig", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_editorconfig" */
      "./editorconfig-qAATdJJ8.js"
    ).then((e) => e.e);
  }),
  eiffel: n("eiffel", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_eiffel" */
      "./eiffel-BCzVzJJJ.js"
    ).then((e) => e.e);
  }),
  ejs: n("ejs", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_ejs" */
      "./ejs-aasqnShN.js"
    ).then((e) => e.e);
  }),
  elixir: n("elixir", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_elixir" */
      "./elixir-969Blpca.js"
    ).then((e) => e.e);
  }),
  elm: n("elm", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_elm" */
      "./elm-DXMXV5Hu.js"
    ).then((e) => e.e);
  }),
  erb: n("erb", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_erb" */
      "./erb-12xoxBwN.js"
    ).then((e) => e.e);
  }),
  erlang: n("erlang", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_erlang" */
      "./erlang-Cj9di4pY.js"
    ).then((e) => e.e);
  }),
  etlua: n("etlua", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_etlua" */
      "./etlua-D2-8R51A.js"
    ).then((e) => e.e);
  }),
  excelFormula: n("excelFormula", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_excelFormula" */
      "./excel-formula-BDS6x60G.js"
    ).then((e) => e.e);
  }),
  factor: n("factor", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_factor" */
      "./factor-D6S8j0bL.js"
    ).then((e) => e.f);
  }),
  falselang: n("falselang", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_falselang" */
      "./false-C9oBTGCj.js"
    ).then((e) => e._);
  }),
  firestoreSecurityRules: n("firestoreSecurityRules", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_firestoreSecurityRules" */
      "./firestore-security-rules-ChSBSCrS.js"
    ).then((e) => e.f);
  }),
  flow: n("flow", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_flow" */
      "./flow-BS7lZw3n.js"
    ).then((e) => e.f);
  }),
  fortran: n("fortran", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_fortran" */
      "./fortran-DuQjao39.js"
    ).then((e) => e.f);
  }),
  fsharp: n("fsharp", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_fsharp" */
      "./fsharp-BthJOeYS.js"
    ).then((e) => e.f);
  }),
  ftl: n("ftl", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_ftl" */
      "./ftl-CWhImJwE.js"
    ).then((e) => e.f);
  }),
  gap: n("gap", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_gap" */
      "./gap-CUh4CUDU.js"
    ).then((e) => e.g);
  }),
  gcode: n("gcode", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_gcode" */
      "./gcode-C5VUHliY.js"
    ).then((e) => e.g);
  }),
  gdscript: n("gdscript", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_gdscript" */
      "./gdscript-DJeGXzE4.js"
    ).then((e) => e.g);
  }),
  gedcom: n("gedcom", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_gedcom" */
      "./gedcom-ZaZGvBeM.js"
    ).then((e) => e.g);
  }),
  gherkin: n("gherkin", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_gherkin" */
      "./gherkin-CTkjqJLI.js"
    ).then((e) => e.g);
  }),
  git: n("git", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_git" */
      "./git-CVxsvxSL.js"
    ).then((e) => e.g);
  }),
  glsl: n("glsl", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_glsl" */
      "./glsl-C2I-bDh4.js"
    ).then((e) => e.g);
  }),
  gml: n("gml", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_gml" */
      "./gml-D562_JNF.js"
    ).then((e) => e.g);
  }),
  gn: n("gn", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_gn" */
      "./gn-CxXYr8RE.js"
    ).then((e) => e.g);
  }),
  goModule: n("goModule", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_goModule" */
      "./go-module-74AdALwj.js"
    ).then((e) => e.g);
  }),
  go: n("go", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_go" */
      "./go-DAJgUbhF.js"
    ).then((e) => e.g);
  }),
  graphql: n("graphql", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_graphql" */
      "./graphql-BcMs5RFA.js"
    ).then((e) => e.g);
  }),
  groovy: n("groovy", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_groovy" */
      "./groovy-DShAK9xi.js"
    ).then((e) => e.g);
  }),
  haml: n("haml", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_haml" */
      "./haml-fVS4Vu1o.js"
    ).then((e) => e.h);
  }),
  handlebars: n("handlebars", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_handlebars" */
      "./handlebars-B-KqadSe.js"
    ).then((e) => e.h);
  }),
  haskell: n("haskell", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_haskell" */
      "./haskell-CavYoB0h.js"
    ).then((e) => e.h);
  }),
  haxe: n("haxe", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_haxe" */
      "./haxe-CB5jtBK3.js"
    ).then((e) => e.h);
  }),
  hcl: n("hcl", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_hcl" */
      "./hcl-BJlrumHu.js"
    ).then((e) => e.h);
  }),
  hlsl: n("hlsl", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_hlsl" */
      "./hlsl-C_uW6-Uk.js"
    ).then((e) => e.h);
  }),
  hoon: n("hoon", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_hoon" */
      "./hoon-k1lZUz-1.js"
    ).then((e) => e.h);
  }),
  hpkp: n("hpkp", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_hpkp" */
      "./hpkp-BuoOy6dh.js"
    ).then((e) => e.h);
  }),
  hsts: n("hsts", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_hsts" */
      "./hsts-BWFpQ_a6.js"
    ).then((e) => e.h);
  }),
  http: n("http", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_http" */
      "./http-QHFv1ahZ.js"
    ).then((e) => e.h);
  }),
  ichigojam: n("ichigojam", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_ichigojam" */
      "./ichigojam-C1O4KxUt.js"
    ).then((e) => e.i);
  }),
  icon: n("icon", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_icon" */
      "./icon-CAwTjV5E.js"
    ).then((e) => e.i);
  }),
  icuMessageFormat: n("icuMessageFormat", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_icuMessageFormat" */
      "./icu-message-format-W5nSNBYP.js"
    ).then((e) => e.i);
  }),
  idris: n("idris", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_idris" */
      "./idris-CcDKUzEJ.js"
    ).then((e) => e.i);
  }),
  iecst: n("iecst", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_iecst" */
      "./iecst-CgwjnVKJ.js"
    ).then((e) => e.i);
  }),
  ignore: n("ignore", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_ignore" */
      "./ignore-Deps-xK7.js"
    ).then((e) => e.i);
  }),
  inform7: n("inform7", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_inform7" */
      "./inform7-BFQUR33s.js"
    ).then((e) => e.i);
  }),
  ini: n("ini", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_ini" */
      "./ini-Y6rAuJiy.js"
    ).then((e) => e.i);
  }),
  io: n("io", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_io" */
      "./io-ChB4E0Pb.js"
    ).then((e) => e.i);
  }),
  j: n("j", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_j" */
      "./j-DEcvJcRA.js"
    ).then((e) => e.j);
  }),
  java: n("java", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_java" */
      "./java-BRviipWM.js"
    ).then((e) => e.j);
  }),
  javadoc: n("javadoc", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_javadoc" */
      "./javadoc-BfxNH3ni.js"
    ).then((e) => e.j);
  }),
  javadoclike: n("javadoclike", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_javadoclike" */
      "./javadoclike-Ddpgb-us.js"
    ).then((e) => e.j);
  }),
  javascript: n("javascript", function() {
    return Promise.resolve().then(() => Gn);
  }),
  javastacktrace: n("javastacktrace", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_javastacktrace" */
      "./javastacktrace-l54m3uip.js"
    ).then((e) => e.j);
  }),
  jexl: n("jexl", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_jexl" */
      "./jexl-Dn_y6-ub.js"
    ).then((e) => e.j);
  }),
  jolie: n("jolie", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_jolie" */
      "./jolie-BAbmKC4t.js"
    ).then((e) => e.j);
  }),
  jq: n("jq", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_jq" */
      "./jq-D0oo7b3r.js"
    ).then((e) => e.j);
  }),
  jsExtras: n("jsExtras", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_jsExtras" */
      "./js-extras-BmxorGff.js"
    ).then((e) => e.j);
  }),
  jsTemplates: n("jsTemplates", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_jsTemplates" */
      "./js-templates-lYUmm4hN.js"
    ).then((e) => e.j);
  }),
  jsdoc: n("jsdoc", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_jsdoc" */
      "./jsdoc-Dii73kry.js"
    ).then((e) => e.j);
  }),
  json: n("json", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_json" */
      "./json-DNQuHvNh.js"
    ).then((e) => e.j);
  }),
  json5: n("json5", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_json5" */
      "./json5-MIPq4Leb.js"
    ).then((e) => e.j);
  }),
  jsonp: n("jsonp", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_jsonp" */
      "./jsonp-B9fLu6Ye.js"
    ).then((e) => e.j);
  }),
  jsstacktrace: n("jsstacktrace", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_jsstacktrace" */
      "./jsstacktrace-CgjGOGwr.js"
    ).then((e) => e.j);
  }),
  jsx: n("jsx", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_jsx" */
      "./jsx-CkPRmoyS.js"
    ).then((e) => e.j);
  }),
  julia: n("julia", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_julia" */
      "./julia-CI3EEY0b.js"
    ).then((e) => e.j);
  }),
  keepalived: n("keepalived", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_keepalived" */
      "./keepalived-DAKZLHdP.js"
    ).then((e) => e.k);
  }),
  keyman: n("keyman", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_keyman" */
      "./keyman-CmVOKIT-.js"
    ).then((e) => e.k);
  }),
  kotlin: n("kotlin", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_kotlin" */
      "./kotlin-Tvz4x8a1.js"
    ).then((e) => e.k);
  }),
  kumir: n("kumir", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_kumir" */
      "./kumir-p4AsbwQV.js"
    ).then((e) => e.k);
  }),
  kusto: n("kusto", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_kusto" */
      "./kusto-O33is1GZ.js"
    ).then((e) => e.k);
  }),
  latex: n("latex", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_latex" */
      "./latex-CkBQKFFo.js"
    ).then((e) => e.l);
  }),
  latte: n("latte", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_latte" */
      "./latte-lHlCTV36.js"
    ).then((e) => e.l);
  }),
  less: n("less", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_less" */
      "./less-CFAtoEUv.js"
    ).then((e) => e.l);
  }),
  lilypond: n("lilypond", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_lilypond" */
      "./lilypond-DrdZoj85.js"
    ).then((e) => e.l);
  }),
  liquid: n("liquid", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_liquid" */
      "./liquid-C5FVoVu3.js"
    ).then((e) => e.l);
  }),
  lisp: n("lisp", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_lisp" */
      "./lisp-DnsMZISD.js"
    ).then((e) => e.l);
  }),
  livescript: n("livescript", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_livescript" */
      "./livescript-DDPscnzk.js"
    ).then((e) => e.l);
  }),
  llvm: n("llvm", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_llvm" */
      "./llvm-B1oOl2TP.js"
    ).then((e) => e.l);
  }),
  log: n("log", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_log" */
      "./log-R-EISU9E.js"
    ).then((e) => e.l);
  }),
  lolcode: n("lolcode", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_lolcode" */
      "./lolcode--g5oipyb.js"
    ).then((e) => e.l);
  }),
  lua: n("lua", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_lua" */
      "./lua-lUboL0Fh.js"
    ).then((e) => e.l);
  }),
  magma: n("magma", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_magma" */
      "./magma-CqyrlvKw.js"
    ).then((e) => e.m);
  }),
  makefile: n("makefile", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_makefile" */
      "./makefile-BgDikbls.js"
    ).then((e) => e.m);
  }),
  markdown: n("markdown", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_markdown" */
      "./markdown-Dnvnr5HB.js"
    ).then((e) => e.m);
  }),
  markupTemplating: n("markupTemplating", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_markupTemplating" */
      "./markup-templating-B7dfCu7L.js"
    ).then((e) => e.m);
  }),
  markup: n("markup", function() {
    return Promise.resolve().then(() => Un);
  }),
  matlab: n("matlab", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_matlab" */
      "./matlab-BnfzKQ02.js"
    ).then((e) => e.m);
  }),
  maxscript: n("maxscript", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_maxscript" */
      "./maxscript-wQK5YEly.js"
    ).then((e) => e.m);
  }),
  mel: n("mel", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_mel" */
      "./mel-BhC1zpEE.js"
    ).then((e) => e.m);
  }),
  mermaid: n("mermaid", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_mermaid" */
      "./mermaid-CDyY-634.js"
    ).then((e) => e.m);
  }),
  mizar: n("mizar", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_mizar" */
      "./mizar-WuwUdI1K.js"
    ).then((e) => e.m);
  }),
  mongodb: n("mongodb", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_mongodb" */
      "./mongodb-DpBpaPl4.js"
    ).then((e) => e.m);
  }),
  monkey: n("monkey", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_monkey" */
      "./monkey-Lt947q4m.js"
    ).then((e) => e.m);
  }),
  moonscript: n("moonscript", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_moonscript" */
      "./moonscript-CAKZChMn.js"
    ).then((e) => e.m);
  }),
  n1ql: n("n1ql", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_n1ql" */
      "./n1ql-BXUqBfUJ.js"
    ).then((e) => e.n);
  }),
  n4js: n("n4js", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_n4js" */
      "./n4js-BIKLnkte.js"
    ).then((e) => e.n);
  }),
  nand2tetrisHdl: n("nand2tetrisHdl", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_nand2tetrisHdl" */
      "./nand2tetris-hdl-7GeWEmpF.js"
    ).then((e) => e.n);
  }),
  naniscript: n("naniscript", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_naniscript" */
      "./naniscript-D3WIBWyG.js"
    ).then((e) => e.n);
  }),
  nasm: n("nasm", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_nasm" */
      "./nasm-DEo9Hsbm.js"
    ).then((e) => e.n);
  }),
  neon: n("neon", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_neon" */
      "./neon-CbtzKpXD.js"
    ).then((e) => e.n);
  }),
  nevod: n("nevod", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_nevod" */
      "./nevod-DrziaAbA.js"
    ).then((e) => e.n);
  }),
  nginx: n("nginx", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_nginx" */
      "./nginx-UHiI6dM5.js"
    ).then((e) => e.n);
  }),
  nim: n("nim", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_nim" */
      "./nim-DryH7Bdm.js"
    ).then((e) => e.n);
  }),
  nix: n("nix", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_nix" */
      "./nix-CyLDtlaR.js"
    ).then((e) => e.n);
  }),
  nsis: n("nsis", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_nsis" */
      "./nsis-DFmzU4ah.js"
    ).then((e) => e.n);
  }),
  objectivec: n("objectivec", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_objectivec" */
      "./objectivec-CwOYy_4n.js"
    ).then((e) => e.o);
  }),
  ocaml: n("ocaml", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_ocaml" */
      "./ocaml-cENGHlpa.js"
    ).then((e) => e.o);
  }),
  opencl: n("opencl", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_opencl" */
      "./opencl-D6YFM3Kv.js"
    ).then((e) => e.o);
  }),
  openqasm: n("openqasm", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_openqasm" */
      "./openqasm-CGiLpj1t.js"
    ).then((e) => e.o);
  }),
  oz: n("oz", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_oz" */
      "./oz-C_qYj3DS.js"
    ).then((e) => e.o);
  }),
  parigp: n("parigp", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_parigp" */
      "./parigp-CmLKIsbg.js"
    ).then((e) => e.p);
  }),
  parser: n("parser", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_parser" */
      "./parser-CsSBWDF_.js"
    ).then((e) => e.p);
  }),
  pascal: n("pascal", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_pascal" */
      "./pascal-BNYI3qxv.js"
    ).then((e) => e.p);
  }),
  pascaligo: n("pascaligo", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_pascaligo" */
      "./pascaligo-Bynrh-IQ.js"
    ).then((e) => e.p);
  }),
  pcaxis: n("pcaxis", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_pcaxis" */
      "./pcaxis-DyfCA_yN.js"
    ).then((e) => e.p);
  }),
  peoplecode: n("peoplecode", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_peoplecode" */
      "./peoplecode-DEjiv6N0.js"
    ).then((e) => e.p);
  }),
  perl: n("perl", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_perl" */
      "./perl-ClOgVkkl.js"
    ).then((e) => e.p);
  }),
  phpExtras: n("phpExtras", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_phpExtras" */
      "./php-extras-B8w54jqC.js"
    ).then((e) => e.p);
  }),
  php: n("php", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_php" */
      "./php-v7syz9cG.js"
    ).then((e) => e.p);
  }),
  phpdoc: n("phpdoc", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_phpdoc" */
      "./phpdoc-Der4E3dn.js"
    ).then((e) => e.p);
  }),
  plsql: n("plsql", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_plsql" */
      "./plsql-BQSx8eWD.js"
    ).then((e) => e.p);
  }),
  powerquery: n("powerquery", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_powerquery" */
      "./powerquery-DwG-YNcL.js"
    ).then((e) => e.p);
  }),
  powershell: n("powershell", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_powershell" */
      "./powershell-DKfqE6Nq.js"
    ).then((e) => e.p);
  }),
  processing: n("processing", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_processing" */
      "./processing-BUmivInH.js"
    ).then((e) => e.p);
  }),
  prolog: n("prolog", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_prolog" */
      "./prolog-DFhR53IV.js"
    ).then((e) => e.p);
  }),
  promql: n("promql", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_promql" */
      "./promql-CS_yhHdd.js"
    ).then((e) => e.p);
  }),
  properties: n("properties", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_properties" */
      "./properties-C5IqMRGS.js"
    ).then((e) => e.p);
  }),
  protobuf: n("protobuf", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_protobuf" */
      "./protobuf-Ba8RCRVG.js"
    ).then((e) => e.p);
  }),
  psl: n("psl", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_psl" */
      "./psl-yrUsFU0f.js"
    ).then((e) => e.p);
  }),
  pug: n("pug", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_pug" */
      "./pug-Ca3yJ9kw.js"
    ).then((e) => e.p);
  }),
  puppet: n("puppet", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_puppet" */
      "./puppet-CsZzNlEV.js"
    ).then((e) => e.p);
  }),
  pure: n("pure", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_pure" */
      "./pure-BDjUJpff.js"
    ).then((e) => e.p);
  }),
  purebasic: n("purebasic", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_purebasic" */
      "./purebasic-DjC-ynNl.js"
    ).then((e) => e.p);
  }),
  purescript: n("purescript", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_purescript" */
      "./purescript-hvad_0CL.js"
    ).then((e) => e.p);
  }),
  python: n("python", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_python" */
      "./python-DWicCeel.js"
    ).then((e) => e.p);
  }),
  q: n("q", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_q" */
      "./q-CNhCb0rl.js"
    ).then((e) => e.q);
  }),
  qml: n("qml", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_qml" */
      "./qml-DlIASLSA.js"
    ).then((e) => e.q);
  }),
  qore: n("qore", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_qore" */
      "./qore-DdUyvSd_.js"
    ).then((e) => e.q);
  }),
  qsharp: n("qsharp", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_qsharp" */
      "./qsharp-BnfjFttg.js"
    ).then((e) => e.q);
  }),
  r: n("r", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_r" */
      "./r-CRHjR2sI.js"
    ).then((e) => e.r);
  }),
  racket: n("racket", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_racket" */
      "./racket-CpFxCF_p.js"
    ).then((e) => e.r);
  }),
  reason: n("reason", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_reason" */
      "./reason-q-odlVJk.js"
    ).then((e) => e.r);
  }),
  regex: n("regex", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_regex" */
      "./regex-CutZKiFG.js"
    ).then((e) => e.r);
  }),
  rego: n("rego", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_rego" */
      "./rego-B1Kto6Fu.js"
    ).then((e) => e.r);
  }),
  renpy: n("renpy", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_renpy" */
      "./renpy-BM-UY9XX.js"
    ).then((e) => e.r);
  }),
  rest: n("rest", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_rest" */
      "./rest-CLkNFpM8.js"
    ).then((e) => e.r);
  }),
  rip: n("rip", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_rip" */
      "./rip-DTlW0tv3.js"
    ).then((e) => e.r);
  }),
  roboconf: n("roboconf", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_roboconf" */
      "./roboconf-BCxvYCVS.js"
    ).then((e) => e.r);
  }),
  robotframework: n("robotframework", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_robotframework" */
      "./robotframework-VAvjvc5d.js"
    ).then((e) => e.r);
  }),
  ruby: n("ruby", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_ruby" */
      "./ruby-g5ZPYV15.js"
    ).then((e) => e.r);
  }),
  rust: n("rust", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_rust" */
      "./rust-CPziYIir.js"
    ).then((e) => e.r);
  }),
  sas: n("sas", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_sas" */
      "./sas-B-xprp51.js"
    ).then((e) => e.s);
  }),
  sass: n("sass", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_sass" */
      "./sass-CGGwEhKK.js"
    ).then((e) => e.s);
  }),
  scala: n("scala", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_scala" */
      "./scala-BX7Q3DfR.js"
    ).then((e) => e.s);
  }),
  scheme: n("scheme", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_scheme" */
      "./scheme-DBOwJ0-s.js"
    ).then((e) => e.s);
  }),
  scss: n("scss", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_scss" */
      "./scss-SANDUSF8.js"
    ).then((e) => e.s);
  }),
  shellSession: n("shellSession", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_shellSession" */
      "./shell-session-C-abAheC.js"
    ).then((e) => e.s);
  }),
  smali: n("smali", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_smali" */
      "./smali-mGwQLnpS.js"
    ).then((e) => e.s);
  }),
  smalltalk: n("smalltalk", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_smalltalk" */
      "./smalltalk-CXXNrKat.js"
    ).then((e) => e.s);
  }),
  smarty: n("smarty", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_smarty" */
      "./smarty-xZfdruyB.js"
    ).then((e) => e.s);
  }),
  sml: n("sml", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_sml" */
      "./sml-BukVjeCt.js"
    ).then((e) => e.s);
  }),
  solidity: n("solidity", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_solidity" */
      "./solidity-Tvsq2O2l.js"
    ).then((e) => e.s);
  }),
  solutionFile: n("solutionFile", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_solutionFile" */
      "./solution-file-CKazTg96.js"
    ).then((e) => e.s);
  }),
  soy: n("soy", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_soy" */
      "./soy-86xGqVST.js"
    ).then((e) => e.s);
  }),
  sparql: n("sparql", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_sparql" */
      "./sparql-CQVq4CGc.js"
    ).then((e) => e.s);
  }),
  splunkSpl: n("splunkSpl", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_splunkSpl" */
      "./splunk-spl-C1KKQrwn.js"
    ).then((e) => e.s);
  }),
  sqf: n("sqf", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_sqf" */
      "./sqf-Agpwl1JM.js"
    ).then((e) => e.s);
  }),
  sql: n("sql", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_sql" */
      "./sql-EJXNs70e.js"
    ).then((e) => e.s);
  }),
  squirrel: n("squirrel", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_squirrel" */
      "./squirrel-BDDJ925b.js"
    ).then((e) => e.s);
  }),
  stan: n("stan", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_stan" */
      "./stan-DWK-gZpX.js"
    ).then((e) => e.s);
  }),
  stylus: n("stylus", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_stylus" */
      "./stylus-C3eh1bQ7.js"
    ).then((e) => e.s);
  }),
  swift: n("swift", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_swift" */
      "./swift-DHZ8DPcg.js"
    ).then((e) => e.s);
  }),
  systemd: n("systemd", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_systemd" */
      "./systemd-BVoBJK-G.js"
    ).then((e) => e.s);
  }),
  t4Cs: n("t4Cs", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_t4Cs" */
      "./t4-cs-DUuxncwB.js"
    ).then((e) => e.t);
  }),
  t4Templating: n("t4Templating", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_t4Templating" */
      "./t4-templating-BWx9t4fU.js"
    ).then((e) => e.t);
  }),
  t4Vb: n("t4Vb", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_t4Vb" */
      "./t4-vb-Db6aHhST.js"
    ).then((e) => e.t);
  }),
  tap: n("tap", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_tap" */
      "./tap-HX-VzIPG.js"
    ).then((e) => e.t);
  }),
  tcl: n("tcl", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_tcl" */
      "./tcl-B8ubMjK3.js"
    ).then((e) => e.t);
  }),
  textile: n("textile", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_textile" */
      "./textile-D1HBR9K7.js"
    ).then((e) => e.t);
  }),
  toml: n("toml", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_toml" */
      "./toml-7-WVK-mT.js"
    ).then((e) => e.t);
  }),
  tremor: n("tremor", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_tremor" */
      "./tremor-rq3Qi2F1.js"
    ).then((e) => e.t);
  }),
  tsx: n("tsx", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_tsx" */
      "./tsx-Cav34xww.js"
    ).then((e) => e.t);
  }),
  tt2: n("tt2", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_tt2" */
      "./tt2-D1J2-d8f.js"
    ).then((e) => e.t);
  }),
  turtle: n("turtle", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_turtle" */
      "./turtle-BjUlWoyt.js"
    ).then((e) => e.t);
  }),
  twig: n("twig", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_twig" */
      "./twig-CMYyt-0u.js"
    ).then((e) => e.t);
  }),
  typescript: n("typescript", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_typescript" */
      "./typescript-MEsZkaok.js"
    ).then((e) => e.t);
  }),
  typoscript: n("typoscript", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_typoscript" */
      "./typoscript-DLOEGvmM.js"
    ).then((e) => e.t);
  }),
  unrealscript: n("unrealscript", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_unrealscript" */
      "./unrealscript-DJGsvhvV.js"
    ).then((e) => e.u);
  }),
  uorazor: n("uorazor", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_uorazor" */
      "./uorazor-D-oPe8r4.js"
    ).then((e) => e.u);
  }),
  uri: n("uri", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_uri" */
      "./uri-BTQMpk3f.js"
    ).then((e) => e.u);
  }),
  v: n("v", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_v" */
      "./v-CZckIMyU.js"
    ).then((e) => e.v);
  }),
  vala: n("vala", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_vala" */
      "./vala-BFaheK00.js"
    ).then((e) => e.v);
  }),
  vbnet: n("vbnet", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_vbnet" */
      "./vbnet-DN_b3rEk.js"
    ).then((e) => e.v);
  }),
  velocity: n("velocity", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_velocity" */
      "./velocity-DZvO4pIM.js"
    ).then((e) => e.v);
  }),
  verilog: n("verilog", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_verilog" */
      "./verilog-arpISg0i.js"
    ).then((e) => e.v);
  }),
  vhdl: n("vhdl", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_vhdl" */
      "./vhdl-Bbu2eMxL.js"
    ).then((e) => e.v);
  }),
  vim: n("vim", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_vim" */
      "./vim-Caml7Hnq.js"
    ).then((e) => e.v);
  }),
  visualBasic: n("visualBasic", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_visualBasic" */
      "./visual-basic-PVmVDpTz.js"
    ).then((e) => e.v);
  }),
  warpscript: n("warpscript", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_warpscript" */
      "./warpscript-3chtMw7x.js"
    ).then((e) => e.w);
  }),
  wasm: n("wasm", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_wasm" */
      "./wasm-BziusgJ0.js"
    ).then((e) => e.w);
  }),
  webIdl: n("webIdl", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_webIdl" */
      "./web-idl-BUOtkP7f.js"
    ).then((e) => e.w);
  }),
  wiki: n("wiki", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_wiki" */
      "./wiki-09k38cb7.js"
    ).then((e) => e.w);
  }),
  wolfram: n("wolfram", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_wolfram" */
      "./wolfram-Bew3fW7M.js"
    ).then((e) => e.w);
  }),
  wren: n("wren", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_wren" */
      "./wren-BDQqqDO_.js"
    ).then((e) => e.w);
  }),
  xeora: n("xeora", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_xeora" */
      "./xeora-AyRbDrdK.js"
    ).then((e) => e.x);
  }),
  xmlDoc: n("xmlDoc", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_xmlDoc" */
      "./xml-doc-1xP68u3O.js"
    ).then((e) => e.x);
  }),
  xojo: n("xojo", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_xojo" */
      "./xojo-O2KhdvO1.js"
    ).then((e) => e.x);
  }),
  xquery: n("xquery", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_xquery" */
      "./xquery-D783jUEc.js"
    ).then((e) => e.x);
  }),
  yaml: n("yaml", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_yaml" */
      "./yaml-Dspj0Ccv.js"
    ).then((e) => e.y);
  }),
  yang: n("yang", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_yang" */
      "./yang-B5lF_tcx.js"
    ).then((e) => e.y);
  }),
  zig: n("zig", function() {
    return import(
      /* webpackChunkName: "react-syntax-highlighter_languages_refractor_zig" */
      "./zig-DfqK4B_n.js"
    ).then((e) => e.z);
  })
}, Tn = _n({
  loader: function() {
    return Promise.resolve().then(() => il).then(function(t) {
      return t.default || t;
    });
  },
  isLanguageRegistered: function(t, r) {
    return t.registered(r);
  },
  languageLoaders: Nn,
  registerLanguage: function(t, r, o) {
    return t.register(o);
  }
}), sl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Tn
}, Symbol.toStringTag, { value: "Module" })), Pn = {
  'code[class*="language-"]': {
    background: "hsl(220, 13%, 18%)",
    color: "hsl(220, 14%, 71%)",
    textShadow: "0 1px rgba(0, 0, 0, 0.3)",
    fontFamily: '"Fira Code", "Fira Mono", Menlo, Consolas, "DejaVu Sans Mono", monospace',
    direction: "ltr",
    textAlign: "left",
    whiteSpace: "pre",
    wordSpacing: "normal",
    wordBreak: "normal",
    lineHeight: "1.5",
    MozTabSize: "2",
    OTabSize: "2",
    tabSize: "2",
    WebkitHyphens: "none",
    MozHyphens: "none",
    msHyphens: "none",
    hyphens: "none"
  },
  'pre[class*="language-"]': {
    background: "hsl(220, 13%, 18%)",
    color: "hsl(220, 14%, 71%)",
    textShadow: "0 1px rgba(0, 0, 0, 0.3)",
    fontFamily: '"Fira Code", "Fira Mono", Menlo, Consolas, "DejaVu Sans Mono", monospace',
    direction: "ltr",
    textAlign: "left",
    whiteSpace: "pre",
    wordSpacing: "normal",
    wordBreak: "normal",
    lineHeight: "1.5",
    MozTabSize: "2",
    OTabSize: "2",
    tabSize: "2",
    WebkitHyphens: "none",
    MozHyphens: "none",
    msHyphens: "none",
    hyphens: "none",
    padding: "1em",
    margin: "0.5em 0",
    overflow: "auto",
    borderRadius: "0.3em"
  },
  'code[class*="language-"]::-moz-selection': {
    background: "hsl(220, 13%, 28%)",
    color: "inherit",
    textShadow: "none"
  },
  'code[class*="language-"] *::-moz-selection': {
    background: "hsl(220, 13%, 28%)",
    color: "inherit",
    textShadow: "none"
  },
  'pre[class*="language-"] *::-moz-selection': {
    background: "hsl(220, 13%, 28%)",
    color: "inherit",
    textShadow: "none"
  },
  'code[class*="language-"]::selection': {
    background: "hsl(220, 13%, 28%)",
    color: "inherit",
    textShadow: "none"
  },
  'code[class*="language-"] *::selection': {
    background: "hsl(220, 13%, 28%)",
    color: "inherit",
    textShadow: "none"
  },
  'pre[class*="language-"] *::selection': {
    background: "hsl(220, 13%, 28%)",
    color: "inherit",
    textShadow: "none"
  },
  ':not(pre) > code[class*="language-"]': {
    padding: "0.2em 0.3em",
    borderRadius: "0.3em",
    whiteSpace: "normal"
  },
  comment: {
    color: "hsl(220, 10%, 40%)",
    fontStyle: "italic"
  },
  prolog: {
    color: "hsl(220, 10%, 40%)"
  },
  cdata: {
    color: "hsl(220, 10%, 40%)"
  },
  doctype: {
    color: "hsl(220, 14%, 71%)"
  },
  punctuation: {
    color: "hsl(220, 14%, 71%)"
  },
  entity: {
    color: "hsl(220, 14%, 71%)",
    cursor: "help"
  },
  "attr-name": {
    color: "hsl(29, 54%, 61%)"
  },
  "class-name": {
    color: "hsl(29, 54%, 61%)"
  },
  boolean: {
    color: "hsl(29, 54%, 61%)"
  },
  constant: {
    color: "hsl(29, 54%, 61%)"
  },
  number: {
    color: "hsl(29, 54%, 61%)"
  },
  atrule: {
    color: "hsl(29, 54%, 61%)"
  },
  keyword: {
    color: "hsl(286, 60%, 67%)"
  },
  property: {
    color: "hsl(355, 65%, 65%)"
  },
  tag: {
    color: "hsl(355, 65%, 65%)"
  },
  symbol: {
    color: "hsl(355, 65%, 65%)"
  },
  deleted: {
    color: "hsl(355, 65%, 65%)"
  },
  important: {
    color: "hsl(355, 65%, 65%)"
  },
  selector: {
    color: "hsl(95, 38%, 62%)"
  },
  string: {
    color: "hsl(95, 38%, 62%)"
  },
  char: {
    color: "hsl(95, 38%, 62%)"
  },
  builtin: {
    color: "hsl(95, 38%, 62%)"
  },
  inserted: {
    color: "hsl(95, 38%, 62%)"
  },
  regex: {
    color: "hsl(95, 38%, 62%)"
  },
  "attr-value": {
    color: "hsl(95, 38%, 62%)"
  },
  "attr-value > .token.punctuation": {
    color: "hsl(95, 38%, 62%)"
  },
  variable: {
    color: "hsl(207, 82%, 66%)"
  },
  operator: {
    color: "hsl(207, 82%, 66%)"
  },
  function: {
    color: "hsl(207, 82%, 66%)"
  },
  url: {
    color: "hsl(187, 47%, 55%)"
  },
  "attr-value > .token.punctuation.attr-equals": {
    color: "hsl(220, 14%, 71%)"
  },
  "special-attr > .token.attr-value > .token.value.css": {
    color: "hsl(220, 14%, 71%)"
  },
  ".language-css .token.selector": {
    color: "hsl(355, 65%, 65%)"
  },
  ".language-css .token.property": {
    color: "hsl(220, 14%, 71%)"
  },
  ".language-css .token.function": {
    color: "hsl(187, 47%, 55%)"
  },
  ".language-css .token.url > .token.function": {
    color: "hsl(187, 47%, 55%)"
  },
  ".language-css .token.url > .token.string.url": {
    color: "hsl(95, 38%, 62%)"
  },
  ".language-css .token.important": {
    color: "hsl(286, 60%, 67%)"
  },
  ".language-css .token.atrule .token.rule": {
    color: "hsl(286, 60%, 67%)"
  },
  ".language-javascript .token.operator": {
    color: "hsl(286, 60%, 67%)"
  },
  ".language-javascript .token.template-string > .token.interpolation > .token.interpolation-punctuation.punctuation": {
    color: "hsl(5, 48%, 51%)"
  },
  ".language-json .token.operator": {
    color: "hsl(220, 14%, 71%)"
  },
  ".language-json .token.null.keyword": {
    color: "hsl(29, 54%, 61%)"
  },
  ".language-markdown .token.url": {
    color: "hsl(220, 14%, 71%)"
  },
  ".language-markdown .token.url > .token.operator": {
    color: "hsl(220, 14%, 71%)"
  },
  ".language-markdown .token.url-reference.url > .token.string": {
    color: "hsl(220, 14%, 71%)"
  },
  ".language-markdown .token.url > .token.content": {
    color: "hsl(207, 82%, 66%)"
  },
  ".language-markdown .token.url > .token.url": {
    color: "hsl(187, 47%, 55%)"
  },
  ".language-markdown .token.url-reference.url": {
    color: "hsl(187, 47%, 55%)"
  },
  ".language-markdown .token.blockquote.punctuation": {
    color: "hsl(220, 10%, 40%)",
    fontStyle: "italic"
  },
  ".language-markdown .token.hr.punctuation": {
    color: "hsl(220, 10%, 40%)",
    fontStyle: "italic"
  },
  ".language-markdown .token.code-snippet": {
    color: "hsl(95, 38%, 62%)"
  },
  ".language-markdown .token.bold .token.content": {
    color: "hsl(29, 54%, 61%)"
  },
  ".language-markdown .token.italic .token.content": {
    color: "hsl(286, 60%, 67%)"
  },
  ".language-markdown .token.strike .token.content": {
    color: "hsl(355, 65%, 65%)"
  },
  ".language-markdown .token.strike .token.punctuation": {
    color: "hsl(355, 65%, 65%)"
  },
  ".language-markdown .token.list.punctuation": {
    color: "hsl(355, 65%, 65%)"
  },
  ".language-markdown .token.title.important > .token.punctuation": {
    color: "hsl(355, 65%, 65%)"
  },
  bold: {
    fontWeight: "bold"
  },
  italic: {
    fontStyle: "italic"
  },
  namespace: {
    Opacity: "0.8"
  },
  "token.tab:not(:empty):before": {
    color: "hsla(220, 14%, 71%, 0.15)",
    textShadow: "none"
  },
  "token.cr:before": {
    color: "hsla(220, 14%, 71%, 0.15)",
    textShadow: "none"
  },
  "token.lf:before": {
    color: "hsla(220, 14%, 71%, 0.15)",
    textShadow: "none"
  },
  "token.space:before": {
    color: "hsla(220, 14%, 71%, 0.15)",
    textShadow: "none"
  },
  "div.code-toolbar > .toolbar.toolbar > .toolbar-item": {
    marginRight: "0.4em"
  },
  "div.code-toolbar > .toolbar.toolbar > .toolbar-item > button": {
    background: "hsl(220, 13%, 26%)",
    color: "hsl(220, 9%, 55%)",
    padding: "0.1em 0.4em",
    borderRadius: "0.3em"
  },
  "div.code-toolbar > .toolbar.toolbar > .toolbar-item > a": {
    background: "hsl(220, 13%, 26%)",
    color: "hsl(220, 9%, 55%)",
    padding: "0.1em 0.4em",
    borderRadius: "0.3em"
  },
  "div.code-toolbar > .toolbar.toolbar > .toolbar-item > span": {
    background: "hsl(220, 13%, 26%)",
    color: "hsl(220, 9%, 55%)",
    padding: "0.1em 0.4em",
    borderRadius: "0.3em"
  },
  "div.code-toolbar > .toolbar.toolbar > .toolbar-item > button:hover": {
    background: "hsl(220, 13%, 28%)",
    color: "hsl(220, 14%, 71%)"
  },
  "div.code-toolbar > .toolbar.toolbar > .toolbar-item > button:focus": {
    background: "hsl(220, 13%, 28%)",
    color: "hsl(220, 14%, 71%)"
  },
  "div.code-toolbar > .toolbar.toolbar > .toolbar-item > a:hover": {
    background: "hsl(220, 13%, 28%)",
    color: "hsl(220, 14%, 71%)"
  },
  "div.code-toolbar > .toolbar.toolbar > .toolbar-item > a:focus": {
    background: "hsl(220, 13%, 28%)",
    color: "hsl(220, 14%, 71%)"
  },
  "div.code-toolbar > .toolbar.toolbar > .toolbar-item > span:hover": {
    background: "hsl(220, 13%, 28%)",
    color: "hsl(220, 14%, 71%)"
  },
  "div.code-toolbar > .toolbar.toolbar > .toolbar-item > span:focus": {
    background: "hsl(220, 13%, 28%)",
    color: "hsl(220, 14%, 71%)"
  },
  ".line-highlight.line-highlight": {
    background: "hsla(220, 100%, 80%, 0.04)"
  },
  ".line-highlight.line-highlight:before": {
    background: "hsl(220, 13%, 26%)",
    color: "hsl(220, 14%, 71%)",
    padding: "0.1em 0.6em",
    borderRadius: "0.3em",
    boxShadow: "0 2px 0 0 rgba(0, 0, 0, 0.2)"
  },
  ".line-highlight.line-highlight[data-end]:after": {
    background: "hsl(220, 13%, 26%)",
    color: "hsl(220, 14%, 71%)",
    padding: "0.1em 0.6em",
    borderRadius: "0.3em",
    boxShadow: "0 2px 0 0 rgba(0, 0, 0, 0.2)"
  },
  "pre[id].linkable-line-numbers.linkable-line-numbers span.line-numbers-rows > span:hover:before": {
    backgroundColor: "hsla(220, 100%, 80%, 0.04)"
  },
  ".line-numbers.line-numbers .line-numbers-rows": {
    borderRightColor: "hsla(220, 14%, 71%, 0.15)"
  },
  ".command-line .command-line-prompt": {
    borderRightColor: "hsla(220, 14%, 71%, 0.15)"
  },
  ".line-numbers .line-numbers-rows > span:before": {
    color: "hsl(220, 14%, 45%)"
  },
  ".command-line .command-line-prompt > span:before": {
    color: "hsl(220, 14%, 45%)"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-1": {
    color: "hsl(355, 65%, 65%)"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-5": {
    color: "hsl(355, 65%, 65%)"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-9": {
    color: "hsl(355, 65%, 65%)"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-2": {
    color: "hsl(95, 38%, 62%)"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-6": {
    color: "hsl(95, 38%, 62%)"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-10": {
    color: "hsl(95, 38%, 62%)"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-3": {
    color: "hsl(207, 82%, 66%)"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-7": {
    color: "hsl(207, 82%, 66%)"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-11": {
    color: "hsl(207, 82%, 66%)"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-4": {
    color: "hsl(286, 60%, 67%)"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-8": {
    color: "hsl(286, 60%, 67%)"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-12": {
    color: "hsl(286, 60%, 67%)"
  },
  "pre.diff-highlight > code .token.token.deleted:not(.prefix)": {
    backgroundColor: "hsla(353, 100%, 66%, 0.15)"
  },
  "pre > code.diff-highlight .token.token.deleted:not(.prefix)": {
    backgroundColor: "hsla(353, 100%, 66%, 0.15)"
  },
  "pre.diff-highlight > code .token.token.deleted:not(.prefix)::-moz-selection": {
    backgroundColor: "hsla(353, 95%, 66%, 0.25)"
  },
  "pre.diff-highlight > code .token.token.deleted:not(.prefix) *::-moz-selection": {
    backgroundColor: "hsla(353, 95%, 66%, 0.25)"
  },
  "pre > code.diff-highlight .token.token.deleted:not(.prefix)::-moz-selection": {
    backgroundColor: "hsla(353, 95%, 66%, 0.25)"
  },
  "pre > code.diff-highlight .token.token.deleted:not(.prefix) *::-moz-selection": {
    backgroundColor: "hsla(353, 95%, 66%, 0.25)"
  },
  "pre.diff-highlight > code .token.token.deleted:not(.prefix)::selection": {
    backgroundColor: "hsla(353, 95%, 66%, 0.25)"
  },
  "pre.diff-highlight > code .token.token.deleted:not(.prefix) *::selection": {
    backgroundColor: "hsla(353, 95%, 66%, 0.25)"
  },
  "pre > code.diff-highlight .token.token.deleted:not(.prefix)::selection": {
    backgroundColor: "hsla(353, 95%, 66%, 0.25)"
  },
  "pre > code.diff-highlight .token.token.deleted:not(.prefix) *::selection": {
    backgroundColor: "hsla(353, 95%, 66%, 0.25)"
  },
  "pre.diff-highlight > code .token.token.inserted:not(.prefix)": {
    backgroundColor: "hsla(137, 100%, 55%, 0.15)"
  },
  "pre > code.diff-highlight .token.token.inserted:not(.prefix)": {
    backgroundColor: "hsla(137, 100%, 55%, 0.15)"
  },
  "pre.diff-highlight > code .token.token.inserted:not(.prefix)::-moz-selection": {
    backgroundColor: "hsla(135, 73%, 55%, 0.25)"
  },
  "pre.diff-highlight > code .token.token.inserted:not(.prefix) *::-moz-selection": {
    backgroundColor: "hsla(135, 73%, 55%, 0.25)"
  },
  "pre > code.diff-highlight .token.token.inserted:not(.prefix)::-moz-selection": {
    backgroundColor: "hsla(135, 73%, 55%, 0.25)"
  },
  "pre > code.diff-highlight .token.token.inserted:not(.prefix) *::-moz-selection": {
    backgroundColor: "hsla(135, 73%, 55%, 0.25)"
  },
  "pre.diff-highlight > code .token.token.inserted:not(.prefix)::selection": {
    backgroundColor: "hsla(135, 73%, 55%, 0.25)"
  },
  "pre.diff-highlight > code .token.token.inserted:not(.prefix) *::selection": {
    backgroundColor: "hsla(135, 73%, 55%, 0.25)"
  },
  "pre > code.diff-highlight .token.token.inserted:not(.prefix)::selection": {
    backgroundColor: "hsla(135, 73%, 55%, 0.25)"
  },
  "pre > code.diff-highlight .token.token.inserted:not(.prefix) *::selection": {
    backgroundColor: "hsla(135, 73%, 55%, 0.25)"
  },
  ".prism-previewer.prism-previewer:before": {
    borderColor: "hsl(224, 13%, 17%)"
  },
  ".prism-previewer-gradient.prism-previewer-gradient div": {
    borderColor: "hsl(224, 13%, 17%)",
    borderRadius: "0.3em"
  },
  ".prism-previewer-color.prism-previewer-color:before": {
    borderRadius: "0.3em"
  },
  ".prism-previewer-easing.prism-previewer-easing:before": {
    borderRadius: "0.3em"
  },
  ".prism-previewer.prism-previewer:after": {
    borderTopColor: "hsl(224, 13%, 17%)"
  },
  ".prism-previewer-flipped.prism-previewer-flipped.after": {
    borderBottomColor: "hsl(224, 13%, 17%)"
  },
  ".prism-previewer-angle.prism-previewer-angle:before": {
    background: "hsl(219, 13%, 22%)"
  },
  ".prism-previewer-time.prism-previewer-time:before": {
    background: "hsl(219, 13%, 22%)"
  },
  ".prism-previewer-easing.prism-previewer-easing": {
    background: "hsl(219, 13%, 22%)"
  },
  ".prism-previewer-angle.prism-previewer-angle circle": {
    stroke: "hsl(220, 14%, 71%)",
    strokeOpacity: "1"
  },
  ".prism-previewer-time.prism-previewer-time circle": {
    stroke: "hsl(220, 14%, 71%)",
    strokeOpacity: "1"
  },
  ".prism-previewer-easing.prism-previewer-easing circle": {
    stroke: "hsl(220, 14%, 71%)",
    fill: "transparent"
  },
  ".prism-previewer-easing.prism-previewer-easing path": {
    stroke: "hsl(220, 14%, 71%)"
  },
  ".prism-previewer-easing.prism-previewer-easing line": {
    stroke: "hsl(220, 14%, 71%)"
  }
}, ul = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Pn
}, Symbol.toStringTag, { value: "Module" })), In = {
  'code[class*="language-"]': {
    background: "hsl(230, 1%, 98%)",
    color: "hsl(230, 8%, 24%)",
    fontFamily: '"Fira Code", "Fira Mono", Menlo, Consolas, "DejaVu Sans Mono", monospace',
    direction: "ltr",
    textAlign: "left",
    whiteSpace: "pre",
    wordSpacing: "normal",
    wordBreak: "normal",
    lineHeight: "1.5",
    MozTabSize: "2",
    OTabSize: "2",
    tabSize: "2",
    WebkitHyphens: "none",
    MozHyphens: "none",
    msHyphens: "none",
    hyphens: "none"
  },
  'pre[class*="language-"]': {
    background: "hsl(230, 1%, 98%)",
    color: "hsl(230, 8%, 24%)",
    fontFamily: '"Fira Code", "Fira Mono", Menlo, Consolas, "DejaVu Sans Mono", monospace',
    direction: "ltr",
    textAlign: "left",
    whiteSpace: "pre",
    wordSpacing: "normal",
    wordBreak: "normal",
    lineHeight: "1.5",
    MozTabSize: "2",
    OTabSize: "2",
    tabSize: "2",
    WebkitHyphens: "none",
    MozHyphens: "none",
    msHyphens: "none",
    hyphens: "none",
    padding: "1em",
    margin: "0.5em 0",
    overflow: "auto",
    borderRadius: "0.3em"
  },
  'code[class*="language-"]::-moz-selection': {
    background: "hsl(230, 1%, 90%)",
    color: "inherit"
  },
  'code[class*="language-"] *::-moz-selection': {
    background: "hsl(230, 1%, 90%)",
    color: "inherit"
  },
  'pre[class*="language-"] *::-moz-selection': {
    background: "hsl(230, 1%, 90%)",
    color: "inherit"
  },
  'code[class*="language-"]::selection': {
    background: "hsl(230, 1%, 90%)",
    color: "inherit"
  },
  'code[class*="language-"] *::selection': {
    background: "hsl(230, 1%, 90%)",
    color: "inherit"
  },
  'pre[class*="language-"] *::selection': {
    background: "hsl(230, 1%, 90%)",
    color: "inherit"
  },
  ':not(pre) > code[class*="language-"]': {
    padding: "0.2em 0.3em",
    borderRadius: "0.3em",
    whiteSpace: "normal"
  },
  comment: {
    color: "hsl(230, 4%, 64%)",
    fontStyle: "italic"
  },
  prolog: {
    color: "hsl(230, 4%, 64%)"
  },
  cdata: {
    color: "hsl(230, 4%, 64%)"
  },
  doctype: {
    color: "hsl(230, 8%, 24%)"
  },
  punctuation: {
    color: "hsl(230, 8%, 24%)"
  },
  entity: {
    color: "hsl(230, 8%, 24%)",
    cursor: "help"
  },
  "attr-name": {
    color: "hsl(35, 99%, 36%)"
  },
  "class-name": {
    color: "hsl(35, 99%, 36%)"
  },
  boolean: {
    color: "hsl(35, 99%, 36%)"
  },
  constant: {
    color: "hsl(35, 99%, 36%)"
  },
  number: {
    color: "hsl(35, 99%, 36%)"
  },
  atrule: {
    color: "hsl(35, 99%, 36%)"
  },
  keyword: {
    color: "hsl(301, 63%, 40%)"
  },
  property: {
    color: "hsl(5, 74%, 59%)"
  },
  tag: {
    color: "hsl(5, 74%, 59%)"
  },
  symbol: {
    color: "hsl(5, 74%, 59%)"
  },
  deleted: {
    color: "hsl(5, 74%, 59%)"
  },
  important: {
    color: "hsl(5, 74%, 59%)"
  },
  selector: {
    color: "hsl(119, 34%, 47%)"
  },
  string: {
    color: "hsl(119, 34%, 47%)"
  },
  char: {
    color: "hsl(119, 34%, 47%)"
  },
  builtin: {
    color: "hsl(119, 34%, 47%)"
  },
  inserted: {
    color: "hsl(119, 34%, 47%)"
  },
  regex: {
    color: "hsl(119, 34%, 47%)"
  },
  "attr-value": {
    color: "hsl(119, 34%, 47%)"
  },
  "attr-value > .token.punctuation": {
    color: "hsl(119, 34%, 47%)"
  },
  variable: {
    color: "hsl(221, 87%, 60%)"
  },
  operator: {
    color: "hsl(221, 87%, 60%)"
  },
  function: {
    color: "hsl(221, 87%, 60%)"
  },
  url: {
    color: "hsl(198, 99%, 37%)"
  },
  "attr-value > .token.punctuation.attr-equals": {
    color: "hsl(230, 8%, 24%)"
  },
  "special-attr > .token.attr-value > .token.value.css": {
    color: "hsl(230, 8%, 24%)"
  },
  ".language-css .token.selector": {
    color: "hsl(5, 74%, 59%)"
  },
  ".language-css .token.property": {
    color: "hsl(230, 8%, 24%)"
  },
  ".language-css .token.function": {
    color: "hsl(198, 99%, 37%)"
  },
  ".language-css .token.url > .token.function": {
    color: "hsl(198, 99%, 37%)"
  },
  ".language-css .token.url > .token.string.url": {
    color: "hsl(119, 34%, 47%)"
  },
  ".language-css .token.important": {
    color: "hsl(301, 63%, 40%)"
  },
  ".language-css .token.atrule .token.rule": {
    color: "hsl(301, 63%, 40%)"
  },
  ".language-javascript .token.operator": {
    color: "hsl(301, 63%, 40%)"
  },
  ".language-javascript .token.template-string > .token.interpolation > .token.interpolation-punctuation.punctuation": {
    color: "hsl(344, 84%, 43%)"
  },
  ".language-json .token.operator": {
    color: "hsl(230, 8%, 24%)"
  },
  ".language-json .token.null.keyword": {
    color: "hsl(35, 99%, 36%)"
  },
  ".language-markdown .token.url": {
    color: "hsl(230, 8%, 24%)"
  },
  ".language-markdown .token.url > .token.operator": {
    color: "hsl(230, 8%, 24%)"
  },
  ".language-markdown .token.url-reference.url > .token.string": {
    color: "hsl(230, 8%, 24%)"
  },
  ".language-markdown .token.url > .token.content": {
    color: "hsl(221, 87%, 60%)"
  },
  ".language-markdown .token.url > .token.url": {
    color: "hsl(198, 99%, 37%)"
  },
  ".language-markdown .token.url-reference.url": {
    color: "hsl(198, 99%, 37%)"
  },
  ".language-markdown .token.blockquote.punctuation": {
    color: "hsl(230, 4%, 64%)",
    fontStyle: "italic"
  },
  ".language-markdown .token.hr.punctuation": {
    color: "hsl(230, 4%, 64%)",
    fontStyle: "italic"
  },
  ".language-markdown .token.code-snippet": {
    color: "hsl(119, 34%, 47%)"
  },
  ".language-markdown .token.bold .token.content": {
    color: "hsl(35, 99%, 36%)"
  },
  ".language-markdown .token.italic .token.content": {
    color: "hsl(301, 63%, 40%)"
  },
  ".language-markdown .token.strike .token.content": {
    color: "hsl(5, 74%, 59%)"
  },
  ".language-markdown .token.strike .token.punctuation": {
    color: "hsl(5, 74%, 59%)"
  },
  ".language-markdown .token.list.punctuation": {
    color: "hsl(5, 74%, 59%)"
  },
  ".language-markdown .token.title.important > .token.punctuation": {
    color: "hsl(5, 74%, 59%)"
  },
  bold: {
    fontWeight: "bold"
  },
  italic: {
    fontStyle: "italic"
  },
  namespace: {
    Opacity: "0.8"
  },
  "token.tab:not(:empty):before": {
    color: "hsla(230, 8%, 24%, 0.2)"
  },
  "token.cr:before": {
    color: "hsla(230, 8%, 24%, 0.2)"
  },
  "token.lf:before": {
    color: "hsla(230, 8%, 24%, 0.2)"
  },
  "token.space:before": {
    color: "hsla(230, 8%, 24%, 0.2)"
  },
  "div.code-toolbar > .toolbar.toolbar > .toolbar-item": {
    marginRight: "0.4em"
  },
  "div.code-toolbar > .toolbar.toolbar > .toolbar-item > button": {
    background: "hsl(230, 1%, 90%)",
    color: "hsl(230, 6%, 44%)",
    padding: "0.1em 0.4em",
    borderRadius: "0.3em"
  },
  "div.code-toolbar > .toolbar.toolbar > .toolbar-item > a": {
    background: "hsl(230, 1%, 90%)",
    color: "hsl(230, 6%, 44%)",
    padding: "0.1em 0.4em",
    borderRadius: "0.3em"
  },
  "div.code-toolbar > .toolbar.toolbar > .toolbar-item > span": {
    background: "hsl(230, 1%, 90%)",
    color: "hsl(230, 6%, 44%)",
    padding: "0.1em 0.4em",
    borderRadius: "0.3em"
  },
  "div.code-toolbar > .toolbar.toolbar > .toolbar-item > button:hover": {
    background: "hsl(230, 1%, 78%)",
    color: "hsl(230, 8%, 24%)"
  },
  "div.code-toolbar > .toolbar.toolbar > .toolbar-item > button:focus": {
    background: "hsl(230, 1%, 78%)",
    color: "hsl(230, 8%, 24%)"
  },
  "div.code-toolbar > .toolbar.toolbar > .toolbar-item > a:hover": {
    background: "hsl(230, 1%, 78%)",
    color: "hsl(230, 8%, 24%)"
  },
  "div.code-toolbar > .toolbar.toolbar > .toolbar-item > a:focus": {
    background: "hsl(230, 1%, 78%)",
    color: "hsl(230, 8%, 24%)"
  },
  "div.code-toolbar > .toolbar.toolbar > .toolbar-item > span:hover": {
    background: "hsl(230, 1%, 78%)",
    color: "hsl(230, 8%, 24%)"
  },
  "div.code-toolbar > .toolbar.toolbar > .toolbar-item > span:focus": {
    background: "hsl(230, 1%, 78%)",
    color: "hsl(230, 8%, 24%)"
  },
  ".line-highlight.line-highlight": {
    background: "hsla(230, 8%, 24%, 0.05)"
  },
  ".line-highlight.line-highlight:before": {
    background: "hsl(230, 1%, 90%)",
    color: "hsl(230, 8%, 24%)",
    padding: "0.1em 0.6em",
    borderRadius: "0.3em",
    boxShadow: "0 2px 0 0 rgba(0, 0, 0, 0.2)"
  },
  ".line-highlight.line-highlight[data-end]:after": {
    background: "hsl(230, 1%, 90%)",
    color: "hsl(230, 8%, 24%)",
    padding: "0.1em 0.6em",
    borderRadius: "0.3em",
    boxShadow: "0 2px 0 0 rgba(0, 0, 0, 0.2)"
  },
  "pre[id].linkable-line-numbers.linkable-line-numbers span.line-numbers-rows > span:hover:before": {
    backgroundColor: "hsla(230, 8%, 24%, 0.05)"
  },
  ".line-numbers.line-numbers .line-numbers-rows": {
    borderRightColor: "hsla(230, 8%, 24%, 0.2)"
  },
  ".command-line .command-line-prompt": {
    borderRightColor: "hsla(230, 8%, 24%, 0.2)"
  },
  ".line-numbers .line-numbers-rows > span:before": {
    color: "hsl(230, 1%, 62%)"
  },
  ".command-line .command-line-prompt > span:before": {
    color: "hsl(230, 1%, 62%)"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-1": {
    color: "hsl(5, 74%, 59%)"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-5": {
    color: "hsl(5, 74%, 59%)"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-9": {
    color: "hsl(5, 74%, 59%)"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-2": {
    color: "hsl(119, 34%, 47%)"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-6": {
    color: "hsl(119, 34%, 47%)"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-10": {
    color: "hsl(119, 34%, 47%)"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-3": {
    color: "hsl(221, 87%, 60%)"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-7": {
    color: "hsl(221, 87%, 60%)"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-11": {
    color: "hsl(221, 87%, 60%)"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-4": {
    color: "hsl(301, 63%, 40%)"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-8": {
    color: "hsl(301, 63%, 40%)"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-12": {
    color: "hsl(301, 63%, 40%)"
  },
  "pre.diff-highlight > code .token.token.deleted:not(.prefix)": {
    backgroundColor: "hsla(353, 100%, 66%, 0.15)"
  },
  "pre > code.diff-highlight .token.token.deleted:not(.prefix)": {
    backgroundColor: "hsla(353, 100%, 66%, 0.15)"
  },
  "pre.diff-highlight > code .token.token.deleted:not(.prefix)::-moz-selection": {
    backgroundColor: "hsla(353, 95%, 66%, 0.25)"
  },
  "pre.diff-highlight > code .token.token.deleted:not(.prefix) *::-moz-selection": {
    backgroundColor: "hsla(353, 95%, 66%, 0.25)"
  },
  "pre > code.diff-highlight .token.token.deleted:not(.prefix)::-moz-selection": {
    backgroundColor: "hsla(353, 95%, 66%, 0.25)"
  },
  "pre > code.diff-highlight .token.token.deleted:not(.prefix) *::-moz-selection": {
    backgroundColor: "hsla(353, 95%, 66%, 0.25)"
  },
  "pre.diff-highlight > code .token.token.deleted:not(.prefix)::selection": {
    backgroundColor: "hsla(353, 95%, 66%, 0.25)"
  },
  "pre.diff-highlight > code .token.token.deleted:not(.prefix) *::selection": {
    backgroundColor: "hsla(353, 95%, 66%, 0.25)"
  },
  "pre > code.diff-highlight .token.token.deleted:not(.prefix)::selection": {
    backgroundColor: "hsla(353, 95%, 66%, 0.25)"
  },
  "pre > code.diff-highlight .token.token.deleted:not(.prefix) *::selection": {
    backgroundColor: "hsla(353, 95%, 66%, 0.25)"
  },
  "pre.diff-highlight > code .token.token.inserted:not(.prefix)": {
    backgroundColor: "hsla(137, 100%, 55%, 0.15)"
  },
  "pre > code.diff-highlight .token.token.inserted:not(.prefix)": {
    backgroundColor: "hsla(137, 100%, 55%, 0.15)"
  },
  "pre.diff-highlight > code .token.token.inserted:not(.prefix)::-moz-selection": {
    backgroundColor: "hsla(135, 73%, 55%, 0.25)"
  },
  "pre.diff-highlight > code .token.token.inserted:not(.prefix) *::-moz-selection": {
    backgroundColor: "hsla(135, 73%, 55%, 0.25)"
  },
  "pre > code.diff-highlight .token.token.inserted:not(.prefix)::-moz-selection": {
    backgroundColor: "hsla(135, 73%, 55%, 0.25)"
  },
  "pre > code.diff-highlight .token.token.inserted:not(.prefix) *::-moz-selection": {
    backgroundColor: "hsla(135, 73%, 55%, 0.25)"
  },
  "pre.diff-highlight > code .token.token.inserted:not(.prefix)::selection": {
    backgroundColor: "hsla(135, 73%, 55%, 0.25)"
  },
  "pre.diff-highlight > code .token.token.inserted:not(.prefix) *::selection": {
    backgroundColor: "hsla(135, 73%, 55%, 0.25)"
  },
  "pre > code.diff-highlight .token.token.inserted:not(.prefix)::selection": {
    backgroundColor: "hsla(135, 73%, 55%, 0.25)"
  },
  "pre > code.diff-highlight .token.token.inserted:not(.prefix) *::selection": {
    backgroundColor: "hsla(135, 73%, 55%, 0.25)"
  },
  ".prism-previewer.prism-previewer:before": {
    borderColor: "hsl(0, 0, 95%)"
  },
  ".prism-previewer-gradient.prism-previewer-gradient div": {
    borderColor: "hsl(0, 0, 95%)",
    borderRadius: "0.3em"
  },
  ".prism-previewer-color.prism-previewer-color:before": {
    borderRadius: "0.3em"
  },
  ".prism-previewer-easing.prism-previewer-easing:before": {
    borderRadius: "0.3em"
  },
  ".prism-previewer.prism-previewer:after": {
    borderTopColor: "hsl(0, 0, 95%)"
  },
  ".prism-previewer-flipped.prism-previewer-flipped.after": {
    borderBottomColor: "hsl(0, 0, 95%)"
  },
  ".prism-previewer-angle.prism-previewer-angle:before": {
    background: "hsl(0, 0%, 100%)"
  },
  ".prism-previewer-time.prism-previewer-time:before": {
    background: "hsl(0, 0%, 100%)"
  },
  ".prism-previewer-easing.prism-previewer-easing": {
    background: "hsl(0, 0%, 100%)"
  },
  ".prism-previewer-angle.prism-previewer-angle circle": {
    stroke: "hsl(230, 8%, 24%)",
    strokeOpacity: "1"
  },
  ".prism-previewer-time.prism-previewer-time circle": {
    stroke: "hsl(230, 8%, 24%)",
    strokeOpacity: "1"
  },
  ".prism-previewer-easing.prism-previewer-easing circle": {
    stroke: "hsl(230, 8%, 24%)",
    fill: "transparent"
  },
  ".prism-previewer-easing.prism-previewer-easing path": {
    stroke: "hsl(230, 8%, 24%)"
  },
  ".prism-previewer-easing.prism-previewer-easing line": {
    stroke: "hsl(230, 8%, 24%)"
  }
}, pl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: In
}, Symbol.toStringTag, { value: "Module" })), ct = /[#.]/g;
function hl(e, t) {
  const r = e || "", o = {};
  let c = 0, h, k;
  for (; c < r.length; ) {
    ct.lastIndex = c;
    const s = ct.exec(r), b = r.slice(c, s ? s.index : r.length);
    b && (h ? h === "#" ? o.id = b : Array.isArray(o.className) ? o.className.push(b) : o.className = [b] : k = b, c += b.length), s && (h = s[0], c++);
  }
  return {
    type: "element",
    // @ts-expect-error: tag name is parsed.
    tagName: k || t || "div",
    properties: o,
    children: []
  };
}
const st = /[#.]/g;
function fl(e, t) {
  const r = e || "", o = {};
  let c = 0, h, k;
  for (; c < r.length; ) {
    st.lastIndex = c;
    const s = st.exec(r), b = r.slice(c, s ? s.index : r.length);
    b && (h ? h === "#" ? o.id = b : Array.isArray(o.className) ? o.className.push(b) : o.className = [b] : k = b, c += b.length), s && (h = s[0], c++);
  }
  return {
    type: "element",
    // @ts-expect-error: tag name is parsed.
    tagName: k || t || "div",
    properties: o,
    children: []
  };
}
var Me = qe;
qe.displayName = "clike";
qe.aliases = [];
function qe(e) {
  e.languages.clike = {
    comment: [
      {
        pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
        lookbehind: !0,
        greedy: !0
      },
      {
        pattern: /(^|[^\\:])\/\/.*/,
        lookbehind: !0,
        greedy: !0
      }
    ],
    string: {
      pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
      greedy: !0
    },
    "class-name": {
      pattern: /(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,
      lookbehind: !0,
      inside: {
        punctuation: /[.\\]/
      }
    },
    keyword: /\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,
    boolean: /\b(?:false|true)\b/,
    function: /\b\w+(?=\()/,
    number: /\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
    operator: /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
    punctuation: /[{}[\];(),.:]/
  };
}
const zn = /* @__PURE__ */ me(Me), Rn = /* @__PURE__ */ ve({
  __proto__: null,
  default: zn
}, [Me]);
var De = Ge;
Ge.displayName = "css";
Ge.aliases = [];
function Ge(e) {
  (function(t) {
    var r = /(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;
    t.languages.css = {
      comment: /\/\*[\s\S]*?\*\//,
      atrule: {
        pattern: /@[\w-](?:[^;{\s]|\s+(?![\s{]))*(?:;|(?=\s*\{))/,
        inside: {
          rule: /^@[\w-]+/,
          "selector-function-argument": {
            pattern: /(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,
            lookbehind: !0,
            alias: "selector"
          },
          keyword: {
            pattern: /(^|[^\w-])(?:and|not|only|or)(?![\w-])/,
            lookbehind: !0
          }
          // See rest below
        }
      },
      url: {
        // https://drafts.csswg.org/css-values-3/#urls
        pattern: RegExp(
          "\\burl\\((?:" + r.source + "|" + /(?:[^\\\r\n()"']|\\[\s\S])*/.source + ")\\)",
          "i"
        ),
        greedy: !0,
        inside: {
          function: /^url/i,
          punctuation: /^\(|\)$/,
          string: {
            pattern: RegExp("^" + r.source + "$"),
            alias: "url"
          }
        }
      },
      selector: {
        pattern: RegExp(
          `(^|[{}\\s])[^{}\\s](?:[^{};"'\\s]|\\s+(?![\\s{])|` + r.source + ")*(?=\\s*\\{)"
        ),
        lookbehind: !0
      },
      string: {
        pattern: r,
        greedy: !0
      },
      property: {
        pattern: /(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,
        lookbehind: !0
      },
      important: /!important\b/i,
      function: {
        pattern: /(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,
        lookbehind: !0
      },
      punctuation: /[(){};:,]/
    }, t.languages.css.atrule.inside.rest = t.languages.css;
    var o = t.languages.markup;
    o && (o.tag.addInlined("style", "css"), o.tag.addAttribute("style", "css"));
  })(e);
}
const Mn = /* @__PURE__ */ me(De), qn = /* @__PURE__ */ ve({
  __proto__: null,
  default: Mn
}, [De]);
var He = Ue;
Ue.displayName = "javascript";
Ue.aliases = ["js"];
function Ue(e) {
  e.languages.javascript = e.languages.extend("clike", {
    "class-name": [
      e.languages.clike["class-name"],
      {
        pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,
        lookbehind: !0
      }
    ],
    keyword: [
      {
        pattern: /((?:^|\})\s*)catch\b/,
        lookbehind: !0
      },
      {
        pattern: /(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
        lookbehind: !0
      }
    ],
    // Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
    function: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
    number: {
      pattern: RegExp(
        /(^|[^\w$])/.source + "(?:" + // constant
        (/NaN|Infinity/.source + "|" + // binary integer
        /0[bB][01]+(?:_[01]+)*n?/.source + "|" + // octal integer
        /0[oO][0-7]+(?:_[0-7]+)*n?/.source + "|" + // hexadecimal integer
        /0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source + "|" + // decimal bigint
        /\d+(?:_\d+)*n/.source + "|" + // decimal number (integer or float) but no bigint
        /(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/.source) + ")" + /(?![\w$])/.source
      ),
      lookbehind: !0
    },
    operator: /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/
  }), e.languages.javascript["class-name"][0].pattern = /(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/, e.languages.insertBefore("javascript", "keyword", {
    regex: {
      // eslint-disable-next-line regexp/no-dupe-characters-character-class
      pattern: /((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)\/(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/,
      lookbehind: !0,
      greedy: !0,
      inside: {
        "regex-source": {
          pattern: /^(\/)[\s\S]+(?=\/[a-z]*$)/,
          lookbehind: !0,
          alias: "language-regex",
          inside: e.languages.regex
        },
        "regex-delimiter": /^\/|\/$/,
        "regex-flags": /^[a-z]+$/
      }
    },
    // This must be declared before keyword because we use "function" inside the look-forward
    "function-variable": {
      pattern: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,
      alias: "function"
    },
    parameter: [
      {
        pattern: /(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,
        lookbehind: !0,
        inside: e.languages.javascript
      },
      {
        pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,
        lookbehind: !0,
        inside: e.languages.javascript
      },
      {
        pattern: /(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,
        lookbehind: !0,
        inside: e.languages.javascript
      },
      {
        pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,
        lookbehind: !0,
        inside: e.languages.javascript
      }
    ],
    constant: /\b[A-Z](?:[A-Z_]|\dx?)*\b/
  }), e.languages.insertBefore("javascript", "string", {
    hashbang: {
      pattern: /^#!.*/,
      greedy: !0,
      alias: "comment"
    },
    "template-string": {
      pattern: /`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,
      greedy: !0,
      inside: {
        "template-punctuation": {
          pattern: /^`|`$/,
          alias: "string"
        },
        interpolation: {
          pattern: /((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,
          lookbehind: !0,
          inside: {
            "interpolation-punctuation": {
              pattern: /^\$\{|\}$/,
              alias: "punctuation"
            },
            rest: e.languages.javascript
          }
        },
        string: /[\s\S]+/
      }
    },
    "string-property": {
      pattern: /((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,
      lookbehind: !0,
      greedy: !0,
      alias: "property"
    }
  }), e.languages.insertBefore("javascript", "operator", {
    "literal-property": {
      pattern: /((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,
      lookbehind: !0,
      alias: "property"
    }
  }), e.languages.markup && (e.languages.markup.tag.addInlined("script", "javascript"), e.languages.markup.tag.addAttribute(
    /on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/.source,
    "javascript"
  )), e.languages.js = e.languages.javascript;
}
const Dn = /* @__PURE__ */ me(He), Gn = /* @__PURE__ */ ve({
  __proto__: null,
  default: Dn
}, [He]);
var Be = We;
We.displayName = "markup";
We.aliases = ["html", "mathml", "svg", "xml", "ssml", "atom", "rss"];
function We(e) {
  e.languages.markup = {
    comment: {
      pattern: /<!--(?:(?!<!--)[\s\S])*?-->/,
      greedy: !0
    },
    prolog: {
      pattern: /<\?[\s\S]+?\?>/,
      greedy: !0
    },
    doctype: {
      // https://www.w3.org/TR/xml/#NT-doctypedecl
      pattern: /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,
      greedy: !0,
      inside: {
        "internal-subset": {
          pattern: /(^[^\[]*\[)[\s\S]+(?=\]>$)/,
          lookbehind: !0,
          greedy: !0,
          inside: null
          // see below
        },
        string: {
          pattern: /"[^"]*"|'[^']*'/,
          greedy: !0
        },
        punctuation: /^<!|>$|[[\]]/,
        "doctype-tag": /^DOCTYPE/i,
        name: /[^\s<>'"]+/
      }
    },
    cdata: {
      pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
      greedy: !0
    },
    tag: {
      pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
      greedy: !0,
      inside: {
        tag: {
          pattern: /^<\/?[^\s>\/]+/,
          inside: {
            punctuation: /^<\/?/,
            namespace: /^[^\s>\/:]+:/
          }
        },
        "special-attr": [],
        "attr-value": {
          pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
          inside: {
            punctuation: [
              {
                pattern: /^=/,
                alias: "attr-equals"
              },
              /"|'/
            ]
          }
        },
        punctuation: /\/?>/,
        "attr-name": {
          pattern: /[^\s>\/]+/,
          inside: {
            namespace: /^[^\s>\/:]+:/
          }
        }
      }
    },
    entity: [
      {
        pattern: /&[\da-z]{1,8};/i,
        alias: "named-entity"
      },
      /&#x?[\da-f]{1,8};/i
    ]
  }, e.languages.markup.tag.inside["attr-value"].inside.entity = e.languages.markup.entity, e.languages.markup.doctype.inside["internal-subset"].inside = e.languages.markup, e.hooks.add("wrap", function(t) {
    t.type === "entity" && (t.attributes.title = t.content.value.replace(/&amp;/, "&"));
  }), Object.defineProperty(e.languages.markup.tag, "addInlined", {
    /**
     * Adds an inlined language to markup.
     *
     * An example of an inlined language is CSS with `<style>` tags.
     *
     * @param {string} tagName The name of the tag that contains the inlined language. This name will be treated as
     * case insensitive.
     * @param {string} lang The language key.
     * @example
     * addInlined('style', 'css');
     */
    value: function(r, o) {
      var c = {};
      c["language-" + o] = {
        pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
        lookbehind: !0,
        inside: e.languages[o]
      }, c.cdata = /^<!\[CDATA\[|\]\]>$/i;
      var h = {
        "included-cdata": {
          pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
          inside: c
        }
      };
      h["language-" + o] = {
        pattern: /[\s\S]+/,
        inside: e.languages[o]
      };
      var k = {};
      k[r] = {
        pattern: RegExp(
          /(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(
            /__/g,
            function() {
              return r;
            }
          ),
          "i"
        ),
        lookbehind: !0,
        greedy: !0,
        inside: h
      }, e.languages.insertBefore("markup", "cdata", k);
    }
  }), Object.defineProperty(e.languages.markup.tag, "addAttribute", {
    /**
     * Adds an pattern to highlight languages embedded in HTML attributes.
     *
     * An example of an inlined language is CSS with `style` attributes.
     *
     * @param {string} attrName The name of the tag that contains the inlined language. This name will be treated as
     * case insensitive.
     * @param {string} lang The language key.
     * @example
     * addAttribute('style', 'css');
     */
    value: function(t, r) {
      e.languages.markup.tag.inside["special-attr"].push({
        pattern: RegExp(
          /(^|["'\s])/.source + "(?:" + t + ")" + /\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,
          "i"
        ),
        lookbehind: !0,
        inside: {
          "attr-name": /^[^\s=]+/,
          "attr-value": {
            pattern: /=[\s\S]+/,
            inside: {
              value: {
                pattern: /(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,
                lookbehind: !0,
                alias: [r, "language-" + r],
                inside: e.languages[r]
              },
              punctuation: [
                {
                  pattern: /^=/,
                  alias: "attr-equals"
                },
                /"|'/
              ]
            }
          }
        }
      });
    }
  }), e.languages.html = e.languages.markup, e.languages.mathml = e.languages.markup, e.languages.svg = e.languages.markup, e.languages.xml = e.languages.extend("markup", {}), e.languages.ssml = e.languages.xml, e.languages.atom = e.languages.xml, e.languages.rss = e.languages.xml;
}
const Hn = /* @__PURE__ */ me(Be), Un = /* @__PURE__ */ ve({
  __proto__: null,
  default: Hn
}, [Be]);
var Bn = Vn, Wn = Object.prototype.hasOwnProperty;
function Vn() {
  for (var e = {}, t = 0; t < arguments.length; t++) {
    var r = arguments[t];
    for (var o in r)
      Wn.call(r, o) && (e[o] = r[o]);
  }
  return e;
}
var Pt = It, Ve = It.prototype;
Ve.space = null;
Ve.normal = {};
Ve.property = {};
function It(e, t, r) {
  this.property = e, this.normal = t, r && (this.space = r);
}
var ut = Bn, Yn = Pt, Zn = Kn;
function Kn(e) {
  for (var t = e.length, r = [], o = [], c = -1, h, k; ++c < t; )
    h = e[c], r.push(h.property), o.push(h.normal), k = h.space;
  return new Yn(
    ut.apply(null, r),
    ut.apply(null, o),
    k
  );
}
var Ye = Xn;
function Xn(e) {
  return e.toLowerCase();
}
var zt = Rt, X = Rt.prototype;
X.space = null;
X.attribute = null;
X.property = null;
X.boolean = !1;
X.booleanish = !1;
X.overloadedBoolean = !1;
X.number = !1;
X.commaSeparated = !1;
X.spaceSeparated = !1;
X.commaOrSpaceSeparated = !1;
X.mustUseProperty = !1;
X.defined = !1;
function Rt(e, t) {
  this.property = e, this.attribute = t;
}
var ee = {}, Jn = 0;
ee.boolean = ie();
ee.booleanish = ie();
ee.overloadedBoolean = ie();
ee.number = ie();
ee.spaceSeparated = ie();
ee.commaSeparated = ie();
ee.commaOrSpaceSeparated = ie();
function ie() {
  return Math.pow(2, ++Jn);
}
var Mt = zt, pt = ee, qt = Ze;
Ze.prototype = new Mt();
Ze.prototype.defined = !0;
var Dt = [
  "boolean",
  "booleanish",
  "overloadedBoolean",
  "number",
  "commaSeparated",
  "spaceSeparated",
  "commaOrSpaceSeparated"
], Qn = Dt.length;
function Ze(e, t, r, o) {
  var c = -1, h;
  for (ht(this, "space", o), Mt.call(this, e, t); ++c < Qn; )
    h = Dt[c], ht(this, h, (r & pt[h]) === pt[h]);
}
function ht(e, t, r) {
  r && (e[t] = r);
}
var ft = Ye, er = Pt, tr = qt, be = nr;
function nr(e) {
  var t = e.space, r = e.mustUseProperty || [], o = e.attributes || {}, c = e.properties, h = e.transform, k = {}, s = {}, b, w;
  for (b in c)
    w = new tr(
      b,
      h(o, b),
      c[b],
      t
    ), r.indexOf(b) !== -1 && (w.mustUseProperty = !0), k[b] = w, s[ft(b)] = b, s[ft(w.attribute)] = b;
  return new er(k, s, t);
}
var rr = be, or = rr({
  space: "xlink",
  transform: ar,
  properties: {
    xLinkActuate: null,
    xLinkArcRole: null,
    xLinkHref: null,
    xLinkRole: null,
    xLinkShow: null,
    xLinkTitle: null,
    xLinkType: null
  }
});
function ar(e, t) {
  return "xlink:" + t.slice(5).toLowerCase();
}
var ir = be, lr = ir({
  space: "xml",
  transform: cr,
  properties: {
    xmlLang: null,
    xmlBase: null,
    xmlSpace: null
  }
});
function cr(e, t) {
  return "xml:" + t.slice(3).toLowerCase();
}
var sr = ur;
function ur(e, t) {
  return t in e ? e[t] : t;
}
var pr = sr, Gt = hr;
function hr(e, t) {
  return pr(e, t.toLowerCase());
}
var fr = be, dr = Gt, gr = fr({
  space: "xmlns",
  attributes: {
    xmlnsxlink: "xmlns:xlink"
  },
  transform: dr,
  properties: {
    xmlns: null,
    xmlnsXLink: null
  }
}), Ke = ee, mr = be, Z = Ke.booleanish, K = Ke.number, ae = Ke.spaceSeparated, vr = mr({
  transform: br,
  properties: {
    ariaActiveDescendant: null,
    ariaAtomic: Z,
    ariaAutoComplete: null,
    ariaBusy: Z,
    ariaChecked: Z,
    ariaColCount: K,
    ariaColIndex: K,
    ariaColSpan: K,
    ariaControls: ae,
    ariaCurrent: null,
    ariaDescribedBy: ae,
    ariaDetails: null,
    ariaDisabled: Z,
    ariaDropEffect: ae,
    ariaErrorMessage: null,
    ariaExpanded: Z,
    ariaFlowTo: ae,
    ariaGrabbed: Z,
    ariaHasPopup: null,
    ariaHidden: Z,
    ariaInvalid: null,
    ariaKeyShortcuts: null,
    ariaLabel: null,
    ariaLabelledBy: ae,
    ariaLevel: K,
    ariaLive: null,
    ariaModal: Z,
    ariaMultiLine: Z,
    ariaMultiSelectable: Z,
    ariaOrientation: null,
    ariaOwns: ae,
    ariaPlaceholder: null,
    ariaPosInSet: K,
    ariaPressed: Z,
    ariaReadOnly: Z,
    ariaRelevant: null,
    ariaRequired: Z,
    ariaRoleDescription: ae,
    ariaRowCount: K,
    ariaRowIndex: K,
    ariaRowSpan: K,
    ariaSelected: Z,
    ariaSetSize: K,
    ariaSort: null,
    ariaValueMax: K,
    ariaValueMin: K,
    ariaValueNow: K,
    ariaValueText: null,
    role: null
  }
});
function br(e, t) {
  return t === "role" ? t : "aria-" + t.slice(4).toLowerCase();
}
var pe = ee, yr = be, kr = Gt, _ = pe.boolean, wr = pe.overloadedBoolean, fe = pe.booleanish, G = pe.number, Y = pe.spaceSeparated, we = pe.commaSeparated, xr = yr({
  space: "html",
  attributes: {
    acceptcharset: "accept-charset",
    classname: "class",
    htmlfor: "for",
    httpequiv: "http-equiv"
  },
  transform: kr,
  mustUseProperty: ["checked", "multiple", "muted", "selected"],
  properties: {
    // Standard Properties.
    abbr: null,
    accept: we,
    acceptCharset: Y,
    accessKey: Y,
    action: null,
    allow: null,
    allowFullScreen: _,
    allowPaymentRequest: _,
    allowUserMedia: _,
    alt: null,
    as: null,
    async: _,
    autoCapitalize: null,
    autoComplete: Y,
    autoFocus: _,
    autoPlay: _,
    capture: _,
    charSet: null,
    checked: _,
    cite: null,
    className: Y,
    cols: G,
    colSpan: null,
    content: null,
    contentEditable: fe,
    controls: _,
    controlsList: Y,
    coords: G | we,
    crossOrigin: null,
    data: null,
    dateTime: null,
    decoding: null,
    default: _,
    defer: _,
    dir: null,
    dirName: null,
    disabled: _,
    download: wr,
    draggable: fe,
    encType: null,
    enterKeyHint: null,
    form: null,
    formAction: null,
    formEncType: null,
    formMethod: null,
    formNoValidate: _,
    formTarget: null,
    headers: Y,
    height: G,
    hidden: _,
    high: G,
    href: null,
    hrefLang: null,
    htmlFor: Y,
    httpEquiv: Y,
    id: null,
    imageSizes: null,
    imageSrcSet: we,
    inputMode: null,
    integrity: null,
    is: null,
    isMap: _,
    itemId: null,
    itemProp: Y,
    itemRef: Y,
    itemScope: _,
    itemType: Y,
    kind: null,
    label: null,
    lang: null,
    language: null,
    list: null,
    loading: null,
    loop: _,
    low: G,
    manifest: null,
    max: null,
    maxLength: G,
    media: null,
    method: null,
    min: null,
    minLength: G,
    multiple: _,
    muted: _,
    name: null,
    nonce: null,
    noModule: _,
    noValidate: _,
    onAbort: null,
    onAfterPrint: null,
    onAuxClick: null,
    onBeforePrint: null,
    onBeforeUnload: null,
    onBlur: null,
    onCancel: null,
    onCanPlay: null,
    onCanPlayThrough: null,
    onChange: null,
    onClick: null,
    onClose: null,
    onContextMenu: null,
    onCopy: null,
    onCueChange: null,
    onCut: null,
    onDblClick: null,
    onDrag: null,
    onDragEnd: null,
    onDragEnter: null,
    onDragExit: null,
    onDragLeave: null,
    onDragOver: null,
    onDragStart: null,
    onDrop: null,
    onDurationChange: null,
    onEmptied: null,
    onEnded: null,
    onError: null,
    onFocus: null,
    onFormData: null,
    onHashChange: null,
    onInput: null,
    onInvalid: null,
    onKeyDown: null,
    onKeyPress: null,
    onKeyUp: null,
    onLanguageChange: null,
    onLoad: null,
    onLoadedData: null,
    onLoadedMetadata: null,
    onLoadEnd: null,
    onLoadStart: null,
    onMessage: null,
    onMessageError: null,
    onMouseDown: null,
    onMouseEnter: null,
    onMouseLeave: null,
    onMouseMove: null,
    onMouseOut: null,
    onMouseOver: null,
    onMouseUp: null,
    onOffline: null,
    onOnline: null,
    onPageHide: null,
    onPageShow: null,
    onPaste: null,
    onPause: null,
    onPlay: null,
    onPlaying: null,
    onPopState: null,
    onProgress: null,
    onRateChange: null,
    onRejectionHandled: null,
    onReset: null,
    onResize: null,
    onScroll: null,
    onSecurityPolicyViolation: null,
    onSeeked: null,
    onSeeking: null,
    onSelect: null,
    onSlotChange: null,
    onStalled: null,
    onStorage: null,
    onSubmit: null,
    onSuspend: null,
    onTimeUpdate: null,
    onToggle: null,
    onUnhandledRejection: null,
    onUnload: null,
    onVolumeChange: null,
    onWaiting: null,
    onWheel: null,
    open: _,
    optimum: G,
    pattern: null,
    ping: Y,
    placeholder: null,
    playsInline: _,
    poster: null,
    preload: null,
    readOnly: _,
    referrerPolicy: null,
    rel: Y,
    required: _,
    reversed: _,
    rows: G,
    rowSpan: G,
    sandbox: Y,
    scope: null,
    scoped: _,
    seamless: _,
    selected: _,
    shape: null,
    size: G,
    sizes: null,
    slot: null,
    span: G,
    spellCheck: fe,
    src: null,
    srcDoc: null,
    srcLang: null,
    srcSet: we,
    start: G,
    step: null,
    style: null,
    tabIndex: G,
    target: null,
    title: null,
    translate: null,
    type: null,
    typeMustMatch: _,
    useMap: null,
    value: fe,
    width: G,
    wrap: null,
    // Legacy.
    // See: https://html.spec.whatwg.org/#other-elements,-attributes-and-apis
    align: null,
    // Several. Use CSS `text-align` instead,
    aLink: null,
    // `<body>`. Use CSS `a:active {color}` instead
    archive: Y,
    // `<object>`. List of URIs to archives
    axis: null,
    // `<td>` and `<th>`. Use `scope` on `<th>`
    background: null,
    // `<body>`. Use CSS `background-image` instead
    bgColor: null,
    // `<body>` and table elements. Use CSS `background-color` instead
    border: G,
    // `<table>`. Use CSS `border-width` instead,
    borderColor: null,
    // `<table>`. Use CSS `border-color` instead,
    bottomMargin: G,
    // `<body>`
    cellPadding: null,
    // `<table>`
    cellSpacing: null,
    // `<table>`
    char: null,
    // Several table elements. When `align=char`, sets the character to align on
    charOff: null,
    // Several table elements. When `char`, offsets the alignment
    classId: null,
    // `<object>`
    clear: null,
    // `<br>`. Use CSS `clear` instead
    code: null,
    // `<object>`
    codeBase: null,
    // `<object>`
    codeType: null,
    // `<object>`
    color: null,
    // `<font>` and `<hr>`. Use CSS instead
    compact: _,
    // Lists. Use CSS to reduce space between items instead
    declare: _,
    // `<object>`
    event: null,
    // `<script>`
    face: null,
    // `<font>`. Use CSS instead
    frame: null,
    // `<table>`
    frameBorder: null,
    // `<iframe>`. Use CSS `border` instead
    hSpace: G,
    // `<img>` and `<object>`
    leftMargin: G,
    // `<body>`
    link: null,
    // `<body>`. Use CSS `a:link {color: *}` instead
    longDesc: null,
    // `<frame>`, `<iframe>`, and `<img>`. Use an `<a>`
    lowSrc: null,
    // `<img>`. Use a `<picture>`
    marginHeight: G,
    // `<body>`
    marginWidth: G,
    // `<body>`
    noResize: _,
    // `<frame>`
    noHref: _,
    // `<area>`. Use no href instead of an explicit `nohref`
    noShade: _,
    // `<hr>`. Use background-color and height instead of borders
    noWrap: _,
    // `<td>` and `<th>`
    object: null,
    // `<applet>`
    profile: null,
    // `<head>`
    prompt: null,
    // `<isindex>`
    rev: null,
    // `<link>`
    rightMargin: G,
    // `<body>`
    rules: null,
    // `<table>`
    scheme: null,
    // `<meta>`
    scrolling: fe,
    // `<frame>`. Use overflow in the child context
    standby: null,
    // `<object>`
    summary: null,
    // `<table>`
    text: null,
    // `<body>`. Use CSS `color` instead
    topMargin: G,
    // `<body>`
    valueType: null,
    // `<param>`
    version: null,
    // `<html>`. Use a doctype.
    vAlign: null,
    // Several. Use CSS `vertical-align` instead
    vLink: null,
    // `<body>`. Use CSS `a:visited {color}` instead
    vSpace: G,
    // `<img>` and `<object>`
    // Non-standard Properties.
    allowTransparency: null,
    autoCorrect: null,
    autoSave: null,
    disablePictureInPicture: _,
    disableRemotePlayback: _,
    prefix: null,
    property: null,
    results: G,
    security: null,
    unselectable: null
  }
}), Sr = Zn, jr = or, Lr = lr, Cr = gr, Ar = vr, Or = xr, Er = Sr([Lr, jr, Cr, Ar, Or]), $r = Ye, Fr = qt, _r = zt, Xe = "data", Nr = Ir, Tr = /^data[-\w.:]+$/i, Ht = /-[a-z]/g, Pr = /[A-Z]/g;
function Ir(e, t) {
  var r = $r(t), o = t, c = _r;
  return r in e.normal ? e.property[e.normal[r]] : (r.length > 4 && r.slice(0, 4) === Xe && Tr.test(t) && (t.charAt(4) === "-" ? o = zr(t) : t = Rr(t), c = Fr), new c(o, t));
}
function zr(e) {
  var t = e.slice(5).replace(Ht, qr);
  return Xe + t.charAt(0).toUpperCase() + t.slice(1);
}
function Rr(e) {
  var t = e.slice(4);
  return Ht.test(t) ? e : (t = t.replace(Pr, Mr), t.charAt(0) !== "-" && (t = "-" + t), Xe + t);
}
function Mr(e) {
  return "-" + e.toLowerCase();
}
function qr(e) {
  return e.charAt(1).toUpperCase();
}
var Dr = Gr, dt = /[#.]/g;
function Gr(e, t) {
  for (var r = e || "", o = t || "div", c = {}, h = 0, k, s, b; h < r.length; )
    dt.lastIndex = h, b = dt.exec(r), k = r.slice(h, b ? b.index : r.length), k && (s ? s === "#" ? c.id = k : c.className ? c.className.push(k) : c.className = [k] : o = k, h += k.length), b && (s = b[0], h++);
  return { type: "element", tagName: o, properties: c, children: [] };
}
var Je = {};
Je.parse = Br;
Je.stringify = Wr;
var gt = "", Hr = " ", Ur = /[ \t\n\r\f]+/g;
function Br(e) {
  var t = String(e || gt).trim();
  return t === gt ? [] : t.split(Ur);
}
function Wr(e) {
  return e.join(Hr).trim();
}
var Qe = {};
Qe.parse = Vr;
Qe.stringify = Yr;
var Ie = ",", mt = " ", de = "";
function Vr(e) {
  for (var t = [], r = String(e || de), o = r.indexOf(Ie), c = 0, h = !1, k; !h; )
    o === -1 && (o = r.length, h = !0), k = r.slice(c, o).trim(), (k || !h) && t.push(k), c = o + 1, o = r.indexOf(Ie, c);
  return t;
}
function Yr(e, t) {
  var r = t || {}, o = r.padLeft === !1 ? de : mt, c = r.padRight ? mt : de;
  return e[e.length - 1] === de && (e = e.concat(de)), e.join(c + Ie + o).trim();
}
var Zr = Nr, vt = Ye, Kr = Dr, bt = Je.parse, yt = Qe.parse, Xr = Qr, Jr = {}.hasOwnProperty;
function Qr(e, t, r) {
  var o = r ? oo(r) : null;
  return c;
  function c(k, s) {
    var b = Kr(k, t), w = Array.prototype.slice.call(arguments, 2), A = b.tagName.toLowerCase(), L;
    if (b.tagName = o && Jr.call(o, A) ? o[A] : A, s && eo(s, b) && (w.unshift(s), s = null), s)
      for (L in s)
        h(b.properties, L, s[L]);
    return Ut(b.children, w), b.tagName === "template" && (b.content = { type: "root", children: b.children }, b.children = []), b;
  }
  function h(k, s, b) {
    var w, A, L;
    b == null || b !== b || (w = Zr(e, s), A = w.property, L = b, typeof L == "string" && (w.spaceSeparated ? L = bt(L) : w.commaSeparated ? L = yt(L) : w.commaOrSpaceSeparated && (L = bt(yt(L).join(" ")))), A === "style" && typeof b != "string" && (L = ro(L)), A === "className" && k.className && (L = k.className.concat(L)), k[A] = no(w, A, L));
  }
}
function eo(e, t) {
  return typeof e == "string" || "length" in e || to(t.tagName, e);
}
function to(e, t) {
  var r = t.type;
  return e === "input" || !r || typeof r != "string" ? !1 : typeof t.children == "object" && "length" in t.children ? !0 : (r = r.toLowerCase(), e === "button" ? r !== "menu" && r !== "submit" && r !== "reset" && r !== "button" : "value" in t);
}
function Ut(e, t) {
  var r, o;
  if (typeof t == "string" || typeof t == "number") {
    e.push({ type: "text", value: String(t) });
    return;
  }
  if (typeof t == "object" && "length" in t) {
    for (r = -1, o = t.length; ++r < o; )
      Ut(e, t[r]);
    return;
  }
  if (typeof t != "object" || !("type" in t))
    throw new Error("Expected node, nodes, or string, got `" + t + "`");
  e.push(t);
}
function no(e, t, r) {
  var o, c, h;
  if (typeof r != "object" || !("length" in r))
    return kt(e, t, r);
  for (c = r.length, o = -1, h = []; ++o < c; )
    h[o] = kt(e, t, r[o]);
  return h;
}
function kt(e, t, r) {
  var o = r;
  return e.number || e.positiveNumber ? !isNaN(o) && o !== "" && (o = Number(o)) : (e.boolean || e.overloadedBoolean) && typeof o == "string" && (o === "" || vt(r) === vt(t)) && (o = !0), o;
}
function ro(e) {
  var t = [], r;
  for (r in e)
    t.push([r, e[r]].join(": "));
  return t.join("; ");
}
function oo(e) {
  for (var t = e.length, r = -1, o = {}, c; ++r < t; )
    c = e[r], o[c.toLowerCase()] = c;
  return o;
}
var ao = Er, io = Xr, Bt = io(ao, "div");
Bt.displayName = "html";
var lo = Bt, co = lo;
const so = "Æ", uo = "&", po = "Á", ho = "Â", fo = "À", go = "Å", mo = "Ã", vo = "Ä", bo = "©", yo = "Ç", ko = "Ð", wo = "É", xo = "Ê", So = "È", jo = "Ë", Lo = ">", Co = "Í", Ao = "Î", Oo = "Ì", Eo = "Ï", $o = "<", Fo = "Ñ", _o = "Ó", No = "Ô", To = "Ò", Po = "Ø", Io = "Õ", zo = "Ö", Ro = '"', Mo = "®", qo = "Þ", Do = "Ú", Go = "Û", Ho = "Ù", Uo = "Ü", Bo = "Ý", Wo = "á", Vo = "â", Yo = "´", Zo = "æ", Ko = "à", Xo = "&", Jo = "å", Qo = "ã", ea = "ä", ta = "¦", na = "ç", ra = "¸", oa = "¢", aa = "©", ia = "¤", la = "°", ca = "÷", sa = "é", ua = "ê", pa = "è", ha = "ð", fa = "ë", da = "½", ga = "¼", ma = "¾", va = ">", ba = "í", ya = "î", ka = "¡", wa = "ì", xa = "¿", Sa = "ï", ja = "«", La = "<", Ca = "¯", Aa = "µ", Oa = "·", Ea = " ", $a = "¬", Fa = "ñ", _a = "ó", Na = "ô", Ta = "ò", Pa = "ª", Ia = "º", za = "ø", Ra = "õ", Ma = "ö", qa = "¶", Da = "±", Ga = "£", Ha = '"', Ua = "»", Ba = "®", Wa = "§", Va = "­", Ya = "¹", Za = "²", Ka = "³", Xa = "ß", Ja = "þ", Qa = "×", ei = "ú", ti = "û", ni = "ù", ri = "¨", oi = "ü", ai = "ý", ii = "¥", li = "ÿ", ci = {
  AElig: so,
  AMP: uo,
  Aacute: po,
  Acirc: ho,
  Agrave: fo,
  Aring: go,
  Atilde: mo,
  Auml: vo,
  COPY: bo,
  Ccedil: yo,
  ETH: ko,
  Eacute: wo,
  Ecirc: xo,
  Egrave: So,
  Euml: jo,
  GT: Lo,
  Iacute: Co,
  Icirc: Ao,
  Igrave: Oo,
  Iuml: Eo,
  LT: $o,
  Ntilde: Fo,
  Oacute: _o,
  Ocirc: No,
  Ograve: To,
  Oslash: Po,
  Otilde: Io,
  Ouml: zo,
  QUOT: Ro,
  REG: Mo,
  THORN: qo,
  Uacute: Do,
  Ucirc: Go,
  Ugrave: Ho,
  Uuml: Uo,
  Yacute: Bo,
  aacute: Wo,
  acirc: Vo,
  acute: Yo,
  aelig: Zo,
  agrave: Ko,
  amp: Xo,
  aring: Jo,
  atilde: Qo,
  auml: ea,
  brvbar: ta,
  ccedil: na,
  cedil: ra,
  cent: oa,
  copy: aa,
  curren: ia,
  deg: la,
  divide: ca,
  eacute: sa,
  ecirc: ua,
  egrave: pa,
  eth: ha,
  euml: fa,
  frac12: da,
  frac14: ga,
  frac34: ma,
  gt: va,
  iacute: ba,
  icirc: ya,
  iexcl: ka,
  igrave: wa,
  iquest: xa,
  iuml: Sa,
  laquo: ja,
  lt: La,
  macr: Ca,
  micro: Aa,
  middot: Oa,
  nbsp: Ea,
  not: $a,
  ntilde: Fa,
  oacute: _a,
  ocirc: Na,
  ograve: Ta,
  ordf: Pa,
  ordm: Ia,
  oslash: za,
  otilde: Ra,
  ouml: Ma,
  para: qa,
  plusmn: Da,
  pound: Ga,
  quot: Ha,
  raquo: Ua,
  reg: Ba,
  sect: Wa,
  shy: Va,
  sup1: Ya,
  sup2: Za,
  sup3: Ka,
  szlig: Xa,
  thorn: Ja,
  times: Qa,
  uacute: ei,
  ucirc: ti,
  ugrave: ni,
  uml: ri,
  uuml: oi,
  yacute: ai,
  yen: ii,
  yuml: li
}, si = {
  0: "�",
  128: "€",
  130: "‚",
  131: "ƒ",
  132: "„",
  133: "…",
  134: "†",
  135: "‡",
  136: "ˆ",
  137: "‰",
  138: "Š",
  139: "‹",
  140: "Œ",
  142: "Ž",
  145: "‘",
  146: "’",
  147: "“",
  148: "”",
  149: "•",
  150: "–",
  151: "—",
  152: "˜",
  153: "™",
  154: "š",
  155: "›",
  156: "œ",
  158: "ž",
  159: "Ÿ"
};
var Wt = ui;
function ui(e) {
  var t = typeof e == "string" ? e.charCodeAt(0) : e;
  return t >= 48 && t <= 57;
}
var pi = hi;
function hi(e) {
  var t = typeof e == "string" ? e.charCodeAt(0) : e;
  return t >= 97 && t <= 102 || t >= 65 && t <= 70 || t >= 48 && t <= 57;
}
var fi = di;
function di(e) {
  var t = typeof e == "string" ? e.charCodeAt(0) : e;
  return t >= 97 && t <= 122 || t >= 65 && t <= 90;
}
var gi = fi, mi = Wt, vi = bi;
function bi(e) {
  return gi(e) || mi(e);
}
var xe, yi = 59, ki = wi;
function wi(e) {
  var t = "&" + e + ";", r;
  return xe = xe || document.createElement("i"), xe.innerHTML = t, r = xe.textContent, r.charCodeAt(r.length - 1) === yi && e !== "semi" || r === t ? !1 : r;
}
var wt = ci, xt = si, xi = Wt, Si = pi, Vt = vi, ji = ki, Li = Ri, Ci = {}.hasOwnProperty, ce = String.fromCharCode, Ai = Function.prototype, St = {
  warning: null,
  reference: null,
  text: null,
  warningContext: null,
  referenceContext: null,
  textContext: null,
  position: {},
  additional: null,
  attribute: !1,
  nonTerminated: !0
}, Oi = 9, jt = 10, Ei = 12, $i = 32, Lt = 38, Fi = 59, _i = 60, Ni = 61, Ti = 35, Pi = 88, Ii = 120, zi = 65533, se = "named", et = "hexadecimal", tt = "decimal", nt = {};
nt[et] = 16;
nt[tt] = 10;
var Ae = {};
Ae[se] = Vt;
Ae[tt] = xi;
Ae[et] = Si;
var Yt = 1, Zt = 2, Kt = 3, Xt = 4, Jt = 5, ze = 6, Qt = 7, re = {};
re[Yt] = "Named character references must be terminated by a semicolon";
re[Zt] = "Numeric character references must be terminated by a semicolon";
re[Kt] = "Named character references cannot be empty";
re[Xt] = "Numeric character references cannot be empty";
re[Jt] = "Named character references must be known";
re[ze] = "Numeric character references cannot be disallowed";
re[Qt] = "Numeric character references cannot be outside the permissible Unicode range";
function Ri(e, t) {
  var r = {}, o, c;
  t || (t = {});
  for (c in St)
    o = t[c], r[c] = o ?? St[c];
  return (r.position.indent || r.position.start) && (r.indent = r.position.indent || [], r.position = r.position.start), Mi(e, r);
}
function Mi(e, t) {
  var r = t.additional, o = t.nonTerminated, c = t.text, h = t.reference, k = t.warning, s = t.textContext, b = t.referenceContext, w = t.warningContext, A = t.position, L = t.indent || [], N = e.length, $ = 0, R = -1, I = A.column || 1, O = A.line || 1, z = "", g = [], u, y, v, m, S, C, x, T, P, H, U, B, W, l, a, i, f, d, p;
  for (typeof r == "string" && (r = r.charCodeAt(0)), i = j(), T = k ? F : Ai, $--, N++; ++$ < N; )
    if (S === jt && (I = L[R] || 1), S = e.charCodeAt($), S === Lt) {
      if (x = e.charCodeAt($ + 1), x === Oi || x === jt || x === Ei || x === $i || x === Lt || x === _i || x !== x || r && x === r) {
        z += ce(S), I++;
        continue;
      }
      for (W = $ + 1, B = W, p = W, x === Ti ? (p = ++B, x = e.charCodeAt(p), x === Pi || x === Ii ? (l = et, p = ++B) : l = tt) : l = se, u = "", U = "", m = "", a = Ae[l], p--; ++p < N && (x = e.charCodeAt(p), !!a(x)); )
        m += ce(x), l === se && Ci.call(wt, m) && (u = m, U = wt[m]);
      v = e.charCodeAt(p) === Fi, v && (p++, y = l === se ? ji(m) : !1, y && (u = m, U = y)), d = 1 + p - W, !v && !o || (m ? l === se ? (v && !U ? T(Jt, 1) : (u !== m && (p = B + u.length, d = 1 + p - B, v = !1), v || (P = u ? Yt : Kt, t.attribute ? (x = e.charCodeAt(p), x === Ni ? (T(P, d), U = null) : Vt(x) ? U = null : T(P, d)) : T(P, d))), C = U) : (v || T(Zt, d), C = parseInt(m, nt[l]), qi(C) ? (T(Qt, d), C = ce(zi)) : C in xt ? (T(ze, d), C = xt[C]) : (H = "", Di(C) && T(ze, d), C > 65535 && (C -= 65536, H += ce(C >>> 10 | 55296), C = 56320 | C & 1023), C = H + ce(C))) : l !== se && T(Xt, d)), C ? (E(), i = j(), $ = p - 1, I += p - W + 1, g.push(C), f = j(), f.offset++, h && h.call(
        b,
        C,
        { start: i, end: f },
        e.slice(W - 1, p)
      ), i = f) : (m = e.slice(W - 1, p), z += m, I += m.length, $ = p - 1);
    } else
      S === 10 && (O++, R++, I = 0), S === S ? (z += ce(S), I++) : E();
  return g.join("");
  function j() {
    return {
      line: O,
      column: I,
      offset: $ + (A.offset || 0)
    };
  }
  function F(q, M) {
    var D = j();
    D.column += M, D.offset += M, k.call(w, re[q], D, q);
  }
  function E() {
    z && (g.push(z), c && c.call(s, z, { start: i, end: j() }), z = "");
  }
}
function qi(e) {
  return e >= 55296 && e <= 57343 || e > 1114111;
}
function Di(e) {
  return e >= 1 && e <= 8 || e === 11 || e >= 13 && e <= 31 || e >= 127 && e <= 159 || e >= 64976 && e <= 65007 || (e & 65535) === 65535 || (e & 65535) === 65534;
}
var en = { exports: {} };
(function(e) {
  var t = typeof window < "u" ? window : typeof WorkerGlobalScope < "u" && self instanceof WorkerGlobalScope ? self : {};
  /**
   * Prism: Lightweight, robust, elegant syntax highlighting
   *
   * @license MIT <https://opensource.org/licenses/MIT>
   * @author Lea Verou <https://lea.verou.me>
   * @namespace
   * @public
   */
  var r = function(o) {
    var c = /(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i, h = 0, k = {}, s = {
      /**
       * By default, Prism will attempt to highlight all code elements (by calling {@link Prism.highlightAll}) on the
       * current page after the page finished loading. This might be a problem if e.g. you wanted to asynchronously load
       * additional languages or plugins yourself.
       *
       * By setting this value to `true`, Prism will not automatically highlight all code elements on the page.
       *
       * You obviously have to change this value before the automatic highlighting started. To do this, you can add an
       * empty Prism object into the global scope before loading the Prism script like this:
       *
       * ```js
       * window.Prism = window.Prism || {};
       * Prism.manual = true;
       * // add a new <script> to load Prism's script
       * ```
       *
       * @default false
       * @type {boolean}
       * @memberof Prism
       * @public
       */
      manual: o.Prism && o.Prism.manual,
      /**
       * By default, if Prism is in a web worker, it assumes that it is in a worker it created itself, so it uses
       * `addEventListener` to communicate with its parent instance. However, if you're using Prism manually in your
       * own worker, you don't want it to do this.
       *
       * By setting this value to `true`, Prism will not add its own listeners to the worker.
       *
       * You obviously have to change this value before Prism executes. To do this, you can add an
       * empty Prism object into the global scope before loading the Prism script like this:
       *
       * ```js
       * window.Prism = window.Prism || {};
       * Prism.disableWorkerMessageHandler = true;
       * // Load Prism's script
       * ```
       *
       * @default false
       * @type {boolean}
       * @memberof Prism
       * @public
       */
      disableWorkerMessageHandler: o.Prism && o.Prism.disableWorkerMessageHandler,
      /**
       * A namespace for utility methods.
       *
       * All function in this namespace that are not explicitly marked as _public_ are for __internal use only__ and may
       * change or disappear at any time.
       *
       * @namespace
       * @memberof Prism
       */
      util: {
        encode: function g(u) {
          return u instanceof b ? new b(u.type, g(u.content), u.alias) : Array.isArray(u) ? u.map(g) : u.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\u00a0/g, " ");
        },
        /**
         * Returns the name of the type of the given value.
         *
         * @param {any} o
         * @returns {string}
         * @example
         * type(null)      === 'Null'
         * type(undefined) === 'Undefined'
         * type(123)       === 'Number'
         * type('foo')     === 'String'
         * type(true)      === 'Boolean'
         * type([1, 2])    === 'Array'
         * type({})        === 'Object'
         * type(String)    === 'Function'
         * type(/abc+/)    === 'RegExp'
         */
        type: function(g) {
          return Object.prototype.toString.call(g).slice(8, -1);
        },
        /**
         * Returns a unique number for the given object. Later calls will still return the same number.
         *
         * @param {Object} obj
         * @returns {number}
         */
        objId: function(g) {
          return g.__id || Object.defineProperty(g, "__id", { value: ++h }), g.__id;
        },
        /**
         * Creates a deep clone of the given object.
         *
         * The main intended use of this function is to clone language definitions.
         *
         * @param {T} o
         * @param {Record<number, any>} [visited]
         * @returns {T}
         * @template T
         */
        clone: function g(u, y) {
          y = y || {};
          var v, m;
          switch (s.util.type(u)) {
            case "Object":
              if (m = s.util.objId(u), y[m])
                return y[m];
              v = /** @type {Record<string, any>} */
              {}, y[m] = v;
              for (var S in u)
                u.hasOwnProperty(S) && (v[S] = g(u[S], y));
              return (
                /** @type {any} */
                v
              );
            case "Array":
              return m = s.util.objId(u), y[m] ? y[m] : (v = [], y[m] = v, /** @type {Array} */
              /** @type {any} */
              u.forEach(function(C, x) {
                v[x] = g(C, y);
              }), /** @type {any} */
              v);
            default:
              return u;
          }
        },
        /**
         * Returns the Prism language of the given element set by a `language-xxxx` or `lang-xxxx` class.
         *
         * If no language is set for the element or the element is `null` or `undefined`, `none` will be returned.
         *
         * @param {Element} element
         * @returns {string}
         */
        getLanguage: function(g) {
          for (; g; ) {
            var u = c.exec(g.className);
            if (u)
              return u[1].toLowerCase();
            g = g.parentElement;
          }
          return "none";
        },
        /**
         * Sets the Prism `language-xxxx` class of the given element.
         *
         * @param {Element} element
         * @param {string} language
         * @returns {void}
         */
        setLanguage: function(g, u) {
          g.className = g.className.replace(RegExp(c, "gi"), ""), g.classList.add("language-" + u);
        },
        /**
         * Returns the script element that is currently executing.
         *
         * This does __not__ work for line script element.
         *
         * @returns {HTMLScriptElement | null}
         */
        currentScript: function() {
          if (typeof document > "u")
            return null;
          if ("currentScript" in document)
            return (
              /** @type {any} */
              document.currentScript
            );
          try {
            throw new Error();
          } catch (v) {
            var g = (/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(v.stack) || [])[1];
            if (g) {
              var u = document.getElementsByTagName("script");
              for (var y in u)
                if (u[y].src == g)
                  return u[y];
            }
            return null;
          }
        },
        /**
         * Returns whether a given class is active for `element`.
         *
         * The class can be activated if `element` or one of its ancestors has the given class and it can be deactivated
         * if `element` or one of its ancestors has the negated version of the given class. The _negated version_ of the
         * given class is just the given class with a `no-` prefix.
         *
         * Whether the class is active is determined by the closest ancestor of `element` (where `element` itself is
         * closest ancestor) that has the given class or the negated version of it. If neither `element` nor any of its
         * ancestors have the given class or the negated version of it, then the default activation will be returned.
         *
         * In the paradoxical situation where the closest ancestor contains __both__ the given class and the negated
         * version of it, the class is considered active.
         *
         * @param {Element} element
         * @param {string} className
         * @param {boolean} [defaultActivation=false]
         * @returns {boolean}
         */
        isActive: function(g, u, y) {
          for (var v = "no-" + u; g; ) {
            var m = g.classList;
            if (m.contains(u))
              return !0;
            if (m.contains(v))
              return !1;
            g = g.parentElement;
          }
          return !!y;
        }
      },
      /**
       * This namespace contains all currently loaded languages and the some helper functions to create and modify languages.
       *
       * @namespace
       * @memberof Prism
       * @public
       */
      languages: {
        /**
         * The grammar for plain, unformatted text.
         */
        plain: k,
        plaintext: k,
        text: k,
        txt: k,
        /**
         * Creates a deep copy of the language with the given id and appends the given tokens.
         *
         * If a token in `redef` also appears in the copied language, then the existing token in the copied language
         * will be overwritten at its original position.
         *
         * ## Best practices
         *
         * Since the position of overwriting tokens (token in `redef` that overwrite tokens in the copied language)
         * doesn't matter, they can technically be in any order. However, this can be confusing to others that trying to
         * understand the language definition because, normally, the order of tokens matters in Prism grammars.
         *
         * Therefore, it is encouraged to order overwriting tokens according to the positions of the overwritten tokens.
         * Furthermore, all non-overwriting tokens should be placed after the overwriting ones.
         *
         * @param {string} id The id of the language to extend. This has to be a key in `Prism.languages`.
         * @param {Grammar} redef The new tokens to append.
         * @returns {Grammar} The new language created.
         * @public
         * @example
         * Prism.languages['css-with-colors'] = Prism.languages.extend('css', {
         *     // Prism.languages.css already has a 'comment' token, so this token will overwrite CSS' 'comment' token
         *     // at its original position
         *     'comment': { ... },
         *     // CSS doesn't have a 'color' token, so this token will be appended
         *     'color': /\b(?:red|green|blue)\b/
         * });
         */
        extend: function(g, u) {
          var y = s.util.clone(s.languages[g]);
          for (var v in u)
            y[v] = u[v];
          return y;
        },
        /**
         * Inserts tokens _before_ another token in a language definition or any other grammar.
         *
         * ## Usage
         *
         * This helper method makes it easy to modify existing languages. For example, the CSS language definition
         * not only defines CSS highlighting for CSS documents, but also needs to define highlighting for CSS embedded
         * in HTML through `<style>` elements. To do this, it needs to modify `Prism.languages.markup` and add the
         * appropriate tokens. However, `Prism.languages.markup` is a regular JavaScript object literal, so if you do
         * this:
         *
         * ```js
         * Prism.languages.markup.style = {
         *     // token
         * };
         * ```
         *
         * then the `style` token will be added (and processed) at the end. `insertBefore` allows you to insert tokens
         * before existing tokens. For the CSS example above, you would use it like this:
         *
         * ```js
         * Prism.languages.insertBefore('markup', 'cdata', {
         *     'style': {
         *         // token
         *     }
         * });
         * ```
         *
         * ## Special cases
         *
         * If the grammars of `inside` and `insert` have tokens with the same name, the tokens in `inside`'s grammar
         * will be ignored.
         *
         * This behavior can be used to insert tokens after `before`:
         *
         * ```js
         * Prism.languages.insertBefore('markup', 'comment', {
         *     'comment': Prism.languages.markup.comment,
         *     // tokens after 'comment'
         * });
         * ```
         *
         * ## Limitations
         *
         * The main problem `insertBefore` has to solve is iteration order. Since ES2015, the iteration order for object
         * properties is guaranteed to be the insertion order (except for integer keys) but some browsers behave
         * differently when keys are deleted and re-inserted. So `insertBefore` can't be implemented by temporarily
         * deleting properties which is necessary to insert at arbitrary positions.
         *
         * To solve this problem, `insertBefore` doesn't actually insert the given tokens into the target object.
         * Instead, it will create a new object and replace all references to the target object with the new one. This
         * can be done without temporarily deleting properties, so the iteration order is well-defined.
         *
         * However, only references that can be reached from `Prism.languages` or `insert` will be replaced. I.e. if
         * you hold the target object in a variable, then the value of the variable will not change.
         *
         * ```js
         * var oldMarkup = Prism.languages.markup;
         * var newMarkup = Prism.languages.insertBefore('markup', 'comment', { ... });
         *
         * assert(oldMarkup !== Prism.languages.markup);
         * assert(newMarkup === Prism.languages.markup);
         * ```
         *
         * @param {string} inside The property of `root` (e.g. a language id in `Prism.languages`) that contains the
         * object to be modified.
         * @param {string} before The key to insert before.
         * @param {Grammar} insert An object containing the key-value pairs to be inserted.
         * @param {Object<string, any>} [root] The object containing `inside`, i.e. the object that contains the
         * object to be modified.
         *
         * Defaults to `Prism.languages`.
         * @returns {Grammar} The new grammar object.
         * @public
         */
        insertBefore: function(g, u, y, v) {
          v = v || /** @type {any} */
          s.languages;
          var m = v[g], S = {};
          for (var C in m)
            if (m.hasOwnProperty(C)) {
              if (C == u)
                for (var x in y)
                  y.hasOwnProperty(x) && (S[x] = y[x]);
              y.hasOwnProperty(C) || (S[C] = m[C]);
            }
          var T = v[g];
          return v[g] = S, s.languages.DFS(s.languages, function(P, H) {
            H === T && P != g && (this[P] = S);
          }), S;
        },
        // Traverse a language definition with Depth First Search
        DFS: function g(u, y, v, m) {
          m = m || {};
          var S = s.util.objId;
          for (var C in u)
            if (u.hasOwnProperty(C)) {
              y.call(u, C, u[C], v || C);
              var x = u[C], T = s.util.type(x);
              T === "Object" && !m[S(x)] ? (m[S(x)] = !0, g(x, y, null, m)) : T === "Array" && !m[S(x)] && (m[S(x)] = !0, g(x, y, C, m));
            }
        }
      },
      plugins: {},
      /**
       * This is the most high-level function in Prism’s API.
       * It fetches all the elements that have a `.language-xxxx` class and then calls {@link Prism.highlightElement} on
       * each one of them.
       *
       * This is equivalent to `Prism.highlightAllUnder(document, async, callback)`.
       *
       * @param {boolean} [async=false] Same as in {@link Prism.highlightAllUnder}.
       * @param {HighlightCallback} [callback] Same as in {@link Prism.highlightAllUnder}.
       * @memberof Prism
       * @public
       */
      highlightAll: function(g, u) {
        s.highlightAllUnder(document, g, u);
      },
      /**
       * Fetches all the descendants of `container` that have a `.language-xxxx` class and then calls
       * {@link Prism.highlightElement} on each one of them.
       *
       * The following hooks will be run:
       * 1. `before-highlightall`
       * 2. `before-all-elements-highlight`
       * 3. All hooks of {@link Prism.highlightElement} for each element.
       *
       * @param {ParentNode} container The root element, whose descendants that have a `.language-xxxx` class will be highlighted.
       * @param {boolean} [async=false] Whether each element is to be highlighted asynchronously using Web Workers.
       * @param {HighlightCallback} [callback] An optional callback to be invoked on each element after its highlighting is done.
       * @memberof Prism
       * @public
       */
      highlightAllUnder: function(g, u, y) {
        var v = {
          callback: y,
          container: g,
          selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
        };
        s.hooks.run("before-highlightall", v), v.elements = Array.prototype.slice.apply(v.container.querySelectorAll(v.selector)), s.hooks.run("before-all-elements-highlight", v);
        for (var m = 0, S; S = v.elements[m++]; )
          s.highlightElement(S, u === !0, v.callback);
      },
      /**
       * Highlights the code inside a single element.
       *
       * The following hooks will be run:
       * 1. `before-sanity-check`
       * 2. `before-highlight`
       * 3. All hooks of {@link Prism.highlight}. These hooks will be run by an asynchronous worker if `async` is `true`.
       * 4. `before-insert`
       * 5. `after-highlight`
       * 6. `complete`
       *
       * Some the above hooks will be skipped if the element doesn't contain any text or there is no grammar loaded for
       * the element's language.
       *
       * @param {Element} element The element containing the code.
       * It must have a class of `language-xxxx` to be processed, where `xxxx` is a valid language identifier.
       * @param {boolean} [async=false] Whether the element is to be highlighted asynchronously using Web Workers
       * to improve performance and avoid blocking the UI when highlighting very large chunks of code. This option is
       * [disabled by default](https://prismjs.com/faq.html#why-is-asynchronous-highlighting-disabled-by-default).
       *
       * Note: All language definitions required to highlight the code must be included in the main `prism.js` file for
       * asynchronous highlighting to work. You can build your own bundle on the
       * [Download page](https://prismjs.com/download.html).
       * @param {HighlightCallback} [callback] An optional callback to be invoked after the highlighting is done.
       * Mostly useful when `async` is `true`, since in that case, the highlighting is done asynchronously.
       * @memberof Prism
       * @public
       */
      highlightElement: function(g, u, y) {
        var v = s.util.getLanguage(g), m = s.languages[v];
        s.util.setLanguage(g, v);
        var S = g.parentElement;
        S && S.nodeName.toLowerCase() === "pre" && s.util.setLanguage(S, v);
        var C = g.textContent, x = {
          element: g,
          language: v,
          grammar: m,
          code: C
        };
        function T(H) {
          x.highlightedCode = H, s.hooks.run("before-insert", x), x.element.innerHTML = x.highlightedCode, s.hooks.run("after-highlight", x), s.hooks.run("complete", x), y && y.call(x.element);
        }
        if (s.hooks.run("before-sanity-check", x), S = x.element.parentElement, S && S.nodeName.toLowerCase() === "pre" && !S.hasAttribute("tabindex") && S.setAttribute("tabindex", "0"), !x.code) {
          s.hooks.run("complete", x), y && y.call(x.element);
          return;
        }
        if (s.hooks.run("before-highlight", x), !x.grammar) {
          T(s.util.encode(x.code));
          return;
        }
        if (u && o.Worker) {
          var P = new Worker(s.filename);
          P.onmessage = function(H) {
            T(H.data);
          }, P.postMessage(JSON.stringify({
            language: x.language,
            code: x.code,
            immediateClose: !0
          }));
        } else
          T(s.highlight(x.code, x.grammar, x.language));
      },
      /**
       * Low-level function, only use if you know what you’re doing. It accepts a string of text as input
       * and the language definitions to use, and returns a string with the HTML produced.
       *
       * The following hooks will be run:
       * 1. `before-tokenize`
       * 2. `after-tokenize`
       * 3. `wrap`: On each {@link Token}.
       *
       * @param {string} text A string with the code to be highlighted.
       * @param {Grammar} grammar An object containing the tokens to use.
       *
       * Usually a language definition like `Prism.languages.markup`.
       * @param {string} language The name of the language definition passed to `grammar`.
       * @returns {string} The highlighted HTML.
       * @memberof Prism
       * @public
       * @example
       * Prism.highlight('var foo = true;', Prism.languages.javascript, 'javascript');
       */
      highlight: function(g, u, y) {
        var v = {
          code: g,
          grammar: u,
          language: y
        };
        if (s.hooks.run("before-tokenize", v), !v.grammar)
          throw new Error('The language "' + v.language + '" has no grammar.');
        return v.tokens = s.tokenize(v.code, v.grammar), s.hooks.run("after-tokenize", v), b.stringify(s.util.encode(v.tokens), v.language);
      },
      /**
       * This is the heart of Prism, and the most low-level function you can use. It accepts a string of text as input
       * and the language definitions to use, and returns an array with the tokenized code.
       *
       * When the language definition includes nested tokens, the function is called recursively on each of these tokens.
       *
       * This method could be useful in other contexts as well, as a very crude parser.
       *
       * @param {string} text A string with the code to be highlighted.
       * @param {Grammar} grammar An object containing the tokens to use.
       *
       * Usually a language definition like `Prism.languages.markup`.
       * @returns {TokenStream} An array of strings and tokens, a token stream.
       * @memberof Prism
       * @public
       * @example
       * let code = `var foo = 0;`;
       * let tokens = Prism.tokenize(code, Prism.languages.javascript);
       * tokens.forEach(token => {
       *     if (token instanceof Prism.Token && token.type === 'number') {
       *         console.log(`Found numeric literal: ${token.content}`);
       *     }
       * });
       */
      tokenize: function(g, u) {
        var y = u.rest;
        if (y) {
          for (var v in y)
            u[v] = y[v];
          delete u.rest;
        }
        var m = new L();
        return N(m, m.head, g), A(g, m, u, m.head, 0), R(m);
      },
      /**
       * @namespace
       * @memberof Prism
       * @public
       */
      hooks: {
        all: {},
        /**
         * Adds the given callback to the list of callbacks for the given hook.
         *
         * The callback will be invoked when the hook it is registered for is run.
         * Hooks are usually directly run by a highlight function but you can also run hooks yourself.
         *
         * One callback function can be registered to multiple hooks and the same hook multiple times.
         *
         * @param {string} name The name of the hook.
         * @param {HookCallback} callback The callback function which is given environment variables.
         * @public
         */
        add: function(g, u) {
          var y = s.hooks.all;
          y[g] = y[g] || [], y[g].push(u);
        },
        /**
         * Runs a hook invoking all registered callbacks with the given environment variables.
         *
         * Callbacks will be invoked synchronously and in the order in which they were registered.
         *
         * @param {string} name The name of the hook.
         * @param {Object<string, any>} env The environment variables of the hook passed to all callbacks registered.
         * @public
         */
        run: function(g, u) {
          var y = s.hooks.all[g];
          if (!(!y || !y.length))
            for (var v = 0, m; m = y[v++]; )
              m(u);
        }
      },
      Token: b
    };
    o.Prism = s;
    function b(g, u, y, v) {
      this.type = g, this.content = u, this.alias = y, this.length = (v || "").length | 0;
    }
    b.stringify = function g(u, y) {
      if (typeof u == "string")
        return u;
      if (Array.isArray(u)) {
        var v = "";
        return u.forEach(function(T) {
          v += g(T, y);
        }), v;
      }
      var m = {
        type: u.type,
        content: g(u.content, y),
        tag: "span",
        classes: ["token", u.type],
        attributes: {},
        language: y
      }, S = u.alias;
      S && (Array.isArray(S) ? Array.prototype.push.apply(m.classes, S) : m.classes.push(S)), s.hooks.run("wrap", m);
      var C = "";
      for (var x in m.attributes)
        C += " " + x + '="' + (m.attributes[x] || "").replace(/"/g, "&quot;") + '"';
      return "<" + m.tag + ' class="' + m.classes.join(" ") + '"' + C + ">" + m.content + "</" + m.tag + ">";
    };
    function w(g, u, y, v) {
      g.lastIndex = u;
      var m = g.exec(y);
      if (m && v && m[1]) {
        var S = m[1].length;
        m.index += S, m[0] = m[0].slice(S);
      }
      return m;
    }
    function A(g, u, y, v, m, S) {
      for (var C in y)
        if (!(!y.hasOwnProperty(C) || !y[C])) {
          var x = y[C];
          x = Array.isArray(x) ? x : [x];
          for (var T = 0; T < x.length; ++T) {
            if (S && S.cause == C + "," + T)
              return;
            var P = x[T], H = P.inside, U = !!P.lookbehind, B = !!P.greedy, W = P.alias;
            if (B && !P.pattern.global) {
              var l = P.pattern.toString().match(/[imsuy]*$/)[0];
              P.pattern = RegExp(P.pattern.source, l + "g");
            }
            for (var a = P.pattern || P, i = v.next, f = m; i !== u.tail && !(S && f >= S.reach); f += i.value.length, i = i.next) {
              var d = i.value;
              if (u.length > g.length)
                return;
              if (!(d instanceof b)) {
                var p = 1, j;
                if (B) {
                  if (j = w(a, f, g, U), !j || j.index >= g.length)
                    break;
                  var M = j.index, F = j.index + j[0].length, E = f;
                  for (E += i.value.length; M >= E; )
                    i = i.next, E += i.value.length;
                  if (E -= i.value.length, f = E, i.value instanceof b)
                    continue;
                  for (var q = i; q !== u.tail && (E < F || typeof q.value == "string"); q = q.next)
                    p++, E += q.value.length;
                  p--, d = g.slice(f, E), j.index -= f;
                } else if (j = w(a, 0, d, U), !j)
                  continue;
                var M = j.index, D = j[0], oe = d.slice(0, M), ke = d.slice(M + D.length), he = f + d.length;
                S && he > S.reach && (S.reach = he);
                var le = i.prev;
                oe && (le = N(u, le, oe), f += oe.length), $(u, le, p);
                var on = new b(C, H ? s.tokenize(D, H) : D, W, D);
                if (i = N(u, le, on), ke && N(u, i, ke), p > 1) {
                  var Oe = {
                    cause: C + "," + T,
                    reach: he
                  };
                  A(g, u, y, i.prev, f, Oe), S && Oe.reach > S.reach && (S.reach = Oe.reach);
                }
              }
            }
          }
        }
    }
    function L() {
      var g = { value: null, prev: null, next: null }, u = { value: null, prev: g, next: null };
      g.next = u, this.head = g, this.tail = u, this.length = 0;
    }
    function N(g, u, y) {
      var v = u.next, m = { value: y, prev: u, next: v };
      return u.next = m, v.prev = m, g.length++, m;
    }
    function $(g, u, y) {
      for (var v = u.next, m = 0; m < y && v !== g.tail; m++)
        v = v.next;
      u.next = v, v.prev = u, g.length -= m;
    }
    function R(g) {
      for (var u = [], y = g.head.next; y !== g.tail; )
        u.push(y.value), y = y.next;
      return u;
    }
    if (!o.document)
      return o.addEventListener && (s.disableWorkerMessageHandler || o.addEventListener("message", function(g) {
        var u = JSON.parse(g.data), y = u.language, v = u.code, m = u.immediateClose;
        o.postMessage(s.highlight(v, s.languages[y], y)), m && o.close();
      }, !1)), s;
    var I = s.util.currentScript();
    I && (s.filename = I.src, I.hasAttribute("data-manual") && (s.manual = !0));
    function O() {
      s.manual || s.highlightAll();
    }
    if (!s.manual) {
      var z = document.readyState;
      z === "loading" || z === "interactive" && I && I.defer ? document.addEventListener("DOMContentLoaded", O) : window.requestAnimationFrame ? window.requestAnimationFrame(O) : window.setTimeout(O, 16);
    }
    return s;
  }(t);
  e.exports && (e.exports = r), typeof je < "u" && (je.Prism = r);
})(en);
var Gi = en.exports, ge = typeof globalThis == "object" ? globalThis : typeof self == "object" ? self : typeof window == "object" ? window : typeof je == "object" ? je : {}, Hi = ol();
ge.Prism = { manual: !0, disableWorkerMessageHandler: !0 };
var Ui = co, Bi = Li, tn = Gi, Wi = Be, Vi = De, Yi = Me, Zi = He;
Hi();
var rt = {}.hasOwnProperty;
function nn() {
}
nn.prototype = tn;
var V = new nn(), rn = V;
V.highlight = Xi;
V.register = ye;
V.alias = Ki;
V.registered = Ji;
V.listLanguages = Qi;
ye(Wi);
ye(Vi);
ye(Yi);
ye(Zi);
V.util.encode = nl;
V.Token.stringify = el;
function ye(e) {
  if (typeof e != "function" || !e.displayName)
    throw new Error("Expected `function` for `grammar`, got `" + e + "`");
  V.languages[e.displayName] === void 0 && e(V);
}
function Ki(e, t) {
  var r = V.languages, o = e, c, h, k, s;
  t && (o = {}, o[e] = t);
  for (c in o)
    for (h = o[c], h = typeof h == "string" ? [h] : h, k = h.length, s = -1; ++s < k; )
      r[h[s]] = r[c];
}
function Xi(e, t) {
  var r = tn.highlight, o;
  if (typeof e != "string")
    throw new Error("Expected `string` for `value`, got `" + e + "`");
  if (V.util.type(t) === "Object")
    o = t, t = null;
  else {
    if (typeof t != "string")
      throw new Error("Expected `string` for `name`, got `" + t + "`");
    if (rt.call(V.languages, t))
      o = V.languages[t];
    else
      throw new Error("Unknown language: `" + t + "` is not registered");
  }
  return r.call(this, e, o, t);
}
function Ji(e) {
  if (typeof e != "string")
    throw new Error("Expected `string` for `language`, got `" + e + "`");
  return rt.call(V.languages, e);
}
function Qi() {
  var e = V.languages, t = [], r;
  for (r in e)
    rt.call(e, r) && typeof e[r] == "object" && t.push(r);
  return t;
}
function el(e, t, r) {
  var o;
  return typeof e == "string" ? { type: "text", value: e } : V.util.type(e) === "Array" ? tl(e, t) : (o = {
    type: e.type,
    content: V.Token.stringify(e.content, t, r),
    tag: "span",
    classes: ["token", e.type],
    attributes: {},
    language: t,
    parent: r
  }, e.alias && (o.classes = o.classes.concat(e.alias)), V.hooks.run("wrap", o), Ui(
    o.tag + "." + o.classes.join("."),
    rl(o.attributes),
    o.content
  ));
}
function tl(e, t) {
  for (var r = [], o = e.length, c = -1, h; ++c < o; )
    h = e[c], h !== "" && h !== null && h !== void 0 && r.push(h);
  for (c = -1, o = r.length; ++c < o; )
    h = r[c], r[c] = V.Token.stringify(h, t, r);
  return r;
}
function nl(e) {
  return e;
}
function rl(e) {
  var t;
  for (t in e)
    e[t] = Bi(e[t]);
  return e;
}
function ol() {
  var e = "Prism" in ge, t = e ? ge.Prism : void 0;
  return r;
  function r() {
    e ? ge.Prism = t : delete ge.Prism, e = void 0, t = void 0;
  }
}
const al = /* @__PURE__ */ me(rn), il = /* @__PURE__ */ ve({
  __proto__: null,
  default: al
}, [rn]);
export {
  fl as a,
  sl as b,
  cl as c,
  pl as d,
  ul as o,
  hl as p
};
