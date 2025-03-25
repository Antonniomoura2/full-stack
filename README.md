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

- orders-service
cd lambda

# Instalar dependências
npm install

# Construir
sam build

# Rodar localmente com um evento de teste
 sam build && sam local invoke processOrderFunction


 cd backend/ecommerce-backend/src/seed/ && node seed.js
