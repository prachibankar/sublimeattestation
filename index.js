const express = require('express')
const app = express();
const port = 8000;
var fs = require("fs");
var nodemailer = require('nodemailer');

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// custom middleware to log data access
const log = function(request, response, next) {
    console.log(`${new Date()}: ${request.protocol}://${request.get('host')}${request.originalUrl}`);
    console.log(request.body); // make sure JSON middleware is loaded before this line
    next();
}

app.use(log);

app.get('/', (req, response) => {
    response.render('index', { page: 'index' })
});

app.get('/visa', (req, response) => {
    response.render('visa', { page: 'visa' })
});

app.get('/contact-us', (req, response) => {
    response.render('contact-us', { page: 'contact-us' })
});

app.get('/apostille', (req, response) => {
    response.render('apostille', { page: 'apostille' })
});

app.get('/attestation', (req, response) => {
    response.render('attestation', { page: 'attestation' })
});

app.get('/embassy-attestation', (req, response) => {
    response.render('embassy-attestation', { page: 'embassy-attestation' })
});

app.get('/hrd-attestation', (req, response) => {
    response.render('hrd-attestation', { page: 'hrd-attestation' })
});

app.get('/translation-services', (req, response) => {
    response.render('translation-services', { page: 'translation-services' })
});

app.post("/ajax/email", function(request, response) {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        service: 'Gmail',
        auth: {
            user: "prachibankarofficial@gmail.com", // this should be YOUR GMAIL account
            pass: "Freelancer@29" // this should be your password
        }
    });

    var textBody = `FROM: ${request.body.name} EMAIL: ${request.body.email} MESSAGE: ${request.body.message}`;
    var htmlBody = `<h2>Mail From Contact Form</h2><p>from: ${request.body.name} <a href="mailto:${request.body.email}">${request.body.email}</a></p><p>${request.body.message}</p>`;

    var mail = {
        from: request.body.email, // sender address
        to: "prachibankarofficial@gmail.com", // list of receivers (THIS COULD BE A DIFFERENT ADDRESS or ADDRESSES SEPARATED BY COMMAS)
        subject: "Mail From Contact Form", // Subject line
        text: textBody,
        html: htmlBody
    };

    // send mail with defined transport object
    transporter.sendMail(mail, function(err, info) {
        if (err) {
            console.log(err);
            response.json({ message: "message not sent: an error occured; check the server's console log" });
        } else {
            response.json({ message: `message sent: ${info.messageId}` });
        }
    });
});

app.listen(process.env.PORT || port, () => {
    console.log(`Example app listening on port ${port}!`)
});