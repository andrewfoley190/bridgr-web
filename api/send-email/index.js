const { app } = require('@azure/functions');

app.http('send-email', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    try {
      const body = await request.json();
      const { name, email, phone, message } = body;

      // Log the values so you can confirm it's working in Azure logs
      context.log(`Name: ${name}, Email: ${email}, Phone: ${phone}, Message: ${message}`);

      // ---- PLACEHOLDER ----
      // Right now this just returns success.
      // Later, we’ll wire it to an email service (SMTP, SendGrid, etc.)
      return {
        status: 200,
        jsonBody: { success: true, msg: "Form received successfully." }
      };

    } catch (err) {
      context.log.error('Error processing request', err);
      return {
        status: 400,
        jsonBody: { success: false, msg: "Invalid request." }
      };
    }
  }
});
