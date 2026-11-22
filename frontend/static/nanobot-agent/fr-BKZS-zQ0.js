const e = "Utilisez nanobot depuis les espaces Slack.", t = "Jeton d’application Slack, jeton du bot et installation dans l’espace", a = {
  docsLabel: "Ouvrir le guide Slack",
  officialLabel: "Ouvrir les applications Slack",
  tryIt: "Mentionnez l’application Slack ou envoyez-lui un message privé.",
  summary: "Slack utilise Socket Mode par défaut et nécessite les jetons d’application et de bot.",
  steps: [
    "Créez une application Slack avec le manifeste fourni et activez Socket Mode.",
    "Installez l’application dans votre espace et copiez les jetons d’application et de bot.",
    "Enregistrez et activez Slack, puis mentionnez l’application ou envoyez-lui un message privé."
  ],
  actions: {
    "slack-manifest": "Copier le manifeste"
  },
  fields: {
    appToken: {
      label: "Jeton d’application",
      placeholder: "xapp-...",
      help: "Créez-le depuis Socket Mode dans Slack."
    },
    botToken: {
      label: "Jeton du bot",
      placeholder: "xoxb-...",
      help: "Utilisez le jeton du bot après l’installation de l’application."
    },
    groupPolicy: {
      label: "Comportement en groupe",
      choices: {
        mention: "Mentions uniquement",
        open: "Tous les messages",
        allowlist: "Liste d’autorisation"
      }
    }
  }
}, i = {
  description: e,
  requirements: t,
  setup: a
};
export {
  i as default,
  e as description,
  t as requirements,
  a as setup
};
