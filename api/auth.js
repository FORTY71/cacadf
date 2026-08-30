module.exports = async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({
      status: false,
      code: 405,
      message: "Method tidak diizinkan."
    });
  }

  try {
    const source =
      req.method === "POST"
        ? (req.body || {})
        : (req.query || {});

    const game =
      typeof source.game === "string"
        ? source.game.trim()
        : "";

    const user_key =
      typeof source.user_key === "string"
        ? source.user_key.trim()
        : "";

    const serial =
      typeof source.serial === "string"
        ? source.serial.trim()
        : "";

    if (!game || !user_key || !serial) {
      return res.status(400).json({
        status: false,
        code: 400,
        message: "Parameter tidak lengkap."
      });
    }

    // Validasi sementara
    if (user_key === "aa" && game === "PUBG") {
      const authToken = Buffer.from(
        `${user_key}:${serial}:${Date.now()}`,
        "utf8"
      ).toString("base64");

      return res.status(200).json({
        status: true,
        code: 200,
        message: "Autentikasi berhasil",
        data: {
          game: game,
          user_key: user_key,
          serial: serial,
          expiry_date: "2026-12-31 23:59:59",
          auth_token: authToken
        }
      });
    }

    return res.status(401).json({
      status: false,
      code: 401,
      message: "User key atau game tidak valid."
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
