// src/controllers/alunoController.js
const Aluno = require('../models/AlunoModel');

exports.index = async (req, res) => {
  try {
    console.log('=== INDEX - Carregando formulário de aluno ===');
    
    const cursos = await Aluno.buscaCursosParaDropdown();
    
    // DEBUG: Verifique se os cursos estão sendo buscados
    console.log('Cursos para dropdown:', cursos ? cursos.length : 0);
    if (cursos && cursos.length > 0) {
      cursos.forEach(curso => {
        console.log(`Curso disponível: ${curso.nome} (${curso.codigo}) - ID: ${curso.id}`);
      });
    } else {
      console.log('NENHUM curso encontrado para o dropdown');
    }
    
    res.render('aluno', {
      aluno: {},
      cursos: cursos || [] 
    });
  } catch (e) {
    console.log('Erro ao carregar cursos no index:', e);
    req.flash('errors', ['Erro ao carregar lista de cursos.']);
    res.render('aluno', {
      aluno: {},
      cursos: [] 
    });
  }
};


// Rota: /aluno/register

exports.register = async(req, res) => {
  try {
    console.log('=== REGISTER - Registrando novo aluno ===');
    console.log('Dados recebidos:', req.body);
    console.log('Curso_id selecionado:', req.body.curso_id);

    const aluno = new Aluno(req.body);
    await aluno.register();

    if(aluno.errors.length > 0) {
      console.log('Erros de validação:', aluno.errors);
      req.flash('errors', aluno.errors);
      req.session.save(() => res.redirect('back'));
      return;
    }

    req.flash('success', 'Aluno registrado com sucesso.');
    
   
    console.log('Aluno registrado com ID:', aluno.Aluno.id);
    req.session.save(() => res.redirect(`/aluno/index/${aluno.Aluno.id}`));
    return;
  } catch(e) {
    console.log('Erro no register:', e);
    req.flash('errors', ['Erro interno ao registrar aluno.']);
    req.session.save(() => res.redirect('back'));
  }
};


// Rota: /aluno/index/:id

exports.editIndex = async function(req, res) {
  try {
    console.log('=== EDIT INDEX - Carregando aluno para edição ===');
    console.log('ID do aluno:', req.params.id);
    
    if(!req.params.id) {
      req.flash('errors', ['ID do aluno não fornecido.']);
      return res.redirect('/aluno/index');
    }

    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      req.flash('errors', ['ID do aluno inválido.']);
      return res.redirect('/aluno/index');
    }

    const aluno = await Aluno.buscaPorId(id);
    if(!aluno) {
      req.flash('errors', ['Aluno não encontrado.']);
      return res.redirect('/aluno/index');
    }

    // Busca cursos para o dropdown
    const cursos = await Aluno.buscaCursosParaDropdown();
    
    // DEBUG
    console.log('Editando aluno:', aluno.id);
    console.log('Curso_id do aluno:', aluno.curso_id);
    console.log('Cursos disponíveis:', cursos ? cursos.length : 0);
    
    if (cursos && cursos.length > 0) {
      cursos.forEach(curso => {
        console.log(`Curso: ${curso.nome} (ID: ${curso.id}) - Selecionado: ${aluno.curso_id === curso.id}`);
      });
    }

    res.render('aluno', { 
      aluno: aluno,
      cursos: cursos || [] 
    }); // ← PARÊNTESE FECHADO AQUI
  } catch(e) {
    console.log('Erro no editIndex:', e);
    req.flash('errors', ['Erro interno ao carregar aluno.']);
    res.redirect('/aluno/index');
  }
};


// Rota: /aluno/edit/:id

exports.edit = async function(req, res) {
  try {
     console.log('=== EDIT - Editando aluno ===');
    console.log("ID recebido para edição", req.params.id);
    console.log('Dados do body:', req.body); // ← req.body VAZIO!
    console.log('Curso_id selecionado:', req.body.curso_id);
    
    if(!req.params.id) {
      req.flash('errors', ['ID do aluno não fornecido.']);
      return res.redirect('/aluno/index');
    }

    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      req.flash('errors', ['ID do aluno inválido.']);
      return res.redirect('/aluno/index');
    }
    
    const aluno = new Aluno(req.body);
    await aluno.edit(id);

    if(aluno.errors.length > 0) {
      console.log('Erros de validação na edição:', aluno.errors);
      req.flash('errors', aluno.errors);
      req.session.save(() => res.redirect('back'));
      return;
    }

    req.flash('success', 'Aluno editado com sucesso.');
    
    // CORRIGIDO: Acessa o ID usando .id (Sequelize)
    console.log('Aluno editado com ID:', aluno.Aluno.id);
    req.session.save(() => res.redirect(`/aluno/index/${aluno.Aluno.id}`));
    return;
  } catch(e) {
    console.log('Erro no edit:', e);
    req.flash('errors', ['Erro interno ao editar aluno.']);
    req.session.save(() => res.redirect('back'));
  }
};


// Rota: /aluno/delete/:id

exports.delete = async function(req, res) {
  try {
    console.log('=== DELETE - Excluindo aluno ===');
    console.log('ID para exclusão:', req.params.id);
    
    if(!req.params.id) {
      req.flash('errors', ['ID do aluno não fornecido.']);
      return res.redirect('/aluno/index');
    }

    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      req.flash('errors', ['ID do aluno inválido.']);
      return res.redirect('/aluno/index');
    }

    const aluno = await Aluno.delete(id);
    if(!aluno) {
      req.flash('errors', ['Aluno não encontrado para exclusão.']);
      return res.redirect('/aluno/index');
    }

    req.flash('success', 'Aluno apagado com sucesso.');
    req.session.save(() => res.redirect('/aluno/index'));
    return;
  } catch(e) {
    console.log('Erro no delete:', e);
    req.flash('errors', ['Erro interno ao excluir aluno.']);
    req.session.save(() => res.redirect('/aluno/index'));
  }
};