const csrf = require('csurf');

// Configuração do CSRF
const csrfProtection = csrf({
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 3600000 // 1 hora
    }
});

// Middleware para adicionar token CSRF 
const addCsrfToken = (req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
};

// Middleware para verificar a origem da requisição
const checkOrigin = (req, res, next) => {
    if (process.env.NODE_ENV !== 'production') {
        return next();
    }

    const origin = req.get('origin');
    const referer = req.get('referer');
    
    // Lista de origens permitidas
    const allowedOrigins = ['http://localhost:3000'];
    
    // Verificar se a origem está na lista de permitidas
    if (origin && !allowedOrigins.includes(origin)) {
        console.warn('Tentativa de acesso de origem não permitida:', origin);
        return res.status(403).json({
            error: 'Origem não permitida',
            message: 'Esta origem não tem permissão para acessar este recurso'
        });
    }
    
    // Verificar se o referer é válido para requisições 
    if (req.method !== 'GET' && referer) {
        const refererUrl = new URL(referer);
        if (!allowedOrigins.includes(refererUrl.origin)) {
            console.warn('Referer inválido detectado:', referer);
            return res.status(403).json({
                error: 'Referer inválido',
                message: 'A origem do referer não é permitida'
            });
        }
    }
    
    // Adicionar headers de segurança
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'same-origin');
    
    next();
};

module.exports = {
    csrfProtection,
    addCsrfToken,
    checkOrigin
}; 