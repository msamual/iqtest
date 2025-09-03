import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface IqQuestion {
  id: number;
  questionText: string;
  questionImage: string;
  options: string[];
  explanation: string;
  difficulty: number;
  timeLimit: number;
}

export interface QuestionAnswer {
  questionId: number;
  selectedAnswerIndex: number;
  isCorrect: boolean;
  timeSpent: number;
  answeredAt: string;
}

export interface TestSession {
  id: string;
  startTime: string;
  endTime?: string;
  answers: QuestionAnswer[];
  totalScore: number;
  maxPossibleScore: number;
  iqScore: number;
  isCompleted: boolean;
}

export interface SubmitAnswerRequest {
  sessionId: string;
  questionId: number;
  answerIndex: number;
  timeSpent: number;
}

export interface CompleteTestRequest {
  sessionId: string;
}

@Injectable({
  providedIn: 'root'
})
export class IqTestService {
  private apiUrl = '/api/IqTest';
  private baseUrl = '/api';

  constructor(private http: HttpClient) { }

  startTest(): Observable<TestSession> {
    return this.http.post<TestSession>(`${this.apiUrl}/start`, {}).pipe(
      catchError(this.handleError)
    );
  }

  getQuestions(count: number = 20): Observable<IqQuestion[]> {
    return this.http.get<IqQuestion[]>(`${this.apiUrl}/questions?count=${count}`).pipe(
      catchError(this.handleError)
    );
  }

  getQuestion(id: number): Observable<IqQuestion> {
    return this.http.get<IqQuestion>(`${this.apiUrl}/questions/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  submitAnswer(request: SubmitAnswerRequest): Observable<TestSession> {
    return this.http.post<TestSession>(`${this.apiUrl}/submit-answer`, request).pipe(
      catchError(this.handleError)
    );
  }

  completeTest(request: CompleteTestRequest): Observable<TestSession> {
    return this.http.post<TestSession>(`${this.apiUrl}/complete`, request).pipe(
      catchError(this.handleError)
    );
  }

  getSession(sessionId: string): Observable<TestSession> {
    return this.http.get<TestSession>(`${this.apiUrl}/session/${sessionId}`).pipe(
      catchError(this.handleError)
    );
  }

  getMyTests(): Observable<TestSession[]> {
    return this.http.get<TestSession[]>(`${this.apiUrl}/my-tests`).pipe(
      catchError(this.handleError)
    );
  }

  getImageUrl(imagePath: string): string {
    if (!imagePath) return '';
    return `${this.baseUrl}${imagePath}`;
  }

  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    
    let errorMessage = 'Произошла ошибка при обращении к серверу';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Ошибка клиента: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Ошибка сервера: ${error.status} - ${error.message}`;
    }
    
    return throwError(() => new Error(errorMessage));
  }
}
