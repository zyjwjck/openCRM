const e = "ローカルのブラウザワークベンチから nanobot を利用します。", t = "ローカルゲートウェイと WebSocket トークン", o = {
  docsLabel: "WebSocket 設定ガイドを開く",
  officialLabel: "ローカル WebUI を開く",
  tryIt: "WebUI を開き、短いメッセージを送信します。",
  summary: "ブラウザワークベンチには WebSocket が必要で、nanobot webui コマンドによって準備されます。",
  steps: [
    "webui コマンドで nanobot を起動します。",
    "ターミナルに表示されたローカル URL を開きます。",
    "ブラウザワークベンチの使用中は WebSocket を有効にしておきます。"
  ]
}, s = {
  description: e,
  requirements: t,
  setup: o
};
export {
  s as default,
  e as description,
  t as requirements,
  o as setup
};
