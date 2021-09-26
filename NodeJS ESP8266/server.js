const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
var http = require('http');
const CampoInvalido = require('./src/error/CampoInvalido');
const Sensor = require('./src/rotas/sensor/Sensor');
const roteadorSensor = require('./src/rotas/sensor');
const roteadorUsuario = require('./src/rotas/usuario');
const NaoEncontrado = require('./src/error/NaoEncontrado');
const app = express();
app.use(cors());
app.use(express.json());

var ultimoValorRecebido = 0;


const server = http.createServer(app);
require('dns').lookup(require('os').hostname(), function (err, add, fam) {
  console.log('addr: ' + add);
})
const webSocket = new WebSocket.Server({ server });


webSocket.on('connection', async function (ws, req, proximo) {
  ws.on('message', async function (message) {

    const nodeMCU = String(message);
    var msg = nodeMCU.split('"');
    var value = msg[0].split("'");
    var id = 0;
    const valueSensor = {
      nome: value[1],
      valor: Number(value[3]),
      unidade_medida: value[5],
    }
    const novoSensor = new Sensor(valueSensor);


    try {
      await novoSensor.criar();
      await novoSensor.carregar();
      sendMessage();
    } catch (error) {
      proximo(error);
    }
    ultimoValorRecebido = valueSensor.valor;


    //listaDados.push(dado);


    function sendMessage() {
      webSocket.clients.forEach(function (client) {
        let newData = {
          nome: novoSensor.nome,
          valor: novoSensor.valor,
          horario: novoSensor.horario_criacao
        }
        console.log("Repassando info para os cliente conectados");
        if (client != ws && client.readyState) {
          client.send(JSON.stringify(newData));
        }
      });
    }

  });
  ws.on('close', function () {
    console.log("cliente desconectado ...");
  });

  console.log("cliente conectado ...");
}
);

const portAPI = 3005;
const portWS = 3003;

app.use('/api/sensor', roteadorSensor);
app.use('/api/usuario', roteadorUsuario);
app.use((erro, requisicao, resposta, proximo) => {
  let status = 500

  if (erro instanceof CampoInvalido || erro instanceof NaoEncontrado) {
    status = 400
  }

  resposta.status(status);

  resposta.send({
    status_requisição: erro.message,
  })

})

app.listen(portAPI, () => {
  console.log(`A API está sendo executada na url http://localhost:${portAPI}/`);
});

server.listen(portWS);
console.log(`o WebSocket no endereço: http://localhost:${portWS}/`);

