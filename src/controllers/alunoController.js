// src/controllers/alunoController.js
const Aluno = require('../models/AlunoModel');

// Rota: GET /aluno - Formulário de cadastro de novo aluno
exports.cadastro = async (req, res) => {
  try {
    console.log('=== CADASTRO - Carregando formulário de aluno ===');
    
    const cursos = await Aluno.buscaCursosParaDropdown();
    
    console.log('Cursos para dropdown:', cursos ? cursos.length : 0);
    
    res.render('aluno', {
      aluno: {},
      cursos: cursos || [] 
    });
  } catch (e) {
    console.log('Erro ao carregar cursos no cadastro:', e);
    req.flash('errors', ['Erro ao carregar lista de cursos.']);
    res.render('aluno', {
      aluno: {},
      cursos: [] 
    });
  }
};

// Rota: GET /aluno/index - Lista todos os alunos
exports.index = async (req, res) => {
  try {
    console.log(' === ALUNO CONTROLLER INDEX ===');
    console.log('Rota: /aluno/index');
    
    const alunos = await Aluno.buscaAlunos();
    
    console.log(`Alunos encontrados: ${alunos ? alunos.length : 0}`);
    
    // DEBUG: Verificar se o template existe
    const fs = require('fs');
    const path = require('path');
    const templatePath = path.join(__dirname, '../views/index.ejs');
    const templateExists = fs.existsSync(templatePath);
    console.log('Template index.ejs existe?', templateExists);
    
    if (!templateExists) {
      console.log('❌ ERRO: Template index.ejs não encontrado!');
      return res.status(500).send('Template não encontrado');
    }
    
    // Forçar alguns dados de teste se não houver alunos
    const alunosParaRender = alunos && alunos.length > 0 ? alunos : [
      {
        id: 1,
        nome: 'João Silva',
        sobrenome: 'Teste',
        email: 'joao@teste.com',
        curso_id: null,
        curso: null
      },
      {
        id: 2, 
        nome: 'Maria Santos',
        sobrenome: 'Exemplo',
        email: 'maria@exemplo.com',
        curso_id: 1,
        curso: { nome: 'Matemática', codigo: 'MAT101' }
      }
    ];
    
    console.log('Renderizando template com dados...');
    
    res.render('index', {
      alunos: alunosParaRender,
      user: req.session.user
    });
    
    console.log('=== INDEX - RENDERIZAÇÃO CONCLUÍDA ===');
    
  } catch (e) {
    console.log('ERRO NO INDEX:', e);
    
    // Em caso de erro, tente renderizar com array vazio
    try {
      res.render('index', {
        alunos: [],
        user: req.session.user
      });
    } catch (renderError) {
      console.log('ERRO AO RENDERIZAR PÁGINA DE FALHA:', renderError);
      res.status(500).send('Erro interno do servidor');
    }
  }
};

// Rota: POST /aluno/register - Registrar novo aluno
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

// Rota: GET /aluno/index/:id - Carregar aluno para edição
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
    
    res.render('aluno', { 
      aluno: aluno,
      cursos: cursos || [] 
    });
  } catch(e) {
    console.log('Erro no editIndex:', e);
    req.flash('errors', ['Erro interno ao carregar aluno.']);
    res.redirect('/aluno/index');
  }
};

// Rota: POST /aluno/edit/:id - Editar aluno existente
exports.edit = async function(req, res) {
  try {
    console.log('=== EDIT - Editando aluno ===');
    console.log("ID recebido para edição:", req.params.id);
    console.log('Dados do body:', req.body);
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
    
    // Verifica se o aluno existe antes de editar
    const alunoExistente = await Aluno.buscaPorId(id);
    if(!alunoExistente) {
      req.flash('errors', ['Aluno não encontrado.']);
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
    
    console.log('Aluno editado com ID:', aluno.Aluno.id);
    req.session.save(() => res.redirect(`/aluno/index/${aluno.Aluno.id}`));
    return;
  } catch(e) {
    console.log('Erro no edit:', e);
    req.flash('errors', ['Erro interno ao editar aluno.']);
    req.session.save(() => res.redirect('back'));
  }
};

// Rota: GET /aluno/delete/:id - Excluir aluno
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