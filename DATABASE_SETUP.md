# База данных PostgreSQL - Настройка и запуск

## Универсальный запуск

### Простая команда для любой среды
```bash
# Запуск всего стека (PostgreSQL + API + Frontend)
docker-compose up -d --build

# Остановка
docker-compose down
```

**Доступные адреса:**
- **Локально:** `http://localhost`
- **На сервере:** `https://msamual.ru`

### Полезные команды
```bash
# Просмотр логов
docker-compose logs -f

# Логи конкретного сервиса
docker-compose logs -f iq-test-api
docker-compose logs -f postgres

# Статус сервисов
docker-compose ps

# Полная очистка (включая данные БД)
docker-compose down -v
```

## Конфигурация подключения

### Разработка
- **Host**: `localhost`
- **Port**: `5432`
- **Database**: `iqtestdb`
- **Username**: `iqtest`
- **Password**: `iqtest123`

### Продакшен
- **Host**: `postgres` (имя контейнера)
- **Port**: `5432`
- **Database**: `iqtestdb`
- **Username**: `iqtest`
- **Password**: `iqtest123`

## Миграции

Миграции применяются автоматически при запуске API:
- В режиме разработки: при ошибке приложение остановится
- В режиме продакшена: при ошибке приложение продолжит работать

### Создание новой миграции
```bash
cd IqTestApi
dotnet ef migrations add [ИмяМиграции]
```

## Начальные данные

Начальные данные (26 вопросов для IQ теста) загружаются автоматически при первом запуске приложения.

## Проверка работы

### API Health Check
```bash
curl http://localhost:5263/api/IqTest/health
```

### Получение вопросов
```bash
curl http://localhost:5263/api/IqTest/questions?count=5
```

### Создание тестовой сессии
```bash
curl -X POST http://localhost:5263/api/IqTest/start
```
