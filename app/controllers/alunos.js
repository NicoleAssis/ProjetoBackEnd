// app/controllers/alunos.js

module.exports.alunos = function(application, req, res){

    // 1. Acessa a conexão (chamada dupla, conforme a dbConnection)
    const db = application.config.dbConnection()(); 
    const alunosModel = new application.app.models.AlunosDAO(db);

    alunosModel.getAlunos(function (error, result) {
        
        // **********************************************
        // 🚨 PASSO CRUCIAL: Tratar o erro antes de usar o 'result'
        // **********************************************
        if (error) {
            console.error("ERRO ao buscar alunos:", error);
            // Em caso de erro, enviamos uma Array vazia para a View.
            // É importante também fechar a conexão no erro.
            db.close();
            return res.render('faculdade/alunos', { alunos: [] }); 
        }

        // Garante que o resultado é uma Array (mesmo que vazia, se não houver registros)
        const listaAlunos = Array.isArray(result) ? result : [];

        res.render('faculdade/alunos', { alunos: listaAlunos });
        
        // Fecha a conexão após o uso
        db.close(); 
    });
}