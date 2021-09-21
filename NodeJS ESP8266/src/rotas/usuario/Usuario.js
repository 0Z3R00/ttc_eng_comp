const validarEmail = require('../../componentes/validaEmail');
const validarSenha = require('../../componentes/validaSenha');
const CampoInvalido = require('../../error/CampoInvalido');
const NaoEncontrado = require('../../error/NaoEncontrado');
const DAOUsuario = require('./DAOUsuario');

class Usuario {
    constructor({ id, nome, email, senha, data_criacao, data_atualizacao }) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.data_criacao = data_criacao;
        this.data_atualizacao = data_atualizacao;
    }

    async listar() {
        const result = await DAOUsuario.listar();
    }

    async criar() {
        this.validar();
        const resultado = await DAOUsuario.inserir({
            nome: this.nome,
            senha: this.senha,
            email: this.email
        });
        this.id = resultado.id;
        this.data_criacao = resultado.data_criacao;
    }

    async carregar() {
        const result = await DAOUsuario.pegarPorId(this.id);
        if (result.length > 0) {
            this.nome = result[0].nome;
            this.email = result[0].email;
            this.senha = result[0].senha;
            this.data_criacao = result[0].data_criacao;
            this.data_atualizacao = result[0].data_atualizacao;
        } else {
            throw new NaoEncontrado(this.id);
        }
    }

    async logar() {
        const resultado = await DAOUsuario.autenticar(this.email,this.senha);
        this.id = resultado.id;
        this.carregar();
        
    }

    async atualizar() {
        await DAOUsuario.pegarPorId(this.id);
        const campos = ['nome', 'cpf', 'email', 'senha', 'data_atualizacao'];
        const dadosParaAtualizar = {};

        campos.forEach((campo) => {
            const valor = this[campo]

            if (typeof valor === 'string' && valor.length > 0) {
                dadosParaAtualizar[campo] = valor

            } else if (validaCPF(this.cpf) === false) {
                throw new CampoInvalido('CPF');

            } else if (validarEmail(this.email) === false) {
                throw new CampoInvalido('email');

            } else if (validarSenha(this.senha) === false) {
                throw new CampoInvalido('senha');
            }
        })

        if (Object.keys(dadosParaAtualizar).length === 0) {
            throw new DadosNaoFornecidos()
        }

        await DAOUsuario.atualizar(this.id, dadosParaAtualizar);


    }




    async remover() {
        return await DAOUsuario.remover(this.id);
    }


    validar() {
        const campos = ['nome', 'email', 'senha']

        campos.forEach(campo => {
            const valor = this[campo];

            if (typeof valor !== 'string' || valor.length === 0) {
                throw new CampoInvalido(campo);

            } else if (this.nome.length <= 4) {
                throw new CampoInvalido('nome');

            } else if (validarEmail(this.email) === false) {
                throw new CampoInvalido('email');

            } else if (validarSenha(this.senha) === false) {
                throw new CampoInvalido('senha');

            }
        })
    }

}

module.exports = Usuario;
