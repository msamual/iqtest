#!/bin/bash

# Test Angular build in Docker
echo "🧪 Testing Angular build in Docker..."

# Build only the frontend service
echo "🔨 Building Angular frontend in Docker..."
docker-compose -f docker-compose.prod.yml build iq-test-frontend

if [ $? -eq 0 ]; then
    echo "✅ Angular build successful in Docker!"
else
    echo "❌ Angular build failed in Docker!"
    echo "📋 Build logs:"
    docker-compose -f docker-compose.prod.yml logs iq-test-frontend
    exit 1
fi

echo "🎉 Angular Docker build test completed successfully!"
