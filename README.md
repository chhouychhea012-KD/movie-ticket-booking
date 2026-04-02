# Movie Ticket Booking System

A full-stack movie ticket booking application with a Next.js frontend and Express.js backend.

## Prerequisites

- Node.js (v18+)
- MySQL (v8.0+)
- npm or yarn

## Project Structure

```
movie-ticket-booking/
├── frontend/          # Next.js application
└── backend/          # Express.js API
```

---

## Backend Setup

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Then edit `.env` with your database credentials:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=cinemahub
DB_USER=root
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Encryption Key
ENCRYPTION_KEY=your_32_character_encryption_key
```

### 4. Create Database

Create a MySQL database named `cinemahub`:

```sql
CREATE DATABASE cinemahub;
```

### 5. Run Migrations

```bash
npm run migrate
```

### 6. (Optional) Seed Database

```bash
npm run seed
```

### 7. Start Backend Server

```bash
npm run dev
```

The backend API will run at `http://localhost:3001`

---

## Frontend Setup

### 1. Navigate to Frontend Directory

```bash
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` if needed (default values work for local development).

### 4. Start Frontend Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

---

## Available Scripts

### Backend

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm run start` | Start production server |
| `npm run migrate` | Run database migrations |
| `npm run seed` | Seed database with sample data |

### Frontend

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## Tech Stack

### Backend
- Express.js
- Sequelize (MySQL)
- JWT Authentication
- TypeScript

### Frontend
- Next.js 16
- React 19
- Tailwind CSS
- Radix UI Components

---

## Troubleshooting

### MySQL Connection Issues
- Ensure MySQL is running
- Verify database credentials in `.env`
- Check that the database `cinemahub` exists

### Port Already in Use
- Backend default: 3001
- Frontend default: 3000
- Change ports in `.env` or `.env.local` if needed