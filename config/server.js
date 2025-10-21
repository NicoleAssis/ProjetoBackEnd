// var express = require('express');
// var consign = require('consign');
// var bodyParser = require('body-parser'); 

// const { body, validationResult } = require('express-validator');


// var app = express();

// app.use(bodyParser.urlencoded({ extended: true }));

// // Esta é para dados JSON, geralmente API (bom ter, mas não essencial para formulário):
// app.use(bodyParser.json()); 
// // app.use(expressValidator());

// app.set('view engine', 'ejs');
// app.set('views', './app/views');


// consign()
//     .include('app/routes.js')
//     .then('config/dbConnection.js')
//     .then('app/models.js')
//     .then('app/controllers.js')
//     .into(app);

// module.exports = app;

var express = require('express');
var consign = require('consign');
var bodyParser = require('body-parser'); 

const { body, validationResult } = require('express-validator');


var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 

app.set('view engine', 'ejs');
app.set('views', './app/views');


consign()
    // 1. Corrigido: Incluir a PASTA 'app/routes' (e não um arquivo 'app/routes.js')
    .include('app/routes')
    .then('config/dbConnection.js')
    // 2. Corrigido: Incluir a PASTA 'app/models'
    .then('app/models')
    // 3. Corrigido: Incluir a PASTA 'app/controllers'
    .then('app/controllers')
    .into(app);

module.exports = app;