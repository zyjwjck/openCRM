const e = "Utilisez nanobot depuis les groupes DingTalk.", i = "Identifiants d’application DingTalk et passerelle", l = {
  docsLabel: "Ouvrir le guide DingTalk",
  officialLabel: "Ouvrir la console DingTalk",
  tryIt: "Envoyez un message test dans le groupe DingTalk où l’application est installée.",
  summary: "DingTalk nécessite les identifiants d’une application en mode Stream.",
  steps: [
    "Créez ou choisissez une application DingTalk avec le mode Stream activé.",
    "Ajoutez le Client ID et le Client Secret.",
    "Enregistrez et activez DingTalk, puis envoyez un message test."
  ],
  fields: {
    clientId: {
      label: "Client ID",
      placeholder: "Client ID DingTalk",
      help: "Copiez-le depuis les identifiants de l’application DingTalk."
    },
    clientSecret: {
      label: "Client Secret",
      placeholder: "••••••",
      help: "Copiez-le depuis la même page d’identifiants DingTalk."
    },
    allowFrom: {
      label: "Utilisateurs autorisés",
      placeholder: "ID utilisateur séparés par des virgules"
    }
  }
}, t = {
  description: e,
  requirements: i,
  setup: l
};
export {
  t as default,
  e as description,
  i as requirements,
  l as setup
};
