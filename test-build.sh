#!/bin/bash

# Test build script
echo "🧪 Testing Angular build locally..."

cd iq-test-frontend

# Install dependencies
echo "Installing dependencies..."
npm ci

# Test build
echo "Testing build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Build output:"
    ls -la dist/iq-test-frontend/
else
    echo "❌ Build failed!"
    exit 1
fi
