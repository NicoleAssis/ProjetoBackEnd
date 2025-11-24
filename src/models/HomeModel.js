// src/controllers/homeController.js
const Aluno = require('../models/AlunoModel');

exports.index = async (req, res) => {
  try {
    console.log('=== HOME - Carregando página inicial ===');
    
    // Buscar todos os alunos para exibir na home
    const alunos = await Aluno.buscaAlunos();
    
    console.log(`Alunos encontrados para home: ${alunos ? alunos.length : 0}`);
    
    res.render('index', {
      alunos: alunos || []
    });
    
  } catch (e) {
    console.log('Erro ao carregar home:', e);
    // Mesmo com erro, renderiza a página com array vazio
    res.render('index', {
      alunos: []
    });
  }
};