//
// # ZAPEI
//
// A Chatbot for P2P and Frictionless Payments
//

//Modules
const express = require("express");
const app = express();
const request = require("request");
const https = require("https");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
let key = "API_ACCESS_KEY";
//qrcodes
const qr = require("qr-image");
const QrCode = require("qrcode-reader");
const Jimp = require("jimp");

//Express Body Parser
var bodyParser = require("body-parser");
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);

//Dialogflow
const dialogflow = require("dialogflow");
const projectId = "zapei-80d3d";
const languageCode = "pt-BR";

//TELEGRAM
let TELEGRAM_TOKEN = "646793165:AAEkrhpby9yFrbtbtJ1Agl9anLDXqGu1dtg";
let URL = "http://api.telegram.org/bot" + TELEGRAM_TOKEN;

//JSON Control File
let fs = require("fs");
let bd_file = "./bd.json";
let bd = require(bd_file);

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
app.use("/public", express.static(__dirname + "/public"));

//Routes
//Webhook for frictionless payments
app.post("/comanda", (req, res) => {
  let body = req.body;
  let value = body.value;
  let id_telegram_to = body.id_to;
  let id_telegram_from = body.id_from;

  let id_pagamento_to = bd[id_telegram_to].id_pagamento;
  let id_pagamento_from = bd[id_telegram_from].id_pagamento;
  let username_to = bd[id_telegram_to].username;
  let number_from = bd[id_telegram_to].numero;

  //Make the payment, send the SMS message and send a telegram message
  transferP2P(id_pagamento_from, id_pagamento_to, value);
  sendMessage(
    id_telegram_from,
    "Você pagou " + String(value) + " para @" + username_to
  );
  sendSMS("Você pagou " + String(value) + " para " + username_to, number_from);
  bd[id_telegram_from].payments.value = 0;
  return res.status(200).send("DONE");
});
//Webhook for payment updates
app.post("/update", (req, res) => {
  let body = req.body;
  let value = body.value;
  let thing = body.name;
  let id_telegram_to = body.id_to;
  let id_telegram_from = body.id_from;

  let id_pagamento_to = bd[id_telegram_to].id_pagamento;
  let id_pagamento_from = bd[id_telegram_from].id_pagamento;
  let username_to = bd[id_telegram_to].username;
  let number_from = bd[id_telegram_to].numero;

  //Make the payment, send the SMS message and send a telegram message
  bd[id_telegram_from].payments.value =
    bd[id_telegram_from].payments.value + value;
  bd[id_telegram_from].payments.place = id_telegram_to;

  sendMessage(
    id_telegram_from,
    "Uma " +
      String(thing) +
      " custando R$" +
      String(value) +
      " foi adicionado à sua comanda."
  );

  return res.status(200).send("DONE");
});

//Webhook for telegram messages
app.post("/", (req, res) => {
  let body = req.body;
  let ID = body.message.from.id; //The Telegram Sender ID
  console.log("ID: " + String(ID));
  if (body.message.text) {
    //TEXT
    let text = body.message.text;
    getDialog(ID, text);
  } else if (body.message.photo) {
    //PHOTO (POTENTIALLY QR)

    //GET RECEIVED PHOTO ID
    var options = {
      method: "GET",
      url: "https://api.telegram.org/bot646793165:AAEkrhpby9yFrbtbtJ1Agl9anLDXqGu1dtg/getFile",
      qs: { file_id: body.message.photo[0].file_id },
      headers: {
        "Postman-Token": "fb1fa06f-a502-4938-ab88-60ff333d2b11",
        "cache-control": "no-cache",
      },
    };

    request(options, function (error, response, body) {
      let url =
        "https://api.telegram.org/file/bot646793165:AAEkrhpby9yFrbtbtJ1Agl9anLDXqGu1dtg/" +
        JSON.parse(response.body).result.file_path;

      //READ THE QR Code
      Jimp.read(url, function (err, image) {
        if (err) {
          console.error(err);
          return true;
        }
        var qr = new QrCode();
        qr.callback = function (err, value) {
          if (err) {
            console.error(err);
            console.log("error qr");
          } else {
            //Make a payment between sender ID and the QRCode ID
            pay(ID, value.result, 10);
          }
        };
        qr.decode(image.bitmap);
      });
    });
  }
  return res.status(200).send("DONE");
});

