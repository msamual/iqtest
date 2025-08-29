#!/bin/bash

echo "🔨 Testing Docker build for API..."

# Build API image
echo "Building API image..."
docker build -t iq-test-api:debug ./IqTestApi -f ./IqTestApi/Dockerfile.prod

if [ $? -eq 0 ]; then
    echo "✅ API image built successfully"
    
    # Check if images are in the built container
    echo "🔍 Checking images in built container..."
    docker run --rm iq-test-api:debug ls -la /app/wwwroot/images/ || echo "❌ Images directory not found"
    
    # Check if we can read a specific image
    echo "🔍 Testing image content..."
    docker run --rm iq-test-api:debug cat /app/wwwroot/images/triangles.svg | head -3 || echo "❌ Cannot read triangles.svg"
    
else
    echo "❌ API image build failed"
    exit 1
fi

echo "🎉 Docker build test completed!"
