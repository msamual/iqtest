using Microsoft.EntityFrameworkCore;
using IqTestApi.Models;

namespace IqTestApi.Data
{
    public static class DataSeeder
    {
        public static async Task SeedDataAsync(ApplicationDbContext context)
        {
            // Проверяем, есть ли уже данные
            if (await context.IqQuestions.AnyAsync())
            {
                return; // База данных уже заполнена
            }

            var questions = new List<IqQuestion>
            {
                new IqQuestion
                {
                    QuestionText = "Какое число должно быть следующим в последовательности: 2, 4, 8, 16, ...?",
                    Options = new List<string> { "24", "32", "30", "28" },
                    CorrectAnswerIndex = 1,
                    Explanation = "Каждое число умножается на 2: 2×2=4, 4×2=8, 8×2=16, 16×2=32",
                    Difficulty = 2,
                    TimeLimit = 60
                },
                new IqQuestion
                {
                    QuestionText = "Если все розы - цветы, а некоторые цветы быстро увядают, то:",
                    Options = new List<string> 
                    { 
                        "Все розы быстро увядают", 
                        "Некоторые розы быстро увядают", 
                        "Ни одна роза не увядает быстро", 
                        "Нельзя определить" 
                    },
                    CorrectAnswerIndex = 3,
                    Explanation = "Из данных посылок нельзя сделать однозначный вывод. Множество роз может не пересекаться с множеством быстро увядающих цветов",
                    Difficulty = 4,
                    TimeLimit = 120
                },
                new IqQuestion
                {
                    QuestionText = "Сколько треугольников на рисунке?",
                    QuestionImage = "/images/triangles.svg",
                    Options = new List<string> { "8", "10", "12", "14" },
                    CorrectAnswerIndex = 2,
                    Explanation = "Нужно внимательно посчитать все треугольники, включая составные",
                    Difficulty = 4,
                    TimeLimit = 120
                },
                new IqQuestion
                {
                    QuestionText = "Какое слово не подходит к остальным: КОТ, СОБАКА, РЫБА, ПТИЦА?",
                    Options = new List<string> { "КОТ", "СОБАКА", "РЫБА", "ПТИЦА" },
                    CorrectAnswerIndex = 2,
                    Explanation = "Рыба - единственное животное, которое живет в воде, остальные - наземные",
                    Difficulty = 2,
                    TimeLimit = 45
                },
                new IqQuestion
                {
                    QuestionText = "Продолжите последовательность: А, В, Г, Д, ...",
                    Options = new List<string> { "Е", "Ж", "З", "И" },
                    CorrectAnswerIndex = 0,
                    Explanation = "Это последовательность букв русского алфавита через одну: А, В, Г, Д, Е",
                    Difficulty = 1,
                    TimeLimit = 30
                },
                new IqQuestion
                {
                    QuestionText = "Если 3 яблока стоят 90 рублей, сколько стоят 5 яблок?",
                    Options = new List<string> { "120", "150", "180", "200" },
                    CorrectAnswerIndex = 1,
                    Explanation = "Одно яблоко стоит 90÷3=30 рублей, значит 5 яблок стоят 5×30=150 рублей",
                    Difficulty = 2,
                    TimeLimit = 60
                },
                new IqQuestion
                {
                    QuestionText = "Какое число должно быть следующим: 1, 4, 9, 16, 25, ...?",
                    Options = new List<string> { "30", "36", "40", "49" },
                    CorrectAnswerIndex = 1,
                    Explanation = "Это квадраты натуральных чисел: 1²=1, 2²=4, 3²=9, 4²=16, 5²=25, 6²=36",
                    Difficulty = 3,
                    TimeLimit = 75
                },
                new IqQuestion
                {
                    QuestionText = "Если все книги - это предметы, а некоторые предметы тяжелые, то:",
                    Options = new List<string> 
                    { 
                        "Все книги тяжелые", 
                        "Некоторые книги тяжелые", 
                        "Ни одна книга не тяжелая", 
                        "Нельзя определить" 
                    },
                    CorrectAnswerIndex = 3,
                    Explanation = "Из данных посылок нельзя сделать однозначный вывод. Множество книг может не пересекаться с множеством тяжелых предметов",
                    Difficulty = 3,
                    TimeLimit = 90
                },
                new IqQuestion
                {
                    QuestionText = "Какое слово является синонимом к слову 'БЫСТРЫЙ'?",
                    Options = new List<string> { "МЕДЛЕННЫЙ", "СКОРЫЙ", "ТЯЖЕЛЫЙ", "ЛЕГКИЙ" },
                    CorrectAnswerIndex = 1,
                    Explanation = "Скорый - это синоним к слову быстрый",
                    Difficulty = 1,
                    TimeLimit = 30
                },
                new IqQuestion
                {
                    QuestionText = "Продолжите последовательность: 5, 10, 20, 40, ...",
                    Options = new List<string> { "60", "70", "80", "90" },
                    CorrectAnswerIndex = 2,
                    Explanation = "Каждое число умножается на 2: 5×2=10, 10×2=20, 20×2=40, 40×2=80",
                    Difficulty = 2,
                    TimeLimit = 60
                },
                new IqQuestion
                {
                    QuestionText = "Если сегодня среда, какой день будет через 10 дней?",
                    Options = new List<string> { "Суббота", "Воскресенье", "Понедельник", "Вторник" },
                    CorrectAnswerIndex = 0,
                    Explanation = "10 дней = 1 неделя + 3 дня. Среда + 3 дня = суббота",
                    Difficulty = 3,
                    TimeLimit = 90
                },
                new IqQuestion
                {
                    QuestionText = "Какое число должно быть следующим: 2, 6, 12, 20, 30, ...?",
                    Options = new List<string> { "40", "42", "44", "48" },
                    CorrectAnswerIndex = 1,
                    Explanation = "Разности: 4, 6, 8, 10, следующая разность 12, значит 30+12=42",
                    Difficulty = 4,
                    TimeLimit = 120
                },
                new IqQuestion
                {
                    QuestionText = "Если все студенты учатся, а некоторые студенты спят, то:",
                    Options = new List<string> 
                    { 
                        "Все студенты спят", 
                        "Некоторые студенты спят", 
                        "Ни один студент не спит", 
                        "Нельзя определить" 
                    },
                    CorrectAnswerIndex = 1,
                    Explanation = "Это тавтология - утверждение 'некоторые студенты спят' уже дано в условии задачи",
                    Difficulty = 1,
                    TimeLimit = 30
                },
                new IqQuestion
                {
                    QuestionText = "Какое слово является антонимом к слову 'ТЕМНЫЙ'?",
                    Options = new List<string> { "ЧЕРНЫЙ", "СВЕТЛЫЙ", "СЕРЫЙ", "БЕЛЫЙ" },
                    CorrectAnswerIndex = 1,
                    Explanation = "Светлый - это антоним к слову темный",
                    Difficulty = 1,
                    TimeLimit = 30
                },
                new IqQuestion
                {
                    QuestionText = "Продолжите последовательность: 1, 1, 2, 3, 5, 8, ...",
                    Options = new List<string> { "11", "12", "13", "14" },
                    CorrectAnswerIndex = 2,
                    Explanation = "Это числа Фибоначчи: каждое число равно сумме двух предыдущих. 5+8=13",
                    Difficulty = 4,
                    TimeLimit = 120
                },
                new IqQuestion
                {
                    QuestionText = "Если 2x + 4 = 12, то x равно:",
                    Options = new List<string> { "2", "3", "4", "5" },
                    CorrectAnswerIndex = 2,
                    Explanation = "2x + 4 = 12, значит 2x = 8, следовательно x = 4",
                    Difficulty = 3,
                    TimeLimit = 90
                },
                new IqQuestion
                {
                    QuestionText = "Какое число должно быть следующим: 1, 8, 27, 64, ...?",
                    Options = new List<string> { "100", "125", "144", "169" },
                    CorrectAnswerIndex = 1,
                    Explanation = "Это кубы натуральных чисел: 1³=1, 2³=8, 3³=27, 4³=64, 5³=125",
                    Difficulty = 4,
                    TimeLimit = 120
                },
                new IqQuestion
                {
                    QuestionText = "Если все машины - транспорт, а некоторые виды транспорта быстрые, то:",
                    Options = new List<string> 
                    { 
                        "Все машины быстрые", 
                        "Некоторые машины быстрые", 
                        "Ни одна машина не быстрая", 
                        "Нельзя определить" 
                    },
                    CorrectAnswerIndex = 1,
                    Explanation = "Логический вывод: если все машины - транспорт, а некоторые виды транспорта быстрые, то некоторые машины могут быть быстрыми",
                    Difficulty = 3,
                    TimeLimit = 90
                },
                new IqQuestion
                {
                    QuestionText = "Продолжите последовательность: 3, 7, 15, 31, ...",
                    Options = new List<string> { "55", "63", "71", "79" },
                    CorrectAnswerIndex = 1,
                    Explanation = "Каждое число = предыдущее × 2 + 1: 3×2+1=7, 7×2+1=15, 15×2+1=31, 31×2+1=63",
                    Difficulty = 4,
                    TimeLimit = 120
                },
                new IqQuestion
                {
                    QuestionText = "Какое слово не подходит к остальным: СТОЛ, СТУЛ, ДИВАН, КНИГА?",
                    Options = new List<string> { "СТОЛ", "СТУЛ", "ДИВАН", "КНИГА" },
                    CorrectAnswerIndex = 3,
                    Explanation = "Книга - единственный предмет, который не является мебелью",
                    Difficulty = 2,
                    TimeLimit = 45
                },
                new IqQuestion
                {
                    QuestionText = "Если куб имеет объем 27 кубических единиц, какова длина его ребра?",
                    Options = new List<string> { "3", "6", "9", "12" },
                    CorrectAnswerIndex = 0,
                    Explanation = "Объем куба = a³, где a - длина ребра. 27 = a³, значит a = 3",
                    Difficulty = 3,
                    TimeLimit = 90
                },
                new IqQuestion
                {
                    QuestionText = "Сколько граней у октаэдра?",
                    Options = new List<string> { "6", "8", "10", "12" },
                    CorrectAnswerIndex = 1,
                    Explanation = "Октаэдр - это многогранник с 8 треугольными гранями",
                    Difficulty = 4,
                    TimeLimit = 120
                },
                new IqQuestion
                {
                    QuestionText = "Какая фигура получится при повороте на 90° по часовой стрелке?",
                    QuestionImage = "/images/rotation.svg",
                    Options = new List<string> { "Г", "Т", "П", "И" },
                    CorrectAnswerIndex = 0,
                    Explanation = "При повороте фигуры на 90° по часовой стрелке получается буква 'Г'",
                    Difficulty = 2,
                    TimeLimit = 60
                },
                new IqQuestion
                {
                    QuestionText = "Какое число должно быть следующим: 1, 3, 6, 10, 15, ...?",
                    Options = new List<string> { "18", "21", "24", "28" },
                    CorrectAnswerIndex = 1,
                    Explanation = "Это треугольные числа: 1, 1+2=3, 1+2+3=6, 1+2+3+4=10, 1+2+3+4+5=15, 1+2+3+4+5+6=21",
                    Difficulty = 4,
                    TimeLimit = 120
                },
                new IqQuestion
                {
                    QuestionText = "Какая фигура должна быть следующей в паттерне?",
                    QuestionImage = "/images/pattern.svg",
                    Options = new List<string> { "Круг", "Квадрат", "Треугольник", "Ромб" },
                    CorrectAnswerIndex = 2,
                    Explanation = "Паттерн: круг, квадрат, треугольник, круг, квадрат, треугольник...",
                    Difficulty = 3,
                    TimeLimit = 90
                },
                new IqQuestion
                {
                    QuestionText = "Сколько кубиков на рисунке?",
                    QuestionImage = "/images/cubes.svg",
                    Options = new List<string> { "4", "5", "6", "7" },
                    CorrectAnswerIndex = 1,
                    Explanation = "На рисунке изображено 5 кубиков: 3 в нижнем ряду и 2 в верхнем",
                    Difficulty = 3,
                    TimeLimit = 90
                }
            };

            await context.IqQuestions.AddRangeAsync(questions);
            await context.SaveChangesAsync();
        }
    }
}
