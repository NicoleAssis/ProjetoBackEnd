// // 1. IMPORTAÇÃO NECESSÁRIA do Express Validator
// const { body, validationResult } = require('express-validator');

// // Mantenha esta linha apenas se for estritamente necessária pelo Consign/estrutura do projeto.
// const noticias = require("./noticias"); 


// module.exports = function (application) {
    
//     // Rota para o formulário GET
//     application.get('/formulario_inclusao_noticia', function (req, res) {
//         // Ao renderizar o formulário pela primeira vez (GET), 
//         // é bom passar valores vazios para 'validacao' e 'noticia'
//         application.app.controllers.admin.formulario_inclusao_noticia(application,req,res);
//     });


//     application.post('/noticias/salvar', 
//         [
//             // 2. Middlewares de Validação (Array) - É aqui que eles devem estar!
//             body('titulo', 'Título é obrigatório').notEmpty(),
            
//             body('resumo', 'Resumo é obrigatório').notEmpty(),
//             body('resumo', 'Resumo deve conter entre 10 e 500 caracteres').isLength({ min: 10, max: 500 }),
            
//             body('autor', 'Autor é obrigatório').notEmpty(),
            
//             body('data_noticias', 'Data é obrigatória e deve estar no formato AAAA-MM-DD (ex: 2025-10-12)')
//                 .notEmpty()
//                 .isDate({ format: 'YYYY-MM-DD', strictMode: true }),

//             body('conteudo', 'Noticia é obrigatório').notEmpty(),
//         ], 
//         // Chama a função do controller que processa o resultado da validação
//         function(req, res){
//             application.app.controllers.admin.noticias_salvar(application, req, res);
//         }
//     );
// }