// // controller.admin.js
// // Lembre-se de adicionar: 
// const { validationResult } = require('express-validator');

// module.exports.formulario_inclusao_noticia = function(application,req,res)
// {
//     res.render("admin/form_add_noticia",{validacao:{},noticia:{}})
// }

// module.exports.noticias_salvar = function(application,req,res){
//     // As chamadas a body() foram REMOVIDAS daqui pois causam ERRO DE SINTAXE.
//     // Elas DEVEM estar na ROTA.
    
//     var noticia = req.body;
    
//     // 4. Coleta dos Erros
//     const errors = validationResult(req); 
    
//     // *******************************************************
//     // *** CONSOLE.LOG DOS ERROS PARA DEBUG ************
//     // *******************************************************
//     if (!errors.isEmpty()) {
//         console.log('--- ERROS DE VALIDAÇÃO ---');
//         console.log(errors.array()); 
//         console.log('--------------------------');
//     }
//     // *******************************************************

//     if (!errors.isEmpty()) {
//         // Se houver erros, renderiza a página novamente com os erros e os dados
//         res.render('admin/form_add_noticia', { validacao: errors.array(), noticia: noticia });
//         return;
//     }

//     // Se não houver erros, prossegue com o salvamento no banco
//     var connection = application.config.dbConnection();
//     var noticiasModel = new application.app.models.NoticiasDAO(connection);

//     noticiasModel.salvarNoticia(noticia, function (error, result) {
//         // Se salvar com sucesso, redireciona para a lista de notícias
//         res.redirect('/noticias');
//     });
// }