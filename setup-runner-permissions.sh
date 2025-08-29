#!/bin/bash

# Script to setup permissions for GitHub Actions runner user
# Run this script as root on the server

echo "🔧 Setting up permissions for GitHub Actions runner..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ This script must be run as root (use sudo)"
    exit 1
fi

# Add runner user to docker group
echo "👤 Adding runner user to docker group..."
usermod -aG docker runner

# Set up Docker socket permissions
echo "🔌 Setting up Docker socket permissions..."
chmod 666 /var/run/docker.sock

# Create docker group if it doesn't exist
groupadd docker 2>/dev/null || true

# Set up directory permissions for the project
echo "📁 Setting up project directory permissions..."
PROJECT_DIR="/home/runner/actions-runner/_work/iqtest/iqtest"
if [ -d "$PROJECT_DIR" ]; then
    chown -R runner:runner "$PROJECT_DIR"
    chmod -R 755 "$PROJECT_DIR"
fi

# Set up SSL certificate permissions
echo "🔐 Setting up SSL certificate permissions..."
if [ -f "/etc/ssl/certs/msamual.ru.crt" ]; then
    chmod 644 /etc/ssl/certs/msamual.ru.crt
fi

if [ -f "/etc/ssl/certs/Certificate.key" ]; then
    chmod 600 /etc/ssl/certs/Certificate.key
fi

# Set up deploy script permissions
echo "📜 Setting up deploy script permissions..."
if [ -f "/home/runner/actions-runner/_work/iqtest/iqtest/deploy.sh" ]; then
    chown runner:runner /home/runner/actions-runner/_work/iqtest/iqtest/deploy.sh
    chmod +x /home/runner/actions-runner/_work/iqtest/iqtest/deploy.sh
fi

echo "✅ Permissions setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Restart the GitHub Actions runner service:"
echo "   sudo systemctl restart actions.runner.iqtest.runner.service"
echo ""
echo "2. Or restart the runner manually:"
echo "   sudo -u runner ./run.sh"
echo ""
echo "3. Test the setup by running a workflow"
