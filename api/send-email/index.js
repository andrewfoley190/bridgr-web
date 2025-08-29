const nodemailer = require("nodemailer");

module.exports = async function (context, req) {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  if (req.method === "OPTIONS") { context.res = { status: 204, headers }; return; }

  try {
    const { name, email, phone, message } = req.body || {};
    if (!name || !email || !message) {
      context.res = { status: 400, headers, body: JSON.stringify({ error: "Missing fields" }) };
      return;
    }

    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const to   = process.env.TO_EMAIL || user;
    const from = process.env.FROM_EMAIL || user;

    const transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      secure: false,
      auth: { user, pass }
    });

    const text = `Name: ${name}
Email: ${email}
Phone: ${phone || "n/a"}

${message}`;

    await transporter.sendMail({
      from,
      to,
      subject: "Bridgr — Quote Request",
      text
    });

    context.res = { status: 200, headers, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    context.log("Send error:", err);
    context.res = { status: 500, headers, body: JSON.stringify({ error: "Failed to send" }) };
  }
};
