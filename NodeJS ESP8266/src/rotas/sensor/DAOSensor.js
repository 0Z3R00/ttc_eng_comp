const knex = require("../../database/connection");
const NaoEncontrado = require("../../error/NaoEncontrado");

module.exports = {
    async listar() {
        return await knex.select().from('sensores');
    },

    async listarDatas() {
        return await knex.select('data_criacao').from('sensores').distinct('data_criacao');
    },

    async consultarData(data) {
        return await knex.select('horario_criacao', 'valor').from('sensores').where('data_criacao', data).distinct('horario_criacao','valor');
    },

    async inserir(sensor) {
        try {
            const result = await knex('sensores').insert({
                nome: sensor.nome,
                valor: sensor.valor,
                unidade_medida: sensor.unidade_medida,
                data_criacao: sensor.data_criacao,
                horario_criacao: sensor.horario_criacao,
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