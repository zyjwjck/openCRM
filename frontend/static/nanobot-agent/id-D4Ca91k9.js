const a = "Gunakan nanobot dari percakapan WhatsApp.", n = "Setup koneksi WhatsApp dan gateway", e = {
  primaryAction: "Hubungkan WhatsApp",
  docsLabel: "Buka panduan WhatsApp",
  officialLabel: "Buka bantuan WhatsApp",
  tryIt: "Setelah login terminal selesai, kirim DM ke akun yang terhubung.",
  summary: "WhatsApp terhubung dengan memindai kode QR dari akun yang akan menjalankan bot.",
  steps: [
    "Jalankan perintah login WhatsApp yang ditampilkan di bawah.",
    "Pindai kode QR di terminal dengan WhatsApp di ponsel.",
    "Kembali ke sini setelah login, aktifkan WhatsApp, lalu kirim pesan langsung uji."
  ],
  fields: {
    allowFrom: {
      label: "Kontak yang diizinkan",
      placeholder: "Nomor telepon atau ID WhatsApp"
    },
    groupPolicy: {
      label: "Perilaku grup",
      choices: {
        mention: "Hanya sebutan",
        open: "Semua pesan",
        allowlist: "Daftar izin"
      }
    }
  }
}, i = {
  description: a,
  requirements: n,
  setup: e
};
export {
  i as default,
  a as description,
  n as requirements,
  e as setup
};
