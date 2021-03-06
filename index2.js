'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
})

// for Facebook verification
// app.get('/webhook/', function (req, res) {
//     if (req.query['hub.verify_token'] === 'wipro@123') {
//         res.send(req.query['hub.challenge'])
//     }
//     res.send('Error, wrong token')
// })

app.get('/invokesiebel', function (req, res) {
    // if (req.query['hub.verify_token'] === 'wipro@123') {
    //     res.send(req.query['hub.challenge'])
    // }
    // res.send('Error, wrong token')
    console.log('request received');
    invokeSiebel();
})

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})

// app.post('/webhook/', function (req, res) {
// 	 console.log(req);
//     let messaging_events = req.body.entry[0].messaging
//     for (let i = 0; i < messaging_events.length; i++) {
//         let event = req.body.entry[0].messaging[i]
//         let sender = event.sender.id
//         if (event.message && event.message.text) {
//             let text = event.message.text

//             invokeSiebel().then(function(response){
//             	console.log(response);

//             	sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))

//             })
//         }
//     }
//     res.sendStatus(200)
// })

const token = "EAAY21jTlydwBANnHA1yuvjFZCFhVoHTiUDYL3ckCbZAgpiriXq8cyZBfQgshtLdWWhZABuv2meH5adc2iqnzUyhpy7afdhgEBA2ek48iVOsizhWrUItM4oi0njezDBRMOUdgvPHDfmVZBdP4Q54zt6hSa3rMYIIrDB2ZASeR7jW4rW2ylaVPXu";

function sendTextMessage(sender, text) {
    let messageData = { text:text }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}


function invokeSiebel(){
    console.log('invokeSiebel');

request({
        url: 'http://10.179.7.7/OpenNLPRest/nlpdetect',
        // qs: {access_token:token},
        method: 'GET',
        // json: {
        //     recipient: {id:sender},
        //     message: messageData,
        // },
        headers : {
        	'input' : 'What is the status of order number 1 hyphen 12345'
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })

}



