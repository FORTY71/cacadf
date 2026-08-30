export default async function handler(req, res) {
  // 1. Tolak jika bukan request POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const SECRET = "SKYBAGSDISTRICTB7";
    const GAME = "PUBG";

    let body = req.body || {};

    // 2. Deteksi otomatis format data (berjaga-jaga jika klien tidak mengirim header Content-Type dengan benar)
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        // Fallback: Parsing form-urlencoded jika bukan JSON
        const params = new URLSearchParams(body);
        body = Object.fromEntries(params);
      }
    }

    // 3. Ambil data dari body
    const user_key = body.user_key || "";
    const serial = body.serial || "";

    // 4. Rakit token (Unix timestamp dalam detik)
    const now = Math.floor(Date.now() / 1000);
    const token = `${GAME}-${user_key}-${serial}-${SECRET}`;

    // Log terminal di Vercel (bisa dilihat di tab "Logs" pada dashboard Vercel)
    console.log(`[DEBUG] user_key: ${user_key} | serial: ${serial}`);

    // 5. Kirim balasan JSON
    return res.status(200).json({
      data: {
        token: token,
        rng: now + 300,
        EXP: now + 2592000
      }
    });

  } catch (error) {
    console.error("Crash pada handler:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
