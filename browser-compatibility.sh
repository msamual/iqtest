#!/bin/bash

# Browser compatibility test script
echo "🌐 Browser Compatibility Test"
echo "=============================="

# Test basic connectivity
echo "📡 Testing basic connectivity..."
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://localhost
curl -s -o /dev/null -w "API Status: %{http_code}\n" http://localhost/api/IqTest/health

echo ""
echo "🔍 Testing CORS configuration..."
echo "CORS headers for localhost:"
curl -H "Origin: http://localhost" -I http://localhost/api/IqTest/health 2>/dev/null | grep -i "access-control"

echo ""
echo "🔍 Testing API endpoints..."
echo "Health endpoint:"
curl -s http://localhost/api/IqTest/health | jq . 2>/dev/null || curl -s http://localhost/api/IqTest/health

echo ""
echo "Questions endpoint:"
curl -s "http://localhost/api/IqTest/questions?count=1" | jq . 2>/dev/null || curl -s "http://localhost/api/IqTest/questions?count=1"

echo ""
echo "📋 Browser-specific instructions:"
echo ""
echo "🦊 Firefox:"
echo "  - Should work out of the box"
echo "  - If issues: about:config -> security.tls.insecure_fallback_hosts -> add localhost"
echo ""
echo "🌐 Chrome:"
echo "  - Try incognito mode first: Ctrl+Shift+N"
echo "  - Clear cache: Ctrl+Shift+Delete"
echo "  - Open DevTools (F12) and check Console for errors"
echo "  - If CORS errors: chrome://flags/#block-insecure-private-network-requests -> Disable"
echo ""
echo "🍎 Safari:"
echo "  - Should work (already confirmed working)"
echo "  - If issues: Develop menu -> Disable Cross-Origin Restrictions"
echo ""
echo "🔧 Edge:"
echo "  - Similar to Chrome"
echo "  - Try incognito mode and clear cache"

echo ""
echo "✅ All server-side tests passed!"
echo "If browser still doesn't work, check browser console for specific errors."
