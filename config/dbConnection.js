// 1. Importa o módulo sqlite3
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// 2. Define a função principal de conexão que retorna a instância do banco de dados
const connectDB = function() {
    // Define o caminho absoluto para o arquivo do banco de dados.
    // O path.resolve garante que o caminho para 'data/GestaoCurso.db' está correto.
    const dbPath = path.resolve(__dirname, '..', 'data', 'GestaoCurso.db');
    
    // Conecta/Cria o banco de dados.
    // Usamos new sqlite3.Database para criar a conexão.
    const db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('Erro ao conectar ao banco de dados SQLite:', err.message);
        } else {
            // Este log aparece toda vez que uma conexão é aberta (incluindo o setup e controllers)
            console.log('Conexão SQLite estabelecida com o arquivo:', dbPath);
        }
    });

    return db;
};

// 3. Exporta a função de conexão diretamente.
// Isso permite que o código chame application.config.dbConnection()
module.exports = connectDB;
