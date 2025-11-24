// routes.js - CORRIGIDO
const express = require('express');
const route = express.Router();

const cursoController = require('./src/controllers/cursoController');
const homeController = require('./src/controllers/homeController');
const loginController = require('./src/controllers/loginController');
const alunoController = require('./src/controllers/alunoController');

const { loginRequired } = require('./src/middlewares/middleware');

// Rotas da home
route.get('/', homeController.index);

// Rotas de login
route.get('/login/index', loginController.index);
route.post('/login/register', loginController.register);
route.post('/login/login', loginController.login);
route.get('/login/logout', loginController.logout);

// Rotas de aluno - CORRIGIDAS
route.get('/aluno', loginRequired, alunoController.cadastro); // Formulário de cadastro
route.get('/aluno/index', loginRequired, alunoController.index); // Lista de alunos
route.post('/aluno/register', loginRequired, alunoController.register);
route.get('/aluno/index/:id', loginRequired, alunoController.editIndex);
route.post('/aluno/edit/:id', loginRequired, alunoController.edit);
route.get('/aluno/delete/:id', loginRequired, alunoController.delete);

// Rotas de curso
route.get('/curso', loginRequired, cursoController.list);
route.get('/curso/index', loginRequired, cursoController.index); 
route.post('/curso/register', loginRequired, cursoController.register);
route.get('/curso/index/:id', loginRequired, cursoController.editIndex);
route.post('/curso/edit/:id', loginRequired, cursoController.edit);
route.get('/curso/delete/:id', loginRequired, cursoController.delete);

module.exports = route;