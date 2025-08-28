#!/bin/bash

# Install Node.js and npm on Ubuntu
echo "🚀 Installing Node.js and npm on Ubuntu..."

# Update package index
sudo apt update

# Install curl if not already installed
sudo apt install -y curl

# Install Node.js 20.x using NodeSource repository
echo "📦 Installing Node.js 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
echo "✅ Installation complete!"
echo "Node.js version: $(node --version)"
echo "npm version: $(npm --version)"

# Install Angular CLI globally
echo "🔧 Installing Angular CLI globally..."
sudo npm install -g @angular/cli@20

echo "🎉 Node.js, npm, and Angular CLI are now installed!"
