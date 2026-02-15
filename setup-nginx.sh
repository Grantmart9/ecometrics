#!/bin/bash

# Install Nginx if not already installed
sudo apt update
sudo apt install nginx -y

# Create Nginx configuration with CORS headers
sudo tee /etc/nginx/sites-available/ollama > /dev/null << 'EOF'
server {
    listen 80;
    server_name ollama.13-48-35-34.nip.io;

    # Redirect HTTP to HTTPS (if using SSL)
    return 301 https://$host$request_uri;
}
EOF

# Create HTTPS configuration
sudo tee /etc/nginx/sites-available/ollama-https > /dev/null << 'EOF'
server {
    listen 443 ssl;
    server_name ollama.13-48-35-34.nip.io;

    # SSL certificates (self-signed or Let's Encrypt)
    ssl_certificate /etc/ssl/certs/ssl-cert-snakeoil.pem;
    ssl_certificate_key /etc/ssl/private/ssl-cert-snakeoil.key;
    ssl_protocols TLSv1.2 TLSv1.3;

    location / {
        # Proxy to Ollama
        proxy_pass http://localhost:11434;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # CORS headers
        add_header Access-Control-Allow-Origin "*" always;
        add_header Access-Control-Allow-Methods "GET, POST, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Content-Type" always;
    }

    # Handle OPTIONS preflight
    if ($request_method = 'OPTIONS') {
        add_header Access-Control-Allow-Origin "*" always;
        add_header Access-Control-Allow-Methods "GET, POST, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Content-Type" always;
        add_header Content-Length 0;
        add_header Content-Type text/plain;
        return 204;
    }
}
EOF

# Enable the site
sudo ln -sf /etc/nginx/sites-available/ollama-https /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test and reload Nginx
sudo nginx -t
sudo systemctl reload nginx

echo ""
echo "Nginx configured with CORS headers"
echo "Test with: curl http://ollama.13-48-35-34.nip.io/api/tags"
