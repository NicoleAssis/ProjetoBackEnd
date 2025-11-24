// src/controllers/homeController.js
const Aluno = require('../models/AlunoModel');

exports.index = async (req, res) => {
  try {
    const alunos = await Aluno.buscaAlunos();
    
    // DEBUG: Verifique o que está vindo
    console.log('Alunos encontrados:', alunos.length);
    alunos.forEach((aluno, index) => {
      console.log(`Aluno ${index + 1}:`, {
        nome: aluno.nome,
        curso_id: aluno.curso_id,
        curso: aluno.curso ? aluno.curso.nome : 'Nenhum'
      });
    });
    
    res.render('index', { alunos });
  } catch(e) {
    console.log('Erro no homeController:', e);
    res.render('index', { alunos: [] });
  }
};