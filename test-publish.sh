#!/bin/bash

echo "🔍 Testing dotnet publish locally..."

# Go to API directory
cd IqTestApi

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf bin/ obj/

# Restore packages
echo "📦 Restoring packages..."
dotnet restore

# Build project
echo "🔨 Building project..."
dotnet build -c Release

# Publish project
echo "📤 Publishing project..."
dotnet publish -c Release -o ./publish

# Check if images are in publish directory
echo "🔍 Checking images in publish directory..."
if [ -d "./publish/wwwroot/images" ]; then
    echo "✅ wwwroot/images directory exists"
    ls -la ./publish/wwwroot/images/
else
    echo "❌ wwwroot/images directory not found"
fi

# Check if images are in root of publish directory
echo "🔍 Checking for images in publish root..."
find ./publish -name "*.svg" -type f

cd ..

echo "🎉 Publish test completed!"
