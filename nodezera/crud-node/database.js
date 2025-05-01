const sqlite3 = require('sqlite3').verbose();

// Criando banco de dados em memória para testes
const db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        console.error('Erro ao criar banco de dados:', err.message);
        process.exit(1);
    }
    console.log('Banco de dados criado com sucesso');
});

// Criando tabela sem restrições e limpando dados existentes
db.serialize(() => {
    // Removendo tabela se existir
    db.run('DROP TABLE IF EXISTS items');
    
    // Criando tabela nova
    db.run(`CREATE TABLE items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT
    )`);
    
    console.log('Tabela items criada/resetada com sucesso');
});

module.exports = db;