const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database/connection');
const authRouters = require('./routes/auth.router')
const uploadFileRouters = require('./routes/uploadfile.router')
const pollRoutes = require('./routes/poll.routes')

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.send('Hello !!!!');
})

app.use(bodyParser.json());
// app.use(express.json());
app.use('/api/auth', authRouters)
app.use('/api/upload', uploadFileRouters)
app.use('/api/polls/', pollRoutes)

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
})