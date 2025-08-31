#!/bin/sh

# Check if SSL certificates exist
if [ ! -f "/etc/ssl/certs/msamual.ru.crt" ] || [ ! -f "/etc/ssl/certs/Certificate.key" ]; then
    echo "SSL certificates not found. Removing HTTPS configuration for local development..."
    
    # Create temporary nginx config without SSL
    cat > /etc/nginx/conf.d/default.conf << 'EOF'
# HTTP server for localhost (development)
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # pgAdmin proxy (must come before Angular routing)
    location /pgadmin/ {
        proxy_pass http://iq-test-pgadmin:80/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Script-Name /pgadmin;
        proxy_redirect off;
    }

    # API images proxy (must come before general API proxy)
    location /api/images/ {
        proxy_pass http://iq-test-api:80/images/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # API proxy (must come before static assets)
    location /api/ {
        proxy_pass http://iq-test-api:80/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Cache static assets (only for frontend assets, not API or pgAdmin)
    location ~* ^(?!/api/|/pgadmin/).*\.(js|css|png|jpg|jpeg|gif|ico)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Handle Angular routing (must be last)
    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF
else
    echo "SSL certificates found. Using full production configuration..."
    # nginx.prod.conf is already copied and contains full SSL config
fi

# Start nginx
exec nginx -g "daemon off;"
