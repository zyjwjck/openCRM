const e = "Usa nanobot desde mensajes de Signal.", a = "Daemon HTTP signal-cli, número de teléfono y lista permitida", l = {
  docsLabel: "Abrir guía de Signal",
  officialLabel: "Abrir guía de signal-cli",
  tryIt: "Envía un DM de Signal al número vinculado.",
  summary: "Signal se conecta mediante un daemon HTTP signal-cli ya vinculado a un número de Signal.",
  steps: [
    "Instala signal-cli-rest-api y vincula o registra un número de Signal.",
    "Introduce el host, puerto y número vinculado.",
    "Guarda y activa Signal; después envía un mensaje directo de prueba."
  ],
  fields: {
    phoneNumber: {
      label: "Número de teléfono",
      placeholder: "+1234567890",
      help: "Usa el número de Signal registrado con signal-cli."
    },
    daemonHost: {
      label: "Host del daemon",
      placeholder: "localhost"
    },
    daemonPort: {
      label: "Puerto del daemon",
      placeholder: "8080"
    },
    dm_allowFrom: {
      label: "DM permitidos",
      placeholder: "Números o UUID"
    },
    group_allowFrom: {
      label: "Grupos permitidos",
      placeholder: "ID de grupo"
    }
  }
}, o = {
  description: e,
  requirements: a,
  setup: l
};
export {
  o as default,
  e as description,
  a as requirements,
  l as setup
};
