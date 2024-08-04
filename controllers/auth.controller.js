const authService = require('../services/auth.services');
const middleware = require('../middleware/auth');
const db = require('../database/connection');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const mailService = require('../services/mail.services');

const USERNAME_REGEX = /^[a-zA-Z0-9_-]+$/;

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

const validatePassword = (password) => {
    return password.length >= 6;
}

const register = async (req, res) => {
    const { username, password, email } = req.body;

    if (!email || !username || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    if (!validatePassword(password)) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' })
    }

    if (!validateEmail(email)) {
        return res.status(400).json({ message: 'Email is invalid' })
    }

    if (!USERNAME_REGEX.test(username)) {
        return res.status(400).json({ message: 'Username must contain only letters, numbers, underscores, and dashes' });
    }

    try {
        const result = await authService.register(username, password, email);
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ err: err.message });
    }
}

const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    try {
        const result = await authService.login(username, password);
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ err: err.message });
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await authService.getAllUsers();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
}

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    if (!validateEmail(email)) {
        return res.status(400).json({ message: 'Email is invalid' });
    }

    try {
        const [user] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (user.length === 0) {
            return res.status(400).json({ message: 'Email not found' });
        }

        // const token = crypto.randomBytes(20).toString('hex');
        const otp = crypto.randomInt(100000, 999999).toString();
        const expiration = new Date(Date.now() + 10 * 60 * 1000);

        // await db.execute('UPDATE users SET passwordResetToken = ?, passwordResetExpiration = ? WHERE email = ? ', [token, expiration, email]);
        await db.execute('UPDATE users SET passwordResetToken = ?, passwordResetExpiration = ? WHERE email = ? ', [otp, expiration, email]);

        await mailService.sendEmail({
            emailFrom: process.env.SMTP_USER,
            emailTo: email,
            emailSubject: 'Reset password',
            // emailText: `You requested a password reset. Use this token to reset your password: ${token}`
            emailText: `You requested a password reset. Use this OTP to reset your password: ${otp}`
        })

        res.status(200).json({ message: 'Reset password email sent successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const resetPassword = async (req, res) => {
    const { email, passwordResetToken, newPassword } = req.body;

    if (!email || !passwordResetToken || !newPassword) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (!validateEmail(email)) {
        return res.status(400).json({ message: 'Email is invalid' });
    }

    if (!validatePassword(newPassword)) {
        return res.status(400).json({ message: 'New password must be at least 6 characters long' })
    }

    try {
        const [user] = await db.execute('SELECT * FROM users WHERE email = ? AND passwordResetToken = ?', [email, passwordResetToken]);
        if (user.length === 0 || (user.length > 0 && user[0].passwordResetExpiration < new Date())) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.execute('UPDATE users SET  password = ?, passwordResetToken = NULL, passwordResetExpiration = NULL WHERE email = ?', [hashedPassword, email]);

        res.status(200).json({ message: 'Password reset successfully' })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    register,
    login,
    getAllUsers,
    forgotPassword,
    resetPassword,
}