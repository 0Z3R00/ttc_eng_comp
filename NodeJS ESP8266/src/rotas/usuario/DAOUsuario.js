const knex = require("../../database/connection");
const dataAtual = require("../../componentes/dataAtual");
const NaoEncontrado = require("../../error/NaoEncontrado");
const Usuario = require("./Usuario");

module.exports = {
    async listar() {
        return await knex.select().from('usuarios');
    },

    async inserir(usuario) {
        try {
            const result = await knex('usuarios').insert({
                nome: usuario.nome,
                email: usuario.email,
                senha: usuario.senha,
                data_criacao: dataAtual()
            });

            return result;

        } catch (error) {
            throw console.error(error);
        }
    },
    async pegarPorId(id) {
        const result = await knex('usuarios').where('id', id);
        if (!result) {
            throw new NaoEncontrado(id);
        } else {
            return result;
        }


    },
    async atualizar(id, dadosParaAtualizar) {
        try {
            await knex('usuarios')
                .where('id', id)
                .update(dadosParaAtualizar);
            return { status: 'Atualizado com sucesso' };
        } catch (error) {
            return { status: 'Erro ao atualizar ' };
        }
    },

    async autenticar(email, senha) {

        const result = await knex('usuarios').where({
            email,
            senha
        });
        if (!result) {
            throw new NaoEncontrado(email);
        } else {
            return result[0];
        }

        


    },

    async remover(id) {
        await knex('usuarios').where('id', id).del();
    }
}

