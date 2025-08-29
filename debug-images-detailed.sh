#!/bin/bash

echo "🔍 Detailed image debugging..."

# Test 1: Check if API is responding
echo "1️⃣ Testing API health..."
API_HEALTH=$(curl -k -s https://msamual.ru/api/IqTest/health)
if [ $? -eq 0 ]; then
    echo "✅ API is responding: $API_HEALTH"
else
    echo "❌ API is not responding"
    exit 1
fi

# Test 2: Check if we can access API directly (bypassing Nginx)
echo ""
echo "2️⃣ Testing API direct access..."
# This should work if API is serving static files
curl -k -s -I https://msamual.ru/api/images/triangles.svg | head -3

# Test 3: Check if files exist in the container
echo ""
echo "3️⃣ Checking files in API container..."
echo "Checking /app/wwwroot/images/ directory:"
docker-compose exec iq-test-api ls -la /app/wwwroot/images/ 2>/dev/null || echo "❌ Cannot access container or directory"

# Test 4: Check if we can read a specific file
echo ""
echo "4️⃣ Testing file content in container..."
docker-compose exec iq-test-api cat /app/wwwroot/images/triangles.svg 2>/dev/null | head -3 || echo "❌ Cannot read triangles.svg"

# Test 5: Check if API can serve files internally
echo ""
echo "5️⃣ Testing internal API static file serving..."
docker-compose exec iq-test-api curl -s http://localhost:80/images/triangles.svg -I 2>/dev/null || echo "❌ Internal API cannot serve static files"

# Test 6: Check API logs for errors
echo ""
echo "6️⃣ Checking API logs for errors..."
docker-compose logs iq-test-api --tail 20 | grep -i "error\|exception\|static" || echo "No obvious errors in logs"

# Test 7: Check if the path mapping is working
echo ""
echo "7️⃣ Testing different paths..."
echo "Testing /api/images/triangles.svg:"
curl -k -s -I https://msamual.ru/api/images/triangles.svg | head -1

echo "Testing /images/triangles.svg:"
curl -k -s -I https://msamual.ru/images/triangles.svg | head -1

echo ""
echo "🎉 Detailed debugging completed!"
