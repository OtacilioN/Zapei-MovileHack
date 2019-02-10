const axios = require('axios');
const accessKey = 'ak-023453'

const SignIn = async (message, number) => {
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

const Send = async() =>{
    axios.get('https://api.telegram.org/bot646793165:AAEkrhpby9yFrbtbtJ1Agl9anLDXqGu1dtg/sendMessage?chat_id=420728565&text=Voc%C3%AA%20pode%20enviar%20%22gerar%22%20para%20abrir%20sua%20comanda%20ou%20%22pagar%22%20para%20realizar%20uma%20transferasasasasasasasasasasasasasas%C3%AAncia.%20Qual%20a%C3%A7%C3%A3o%20voc%C3%AA%20deseja%20realizar?')
}

Send()