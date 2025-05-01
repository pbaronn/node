# Proteção Completa em Node.js

Este projeto demonstra a implementação de proteções contra as principais vulnerabilidades web:
 
SQL/NoSQL Injection

Cross-Site Scripting (XSS)

Cross-Site Request Forgery (CSRF)


    Proteções Implementadas
 
1.SQL/NoSQL Injection
- Prepared Statements para SQL
- Sanitização de entrada para NoSQL
- Validação de parâmetros
- Escape de caracteres especiais

2. Cross-Site Scripting (XSS)
- Sanitização de saída HTML
- Content Security Policy (CSP)
- HttpOnly Cookies
- Headers de segurança XSS

3. Cross-Site Request Forgery (CSRF)
- Tokens CSRF- SameSite Cookies
- Validação de origem
- Proteção de sessão

      Pré-requisitos
Node.js 

npm 

MySQL ou MongoDB

POSTMAN

    Instalação
git clone

    Como Testar
npm start

-----
Com Xampp ativo

No vs code -> terminal -> node index.js

--------

No postman

GET http://localhost:3000


    Intruções das Injeções em
https://github.com/pbaronn/neyn2_node/blob/main/Pentesting.pdf

