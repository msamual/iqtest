namespace IqTestApi.Models
{
    public class TestSession
    {
        public Guid Id { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public List<QuestionAnswer> Answers { get; set; } = new List<QuestionAnswer>();
        public int TotalScore { get; set; }
        public int MaxPossibleScore { get; set; }
        public double IqScore { get; set; }
        public bool IsCompleted { get; set; }
    }

    public class QuestionAnswer
    {
        public int QuestionId { get; set; }
        public int SelectedAnswerIndex { get; set; }
        public bool IsCorrect { get; set; }
        public int TimeSpent { get; set; } // в секундах
        public DateTime AnsweredAt { get; set; }
    }
}
