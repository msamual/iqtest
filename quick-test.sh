#!/bin/bash

# Quick test script for Angular build
echo "🚀 Quick Angular build test..."

cd iq-test-frontend

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf dist/

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Test build
echo "🔨 Testing build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Build output structure:"
    find dist/ -type f -name "*.html" -o -name "*.js" -o -name "*.css" | head -10
else
    echo "❌ Build failed!"
    exit 1
fi
