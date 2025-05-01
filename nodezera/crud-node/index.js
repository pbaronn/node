const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const routes = require('./routes');
const { csrfProtection, addCsrfToken, checkOrigin } = require('./middleware/csrf-protection');

const app = express();

// Middlewares 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser('chave-super-secreta-para-cookies')); // Cookie parser com chave secreta

// Configuração de sessão 
app.use(session({
    secret: 'outra-chave-super-secreta-para-sessao',
    name: 'sessionId', 
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'lax', 
        path: '/',
        maxAge: 1800000 
    }
}));

// Verificação de origem para todas as rotas
app.use(checkOrigin);

// Servir arquivos estáticos com headers de segurança
app.use(express.static('public', {
    setHeaders: (res, path, stat) => {
        res.set('X-Content-Type-Options', 'nosniff');
        res.set('X-Frame-Options', 'DENY');
    }
}));

// Aplicar proteção CSRF em todas as rotas 
app.use('/api', csrfProtection, addCsrfToken, routes);

// Página inicial com formulário protegido
app.get('/', csrfProtection, addCsrfToken, (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Página Protegida</title>
            <meta name="referrer" content="same-origin">
        </head>
        <body>
            <h1>Página Inicial Segura</h1>
            <p>Esta página está protegida contra CSRF</p>
            <a href="/api/profile">Ir para o perfil</a>
        </body>
        </html>
    `);
});

// Manipulador de erros CSRF 
app.use((err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
        console.error('Tentativa de CSRF detectada:', {
            url: req.url,
            method: req.method,
            origin: req.get('origin'),
            ip: req.ip
        });
        
        return res.status(403).send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Erro de Segurança</title>
            </head>
            <body>
                <h1> Erro de Segurança</h1>
                <p>Tentativa de CSRF detectada e bloqueada!</p>
                <p>Esta requisição foi bloqueada por motivos de segurança.</p>
                <p><a href="/api/profile">Voltar à página segura</a></p>
            </body>
            </html>
        `);
    }
    next(err);
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log('Proteção CSRF reforçada ativada!');
}); 