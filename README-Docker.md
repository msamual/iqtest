# IQ Test Application - Docker Setup

Это приложение для прохождения IQ-тестов, развернутое в Docker.

## Архитектура

- **Frontend**: Angular 18 приложение
- **Backend**: ASP.NET Core Web API
- **Web Server**: Nginx для Angular
- **Containerization**: Docker + Docker Compose

## Быстрый запуск

### Предварительные требования

- Docker Desktop установлен и запущен
- Docker Compose доступен

### Запуск приложения

1. **Клонируйте репозиторий и перейдите в директорию:**
   ```bash
   cd iq
   ```

2. **Запустите все сервисы одной командой:**
   ```bash
   docker-compose up --build
   ```

3. **Откройте приложение в браузере:**
   - Frontend: http://localhost:4200
   - Backend API: https://localhost:7210

### Остановка приложения

```bash
docker-compose down
```

## Структура проекта

```
iq/
├── docker-compose.yml          # Основной файл Docker Compose
├── IqTestApi/                  # .NET Backend
│   ├── Dockerfile             # Dockerfile для API
│   ├── .dockerignore          # Исключения для Docker
│   └── ...                    # Исходный код API
├── iq-test-frontend/          # Angular Frontend
│   ├── Dockerfile             # Dockerfile для Angular
│   ├── nginx.conf             # Конфигурация Nginx
│   ├── .dockerignore          # Исключения для Docker
│   └── ...                    # Исходный код Angular
└── README-Docker.md           # Этот файл
```

## Конфигурация

### Порты

- **4200**: Angular Frontend (Nginx)
- **7210**: .NET API (HTTPS)
- **5263**: .NET API (HTTP)

### Переменные окружения

- `ASPNETCORE_ENVIRONMENT=Development`
- `ASPNETCORE_URLS=https://+:7210;http://+:5263`
- `NODE_ENV=development`

## Разработка

### Локальная разработка без Docker

Если вы хотите разрабатывать локально:

1. **Backend (.NET):**
   ```bash
   cd IqTestApi
   dotnet run
   ```

2. **Frontend (Angular):**
   ```bash
   cd iq-test-frontend
   npm install
   ng serve
   ```

### Обновление Docker образов

После изменения кода:

```bash
docker-compose up --build
```

### Просмотр логов

```bash
# Все сервисы
docker-compose logs

# Конкретный сервис
docker-compose logs iq-test-api
docker-compose logs iq-test-frontend
```

## Устранение неполадок

### Проблемы с портами

Если порты заняты, измените их в `docker-compose.yml`:

```yaml
ports:
  - "4201:4200"  # Внешний порт:Внутренний порт
```

### Проблемы с SSL сертификатами

Для .NET API в Docker:
```bash
docker-compose exec iq-test-api dotnet dev-certs https --trust
```

### Очистка Docker

```bash
# Остановить и удалить контейнеры
docker-compose down

# Удалить образы
docker-compose down --rmi all

# Полная очистка
docker system prune -a
```

## API Endpoints

- `GET /api/IqTest/questions?count={count}` - Получить вопросы
- `POST /api/IqTest/start` - Начать тест
- `POST /api/IqTest/submit-answer` - Отправить ответ
- `POST /api/IqTest/complete` - Завершить тест
- `GET /api/IqTest/session/{sessionId}` - Получить сессию

## Особенности

- **Hot Reload**: Изменения в коде автоматически перезагружают приложение
- **API Proxy**: Nginx проксирует API запросы к .NET backend
- **CORS**: Настроен для работы между frontend и backend
- **Development Certificates**: Автоматическая генерация SSL сертификатов
