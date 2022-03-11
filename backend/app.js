const dotenv = require('dotenv');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')

dotenv.config({ path: './config.env' })

require("./db/conn");
// const User = require('./model/userSchema');

app.use(express.json())
app.use(cookieParser())
app.use(require('./router/auth'));

app.listen(process.env.PORT, () => {
    console.log(`SERVER IS RUNNING AT PORT NO ${process.env.PORT}`);
})

// app.get('/', (req, res) => {
//     res.send('Hello ExpressJs ! :)')
// })

// app.get('/about', middleware, (req, res) => {
//     res.send('About Page')
// })