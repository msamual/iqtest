# IQ Test Application

Full-stack IQ test application with Angular frontend and .NET Core API backend, deployed with HTTPS.

## Features

- 26 diverse IQ test questions
- Visual questions with SVG images
- Server-side answer validation and scoring
- Responsive design
- HTTPS deployment with SSL certificates
- Docker containerization

## Architecture

- **Frontend**: Angular 20 with TypeScript
- **Backend**: .NET 9 Web API
- **Web Server**: Nginx with SSL termination
- **Containerization**: Docker & Docker Compose

## Production Deployment

### Prerequisites
- Ubuntu server with Docker and Docker Compose
- SSL certificates at `/etc/ssl/certs/msamual.ru.crt` and `/etc/ssl/certs/Certificate.key`

### Automated Deployment (GitHub Actions)
1. Self-hosted runner уже настроен на сервере
2. Push в main ветку автоматически развернет приложение
3. Сборка происходит локально на сервере

### Manual Deployment
```bash
./deploy.sh
```

## Access

- **Application**: https://msamual.ru
- **API**: https://msamual.ru/api

## Security

- HTTPS with TLS 1.2/1.3
- HSTS headers
- CORS properly configured
- Server-side answer validation

## Development

### Local Development
```bash
# Backend
cd IqTestApi
dotnet run

# Frontend
cd iq-test-frontend
npm install
npm start
```

## API Endpoints

- `POST /api/IqTest/start` - Start new test
- `GET /api/IqTest/questions?count=26` - Get questions
- `GET /api/IqTest/questions/{id}` - Get specific question
- `POST /api/IqTest/submit-answer` - Submit answer
- `POST /api/IqTest/complete` - Complete test
- `GET /api/IqTest/health` - Health check

## License

MIT License