import nodemailer from "nodemailer";

function cleanText(value, maxLength) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function sendJson(res, statusCode, payload) {
  return res.status(statusCode).json(payload);
}

export async function handleEnquiry(req, res) {
  if (req.method !== "POST") {
    return sendJson(res, 405, { success: false, error: "Method not allowed." });
  }

  const gmailUser = process.env.GMAIL_USER?.trim();
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, "");
  const enquiryTo = process.env.ENQUIRY_TO?.trim() || gmailUser;

  if (!gmailUser || !gmailAppPassword || !enquiryTo) {
    return sendJson(res, 503, {
      success: false,
      error: "Email service is not configured. Add GMAIL_USER, GMAIL_APP_PASSWORD and ENQUIRY_TO to your .env file.",
    });
  }

  const body = req.body && typeof req.body === "object" ? req.body : {};

  // Honeypot: bots sometimes fill hidden fields. Silently accept without emailing.
  if (cleanText(body.website, 200)) {
    return sendJson(res, 200, { success: true });
  }

  const name = cleanText(body.name, 100);
  const phone = cleanText(body.phone, 25);
  const course = cleanText(body.course, 120);
  const message = cleanText(body.message, 3000) || "Not provided";

  if (!name || !phone || !course) {
    return sendJson(res, 400, {
      success: false,
      error: "Please enter your name, phone number and interested course.",
    });
  }

  if (!/^[0-9+()\s-]{7,20}$/.test(phone)) {
    return sendJson(res, 400, {
      success: false,
      error: "Please enter a valid phone number.",
    });
  }

  const safeName = name.replace(/[\r\n\t]/g, " ");
  const safePhone = escapeHtml(phone);
  const safeNameHtml = escapeHtml(name);
  const safeCourse = escapeHtml(course);
  const safeMessage = escapeHtml(message).replace(/\r?\n/g, "<br>");

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: gmailUser,
      pass: gmailAppPassword,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });

  try {
    await transporter.sendMail({
      from: `Y.K. Classes Website <${gmailUser}>`,
      to: enquiryTo,
      subject: `New course enquiry from ${safeName}`,
      text: [
        "New enquiry received from the Y.K. Classes website.",
        "",
        `Student name: ${name}`,
        `Phone number: ${phone}`,
        `Interested course: ${course}`,
        `Message: ${message}`,
      ].join("\n"),
      html: `
        <h2>New Y.K. Classes Course Enquiry</h2>
        <table cellpadding="8" cellspacing="0" border="1" style="border-collapse:collapse;border-color:#dddddd;">
          <tr><th align="left">Student name</th><td>${safeNameHtml}</td></tr>
          <tr><th align="left">Phone number</th><td>${safePhone}</td></tr>
          <tr><th align="left">Interested course</th><td>${safeCourse}</td></tr>
          <tr><th align="left">Message</th><td>${safeMessage}</td></tr>
        </table>
      `,
    });

    return sendJson(res, 200, {
      success: true,
      message: "Your enquiry has been sent successfully.",
    });
  } catch (error) {
    // Keep diagnostic details in the server log; do not expose SMTP data to visitors.
    console.error("Enquiry email failed:", {
      code: error.code,
      command: error.command,
      responseCode: error.responseCode,
      message: error.message,
    });

    return sendJson(res, 502, {
      success: false,
      error: "We could not send your enquiry right now. Please try again later or call 9518641228.",
    });
  } finally {
    transporter.close();
  }
}
