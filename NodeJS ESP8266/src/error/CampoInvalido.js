class CampoInvalido extends Error {
    constructor (campo) {
        const mensagem = `O campo '${campo}' está inválido, por favor corriga antes de realizar outra requisição!!!`
        super(mensagem)
        this.name = 'CampoInvalido'
        this.idErro = 1
    }
}

module.exports = CampoInvalido