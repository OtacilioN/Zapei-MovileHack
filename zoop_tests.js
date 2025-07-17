// npm install xmlhttprequest
// nvm use 11
/*global btoa*/

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
global.btoa = function (str) {
  return new Buffer.from(str).toString("base64");
};

function get_balance(id, marketplace, user) {
  marketplace =
    typeof marketplace !== "undefined"
      ? marketplace
      : "3249465a7753536b62545a6a684b0000";
  user = typeof user !== "undefined" ? user : "API_ACCESS_KEY";

  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.open(
    "GET",
    "https://api.zoop.ws/v1/marketplaces/" +
      marketplace +
      "/sellers/" +
      id +
      "/balances",
    false
  );
  xhr.setRequestHeader("Authorization", "Basic " + btoa(user + ":"));
  xhr.send(false);

  if (xhr.status >= 200 && xhr.status < 300) {
    return JSON.parse(xhr.responseText);
  }
}

// console.log(get_balance("6ddfc1b3cc2c4922a7a4f21f0818722c"));
