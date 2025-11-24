module.exports = function(application) {
    
    // 1. Obtém a instância do banco de dados SQLite (chama a função de conexão UMA VEZ)
    // Usamos a função exportada diretamente pelo dbConnection.js
    const db = application.config.dbConnection()();

    // 2. Executa os comandos SQL para criar a tabela se ela não existir
    db.serialize(() => {
        // Comando para criar a tabela Aluno
        db.run(`
            CREATE TABLE IF NOT EXISTS Aluno (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL
            )
        `, (err) => {
            if (err) {
                console.error("ERRO ao criar a tabela Aluno:", err.message);
            } else {
                console.log("✔️ Tabela 'Aluno' verificada/criada com sucesso.");
                
                // Exemplo de Inserção: Garante que haja pelo menos 1 registro para evitar o 'length' error na view
                db.get("SELECT COUNT(*) AS count FROM Aluno", (err, row) => {
                    // Se o banco de dados estiver vazio (contagem é 0), insere um registro de teste
                    if (row && row.count === 0) { 
                        db.run(`INSERT INTO Aluno (nome) VALUES (?)`, ['Aluno Teste Inicial'], function(insertErr) {
                            if (insertErr) {
                                console.error("ERRO ao inserir registro de teste:", insertErr.message);
                            } else {
                                console.log("✔️ Registro de teste inserido com sucesso (ID: " + this.lastID + ").");
                            }
                        });
                    }
                });
            }
        });

        // 3. Fechar a conexão de setup
        // É importante fechar a conexão de setup, pois o Controller abrirá a sua própria.
        db.close((err) => {
            if (err) {
                console.error('Erro ao fechar conexão de setup:', err.message);
            } else {
                console.log('Conexão de setup SQLite fechada.');
            }
        });
    });
};
