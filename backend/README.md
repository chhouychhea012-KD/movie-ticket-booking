# Movie Ticket Booking System - Backend API

A professional Node.js/Express REST API for a movie ticket booking system with MySQL database.

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/           # Database and app configuration
│   ├── controllers/      # Request handlers
│   ├── database/
│   │   ├── migrations/   # Database migrations
│   │   └── seeders/     # Seed data
│   ├── middleware/       # Auth & error handling
│   ├── models/           # Sequelize models
│   ├── routes/          # API routes
│   ├── validators/      # Request validation
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   └── index.ts         # App entry point
├── package.json
├── tsconfig.json
└── .env
```

## 🚀 Features

### Authentication & Authorization
- JWT-based authentication
- Secure password hashing with bcrypt
- Role-based access control (user, admin, staff, owner)
- Token validation middleware

### Movies Management
- CRUD operations for movies
- Search and filter functionality
- Now showing / Coming soon categories
- Featured movies

### Cinema Management
- CRUD operations for cinemas
- City-based filtering
- Screen management

### Showtimes Management
- CRUD operations for showtimes
- Date-based filtering
- Available seats tracking

### Bookings
- Create new bookings with seat selection
- Apply coupon discounts
- View booking history
- Cancel bookings (restore seats)

### Coupons
- Create and manage discount codes
- Percentage and fixed discounts
- Validation with minimum purchase requirements

### Analytics (Admin)
- Dashboard statistics
- Revenue reports
- Movie analytics

## 🔧 Installation & Setup

### Prerequisites
- Node.js 18+
- MySQL 8.0+
- npm or yarn

### Installation

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
# Copy .env.example to .env and update values
cp .env.example .env
```

Update `.env` with your database credentials:
```
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_NAME=cinemahub
DB_USER=root
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
```

4. Run migrations to create tables:
```bash
npm run migrate
```

5. Seed initial data:
```bash
npm run seed
```

6. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3001/api/v1`

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/auth/register` | Register new user | Public |
| POST | `/auth/login` | Login user | Public |
| GET | `/auth/profile` | Get user profile | Private |
| PUT | `/auth/profile` | Update profile | Private |
| PUT | `/auth/change-password` | Change password | Private |
| POST | `/auth/favorites` | Add favorite movie | Private |
| DELETE | `/auth/favorites/:id` | Remove favorite | Private |

### Movies
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/movies` | Get all movies | Public |
| GET | `/movies/now-showing` | Get now showing | Public |
| GET | `/movies/coming-soon` | Get coming soon | Public |
| GET | `/movies/featured` | Get featured | Public |
| GET | `/movies/search` | Search movies | Public |
| GET | `/movies/:id` | Get movie by ID | Public |
| POST | `/movies` | Create movie | Admin |
| PUT | `/movies/:id` | Update movie | Admin |
| DELETE | `/movies/:id` | Delete movie | Admin |

### Cinemas
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/cinemas` | Get all cinemas | Public |
| GET | `/cinemas/cities` | Get all cities | Public |
| GET | `/cinemas/:id` | Get cinema by ID | Public |
| GET | `/cinemas/city/:city` | Get by city | Public |
| POST | `/cinemas` | Create cinema | Admin |
| PUT | `/cinemas/:id` | Update cinema | Admin |
| DELETE | `/cinemas/:id` | Delete cinema | Admin |

### Showtimes
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/showtimes` | Get all showtimes | Public |
| GET | `/showtimes/available` | Get available | Public |
| GET | `/showtimes/:id` | Get by ID | Public |
| POST | `/showtimes` | Create showtime | Admin |
| PUT | `/showtimes/:id` | Update showtime | Admin |
| DELETE | `/showtimes/:id` | Delete showtime | Admin |

### Bookings
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/bookings` | Create booking | Private |
| GET | `/bookings` | Get user bookings | Private |
| GET | `/bookings/:id` | Get booking by ID | Private |
| DELETE | `/bookings/:id` | Cancel booking | Private |
| GET | `/bookings/all` | Get all bookings | Admin |
| GET | `/bookings/ticket/:code` | Get by ticket code | Public |
| PUT | `/bookings/:id/status` | Update status | Admin |

### Coupons
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/coupons` | Get all coupons | Admin |
| GET | `/coupons/:code` | Get by code | Public |
| POST | `/coupons/validate` | Validate coupon | Public |
| POST | `/coupons` | Create coupon | Admin |
| PUT | `/coupons/:id` | Update coupon | Admin |
| DELETE | `/coupons/:id` | Delete coupon | Admin |

### Analytics
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/analytics/dashboard` | Dashboard stats | Admin |
| GET | `/analytics/revenue` | Revenue report | Admin |
| GET | `/analytics/movies/:id` | Movie analytics | Admin |

## 🔐 Authentication

All private endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_token>
```

### Example Login Request
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@cinemahub.com", "password": "admin123"}'
```

### Example Authenticated Request
```bash
curl -X GET http://localhost:3001/api/v1/movies \
  -H "Authorization: Bearer <your_token>"
```

## 🧪 Testing Default Users

After seeding, you can test with these credentials:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@cinemahub.com | admin123 |
| User | john.doe@example.com | user123 |
| User | jane.smith@example.com | user123 |

## 📝 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [ ... ]
}
```

## 🛠️ Technologies

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MySQL with Sequelize ORM
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **Validation:** Joi
- **Security:** Helmet, CORS

## 📄 License

MIT License