#!/bin/bash

# Create Caddyfile with CORS using handle_response
sudo tee /etc/caddy/Caddyfile > /dev/null << 'EOF'
ollama.13-48-35-34.nip.io {
    reverse_proxy localhost:11434 {
        header_up Host localhost
    }

    @options method OPTIONS
    handle @options {
        header Access-Control-Allow-Origin "*"
        header Access-Control-Allow-Methods "GET, POST, OPTIONS"
        header Access-Control-Allow-Headers "Content-Type"
        respond "" 204
    }

    handle_response {
        header Access-Control-Allow-Origin "*"
        header Access-Control-Allow-Methods "GET, POST, OPTIONS"
        header Access-Control-Allow-Headers "Content-Type"
    }
}
EOF

echo "Caddyfile created:"
cat /etc/caddy/Caddyfile

echo ""
echo "Validating..."
sudo caddy validate --config /etc/caddy/Caddyfile

echo ""
echo "Restarting Caddy..."
sudo systemctl restart caddy
sudo systemctl status caddy
