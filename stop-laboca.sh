#!/bin/bash

echo "🛑 Stopping LABOCA environment..."

echo ""
echo "Stopping Node processes..."
pkill node

echo ""
echo "Stopping Docker containers..."
docker stop laboca-postgres
docker stop laboca-redis

echo ""
echo "✅ LABOCA stopped."



