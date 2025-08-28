#!/bin/bash

# Diagnose Chrome issues
echo "🔍 Diagnosing Chrome issues..."

# Check if services are running
echo "📋 Checking services status..."
docker-compose -f docker-compose.prod.yml ps

echo ""
echo "🌐 Testing endpoints..."

# Test API directly
echo "Testing API health:"
curl -v http://localhost/api/IqTest/health 2>&1 | head -20

echo ""
echo "Testing API questions:"
curl -v "http://localhost/api/IqTest/questions?count=1" 2>&1 | head -20

echo ""
echo "Testing frontend:"
curl -v http://localhost 2>&1 | head -20

echo ""
echo "🔧 Common Chrome issues and solutions:"
echo "1. CORS issues - API not allowing requests from frontend"
echo "2. Mixed content - HTTP/HTTPS conflicts"
echo "3. Cache issues - Chrome caching old responses"
echo "4. Security policies - Chrome blocking certain requests"

echo ""
echo "💡 Try these solutions:"
echo "1. Clear Chrome cache: Ctrl+Shift+Delete"
echo "2. Open Chrome DevTools (F12) and check Console for errors"
echo "3. Try incognito mode in Chrome"
echo "4. Check Network tab in DevTools for failed requests"
