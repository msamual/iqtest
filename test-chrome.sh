#!/bin/bash

# Test Chrome-specific issues
echo "🌐 Testing Chrome compatibility..."

# Test CORS headers
echo "🔍 Testing CORS headers..."
curl -H "Origin: http://localhost" -H "Access-Control-Request-Method: GET" -H "Access-Control-Request-Headers: X-Requested-With" -X OPTIONS http://localhost/api/IqTest/health -v 2>&1 | grep -E "(Access-Control|HTTP/)"

echo ""
echo "🔍 Testing API with different origins..."
curl -H "Origin: http://localhost" http://localhost/api/IqTest/health -v 2>&1 | grep -E "(Access-Control|HTTP/)"

echo ""
echo "🔍 Testing frontend API calls..."
curl -H "Origin: http://localhost" http://localhost/api/IqTest/questions?count=1 -v 2>&1 | grep -E "(Access-Control|HTTP/)"

echo ""
echo "💡 Chrome troubleshooting tips:"
echo "1. Open Chrome DevTools (F12)"
echo "2. Go to Console tab and look for CORS errors"
echo "3. Go to Network tab and check for failed requests"
echo "4. Try incognito mode: Ctrl+Shift+N"
echo "5. Clear cache: Ctrl+Shift+Delete"
echo "6. Disable cache in DevTools (Network tab -> Disable cache)"

echo ""
echo "🔧 If still not working, try:"
echo "1. chrome://flags/#block-insecure-private-network-requests - Disable"
echo "2. chrome://flags/#same-site-by-default-cookies - Disable"
echo "3. Restart Chrome after changing flags"
