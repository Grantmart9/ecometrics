# Setting up HTTPS for Ollama on EC2

## Step 1: Install Caddy

```bash
# Complete Caddy installation
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable.gpg

echo "deb [signed-by=/usr/share/keyrings/caddy-stable.gpg] https://dl.cloudsmith.io/public/caddy/stable/debian/any-version any main" | sudo tee /etc/apt/sources.list.d/caddy-stable.list

sudo apt update
sudo apt install caddy
```

## Step 2: Create Caddyfile

```bash
sudo tee /etc/caddy/Caddyfile << 'EOF'
ollama.13-48-35-34.nip.io {
    reverse_proxy localhost:11434 {
        header_up Host localhost
    }
}
EOF
```

Note: Using `nip.io` for wildcard DNS (no domain needed). Replace with your domain if you have one.

## Step 3: Start Ollama with CORS

```bash
# Stop any running Ollama instances
pkill -f ollama

# Start Ollama with CORS enabled
OLLAMA_ORIGINS="*" ollama serve &

# Verify it's running
curl http://localhost:11434/api/tags
```

## Step 4: Start Caddy

```bash
sudo systemctl restart caddy
sudo systemctl status caddy
```

## Step 5: Verify HTTPS Works

```bash
# Test HTTPS endpoint
curl https://ollama.13-48-35-34.nip.io/api/tags
```

You should see JSON response from Ollama.

## Step 6: Update Frontend

Update `lib/aiService.ts`:

```typescript
const AI_API_URL = "https://ollama.13-48-35-34.nip.io";
```

## Step 7: Deploy Frontend

Deploy to CPanel and test the AI assistant.

## Troubleshooting

### If Caddy fails to start:
```bash
sudo journalctl -u caddy -f
```

### If Ollama is not accessible:
```bash
# Check if Ollama is running
ps aux | grep ollama

# Check port 11434
netstat -tlnp | grep 11434

# Test locally
curl http://localhost:11434/api/tags
```

### If SSL certificate fails:
Caddy will automatically get certificates from Let's Encrypt. Make sure port 80 and 443 are open in AWS Security Group.
