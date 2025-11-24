// src/database/migrate.js
const sequelize = require('./sequelize');
const AlunoModel = require('../models/AlunoModel');
const CursoModel = require('../models/CursoModel');

async function migrate() {
  try {
    console.log('=== INICIANDO MIGRAÇÃO ===');
    
    // Sincroniza forçando a atualização das tabelas
    await sequelize.sync({ force: false, alter: true });
    
    console.log('=== MIGRAÇÃO CONCLUÍDA ===');
    console.log('Tabelas atualizadas com sucesso!');
    
    process.exit(0);
  } catch (error) {
    console.error('Erro na migração:', error);
    process.exit(1);
  }
}

migrate();