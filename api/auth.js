export default function handler(req, res) {
  // Ambil parameter dari query GET atau body POST
  const { game, user_key, serial } = req.method === "POST" ? req.body : req.query;

  // Validasi input
  if (!game || !user_key || !serial) {
    return res.status(400).json({
      status: false,
      code: 400,
      message: "Parameter tidak lengkap."
    });
  }

  // Contoh validasi sederhana (sesuaikan dengan query database Anda)
  if (user_key === "aa" && game === "PUBG") {
    return res.status(200).json({
      status: true,
      code: 200,
      message: "Autentikasi berhasil",
      data: {
        game,
        user_key,
        serial,
        expiry_date: "2026-12-31 23:59:59",
        auth_token: Buffer.from(`${user_key}:${serial}:${Date.now()}`).toString("base64")
      }
    });
  }

  return res.status(401).json({
    status: false,
    code: 401,
    message: "User key atau game tidak valid."
  });
}
```<ElicitationsGroup message="Terkait implementasi autentikasi lisensi di Vercel:">
  <Elicitation label="Buat skema integrasi database (Supabase / MongoDB)" query="Bagaimana cara menghubungkan API login Vercel ini ke database MongoDB atau Supabase untuk verifikasi user_key dan serial?"/>
  <Elicitation label="Amankan API dari sniffing dan response spoofing" query="Bagaimana cara mengamankan response API login game agar tidak mudah di-bypass atau dimanipulasi dengan tools proxy?"/>
</ElicitationsGroup>
