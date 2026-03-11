// emailService.js
const nodemailer = require("nodemailer");

// Create transporter once
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, // your Gmail
        pass: process.env.EMAIL_PASS, // Gmail App Password
    },
});

/**
 * Send an email with the Stripe portal link
 *
 * @param {string} to - Recipient email
 * @param {string} portalLink - Stripe portal URL
 * @param {string} name - Optional user name
 * @returns {Promise<void>}
 */
const sendPortalEmail = async (to, portalLink, name = "") => {
    const mailOptions = {
        from: `"Gym Team" <${process.env.EMAIL_USER}>`,
        to,
        subject: `Manage your Gym Subscription`,
        html: `
      <p>Hi ${name || ""},</p>
      <p>Click the link below to manage your subscription:</p>
      <a href="${portalLink}">${portalLink}</a>
      <p>Thank you for being part of our gym!</p>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error(`Failed to send email to ${to}`, error);
        throw error;
    }
};

module.exports = { sendPortalEmail };