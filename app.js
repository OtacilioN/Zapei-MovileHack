//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
const express = require('express');
const app = express();
const request = require('request');
const dialogflow = require('dialogflow');
const https = require('https');

//qrcodes
const qr = require('qr-image');
const QrCode = require('qrcode-reader');
const Jimp = require('jimp');

//Express Body Parser
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

//Dialogflow
const projectId = 'zapei-80d3d';
const languageCode = 'pt-BR';

//TELEGRAM
let TELEGRAM_TOKEN = "646793165:AAEkrhpby9yFrbtbtJ1Agl9anLDXqGu1dtg"
let URL = "http://api.telegram.org/bot" + TELEGRAM_TOKEN

//JSON Control Files
let fs = require('fs');
let bd_file = './bd.json';
let bd = require(bd_file);

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = 3000; 

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

app.use('/public', express.static(__dirname + '/public'));


//Routes
app.post('/', (req, res) => {
  let body = req.body;
  console.log(body)
   let ID = body.message.from.id;

  if (body.message.text){
    let text = body.message.text
    getDialog(body.message.from.id, text);
  }
  else if (body.message.photo){
    console.log(body.message.photo);
    console.log("OI");
    console.log(body.message.photo[0].file_id)

    var options = { method: 'GET',
    url: 'https://api.telegram.org/bot646793165:AAEkrhpby9yFrbtbtJ1Agl9anLDXqGu1dtg/getFile',
    qs: 
     { 'file_id' : body.message.photo[0].file_id},
    headers: 
     { 'Postman-Token': 'fb1fa06f-a502-4938-ab88-60ff333d2b11',
       'cache-control': 'no-cache' } };

    request(options, function (error, response, body) {
      console.log("midle - photo");
      console.log(JSON.parse(response.body).result.file_path);
      let url = "https://api.telegram.org/file/bot646793165:AAEkrhpby9yFrbtbtJ1Agl9anLDXqGu1dtg/" + JSON.parse(response.body).result.file_path
      console.log(url);
      Jimp.read(url, function(err, image) {
        if (err) {
            console.error(err);
            console.log("error img");
            return true;
        }
        console.log("GO!");
        var qr = new QrCode();
        qr.callback = function(err, value) {
            if (err) {
                console.error(err);
                console.log("error qr");
            } 
            else {
                console.log(value.result);
              console.log("UOU");
              console.log(ID);
                pay(ID, value.result, 10);
                
            }
        }
        qr.decode(image.bitmap);
      });
    }); 
  }
  return res.status(200).send("DONE");
});

//Functions
async function getDialog(id, text){
    console.log("Session ID: " + String(id));
    const sessionClient = new dialogflow.SessionsClient();
    console.log("a");
    const sessionPath = sessionClient.sessionPath(projectId, String(id));
    console.log("b");
    // The text query request.
    const dialogflow_request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: text,
          languageCode: languageCode,
        },
      },
    };
    console.log("c");

    // Send request and log result
    console.log("asked for dialog");
    const responses = await sessionClient.detectIntent(dialogflow_request);
    console.log("dialog received");
    console.log(responses);
    console.log("changed lala");
    console.log(responses);
     console.log("222");
    if (responses[0].queryResult.action){
      console.log("aaaaaa");
      await processAction(id, responses[0].queryResult.action, responses[0].queryResult.parameters)
    }
  
    for (var i in responses[0].queryResult.fulfillmentMessages) {
        let result = responses[0].queryResult.fulfillmentMessages[i];
        console.log(result);
        if (result.text && result.platform == "TELEGRAM"){
            console.log("TEXT");
            console.log(result.text);
            await sendMessage(id, result.text.text[0]);
        }
    }
}
async function sendMessage(chat_id, text){
    let url = URL + "/sendMessage?chat_id=" + chat_id + "&text=" + text
    var encoded_url = encodeURI(url);
    console.log(encoded_url);
    
    var options = { method: 'GET',
      url: 'https://api.telegram.org/bot646793165:AAEkrhpby9yFrbtbtJ1Agl9anLDXqGu1dtg/sendMessage',
      qs: 
       { chat_id: chat_id,
         text: text },
      headers: 
       { 'Postman-Token': 'fb1fa06f-a502-4938-ab88-60ff333d2b11',
         'cache-control': 'no-cache' } };

    console.log("run");
    await doGetResponse(options);
    console.log("ended");
}

async function doGetResponse(options){
  return new Promise(function (resolve, reject) {
      request(options, function (error, response, body) {
         resolve(body);
        console.log("midle");
      });
    });
}

