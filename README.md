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

# Versão 2.0 - Com Sistema de Autenticação com JWT e MySQL

Este projeto é uma API RESTful construída com **Node.js**, **Express.js** e **MySQL**, que implementa autenticação com JWT, proteção de rotas e controle de acesso por ID de usuário.

## Como Rodar o Projeto Localmente

### 1. **Pré-requisitos**

- [Node.js](https://nodejs.org) instalado
- [MySQL](https://www.mysql.com/) instalado e em execução

---

### 2. **Baixar o arquivo nodezerav2.zip**
- Extraia a pasta matriz do arquivo zipado

### 3. **Instalar dependências**
```bash
npm install
```
### 3. **Configurar as variáveis de ambiente**
- Crie um arquivo .env na raiz do projeto com o seguinte conteúdo:
```env
PORT=3000
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=seu_banco
JWT_SECRET=sua_chave_secreta
```
### 4. **Importar o banco de dados**
- Execute o arquivo schema.sql no seu MySQL:
```bash
mysql -u seu_usuario -p seu_banco < schema.sql
``` 
### 5. **Iniciar o servidor**
```bash
npm start
```
## Para Rodar o Servidor
- Digite o comando:
```bash
node server.js
```
## Verificando a API no Navegador
### Verifique se o servidor está rodando corretamente. 
Se o terminal mostrar algo como "Server is running on http://localhost:3000", 
você pode acessar a API pelo navegador:
http://localhost:3000

## Rotas Principais
### Autenticação (/api)
```sql
POST /api/register – Cadastra um novo usuário
POST /api/login – Retorna um token JWT
```
## Usuário (/api/users)
```sql
GET /api/users – Lista usuários (token JWT necessário)
PUT /api/users/:id – Atualiza seus dados (token + ID compatível)
DELETE /api/users/:id – Exclui seu usuário (token + ID compatível)
```
Use o token retornado no login para autenticar as rotas protegidas.

## Testando com Postman
- Faça login via POST /api/login
- Copie o token retornado
- Vá em Headers da requisição protegida e adicione:
```sql
Key: Authorization
Value: Bearer SEU_TOKEN_AQUI
```
--------------------------------------------------------------------------
## Boas Práticas Utilizadas
- Separação de responsabilidades (rotas, middleware, config, etc.)
- Validação de permissões (apenas o próprio usuário pode editar/excluir)
- Uso de variáveis de ambiente com .env
- Middleware global de tratamento de erros



