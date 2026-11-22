const e = "Use o nanobot em conversas de trabalho do WeCom.", o = "Credenciais do app WeCom e configurações de callback", a = {
  docsLabel: "Abrir guia do WeCom",
  officialLabel: "Abrir console do WeCom",
  tryIt: "Envie uma mensagem de teste ao bot do WeCom.",
  summary: "O WeCom precisa do ID e do segredo de um bot de IA do console administrativo.",
  steps: [
    "Crie um bot de IA no WeCom e escolha o modo API.",
    "Copie o Bot ID e o Secret para o nanobot.",
    "Salve e ative o WeCom; depois, envie uma mensagem de teste."
  ],
  fields: {
    botId: {
      label: "Bot ID",
      placeholder: "Bot ID do WeCom",
      help: "Copie da página do modo API do bot de IA do WeCom."
    },
    secret: {
      label: "Secret",
      placeholder: "••••••",
      help: "Mantenha privado o segredo do bot do WeCom."
    },
    allowFrom: {
      label: "Usuários permitidos",
      placeholder: "IDs de usuário separados por vírgulas"
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
