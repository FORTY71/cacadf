export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: false, message: 'Method Not Allowed' });
  }

  try {
    const SECRET = "SKYBAGSDISTRICTB7";
    const GAME = "PUBG";

    // 1. Daftar key yang diizinkan (Tambahkan key valid di sini)
    const VALID_KEYS = ["caca", "prada", "admin123"]; 

    let body = req.body || {};

    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        const params = new URLSearchParams(body);
        body = Object.fromEntries(params);
      }
    }

    const user_key = body.user_key || "";
    const serial = body.serial || "";

    // 2. Logika Validasi Salah/Benar
    if (!VALID_KEYS.includes(user_key)) {
      // Respons jika key TIDAK TERDAFTAR
      console.log(`[DEBUG] Login Gagal -> Key tidak valid: ${user_key}`);
      return res.status(401).json({
        status: false,
        message: "Key Invalid atau belum terdaftar!"
      });
    }

    // 3. Respons jika key BENAR
    const now = Math.floor(Date.now() / 1000);
    const token = `${GAME}-${user_key}-${serial}-${SECRET}`;

    console.log(`[DEBUG] Login Berhasil -> user_key: ${user_key} | serial: ${serial}`);

    return res.status(200).json({
      status: true,
      data: {
        token: token,
        rng: now + 300,
        EXP: now + 2592000
      }
    });

  } catch (error) {
    console.error("Crash pada handler:", error);
    return res.status(500).json({ status: false, message: 'Internal Server Error' });
  }
}
