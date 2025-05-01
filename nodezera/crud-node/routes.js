const express = require('express');
const router = express.Router();
const db = require('./database');
const { sanitizeString } = require('./middleware/security');

// Simula um usuário logado
const LOGGED_USER = {
    id: 1,
    username: 'usuario_teste',
    password: 'senha123'
};

let userPassword = "senha123";

// Rota para ver o perfil (com proteção CSRF)
router.get('/profile', (req, res) => {
    res.send(`
        <h1>Perfil do Usuário (Protegido contra CSRF)</h1>
        <p>Senha atual: ${userPassword}</p>
        
        <form action="/api/change-password" method="POST">
            <!-- Token CSRF oculto -->
            <input type="hidden" name="_csrf" value="${res.locals.csrfToken}">
            
            <div style="margin: 20px 0;">
                <input type="password" name="newPassword" placeholder="Nova senha" required>
                <button type="submit">Mudar Senha</button>
            </div>
        </form>
        
        <div style="margin-top: 20px;">
            <p><strong>Status:</strong> Protegido contra CSRF</p>
            <p><small>Um token único foi gerado para esta sessão.</small></p>
        </div>
    `);
});

// Rota para mudar senha (protegida contra CSRF)
router.post('/change-password', (req, res) => {
    const newPassword = req.body.newPassword;
    
    userPassword = newPassword;
    
    res.send(`
        <h1>Senha Alterada com Sucesso!</h1>
        <p>Nova senha: ${newPassword}</p>
        <p>O token CSRF foi validado</p>
        <a href="/api/profile">Voltar ao perfil</a>
    `);
});

// Rota vulnerável a XSS
router.get('/vulnerable-items', (req, res) => {
    db.all('SELECT * FROM items', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
        
        // Constroi HTML vulnerável 
        let html = `
        <html>
        <head>
            <title>Lista Vulnerável</title>
        </head>
        <body>
            <h1>Lista de Items (Vulnerável a XSS)</h1>
            <form method="POST" action="/api/vulnerable-items">
                <input type="text" name="name" placeholder="Digite um nome ou código HTML...">
                <button type="submit">Adicionar</button>
            </form>
            <ul>`;
        
        rows.forEach(item => {
            html += `<li>${item.name}</li>`;
        });
        
        html += `
            </ul>
        </body>
        </html>`;
        
        res.send(html);
    });
});

// Rota POST vulnerável - aceita qualquer input
router.post('/vulnerable-items', express.urlencoded({ extended: true }), (req, res) => {
    const name = req.body.name;
    
    db.run('INSERT INTO items (name) VALUES (?)', [name], (err) => {
        if (err) {
            console.error('Erro ao inserir:', err);
            return res.status(500).send('Erro ao inserir item');
        }
        res.redirect('/api/vulnerable-items');
    });
});

// Middleware de validação
const validateInput = {
    name: (name) => {
        const sanitized = sanitizeString(name);
        return sanitized.length >= 3 && sanitized.length <= 50;
    }
};

// CREATE - POST /api/items (Seguro)
router.post('/items', (req, res) => {
    const name = sanitizeString(req.body.name);

    if (!validateInput.name(name)) {
        return res.status(400).json({
            success: false,
            message: "Nome inválido. Use entre 3 e 50 caracteres."
        });
    }

    db.run('INSERT INTO items (name) VALUES (?)', [name], function(err) {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Erro ao criar item"
            });
        }
        res.redirect('/api/items');
    });
});

// READ - GET /api/items (Seguro)
router.get('/items', (req, res) => {
    db.all('SELECT * FROM items', [], (err, rows) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Erro ao listar items"
            });
        }

        const safeRows = rows.map(row => ({
            id: row.id,
            name: sanitizeString(row.name)
        }));

        let html = `
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Lista de Items</title>
                    <meta charset="UTF-8">
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        .container { max-width: 800px; margin: 0 auto; }
                        .form-group { margin-bottom: 20px; }
                        input[type="text"] { padding: 8px; width: 200px; }
                        button { padding: 8px 15px; background: #4CAF50; color: white; border: none; cursor: pointer; }
                        button:hover { background: #45a049; }
                        ul { list-style-type: none; padding: 0; }
                        li { padding: 8px; border-bottom: 1px solid #ddd; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Lista de Items (Segura)</h1>
                        
                        <!-- Formulário Seguro -->
                        <div class="form-group">
                            <form method="POST" action="/api/items">
                                <input type="text" name="name" placeholder="Digite um nome..." required minlength="3" maxlength="50">
                                <button type="submit">Adicionar Item</button>
                            </form>
                        </div>

                        <!-- Lista de Items -->
                        <ul>`;

        safeRows.forEach(item => {
            html += `<li>${item.name}</li>`;
        });

        html += `
                        </ul>
                    </div>
                </body>
            </html>`;

        res.send(html);
    });
});

