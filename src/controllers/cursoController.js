// src/controllers/cursoController.js
const Curso = require('../models/CursoModel');

exports.index = (req, res) => {
  try {
    console.log('=== INDEX - Carregando formulário de curso ===');
    res.render('curso', {
      curso: {}
    });
  } catch(e) {
    console.log('Erro no index do curso:', e);
    req.flash('errors', ['Erro ao carregar formulário de curso.']);
    res.redirect('/curso');
  }
};

exports.register = async(req, res) => {
  try {
    console.log('=== REGISTER - Registrando novo curso ===');
    console.log('Dados recebidos:', req.body);

    const curso = new Curso(req.body);
    await curso.register();

    if(curso.errors.length > 0) {
      console.log('Erros de validação:', curso.errors);
      req.flash('errors', curso.errors);
      req.session.save(() => res.redirect(req.get('Referrer') || '/curso'));
      return;
    }

    req.flash('success', 'Curso registrado com sucesso.');
    
    if (curso.curso && curso.curso.id) {
      console.log('Curso registrado com ID:', curso.curso.id);
      req.session.save(() => res.redirect(`/curso/index/${curso.curso.id}`));
    } else {
      console.log('Curso registrado mas ID não disponível');
      req.session.save(() => res.redirect('/curso'));
    }
    return;
  } catch(e) {
    console.log('Erro completo no register do curso:', e);
    console.log('Stack trace:', e.stack);
    req.flash('errors', ['Erro interno ao registrar curso.']);
    req.session.save(() => res.redirect(req.get('Referrer') || '/curso'));
  }
};

exports.editIndex = async function(req, res) {
  try {
    console.log('=== EDIT INDEX - Carregando curso para edição ===');
    console.log('ID do curso:', req.params.id);
    
    if(!req.params.id) {
      req.flash('errors', ['ID do curso não fornecido.']);
      return res.redirect('/curso');
    }

    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      req.flash('errors', ['ID do curso inválido.']);
      return res.redirect('/curso');
    }

    const curso = await Curso.buscaPorId(id);
    if(!curso) {
      req.flash('errors', ['Curso não encontrado.']);
      return res.redirect('/curso');
    }

    console.log('Curso carregado:', curso.nome);

    res.render('curso', { 
      curso: curso
    });
  } catch(e) {
    console.log('Erro no editIndex do curso:', e);
    req.flash('errors', ['Erro interno ao carregar curso.']);
    res.redirect('/curso');
  }
};

exports.edit = async function(req, res) {
  try {
    console.log('=== EDIT - Editando curso ===');
    console.log('ID recebido para edição:', req.params.id);
    console.log('Dados do body:', req.body);
    
    if(!req.params.id) {
      req.flash('errors', ['ID do curso não fornecido.']);
      return res.redirect('/curso');
    }

    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      req.flash('errors', ['ID do curso inválido.']);
      return res.redirect('/curso');
    }
    
    const curso = new Curso(req.body);
    await curso.edit(id);

    if(curso.errors.length > 0) {
      console.log('Erros de validação na edição:', curso.errors);
      req.flash('errors', curso.errors);
      req.session.save(() => res.redirect(req.get('Referrer') || '/curso'));
      return;
    }

    req.flash('success', 'Curso editado com sucesso.');
    
    if (curso.curso && curso.curso.id) {
      console.log('Curso editado com ID:', curso.curso.id);
      req.session.save(() => res.redirect(`/curso/index/${curso.curso.id}`));
    } else {
      console.log('Curso editado mas ID não disponível');
      req.session.save(() => res.redirect('/curso'));
    }
    return;
  } catch(e) {
    console.log('Erro completo no edit do curso:', e);
    console.log('Stack trace:', e.stack);
    req.flash('errors', ['Erro interno ao editar curso.']);
    req.session.save(() => res.redirect(req.get('Referrer') || '/curso'));
  }
};

exports.delete = async function(req, res) {
  try {
    console.log('=== DELETE - Excluindo curso ===');
    console.log('ID para exclusão:', req.params.id);
    
    if(!req.params.id) {
      req.flash('errors', ['ID do curso não fornecido.']);
      return res.redirect('/curso');
    }

    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      req.flash('errors', ['ID do curso inválido.']);
      return res.redirect('/curso');
    }

    const curso = await Curso.delete(id);
    if(!curso) {
      req.flash('errors', ['Curso não encontrado para exclusão.']);
      return res.redirect('/curso');
    }

    req.flash('success', 'Curso apagado com sucesso.');
    req.session.save(() => res.redirect('/curso'));
    return;
  } catch(e) {
    console.log('Erro no delete do curso:', e);
    req.flash('errors', ['Erro interno ao excluir curso.']);
    req.session.save(() => res.redirect('/curso'));
  }
};

// Lista todos os cursos
exports.list = async function(req, res) {
  try {
    console.log('=== LIST - Listando todos os cursos ===');
    
    const cursos = await Curso.buscaCursos();
    
    console.log('Cursos encontrados:', cursos ? cursos.length : 0);
    if (cursos && cursos.length > 0) {
      cursos.forEach(curso => {
        console.log(`Curso: ${curso.nome} (${curso.codigo}) - ID: ${curso.id}`);
      });
    }

    res.render('cursos', { cursos: cursos || [] });
  } catch(e) {
    console.log('Erro ao listar cursos:', e);
    req.flash('errors', ['Erro interno ao carregar cursos.']);
    res.render('cursos', { cursos: [] });
  }
};