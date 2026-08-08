# Movie Ticket Booking Backend API

Express/TypeScript REST API for the movie ticket booking system.

## Features

- JWT authentication
- Role-based access for user, staff, admin, and owner
- Movie CRUD and public movie browsing
- Cinema CRUD and public cinema browsing
- Showtime CRUD and public showtime browsing
- Booking creation, listing, cancellation, and status updates
- Ticket validation and validation statistics
- Payment listing, status updates, and payment statistics
- Coupon CRUD and coupon validation
- Notification CRUD and notification statistics
- User/customer CRUD and user statistics
- Dashboard analytics, revenue reports, movie analytics, and booking analytics
- MySQL persistence through Sequelize

## API Base

```txt
/api/v1
```

Health check:

```txt
GET /api/v1/health
```

## Setup

```bash
npm install
cp .env.example .env
npm run migrate
npm run seed
npm run dev
```

Production:

```bash
npm install --include=dev
npm run migrate
npm run build
npm run start
```

## Environment

```env
PORT=3001
NODE_ENV=production
DB_HOST=localhost
DB_PORT=3306
DB_NAME=cinemahub
DB_USER=cinema_user
DB_PASSWORD=strong_password_here
JWT_SECRET=change_this_to_a_long_random_secret
JWT_EXPIRE=7d
FRONTEND_URL=https://movie-ticket-booking.online
ENCRYPTION_KEY=change_this_32_character_key
DB_SYNC_ALTER=false
DB_SYNC_FORCE=false
```

## Migration Safety

By default, `npm run migrate` creates missing tables without dropping data.

Set `DB_SYNC_ALTER=true` only when you intentionally want Sequelize to alter existing tables.

Set `DB_SYNC_FORCE=true` only when you intentionally want to drop and recreate all tables.

## Main Endpoints

```txt
POST   /auth/register
POST   /auth/login
GET    /auth/profile
PUT    /auth/profile
PUT    /auth/change-password
POST   /auth/favorites
DELETE /auth/favorites/:movieId

GET    /movies
GET    /movies/now-showing
GET    /movies/coming-soon
GET    /movies/featured
GET    /movies/search
GET    /movies/:id
POST   /movies
PUT    /movies/:id
DELETE /movies/:id

GET    /cinemas
GET    /cinemas/cities
GET    /cinemas/city/:city
GET    /cinemas/:id
POST   /cinemas
PUT    /cinemas/:id
DELETE /cinemas/:id

GET    /showtimes
GET    /showtimes/available
GET    /showtimes/:id
POST   /showtimes
PUT    /showtimes/:id
DELETE /showtimes/:id

POST   /bookings
GET    /bookings
GET    /bookings/all
GET    /bookings/ticket/:ticketCode
GET    /bookings/:id
PUT    /bookings/:id/status
DELETE /bookings/:id

GET    /payments
GET    /payments/stats
GET    /payments/:id
PUT    /payments/:id/status

POST   /tickets/validate
GET    /tickets/recent
GET    /tickets/stats

GET    /notifications
GET    /notifications/stats
POST   /notifications
PUT    /notifications/read-all
PUT    /notifications/:id/read
DELETE /notifications/:id
DELETE /notifications

POST   /coupons/validate
GET    /coupons/:code
GET    /coupons
POST   /coupons
PUT    /coupons/:id
DELETE /coupons/:id

GET    /analytics/dashboard
GET    /analytics/revenue
GET    /analytics/bookings
GET    /analytics/movies/:movieId

GET    /users
GET    /users/stats
GET    /users/:id
POST   /users
PUT    /users/:id
DELETE /users/:id
```
