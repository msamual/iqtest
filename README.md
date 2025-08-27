# IQ Test Application

Веб-приложение для прохождения IQ-теста с фронтендом на Angular и бэкендом на .NET.

## Структура проекта

```
iq/
├── IqTestApi/          # .NET Web API бэкенд
│   ├── Controllers/    # API контроллеры
│   ├── Models/         # Модели данных
│   ├── Services/       # Бизнес-логика
│   └── Program.cs      # Точка входа
└── iq-test-frontend/   # Angular фронтенд
    ├── src/
    │   ├── app/
    │   │   ├── components/  # Компоненты UI
    │   │   ├── services/    # Сервисы для API
    │   │   └── app.routes.ts # Маршрутизация
    │   └── main.ts
    └── package.json
```

## Возможности

- 🧠 20 разнообразных вопросов на логику, математику и пространственное мышление
- ⏱️ Временные ограничения для каждого вопроса
- 📊 Детальные результаты с расчетом IQ
- 🎯 Навигация между вопросами
- 📱 Адаптивный дизайн для мобильных устройств
- 🔄 Возможность пройти тест заново
- 📤 Поделиться результатами в социальных сетях

## Технологии

### Бэкенд (.NET)
- ASP.NET Core Web API
- C# 12
- In-memory хранилище данных
- RESTful API

### Фронтенд (Angular)
- Angular 18
- TypeScript
- SCSS стили
- Responsive дизайн
- Server-Side Rendering (SSR)

## Запуск проекта

### Предварительные требования

- .NET 8 SDK
- Node.js 18+
- npm или yarn

### Запуск бэкенда

1. Перейдите в директорию бэкенда:
```bash
cd IqTestApi
```

2. Восстановите зависимости:
```bash
dotnet restore
```

3. Запустите API:
```bash
dotnet run
```

API будет доступен по адресу: `https://localhost:7001`

### Запуск фронтенда

1. Перейдите в директорию фронтенда:
```bash
cd iq-test-frontend
```

2. Установите зависимости:
```bash
npm install
```

3. Запустите приложение:
```bash
npm start
```

Фронтенд будет доступен по адресу: `http://localhost:4200`

## API Endpoints

- `POST /api/IqTest/start` - Начать новый тест
- `GET /api/IqTest/questions?count=20` - Получить вопросы
- `GET /api/IqTest/questions/{id}` - Получить конкретный вопрос
- `POST /api/IqTest/submit-answer` - Отправить ответ
- `POST /api/IqTest/complete` - Завершить тест
- `GET /api/IqTest/session/{sessionId}` - Получить сессию теста

## Структура вопросов

Каждый вопрос содержит:
- Текст вопроса
- Опциональное изображение
- 4 варианта ответа
- Индекс правильного ответа
- Объяснение
- Уровень сложности (1-5)
- Временное ограничение

## Расчет IQ

IQ рассчитывается по формуле:
```
IQ = 100 + (процент правильных ответов - 50) * 2
```

Диапазон: 70-130

## Разработка

### Добавление новых вопросов

Отредактируйте метод `GenerateSampleQuestions()` в `IqTestService.cs`:

```csharp
private List<IqQuestion> GenerateSampleQuestions()
{
    return new List<IqQuestion>
    {
        new IqQuestion
        {
            Id = 4,
            QuestionText = "Ваш новый вопрос",
            Options = new List<string> { "A", "B", "C", "D" },
            CorrectAnswerIndex = 0,
            Explanation = "Объяснение",
            Difficulty = 3,
            TimeLimit = 60
        }
        // ... другие вопросы
    };
}
```

### Кастомизация UI

Стили компонентов находятся в файлах `.ts` в секции `styles`. Используйте SCSS для более сложных стилей.

## Лицензия

MIT License

## Поддержка

При возникновении проблем создайте issue в репозитории проекта.
# iqtest