// READ (Single) - GET /api/items/:id
router.get('/items/:id', (req, res) => {
    if (!validateInput.id(req.params.id)) {
        return res.status(400).json({
            success: false,
            message: "ID inválido"
        });
    }

    const stmt = db.prepare('SELECT * FROM items WHERE id = ?');
    
    try {
        const row = stmt.get(req.params.id);
        if (!row) {
            return res.status(404).json({
                success: false,
                message: "Item não encontrado"
            });
        }
        res.json({
            success: true,
            message: "Item encontrado com sucesso",
            data: row
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro ao buscar item"
        });
    } finally {
        stmt.finalize();
    }
});

// UPDATE - PUT /api/items/:id
router.put('/items/:id', (req, res) => {
    if (!validateInput.id(req.params.id)) {
        return res.status(400).json({
            success: false,
            message: "ID inválido"
        });
    }

    const name = req.body.name?.trim();
    if (!validateInput.name(name)) {
        return res.status(400).json({
            success: false,
            message: "Nome inválido. Use apenas letras e números, entre 3 e 50 caracteres."
        });
    }

    const stmt = db.prepare('UPDATE items SET name = ? WHERE id = ?');
    
    try {
        const result = stmt.run(name, req.params.id);
        if (result.changes === 0) {
            return res.status(404).json({
                success: false,
                message: "Item não encontrado"
            });
        }
        res.json({
            success: true,
            message: "Item atualizado com sucesso",
            data: { id: parseInt(req.params.id), name }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro ao atualizar item"
        });
    } finally {
        stmt.finalize();
    }
});

// DELETE - DELETE /api/items/:id
router.delete('/items/:id', (req, res) => {
    if (!validateInput.id(req.params.id)) {
        return res.status(400).json({
            success: false,
            message: "ID inválido"
        });
    }

    const stmt = db.prepare('DELETE FROM items WHERE id = ?');
    
    try {
        const result = stmt.run(req.params.id);
        if (result.changes === 0) {
            return res.status(404).json({
                success: false,
                message: "Item não encontrado"
            });
        }
        res.json({
            success: true,
            message: "Item removido com sucesso"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro ao remover item"
        });
    } finally {
        stmt.finalize();
    }
});

// SEARCH - GET /api/items/search
router.get('/items/search', (req, res) => {
    const searchTerm = req.query.name?.trim() || '';

    if (!validateInput.name(searchTerm)) {
        return res.status(400).json({
            success: false,
            message: "Termo de busca inválido"
        });
    }

    const stmt = db.prepare('SELECT * FROM items WHERE name LIKE ? LIMIT 50');
    
    try {
        const rows = stmt.all(`%${searchTerm}%`);
        res.json({
            success: true,
            message: "Busca realizada com sucesso",
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro ao realizar busca"
        });
    } finally {
        stmt.finalize();
    }
});

// Versão SEGURA - proteção contra XSS
router.get('/secure-items', (req, res) => {
    db.all('SELECT * FROM items', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
        
        // Função para escapar HTML
        const escapeHtml = (unsafe) => {
            return unsafe
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        };
        
        // Construindo HTML com dados escapados
        let html = '<html><head>';
        html += '<meta http-equiv="Content-Security-Policy" content="default-src \'self\'">';
        html += '</head><body>';
        html += '<h1>Lista de Items (Versão Segura)</h1>';
        html += '<ul>';
        
        rows.forEach(item => {
            
            html += `<li>${escapeHtml(item.name)}</li>`;
        });
        
        html += '</ul>';
        html += '</body></html>';
        
        // Envia resposta com headers de segurança
        res.setHeader('Content-Security-Policy', "default-src 'self'");
        res.setHeader('X-XSS-Protection', '1; mode=block');
        res.setHeader('Content-Type', 'text/html; charset=UTF-8');
        res.send(html);
    });
});

module.exports = router;