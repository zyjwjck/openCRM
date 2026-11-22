const a = "Gunakan nanobot dari chat QQ.", e = "Kredensial bot QQ dan gateway", n = {
  docsLabel: "Buka panduan QQ",
  officialLabel: "Buka konsol bot QQ",
  tryIt: "Kirim pesan uji langsung atau grup dari QQ.",
  summary: "QQ menggunakan kredensial bot resmi dan koneksi WebSocket persisten.",
  steps: [
    "Buat bot di QQ Open Platform dan salin App ID serta Secret.",
    "Pilih format pesan dan daftar pengirim opsional.",
    "Simpan dan aktifkan QQ, lalu kirim pesan uji langsung atau grup."
  ],
  fields: {
    appId: {
      label: "App ID",
      placeholder: "App ID bot QQ",
      help: "Salin dari QQ Open Platform."
    },
    secret: {
      label: "Secret",
      placeholder: "••••••",
      help: "Simpan sebelum meninggalkan halaman kredensial QQ."
    },
    allowFrom: {
      label: "Pengguna yang diizinkan",
      placeholder: "Open ID, dipisahkan koma"
    },
    msgFormat: {
      label: "Format pesan",
      choices: {
        plain: "Teks biasa",
        markdown: "Markdown"
      }
    }
  }
}, i = {
  description: a,
  requirements: e,
  setup: n
};
export {
  i as default,
  a as description,
  e as requirements,
  n as setup
};
