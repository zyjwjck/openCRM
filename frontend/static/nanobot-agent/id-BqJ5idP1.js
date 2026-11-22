const a = "Gunakan nanobot dari channel dan DM Mattermost.", e = "URL server Mattermost, token bot, dan akses channel", t = {
  docsLabel: "Buka panduan Mattermost",
  officialLabel: "Buka panduan bot Mattermost",
  tryIt: "Sebut bot di channel Mattermost atau kirim pesan langsung.",
  summary: "Mattermost terhubung melalui akun bot di server dan menerima pesan channel serta pesan langsung.",
  steps: [
    "Buat akun bot Mattermost dan salin token aksesnya.",
    "Masukkan URL server dan berikan akses ke tim serta channel tujuan.",
    "Simpan dan aktifkan Mattermost, lalu sebut bot atau kirim DM."
  ],
  fields: {
    serverUrl: {
      label: "URL server",
      placeholder: "https://mattermost.example.com",
      help: "Gunakan URL dasar workspace Mattermost."
    },
    token: {
      label: "Token bot",
      placeholder: "Token bot Mattermost",
      help: "Buat dari akun bot Mattermost."
    },
    teamId: {
      label: "ID tim",
      placeholder: "ID tim opsional"
    },
    groupPolicy: {
      label: "Perilaku kanal",
      choices: {
        mention: "Hanya sebutan",
        open: "Semua pesan",
        allowlist: "Daftar izin"
      }
    },
    groupPolicyInThread: {
      label: "Perilaku thread",
      choices: {
        mention: "Hanya sebutan",
        open: "Semua pesan (tanpa sebutan)",
        allowlist: "Daftar izin"
      }
    },
    allowFrom: {
      label: "Pengguna yang diizinkan",
      placeholder: "ID pengguna, dipisahkan koma"
    }
  }
}, n = {
  description: a,
  requirements: e,
  setup: t
};
export {
  n as default,
  a as description,
  e as requirements,
  t as setup
};
