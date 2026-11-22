const e = "Utilisez nanobot depuis les conversations QQ.", s = "Identifiants du bot QQ et passerelle", t = {
  docsLabel: "Ouvrir le guide QQ",
  officialLabel: "Ouvrir la console du bot QQ",
  tryIt: "Envoyez un message test privé ou de groupe depuis QQ.",
  summary: "QQ utilise les identifiants officiels du bot et une connexion WebSocket persistante.",
  steps: [
    "Créez un bot sur QQ Open Platform et copiez son App ID et son Secret.",
    "Choisissez le format des messages et la liste d’expéditeurs facultative.",
    "Enregistrez et activez QQ, puis envoyez un message test privé ou de groupe."
  ],
  fields: {
    appId: {
      label: "App ID",
      placeholder: "App ID du bot QQ",
      help: "Copiez-le depuis QQ Open Platform."
    },
    secret: {
      label: "Secret",
      placeholder: "••••••",
      help: "Enregistrez-le avant de quitter la page des identifiants QQ."
    },
    allowFrom: {
      label: "Utilisateurs autorisés",
      placeholder: "Open ID séparés par des virgules"
    },
    msgFormat: {
      label: "Format des messages",
      choices: {
        plain: "Texte brut",
        markdown: "Markdown"
      }
    }
  }
}, i = {
  description: e,
  requirements: s,
  setup: t
};
export {
  i as default,
  e as description,
  s as requirements,
  t as setup
};
