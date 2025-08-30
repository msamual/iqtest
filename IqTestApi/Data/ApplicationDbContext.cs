using Microsoft.EntityFrameworkCore;
using IqTestApi.Models;

namespace IqTestApi.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<IqQuestion> IqQuestions { get; set; }
        public DbSet<TestSession> TestSessions { get; set; }
        public DbSet<QuestionAnswer> QuestionAnswers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Настройка индексов
            modelBuilder.Entity<IqQuestion>()
                .HasIndex(q => q.Difficulty)
                .HasDatabaseName("IX_IqQuestions_Difficulty");

            modelBuilder.Entity<TestSession>()
                .HasIndex(s => s.StartTime)
                .HasDatabaseName("IX_TestSessions_StartTime");

            modelBuilder.Entity<QuestionAnswer>()
                .HasIndex(a => a.TestSessionId)
                .HasDatabaseName("IX_QuestionAnswers_TestSessionId");

            modelBuilder.Entity<QuestionAnswer>()
                .HasIndex(a => a.QuestionId)
                .HasDatabaseName("IX_QuestionAnswers_QuestionId");

            // Настройка связей
            modelBuilder.Entity<QuestionAnswer>()
                .HasOne(a => a.TestSession)
                .WithMany(s => s.Answers)
                .HasForeignKey(a => a.TestSessionId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<QuestionAnswer>()
                .HasOne(a => a.Question)
                .WithMany()
                .HasForeignKey(a => a.QuestionId)
                .OnDelete(DeleteBehavior.Restrict);

            // Настройка таблиц
            modelBuilder.Entity<IqQuestion>().ToTable("IqQuestions");
            modelBuilder.Entity<TestSession>().ToTable("TestSessions");
            modelBuilder.Entity<QuestionAnswer>().ToTable("QuestionAnswers");
        }
    }
}
