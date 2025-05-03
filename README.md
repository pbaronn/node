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
## Pré-requisitos

Antes de começar, você precisa ter as seguintes ferramentas instaladas em seu sistema:

- **Node.js + npm:** - O npm vem com o Node.js
- **XAMPP:** Para rodar o banco de dados MySQL
- **Git:**  Para clonar o repositório
- **POSTMAN**


## Verifique as instalações:
### Node.js: 
Após a instalação, abra o terminal (CMD) e execute:
```bash
node -v
npm -v
```
#### Isso deve mostrar as versões do Node e npm.

### Git:
Verifique a instalação executando:
```bash
git --version
```
## Para Clonar o Repositório do GitHub
No terminal, vá até o diretório onde deseja clonar o repositório:
```bash
cd C:\Users\silva\Desktop\seu-local
git clone https://github.com/pbaronn/node
cd node
```
## Instalando Dependências do Projeto
### 1 - Acessar a pasta correta
O arquivo index.js está dentro da subpasta *crud-node*, acesse o diretório:
```bash
cd nodezera\crud-node
```
### 2 - Instale as dependências do projeto:
Na pasta do projeto execute:
```bash
npm install
```
## Para Rodar o Servidor
Digite o comando:
```bash
node index.js
ou
npm run dev
```
## Verificando a API no Navegador
### Verifique se o servidor está rodando corretamente. 
Se o terminal mostrar algo como "Server is running on http://localhost:3000", você pode acessar a API pelo navegador:
http://localhost:3000


### Dicas para Evitar Erros:
 - Verifique o arquivo package.json para ver se há scripts personalizados (como start, dev, etc.).
Considere usar o npm audit fix se houver vulnerabilidades detectadas.
 - Verifique as configurações de conexão com o banco de dados, **XAMPP** ativo.


--------

No postman

GET http://localhost:3000


    Intruções das Injeções em
https://github.com/pbaronn/neyn2_node/blob/main/Pentesting.pdf

