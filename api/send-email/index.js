// api/send-email/index.js
module.exports = async function (context, req) {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  // Preflight (CORS)
  if (req.method === "OPTIONS") {
    context.res = { status: 204, headers };
    return;
  }

  try {
    const body = req.body || {};
    const { name, email, phone, msg, message } = body; // allow either key

    if (!name || !email || !(msg || message)) {
      context.res = { status: 400, headers, body: JSON.stringify({ error: "Missing fields" }) };
      return;
    }

    // For now, just confirm we received it. (We’ll wire email next.)
    context.log(`Form OK: ${name} | ${email} | ${phone || "n/a"} | ${(msg || message).slice(0,120)}`);

    context.res = { status: 200, headers, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    context.log("Send error:", err);
    context.res = { status: 500, headers, body: JSON.stringify({ error: "Failed to process" }) };
  }
};
