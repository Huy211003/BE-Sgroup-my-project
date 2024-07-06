const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database/connection');
require('dotenv').config();

const isUserExist = async (userName, email) => {
    const query = 'SELECT * FROM users WHERE username = ? OR email = ?';
    const [rows] = await db.execute(query, [userName, email]);

    return rows.length > 0;
};

const register = async (userName, passWord, email) => {
    const userExist = await isUserExist(userName, email);
    if (userExist) {
        throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(passWord, 10);
    const query = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';

    await db.execute(query, [userName, hashedPassword, email]);
    return { message: 'User registered successfully' };
}

const login = async (userName, password) => {
    const query = 'SELECT * FROM users WHERE username = ?'
    const [rows] = await db.execute(query, [userName]);

    if (rows.length === 0) {
        throw new Error('User not found');
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Incorrect password');
    }

    const token = jwt.sign({ username: userName, userId: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    return { message: 'User logged in successfully', token };
};


const getAllUsers = async () => {
    const query = 'SELECT * FROM users'
    const [rows] = await db.execute(query);
    return rows
}

module.exports = {
    register,
    login,
    getAllUsers
};