//Functions

//Get Dialogflow answers
//Receives the sender ID and the text to be processed
async function getDialog(id, text) {
  //Dialogflow Client
  const sessionClient = new dialogflow.SessionsClient();
  const sessionPath = sessionClient.sessionPath(projectId, String(id));

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

  // Send request and get results
  const responses = await sessionClient.detectIntent(dialogflow_request);
  if (responses[0].queryResult.action) {
    //Process any given
    await processAction(
      id,
      responses[0].queryResult.action,
      responses[0].queryResult.parameters,
      responses[0].queryResult
    );
  }

  //Itirate between each response message, sending them accordingly
  for (var i in responses[0].queryResult.fulfillmentMessages) {
    let result = responses[0].queryResult.fulfillmentMessages[i];
    if (result.text && result.platform == "TELEGRAM") {
      await sendMessage(id, result.text.text[0]);
    }
  }
}

//Send a telegram message,
//Receives the sender_id and the text to be sent
async function sendMessage(chat_id, text) {
  var options = {
    method: "GET",
    url: "https://api.telegram.org/bot646793165:AAEkrhpby9yFrbtbtJ1Agl9anLDXqGu1dtg/sendMessage",
    qs: { chat_id: chat_id, text: text },
    headers: {
      "Postman-Token": "fb1fa06f-a502-4938-ab88-60ff333d2b11",
      "cache-control": "no-cache",
    },
  };
  await doGetResponse(options);
}

//Make a Get Request -> Promise
//Receives the request options
async function doGetResponse(options) {
  return new Promise(function (resolve, reject) {
    request(options, function (error, response, body) {
      resolve(body);
    });
  });
}

//Process message actions
//Receives the sender_id, the action to be processed and its parameters
async function processAction(sessionId, action, parameters, queryResult) {
  //Generate a frictionles qrcode
  if (action === "gerarComanda") {
    var qr_png = qr.image(String(sessionId), { type: "png" });
    qr_png.pipe(
      require("fs").createWriteStream("public/" + String(sessionId) + ".png")
    );
    var png_string = qr.imageSync(String(sessionId), { type: "png" });
    let pngurl =
      "https://kkjds-michaelbarneyjunior439169.codeanyapp.com/public/" +
      String(sessionId) +
      ".png";

    //Send it to the senders chat
    var options = {
      method: "GET",
      url: "https://api.telegram.org/bot646793165:AAEkrhpby9yFrbtbtJ1Agl9anLDXqGu1dtg/sendPhoto",
      qs: { chat_id: sessionId, photo: pngurl },
      headers: {
        "Postman-Token": "fb1fa06f-a502-4938-ab88-60ff333d2b11",
        "cache-control": "no-cache",
      },
    };

    await doGetResponse(options);
  }

  //Close the frictionless session
  else if (action === "fecharComanda") {
    let id_telegram_to = bd[sessionId].payments.place;
    if (id_telegram_to && bd[sessionId].payments.value > 0) {
      let id_pagamento_to = bd[id_telegram_to].id_pagamento;
      let id_pagamento_from = bd[sessionId].id_pagamento;
      let username_to = bd[id_telegram_to].username;
      let number_from = bd[id_telegram_to].numero;

      //Make the payment, send the SMS message and send a telegram message
      transferP2P(
        id_pagamento_from,
        id_pagamento_to,
        bd[sessionId].payments.value
      );
      sendMessage(
        sessionId,
        "Você pagou R$" +
          String(parseInt(bd[sessionId].payments.value)) +
          " para " +
          username_to
      );
      sendSMS(
        "Você pagou " +
          String(parseInt(bd[sessionId].payments.value)) +
          " para " +
          username_to,
        number_from
      );
      bd[sessionId].payments.value = 0;
    } else {
      sendMessage(sessionId, "Nenhum valor foi cobrado.");
    }
  }

  //Receie how much oney you have on your wallet
  else if (action == "getSaldo") {
    marketplace =
      typeof marketplace !== "undefined"
        ? marketplace
        : "3249465a7753536b62545a6a684b0000";
    authuser = typeof authuser !== "undefined" ? authuser : "API_ACCESS_KEY";
    let seller_id = bd[sessionId].id_pagamento;
    var seller_info = seeBuyer(seller_id);
    sendMessage(
      sessionId,
      "Seu saldo é: R$" + String(seller_info["current_balance"])
    );
  }

  //Make a P2P payment
  else if (action === "pagamento") {
    console.log("PAGAMENTO");
    var value = 7;
    var name = "";
    if (queryResult.outputContexts[0]) {
      name =
        queryResult.outputContexts[0].parameters.fields["any.original"]
          .stringValue;
      value =
        queryResult.outputContexts[0].parameters.fields["number.original"]
          .stringValue;
    }
    //Get the value and the senders username
    if (parameters.fields.number) {
      value = parameters.fields.number.numberValue;
    }
    if (parameters.fields.any) {
      name = parameters.fields.any.stringValue.replace("@", "");
    }

    //Check if Name was found
    if (bd.hasOwnProperty(name) && name.length > 0 && value) {
      //Get necessary ID's, usernames and phonenumbers from 'Database'
      let id_pagamento_to = bd[name].id_pagamento;
      let id_telegram_to = bd[name].id_telegram;
      let id_pagamento_from = bd[sessionId].id_pagamento;
      let username_from = bd[sessionId].username;
      let number_to = bd[id_telegram_to].numero;

      //Make the payment, send the SMS message and send a telegram message
      transferP2P(id_pagamento_from, id_pagamento_to, value);
      sendMessage(
        id_telegram_to,
        "Você recebeu " + String(value) + " reais de @" + username_from
      );
      sendSMS(
        "Você recebeu " + String(value) + " reais de " + username_from,
        number_to
      );
    }
  }
}

