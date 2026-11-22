const a = "Gunakan nanobot dari pesan Signal.", n = "Daemon HTTP signal-cli, nomor telepon, dan daftar izin", l = {
  docsLabel: "Buka panduan Signal",
  officialLabel: "Buka panduan signal-cli",
  tryIt: "Kirim DM Signal ke nomor yang ditautkan.",
  summary: "Signal terhubung melalui daemon HTTP signal-cli yang sudah ditautkan ke nomor Signal.",
  steps: [
    "Pasang signal-cli-rest-api dan tautkan atau daftarkan nomor Signal.",
    "Masukkan host daemon, port, dan nomor yang ditautkan.",
    "Simpan dan aktifkan Signal, lalu kirim pesan langsung uji."
  ],
  fields: {
    phoneNumber: {
      label: "Nomor telepon",
      placeholder: "+1234567890",
      help: "Gunakan nomor Signal yang terdaftar di signal-cli."
    },
    daemonHost: {
      label: "Host daemon",
      placeholder: "localhost"
    },
    daemonPort: {
      label: "Port daemon",
      placeholder: "8080"
    },
    dm_allowFrom: {
      label: "DM yang diizinkan",
      placeholder: "Nomor telepon atau UUID"
    },
    group_allowFrom: {
      label: "Grup yang diizinkan",
      placeholder: "ID grup"
    }
  }
}, o = {
  description: a,
  requirements: n,
  setup: l
};
export {
  o as default,
  a as description,
  n as requirements,
  l as setup
};
