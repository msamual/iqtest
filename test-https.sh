#!/bin/bash

# HTTPS testing script
echo "🔒 Testing HTTPS deployment..."

# Test HTTPS endpoints
echo "🔍 Testing HTTPS endpoints..."

echo "Testing HTTPS health endpoint:"
if curl -k -f https://localhost/api/IqTest/health > /dev/null 2>&1; then
    echo "✅ HTTPS API health check passed"
else
    echo "❌ HTTPS API health check failed"
    exit 1
fi

echo "Testing HTTPS questions endpoint:"
if curl -k -f "https://localhost/api/IqTest/questions?count=1" > /dev/null 2>&1; then
    echo "✅ HTTPS API questions endpoint working"
else
    echo "❌ HTTPS API questions endpoint failed"
    exit 1
fi

echo "Testing HTTPS frontend:"
if curl -k -f https://localhost > /dev/null 2>&1; then
    echo "✅ HTTPS frontend is accessible"
else
    echo "❌ HTTPS frontend is not accessible"
    exit 1
fi

echo "Testing HTTP to HTTPS redirect:"
if curl -I http://localhost 2>/dev/null | grep -q "301\|302"; then
    echo "✅ HTTP to HTTPS redirect working"
else
    echo "❌ HTTP to HTTPS redirect not working"
fi

echo "🎉 All HTTPS tests passed!"
echo "🌐 Application is ready at: https://msamual.ru"
