import React, { Component, useState } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import BarChart from './components/BarChart';
var status1 = 'not'
var status2 = 'ready'

const client = new W3CWebSocket('ws://127.0.0.1:3003');
var grafico = [['horario', 'valor']];


class App extends Component {
  componentWillMount() {
    setInterval(() => this.forceUpdate(), 500);

    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    client.onmessage = (message) => {
      const result = JSON.parse(message.data);
      grafico.push([result.horario,parseInt(result.valor)]);
      status1 = 'yes';
      console.log(grafico);
    };
  }

  render() {
    return (
      <div className="profile-container">
          <header>

              <span>Bem vindo, </span>
          </header>
          <h1>Grafico do Sensor</h1>
          <section className="row">
              {status1 === 'yes' ? (
                  <section className="graficos" >
                      <p className="tituloGrafico"> Valores do Sensor de gás</p>
                      <BarChart dataMapa={grafico} title={""} corMapa={'#ffa200'} status={status2} tituloVertical={"ppm"} />
                  </section>
              ) : (<span>Sem dados disponiveis</span>)}

          </section>
      </div>
  );
  }
}

export default App;
