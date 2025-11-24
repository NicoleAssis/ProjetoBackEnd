// routes/aluno.js

module.exports = function (application) {

    application.get('/alunos', function (req, res) {

        // Apenas chame o método do controller, deixando-o receber req e res
        // Se o seu controller precisar da 'application' (por causa do dbConnection),
        // mantenha a passagem da 'application'.
        application.app.controllers.alunos.alunos(application, req, res);

    });
}