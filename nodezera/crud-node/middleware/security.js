const xss = require('xss');

// Função para sanitizar strings
const sanitizeString = (str) => {
    if (!str) return '';
    return xss(str.trim());
};

// Middleware de validação e sanitização
const sanitizeInputs = (req, res, next) => {
    if (req.body) {
        Object.keys(req.body).forEach(key => {
            if (typeof req.body[key] === 'string') {
                req.body[key] = sanitizeString(req.body[key]);
            }
        });
    }
    next();
};

// Middleware para headers de segurança
const securityHeaders = (req, res, next) => {
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'"
    );

    res.setHeader('X-XSS-Protection', '1; mode=block');  // Proteção XSS do navegador
    res.setHeader('X-Frame-Options', 'DENY'); // Prevenir clickjacking
    res.setHeader('X-Content-Type-Options', 'nosniff'); // Prevenir MIME-type sniffing
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Referrer-Policy', 'same-origin');

    next();
};

module.exports = {
    sanitizeInputs,
    securityHeaders,
    sanitizeString
}; 