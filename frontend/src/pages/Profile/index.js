import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiPower, FiTrash2 } from 'react-icons/fi';

import api from '../../services/api';
import logoImg from '../../assets/logo.svg'
import './styles.css';

export default function Profile() {
    const nome = localStorage.getItem('nome');
    const email = localStorage.getItem('email');
   

    const history = useHistory();

    return (
        <div className="profile-container">
            <header>
                
                <span>Bem vindo, {nome}</span>
            </header>
            <h1>Tera um grafico,</h1>

            
        </div>
    );
}