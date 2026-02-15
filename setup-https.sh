#!/bin/bash

# Set up HTTPS with Let's Encrypt on EC2

# 1. Point a domain to your EC2 IP (or use nip.io)
# 2. Install certbot
sudo apt install certbot python3-certbot-nginx -y

# 3. Get SSL certificate (replace with your domain)
sudo certbot --nginx -d ollama.13-48-35-34.nip.io

# 4. Nginx will auto-configure HTTPS with CORS
# 5. Update URL in lib/aiService.ts toecho use https://

 ""
echo "After SSL is set up, update lib/aiService.ts:"
echo 'const AI_API_URL = "https://ollama.13-48-35-34.nip.io";'
