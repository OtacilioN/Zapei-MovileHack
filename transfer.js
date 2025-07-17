// npm install xmlhttprequest
// nvm use 11
/*global btoa*/

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
global.btoa = function (str) {
  return new Buffer.from(str).toString("base64");
};

function list_transactions(marketplace, authuser) {
  marketplace =
    typeof marketplace !== "undefined"
      ? marketplace
      : "3249465a7753536b62545a6a684b0000";
  authuser = typeof authuser !== "undefined" ? authuser : "API_ACCESS_KEY";

  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.open(
    "GET",
    "https://api.zoop.ws/v1/marketplaces/" + marketplace + "/transactions",
    false
  );
  xhr.setRequestHeader("Authorization", "Basic " + btoa(authuser + ":"));
  xhr.send(false);

  if (xhr.status >= 200 && xhr.status < 300) {
    return JSON.parse(xhr.responseText);
  } else {
    console.log(xhr.status);
    return JSON.parse(xhr.responseText);
  }
}

// console.log(list_transactions());

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
    body: { amount: value },
    json: true,
    headers: { Authorization: auth },
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);

    console.log(body);
  });
}

// let de = '039662d78b5d45d486a56196037c5213';
// let para = '3ffe8e0226e4413a82e0bfaf5c9df243'
// let para2 = 'a594d1ca98824957b529fadb54e8a1c4'
// let para3 = 'd60df38d60b44d5f8754374bdb4f554f'
// let valor = 5000;
// console.log(transferP2P(de, para, valor))
// console.log(transferP2P(de, para2, valor))
// console.log(transferP2P(de, para3, valor))
