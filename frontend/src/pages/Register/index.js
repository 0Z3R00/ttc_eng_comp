import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

import api from '../../services/api';
import './styles.css';

import logoImg from '../../assets/logo.svg'

export default function Register() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const history = useHistory();

    async function handleRegister(e) {
        e.preventDefault();

        const data = {
            nome,
            email,
            senha,
        };

        try {
            const response = await api.post('api/usuario', data);

            alert(`Seu usuario foi criado`);

            history.push('/');
        } catch (err) {
            alert('Erro no cadastro, tente novamente !!!');
        }
    }

    return (
        <div classnome="register-container">
            <div classnome="content">
                <section>

                    <h1>Cadastro</h1>

                    <form onSubmit={handleRegister}>
                        <input
                            placeholder="Nome do usuario"
                            value={nome}
                            onChange={e => setNome(e.target.value)}
                        />
                        <input
                            type="email" placeholder="E-mail"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                        <input
                            placeholder="Senha"
                            value={senha}
                            onChange={e => setSenha(e.target.value)}
                        />

                        <button classnome="button" type="submit">Cadastrar</button>
                    </form>
                    <Link classnome="back-link" to="/">
                        <FiArrowLeft size={16} color="#E02041" />
                        Já tenho cadastro
                    </Link>
                </section>

            </div>
        </div>
    );
}