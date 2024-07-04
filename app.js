const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database/connection');
const authRouters = require('./routes/auth.router')

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
// app.use(express.json());
app.use('/auth', authRouters)

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
})