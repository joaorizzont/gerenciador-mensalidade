
# 🧪 Como executar

Este projeto utiliza o **Laravel Framework 12.21.0** e está configurado para rodar o banco MySQL via **Docker Compose**. Siga os passos abaixo para instalar e iniciar o ambiente de desenvolvimento:

## ⚙️ 1. Clonar o repositório

```bash
git clone https://github.com/joaorizzont/gerenciador-mensalidade.git
```

## 📦 2. Instalar dependências PHP (Laravel)

```bash
composer install
```

## 📦 3. Instalar dependências do Node (frontend)

```bash
npm install
```

## 🔑 4. Copiar o arquivo `.env`

```bash
cp .env.example .env
```

## 🧬 5. Rodar as migrations

```bash
php artisan migrate
```

## 🐳 6. Subir o ambiente com Docker Compose

```bash
docker-compose up -d
```

## ⚙️ 7. Execute o Backend

```
php artisan serve

```

## ⚙️ 8. Execute o Frontend

```
npm run dev
```

## ✅ Pronto!

O projeto estará disponível em: `http://localhost:8000`

---



**Laravel versão:** Laravel Framework 12.21.0
