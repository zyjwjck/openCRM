const e = "釘釘", l = "在釘釘群組中使用 nanobot。", t = "釘釘應用程式憑證和閘道", a = {
  docsLabel: "開啟釘釘設定指南",
  officialLabel: "開啟釘釘開發者後台",
  tryIt: "在已安裝應用程式的釘釘群組中傳送一則測試訊息。",
  summary: "釘釘需要 Stream 模式的應用程式憑證。",
  steps: [
    "建立或選擇一個已啟用 Stream 模式的釘釘應用程式。",
    "填入 Client ID 和 Client Secret。",
    "儲存並啟用釘釘，然後傳送一則測試訊息。"
  ],
  fields: {
    clientId: {
      label: "Client ID",
      placeholder: "釘釘 Client ID",
      help: "從釘釘應用程式憑證頁面複製。"
    },
    clientSecret: {
      label: "Client Secret",
      placeholder: "••••••",
      help: "從同一個釘釘應用程式憑證頁面複製。"
    },
    allowFrom: {
      label: "允許的使用者",
      placeholder: "使用者 ID，以逗號分隔"
    }
  }
}, s = {
  displayName: e,
  description: l,
  requirements: t,
  setup: a
};
export {
  s as default,
  l as description,
  e as displayName,
  t as requirements,
  a as setup
};
