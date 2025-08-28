#!/bin/bash

# Local deployment script
set -e

echo "🚀 Starting local deployment..."

# Check if SSL certificates exist
if [ ! -f "/etc/ssl/certs/msamual.ru.crt" ]; then
    echo "❌ SSL certificate not found: /etc/ssl/certs/msamual.ru.crt"
    exit 1
fi

if [ ! -f "/etc/ssl/certs/Certificate.key" ]; then
    echo "❌ SSL private key not found: /etc/ssl/certs/Certificate.key"
    exit 1
fi

echo "✅ SSL certificates found"

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
docker-compose down || true

# Remove old images to force rebuild
echo "🗑️ Removing old images..."
docker image prune -f

# Build and start services
echo "🔨 Building and starting services..."
echo "📋 This may take several minutes for the first build..."
docker-compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 60

# Check if services are running
echo "🔍 Checking service health..."
if curl -k -f https://localhost/api/IqTest/health > /dev/null 2>&1; then
    echo "✅ API is responding via HTTPS"
else
    echo "❌ API is not responding via HTTPS"
    echo "📋 API logs:"
    docker-compose logs iq-test-api
    exit 1
fi

if curl -k -f https://localhost > /dev/null 2>&1; then
    echo "✅ Frontend is responding via HTTPS"
else
    echo "❌ Frontend is not responding via HTTPS"
    echo "📋 Frontend logs:"
    docker-compose logs iq-test-frontend
    exit 1
fi

echo "🎉 Deployment completed successfully!"
echo "🌐 Application is available at: https://msamual.ru"
echo "🔧 API is available at: https://msamual.ru/api"

# Show running containers
echo "📊 Running containers:"
docker-compose ps