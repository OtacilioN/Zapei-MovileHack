let marketplace = "3249465a7753536b62545a6a684b0000";
let key = "API_ACCESS_KEY";

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
global.btoa = function (str) {
  return new Buffer.from(str).toString("base64");
};

function listBuyers() {
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.open(
    "GET",
    "https://api.zoop.ws/v1/marketplaces/" + marketplace + "/buyers",
    false,
    key
  );
  xhr.send(false);

  if (xhr.status >= 200 && xhr.status < 300) {
    return JSON.parse(xhr.responseText);
  }
}

let buyer_id_test = "7e777690053d45bcba63ce76983409e7";

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
    return JSON.parse(xhr.responseText);
  }
}

function deleteBuyer(buyer_id) {
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.open(
    "DELETE",
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
  }
}

function searchBuyersByName(name) {
  var sfn = name.split(" ")[0].toLowerCase();
  var sln = name.split(" ")[1].toLowerCase();

  var buyers = listBuyers();
  for (var i = 0; i < buyers["items"].length; i++) {
    var fn = buyers["items"][i]["first_name"];
    var ln = buyers["items"][i]["last_name"];

    if (fn != null && ln != null) {
      if (sfn === fn.toLowerCase() && sln === ln.toLowerCase()) {
        console.log(i + "-" + fn + " " + ln);
        return buyers["items"][i]["id"];
      }
    }
  }
  return "não encontrado";
}

// console.log(listBuyers())
//console.log(deleteBuyer(buyer_id_test))
//console.log(seeBuyer(buyer_id_test))
//console.log(searchBuyersByName('alberto miranda'))
//console.log(seeBuyer("039662d78b5d45d486a56196037c5213"));

function get_seller_balance(seller_id, marketplace, authuser) {
  marketplace =
    typeof marketplace !== "undefined"
      ? marketplace
      : "3249465a7753536b62545a6a684b0000";
  authuser = typeof authuser !== "undefined" ? authuser : "API_ACCESS_KEY";

  var seller_info = seeBuyer(seller_id);
  return seller_info["current_balance"];
}

// console.log(get_seller_balance("3ffe8e0226e4413a82e0bfaf5c9df243")); // buyer 50
// console.log(get_seller_balance("a594d1ca98824957b529fadb54e8a1c4")); // buyer 50
// console.log(get_seller_balance("d60df38d60b44d5f8754374bdb4f554f")); // buyer 50
