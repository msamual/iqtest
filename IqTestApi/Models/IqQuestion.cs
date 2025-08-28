namespace IqTestApi.Models
{
    public class IqQuestion
    {
        public int Id { get; set; }
        public string QuestionText { get; set; } = string.Empty;
        public string QuestionImage { get; set; } = string.Empty;
        public List<string> Options { get; set; } = new List<string>();
        public int CorrectAnswerIndex { get; set; }
        public string Explanation { get; set; } = string.Empty;
        public int Difficulty { get; set; } // 1-5, где 5 - самый сложный
        public int TimeLimit { get; set; } // в секундах
    }

    public class IqQuestionForClient
    {
        public int Id { get; set; }
        public string QuestionText { get; set; } = string.Empty;
        public string QuestionImage { get; set; } = string.Empty;
        public List<string> Options { get; set; } = new List<string>();
        public string Explanation { get; set; } = string.Empty;
        public int Difficulty { get; set; }
        public int TimeLimit { get; set; }
    }
}
