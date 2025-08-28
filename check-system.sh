#!/bin/bash

# System check script
echo "🔍 Checking system requirements..."

# Check Docker
if command -v docker &> /dev/null; then
    echo "✅ Docker is installed: $(docker --version)"
else
    echo "❌ Docker is not installed"
fi

# Check Docker Compose
if command -v docker-compose &> /dev/null; then
    echo "✅ Docker Compose is installed: $(docker-compose --version)"
else
    echo "❌ Docker Compose is not installed"
fi

# Check Node.js
if command -v node &> /dev/null; then
    echo "✅ Node.js is installed: $(node --version)"
else
    echo "⚠️  Node.js is not installed (optional for Docker-only deployment)"
fi

# Check npm
if command -v npm &> /dev/null; then
    echo "✅ npm is installed: $(npm --version)"
else
    echo "⚠️  npm is not installed (optional for Docker-only deployment)"
fi

# Check curl
if command -v curl &> /dev/null; then
    echo "✅ curl is installed: $(curl --version | head -1)"
else
    echo "❌ curl is not installed"
fi

# Check available disk space
echo "💾 Available disk space:"
df -h / | tail -1

# Check available memory
echo "🧠 Available memory:"
free -h

echo ""
echo "📋 Recommendations:"
if ! command -v docker &> /dev/null; then
    echo "  - Install Docker first"
fi
if ! command -v docker-compose &> /dev/null; then
    echo "  - Install Docker Compose"
fi
if ! command -v curl &> /dev/null; then
    echo "  - Install curl: sudo apt install curl"
fi

echo ""
echo "🚀 Ready for deployment!"
echo "  - Use ./deploy-docker-only.sh for Docker-only deployment"
echo "  - Use ./deploy.sh if you have Node.js installed"
