const nodemailer = require('nodemailer');
const env = require('./config');

async function transport(to, subject, text, attachments) {
    const transporter = await nodemailer.createTransport({
        service: env.EMAIL_SERVICE,
        auth: {
            user: env.USER_EMAIL,
            pass: env.USER_PASSWORD,
        },
    });

    return new Promise((resolve, reject) => {
        transporter.sendMail(
            {
                from: env.USER_EMAIL,
                to,
                subject,
                text,
                attachments,
            },
            (err, info) => {
                if (err) reject(err);
                else resolve(info);
            }
        );
    });
}
module.exports = transport;
