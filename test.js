const https = require('https');

console.log("ENVIAR:")
https.get('https://api.telegram.org/bot646793165:AAEkrhpby9yFrbtbtJ1Agl9anLDXqGu1dtg/sendMessage?chat_id=420728565&text=Voc%C3%AA%20pode%20enviar%20%22gerar%22%20para%20abrir%20sua%20comanda%20ou%20%22pagar%22%20para%20realizar%20uma%20transfer%C3%AAncia.%20Qual%20a%C3%A7%C3%A3o%20voc%C3%AA%20deseja%20realizar?', (res) => {
    console.log(res)
}).on('error', (e) => {
  console.error(e);
});