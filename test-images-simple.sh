#!/bin/bash

echo "🖼️ Simple image test..."

# Test if containers are running
echo "🔍 Checking containers..."
if ! docker-compose ps | grep -q "Up"; then
    echo "❌ Containers are not running. Start them first:"
    echo "   docker-compose up -d"
    exit 1
fi

echo "✅ Containers are running"

# Test API health
echo "🔍 Testing API health..."
if curl -k -f -s https://localhost/api/IqTest/health > /dev/null; then
    echo "✅ API is responding"
else
    echo "❌ API is not responding"
    exit 1
fi

# Test image access
echo "🔍 Testing image access..."
IMAGE_URL="https://localhost/api/images/triangles.svg"

echo "Testing: $IMAGE_URL"
HTTP_CODE=$(curl -k -f -s -o /dev/null -w "%{http_code}" "$IMAGE_URL")
echo "HTTP Status: $HTTP_CODE"

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Image is accessible!"
    
    # Get content type
    CONTENT_TYPE=$(curl -k -f -s -I "$IMAGE_URL" | grep -i "content-type" | cut -d' ' -f2- | tr -d '\r')
    echo "Content-Type: $CONTENT_TYPE"
    
    # Get file size
    FILE_SIZE=$(curl -k -f -s "$IMAGE_URL" | wc -c)
    echo "File size: $FILE_SIZE bytes"
    
    if [ "$FILE_SIZE" -gt 0 ]; then
        echo "✅ Image has content"
    else
        echo "❌ Image is empty"
    fi
else
    echo "❌ Image is not accessible"
    
    # Try to get error details
    echo "Error response:"
    curl -k -v "$IMAGE_URL" 2>&1 | head -10
fi

echo "🎉 Test completed!"
