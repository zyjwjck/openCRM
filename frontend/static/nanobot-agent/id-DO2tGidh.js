const a = "Gunakan nanobot dari grup DingTalk.", i = "Kredensial aplikasi DingTalk dan gateway", e = {
  docsLabel: "Buka panduan DingTalk",
  officialLabel: "Buka konsol DingTalk",
  tryIt: "Kirim pesan uji dari grup DingTalk tempat aplikasi dipasang.",
  summary: "DingTalk memerlukan kredensial aplikasi dari mode Stream.",
  steps: [
    "Buat atau pilih aplikasi DingTalk dengan mode Stream aktif.",
    "Tambahkan Client ID dan Client Secret.",
    "Simpan dan aktifkan DingTalk, lalu kirim pesan uji."
  ],
  fields: {
    clientId: {
      label: "Client ID",
      placeholder: "Client ID DingTalk",
      help: "Salin dari kredensial aplikasi DingTalk."
    },
    clientSecret: {
      label: "Client Secret",
      placeholder: "••••••",
      help: "Salin dari halaman kredensial yang sama."
    },
    allowFrom: {
      label: "Pengguna yang diizinkan",
      placeholder: "ID pengguna, dipisahkan koma"
    }
  }
}, n = {
  description: a,
  requirements: i,
  setup: e
};
export {
  n as default,
  a as description,
  i as requirements,
  e as setup
};
