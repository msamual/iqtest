import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { IqTestService, TestSession } from '../../services/iq-test.service';

@Component({
  selector: 'app-my-tests',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-extrabold text-gray-900">Мои результаты</h1>
          <p class="mt-2 text-gray-600">История ваших IQ тестов</p>
        </div>

        <!-- Loading state -->
        <div *ngIf="isLoading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <span class="ml-3 text-gray-600">Загружаем ваши результаты...</span>
        </div>

        <!-- Error state -->
        <div *ngIf="errorMessage && !isLoading" class="text-center py-12">
          <div class="text-red-600 mb-4">
            <svg class="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Ошибка загрузки</h3>
          <p class="text-gray-600 mb-4">{{ errorMessage }}</p>
          <button 
            (click)="loadMyTests()"
            class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
            Попробовать снова
          </button>
        </div>

        <!-- No tests state -->
        <div *ngIf="!isLoading && !errorMessage && tests.length === 0" class="text-center py-12">
          <div class="text-gray-400 mb-4">
            <svg class="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Пока нет результатов</h3>
          <p class="text-gray-600 mb-4">Вы еще не проходили тесты</p>
          <a 
            routerLink="/test"
            class="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 inline-block">
            Пройти первый тест
          </a>
        </div>

        <!-- Tests list -->
        <div *ngIf="!isLoading && !errorMessage && tests.length > 0" class="space-y-6">
          <div 
            *ngFor="let test of tests; let i = index" 
            class="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
            <div class="px-6 py-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <!-- IQ Score Circle -->
                  <div class="flex-shrink-0">
                    <div 
                      class="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold"
                      [ngClass]="getScoreClass(test.iqScore)">
                      <span class="text-lg">{{ test.iqScore?.toFixed(0) || '0' }}</span>
                    </div>
                  </div>
                  
                  <!-- Test Info -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center space-x-2">
                      <h3 class="text-lg font-medium text-gray-900">
                        IQ Тест #{{ i + 1 }}
                      </h3>
                      <span 
                        *ngIf="test.isCompleted" 
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Завершен
                      </span>
                      <span 
                        *ngIf="!test.isCompleted" 
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Не завершен
                      </span>
                    </div>
                    
                    <div class="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                      <span>{{ formatDate(test.startTime) }}</span>
                      <span *ngIf="test.endTime">{{ formatDuration(test) }}</span>
                      <span>{{ test.totalScore || 0 }}/{{ test.maxPossibleScore || 0 }} правильных</span>
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="flex items-center space-x-2">
                  <button 
                    *ngIf="test.isCompleted"
                    (click)="viewResults(test)"
                    class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    <svg class="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Посмотреть
                  </button>
                  
                  <button 
                    *ngIf="!test.isCompleted"
                    (click)="continueTest(test)"
                    class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                    <svg class="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1a3 3 0 015.196 0 3 3 0 010 6H9m6 0a3 3 0 01-3 3H9a3 3 0 01-3-3m0 0V9a3 3 0 013-3h3m-3 12h3m-6 0h3m-3 0v-3m0 3H6m3 0h3" />
                    </svg>
                    Продолжить
                  </button>
                </div>
              </div>

              <!-- Detailed stats for completed tests -->
              <div *ngIf="test.isCompleted && test.answers && test.answers.length > 0" class="mt-4 pt-4 border-t border-gray-200">
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div class="text-2xl font-bold text-gray-900">{{ getPercentage(test) }}%</div>
                    <div class="text-sm text-gray-500">Точность</div>
                  </div>
                  <div>
                    <div class="text-2xl font-bold text-gray-900">{{ getAverageTime(test) }}с</div>
                    <div class="text-sm text-gray-500">Среднее время</div>
                  </div>
                  <div>
                    <div class="text-2xl font-bold text-gray-900">{{ test.answers.length }}</div>
                    <div class="text-sm text-gray-500">Вопросов</div>
                  </div>
                  <div>
                    <div class="text-2xl font-bold text-gray-900">{{ getScoreDescription(test.iqScore) }}</div>
                    <div class="text-sm text-gray-500">Уровень</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div *ngIf="!isLoading && tests.length > 0" class="mt-8 text-center">
          <a 
            routerLink="/test"
            class="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 inline-block">
            Пройти новый тест
          </a>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class MyTestsComponent implements OnInit {
  tests: TestSession[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private iqTestService: IqTestService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.loadMyTests();
  }

  loadMyTests(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Используем новый метод для получения тестов пользователя
    this.iqTestService.getMyTests().subscribe({
      next: (tests) => {
        this.tests = tests;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Не удалось загрузить результаты';
        this.isLoading = false;
      }
    });
  }

  getScoreClass(iqScore: number): string {
    if (iqScore >= 120) return 'bg-green-500';
    if (iqScore >= 110) return 'bg-blue-500';
    if (iqScore >= 90) return 'bg-yellow-500';
    return 'bg-red-500';
  }

  getScoreDescription(iqScore: number): string {
    if (iqScore >= 120) return 'Отличный';
    if (iqScore >= 110) return 'Хороший';
    if (iqScore >= 90) return 'Средний';
    return 'Низкий';
  }

  getPercentage(test: TestSession): number {
    if (!test.maxPossibleScore || test.maxPossibleScore === 0) return 0;
    return Math.round((test.totalScore / test.maxPossibleScore) * 100);
  }

  getAverageTime(test: TestSession): number {
    if (!test.answers || test.answers.length === 0) return 0;
    const totalTime = test.answers.reduce((sum, answer) => sum + answer.timeSpent, 0);
    return Math.round(totalTime / test.answers.length);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatDuration(test: TestSession): string {
    if (!test.startTime || !test.endTime) return '';
    
    const start = new Date(test.startTime);
    const end = new Date(test.endTime);
    const diff = end.getTime() - start.getTime();
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  viewResults(test: TestSession): void {
    // Переходим к детальным результатам теста
    this.router.navigate(['/results'], { state: { session: test } });
  }

  continueTest(test: TestSession): void {
    // Логика продолжения незавершенного теста
    this.router.navigate(['/test'], { state: { sessionId: test.id } });
  }
}
