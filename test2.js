var request = require("request");

var options = { method: 'GET',
  url: 'https://api.telegram.org/bot646793165:AAEkrhpby9yFrbtbtJ1Agl9anLDXqGu1dtg/sendMessage',
  qs: 
   { chat_id: '420728565',
     text: 'Voc%C3%AA%20pode%20enviar%20%22gerar%22%20para%20abrir%20sua%20comanda%20ou%20%22pagar%22%20para%20realizar%20uma%20transfer%C3%AAncia.%20Qual%20a%C3%A7%C3%A3o%20voc%C3%AA%20deseja%20realizar?' },
  headers: 
   { 'Postman-Token': 'fb1fa06f-a502-4938-ab88-60ff333d2b11',
     'cache-control': 'no-cache' } };

console.log("run");
request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
