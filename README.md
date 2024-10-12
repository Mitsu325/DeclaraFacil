# Declara Fácil

Este projeto é dividido em duas partes: o frontend, desenvolvido com Angular, e o backend, desenvolvido com NestJS. O sistema utiliza um banco de dados PostgreSQL, e é necessário que o servidor do banco de dados esteja configurado na máquina local para a execução do backend.

## Requisitos

- **Node.js** (versão >= 20.x)
- **Angular CLI** (versão >= 18.x)
- **NestJS CLI**
- **PostgreSQL** (deve estar instalado e configurado)
- **npm** (gerenciador de pacotes do Node.js)

## Configuração do Banco de Dados

Certifique-se de ter o PostgreSQL instalado e rodando na sua máquina. Você precisará configurar um banco de dados e garantir que as credenciais estejam corretas no arquivo `.env` (explicado abaixo).

## Configuração do Backend

1. Entre na pasta `backend`:
   ```bash
   cd backend
   ```

2. Instale as dependências do projeto:
   ```bash
   npm install
   ```

3. Copie o arquivo .env.example e renomeie-o para .env:
   ```bash
   cp .env.example .env
   ```

4. Preencha as variáveis de ambiente no arquivo .env com os valores apropriados:
   ```bash
	DATABASE_HOST=localhost
	DATABASE_PORT=5432
	DATABASE_USER=seu_usuario_postgres
	DATABASE_PASSWORD=sua_senha_postgres
	DATABASE_NAME=nome_do_banco_de_dados

	JWT_SECRET=seu_segredo_jwt

	SUPABASE_URL=sua_url_supabase
	SUPABASE_KEY=sua_chave_supabase
   ```

5. Execute o servidor do backend:
   ```bash
   npm run start
   ```

6. A documentação da API do backend, gerada com Swagger, estará disponível no navegador acessando o seguinte endereço:
   ```bash
   http://localhost:3000/api
   ```

## Configuração do Frontend

1. Entre na pasta frontend:
   ```bash
   cd frontend
   ```

2. Instale as dependências do projeto:
   ```bash
   npm install
   ```

3. Execute o servidor de desenvolvimento:
   ```bash
   npm run start
   ```

4. Acesse o frontend no navegador:
	http://localhost:4200

