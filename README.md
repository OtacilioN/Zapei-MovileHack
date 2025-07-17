# ![Zapei](https://github.com/OtacilioN/MovileHack/blob/master/zapei-icon.png)

**Zapei** é uma carteira digital disruptiva que transforma a forma como pagamentos são realizados no Brasil, integrando a simplicidade dos meios digitais com a familiaridade dos aplicativos de mensagem.

---

## 🚀 O que é o Zapei?

Zapei é uma **carteira virtual acessível via WhatsApp**, pensada para consumidores que ainda não estão plenamente inseridos no ecossistema digital. Por meio de uma interface conversacional, o usuário pode:

- Realizar **depósitos via boleto bancário** ou comprar créditos em **bancas de jornal e estabelecimentos parceiros**.
- Efetuar **transferências para outros usuários** ou **pagamentos em estabelecimentos físicos**, diretamente pelo chat com o bot.
- Após ganhar confiança na plataforma, é possível **cadastrar um cartão de crédito** e realizar pagamentos diretamente com ele.

---

## 💬 Como funciona

### Transferência entre usuários

- O usuário inicia uma conversa com o bot.
- Informa o valor e o apelido do destinatário.
- O bot realiza a transferência automaticamente.

### Pagamentos em estabelecimentos

1. O cliente envia uma mensagem para **abrir uma comanda**.
2. O bot retorna um **QR Code**.
3. O atendente escaneia o código com o app do Zapei e lança os pedidos na comanda do cliente.
4. O cliente acompanha os pedidos em tempo real via chat.
5. Ao final, o valor total é transferido automaticamente da carteira do cliente para o estabelecimento.

Sem filas. Sem espera.

---

## 👨‍💻 Time de Desenvolvimento

- [Gabriel Bandeira](https://www.linkedin.com/in/gabriel-bandeira/) — Engenheiro de Dados  
- [Izabella Melo](https://www.linkedin.com/in/cmeloizabella/) — Desenvolvedora iOS  
- [Michael Barney](https://www.linkedin.com/in/michael-barney-junior/) — Back-end Developer  
- [Otacilio Maia](https://www.linkedin.com/in/otacilio/) — Desenvolvedor Front-end (Chatbot)  
- [Penelope Araújo](https://www.linkedin.com/in/penelopearaujo/) — Desenvolvedora iOS  

---

## ⚙️ Arquitetura

### 🤖 ChatBot

O fluxo de conversação do Zapei foi construído com o [DialogFlow](http://dialogflow.com), utilizando a arquitetura **WebHook Proxy**. Com isso, o bot pode não só responder às mensagens, mas também **iniciar interações de forma proativa**, como notificações internas via bot.

**Fluxo de mensagens:**

_Cliente (WhatsApp, Telegram, etc) → WebHook → DialogFlow → WebHook → Cliente_ 

> Os arquivos relacionados ao bot estão na pasta [`ChatBot`](https://github.com/OtacilioN/MovileHack/tree/master/ChatBot).

---

### 🧩 WebHook + Backend

O WebHook está integrado ao backend e localizado na pasta [`BackEnd`](https://github.com/OtacilioN/MovileHack/tree/master). Ele é responsável por:

- Gerar QR Codes
- Gerenciar as comandas
- Executar as transações
- Fornecer dados ao ChatBot

> Utilizamos o serviço **CodeAnywhere** para hospedar o WebHook com HTTPS em ambiente de desenvolvimento.

---
