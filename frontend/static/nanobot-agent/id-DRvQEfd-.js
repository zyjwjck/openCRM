const a = "Gunakan nanobot dari chat Microsoft Teams.", e = "Kredensial aplikasi bot Azure dan endpoint callback publik", n = {
  docsLabel: "Buka panduan Teams",
  officialLabel: "Buka portal pengembang Teams",
  tryIt: "Pasang aplikasi Teams dan kirim pesan uji.",
  summary: "Teams menerima pesan melalui URL callback Bot Framework. Produksi memerlukan endpoint HTTPS yang dapat dijangkau.",
  steps: [
    "Buat Azure Bot atau aplikasi Teams dan salin App ID serta client secret.",
    "Paparkan jalur callback melalui HTTPS dan jadikan endpoint pesan bot.",
    "Simpan dan aktifkan Teams, lalu pasang aplikasi dan kirim pesan uji."
  ],
  fields: {
    appId: {
      label: "App ID",
      placeholder: "Microsoft App ID",
      help: "Salin dari pendaftaran Azure Bot atau aplikasi Teams."
    },
    appPassword: {
      label: "Client secret",
      placeholder: "••••••",
      help: "Buat client secret untuk aplikasi Microsoft."
    },
    tenantId: {
      label: "Tenant ID",
      placeholder: "Tenant ID opsional"
    },
    path: {
      label: "Jalur callback",
      placeholder: "/api/messages"
    },
    allowFrom: {
      label: "Pengguna yang diizinkan",
      placeholder: "ID pengguna Teams, dipisahkan koma"
    }
  }
}, l = {
  description: a,
  requirements: e,
  setup: n
};
export {
  l as default,
  a as description,
  e as requirements,
  n as setup
};
