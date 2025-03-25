# 🛒 Ecommerce Fullstack

Projeto completo com:

- ✅ Frontend: Next.js + Material UI
- ✅ Backend: Nest.js + MongoDB
- ✅ Lambda: Função AWS SAM que consolida dados do dashboard
- ✅ Docker Compose com MongoDB e LocalStack (S3)

---

## 🚀 Como rodar o projeto

### 1. Clone o repositório

```bash
git clone git@github.com:Antonniomoura2/full-stack.git
cd full-stack
cp ecommerce-backend/.env.sample ecommerce-backend/.env
cp ecommerce-frontend/.env.sample ecommerce-frontend/.env

// Editar o arquivo de hosts
vim /etc/hosts

// Adicionar essa linha no arquivo
127.0.0.1 localstack

Dentro do pasta ecommerce-backend
docker-compose up --build
```

## 🧠 orders-service (Lambda)

Este serviço é responsável por **sincronizar os dados do dashboard**, processando os pedidos (orders) para consolidar informações relevantes, como totais e métricas.

A função Lambda é construída com o **AWS SAM (Serverless Application Model)** e pode ser executada localmente para testes e desenvolvimento.

---

### 🔧 Como instalar o AWS SAM CLI

Para rodar o serviço localmente, é necessário instalar o SAM CLI

cd orders-service

### Instalar dependências
npm install

### Construir a função
sam build

### Rodar localmente com um evento de teste
sam local invoke processOrderFunction


cd backend/ecommerce-backend/src/seed/ && node seed.js

## 🌱 Seed: Popular o banco de dados com dados iniciais

Para facilitar os testes e o desenvolvimento, o projeto inclui um script de *seed* que insere produtos e pedidos iniciais no banco de dados MongoDB.

### ▶️ Como rodar o seed

```bash
cd backend/ecommerce-backend/src/seed/
node seed.js
```

## 🔧 Futuras melhorias

Este projeto foi desenvolvido com foco em funcionalidades principais. Não tendo tempo para  algumas melhorias que podem ser implementadas para torná-lo mais completa:

### 🔐 Autenticação e Autorização
- Implementar login com JWT ou OAuth2
- Criar níveis de acesso (admin, cliente)
- Proteger rotas e páginas sensíveis (ex: criação de pedidos, dashboard)

### 📦 Upload de imagens
- Adicionar upload de imagem do produto via frontend
- Salvar arquivos no S3 (já emulado com LocalStack)

### 📊 Dashboard com filtros e métricas
- Permitir visualizar métricas por período (últimos 7 dias, mês, etc)
- Adicionar gráficos e indicadores visuais

### 🧪 Testes
- Testes unitários no backend (usando Jest)
- Testes de integração e2e (ex: Cypress no frontend)

### 🔍 Busca e Paginação
- Adicionar campo de busca por nome do produto/pedido
- Implementar paginação na listagem de produtos e pedidos

### 🌐 Deploy
- Automatizar deploy com GitHub Actions
- Subir frontend no Vercel e backend/Lambda na AWS

---
