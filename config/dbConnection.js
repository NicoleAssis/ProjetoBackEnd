// index.js (ou app.js)

import express from "express";
// Importamos apenas o driver sqlite3, o módulo 'sqlite' (com Promises) NÃO será usado.
import sqlite3 from 'sqlite3'; 
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

// MIDDLEWARES DE PARSING DE CORPO
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let db; // Variável para a conexão com o banco de dados

// --- Lógica de Conexão com SQLite3 (Baseada em Callbacks) ---

const DB_FILE_PATH = path.resolve(path.resolve(), 'data', 'GestaoCurso.db');

const connectDB = () => {
    // Usamos o modo verbose para logs detalhados
    const database = new sqlite3.Database(DB_FILE_PATH, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
        if (err) {
            console.error('Erro ao conectar ao banco de dados SQLite:', err.message);
            // Saída fatal se a conexão falhar
            process.exit(1); 
        } else {
            console.log('Conexão SQLite estabelecida com o arquivo:', DB_FILE_PATH);
        }
    });

    return database;
};

// Função para configurar as tabelas (Usando Callbacks do sqlite3)
const setupTables = (database) => {
    return new Promise((resolve, reject) => {
        database.serialize(() => { // Garante que os comandos serão executados em ordem
            const createUsersTable = `
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    email TEXT NOT NULL UNIQUE
                );
            `;
            const createPostsTable = `
                CREATE TABLE IF NOT EXISTS posts (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    title TEXT NOT NULL,
                    content TEXT NOT NULL,
                    FOREIGN KEY (user_id) REFERENCES users(id)
                );
            `;

            // Executa a criação da tabela users
            database.run(createUsersTable, (err) => {
                if (err) {
                    return reject(new Error("Erro ao criar tabela 'users': " + err.message));
                }
            });

            // Executa a criação da tabela posts
            database.run(createPostsTable, (err) => {
                if (err) {
                    return reject(new Error("Erro ao criar tabela 'posts': " + err.message));
                }
                console.log('Tabelas verificadas/criadas com sucesso.');
                resolve();
            });
        });
    });
};

// --- Lógica de Inicialização (Combinando Conexão, Setup e Servidor) ---

const initializeDatabaseAndServer = async () => {
    try {
        // 1. Abrir a conexão
        db = connectDB(); 

        // 2. Criar Tabelas (Agora usa a Promise do setupTables)
        await setupTables(db);
        
        // 3. Iniciar o servidor (após o DB estar pronto)
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("❌ Erro ao iniciar o servidor ou banco de dados:", error.message);
        // Fechar a conexão do banco de dados em caso de falha de inicialização
        if (db) db.close(); 
        process.exit(1);
    }
};


// --- ROTAS DA API ---

// Adaptamos a Rota 1: Criar Usuário (POST /users)
app.post("/users", async (req, res) => {
    if (!req.body || !req.body.name || !req.body.email) {
        return res.status(400).json({ error: "Nome e email são obrigatórios e devem ser enviados no corpo JSON." });
    }
    
    const { name, email } = req.body;

    // Usamos db.run com Promise para manter o estilo async/await nas rotas
    const runAsync = (sql, params) => {
        return new Promise((resolve, reject) => {
            db.run(sql, params, function(err) {
                if (err) {
                    reject(err);
                } else {
                    // O `this` dentro do callback contém a propriedade lastID
                    resolve({ lastID: this.lastID }); 
                }
            });
        });
    };

    try {
        const result = await runAsync("INSERT INTO users(name, email) VALUES (?,?)", [name, email]);

        console.log("Inserted user ID", result.lastID);
        res.status(201).json({
            message: "User created successfully",
            userId: result.lastID,
        });
    } catch (error) {
        // Tratamento de erro específico (UNIQUE constraint)
        if (error.errno === 19) { 
            return res.status(409).json({ error: "Erro: Email já está em uso." });
        }
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Error creating user" });
    }
});

// Outras rotas (GET e POST /posts) precisariam de adaptações semelhantes para usar Promises
// sobre os métodos Callbacks do `sqlite3` (`db.get`, `db.all`, `db.run`).

// Inicia o processo de inicialização
initializeDatabaseAndServer();