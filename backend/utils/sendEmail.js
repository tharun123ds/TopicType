const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, text, html }) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            secure: process.env.NODE_ENV === 'production',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"Topic-Type 🚀" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html,
            headers: {
                'X-Priority': '1 (Highest)',
                'X-Mailer': 'NodeMailer',
            },
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`📧 Email sent to ${to} (MessageId: ${info.messageId})`);
    } catch (err) {
        console.error('❌ Failed to send email:', err);
        throw new Error('Email could not be sent');
    }
};

module.exports = sendEmail;
