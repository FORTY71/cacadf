module.exports = async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({
      status: false,
      success: false,
      code: 405,
      message: "Method tidak diizinkan."
    });
  }

  try {
    const input = req.method === "POST"
      ? (req.body || {})
      : (req.query || {});

    const game = String(input.game || "").trim();
    const userKey = String(
      input.user_key || input.userKey || input.key || ""
    ).trim();
    const serial = String(input.serial || "").trim();

    if (!userKey) {
      return res.status(400).json({
        status: false,
        success: false,
        code: 400,
        message: "User key tidak boleh kosong."
      });
    }

    /*
     * TEST AUTH
     *
     * Untuk sementara:
     * user_key = aa
     *
     * Game dan serial dibuat opsional supaya kita bisa
     * mengetahui format request yang sebenarnya dikirim client.
     */
    if (userKey === "aa") {
      const expiryDate = "2026-12-31 23:59:59";

      const tokenData = `${userKey}:${serial}:${Date.now()}`;
      const token = Buffer
        .from(tokenData, "utf8")
        .toString("base64");

      return res.status(200).json({
        status: true,
        success: true,
        valid: true,
        authenticated: true,

        code: 200,
        status_code: 200,

        message: "Autentikasi berhasil",
        msg: "Autentikasi berhasil",

        // Beberapa bentuk token untuk kompatibilitas client
        token: token,
        auth_token: token,
        access_token: token,

        // Data utama
        game: game || "PUBG",
        user_key: userKey,
        userKey: userKey,
        serial: serial,

        expiry_date: expiryDate,
        expiry: expiryDate,
        expired: false,

        data: {
          status: true,
          success: true,
          valid: true,

          game: game || "PUBG",

          user_key: userKey,
          userKey: userKey,

          serial: serial,

          token: token,
          auth_token: token,
          access_token: token,

          expiry_date: expiryDate,
          expiry: expiryDate,

          expired: false
        }
      });
    }

    return res.status(401).json({
      status: false,
      success: false,
      valid: false,
      authenticated: false,
      code: 401,
      status_code: 401,
      message: "User key tidak valid.",
      msg: "User key tidak valid."
    });

  } catch (error) {
    console.error("AUTH_ERROR:", error);

    return res.status(500).json({
      status: false,
      success: false,
      code: 500,
      message: "Internal server error."
    });
  }
};
