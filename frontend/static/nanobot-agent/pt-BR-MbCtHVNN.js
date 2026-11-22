const e = "Use o nanobot no ambiente de trabalho do navegador local.", o = "Gateway local e token WebSocket", a = {
  docsLabel: "Abrir guia do WebSocket",
  officialLabel: "Abrir WebUI local",
  tryIt: "Abra a WebUI e envie uma mensagem curta.",
  summary: "O ambiente do navegador precisa do WebSocket, preparado pelo comando nanobot webui.",
  steps: [
    "Inicie o nanobot com o comando webui.",
    "Abra a URL local exibida no terminal.",
    "Mantenha o WebSocket ativado ao usar o ambiente do navegador."
  ]
}, t = {
  description: e,
  requirements: o,
  setup: a
};
export {
  t as default,
  e as description,
  o as requirements,
  a as setup
};
