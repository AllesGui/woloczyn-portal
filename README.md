# woloczyn E SCHMIDT – Portal de Triagem Jurídica

Sistema web para gestão de triagens jurídicas integradas com a IA generativa via n8n.

## 🚀 Tecnologias

- **Backend**: Node.js, Express, PostgreSQL, JWT
- **Frontend**: React (Vite), TypeScript, Tailwind CSS, Lucide React

## 📦 Como rodar localmente

### 1. Banco de Dados
1. Instale o PostgreSQL.
2. Crie um banco de dados chamado `woloczyn_db`.
3. Execute o script contido em `database/schema.sql` no seu banco de dados para criar as tabelas e o usuário padrão.

### 2. Backend
1. Navegue até a pasta `backend/`: `cd backend`
2. Instale as dependências com `npm install`
3. Copie o arquivo `.env.example` da pasta raiz para dentro da pasta `backend` com o nome `.env` e preencha as variáveis de banco de dados (`DB_PASSWORD` etc).
4. Inicie o servidor: `npm run dev`

### 3. Frontend
1. Abra um novo terminal.
2. Navegue até a pasta `frontend/`: `cd frontend`
3. Instale as dependências com `npm install`
4. O arquivo `.env` base (contendo a API_URL local) já está presente na pasta `frontend`.
5. Inicie a aplicação com `npm run dev`

A aplicação abrirá no seu navegador. O login padrão (criado automaticamente no script SQL) é:
- **Email**: admin@woloczyn.com.br
- **Senha**: admin123

## 🔗 Integração com n8n

O n8n deve realizar um POST para a URL do seu backend (`ex: http://localhost:3333/api/atendimentos`)
- **Headers**:
  - `x-api-key`: `CHAVE_SUPER_SECRETA`
- **Body**:
  ```json
  {
    "nome": "João Silva",
    "telefone": "55999999999",
    "area_juridica": "Trabalhista",
    "prioridade": "Alta",
    "resumo": "Breve resumo da AI"
  }
  ```

## ⚙️ Deploy em Produção

### Backend
1. Fazer deploy em uma plataforma como Railway, Render ou Heroku.
2. Configurar as Environmental Variables (ENVs) no painel do servidor.
3. Certificar-se de passar as ENVs corretas de conexão com o banco PostgreSQL gerenciado.

### Frontend
1. Fazer deploy na Vercel ou Netlify.
2. No painel da Vercel/Netlify, adicionar a variável `VITE_API_URL` apontando para a URL do Backend em produção (ex: `https://meu-backend.onrender.com/api`).
3. Certifique-se de que os comandos de build estão configurados (Build Command: `npm run build`, Output Directory: `dist`).
