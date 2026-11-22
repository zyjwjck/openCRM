const e = "Connectez nanobot via une passerelle NapCat.", t = "Endpoint WebSocket NapCat et jeton d’accès facultatif", a = {
  docsLabel: "Ouvrir le guide NapCat",
  officialLabel: "Ouvrir la documentation NapCat",
  tryIt: "Envoyez un message test QQ via NapCat.",
  summary: "NapCat relie nanobot à QQ via un endpoint WebSocket OneBot local ou distant.",
  steps: [
    "Démarrez NapCat et activez un service Forward WebSocket.",
    "Copiez l’URL WebSocket et le jeton facultatif dans nanobot.",
    "Enregistrez et activez NapCat, puis envoyez un message test QQ."
  ],
  fields: {
    wsUrl: {
      label: "URL WebSocket",
      placeholder: "ws://127.0.0.1:3001",
      help: "Utilisez l’URL Forward WebSocket de NapCat."
    },
    accessToken: {
      label: "Jeton d’accès",
      placeholder: "Jeton facultatif"
    },
    groupPolicy: {
      label: "Comportement en groupe",
      choices: {
        mention: "Mentions uniquement",
        open: "Tous les messages",
        allowlist: "Liste d’autorisation"
      }
    },
    allowFrom: {
      label: "Utilisateurs autorisés",
      placeholder: "ID QQ séparés par des virgules"
    }
  }
}, o = {
  description: e,
  requirements: t,
  setup: a
};
export {
  o as default,
  e as description,
  t as requirements,
  a as setup
};
