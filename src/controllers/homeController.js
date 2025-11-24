// src/controllers/homeController.js
const Aluno = require('../models/AlunoModel');

exports.index = async (req, res) => {
  try {
    console.log('🏠 HOME - Carregando página inicial');
    
    const alunos = await Aluno.buscaAlunos();
    
    console.log(`📊 Alunos encontrados na home: ${alunos ? alunos.length : 0}`);
    
    res.render('index', { 
      alunos: alunos || [],
      user: req.session.user // IMPORTANTE!
    });
  } catch(e) {
    console.log('❌ Erro no homeController:', e);
    res.render('index', { 
      alunos: [],
      user: req.session.user // IMPORTANTE!
    });
  }
};