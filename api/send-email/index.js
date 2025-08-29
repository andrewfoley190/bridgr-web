// /api/send-email/index.js
const nodemailer = require("nodemailer");

module.exports = async function (context, req) {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // Preflight
  if (req.method === "OPTIONS") {
    context.res = { status: 204, headers };
    return;
  }

  try {
    const body = req.body || {};
    const { name, email, phone, msg, message } = body; // support msg or message
    const text = msg || message;

    if (!name || !email || !text) {
      context.res = {
        status: 400,
        headers,
        body: JSON.stringify({ error: "Missing required fields (name, email, message)" }),
      };
      return;
    }

    // SMTP transport using env vars you added in Azure
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false, // true if you use port 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mail = {
      from: `"Bridgr Website" <${process.env.SMTP_USER}>`,
      to: process.env.TO_EMAIL, // where YOU receive it
      subject: "New Bridgr Quote Request",
      text:
`Name: ${name}
Email: ${email}
Phone: ${phone || "Not provided"}

Message:
${text}`,
      // (optional) nice-looking HTML version
      html: `
        <h2>New Bridgr Quote Request</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone || "Not provided"}</p>
        <p><b>Message:</b></p>
        <pre>${text}</pre>
      `,
    };

    await transporter.sendMail(mail);

    context.res = {
      status: 200,
      headers,
      body: JSON.stringify({ ok: true }),
    };
  } catch (err) {
    context.log("send-email error:", err);
    context.res = {
      status: 500,
      headers,
      body: JSON.stringify({ error: "Failed to send email" }),
    };
  }
};
