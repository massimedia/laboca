#!/bin/bash

echo "🚀 Starting LABOCA development environment..."

echo "Starting Docker containers..."
docker start laboca-postgres 2>/dev/null
docker start laboca-redis 2>/dev/null

echo "Starting Medusa backend..."
osascript -e 'tell application "Terminal" to do script "echo \"LABOCA BACKEND\"; cd ~/Sandbox/laboca/backend && npm run dev"'

echo "Starting Next.js frontend..."
osascript -e 'tell application "Terminal" to do script "echo \"LABOCA FRONTEND\"; cd ~/Sandbox/laboca/frontend && npm run dev"'

echo "Starting Codex..."
osascript -e 'tell application "Terminal" to do script "echo \"LABOCA CODEX\"; cd ~/Sandbox/laboca/frontend && codex"'

echo ""
echo "✅ LABOCA environment started"
echo ""
echo "Frontend: http://localhost:3000"
echo "Admin: http://localhost:9000/app"

