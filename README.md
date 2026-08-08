# Movie Ticket Booking System

A full-stack cinema ticket booking application with a Next.js frontend and an Express/TypeScript backend.

## Project Structure

```txt
movie-ticket-booking/
├── backend/   # Express API, Sequelize models, MySQL database scripts
└── frontend/  # Next.js 16 app, React 19 UI, booking/admin screens
```

There is no root `package.json`; run install/build commands inside each app folder.

## Tech Stack

Backend:
- Node.js
- Express.js
- TypeScript
- Sequelize
- MySQL
- JWT authentication
- Joi validation
- Helmet, CORS, Morgan

Frontend:
- Next.js 16
- React 19
- Tailwind CSS
- Radix UI
- Lucide React icons
- Recharts

## Local Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Create the MySQL database:

```sql
CREATE DATABASE IF NOT EXISTS cinemahub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Run schema sync and seed demo data:

```bash
npm run migrate
npm run seed
npm run dev
```

Backend runs on:

```txt
http://localhost:3001
http://localhost:3001/api/v1/health
```

## Local Frontend Setup

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

For local development, set:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

Frontend runs on:

```txt
http://localhost:3000
```

## Production Build

Backend:

```bash
cd backend
npm install --include=dev
npm run build
npm run start
```

Frontend:

```bash
cd frontend
npm install --legacy-peer-deps --include=dev
npm run build
npm run start
```

The frontend includes `.npmrc` with `legacy-peer-deps=true` to support the current React 19 and `vaul` dependency combination.

## Important Database Notes

`npm run migrate` is safe by default and creates missing tables without dropping data.

Only use these flags intentionally:

```env
DB_SYNC_ALTER=true
DB_SYNC_FORCE=true
```

`DB_SYNC_FORCE=true` drops and recreates all tables.

## Demo Login

After seeding:

```txt
Admin: admin@cinemahub.com / admin123
User: john.doe@example.com / user123
User: jane.smith@example.com / user123
```

## Ubuntu/Nginx Hosting

Use [HOSTING-GUIDE.md](./HOSTING-GUIDE.md) for the full production steps for `cambocine.online`.
