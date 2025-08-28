import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IqTestService, IqQuestion, TestSession } from '../../services/iq-test.service';
import { Subscription, interval, of } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="test-container">
      <!-- Состояние начала теста -->
      <div class="start-container" *ngIf="testState === 'notStarted'">
        <i class="fas fa-brain icon-large"></i>
        <h2>Тест на IQ</h2>
        <p>Этот тест состоит из 20 вопросов с ограничением времени для каждого. Ответы нельзя изменить после выбора. Убедитесь, что у вас есть достаточно времени для завершения теста.</p>
        <button class="start-button" (click)="startTest()">
          <i class="fas fa-play"></i> Начать тест
        </button>
      </div>

      <!-- Состояние загрузки -->
      <div class="loading-container" *ngIf="testState === 'loading'">
        <div class="loading-spinner"></div>
        <h2>Загрузка вопросов</h2>
        <p>Пожалуйста, подождите, вопросы теста загружаются...</p>
      </div>

      <!-- Состояние ошибки -->
      <div class="error-container" *ngIf="testState === 'error'">
        <i class="fas fa-exclamation-triangle icon-large error-icon"></i>
        <h2>Ошибка загрузки</h2>
        <p>Не удалось загрузить вопросы теста. Пожалуйста, проверьте ваше интернет-соединение и попробуйте снова.</p>
        <button class="retry-button" (click)="retryLoading()">
          <i class="fas fa-redo"></i> Попробовать снова
        </button>
      </div>

      <!-- Основной интерфейс теста -->
      <div *ngIf="testState === 'inProgress'">
        <div class="test-header">
          <div class="progress-info">
            <span class="question-counter">Вопрос {{ currentQuestionIndex + 1 }} из {{ questions.length }}</span>
            <div class="progress-bar">
              <div class="progress-fill" [style.width.%]="progressPercentage"></div>
            </div>
          </div>
          
          <div class="timer-section">
            <div class="timer" [class.warning]="timeLeft <= 10">
              <span class="timer-icon">⏱️</span>
              <span class="time-left">{{ formatTime(timeLeft) }}</span>
            </div>
          </div>
        </div>

        <div class="question-container" *ngIf="currentQuestion">
          <div class="question-content">
            <h2 class="question-text">{{ currentQuestion.questionText }}</h2>
            
            <div class="question-image" *ngIf="currentQuestion.questionImage">
              <img [src]="getImageUrl(currentQuestion.questionImage)" [alt]="'Вопрос ' + (currentQuestionIndex + 1)">
            </div>
            
            <div class="options">
              <button 
                *ngFor="let option of currentQuestion.options; let i = index"
                class="option-button"
                [class.selected]="selectedAnswer === i"
                [class.disabled]="isAnswered"
                (click)="selectAnswer(i)"
                [disabled]="isAnswered">
                <span class="option-letter">{{ getOptionLetter(i) }}</span>
                <span class="option-text">{{ option }}</span>
              </button>
            </div>
          </div>
        </div>

        <div class="test-controls">
          <button 
            class="control-button secondary" 
            (click)="previousQuestion()"
            [disabled]="currentQuestionIndex === 0">
            ← Назад
          </button>
          
          <button 
            class="control-button primary" 
            (click)="nextQuestion()"
            [disabled]="!canProceed()">
            {{ isLastQuestion() ? 'Завершить тест' : 'Далее →' }}
          </button>
        </div>

        <div class="question-navigation">
          <button 
            *ngFor="let question of questions; let i = index"
            class="nav-button"
            [class.current]="i === currentQuestionIndex"
            [class.answered]="isQuestionAnswered(i)"
            (click)="goToQuestion(i)">
            {{ i + 1 }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .test-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 20px;
      min-height: 100vh;
      background: #f8fafc;
    }
    
    .test-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: white;
      padding: 20px;
      border-radius: 15px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      margin-bottom: 30px;
    }
    
    .progress-info {
      flex: 1;
      margin-right: 30px;
    }
    
    .question-counter {
      display: block;
      font-weight: 600;
      color: #2d3748;
      margin-bottom: 10px;
    }
    
    .progress-bar {
      width: 100%;
      height: 8px;
      background: #e2e8f0;
      border-radius: 4px;
      overflow: hidden;
    }
    
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #667eea, #764ba2);
      transition: width 0.3s ease;
    }
    
    .timer-section {
      text-align: right;
    }
    
    .timer {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 15px;
      background: #f7fafc;
      border-radius: 25px;
      border: 2px solid #e2e8f0;
      transition: all 0.3s ease;
    }
    
    .timer.warning {
      background: #fed7d7;
      border-color: #f56565;
      color: #c53030;
    }
    
    .timer-icon {
      font-size: 1.2rem;
    }
    
    .time-left {
      font-weight: 600;
      font-size: 1.1rem;
    }
    
    .question-container {
      background: white;
      border-radius: 15px;
      padding: 40px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      margin-bottom: 30px;
    }
    
    .question-text {
      font-size: 1.4rem;
      color: #2d3748;
      margin-bottom: 30px;
      line-height: 1.6;
      font-weight: 600;
    }
    
    .question-image {
      text-align: center;
      margin-bottom: 30px;
    }
    
    .question-image img {
      max-width: 100%;
      max-height: 300px;
      border-radius: 10px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .options {
      display: grid;
      gap: 15px;
    }
    
    .option-button {
      display: flex;
      align-items: center;
      gap: 15px;
      padding: 20px;
      background: #f7fafc;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      text-align: left;
      font-size: 1rem;
    }
    
    .option-button:hover:not(.disabled) {
      background: #edf2f7;
      border-color: #cbd5e0;
      transform: translateY(-2px);
    }
    
    .option-button.selected {
      background: #667eea;
      border-color: #667eea;
      color: white;
    }
    
    .option-button.disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .option-letter {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: #e2e8f0;
      border-radius: 50%;
      font-weight: 600;
      font-size: 1.1rem;
    }
    
    .option-button.selected .option-letter {
      background: rgba(255, 255, 255, 0.3);
    }
    
    .option-text {
      flex: 1;
      font-weight: 500;
    }
    
    .test-controls {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
    }
    
    .control-button {
      padding: 15px 30px;
      border: none;
      border-radius: 10px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .control-button.primary {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
    }
    
    .control-button.primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
    }
    
    .control-button.secondary {
      background: #e2e8f0;
      color: #4a5568;
    }
    
    .control-button.secondary:hover:not(:disabled) {
      background: #cbd5e0;
    }
    
    .control-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .question-navigation {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      justify-content: center;
    }
    
    .nav-button {
      width: 45px;
      height: 45px;
      border: 2px solid #e2e8f0;
      background: white;
      border-radius: 50%;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
    }
    
    .nav-button:hover {
      border-color: #cbd5e0;
      background: #f7fafc;
    }
    
    .nav-button.current {
      background: #667eea;
      border-color: #667eea;
      color: white;
    }
    
    .nav-button.answered {
      background: #48bb78;
      border-color: #48bb78;
      color: white;
    }
    
    .loading-container, .error-container, .start-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 60px 40px;
      text-align: center;
    }
    
    .loading-spinner {
      width: 60px;
      height: 60px;
      border: 5px solid #e2e8f0;
      border-top: 5px solid #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 20px;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .start-button {
      padding: 15px 40px;
      font-size: 1.2rem;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      margin-top: 30px;
      font-weight: 600;
      transition: all 0.3s ease;
    }
    
    .start-button:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
    }
    
    .retry-button {
      padding: 12px 30px;
      font-size: 1rem;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      margin-top: 20px;
      font-weight: 600;
      transition: all 0.3s ease;
    }
    
    .retry-button:hover {
      background: #5a6fd8;
    }
    
    .icon-large {
      font-size: 4rem;
      margin-bottom: 20px;
      color: #667eea;
    }
    
    .error-icon {
      color: #f56565;
    }
    
    @media (max-width: 768px) {
      .test-header {
        flex-direction: column;
        gap: 20px;
        text-align: center;
      }
      
      .progress-info {
        margin-right: 0;
        margin-bottom: 20px;
      }
      
      .question-container {
        padding: 25px;
      }
      
      .question-text {
        font-size: 1.2rem;
      }
      
      .test-controls {
        flex-direction: column;
        gap: 15px;
      }
      
      .control-button {
        width: 100%;
      }
    }
  `]
})
export class TestComponent implements OnInit, OnDestroy {
  questions: IqQuestion[] = [];
  currentQuestionIndex = 0;
  currentQuestion: IqQuestion | null = null;
  selectedAnswer: number | null = null;
  isAnswered = false;
  timeLeft = 0;
  sessionId = '';
  answers: Map<number, number> = new Map();
  testState: 'notStarted' | 'loading' | 'inProgress' | 'error' = 'notStarted';
  
  private timerSubscription: Subscription | null = null;
  private sessionSubscription: Subscription | null = null;
  private questionsSubscription: Subscription | null = null;

  constructor(
    private iqTestService: IqTestService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Компонент инициализируется в состоянии 'notStarted'
  }

  ngOnDestroy(): void {
    this.timerSubscription?.unsubscribe();
    this.sessionSubscription?.unsubscribe();
    this.questionsSubscription?.unsubscribe();
  }

  get progressPercentage(): number {
    return this.questions.length > 0 ? ((this.currentQuestionIndex + 1) / this.questions.length) * 100 : 0;
  }

  startTest(): void {
    this.testState = 'loading';
    
    this.sessionSubscription = this.iqTestService.startTest().pipe(
      catchError(error => {
        console.error('Ошибка начала теста:', error);
        this.testState = 'error';
        return of(null);
      })
    ).subscribe({
      next: (session) => {
        if (session) {
          this.sessionId = session.id;
          this.loadQuestions();
        }
      }
    });
  }

  retryLoading(): void {
    this.startTest();
  }

  loadQuestions(): void {
    this.questionsSubscription = this.iqTestService.getQuestions(20).pipe(
      catchError(error => {
        console.error('Ошибка загрузки вопросов:', error);
        this.testState = 'error';
        return of([]);
      })
    ).subscribe({
      next: (questions) => {
        if (questions && questions.length > 0) {
          this.questions = questions;
          this.currentQuestion = questions[0];
          this.testState = 'inProgress';
          this.startTimer();
        } else {
          this.testState = 'error';
        }
      }
    });
  }

  startTimer(): void {
    if (this.currentQuestion) {
      this.timeLeft = this.currentQuestion.timeLimit;
      this.timerSubscription?.unsubscribe();
      
      this.timerSubscription = interval(1000).subscribe(() => {
        this.timeLeft--;
        if (this.timeLeft <= 0) {
          this.autoSubmitAnswer();
        }
      });
    }
  }

  selectAnswer(answerIndex: number): void {
    if (this.isAnswered) return;
    
    this.selectedAnswer = answerIndex;
    this.answers.set(this.currentQuestionIndex, answerIndex);
    this.isAnswered = true;
    
    // Отправляем ответ на сервер
    if (this.currentQuestion && this.sessionId) {
      this.iqTestService.submitAnswer({
        sessionId: this.sessionId,
        questionId: this.currentQuestion.id,
        answerIndex: answerIndex,
        timeSpent: this.currentQuestion.timeLimit - this.timeLeft
      }).pipe(
        catchError(error => {
          console.error('Ошибка отправки ответа:', error);
          // Продолжаем работу даже если отправка не удалась
          return of(null);
        })
      ).subscribe({
        next: (session) => {
          if (session) {
            console.log('Ответ отправлен успешно');
          }
        }
      });
    }
  }

  autoSubmitAnswer(): void {
    if (!this.isAnswered) {
      if (this.selectedAnswer !== null) {
        // Уже есть выбранный ответ, просто отмечаем как отвеченный
        this.answers.set(this.currentQuestionIndex, this.selectedAnswer);
        this.isAnswered = true;
      } else {
        // Auto-select first option if no answer selected
        this.selectAnswer(0);
      }
    }
  }

  nextQuestion(): void {
    if (this.isLastQuestion()) {
      this.completeTest();
    } else {
      this.currentQuestionIndex++;
      this.loadCurrentQuestion();
    }
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.loadCurrentQuestion();
    }
  }

  goToQuestion(index: number): void {
    this.currentQuestionIndex = index;
    this.loadCurrentQuestion();
  }

  loadCurrentQuestion(): void {
    this.currentQuestion = this.questions[this.currentQuestionIndex];
    this.selectedAnswer = this.answers.get(this.currentQuestionIndex) ?? null;
    this.isAnswered = this.selectedAnswer !== null;
    this.startTimer();
  }

  isLastQuestion(): boolean {
    return this.currentQuestionIndex === this.questions.length - 1;
  }

  canProceed(): boolean {
    return this.isAnswered || this.selectedAnswer !== null;
  }

  isQuestionAnswered(index: number): boolean {
    return this.answers.has(index);
  }

  completeTest(): void {
    console.log('Завершение теста, sessionId:', this.sessionId);
    
    if (!this.sessionId) {
      console.error('SessionId не найден');
      this.testState = 'error';
      return;
    }

    this.iqTestService.completeTest({ sessionId: this.sessionId }).pipe(
      catchError(error => {
        console.error('Ошибка завершения теста:', error);
        this.testState = 'error';
        return of(null);
      })
    ).subscribe({
      next: (session) => {
        if (session) {
          console.log('Тест завершен успешно:', session);
          this.router.navigate(['/results'], { state: { session } });
        } else {
          console.error('Не удалось получить результаты теста');
          this.testState = 'error';
        }
      }
    });
  }



  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  getOptionLetter(index: number): string {
    return String.fromCharCode(65 + index); // A, B, C, D...
  }

  getImageUrl(imagePath: string): string {
    return this.iqTestService.getImageUrl(imagePath);
  }
}