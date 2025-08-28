#!/bin/bash

# IQ Test Deployment Script for Ubuntu
set -e

echo "🚀 Starting IQ Test deployment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down || true

# Remove old images to force rebuild
echo "🗑️ Removing old images..."
docker image prune -f

# Build and start services
echo "🔨 Building and starting services..."
docker-compose -f docker-compose.prod.yml up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 30

# Check if services are running
echo "🔍 Checking service health..."
if curl -f http://localhost/api/IqTest/questions?count=1 > /dev/null 2>&1; then
    echo "✅ API is responding"
else
    echo "❌ API is not responding"
    exit 1
fi

if curl -f http://localhost > /dev/null 2>&1; then
    echo "✅ Frontend is responding"
else
    echo "❌ Frontend is not responding"
    exit 1
fi

echo "🎉 Deployment completed successfully!"
echo "📱 Application is available at: http://localhost"
echo "🔧 API is available at: http://localhost/api"

# Show running containers
echo "📊 Running containers:"
docker-compose -f docker-compose.prod.yml ps
