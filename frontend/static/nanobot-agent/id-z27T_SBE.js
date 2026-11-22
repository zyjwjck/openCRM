const a = "Hubungkan nanobot melalui gateway NapCat.", e = "Endpoint WebSocket NapCat dan token akses opsional", n = {
  docsLabel: "Buka panduan NapCat",
  officialLabel: "Buka dokumentasi NapCat",
  tryIt: "Kirim pesan uji QQ melalui NapCat.",
  summary: "NapCat menghubungkan nanobot ke QQ melalui endpoint OneBot WebSocket lokal atau jarak jauh.",
  steps: [
    "Mulai NapCat dan aktifkan layanan Forward WebSocket.",
    "Salin URL WebSocket dan token opsional ke nanobot.",
    "Simpan dan aktifkan NapCat, lalu kirim pesan uji QQ."
  ],
  fields: {
    wsUrl: {
      label: "URL WebSocket",
      placeholder: "ws://127.0.0.1:3001",
      help: "Gunakan URL Forward WebSocket dari NapCat."
    },
    accessToken: {
      label: "Token akses",
      placeholder: "Token opsional"
    },
    groupPolicy: {
      label: "Perilaku grup",
      choices: {
        mention: "Hanya sebutan",
        open: "Semua pesan",
        allowlist: "Daftar izin"
      }
    },
    allowFrom: {
      label: "Pengguna yang diizinkan",
      placeholder: "ID QQ, dipisahkan koma"
    }
  }
}, o = {
  description: a,
  requirements: e,
  setup: n
};
export {
  o as default,
  a as description,
  e as requirements,
  n as setup
};
