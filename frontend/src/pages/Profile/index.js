import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiPower, FiTrash2 } from 'react-icons/fi';

import api from '../../services/api';
import './styles.css';
import BarChart from '../../components/BarChart';
let grafico = [];

export default function Profile() {
    const nome = localStorage.getItem('nome');
    const [status1, setStatus1] = useState('not');
    const [status2, setStatus2] = useState('not');
    async function realizaConsulta() {
        try {
            grafico.push(['Sensor', 'valor']);
            const dados = await api.get('sensor');
            const sensor = dados.data;

            for (let i = 0; i < sensor.length; i++) {
                grafico.push([sensor[i].horario_criacao, parseInt(sensor[i].valor)]);
            }
        } catch (error) {
            console.log(error)
        }
        setStatus2('ready');
        if (grafico.length > 2) {
            setStatus1('yes');
            
        }
    }
    realizaConsulta();
    return (
        <div className="profile-container">
            <header>

                <span>Bem vindo, {nome}</span>
            </header>
            <h1>Tera um grafico,</h1>
            <section className="row">
                {status1 === 'yes' ? (
                    <section className="graficos" >
                        <p className="tituloGrafico"> Valores do Sensor de gás</p>
                        <BarChart dataMapa={grafico} title={""} corMapa={'#ffa200'} status={status2} tituloVertical={"ppm"} />
                    </section>
                ) : (<span>Sem dados disponiveis</span>)}

            </section>
        </div>
    );
}