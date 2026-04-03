# Movie Ticket Booking - Deployment Guide

## Server Information
- **IP Address**: 52.62.180.96
- **Domain**: movie-ticket-booking.online
- **Clone Location**: /var/www/html

---

## Step 1: Connect to Server

```bash
ssh root@52.62.180.96
```

---

## Step 2: Update System & Install Dependencies

```bash
apt update && apt upgrade -y
```

### Install Node.js 18.x

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs
node -v
npm -v
```

### Install MySQL Server

```bash
apt install -y mysql-server
systemctl enable mysql
systemctl start mysql
mysql_secure_installation
```

---

## Step 3: Configure MySQL Database

```bash
mysql -u root -p
```

In MySQL shell:

```sql
CREATE DATABASE cinemahub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'cinemahub'@'localhost' IDENTIFIED BY 'YourStrongPassword123!';
GRANT ALL PRIVILEGES ON cinemahub.* TO 'cinemahub'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

## Step 4: Clone Project

```bash
cd /var/www/html
rm -rf html
git clone https://github.com/chhouychhea012-KD/movie-ticket-booking.git .
```

---

## Step 5: Install Frontend Dependencies & Build

```bash
cd /var/www/html/frontend
npm install
npm run build
```

---

## Step 6: Install Backend Dependencies

```bash
cd /var/www/html/backend
npm install
```

---

## Step 7: Configure Backend Environment

```bash
cd /var/www/html/backend
cp .env.example .env
```

Edit `.env` file:

```bash
nano .env
```

Update these values:

```env
PORT=3001
NODE_ENV=production
DB_HOST=localhost
DB_PORT=3306
DB_NAME=cinemahub
DB_USER=cinemahub
DB_PASSWORD=YourStrongPassword123!
JWT_SECRET=YourSecureJWTSecretKey123456789
JWT_EXPIRE=7d
FRONTEND_URL=http://52.62.180.96
ENCRYPTION_KEY=Your32CharacterEncryptionKey!
```

---

## Step 8: Run Database Migrations

```bash
cd /var/www/html/backend
npm run migrate
```

---

## Step 9: Install & Configure NGINX

```bash
apt install -y nginx
```

Create frontend config:

```bash
nano /etc/nginx/sites-available/movie-ticket-booking
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name movie-ticket-booking.online www.movie-ticket-booking.online 52.62.180.96;

    # Frontend (Next.js)
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API
    location /api/ {
        proxy_pass http://127.0.0.1:3001/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket support if needed
    location /socket.io/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```

Enable the site:

```bash
ln -s /etc/nginx/sites-available/movie-ticket-booking /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx
```

---

## Step 10: Create Systemd Services

### Backend Service

```bash
nano /etc/systemd/system/movie-backend.service
```

```ini
[Unit]
Description=Movie Ticket Booking Backend
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/var/www/html/backend
Environment=NODE_ENV=production
ExecStart=/usr/bin/node src/index.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

### Frontend Service

```bash
nano /etc/systemd/system/movie-frontend.service
```

```ini
[Unit]
Description=Movie Ticket Booking Frontend
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/var/www/html/frontend
Environment=NODE_ENV=production
Environment PORT=3000
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

---

## Step 11: Start Services

```bash
systemctl daemon-reload
systemctl enable movie-backend
systemctl enable movie-frontend
systemctl start movie-backend
systemctl start movie-frontend
systemctl status movie-backend
systemctl status movie-frontend
```

---

## Step 12: Configure Firewall

```bash
ufw allow 22
ufw allow 80
ufw allow 443
ufw enable
ufw status
```

---

## Step 13: Domain Configuration (Hostinger)

1. Login to Hostinger
2. Go to DNS / Nameservers
3. Add A record:
   - Type: A
   - Name: @
   - Value: 52.62.180.96
4. Add CNAME:
   - Type: CNAME
   - Name: www
   - Value: movie-ticket-booking.online

Wait 5-10 minutes for DNS propagation.

---

## Step 14: Verify Installation

```bash
# Check backend
curl http://localhost:3001

# Check frontend
curl http://localhost:3000

# Check services
systemctl status movie-backend
systemctl status movie-frontend
```

---

## Important URLs After Deployment

- **Frontend**: http://52.62.180.96 or http://movie-ticket-booking.online
- **Backend API**: http://52.62.180.96/api/v1 or http://movie-ticket-booking.online/api/v1

---

## Troubleshooting Commands

```bash
# View backend logs
journalctl -u movie-backend -f

# View frontend logs
journalctl -u movie-frontend -f

# Restart services
systemctl restart movie-backend
systemctl restart movie-frontend

# Check NGINX errors
tail -f /var/log/nginx/error.log

# Check Node processes
ps aux | grep node
```

---

## Quick Commands Reference

| Action | Command |
|--------|---------|
| Restart Backend | `systemctl restart movie-backend` |
| Restart Frontend | `systemctl restart movie-frontend` |
| Restart Both | `systemctl restart movie-backend movie-frontend` |
| View Backend Logs | `journalctl -u movie-backend -f` |
| View Frontend Logs | `journalctl -u movie-frontend -f` |
| Test Backend API | `curl http://localhost:3001` |
| Restart NGINX | `systemctl restart nginx` |