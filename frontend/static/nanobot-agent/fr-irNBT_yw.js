const e = "Utilisez nanobot dans les conversations professionnelles WeCom.", s = "Identifiants d’application WeCom et paramètres de rappel", o = {
  docsLabel: "Ouvrir le guide WeCom",
  officialLabel: "Ouvrir la console WeCom",
  tryIt: "Envoyez un message test au bot WeCom.",
  summary: "WeCom nécessite l’ID et le secret d’un bot IA depuis la console d’administration.",
  steps: [
    "Créez un bot IA dans WeCom et choisissez le mode API.",
    "Copiez le Bot ID et le Secret dans nanobot.",
    "Enregistrez et activez WeCom, puis envoyez un message test."
  ],
  fields: {
    botId: {
      label: "Bot ID",
      placeholder: "Bot ID WeCom",
      help: "Copiez-le depuis la page du mode API du bot IA WeCom."
    },
    secret: {
      label: "Secret",
      placeholder: "••••••",
      help: "Gardez le secret du bot WeCom confidentiel."
    },
    allowFrom: {
      label: "Utilisateurs autorisés",
      placeholder: "ID utilisateur séparés par des virgules"
    }
  }
}, t = {
  description: e,
  requirements: s,
  setup: o
};
export {
  t as default,
  e as description,
  s as requirements,
  o as setup
};
