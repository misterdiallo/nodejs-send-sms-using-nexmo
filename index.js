const express = require('express');
// const http = require('http');
// const path = require('path');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const Nexmo = require('nexmo');
const socketio = require('socket.io');
const PORT = process.env.PORT || 3000; // port pour le server
// Initialisation de l'application pour utiliser express
const app = express();
// INIT NeXMO
const nexmo = new Nexmo({
    apiKey: '6d9942c4',
    apiSecret: '01LxrJoizgD5QIJE'
}, { debug: true });
//definir le dossier public 
app.use(express.static(__dirname + '/public'));
// Reglage du template EJS
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);
// Middleware du BodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// LES ROUTES
//index
app.get('/', (req, res) => {
        res.render('index');
    })
    // recuperer la soumission du form
app.post('/', (req, res) => {
    const phone = req.body.phone;
    const msg = req.body.msg;
    nexmo.message.sendSms("Nexmo", phone, msg, {
        type: "unicode"
    }, (err, responseData) => {
        if (err) {
            console.log(err);
        } else {
            if (responseData.messages[0]['status'] === "0") {
                console.log("Message sent successfully.");
            } else {
                console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
            }
            // recuperer la reponse
            const data = {
                id: responseData.messages[0]['message-id'],
                phone: responseData.messages[0]['to']
            };
            // Emettre au client les reponses
            io.emit('smsStatus', data);
        }
    })
});

// Start Server
const server = app.listen(PORT, () => console.log(`Serveur en fonction sur le port: ${PORT} .....`));
// connection au socket.io
const io = socketio(server);
io.on('connection', (socket) => {
    console.log('Connecter au socket');
    io.on('disconnect', () => {
        console.log('Deconnecter au Socket');
    })
});