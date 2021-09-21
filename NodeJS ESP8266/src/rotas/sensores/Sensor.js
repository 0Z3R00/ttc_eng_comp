const validaCPF = require('../../componentes/validaCPF');
const validarEmail = require('../../componentes/validaEmail');
const validarSenha = require('../../componentes/validaSenha');
const CampoInvalido = require('../../error/CampoInvalido');
const NaoEncontrado = require('../../error/NaoEncontrado');
const DAOAluno = require('./DAOAluno');

class Aluno {
    constructor({ id, nome, cpf, email, senha, data_criacao, data_atualizacao }) {
        this.id = id;
        this.nome = nome;
        this.cpf = cpf;
        this.email = email;
        this.senha = senha;
        this.data_criacao = data_criacao;
        this.data_atualizacao = data_atualizacao;
    }

    async listar() {
        const result = await DAOAluno.listar();
    }

    async criar() {
        this.validar();
        const resultado = await DAOAluno.inserir({
            nome: this.nome,
            cpf: this.cpf,
            senha: this.senha,
            email: this.email
        });
        this.id = resultado.id;
        this.data_criacao = resultado.data_criacao;
    }

    async carregar() {
        const result = await DAOAluno.pegarPorId(this.id);
        if (result.length > 0) {
            this.nome = result[0].nome;
            this.cpf = result[0].cpf;
            this.email = result[0].email;
            this.senha = result[0].senha;
            this.data_criacao = result[0].data_criacao;
            this.data_atualizacao = result[0].data_atualizacao;
        }else{
            throw new NaoEncontrado(this.id);
        }
    }

    async atualizar() {
        await DAOAluno.pegarPorId(this.id);
        const campos = ['nome', 'cpf', 'email', 'senha','data_atualizacao'];
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

        await DAOAluno.atualizar(this.id, dadosParaAtualizar);


    }

    async remover() {
        return await DAOAluno.remover(this.id);
    }


    validar() {
        const campos = ['nome', 'cpf', 'email', 'senha']

        campos.forEach(campo => {
            const valor = this[campo];

            if (typeof valor !== 'string' || valor.length === 0) {
                throw new CampoInvalido(campo);

            }else if (this.nome.length <= 4) {
                throw new CampoInvalido('nome');

            } else if (validaCPF(this.cpf) === false) {
                throw new CampoInvalido('CPF');

            } else if (validarEmail(this.email) === false) {
                throw new CampoInvalido('email');

            } else if (validarSenha(this.senha) === false) {
                throw new CampoInvalido('senha');


            }


        })
    }

}

module.exports = Aluno;
