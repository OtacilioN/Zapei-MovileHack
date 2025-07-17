// npm install xmlhttprequest
// nvm use 11
/*global btoa*/
// cara rico -> 039662d78b5d45d486a56196037c5213

var user = JSON.stringify({
  owner: {
    first_name: "<first_name>",
    last_name: "<last_name>",
    email: "<e-mail>",
    phone_number: "<phone>",
    taxpayer_id: "270.816.548-86",
  },
  business_name: "<business_name>",
  business_phone: "<business_phone>",
  business_email: "<business_email>",
  business_website: "<business_site>",
  ein: "32.829.382/0001-57",
});

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
global.btoa = function (str) {
  return new Buffer.from(str).toString("base64");
};

// Doesnt work
function add_seller(data, marketplace, authuser) {
  marketplace =
    typeof marketplace !== "undefined"
      ? marketplace
      : "3249465a7753536b62545a6a684b0000";
  authuser = typeof authuser !== "undefined" ? authuser : "API_ACCESS_KEY";

  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.open(
    "POST",
    "https://api.zoop.ws/v1/marketplaces/" +
      marketplace +
      "/sellers/businesses",
    false
  );
  xhr.setRequestHeader("Authorization", "Basic " + btoa(authuser + ":"));
  xhr.send(data);

  if (xhr.status >= 200 && xhr.status < 300) {
    return JSON.parse(xhr.responseText);
  } else {
    console.log(xhr.status);
    return JSON.parse(xhr.responseText);
  }
}

// console.log(add_seller(user));

function list_sellers(marketplace, authuser) {
  marketplace =
    typeof marketplace !== "undefined"
      ? marketplace
      : "3249465a7753536b62545a6a684b0000";
  authuser = typeof authuser !== "undefined" ? authuser : "API_ACCESS_KEY";

  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.open(
    "GET",
    "https://api.zoop.ws/v1/marketplaces/" + marketplace + "/sellers",
    false
  );
  xhr.setRequestHeader("Authorization", "Basic " + btoa(authuser + ":"));
  xhr.send(false);

  if (xhr.status >= 200 && xhr.status < 300) {
    return JSON.parse(xhr.responseText);
  }
}

// console.log(list_sellers());

function list_sellers_names(marketplace, authuser) {
  marketplace =
    typeof marketplace !== "undefined"
      ? marketplace
      : "3249465a7753536b62545a6a684b0000";
  authuser = typeof authuser !== "undefined" ? authuser : "API_ACCESS_KEY";

  var sellers = list_sellers(marketplace, authuser);
  for (var i = 0; i < sellers["items"].length; i++) {
    var fn = sellers["items"][i]["owner"]["first_name"];
    var ln = sellers["items"][i]["owner"]["last_name"];
    var bn = sellers["items"][i]["business_name"];
    console.log(i + "-" + fn + " " + ln + " - " + bn);
  }
}

// console.log(list_sellers_names());

function search_seller_by_name(name, marketplace, authuser) {
  marketplace =
    typeof marketplace !== "undefined"
      ? marketplace
      : "3249465a7753536b62545a6a684b0000";
  authuser = typeof authuser !== "undefined" ? authuser : "API_ACCESS_KEY";
  var sfn = name.split(" ")[0];
  var sln = name.split(" ")[1];

  var sellers = list_sellers(marketplace, authuser);
  for (var i = 0; i < sellers["items"].length; i++) {
    var fn = sellers["items"][i]["owner"]["first_name"];
    var ln = sellers["items"][i]["owner"]["last_name"];
    var bn = sellers["items"][i]["business_name"];
    if (sfn === fn && sln === ln) {
      console.log(i + "-" + fn + " " + ln + " - " + bn);
      return sellers["items"][i];
    }
  }
  return JSON.parse(null);
}

// console.log(search_seller_by_name('Test Seller'));
// console.log(search_seller_by_name('Gabriel Bandeira'));
// console.log(search_seller_by_name('<first_name> <last_name>'));

function search_seller_by_id(seller_id, marketplace, authuser) {
  marketplace =
    typeof marketplace !== "undefined"
      ? marketplace
      : "3249465a7753536b62545a6a684b0000";
  authuser = typeof authuser !== "undefined" ? authuser : "API_ACCESS_KEY";

  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.open(
    "GET",
    "https://api.zoop.ws/v1/marketplaces/" +
      marketplace +
      "/sellers/" +
      seller_id,
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

// console.log(search_seller_by_id("039662d78b5d45d486a56196037c5213"));
// console.log(search_seller_by_id("a4d2b859ea0c4593bd9ce7b996a4ea49"));

function delete_seller_by_id(seller_id, marketplace, authuser) {
  marketplace =
    typeof marketplace !== "undefined"
      ? marketplace
      : "3249465a7753536b62545a6a684b0000";
  authuser = typeof authuser !== "undefined" ? authuser : "API_ACCESS_KEY";

  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.open(
    "DELETE",
    "https://api.zoop.ws/v1/marketplaces/" +
      marketplace +
      "/sellers/" +
      seller_id,
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

// console.log(search_seller_by_id("0190af2f42824770ac89e62ff7062df4"));
// console.log(delete_seller_by_id("0190af2f42824770ac89e62ff7062df4"));
// console.log(search_seller_by_id("0190af2f42824770ac89e62ff7062df4"));

// console.log(search_seller_by_id("039662d78b5d45d486a56196037c5213"));
// console.log(search_seller_by_id("2a61f7069d354f3f8ca2bb16ad417c86"));
// console.log(search_seller_by_id("2eeb62a59ee944d59bc5a7f7087884f7"));

function get_seller_balance(seller_id, marketplace, authuser) {
  marketplace =
    typeof marketplace !== "undefined"
      ? marketplace
      : "3249465a7753536b62545a6a684b0000";
  authuser = typeof authuser !== "undefined" ? authuser : "API_ACCESS_KEY";

  var seller_info = search_seller_by_id(seller_id, marketplace, authuser);
  return seller_info["current_balance"];
}

// console.log(get_seller_balance("039662d78b5d45d486a56196037c5213")); // seller 99720
// console.log(get_seller_balance("2a61f7069d354f3f8ca2bb16ad417c86")); // seller 80
// console.log(get_seller_balance("2eeb62a59ee944d59bc5a7f7087884f7")); // seller 50
