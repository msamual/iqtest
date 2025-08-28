#!/bin/bash

# Test deployment script
echo "🧪 Testing deployment..."

# Test API health
echo "Testing API health..."
if curl -f http://localhost/api/IqTest/health > /dev/null 2>&1; then
    echo "✅ API health check passed"
else
    echo "❌ API health check failed"
    exit 1
fi

# Test API questions endpoint
echo "Testing API questions endpoint..."
if curl -f "http://localhost/api/IqTest/questions?count=1" > /dev/null 2>&1; then
    echo "✅ API questions endpoint working"
else
    echo "❌ API questions endpoint failed"
    exit 1
fi

# Test frontend
echo "Testing frontend..."
if curl -f http://localhost > /dev/null 2>&1; then
    echo "✅ Frontend is accessible"
else
    echo "❌ Frontend is not accessible"
    exit 1
fi

echo "🎉 All tests passed! Deployment is working correctly."