//Make a QR Code payment
function pay(from_id, to_id, value) {
  let id_pagamento_from = bd[from_id].id_pagamento;
  let id_pagamento_to = bd[to_id].id_pagamento;
  let username_from = bd[from_id].username;
  let number_to = bd[to_id].numero;
  transferP2P(id_pagamento_from, id_pagamento_to, value);
  sendMessage(
    to_id,
    "Você recebeu " + String(value) + " reais de @" + username_from
  );
  sendSMS(
    "Você recebeu " + String(value) + " reais de " + username_from,
    number_to
  );
}

//Make a simple P2P payment
global.btoa = function (str) {
  return new Buffer.from(str).toString("base64");
};
function transferP2P(owner, receiver, value) {
  // https://www.haykranen.nl/2011/06/21/basic-http-authentication-in-node-js-using-the-request-module/
  var marketplace = "3249465a7753536b62545a6a684b0000";
  var key = "API_ACCESS_KEY:";

  var request = require("request");
  var auth = "Basic " + btoa(key);
  // var auth = "Basic " + new Buffer("API_ACCESS_KEY:").toString("base64");

  var options = {
    method: "POST",
    url:
      "https://api.zoop.ws/v2/marketplaces/" +
      marketplace +
      "/transfers/" +
      owner +
      "/to/" +
      receiver,
    body: { amount: value * 100 },
    json: true,
    headers: { Authorization: auth },
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
  });
}

//Send confirmation SMS
const axios = require("axios");
const accessKey = "ak-023453";
async function sendSMS(message, number) {
  const data = {
    to: number,
    message: message,
  };
  try {
    const response = await axios.post(
      "http://messaging-api.wavy.global:8080/v1/sms/send",
      data,
      {
        headers: {
          "Access-key": accessKey,
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
}

//Receive credit from buyer, if not a buyer get as seller.
function seeBuyer(buyer_id) {
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.open(
    "GET",
    "https://api.zoop.ws/v1/marketplaces/" +
      marketplace +
      "/buyers/" +
      buyer_id,
    false,
    key
  );
  xhr.send(false);

  if (xhr.status >= 200 && xhr.status < 300) {
    return JSON.parse(xhr.responseText);
  } else {
    console.log(xhr.status);
    //return JSON.parse(xhr.responseText);
    return seeSeller(buyer_id);
  }
}
function seeSeller(buyer_id) {
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.open(
    "GET",
    "https://api.zoop.ws/v1/marketplaces/" +
      marketplace +
      "/sellers/" +
      buyer_id,
    false,
    key
  );
  xhr.send(false);

  if (xhr.status >= 200 && xhr.status < 300) {
    return JSON.parse(xhr.responseText);
  } else {
    console.log(xhr.status);
    return JSON.parse(xhr.responseText);
  }
}

/***************USEFULL SNIPPETS*********************/
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
