// /api/send-email/index.js
const nodemailer = require("nodemailer");

module.exports = async function (context, req) {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // CORS preflight
  if (req.method === "OPTIONS") {
    context.res = { status: 204, headers };
    return;
  }

  // ... existing code above
try {
  const body = req.body || {};
  const { name, email, phone, msg, message } = body;

  if (!name || !email || !(msg || message)) {
    context.res = { status: 400, headers, body: JSON.stringify({ error: "Missing fields" }) };
    return;
  }

  // 🔎 Add a quick connection check (will throw if host/port/auth are wrong)
  await transporter.verify();

  // Log what we got (safe)
  context.log(`Form OK: ${name} | ${email} | ${phone || "n/a"} | ${(msg || message).slice(0,120)}`);

  await transporter.sendMail({
    from: process.env.SMTP_USER, // must match your mailbox
    to: process.env.TO_EMAIL,
    subject: `Bridgr Quote — ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || "n/a"}\n\n${msg || message}`,
  });

  context.res = { status: 200, headers, body: JSON.stringify({ ok: true }) };

} catch (err) {
  console.error("Send error:", err);
  context.res = {
    status: 500,
    headers,
    body: JSON.stringify({ error: "Failed to send", details: err.message || err.toString() })
  };
}

};
