require('dotenv').config();
const express = require('express');
const app = express();

// NOVOS PACOTES (E OBRIGATÓRIO: sqlite3, que deve estar instalado)
const session = require('express-session');
const { Sequelize } = require('sequelize'); // Importa Sequelize corretamente
const SequelizeStore = require('connect-session-sequelize')(session.Store);



const sequelize = require('./src/database/sequelize');

// Importe os modelos individualmente
require('./src/models/CursoModel');
require('./src/models/AlunoModel');
require('./src/models/LoginModel');
require('./src/models/HomeModel');


// 2. SINCRONIZAÇÃO E EMITIR 'PRONTO'
// O sequelize.sync() agora terá conhecimento de todas as models importadas acima
sequelize.sync({ force: false }) // use { force: true } APENAS se quiser dropar e recriar as tabelas
    .then(() => {
        // Assegura que a tabela de sessões existe
        return sequelize.models.Session.sync();
    })
    .then(() => {
        app.emit('pronto');
    })
    .catch(e => console.log('ERRO DE CONEXÃO COM SQLITE:', e));


// 3. CONFIGURAÇÃO DA SESSÃO USANDO SQLITE
const sessionStore = new SequelizeStore({
    db: sequelize,
    tableName: 'Session', // Nome da tabela que armazenará as sessões
});

const flash = require('connect-flash');
const routes = require('./routes');
const path = require('path');
const csrf = require('csurf');
const { middlewareGlobal, checkCsrfError, csrfMiddleware } = require('./src/middlewares/middleware');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')));

// Apenas alteramos o 'store'
const sessionOptions = session({
    secret: 'akasdfj0út23453456+54qt23qv  qwf qwer qwer qewr asdasdasda a6()',
    store: sessionStore, // AGORA USA O STORE DO SQLITE
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
});

app.use(sessionOptions);
app.use(flash());

app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

app.use(csrf());
// Nossos próprios middlewares
app.use(middlewareGlobal);
app.use(checkCsrfError);
app.use(csrfMiddleware);
app.use(routes);

app.on('pronto', () => {
    app.listen(3000, () => {
        console.log('Acessar http://localhost:3000');
        console.log('Servidor executando na porta 3000');
    });
});