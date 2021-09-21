const roteador = require('express').Router()
const NaoEncontrado = require('../../error/NaoEncontrado');
const Usuario = require('./Usuario');
const DAOUsuario = require('./DAOUsuario');
const dataAtual = require('../../componentes/dataAtual');



roteador.get('/', async (requisicao, resposta) => {
    const resultados = await DAOUsuario.listar();
    filtrar(resultados);
    resposta.status(200).send(resultados);
});

roteador.get('/:idUsuario', async (requisicao, resposta, proximo) => {
    try {

        const id = requisicao.params.idUsuario;
        const usuario = new Usuario({ id: id });
        await usuario.carregar();
        filtrar(usuario);

        resposta.status(200).send(usuario);

    } catch (error) {
        proximo(error);
    }


});

roteador.post('/', async (requisicao, resposta, proximo) => {
    try {
        const dados = requisicao.body;
        const usuario = new Usuario(dados);
        await usuario.criar();
        resposta.status(201).send(usuario);

    } catch (error) {
        proximo(error);
    }
});

roteador.post('/login', async (requisicao, resposta, proximo) => {
    try {
        const {email, senha} = requisicao.body;
        const usuario = new Usuario({email: email,senha: senha});
        await usuario.logar();
        await usuario.carregar();
        filtrar(usuario);
        //await usuario.carregar();
        resposta.status(201).send(usuario);
    } catch (error) {
        proximo(error);
    }
});

roteador.put('/:idUsuario', async (requisicao, resposta, proximo) => {
    try {
        const id = requisicao.params.idUsuario;
        const dados = requisicao.body;
        const atualizacao = dataAtual();
        const dadosData = Object.assign({}, dados, { data_atualizacao: atualizacao });
        const dadosUsuario = Object.assign({}, dadosData, { id: id });
        const Usuario = new Usuario(dadosUsuario);
        await Usuario.atualizar();

        resposta.status(204).end();
    } catch (error) {
        proximo(error);
    }
});

roteador.delete('/:idUsuario', async (requisicao, resposta, proximo) => {
    try {

        const id = requisicao.params.idUsuario;
        const usuario = new Usuario({ id: id });
        await usuario.carregar();
        if (usuario.id > 0) {
            usuario.remover();
            resposta.status(204).send({
                status: `Perfil do Usuario  removido com sucesso!!!`,
            });
        }else{
            throw new NaoEncontrado(usuario.id);
        }

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
        'email',
        'senha',
        'data_criacao',
        'data_atualizacao'
    ];

    camposPublicos.forEach((campo) => {
        if (dados.hasOwnProperty(campo)) {
            novoObjeto[campo] = dados[campo]
        }
    })
    return novoObjeto
}

module.exports = roteador