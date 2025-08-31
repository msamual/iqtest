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
- **Фронтенд локально:** `http://localhost`
- **Фронтенд на сервере:** `https://msamual.ru`
- **pgAdmin локально:** `http://localhost/pgadmin/`
- **pgAdmin на сервере:** `https://msamual.ru/pgadmin/`

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

## pgAdmin - Управление базой данных

pgAdmin предоставляет веб-интерфейс для управления PostgreSQL базой данных.

### Доступ к pgAdmin:
- **URL локально**: http://localhost/pgadmin/
- **URL на сервере**: https://msamual.ru/pgadmin/
- **Email**: admin@iqtest.com
- **Пароль**: admin123

### Подключение к базе данных:
База данных "IQ Test Database" должна автоматически появиться в списке серверов.
Если нет, добавьте сервер вручную:
- **Имя**: IQ Test Database
- **Хост**: postgres
- **Порт**: 5432
- **База данных**: iqtestdb
- **Пользователь**: iqtest
- **Пароль**: iqtest123

### Полезные SQL запросы:

```sql
-- Просмотр всех вопросов
SELECT * FROM "IqQuestions";

-- Просмотр всех тестовых сессий
SELECT * FROM "TestSessions";

-- Просмотр ответов пользователей
SELECT * FROM "QuestionAnswers";

-- Статистика по вопросам
SELECT 
    q."QuestionText",
    COUNT(qa."Id") as total_answers,
    COUNT(CASE WHEN qa."IsCorrect" = true THEN 1 END) as correct_answers,
    ROUND(
        COUNT(CASE WHEN qa."IsCorrect" = true THEN 1 END) * 100.0 / COUNT(qa."Id"), 
        2
    ) as success_rate
FROM "IqQuestions" q
LEFT JOIN "QuestionAnswers" qa ON q."Id" = qa."QuestionId"
GROUP BY q."Id", q."QuestionText"
ORDER BY success_rate DESC;

-- Средний IQ по завершенным тестам
SELECT 
    COUNT(*) as completed_tests,
    ROUND(AVG("IqScore"), 2) as average_iq,
    MIN("IqScore") as min_iq,
    MAX("IqScore") as max_iq
FROM "TestSessions" 
WHERE "IsCompleted" = true;

-- Топ результатов
SELECT 
    "Id",
    "IqScore",
    "TotalScore",
    "MaxPossibleScore",
    "StartTime",
    "EndTime",
    EXTRACT(EPOCH FROM ("EndTime" - "StartTime")) as duration_seconds
FROM "TestSessions" 
WHERE "IsCompleted" = true
ORDER BY "IqScore" DESC
LIMIT 10;
```
