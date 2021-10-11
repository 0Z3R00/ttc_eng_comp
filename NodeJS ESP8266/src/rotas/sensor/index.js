const roteador = require('express').Router()
const NaoEncontrado = require('../../error/NaoEncontrado');
const Sensor = require('./Sensor');
const DAOSensor = require('./DAOSensor');
const dataAtual = require('../../componentes/dataAtual');



roteador.get('/', async (requisicao, resposta) => {
    const resultados = await DAOSensor.listar();
    filtrar(resultados);
    resposta.status(200).send(resultados);
});

roteador.get('/datas', async (requisicao, resposta) => {
    const resultados = await DAOSensor.listarDatas();
    filtrar(resultados);
    resposta.status(200).send(resultados);
});

roteador.post('/datas', async (requisicao, resposta) => {
    try {
        const dados = requisicao.body;
        console.log(dados);
        const resultados = await DAOSensor.consultarData(dados.data);
        resposta.status(200).send(resultados);
    } catch (error) {
        proximo(error);
    }
});

roteador.post('/valor', async (requisicao, resposta, proximo) => {
    try {
        const dados = requisicao.body;
        const sensor = new Sensor(dados);
        await sensor.criar();
        resposta.status(201).send(sensor);

    } catch (error) {
        proximo(error);
    }
});


function filtrar(dados) {
    if (Array.isArray(dados)) {
        dados = dados.map(item => {
            return filtrarObjeto(item)
        })
    } else {
        dados = filtrarObjeto(dados)
    }

    return dados
}

function filtrarObjeto(dados) {
    const novoObjeto = {}
    const camposPublicos = [
        'nome',
        'valor',
        'unidade_medida',
        'data_criacao',
    ]
    camposPublicos.forEach((campo) => {
        if (dados.hasOwnProperty(campo)) {
            novoObjeto[campo] = dados[campo]
        }
    })

    return novoObjeto
}

module.exports = roteador