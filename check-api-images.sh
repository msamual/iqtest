#!/bin/bash

echo "🔍 Checking images in API container..."

# Check if images exist in the API container
echo "📁 Checking /app/wwwroot/images/ directory:"
docker-compose exec iq-test-api ls -la /app/wwwroot/images/ || echo "❌ Cannot access directory"

echo ""
echo "📁 Checking /app/wwwroot/ directory:"
docker-compose exec iq-test-api ls -la /app/wwwroot/ || echo "❌ Cannot access wwwroot"

echo ""
echo "📁 Checking /app/ directory:"
docker-compose exec iq-test-api ls -la /app/ || echo "❌ Cannot access app directory"

echo ""
echo "🔍 Testing direct file access in container:"
docker-compose exec iq-test-api cat /app/wwwroot/images/triangles.svg | head -5 || echo "❌ Cannot read triangles.svg"

echo ""
echo "🔍 Checking if static files middleware is working:"
docker-compose exec iq-test-api curl -s http://localhost:80/images/triangles.svg -I || echo "❌ Cannot test internal API"

echo ""
echo "🎉 Check completed!"
