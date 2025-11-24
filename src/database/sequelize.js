// ./src/database/sequelize.js
const { Sequelize } = require('sequelize');

// Configuração do SQLite (deve ser a mesma do server.js)
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite', 
    logging: false
});

module.exports = sequelize;