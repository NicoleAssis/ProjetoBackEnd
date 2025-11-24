require('dotenv').config();
const express = require('express');
const app = express();

// PACOTES
const session = require('express-session');
const { Sequelize } = require('sequelize');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const flash = require('connect-flash');
const routes = require('./routes');
const path = require('path');
const csrf = require('csurf');
const { middlewareGlobal, checkCsrfError, csrfMiddleware } = require('./src/middlewares/middleware');

const sequelize = require('./src/database/sequelize');

// 1. CONFIGURAÇÕES BÁSICAS DO EXPRESS (PRIMEIRO)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')));
app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

// 2. CONFIGURAÇÃO DA SESSÃO
const sessionStore = new SequelizeStore({
    db: sequelize,
    tableName: 'Session',
});

const sessionOptions = session({
    secret: 'akasdfj0út23453456+54qt23qv qwf qwer qwer qewr asdasdasda a6()',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
});

app.use(sessionOptions);
app.use(flash());

// 3. CSRF E MIDDLEWARES GLOBAIS
app.use(csrf());
app.use(middlewareGlobal);
app.use(checkCsrfError);
app.use(csrfMiddleware);

// 4. ROTAS (POR ÚLTIMO)
app.use(routes);

// 5. IMPORTAR MODELOS E SINCRONIZAR
console.log('🔄 Importando modelos...');
require('./src/models/CursoModel');
require('./src/models/AlunoModel');
require('./src/models/LoginModel');
require('./src/models/HomeModel');

// 6. SINCRONIZAÇÃO DO BANCO
console.log('🔄 Sincronizando banco de dados...');
sequelize.sync({ force: false })
    .then(() => {
        console.log('Tabelas sincronizadas com sucesso');
        return sequelize.models.Session ? sequelize.models.Session.sync() : Promise.resolve();
    })
    .then(() => {
        console.log('Tabela de sessões pronta');
        app.emit('pronto');
    })
    .catch(e => {
        console.log(' ERRO DE CONEXÃO COM SQLITE:', e);
        process.exit(1);
    });

// 7. INICIAR SERVIDOR
app.on('pronto', () => {
    app.listen(3000, () => {
        console.log('Servidor executando na porta 3000');
        console.log('Acessar: http://localhost:3000');
        console.log('Lista de alunos: http://localhost:3000/aluno/index');
        console.log('Cadastrar aluno: http://localhost:3000/aluno');
    });
});