async function processAction(sessionId, action, parameters){
  console.log("ACTIONN");
  if (action === "gerarComanda"){
    console.log("GERAR COMANDA");
    var qr_png = qr.image(String(sessionId), { type: 'png' });
    qr_png.pipe(require('fs').createWriteStream('public/' + String(sessionId) +'.png'));
    var png_string = qr.imageSync(String(sessionId), { type: 'png' });
    
    let pngurl = "https://kkjds-michaelbarneyjunior439169.codeanyapp.com/public/"+String(sessionId)+".png"
    console.log(pngurl);
    var options = { method: 'GET',
      url: 'https://api.telegram.org/bot646793165:AAEkrhpby9yFrbtbtJ1Agl9anLDXqGu1dtg/sendPhoto',
      qs: 
       { chat_id: sessionId,
         photo: pngurl },
      headers: 
       { 'Postman-Token': 'fb1fa06f-a502-4938-ab88-60ff333d2b11',
         'cache-control': 'no-cache' } };

    console.log("run");
    await doGetResponse(options);
    console.log("ended");
  }
  else if (action === "pagamento"){
    console.log("PAGAMENTO!");
    var value = 7;
    var name = ""
    console.log(parameters);
    if (parameters.fields.number){
      value = parameters.fields.number.numberValue;
      console.log("value")
    }
    if (parameters.fields.any){
       console.log("any");
       name = parameters.fields.any.stringValue.replace("@", "");;
    }
    console.log(value);
    console.log(name);
    console.log(bd);
    if (bd.hasOwnProperty(name)){
      console.log("TEEEEMM");
      let id_pagamento_to = bd[name].id_pagamento;
      let id_telegram_to = bd[name].id_telegram;
      
      console.log(id_pagamento_to);
      console.log(id_telegram_to);
      
      let id_pagamento_from = bd[sessionId].id_pagamento;
      let username_from = bd[sessionId].username;
      console.log(id_pagamento_from);
      let number_to = bd[id_telegram_to].numero;
      
      transferP2P(id_pagamento_from, id_pagamento_to, value);
      sendMessage(id_telegram_to, "Você recebeu " + String(value) + " reais de " + username_from);
      sendSMS("Você recebeu " + String(value) + " reais de " + username_from, number_to);
    }
    else{
      console.log("NAO TEEM");
    }
    
    //FAZER O PAGAMENTO
  }
}


//PAGAMENTO
function pay(from_id, to_id, value){
  console.log("PAY");
  let id_pagamento_from = bd[from_id].id_pagamento;
  let id_pagamento_to = bd[to_id].id_pagamento;
  let username_from = bd[from_id].username;
  let number_to = bd[to_id].numero;
  transferP2P(id_pagamento_from, id_pagamento_to, value);
  sendMessage(to_id, "Você recebeu " + String(value) + " reais de " + username_from);
  sendSMS("Você recebeu " + String(value) + " reais de " + username_from, number_to);
}

global.btoa = function (str) {return new Buffer.from(str).toString('base64');};
function transferP2P(owner, receiver, value){
  // https://www.haykranen.nl/2011/06/21/basic-http-authentication-in-node-js-using-the-request-module/
  var marketplace = "3249465a7753536b62545a6a684b0000";
  var key = "zpk_test_EzCkzFFKibGQU6HFq7EYVuxI:";

  var request = require("request");
  var auth = "Basic " + btoa(key);
  // var auth = "Basic " + new Buffer("zpk_test_EzCkzFFKibGQU6HFq7EYVuxI:").toString("base64");
  
  var options = { method: 'POST',
    url: 'https://api.zoop.ws/v2/marketplaces/' + marketplace + '/transfers/' + owner + '/to/' + receiver,
    body: { amount: value },
    json: true,
    headers: {"Authorization": auth}};
  
  request(options, function (error, response, body) {
    if (error) throw new Error(error);
  
    console.log(body);
  });
}


//SMS
const axios = require('axios');
const accessKey = 'ak-023453';

async function sendSMS(message, number){
    const data = {
        to: number,
        message: message
    }
    try{
        const response = await axios.post('http://messaging-api.wavy.global:8080/v1/sms/send', data, {
            headers: {
                'Access-key': accessKey,
                'Content-Type': 'application/json'
            }
        })  
        console.log(response)
        return response;
    }catch(error){
        console.log(error)
        return error;
    }
}


// let de = '039662d78b5d45d486a56196037c5213';
// let para = '3ffe8e0226e4413a82e0bfaf5c9df243'
// let para2 = 'a594d1ca98824957b529fadb54e8a1c4'
// let para3 = 'd60df38d60b44d5f8754374bdb4f554f'
// let valor = 5000;
// console.log(transferP2P(de, para, valor))
// console.log(transferP2P(de, para2, valor))
// console.log(transferP2P(de, para3, valor))



//https://api.telegram.org/bot646793165:AAEkrhpby9yFrbtbtJ1Agl9anLDXqGu1dtg/setWebhook?url=https://kkjds-michaelbarneyjunior439169.codeanyapp.com/
//https://api.telegram.org/bot646793165:AAEkrhpby9yFrbtbtJ1Agl9anLDXqGu1dtg/deleteWebhook
//https://api.telegram.org/bot646793165:AAEkrhpby9yFrbtbtJ1Agl9anLDXqGu1dtg/getWebhookInfo

//export GOOGLE_APPLICATION_CREDENTIALS = "zapei.json"

// nvm use 11
// export GOOGLE_APPLICATION_CREDENTIALS="zapei.json"
// npm start
