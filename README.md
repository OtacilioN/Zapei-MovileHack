![Zapei](https://github.com/OtacilioN/MovileHack/blob/master/zapei-icon.png)

O Zapei é um app desruptivo que foi criado para transformar as formas de pagamento no Brasil. A plataforma foi criada para juntar a facilidade de pagamentos por vias digitais e a confiança das pessoas em apps famosos e seguros.

O Zapei é uma carteira virtual que interage com o usuário via bot no WhatsApp. Com essa carteira virtual os consumidores que não gostam de pagamentos digitais podem realizar depósito via boleto bancário ou comprar créditos em bancas de revistas e locais associados. Após esse depósito, o consumidor pode então realizar transferências para outros consumidores ou para estabelecimentos. Depois de acostumado com a plataforma, o consumidor pode também cadastrar seu cartão de crédito e passar a realizar transferências e pagamentos debitando do cartão de crédito, não somente dos créditos já existentes na carteira.

Para a realização de transferências de consumidor para consumidor, o usuário precisa apenas iniciar uma conversa com o contato do bot e dizer que quer transferir uma certa quantia para um contato, indicado pelo apelido do contato.

Já em um estabelecimento, o usuário pode abrir uma conversa com o bot e dizer que quer abrir uma comanda. Com isso, o bot retorna um QRCode para que o responsável pelos pedidos no estabelecimento possa escanear ela com o App do Zapei. Após escaneado o QRCode, o responsável pelos pedidos pode lançar na comanda do cliente os pedidos dele enquanto ele acompanha todos pedidos pela conversa com o bot. A qualquer momento, o cliente ou o estabelecimento podem finalizar a comanda e automaticamente a transferência é realizada da carteira virtual do cliente para o estabelecimento, sem filas e sem espera.

<!-- ![Tutorial](https://preview.ibb.co/f8M5uf/tutorial.png) -->

## O nosso time incrível

- [Gabriel Bandeira](https://www.linkedin.com/in/gabriel-bandeira/): Engenheiro de Dados.
- [Izabella Melo](https://www.linkedin.com/in/cmeloizabella/): Desenvolvedora IOs.
- [Michael Barney](https://www.linkedin.com/in/michael-barney-junior/): Desenvolvedor Back-end.
- [Otacilio Maia](https://www.linkedin.com/in/otacilio/): Desenvolvedor Front-end (Chatbot);
- [Penelope Araújo](https://www.linkedin.com/in/penelopearaujo/): Desenvolvedora IOs;

## Arquitetura

### ChatBot
Para o desenvolvimento do fluxo conversacional do ChatBot foi utilizado o [DialogFlow](http://dialogflow.com) utilizando a arquitetura "WebHook Proxy", onde invertemos o fluxo tradicional da plataforma, utilizando da seguinte maneira:

_Cliente (Telegram, WhatsApp, Messenger, etc) -> WebHook -> DialogFlow -> WebHook -> Cliente (Telegram, WhatsApp, Messenger, etc)_

Isso permite que o bot **não seja restrito** apenas a uma postura reativa, mas que **também inicie diálogos** a partir e ações estratégicas, como por exemplo, **in bot push notifications**. Todos os arquivos que descrevem o Bot estão disponíveis no folder [ChatBot](https://github.com/OtacilioN/MovileHack/tree/master/ChatBot)

### WebHook
O nosso WebHook está condensado junto com o módulo de pagamento no pasta [BackEnd](https://github.com/OtacilioN/MovileHack/tree/master). O WebHook é responsável por fornecer os dados necessários para o ChatBot, tais como o **QRCode**, itens do carrinho e informações de transações. 

O WebHook também é responsável por gerar os QR Codes e cuidar de toda a lógica de negócio, atualmente utilizamos o serviço **Code Anywhere** para hospedar e rodar o webhook em ambiente de desenvolvimento, servindo nosso WebHook através de https.
