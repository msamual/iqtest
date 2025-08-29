#!/bin/bash

echo "🖼️ Testing image loading and debugging..."

# Test if we can access the API
echo "🔍 Testing API health..."
if curl -k -f -s https://localhost/api/IqTest/health > /dev/null; then
    echo "✅ API is responding"
else
    echo "❌ API is not responding"
    echo "📋 API logs:"
    docker-compose logs iq-test-api
    exit 1
fi

# Test if we can access images directly
echo "🔍 Testing image access..."
IMAGE_URL="https://localhost/api/images/triangles.svg"

echo "Fetching image from: $IMAGE_URL"
HTTP_CODE=$(curl -k -f -s -o /dev/null -w "%{http_code}" "$IMAGE_URL")
echo "HTTP Status Code: $HTTP_CODE"

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Image is accessible (HTTP 200 OK)"
    
    # Check if it's actually an SVG
    CONTENT_TYPE=$(curl -k -f -s -I "$IMAGE_URL" | grep -i "content-type" | cut -d' ' -f2-)
    echo "Content-Type: $CONTENT_TYPE"
    
    if echo "$CONTENT_TYPE" | grep -i "svg\|xml" > /dev/null; then
        echo "✅ Content-Type is correct for SVG"
    else
        echo "⚠️ Content-Type might be incorrect: $CONTENT_TYPE"
    fi
else
    echo "❌ Image is NOT accessible (HTTP $HTTP_CODE)"
    
    # Try to get more details
    echo "📋 Full response:"
    curl -k -v "$IMAGE_URL" 2>&1 | head -20
fi

# Test other images
echo "🔍 Testing other images..."
for image in cubes.svg pattern.svg rotation.svg; do
    echo "Testing $image..."
    HTTP_CODE=$(curl -k -f -s -o /dev/null -w "%{http_code}" "https://localhost/api/images/$image")
    if [ "$HTTP_CODE" = "200" ]; then
        echo "✅ $image is accessible"
    else
        echo "❌ $image is NOT accessible (HTTP $HTTP_CODE)"
    fi
done

# Check if images exist in the container
echo "🔍 Checking images in API container..."
docker-compose exec iq-test-api ls -la /app/wwwroot/images/ || echo "❌ Cannot access container"

# Check Nginx configuration
echo "🔍 Checking Nginx configuration..."
docker-compose exec iq-test-frontend cat /etc/nginx/conf.d/default.conf | grep -A 10 -B 5 "location /api" || echo "❌ Cannot access Nginx config"

echo "🎉 Image testing completed!"
