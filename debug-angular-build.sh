#!/bin/bash

# Debug Angular build script
echo "🔍 Debugging Angular build..."

cd iq-test-frontend

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Are you in the right directory?"
    exit 1
fi

echo "📁 Current directory: $(pwd)"
echo "📋 Package.json found: ✅"

# Check Angular version
echo "🔍 Checking Angular version..."
if [ -f "package.json" ]; then
    echo "Angular version: $(grep -o '"@angular/core": "[^"]*"' package.json)"
fi

# Check if node_modules exists
if [ -d "node_modules" ]; then
    echo "📦 node_modules exists: ✅"
else
    echo "📦 node_modules missing: ❌"
    echo "Installing dependencies..."
    npm ci
fi

# Try to run ng version
echo "🔍 Checking Angular CLI..."
if command -v ng &> /dev/null; then
    ng version
else
    echo "⚠️ Angular CLI not found globally, trying npx..."
    npx ng version
fi

# Try to build with verbose output
echo "🔨 Attempting build with verbose output..."
npm run build -- --verbose

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Build output:"
    ls -la dist/
else
    echo "❌ Build failed!"
    echo "📋 Checking for common issues..."
    
    # Check for TypeScript errors
    echo "🔍 Checking TypeScript compilation..."
    npx tsc --noEmit
    
    # Check for linting errors
    echo "🔍 Checking for linting errors..."
    npx ng lint || true
fi
