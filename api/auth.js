const SECRET = "SKYBAGSDISTRICTB7";
const GAME = "PUBG";

module.exports = async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method Not Allowed"
    });
  }

  try {
    let user_key = "";
    let serial = "";

    const contentType = String(
      req.headers["content-type"] || ""
    ).toLowerCase();

    // JSON
    if (contentType.includes("application/json")) {
      const body = req.body || {};

      user_key = String(body.user_key || "").trim();
      serial = String(body.serial || "").trim();
    }

    // application/x-www-form-urlencoded
    else {
      let rawBody = "";

      if (typeof req.body === "string") {
        rawBody = req.body;
      } else if (Buffer.isBuffer(req.body)) {
        rawBody = req.body.toString("utf8");
      } else if (req.body && typeof req.body === "object") {
        user_key = String(req.body.user_key || "").trim();
        serial = String(req.body.serial || "").trim();
      }

      if (rawBody) {
        const params = new URLSearchParams(rawBody);

        user_key = String(
          params.get("user_key") || ""
        ).trim();

        serial = String(
          params.get("serial") || ""
        ).trim();
      }
    }

    /*
     * Python asli tidak melakukan:
     *
     * if user_key == "..."
     *
     * Jadi jangan mengunci key tertentu di sini.
     */

    const now = Math.floor(Date.now() / 1000);

    const token =
      `${GAME}-${user_key}-${serial}-${SECRET}`;

    return res.status(200).json({
      data: {
        token: token,
        rng: now + 300,
        EXP: now + 2592000
      }
    });

  } catch (error) {
    console.error("AUTH ERROR:", error);

    return res.status(500).json({
      error: "Internal Server Error"
    });
  }
};
