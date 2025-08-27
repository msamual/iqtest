#!/bin/bash

echo "Setting up SSL certificates for .NET development..."

# Create directory for certificates
mkdir -p ~/.dotnet/https

# Generate development certificate
dotnet dev-certs https --clean
dotnet dev-certs https --trust

# Export certificate to file
dotnet dev-certs https --export-path ~/.dotnet/https/aspnetapp.pfx --password "crypticpassword"

echo "SSL certificates generated successfully!"
echo "You can now run: docker-compose up --build"
