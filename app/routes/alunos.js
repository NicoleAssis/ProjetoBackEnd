module.exports = function (application) {

    application.get('/alunos', function (req, res) {

        application.app.controllers.alunos.alunos(application,req,res);

    });


}