const p = "WhatsApp の会話から nanobot を利用します。", t = "WhatsApp 接続設定とゲートウェイ", s = {
  primaryAction: "WhatsApp に接続",
  docsLabel: "WhatsApp 設定ガイドを開く",
  officialLabel: "WhatsApp ヘルプを開く",
  tryIt: "ターミナルでのログイン後、接続したアカウントに WhatsApp の DM を送信します。",
  summary: "ボットを動かす WhatsApp アカウントで QR コードを読み取って接続します。",
  steps: [
    "下に表示された WhatsApp ログインコマンドを実行します。",
    "スマートフォンの WhatsApp でターミナルの QR コードを読み取ります。",
    "ログイン後に戻り、WhatsApp を有効にして DM でテストします。"
  ],
  fields: {
    allowFrom: {
      label: "許可する連絡先",
      placeholder: "電話番号または WhatsApp ID"
    },
    groupPolicy: {
      label: "グループでの動作",
      choices: {
        mention: "メンションのみ",
        open: "すべてのメッセージ",
        allowlist: "許可リスト"
      }
    }
  }
}, a = {
  description: p,
  requirements: t,
  setup: s
};
export {
  a as default,
  p as description,
  t as requirements,
  s as setup
};
