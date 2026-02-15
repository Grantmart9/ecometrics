# Kill existing Ollama process
pkill -f "ollama serve"

# Wait a moment
sleep 2

# Start Ollama with CORS enabled
OLLAMA_ORIGINS="*" ollama serve &

# Wait for startup
sleep 3

# Verify it's running
curl http://localhost:11434/api/tags

# Should show Ollama models
