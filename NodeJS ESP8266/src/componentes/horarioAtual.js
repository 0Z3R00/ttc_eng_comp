function horarioAtual() {
    const datas = new Date;
    let hora = parseInt(datas.getHours());
    let minuto = parseInt(datas.getMinutes());
    let segundo = parseInt(datas.getSeconds());

    if (hora < 10) {
        hora = '0' + hora;
    }
    if (minuto < 10) {
        minuto = '0' + minuto;
    }

    if (segundo < 10) {
        segundo = '0' + segundo;
    }

    const horario = `${hora}:${minuto}:${segundo}`;
    
    return horario;
}


module.exports = horarioAtual;