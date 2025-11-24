// Home.js (Adaptado para Sequelize)
const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize'); // Ajuste o caminho

// 1. Definição do Modelo (Schema) usando Sequelize
const HomeModel = sequelize.define('Home', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  titulo: { type: DataTypes.STRING, allowNull: false },
  descricao: { type: DataTypes.STRING, allowNull: true }
}, {
  // Opções do Modelo
  timestamps: false, // Desabilita createdAt e updatedAt se não forem necessários
  modelName: 'Home',
  tableName: 'home'
});

class Home {
    // Se você não usa esta classe para lógica, ela pode permanecer vazia
}

module.exports = Home;