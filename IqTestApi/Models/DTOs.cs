namespace IqTestApi.Models
{
    public class TestSessionDto
    {
        public Guid Id { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public List<QuestionAnswerDto> Answers { get; set; } = new List<QuestionAnswerDto>();
        public int TotalScore { get; set; }
        public int MaxPossibleScore { get; set; }
        public double IqScore { get; set; }
        public bool IsCompleted { get; set; }

        public static TestSessionDto FromEntity(TestSession session)
        {
            return new TestSessionDto
            {
                Id = session.Id,
                StartTime = session.StartTime,
                EndTime = session.EndTime,
                TotalScore = session.TotalScore,
                MaxPossibleScore = session.MaxPossibleScore,
                IqScore = session.IqScore,
                IsCompleted = session.IsCompleted,
                Answers = session.Answers?.Select(QuestionAnswerDto.FromEntity).ToList() ?? new List<QuestionAnswerDto>()
            };
        }
    }

    public class QuestionAnswerDto
    {
        public int Id { get; set; }
        public int QuestionId { get; set; }
        public int SelectedAnswerIndex { get; set; }
        public bool IsCorrect { get; set; }
        public int TimeSpent { get; set; }
        public DateTime AnsweredAt { get; set; }

        public static QuestionAnswerDto FromEntity(QuestionAnswer answer)
        {
            return new QuestionAnswerDto
            {
                Id = answer.Id,
                QuestionId = answer.QuestionId,
                SelectedAnswerIndex = answer.SelectedAnswerIndex,
                IsCorrect = answer.IsCorrect,
                TimeSpent = answer.TimeSpent,
                AnsweredAt = answer.AnsweredAt
            };
        }
    }
}
