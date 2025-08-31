using IqTestApi.Models;
using IqTestApi.Data;
using Microsoft.EntityFrameworkCore;

namespace IqTestApi.Services
{
    public interface IIqTestService
    {
        Task<List<IqQuestionForClient>> GetQuestionsAsync(int count = 20);
        Task<IqQuestion?> GetQuestionByIdAsync(int id);
        Task<TestSession> CreateTestSessionAsync(Guid? userId = null);
        Task<TestSession> SubmitAnswerAsync(Guid sessionId, int questionId, int answerIndex, int timeSpent);
        Task<TestSession> CompleteTestAsync(Guid sessionId);
        Task<TestSession?> GetTestSessionAsync(Guid sessionId);
        Task<List<TestSession>> GetUserTestSessionsAsync(Guid userId);
    }

    public class IqTestService : IIqTestService
    {
        private readonly ApplicationDbContext _context;

        public IqTestService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<IqQuestionForClient>> GetQuestionsAsync(int count = 20)
        {
            var totalQuestions = await _context.IqQuestions.CountAsync();
            if (totalQuestions == 0)
            {
                throw new InvalidOperationException("No questions available in database");
            }

            // Получаем случайные вопросы
            var selectedQuestions = await _context.IqQuestions
                .OrderBy(q => Guid.NewGuid()) // Случайная сортировка
                .Take(count)
                .ToListAsync();
            
            // Убираем correctAnswerIndex из ответа для безопасности
            return selectedQuestions.Select(q => new IqQuestionForClient
            {
                Id = q.Id,
                QuestionText = q.QuestionText,
                QuestionImage = q.QuestionImage,
                Options = q.Options,
                Explanation = q.Explanation,
                Difficulty = q.Difficulty,
                TimeLimit = q.TimeLimit
            }).ToList();
        }

        public async Task<IqQuestion?> GetQuestionByIdAsync(int id)
        {
            return await _context.IqQuestions.FirstOrDefaultAsync(q => q.Id == id);
        }

        public async Task<TestSession> CreateTestSessionAsync(Guid? userId = null)
        {
            var session = new TestSession
            {
                Id = Guid.NewGuid(),
                StartTime = DateTime.UtcNow,
                IsCompleted = false,
                UserId = userId
            };

            _context.TestSessions.Add(session);
            await _context.SaveChangesAsync();
            
            return session;
        }

        public async Task<TestSession> SubmitAnswerAsync(Guid sessionId, int questionId, int answerIndex, int timeSpent)
        {
            var session = await _context.TestSessions
                .Include(s => s.Answers)
                .FirstOrDefaultAsync(s => s.Id == sessionId);

            if (session == null)
                throw new ArgumentException("Session not found");

            var question = await GetQuestionByIdAsync(questionId);
            if (question == null)
                throw new ArgumentException("Question not found");

            var isCorrect = answerIndex == question.CorrectAnswerIndex;

            var answer = new QuestionAnswer
            {
                TestSessionId = sessionId,
                QuestionId = questionId,
                SelectedAnswerIndex = answerIndex,
                IsCorrect = isCorrect,
                TimeSpent = timeSpent,
                AnsweredAt = DateTime.UtcNow
            };

            _context.QuestionAnswers.Add(answer);
            await _context.SaveChangesAsync();

            // Возвращаем обновленную сессию
            return await GetTestSessionAsync(sessionId) ?? session;
        }

        public async Task<TestSession> CompleteTestAsync(Guid sessionId)
        {
            var session = await _context.TestSessions
                .Include(s => s.Answers)
                .FirstOrDefaultAsync(s => s.Id == sessionId);

            if (session == null)
                throw new ArgumentException("Session not found");

            session.EndTime = DateTime.UtcNow;
            session.IsCompleted = true;

            // Подсчет результатов
            session.TotalScore = session.Answers.Count(a => a.IsCorrect);
            session.MaxPossibleScore = session.Answers.Count;
            
            // Простая формула для IQ (можно усложнить)
            session.IqScore = CalculateIqScore(session.TotalScore, session.MaxPossibleScore);

            await _context.SaveChangesAsync();
            return session;
        }

        public async Task<TestSession?> GetTestSessionAsync(Guid sessionId)
        {
            return await _context.TestSessions
                .Include(s => s.Answers)
                .ThenInclude(a => a.Question)
                .FirstOrDefaultAsync(s => s.Id == sessionId);
        }

        private double CalculateIqScore(int correctAnswers, int totalQuestions)
        {
            if (totalQuestions == 0) return 100.0;
            
            // Более реалистичная формула IQ
            var percentage = (double)correctAnswers / totalQuestions * 100;
            
            // Используем нормальное распределение для IQ
            // 50% правильных ответов = IQ 100
            // 100% правильных ответов = IQ 130
            // 0% правильных ответов = IQ 70
            var iqScore = 60 + (percentage / 90.0) * 60;
            
            // Ограничиваем значения и избегаем NaN/Infinity
            if (double.IsNaN(iqScore) || double.IsInfinity(iqScore))
                return 100.0;
                
            return Math.Max(70.0, Math.Min(130.0, iqScore));
        }

        public async Task<List<TestSession>> GetUserTestSessionsAsync(Guid userId)
        {
            return await _context.TestSessions
                .Where(s => s.UserId == userId)
                .Include(s => s.Answers)
                    .ThenInclude(a => a.Question)
                .OrderByDescending(s => s.StartTime)
                .ToListAsync();
        }
    }
}
