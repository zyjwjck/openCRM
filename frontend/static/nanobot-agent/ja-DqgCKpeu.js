const e = "DingTalk グループから nanobot を利用します。", l = "DingTalk アプリの認証情報とゲートウェイ", t = {
  docsLabel: "DingTalk 設定ガイドを開く",
  officialLabel: "DingTalk コンソールを開く",
  tryIt: "アプリをインストールした DingTalk グループからテストメッセージを送信します。",
  summary: "DingTalk には Stream モードのアプリ認証情報が必要です。",
  steps: [
    "Stream モードを有効にした DingTalk アプリを作成または選択します。",
    "Client ID と Client Secret を追加します。",
    "保存して DingTalk を有効にし、テストメッセージを送信します。"
  ],
  fields: {
    clientId: {
      label: "Client ID",
      placeholder: "DingTalk Client ID",
      help: "DingTalk アプリの認証情報からコピーします。"
    },
    clientSecret: {
      label: "Client Secret",
      placeholder: "••••••",
      help: "同じ認証情報ページからコピーします。"
    },
    allowFrom: {
      label: "許可するユーザー",
      placeholder: "ユーザー ID（カンマ区切り）"
    }
  }
}, a = {
  description: e,
  requirements: l,
  setup: t
};
export {
  a as default,
  e as description,
  l as requirements,
  t as setup
};
