module.exports = async function handler(req, res) {
  try {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Cache-Control", "no-store");

    if (req.method === "OPTIONS") {
      return res.status(200).json({
        status: true,
        code: 200
      });
    }

    const body = req.body || {};
    const query = req.query || {};

    const userKey = String(
      body.user_key ??
      body.userKey ??
      body.key ??
      query.user_key ??
      query.userKey ??
      query.key ??
      ""
    ).trim();

    const game = String(
      body.game ??
      query.game ??
      "PUBG"
    ).trim();

    const serial = String(
      body.serial ??
      query.serial ??
      ""
    ).trim();

    // =====================================================
    // TEST KEY
    // =====================================================

    if (userKey !== "aa") {
      return res.status(401).json({
        status: false,
        success: false,
        valid: false,
        code: 401,
        message: "Invalid key"
      });
    }

    const token = Buffer
      .from(`${userKey}:${serial}:${Date.now()}`)
      .toString("base64");

    // =====================================================
    // RESPONSE
    // =====================================================

    return res.status(200).json({
      status: true,
      success: true,
      valid: true,
      authenticated: true,

      code: 200,

      message: "Login successful",
      msg: "Login successful",

      token: token,
      auth_token: token,
      access_token: token,

      key: userKey,
      user_key: userKey,
      userKey: userKey,

      game: game,
      serial: serial,

      expiry_date: "2026-12-31 23:59:59",
      expiry: "2026-12-31 23:59:59",

      data: {
        status: true,
        success: true,
        valid: true,

        code: 200,

        message: "Login successful",

        key: userKey,
        user_key: userKey,
        userKey: userKey,

        game: game,
        serial: serial,

        token: token,
        auth_token: token,
        access_token: token,

        expiry_date: "2026-12-31 23:59:59",
        expiry: "2026-12-31 23:59:59",

        expired: false
      }
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      status: false,
      success: false,
      code: 500,
      message: "Internal server error"
    });
  }
};
