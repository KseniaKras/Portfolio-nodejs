const express = require('express')
const nodemailer = require("nodemailer");
const cors = require("cors")
const bodyParser = require('body-parser')

const app = express()

app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

let smtp_login = process.env.SMTP_LOGIN || "--"
let smtp_password = process.env.SMTP_PASSWORD || "--"

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: smtp_login, // generated ethereal user
        pass: smtp_password, // generated ethereal password
    },
    tls: {
        rejectUnauthorized: false
    },
});

app.get('/', function (req, res) {
    res.send('hello world')
})

app.post('/send', async function (req, res) {

    let {name, email, phone, subject, textMessage} = req.body

    let info = await transporter.sendMail({
        from: "My Portfolio Website", // sender address
        to: "ksenia.kras29@gmail.com", // list of receivers
        subject: "Portfolio", // Subject line
        html: `<h3>${subject}</h3>
        <div>From: ${email}</div>
        <div>Name: ${name}</div>
        <div>phone: ${phone}</div>
        <div>${textMessage}</div>
        `,
    });

    res.send("ok")
})

const PORT = process.env.PORT || 5000
const server = app.listen(PORT, () => {
    const port = server.address().port;
    console.log(server.address())
    console.log(`Express is working on port ${port}`);
})

server.on('clientError', (err, socket) => {
    console.error(err);
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});