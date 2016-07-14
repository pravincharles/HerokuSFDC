'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

let idEnquired = false;
app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    
    res.send('Hello world, I am a chat bot')
})

app.get('/fetchAccounts', function (req, res) {
    fetchAccounts(function(returnValue) {
        res.send(returnValue);
    });
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
	 // console.log(req);
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
        let event = req.body.entry[0].messaging[i]
        let sender = event.sender.id
        // console.log(event);
        if (event.message && event.message.text) {
            let text = event.message.text

            // invokeNLP(sender,text);
            // respondToQuery(sender,text);

            if (!isNaN(text)){
                if(idEnquired){

                    fetchAccounts(text,function(returnValue) {
                        idEnquired = false;
                        console.log(returnValue);
                        var obj = JSON.parse(returnValue);
                        var name =  obj.records[0].attributes.Name;
                        // res.send("Hi "+returnValue.record[0].Name);
                        console.log(name);
                        sendButtonEnquiry(name,sender);
                    });

                }
            }
        }

        if (event.postback) {
	        let text = JSON.stringify(event.postback);
	        let payloadData = event.postback.payload;
	        	// sendTextMessage(sender, "You have selected "+text.substring(0, 200), token)

	        if(payloadData == 'BROADBAND_POSTBACK'){
	        	sendTextMessage(sender, "Please enter your Broadband Customer ID", token);
                idEnquired = true;
	        } else if(payloadData == 'POSTPAID_POSTBACK'){
	        	sendTextMessage(sender, "Please enter your MSISDN", token);
                idEnquired = true;
	        } else if(payloadData == 'PLANCHANGE_POSTBACK'){
	        	// sendTextMessage(sender, "Please enter your MSISDN", token)
	        	sendPlanOptionsMessage(sender);
	        }  else if(payloadData == 'SUBSCRIBE_SMART_20'){
	        	sendTextMessage(sender, "Successfully subscribed to Unlimited Smart 20 Plan", token)
	        } else if(payloadData == 'SUBSCRIBE_SMART_25'){
	        	sendTextMessage(sender, "Successfully subscribed to Unlimited Smart 25 Plan", token)
	        } else if(payloadData == 'SUBSCRIBE_SMART_30'){
	        	sendTextMessage(sender, "Successfully subscribed to Unlimited Smart 30 Plan", token)
	        } else if(payloadData == 'SUBSCRIBE_PLATINUM_50'){
	        	sendTextMessage(sender, "Successfully subscribed to Platinum 50 Plan", token)
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

function sendPlanOptionsMessage(sender) {
    let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [
                // {
                //     "title": "Update Details",
                //     "subtitle": "Element #1 of an hscroll",
                //     "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
                //     "buttons": [{
                //         "type": "web_url",
                //         "url": "https://www.messenger.com",
                //         "title": "web url"
                //     }, {
                //         "type": "postback",
                //         "title": "Postback",
                //         "payload": "Payload for first element in a generic bubble",
                //     }],
                // }, 
                {
                    "title": "Unlimited Smart 20",
                    "subtitle": "Montly Subscriptipn: BD 20",
                    // "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
                    "buttons": [{
                        "type": "web_url",
                        "url": "http://www.viva.com.bh/content/viva-unlimited-plans",
                        "title": "Details"
                    },{
                        "type": "postback",
                        "title": "Subscribe",
                        "payload": "SUBSCRIBE_SMART_20",
                    }],
                },
                {
                    "title": "Unlimited Smart 25",
                    "subtitle": "Montly Subscriptipn: BD 25",
                    // "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
                    "buttons": [{
                        "type": "web_url",
                        "url": "http://www.viva.com.bh/content/viva-unlimited-plans",
                        "title": "Details"
                    },{
                        "type": "postback",
                        "title": "Subscribe",
                        "payload": "SUBSCRIBE_SMART_25",
                    }],
                },
                {
                    "title": "Unlimited Smart 30",
                    "subtitle": "Montly Subscriptipn: BD 20",
                    // "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
                    "buttons": [{
                        "type": "web_url",
                        "url": "http://www.viva.com.bh/content/viva-unlimited-plans",
                        "title": "Details"
                    },{
                        "type": "postback",
                        "title": "Subscribe",
                        "payload": "SUBSCRIBE_SMART_30",
                    }],
                },
                {
                    "title": "VIVA Platinum 50",
                    "subtitle": "Montly Subscriptipn: BD 50",
                    // "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
                    "buttons": [{
                        "type": "web_url",
                        "url": "http://www.viva.com.bh/content/viva-platinum-50",
                        "title": "Details"
                    },{
                        "type": "postback",
                        "title": "Subscribe",
                        "payload": "SUBSCRIBE_PLATINUM_50",
                    }],
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

function fetchAccounts(payloadData,callback){

    console.log('fetchAccounts');

    request({
            url: "https://ap1.salesforce.com/services/data/v20.0/query/?q=SELECT id,name,accountnumber from Account+WHERE+accountnumber+=+'"+payloadData+"'",
            method: 'GET',
            headers: {
                'Authorization' : 'Bearer 00D90000000w7KR!AR0AQEsz2S3bKib1bV76cOFYyHV4oVDNeXPBOX1sc0c6_PLgazaPmt63gXpDGinYaskd3kk46l1nKTJmqryC4QZ3ZmNwvXeP',
                'Content-Type'  : 'application/json'
            }
        }, function(error, response, body) {

            console.log('response for fetchAccounts received');
            // console.log(response);
            console.log(body);
            if (error) {
                console.log('Error fetchAccounts : ', error)
                // return error;
                callback(error);
            } else if (response.body.error) {
                console.log('Error: ', response.body.error);
                callback(response.body.error);
                // return response.body.error;
            } else {
                console.log(response.body);
                callback(response.body);
                // sendTextMessage(sender, "Text received, echo: " + response.body)
            }
        })
}

function sendButtonEnquiry(name,sender) {
    let messageData = {
        "attachment":{
          "type":"template",
          "payload":{
            "template_type":"generic",
            "elements":[
              {
                "title":"Postpaid",
                "image_url":"http://www.viva.com.bh/sites/default/files/imagecache/1200x460/slider/2012/05/17/1893_1453802299.jpg",
                "subtitle":"Hi "+name+"!!! Please choose from the following options",
                "buttons":[
                  {
                    "type":"postback",
                    "title":"Enquiry",
                    "payload":"Enquiry_POSTBACK"
                  },
                  {
                    "type":"postback",
                    "title":"Add VAS Pack",
                    "payload":"VAS_POSTBACK"
                  },
                  {
                    "type":"postback",
                    "title":"Change Plan",
                    "payload":"PLANCHANGE_POSTBACK"
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

app.get('/invokeNLP', function (req, res) {
    console.log('invokeNLP request received');
    invokeNLP();
})



