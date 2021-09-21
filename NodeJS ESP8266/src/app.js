const express = require('express');
const cors = require('cors');


const portSocket = 3005;
const app = express()
app.use(cors());
app.use(express.json());



app.get('/api',(req, res) =>{
    return res.status(200).json({
        Status: "Api funcionando corretamente",
        Info: "Você esta na rota /api oque deseja aqui ?"
    });
});

module.exports = app;