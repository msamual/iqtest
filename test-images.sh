#!/bin/bash

# Test images script
echo "🖼️ Testing image availability..."

# Test API images endpoint
echo "Testing API images:"
if curl -f https://localhost/api/images/triangles.svg > /dev/null 2>&1; then
    echo "✅ triangles.svg accessible"
else
    echo "❌ triangles.svg not accessible"
fi

if curl -f https://localhost/api/images/rotation.svg > /dev/null 2>&1; then
    echo "✅ rotation.svg accessible"
else
    echo "❌ rotation.svg not accessible"
fi

if curl -f https://localhost/api/images/pattern.svg > /dev/null 2>&1; then
    echo "✅ pattern.svg accessible"
else
    echo "❌ pattern.svg not accessible"
fi

if curl -f https://localhost/api/images/cubes.svg > /dev/null 2>&1; then
    echo "✅ cubes.svg accessible"
else
    echo "❌ cubes.svg not accessible"
fi

echo ""
echo "🔍 Checking API static files configuration:"
curl -I https://localhost/api/images/triangles.svg 2>/dev/null | head -5
