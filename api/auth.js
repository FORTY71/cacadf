module.exports = async function handler(req, res) {
  // Allow GET and POST only.
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({
      status: false,
      code: 405,
      message: "Method tidak diizinkan. Gunakan GET atau POST."
    });
  }

  try {
    // GET -> req.query
    // POST -> req.body (Vercel Node runtime parses JSON bodies when applicable)
    const source = req.method === "POST" && req.body
      ? req.body
      : (req.query || {});

    const game = typeof source.game === "string" ? source.game.trim() : "";
    const user_key = typeof source.user_key === "string" ? source.user_key.trim() : "";
    const serial = typeof source.serial === "string" ? source.serial.trim() : "";

    // Validate required parameters.
    if (!game || !user_key || !serial) {
      return res.status(400).json({
        status: false,
        code: 400,
        message: "Parameter tidak lengkap.",
        required: ["game", "user_key", "serial"]
      });
    }

    // Contoh validasi sementara.
    // Ganti blok ini dengan database validation nanti.
    if (user_key === "aa" && game === "PUBG" && serial === "123") {
      const expiryDate = "2026-12-31 23:59:59";

      // Temporary example token. Base64 bukan mekanisme keamanan.
      const rawToken = `${user_key}:${serial}:${Date.now()}`;
      const authToken = Buffer.from(rawToken, "utf8").toString("base64");

      return res.status(200).json({
        status: true,
        code: 200,
        message: "Autentikasi berhasil",
        data: {
          game,
          user_key,
          serial,
          expiry_date: expiryDate,
          auth_token: authToken
        }
      });
    }

    return res.status(401).json({
      status: false,
      code: 401,
      message: "User key, game, atau serial tidak valid."
    });
  } catch (error) {
    console.error("AUTH_ERROR:", error);

    return res.status(500).json({
      status: false,
      code: 500,
      message: "Internal server error."
    });
  }
};
