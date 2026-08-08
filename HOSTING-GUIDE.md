# Movie Ticket Booking Ubuntu/Nginx Hosting Guide

Domain: cambocine.online
Server IP: 44.200.223.38
App path: /var/www/html/movie-ticket-booking

## 1. Pull The Latest Release

```bash
cd /var/www/html/movie-ticket-booking
git fetch origin main
git reset --hard origin/main
git log -1 --oneline
```

## 2. Backend Environment

```bash
cd /var/www/html/movie-ticket-booking/backend
cp .env.example .env
nano .env
```

Use production values:

```env
PORT=3001
NODE_ENV=production
DB_HOST=localhost
DB_PORT=3306
DB_NAME=cambocine
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
JWT_SECRET=change_this_to_a_long_random_secret
JWT_EXPIRE=7d
FRONTEND_URL=https://cambocine.online
GOOGLE_CLIENT_ID=900896751182-351tedmbt8jq69acpbip5fmvir10092h.apps.googleusercontent.com
ENCRYPTION_KEY=change_this_32_character_key
DB_SYNC_ALTER=false
DB_SYNC_FORCE=false
```

Create the database if needed:

```bash
sudo mysql
CREATE DATABASE IF NOT EXISTS cambocine CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'cinema_user'@'localhost' IDENTIFIED BY 'strong_password_here';
GRANT ALL PRIVILEGES ON cambocine.* TO 'cinema_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## 3. Frontend Environment

```bash
cd /var/www/html/movie-ticket-booking/frontend
cp .env.local.example .env.local
nano .env.local
```

Use:

```env
NEXT_PUBLIC_API_URL=https://cambocine.online/api/v1
NEXT_PUBLIC_GOOGLE_CLIENT_ID=900896751182-351tedmbt8jq69acpbip5fmvir10092h.apps.googleusercontent.com
```

## 4. Install, Build, And Start

```bash
sudo chown -R ubuntu:ubuntu /var/www/html/movie-ticket-booking

cd /var/www/html/movie-ticket-booking/backend
rm -rf node_modules dist
npm install --include=dev
npm run migrate
npm run seed
npm run build
pm2 delete movie-backend || true
pm2 start npm --name movie-backend -- start

cd /var/www/html/movie-ticket-booking/frontend
rm -rf node_modules .next
npm install --legacy-peer-deps --include=dev
npm run build
pm2 delete movie-frontend || true
pm2 start npm --name movie-frontend -- start

pm2 save
pm2 status
```

After the first deploy, do not run `npm run seed` every release unless you want to refresh demo data. `npm run migrate` is safe by default and will not drop tables unless `DB_SYNC_FORCE=true`.

## 5. Nginx Config

```nginx
server {
    listen 80;
    server_name cambocine.online www.cambocine.online;

    location /api/v1/ {
        proxy_pass http://127.0.0.1:3001/api/v1/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable and reload:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 6. Checks

```bash
curl http://127.0.0.1:3001/api/v1/health
curl http://127.0.0.1:3000
curl http://cambocine.online/api/v1/health
curl http://cambocine.online
pm2 logs movie-backend --lines 50
pm2 logs movie-frontend --lines 50
```
