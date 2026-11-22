const e = "Usa nanobot desde chats de trabajo de WeCom.", o = "Credenciales de la app WeCom y ajustes de callback", a = {
  docsLabel: "Abrir guía de WeCom",
  officialLabel: "Abrir consola de WeCom",
  tryIt: "Envía un mensaje de prueba al bot de WeCom.",
  summary: "WeCom necesita el ID y el secreto de un bot de IA desde la consola de administración.",
  steps: [
    "Crea un bot de IA en WeCom y elige el modo API.",
    "Copia el Bot ID y el Secret en nanobot.",
    "Guarda y activa WeCom; después envía un mensaje de prueba."
  ],
  fields: {
    botId: {
      label: "Bot ID",
      placeholder: "Bot ID de WeCom",
      help: "Cópialo de la página del modo API del bot de IA de WeCom."
    },
    secret: {
      label: "Secret",
      placeholder: "••••••",
      help: "Mantén privado el secreto del bot de WeCom."
    },
    allowFrom: {
      label: "Usuarios permitidos",
      placeholder: "ID de usuario separados por comas"
    }
  }
}, d = {
  description: e,
  requirements: o,
  setup: a
};
export {
  d as default,
  e as description,
  o as requirements,
  a as setup
};
