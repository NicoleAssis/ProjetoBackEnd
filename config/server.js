var express = require('express');
var consign = require('consign');
var bodyParser = require('body-parser'); 

const { body, validationResult } = require('express-validator');


var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 

app.set('view engine', 'ejs');
app.set('views', './app/views');


consign()
    .include('app/routes')
    // 1. Carrega a CONEXÃO (dbConnection.js)
    .then('config/dbConnection.js')
    // 2. Carrega o SCRIPT DE SETUP, que usa a conexão
    .then('config/initialSetup.js') 
    .then('app/models')
    .then('app/controllers')
    .into(app);

module.exports = app;

// Conteúdo de config/dbConnection.js (Incluído aqui para referência, mas deve ser um arquivo separado no seu disco)
/*
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const connectDB = function() {
    const dbPath = path.resolve(__dirname, '..', 'data', 'GestaoCurso.db');
    
    const db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('Erro ao conectar ao banco de dados SQLite:', err.message);
        } else {
            console.log('Conexão SQLite estabelecida com o arquivo:', dbPath);
        }
    });

    return db;
};

module.exports = function() {
    return connectDB;
};
*/
