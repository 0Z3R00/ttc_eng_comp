import React, { Component, useState } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import BarChart from './components/BarChart';
import api from './services/api';
import './styles.css';
var status1 = 'not'
var status2 = 'ready'

var statusHistorico1 = 'not';
var statusHistorico = 'not';

const client = new W3CWebSocket('ws://127.0.0.1:3003');
var grafico = [['horario', 'valor']];
var historico = [['horario', 'valor']];
var datas = [{ id: 0, value: "Selecione uma Data" }];
var dataEscolhida = '';

async function consultarHistorico(e) {
  e.preventDefault();

  try {
    var dado = { data: dataEscolhida };
    const response = await api.post('sensor/datas', dado);
    var dados = response.data;
    if (historico.length > 2) {
      historico = [['horario', 'valor']];
    }
    dados.forEach(element => {
      historico.push([element.horario_criacao, parseInt(element.valor)])
    });

  } catch (error) {

  }
  console.log(historico);
  if (historico.length > 2) {
    statusHistorico1 = 'yes';
    statusHistorico = 'ready';
  }
}

async function puxaHistorico() {
  try {
    const response = await api.get('sensor/datas');
    var dados = response.data;
    var i = 1;
    dados.forEach(element => {
      datas.push({ id: i, value: element.data_criacao });
      i++;
    });
    console.log(datas);
  } catch (error) {

  }

}

function verificaStatus(valor) {
  var div = document.getElementsByClassName("status-sensor");
  var p = document.getElementsByClassName("info-status");
  if (valor >= 5000) {
    div[0].style.backgroundColor = "#E00000";
    p[0].innerHTML = "Perigo grande vazamento de gás";
  } else if (valor >= 500) {
    div[0].style.backgroundColor = "#EF6416";
    p[0].innerHTML = "niveis de gás acima do normal";
  } else {
    div[0].style.backgroundColor = "#00E031";
    p[0].innerHTML = "niveis aceitáveis";
  }
}


class App extends Component {

  componentWillMount() {
    setInterval(() => this.forceUpdate(), 500);
    puxaHistorico();

    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    client.onmessage = (message) => {
      const result = JSON.parse(message.data);
      grafico.push([result.horario, parseInt(result.valor)]);
      status1 = 'yes';
      verificaStatus(parseInt(result.valor));
    };
  }


  render() {

    return (
      <section className="container">
        <header>
          <h1>Bem vindo, ao sistema de monitoramento de gás</h1>
        </header>
        <p className="titulo-grafico">Grafico do Sensor</p>
        <section className="grafico-real-time">
          <div className="status-sensor">
            <span>Status:</span><p className="info-status"></p>
          </div>
          {status1 === 'yes' ? (
            <section className="graficos" >
              <p className="tituloGrafico"> Valores do Sensor de gás</p>
              <BarChart dataMapa={grafico} title={""} corMapa={'#ffa200'} status={status2} tituloVertical={"ppm"} />
            </section>
          ) : (<span>Sem dados disponiveis</span>)}

        </section>

        <section className="historico-consulta">
          <p className="titulo-grafico">Historico do Sensor</p>
          <form onSubmit={consultarHistorico}>
            <select value={dataEscolhida} onChange={e => {
              statusHistorico = 'not';
              statusHistorico1 = 'not';
              dataEscolhida = (e.target.value);
            }}>
              {datas.map((item, index) => (
                <option value={item.value}>{item.value}</option>
              ))}
            </select>
            <button type="submit">Consultar</button>
          </form>
          <section className="grafico-consulta">
            {statusHistorico1 === 'yes' ? (
              <section className="graficos" >
                <p className="tituloGrafico"> Valores do Sensor de gás</p>
                <BarChart dataMapa={historico} title={""} corMapa={'#ffa200'} status={statusHistorico} tituloVertical={"ppm"} />
              </section>
            ) : (<span>Aguardando consulta</span>)}

          </section>
        </section>
        <footer>
          <p className="titulo-grafico">Conheça nossa equipe</p>
          <section>
            <div className="dev">
              <a href="https://www.linkedin.com/in/allan-picoli-pasqualino-a12b8a149/" target="_blank">
                <img src="https://media-exp1.licdn.com/dms/image/C5603AQHtVzy4zsZ7Yw/profile-displayphoto-shrink_200_200/0/1517832608435?e=1639612800&v=beta&t=NDP2vRBSEXzTyZQ3qCDlNhML7b4ZTgir1UjepHYUwkk" />
              </a>
              <p>Allan Picoli Pasqualino</p>
              <a className="link-github" href="https://github.com/0Z3R00" target="_blank">GitHub</a>
            </div>
            <div className="dev">
              <a href="https://www.linkedin.com/in/anacarolina-dasilva/" target="_blank">
                <img src="https://media-exp1.licdn.com/dms/image/C4D35AQHc03XSRdOrmw/profile-framedphoto-shrink_200_200/0/1604853769235?e=1634068800&v=beta&t=-UH-nYsZU_ABCrblwg-wwoTbDb7jRr-MSsmDEgQiGRE" />
              </a>
              <p>Ana Carolina da Silva</p>
              <a className="link-github" href="https://github.com/0Z3R00" target="_blank">GitHub</a>
            </div>
            <div className="dev">
              <a href="https://www.linkedin.com/in/jo%C3%A3o-paulo-martins-rodrigues-62649614a/" target="_blank">
                <img src="https://media-exp1.licdn.com/dms/image/D4E35AQEbjgHR6xPp9Q/profile-framedphoto-shrink_200_200/0/1630536887471?e=1634068800&v=beta&t=c-BNtmbLpbCG7DczjVwTJuSGPWeP00KWs05LE-UIQ2Q" />
              </a>
              <p>João Paulo Martins Rodrigues</p>
              <a className="link-github" href="https://github.com/joaopmts" target="_blank">GitHub</a>
            </div>
            <div className="dev">
              <a href="https://www.linkedin.com/in/matheus-moura-nepomuceno-pereira-01aab3104/" target="_blank">
                <img src="https://media-exp1.licdn.com/dms/image/C4D03AQFTm1oticvueA/profile-displayphoto-shrink_200_200/0/1549906225690?e=1639612800&v=beta&t=kJEp5fuzKVpi8b71LTKGG4dk8qyEOkjx5VhEf0RdRV4" />
              </a>
              <p>Matheus Moura Nepomuceno Pereira</p>
              <a className="link-github" href="https://github.com/0Z3R00" target="_blank">GitHub</a>
            </div>

          </section>
        </footer>
      </section>
    );
  }
}

export default App;
