const fs = require("fs");
const path = require("path");
const db = require('../database/connection');

const uploadFile = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: 'Please upload a file' });
        }

        const filePath = path.join(__dirname, '..', 'uploads', file.filename);

        const userId = req.user.userId;
        const query = 'INSERT INTO user_files (user_id, file_name, file_path) VALUES (?, ?, ?)';
        const values = [userId, file.filename, filePath];
        await db.execute(query, values);

        res.status(200).json({ message: 'File uploaded and saved to database successfully', file: file });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server Error' });
    }
}

const uploadMultipleFiles = async (req, res) => {
    try {
        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).json({ message: 'Please upload files' })
        }

        const userId = req.user.userId;
        const promises = files.map(async (file) => {
            const filePath = path.join(__dirname, '..', 'uploads', file.filename);

            const query = 'INSERT INTO user_files (user_id, file_name, file_path) VALUES (?, ?, ?)';
            const values = [userId, file.filename, filePath];
            await db.execute(query, values);
        });
        await Promise.all(promises);
        res.status(200).json({ message: 'Files uploaded successfully ' })
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server Error' });
    }
}
module.exports = {
    uploadFile,
    uploadMultipleFiles,
}