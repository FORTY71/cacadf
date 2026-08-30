export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const SECRET = "SKYBAGSDISTRICTB7";
    const GAME = "PUBG";
    
    // 1. Daftar key yang diizinkan
    const VALID_KEYS = ["caca", "prada", "admin123"]; 

    // 2. Ekstraksi data secara aman
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

    // 3. Logika Validasi Salah
    if (!VALID_KEYS.includes(user_key)) {
      console.log(`[DEBUG] Key Ditolak: ${user_key}`);
      // Memberikan HTTP 200 tapi JSON kosong agar klien tidak crash, 
      // klien akan otomatis menganggapnya gagal karena tidak ada 'token'
      return res.status(200).json({}); 
    }

    // 4. Logika Validasi Benar
    const now = Math.floor(Date.now() / 1000);
    const token = `${GAME}-${user_key}-${serial}-${SECRET}`;

    console.log(`[DEBUG] Key Diterima: ${user_key} | serial: ${serial}`);

    // 5. KEMBALIKAN STRUKTUR JSON PERSIS SEPERTI PYTHON ASLI
    return res.status(200).json({
      data: {
        token: token,
        rng: now + 300,
        EXP: now + 2592000
      }
    });

  } catch (error) {
    console.error("Crash pada handler:", error);
    return res.status(500).send('Internal Server Error');
  }
}
