function dataAtual() {
    const datas = new Date;
    let mes = parseInt(datas.getMonth()) + 1;
    if (mes < 10) {
        mes = '0' + mes;
    }
  
    const atual = `${datas.getFullYear()}-${mes}-${datas.getDate()}`;
    return atual;
}


module.exports = dataAtual;