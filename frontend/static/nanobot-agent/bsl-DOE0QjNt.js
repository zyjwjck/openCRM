import { g as o } from "./react-vendor-ASUsaCHq.js";
function i(e, f) {
  for (var r = 0; r < f.length; r++) {
    const u = f[r];
    if (typeof u != "string" && !Array.isArray(u)) {
      for (const t in u)
        if (t !== "default" && !(t in e)) {
          const n = Object.getOwnPropertyDescriptor(u, t);
          n && Object.defineProperty(e, t, n.get ? n : {
            enumerable: !0,
            get: () => u[t]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }));
}
var d = a;
a.displayName = "bsl";
a.aliases = [];
function a(e) {
  e.languages.bsl = {
    comment: /\/\/.*/,
    string: [
      // Строки
      // Strings
      {
        pattern: /"(?:[^"]|"")*"(?!")/,
        greedy: !0
      },
      // Дата и время
      // Date & time
      {
        pattern: /'(?:[^'\r\n\\]|\\.)*'/
      }
    ],
    keyword: [
      {
        // RU
        pattern: /(^|[^\w\u0400-\u0484\u0487-\u052f\u1d2b\u1d78\u2de0-\u2dff\ua640-\ua69f\ufe2e\ufe2f])(?:пока|для|новый|прервать|попытка|исключение|вызватьисключение|иначе|конецпопытки|неопределено|функция|перем|возврат|конецфункции|если|иначеесли|процедура|конецпроцедуры|тогда|знач|экспорт|конецесли|из|каждого|истина|ложь|по|цикл|конеццикла|выполнить)(?![\w\u0400-\u0484\u0487-\u052f\u1d2b\u1d78\u2de0-\u2dff\ua640-\ua69f\ufe2e\ufe2f])/i,
        lookbehind: !0
      },
      {
        // EN
        pattern: /\b(?:break|do|each|else|elseif|enddo|endfunction|endif|endprocedure|endtry|except|execute|export|false|for|function|if|in|new|null|procedure|raise|return|then|to|true|try|undefined|val|var|while)\b/i
      }
    ],
    number: {
      pattern: /(^(?=\d)|[^\w\u0400-\u0484\u0487-\u052f\u1d2b\u1d78\u2de0-\u2dff\ua640-\ua69f\ufe2e\ufe2f])(?:\d+(?:\.\d*)?|\.\d+)(?:E[+-]?\d+)?/i,
      lookbehind: !0
    },
    operator: [
      /[<>+\-*/]=?|[%=]/,
      // RU
      {
        pattern: /(^|[^\w\u0400-\u0484\u0487-\u052f\u1d2b\u1d78\u2de0-\u2dff\ua640-\ua69f\ufe2e\ufe2f])(?:и|или|не)(?![\w\u0400-\u0484\u0487-\u052f\u1d2b\u1d78\u2de0-\u2dff\ua640-\ua69f\ufe2e\ufe2f])/i,
        lookbehind: !0
      },
      // EN
      {
        pattern: /\b(?:and|not|or)\b/i
      }
    ],
    punctuation: /\(\.|\.\)|[()\[\]:;,.]/,
    directive: [
      // Теги препроцессора вида &Клиент, &Сервер, ...
      // Preprocessor tags of the type &Client, &Server, ...
      {
        pattern: /^([ \t]*)&.*/m,
        lookbehind: !0,
        greedy: !0,
        alias: "important"
      },
      // Инструкции препроцессора вида:
      // #Если Сервер Тогда
      // ...
      // #КонецЕсли
      // Preprocessor instructions of the form:
      // #If Server Then
      // ...
      // #EndIf
      {
        pattern: /^([ \t]*)#.*/gm,
        lookbehind: !0,
        greedy: !0,
        alias: "important"
      }
    ]
  }, e.languages.oscript = e.languages.bsl;
}
const l = /* @__PURE__ */ o(d), b = /* @__PURE__ */ i({
  __proto__: null,
  default: l
}, [d]);
export {
  b
};
