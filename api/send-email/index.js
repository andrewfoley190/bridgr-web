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

  try {
    const { name, email, phone, msg } = req.body || {};

    if (!name || !email || !msg) {
      context.res = {
        status: 400,
        headers,
        body: JSON.stringify({ error: "Missing fields" }),
      };
      return;
    }

    // SMTP transport from environment variables you added in Azure
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,                   // e.g. smtp.office365.com
      port: Number(process.env.SMTP_PORT || 587),    // 587 for STARTTLS, 465 for SSL
      secure: Number(process.env.SMTP_PORT) === 465, // true if port 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const to = process.env.TO_EMAIL;                 // where you want to receive requests
    const subject = `Bridgr — Quote Request from ${name}`;
    const text =
      `Name: ${name}\n` +
      `Email: ${email}\n` +
      `Phone: ${phone || ""}\n\n` +
      `${msg}`;
    const html =
      `<p><b>Name:</b> ${name}</p>` +
      `<p><b>Email:</b> ${email}</p>` +
      `<p><b>Phone:</b> ${phone || ""}</p>` +
      `<p><b>Message:</b><br>${(msg || "").replace(/\n/g, "<br>")}</p>`;

    await transporter.sendMail({
      from: `"Bridgr" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    });

    context.res = { status: 200, headers, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    context.log("Mail error:", err);
    context.res = {
      status: 500,
      headers,
      body: JSON.stringify({ error: "Failed to send" }),
    };
  }
};
