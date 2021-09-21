import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiLogIn } from 'react-icons/fi';

import api from '../../services/api';
import './styles.css';


export default function Logon() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const history = useHistory();

    async function handleLogin(e) {
        e.preventDefault();

        try {
            const response = await api.post('api/usuario/login', {email, senha});
            console.log();
            
            localStorage.setItem('nome',response.data.nome);
            localStorage.setItem('email',response.data.email);
            localStorage.setItem('id',response.data.id);
            history.push('/profile');
        } catch (err) {
            alert('Falha no login, email não localizado');

        }
    }

    return (
        <div className="logon-conteiner">
            <section className="form">  
                <form onSubmit={handleLogin}>
                    <h1>Faça seu logon</h1>
                    <input
                        placeholder="E-mail"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <input
                        placeholder="Senha"
                        value={senha}
                        type="password"
                        onChange={e => setSenha(e.target.value)}
                    />
                    <button className="button" type="submit">Entrar</button>
                    <Link className="back-link" to="/register">
                        <FiLogIn size={16} color="#E02041" />
                    Não tenho cadastro
                    </Link>
                </form>
            </section>  
        </div>
    );
}