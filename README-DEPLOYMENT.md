# 🚀 IQ Test - Deployment Guide

## 📋 Prerequisites

### Ubuntu Server Requirements:
- Ubuntu 20.04+ (recommended)
- Docker 20.10+
- Docker Compose 2.0+
- At least 2GB RAM
- At least 10GB free disk space

## 🔧 Installation on Ubuntu

### 1. Install Docker
```bash
# Update package index
sudo apt update

# Install required packages
sudo apt install -y apt-transport-https ca-certificates curl gnupg lsb-release

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io

# Add user to docker group
sudo usermod -aG docker $USER
```

### 2. Install Docker Compose
```bash
# Download Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Make it executable
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker-compose --version
```

### 3. Deploy Application
```bash
# Clone or upload the project to your server
# Navigate to project directory
cd /path/to/iq-test

# Run deployment script
./deploy.sh
```

## 🌐 Access

After successful deployment:
- **Application**: http://your-server-ip
- **API**: http://your-server-ip/api

## 🔧 Management Commands

### Start services:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Stop services:
```bash
docker-compose -f docker-compose.prod.yml down
```

### View logs:
```bash
docker-compose -f docker-compose.prod.yml logs -f
```

### Update application:
```bash
./deploy.sh
```

## 🔒 Security Considerations

### Firewall Setup:
```bash
# Allow HTTP traffic
sudo ufw allow 80/tcp

# Allow SSH (if needed)
sudo ufw allow 22/tcp

# Enable firewall
sudo ufw enable
```

### SSL/HTTPS (Optional):
For production, consider setting up SSL with Let's Encrypt:
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com
```

## 📊 Monitoring

### Check service status:
```bash
docker-compose -f docker-compose.prod.yml ps
```

### View resource usage:
```bash
docker stats
```

### Check logs:
```bash
# All services
docker-compose -f docker-compose.prod.yml logs

# Specific service
docker-compose -f docker-compose.prod.yml logs iq-test-api
docker-compose -f docker-compose.prod.yml logs iq-test-frontend
```

## 🛠️ Troubleshooting

### Common Issues:

1. **Port 80 already in use:**
   ```bash
   sudo lsof -i :80
   sudo systemctl stop apache2  # or nginx
   ```

2. **Permission denied:**
   ```bash
   sudo chown -R $USER:$USER /path/to/project
   ```

3. **Out of disk space:**
   ```bash
   docker system prune -a
   ```

4. **Services not starting:**
   ```bash
   docker-compose -f docker-compose.prod.yml logs
   ```

## 📈 Performance Optimization

### For high traffic:
- Increase server resources (RAM, CPU)
- Use load balancer (nginx, HAProxy)
- Implement Redis for session storage
- Use CDN for static assets

### Database (Future):
- Consider PostgreSQL for persistent storage
- Implement proper session management
- Add user authentication

## 🔄 Updates

To update the application:
1. Pull latest changes
2. Run `./deploy.sh`
3. Services will be rebuilt and restarted automatically

## 📞 Support

For issues or questions:
- Check logs: `docker-compose -f docker-compose.prod.yml logs`
- Verify Docker installation: `docker --version`
- Check system resources: `free -h`, `df -h`
