const express = require('express');
const router = express.Router();

// Middleware de validação de entrada
const validateInput = (req, res, next) => {
    const { name, email } = req.body;
    
    if (name && typeof name !== 'string') {
        return res.status(400).json({
            error: 'Formato inválido',
            message: 'O nome deve ser uma string'
        });
    }
    
    if (email && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        return res.status(400).json({
            error: 'Formato inválido',
            message: 'Email inválido'
        });
    }
    
    next();
};

// Rota protegida de perfil
router.get('/profile', (req, res) => {
    // Verifica se o usuário está autenticado
    if (!req.session.userId) {
        return res.status(401).send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Acesso Negado</title>
            </head>
            <body>
                <h1> Acesso Negado</h1>
                <p>Você precisa estar autenticado para acessar esta página.</p>
                <a href="/">Voltar para a página inicial</a>
            </body>
            </html>
        `);
    }
    
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Perfil do Usuário</title>
            <meta name="referrer" content="same-origin">
        </head>
        <body>
            <h1>Perfil do Usuário</h1>
            <form action="/api/profile/update" method="POST">
                <input type="hidden" name="_csrf" value="${res.locals.csrfToken}">
                <div>
                    <label for="name">Nome:</label>
                    <input type="text" id="name" name="name" required>
                </div>
                <div>
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" required>
                </div>
                <button type="submit">Atualizar Perfil</button>
            </form>
        </body>
        </html>
    `);
});

// Rota protegida de atualização de perfil
router.post('/profile/update', validateInput, (req, res) => {
    const { name, email } = req.body;
    res.json({
        success: true,
        message: 'Perfil atualizado com sucesso',
        data: { name, email }
    });
});

module.exports = router; 