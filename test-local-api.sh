#!/bin/bash

echo "🔍 Testing local API build..."

# Go to API directory
cd IqTestApi

# Clean and build
echo "🧹 Cleaning and building..."
rm -rf bin/ obj/ publish/
dotnet publish -c Release -o ./publish

# Check if images are in publish directory
echo "🔍 Checking images in publish directory..."
if [ -d "./publish/wwwroot/images" ]; then
    echo "✅ wwwroot/images directory exists"
    ls -la ./publish/wwwroot/images/
    
    # Test if we can read a file
    echo "🔍 Testing file content..."
    head -3 ./publish/wwwroot/images/triangles.svg
else
    echo "❌ wwwroot/images directory not found"
fi

# Start API locally
echo "🚀 Starting API locally..."
cd publish
dotnet IqTestApi.dll &
API_PID=$!

# Wait for API to start
sleep 5

# Test API health
echo "🔍 Testing API health..."
curl -s http://localhost:5000/api/IqTest/health || echo "❌ API health failed"

# Test static files
echo "🔍 Testing static files..."
curl -s -I http://localhost:5000/images/triangles.svg | head -3

# Stop API
kill $API_PID 2>/dev/null

cd ../..

echo "🎉 Local API test completed!"
