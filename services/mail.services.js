const nodemailer = require('nodemailer')

const mailService = {
    async sendEmail({ emailFrom, emailTo, emailSubject, emailText }) {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            // host: 'smtp.ethereal.email',
            // port: 587,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            },
        });
        await transporter.sendMail({
            from: emailFrom,
            to: emailTo,
            subject: emailSubject,
            text: emailText
        });
    },

};

Object.freeze(mailService);

module.exports = mailService;