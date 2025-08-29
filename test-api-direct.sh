#!/bin/bash

echo "🔍 Testing API directly (bypassing Nginx)..."

# Test if we can access API directly
echo "Testing API health endpoint..."
curl -k -s https://msamual.ru/api/IqTest/health || echo "❌ API health failed"

echo ""
echo "Testing API images endpoint..."
curl -k -s -I https://msamual.ru/api/images/triangles.svg

echo ""
echo "Testing with different path..."
curl -k -s -I https://msamual.ru/images/triangles.svg

echo ""
echo "Testing API root..."
curl -k -s -I https://msamual.ru/api/

echo ""
echo "🎉 Direct API test completed!"
