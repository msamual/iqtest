import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="home-container">
      <div class="hero-section">
        <h1 class="title">IQ Тест</h1>
        <p class="subtitle">Проверьте свой интеллект с помощью нашего научно обоснованного теста</p>
        
        <div class="features">
          <div class="feature">
            <div class="feature-icon">🧠</div>
            <h3>20 вопросов</h3>
            <p>Разнообразные задания на логику, математику и пространственное мышление</p>
          </div>
          
          <div class="feature">
            <div class="feature-icon">⏱️</div>
            <h3>Временные ограничения</h3>
            <p>Каждый вопрос имеет оптимальное время для решения</p>
          </div>
          
          <div class="feature">
            <div class="feature-icon">📊</div>
            <h3>Детальные результаты</h3>
            <p>Получите свой IQ-показатель и анализ ответов</p>
          </div>
        </div>
        
        <button class="start-button" (click)="startTest()">
          Начать тест
        </button>
        
        <div class="info">
          <p>Тест займет примерно 20-30 минут</p>
          <p>Убедитесь, что у вас есть достаточно времени и спокойная обстановка</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    
    .hero-section {
      text-align: center;
      max-width: 800px;
      background: rgba(255, 255, 255, 0.95);
      padding: 60px 40px;
      border-radius: 20px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(10px);
    }
    
    .title {
      font-size: 3.5rem;
      font-weight: 700;
      color: #2d3748;
      margin-bottom: 20px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .subtitle {
      font-size: 1.3rem;
      color: #4a5568;
      margin-bottom: 50px;
      line-height: 1.6;
    }
    
    .features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 30px;
      margin-bottom: 50px;
    }
    
    .feature {
      padding: 30px 20px;
      background: #f7fafc;
      border-radius: 15px;
      border: 1px solid #e2e8f0;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .feature:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }
    
    .feature-icon {
      font-size: 3rem;
      margin-bottom: 20px;
    }
    
    .feature h3 {
      font-size: 1.2rem;
      color: #2d3748;
      margin-bottom: 15px;
      font-weight: 600;
    }
    
    .feature p {
      color: #718096;
      line-height: 1.5;
    }
    
    .start-button {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      border: none;
      padding: 18px 40px;
      font-size: 1.2rem;
      font-weight: 600;
      border-radius: 50px;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
      margin-bottom: 30px;
    }
    
    .start-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 15px 35px rgba(102, 126, 234, 0.4);
    }
    
    .start-button:active {
      transform: translateY(0);
    }
    
    .info {
      color: #718096;
      font-size: 0.95rem;
      line-height: 1.6;
    }
    
    .info p {
      margin: 8px 0;
    }
    
    @media (max-width: 768px) {
      .hero-section {
        padding: 40px 20px;
      }
      
      .title {
        font-size: 2.5rem;
      }
      
      .subtitle {
        font-size: 1.1rem;
      }
      
      .features {
        grid-template-columns: 1fr;
        gap: 20px;
      }
    }
  `]
})
export class HomeComponent {
  constructor(private router: Router) {}

  startTest(): void {
    this.router.navigate(['/test']);
  }
}
