using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace IqTestApi.Models
{
    public class TestSession
    {
        [Key]
        public Guid Id { get; set; }
        
        [Required]
        public DateTime StartTime { get; set; }
        
        public DateTime? EndTime { get; set; }
        
        // Связь с пользователем
        public Guid? UserId { get; set; }
        
        // Навигационные свойства
        [ForeignKey("UserId")]
        [JsonIgnore]
        public virtual User? User { get; set; }
        
        public virtual ICollection<QuestionAnswer> Answers { get; set; } = new List<QuestionAnswer>();
        
        public int TotalScore { get; set; }
        public int MaxPossibleScore { get; set; }
        public double IqScore { get; set; }
        public bool IsCompleted { get; set; }
    }

    public class QuestionAnswer
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public Guid TestSessionId { get; set; }
        
        [Required]
        public int QuestionId { get; set; }
        
        [Required]
        [Range(0, 10)]
        public int SelectedAnswerIndex { get; set; }
        
        [Required]
        public bool IsCorrect { get; set; }
        
        [Required]
        [Range(0, 300)]
        public int TimeSpent { get; set; } // в секундах
        
        [Required]
        public DateTime AnsweredAt { get; set; }
        
        // Навигационные свойства
        [ForeignKey("TestSessionId")]
        [JsonIgnore]
        public virtual TestSession TestSession { get; set; } = null!;
        
        [ForeignKey("QuestionId")]
        [JsonIgnore]
        public virtual IqQuestion Question { get; set; } = null!;
    }
}
