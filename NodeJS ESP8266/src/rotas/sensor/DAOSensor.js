const knex = require("../../database/connection");
const dataAtual = require("../../componentes/dataAtual");
const NaoEncontrado = require("../../error/NaoEncontrado");
const horarioAtual = require("../../componentes/horarioAtual");

module.exports = {
    async listar() {
        return await knex.select().from('sensores');
    },

    async inserir(sensor) {
        try {
            const result = await knex('sensores').insert({
                nome: sensor.nome,
                valor: sensor.valor,
                unidade_medida: sensor.unidade_medida,
                data_criacao: dataAtual(),
                horario_criacao: horarioAtual()
            });

            return result;

        } catch (error) {
            throw console.error(error);
        }
    },
    async pegarPorId(id) {
        const result = await knex('sensores').where('id', id);
        if (!result) {
            throw new NaoEncontrado(id);
        } else {
            return result;
        }


    },
    async atualizar(id, dadosParaAtualizar) {
        try {
            await knex('sensores')
                .where('id', id)
                .update(dadosParaAtualizar);
            return { status: 'Atualizado com sucesso' };
        } catch (error) {
            return { status: 'Erro ao atualizar ' };
        }
    },

    async remover(id) {
        await knex('sensores').where('id', id).del();
    }
}