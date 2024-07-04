var mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    authPlugins: {
        mysql_clear_password: () => () => Buffer.from('nguyenhuy2110!!!' + '\0')
    }
}).promise();

db.connect()
    .then(() => {
        console.log("Database connected");
    }
    )
    .catch((err) => {
        console.log("Error connecting to database", err);
    });

module.exports = db;