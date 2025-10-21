module.exports.alunos = function(application,req,res){

    var connection = application.config.dbConnection();
    var alunosModel = new application.app.models.AlunosDAO(connection);

    alunosModel.getAlunos(function (error, result) {
        res.render('faculdade/alunos', { alunos: result });
    });

}

