import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TestSession } from '../../services/iq-test.service';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="results-container">
      <div class="results-card">
        <div class="header">
          <h1 class="title">Результаты IQ-теста</h1>
          <div class="completion-time">
            <span class="time-label">Время прохождения:</span>
            <span class="time-value">{{ formatCompletionTime() }}</span>
          </div>
        </div>

        <div class="score-section">
          <div class="iq-score">
            <div class="score-circle" [class]="getScoreClass()">
              <span class="score-number">{{ session?.iqScore?.toFixed(0) || '0' }}</span>
              <span class="score-label">IQ</span>
            </div>
            <div class="score-description">
              <h3>{{ getScoreDescription() }}</h3>
              <p>{{ getScoreExplanation() }}</p>
            </div>
          </div>

          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-value">{{ session?.totalScore || 0 }}/{{ session?.maxPossibleScore || 0 }}</div>
              <div class="stat-label">Правильных ответов</div>
              <div class="stat-percentage">{{ getPercentage() }}%</div>
            </div>
            
            <div class="stat-item">
              <div class="stat-value">{{ getAverageTime() }}</div>
              <div class="stat-label">Среднее время</div>
              <div class="stat-unit">секунд</div>
            </div>
            
            <div class="stat-item">
              <div class="stat-value">{{ getCorrectAnswersCount() }}</div>
              <div class="stat-label">Верных ответов</div>
              <div class="stat-percentage">{{ getCorrectPercentage() }}%</div>
            </div>
          </div>
        </div>

        <div class="answers-review" *ngIf="hasAnswers()">
          <h3>Обзор ответов</h3>
          <div class="answers-grid">
            <div 
              *ngFor="let answer of session?.answers || []; let i = index"
              class="answer-item"
              [class.correct]="answer.isCorrect"
              [class.incorrect]="!answer.isCorrect">
              <div class="answer-number">{{ i + 1 }}</div>
              <div class="answer-status">
                <span class="status-icon">{{ answer.isCorrect ? '✅' : '❌' }}</span>
                <span class="status-text">{{ answer.isCorrect ? 'Правильно' : 'Неправильно' }}</span>
              </div>
              <div class="answer-time">{{ formatTime(answer.timeSpent) }}</div>
            </div>
          </div>
        </div>

        <div class="actions">
          <button class="action-button secondary" (click)="goHome()">
            🏠 На главную
          </button>
          <button class="action-button primary" (click)="retakeTest()">
            🔄 Пройти тест заново
          </button>
        </div>

        <div class="share-section">
          <h4>Поделиться результатом</h4>
          <div class="share-buttons">
            <button class="share-button twitter" (click)="shareOnTwitter()">
              🐦 Twitter
            </button>
            <button class="share-button facebook" (click)="shareOnFacebook()">
              📘 Facebook
            </button>
            <button class="share-button copy" (click)="copyResults()">
              📋 Копировать
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .results-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .results-card {
      background: white;
      border-radius: 20px;
      padding: 40px;
      max-width: 800px;
      width: 100%;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    }
    
    .header {
      text-align: center;
      margin-bottom: 40px;
    }
    
    .title {
      font-size: 2.5rem;
      color: #2d3748;
      margin-bottom: 20px;
      font-weight: 700;
    }
    
    .completion-time {
      color: #718096;
      font-size: 1.1rem;
    }
    
    .time-label {
      margin-right: 10px;
    }
    
    .time-value {
      font-weight: 600;
      color: #4a5568;
    }
    
    .score-section {
      margin-bottom: 40px;
    }
    
    .iq-score {
      display: flex;
      align-items: center;
      gap: 30px;
      margin-bottom: 40px;
      padding: 30px;
      background: #f7fafc;
      border-radius: 15px;
    }
    
    .score-circle {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 700;
    }
    
    .score-circle.excellent {
      background: linear-gradient(135deg, #48bb78, #38a169);
    }
    
    .score-circle.good {
      background: linear-gradient(135deg, #4299e1, #3182ce);
    }
    
    .score-circle.average {
      background: linear-gradient(135deg, #ed8936, #dd6b20);
    }
    
    .score-circle.below-average {
      background: linear-gradient(135deg, #f56565, #e53e3e);
    }
    
    .score-number {
      font-size: 2rem;
      line-height: 1;
    }
    
    .score-label {
      font-size: 0.9rem;
      opacity: 0.9;
    }
    
    .score-description h3 {
      font-size: 1.5rem;
      color: #2d3748;
      margin-bottom: 10px;
    }
    
    .score-description p {
      color: #718096;
      line-height: 1.6;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
    }
    
    .stat-item {
      text-align: center;
      padding: 25px;
      background: #f7fafc;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
    }
    
    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: #2d3748;
      margin-bottom: 8px;
    }
    
    .stat-label {
      color: #718096;
      margin-bottom: 5px;
      font-size: 0.9rem;
    }
    
    .stat-percentage, .stat-unit {
      color: #4a5568;
      font-weight: 600;
      font-size: 0.9rem;
    }
    
    .answers-review {
      margin-bottom: 40px;
    }
    
    .answers-review h3 {
      font-size: 1.3rem;
      color: #2d3748;
      margin-bottom: 20px;
      text-align: center;
    }
    
    .answers-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 15px;
    }
    
    .answer-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 15px;
      border-radius: 10px;
      border: 2px solid;
      transition: transform 0.2s ease;
    }
    
    .answer-item:hover {
      transform: translateY(-2px);
    }
    
    .answer-item.correct {
      border-color: #48bb78;
      background: #f0fff4;
    }
    
    .answer-item.incorrect {
      border-color: #f56565;
      background: #fff5f5;
    }
    
    .answer-number {
      font-weight: 600;
      color: #4a5568;
      margin-bottom: 8px;
    }
    
    .answer-status {
      display: flex;
      align-items: center;
      gap: 5px;
      margin-bottom: 8px;
      font-size: 0.9rem;
    }
    
    .answer-time {
      font-size: 0.8rem;
      color: #718096;
    }
    
    .actions {
      display: flex;
      gap: 20px;
      justify-content: center;
      margin-bottom: 40px;
    }
    
    .action-button {
      padding: 15px 30px;
      border: none;
      border-radius: 10px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .action-button.primary {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
    }
    
    .action-button.primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
    }
    
    .action-button.secondary {
      background: #e2e8f0;
      color: #4a5568;
    }
    
    .action-button.secondary:hover {
      background: #cbd5e0;
    }
    
    .share-section {
      text-align: center;
      padding-top: 30px;
      border-top: 1px solid #e2e8f0;
    }
    
    .share-section h4 {
      color: #2d3748;
      margin-bottom: 20px;
    }
    
    .share-buttons {
      display: flex;
      gap: 15px;
      justify-content: center;
      flex-wrap: wrap;
    }
    
    .share-button {
      padding: 12px 20px;
      border: none;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .share-button.twitter {
      background: #1da1f2;
      color: white;
    }
    
    .share-button.facebook {
      background: #4267b2;
      color: white;
    }
    
    .share-button.copy {
      background: #718096;
      color: white;
    }
    
    .share-button:hover {
      transform: translateY(-2px);
      opacity: 0.9;
    }
    
    @media (max-width: 768px) {
      .results-card {
        padding: 25px;
      }
      
      .title {
        font-size: 2rem;
      }
      
      .iq-score {
        flex-direction: column;
        text-align: center;
        gap: 20px;
      }
      
      .stats-grid {
        grid-template-columns: 1fr;
      }
      
      .actions {
        flex-direction: column;
      }
      
      .share-buttons {
        flex-direction: column;
        align-items: center;
      }
    }
  `]
})
export class ResultsComponent implements OnInit {
  session: TestSession | null = null;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.session = navigation.extras.state['session'] as TestSession;
    }
  }

  ngOnInit(): void {
    if (!this.session) {
      this.router.navigate(['/']);
    }
  }

  formatCompletionTime(): string {
    if (!this.session?.startTime || !this.session?.endTime) return 'N/A';
    
    const start = new Date(this.session.startTime);
    const end = new Date(this.session.endTime);
    const diff = end.getTime() - start.getTime();
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  getScoreClass(): string {
    if (!this.session) return '';
    
    const iq = this.session.iqScore;
    if (iq >= 120) return 'excellent';
    if (iq >= 110) return 'good';
    if (iq >= 90) return 'average';
    return 'below-average';
  }

  getScoreDescription(): string {
    if (!this.session) return '';
    
    const iq = this.session.iqScore;
    if (iq >= 120) return 'Отличный результат!';
    if (iq >= 110) return 'Хороший результат!';
    if (iq >= 90) return 'Средний результат';
    return 'Результат ниже среднего';
  }

  getScoreExplanation(): string {
    if (!this.session) return '';
    
    const iq = this.session.iqScore;
    if (iq >= 120) return 'Ваш IQ находится в верхних 10% населения. Отличная работа!';
    if (iq >= 110) return 'Ваш IQ выше среднего. Вы обладаете хорошими интеллектуальными способностями.';
    if (iq >= 90) return 'Ваш IQ в пределах нормы. Продолжайте развивать свои способности!';
    return 'Помните, что IQ-тесты измеряют только определенные аспекты интеллекта.';
  }

  getPercentage(): number {
    if (!this.session || this.session.maxPossibleScore === 0) return 0;
    return Math.round((this.session.totalScore / this.session.maxPossibleScore) * 100);
  }

  getAverageTime(): number {
    if (!this.session?.answers || this.session.answers.length === 0) return 0;
    const totalTime = this.session.answers.reduce((sum, answer) => sum + answer.timeSpent, 0);
    return Math.round(totalTime / this.session.answers.length);
  }

  getCorrectAnswersCount(): number {
    if (!this.session?.answers) return 0;
    return this.session.answers.filter(a => a.isCorrect).length;
  }

  getCorrectPercentage(): number {
    if (!this.session?.answers || this.session.answers.length === 0) return 0;
    return Math.round((this.getCorrectAnswersCount() / this.session.answers.length) * 100);
  }

  hasAnswers(): boolean {
    return !!(this.session?.answers && this.session.answers.length > 0);
  }

  formatTime(seconds: number): string {
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  retakeTest(): void {
    this.router.navigate(['/test']);
  }

  shareOnTwitter(): void {
    const text = `Мой IQ: ${this.session?.iqScore?.toFixed(0) || '0'}! Пройдите тест на iq-test.com`;
    const url = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(text);
    window.open(url, '_blank');
  }

  shareOnFacebook(): void {
    const url = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(window.location.href);
    window.open(url, '_blank');
  }

  copyResults(): void {
    const text = `Мой IQ: ${this.session?.iqScore?.toFixed(0) || '0'}\nПравильных ответов: ${this.session?.totalScore || 0}/${this.session?.maxPossibleScore || 0}\nВремя: ${this.formatCompletionTime()}`;
    navigator.clipboard.writeText(text).then(() => {
      alert('Результаты скопированы в буфер обмена!');
    });
  }
}
