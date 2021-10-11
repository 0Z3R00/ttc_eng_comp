
const DAOSensor = require('./DAOSensor');

class Sensor {
    constructor({ id, nome, valor, unidade_medida, data_criacao, horario_criacao}) {
        this.id = id;
        this.nome = nome;
        this.valor = valor;
        this.unidade_medida = unidade_medida;
        this.data_criacao = data_criacao;
        this.horario_criacao = horario_criacao;
        
    }

    async listar() {
        const result = await DAOSensor.listar();
    }

    async criar() {
        this.validar();
        const resultado = await DAOSensor.inserir({
            nome: this.nome,
            valor: this.valor,
            unidade_medida: this.unidade_medida,
            data_criacao: this.data_criacao,
            horario_criacao: this.horario_criacao,
        });
        this.id = resultado;
        this.carregar();
    }

    async carregar() {
        const result = await DAOSensor.pegarPorId(this.id);
        if (result.length > 0) {
            this.id = result[0].id;
            this.nome = result[0].nome;
            this.valor = result[0].valor;
            this.unidade_medida = result[0].unidade_medida
            this.data_criacao = result[0].data_criacao;
            this.horario_criacao = result[0].horario_criacao;
        }else{
            throw new NaoEncontrado(this.id);
        }
    }

    async atualizar() {
        await DAOSensor.pegarPorId(this.id);
        const campos = ['valor'];
        const dadosParaAtualizar = {};
 /*
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
 */
        if (Object.keys(dadosParaAtualizar).length === 0) {
            throw new DadosNaoFornecidos()
        }

        await DAOSensor.atualizar(this.id, dadosParaAtualizar);


    }

    async remover() {
        return await DAOSensor.remover(this.id);
    }


    validar() {
        const campos = ['valor']

        /*
        campos.forEach(campo => {
            const valor = this[campo];

            if (typeof valor !== 'string' || valor.length === 0) {
                throw new CampoInvalido(campo);

            }else if (this.valor.length <= 4) {
                throw new CampoInvalido('valor');

            } else if (validaCPF(this.cpf) === false) {
                throw new CampoInvalido('CPF');

            } else if (validarEmail(this.email) === false) {
                throw new CampoInvalido('email');

            } else if (validarSenha(this.senha) === false) {
                throw new CampoInvalido('senha');


            }


        })
        */
    }

}

module.exports = Sensor;