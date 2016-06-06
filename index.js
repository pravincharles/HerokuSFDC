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
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'wipro@123') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})

app.post('/webhook/', function (req, res) {
	 console.log(req);
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
        let event = req.body.entry[0].messaging[i]
        let sender = event.sender.id
        // console.log(event);
        if (event.message && event.message.text) {
            let text = event.message.text

            // invokeNLP(sender,text);
            // respondToQuery(sender,text);
            sendButtonEnquiry(sender);
        }

        if (event.postback) {
	        let text = JSON.stringify(event.postback);
	        let payloadData = event.postback.payload;
	        	sendTextMessage(sender, "You have selected "+text.substring(0, 200), token)

	        if(payloadData == 'BROADBAND_POSTBACK'){
	        	sendTextMessage(sender, "Please enter your Broadband Customer ID", token)

	        } else if(payloadData == 'PREPAID_POSTBACK'){
	        	sendTextMessage(sender, "Please enter your MSISDN.", token)
	        }
	        continue
	      }
    }
    res.sendStatus(200)
})

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

function sendGenericMessage(sender) {
    let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Update Details",
                    "subtitle": "Element #1 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://www.messenger.com",
                        "title": "web url"
                    }, {
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for first element in a generic bubble",
                    }],
                }, {
                    "title": "Prepaid",
                    "subtitle": "Element #2 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
                    "buttons": [{
                        "type": "postback",
                        "title": "Add VAS Pack",
                        "payload": "Add VAS Pack",
                    }],
                }]
            }
        }
    }
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

function sendButtonEnquiry(sender) {
    let messageData = {
        "attachment":{
          "type":"template",
          "payload":{
            "template_type":"generic",
            "elements":[
              {
                "title":"Welcome to VIVA Bahrain",
                "image_url":"http://www.viva.com.bh/sites/default/files/viva_responsive_logo.png",
                "subtitle":"Leaders in Enterprise and Retail Telecom",
                "buttons":[
                  {
                    "type":"postback",
                    "title":"Broadband Customer",
                    "payload":"BROADBAND_POSTBACK"
                  },
                  {
                    "type":"postback",
                    "title":"Prepaid Customer",
                    "payload":"PREPAID_POSTBACK"
                  },
                  {
                    "type":"postback",
                    "title":"Postpaid Customer",
                    "payload":"POSTPAID_POSTBACK"
                  }
                ]
              }
            ]
          }
        }
    }
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


function invokeNLP(sender,text){

console.log('invokeNLP');

request({
        url: 'https://hidden-tor-43850.herokuapp.com/nlpdetect',
        method: 'GET',
        headers: {
        	'input' : text
        }
    }, function(error, response, body) {

    	console.log('response for nlp call received');
    	console.log(response);
    	console.log(body);
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        } else {
      		sendTextMessage(sender, "Text received, echo: " + response.body)
        }
    })

}

function respondToQuery(sender,text){

	if(text== 'Hi' || text== 'Hello'){
		sendTextMessage(sender,'How May I Help You?');
		// greetingMessage(sender);
	} else if (text.indexOf('order')> -1){
		sendGenericMessage(sender);
	}
}

// app.get('/invokeNLP/', function (req, res) {
//     console.log('request received');
//     invokeNLP();
// })



