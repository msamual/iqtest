using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IqTestApi.Models
{
    public class IqQuestion
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [MaxLength(1000)]
        public string QuestionText { get; set; } = string.Empty;
        
        [MaxLength(500)]
        public string QuestionImage { get; set; } = string.Empty;
        
        [Required]
        public string OptionsJson { get; set; } = string.Empty; // JSON строка для хранения списка вариантов
        
        [Required]
        public int CorrectAnswerIndex { get; set; }
        
        [Required]
        [MaxLength(2000)]
        public string Explanation { get; set; } = string.Empty;
        
        [Required]
        [Range(1, 5)]
        public int Difficulty { get; set; } // 1-5, где 5 - самый сложный
        
        [Required]
        [Range(10, 300)]
        public int TimeLimit { get; set; } // в секундах
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Свойство для работы с Options как списком (не сохраняется в БД)
        [NotMapped]
        public List<string> Options 
        { 
            get => string.IsNullOrEmpty(OptionsJson) ? new List<string>() : 
                   System.Text.Json.JsonSerializer.Deserialize<List<string>>(OptionsJson) ?? new List<string>();
            set => OptionsJson = System.Text.Json.JsonSerializer.Serialize(value);
        }
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
