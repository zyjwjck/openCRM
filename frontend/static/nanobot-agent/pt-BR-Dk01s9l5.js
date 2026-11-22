const e = "Converse com o nanobot pelo Telegram.", o = "Token do bot, usuários permitidos e gateway", a = {
  docsLabel: "Abrir guia do Telegram",
  officialLabel: "Abrir BotFather",
  tryIt: "Envie /start ou uma DM curta ao seu bot do Telegram.",
  summary: "Ativar liga o suporte ao Telegram. Um token do BotFather ainda é necessário para trocar mensagens.",
  steps: [
    "Crie um bot com o BotFather e copie o token.",
    "Adicione o token e escolha quem pode enviar mensagens ao bot.",
    "Salve e ative o Telegram; depois, envie uma DM ou mencione o bot em um grupo."
  ],
  fields: {
    token: {
      label: "Token do bot",
      placeholder: "123456:ABC...",
      help: "Crie-o com o BotFather."
    },
    proxy: {
      label: "Proxy de rede",
      placeholder: "http://127.0.0.1:7890"
    },
    allowFrom: {
      label: "Usuários permitidos",
      placeholder: "* ou IDs de usuário do Telegram",
      help: "Deixe vazio para usar códigos de pareamento."
    },
    groupPolicy: {
      label: "Comportamento em grupos",
      choices: {
        mention: "Somente menções",
        open: "Todas as mensagens",
        allowlist: "Lista de permissão"
      }
    }
  }
}, r = {
  description: e,
  requirements: o,
  setup: a
};
export {
  r as default,
  e as description,
  o as requirements,
  a as setup
};
