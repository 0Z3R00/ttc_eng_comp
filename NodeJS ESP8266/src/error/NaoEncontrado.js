class NaoEncontrado extends Error {
    constructor (id) {
        super(`Não foi encontrado nenhum registro com o id ${id} !!!`);
        this.name = 'NaoEncontrado'
        this.idErro = 0
    }
}

module.exports = NaoEncontrado