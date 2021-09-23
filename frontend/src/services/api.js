import axios from 'axios';
require('dotenv').config();

const api = axios.create({
    baseURL: 'http://192.168.1.10:3005/api/',
})

export default api;