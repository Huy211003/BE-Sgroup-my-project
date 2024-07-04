const mailService = require('../services/mail.services')

const sendResetPasswordEmail = async (req, res) => {
    try {
        const { emailFrom, emailTo, emailSubject, emailText } = req.body;
        await mailService.sendEmail({ emailFrom, emailTo, emailSubject, emailText });
        return res.status(200).json({ message: 'reset password email sent successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'error' });

    }
}

module.exports = {
    sendResetPasswordEmail,
}