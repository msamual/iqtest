import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="bg-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <a routerLink="/" class="flex-shrink-0 flex items-center">
              <span class="text-xl font-bold text-gray-800">IQ Test</span>
            </a>
            
            <div class="hidden md:ml-6 md:flex md:space-x-8">
              <a routerLink="/" 
                 routerLinkActive="border-indigo-500 text-gray-900" 
                 [routerLinkActiveOptions]="{exact: true}"
                 class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Главная
              </a>
              
              <a *ngIf="currentUser" 
                 routerLink="/test" 
                 routerLinkActive="border-indigo-500 text-gray-900"
                 class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Пройти тест
              </a>
              
              <a *ngIf="currentUser" 
                 routerLink="/results" 
                 routerLinkActive="border-indigo-500 text-gray-900"
                 class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Мои результаты
              </a>
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
            <ng-container *ngIf="currentUser; else authLinks">
              <!-- Authenticated user menu -->
              <div class="relative">
                <button
                  type="button"
                  class="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  (click)="toggleUserMenu()"
                >
                  <span class="sr-only">Open user menu</span>
                  <div class="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center">
                    <span class="text-sm font-medium text-white">
                      {{ getUserInitials() }}
                    </span>
                  </div>
                </button>
                
                <!-- User dropdown menu -->
                <div *ngIf="showUserMenu" 
                     class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div class="py-1">
                    <div class="px-4 py-2 text-sm text-gray-700 border-b">
                      <div class="font-medium">{{ currentUser.firstName || currentUser.username }}</div>
                      <div class="text-gray-500">{{ currentUser.email }}</div>
                    </div>
                    
                    <a routerLink="/profile" 
                       class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                       (click)="closeUserMenu()">
                      Профиль
                    </a>
                    
                    <a routerLink="/results" 
                       class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                       (click)="closeUserMenu()">
                      Мои результаты
                    </a>
                    
                    <button
                      type="button"
                      class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      (click)="logout()">
                      Выйти
                    </button>
                  </div>
                </div>
              </div>
            </ng-container>
            
            <ng-template #authLinks>
              <!-- Guest user links -->
              <a routerLink="/login" 
                 class="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                Войти
              </a>
              <a routerLink="/register" 
                 class="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md text-sm font-medium">
                Регистрация
              </a>
            </ng-template>
          </div>
        </div>
      </div>
      
      <!-- Mobile menu -->
      <div class="md:hidden">
        <div class="pt-2 pb-3 space-y-1">
          <a routerLink="/" 
             routerLinkActive="bg-indigo-50 border-indigo-500 text-indigo-700" 
             [routerLinkActiveOptions]="{exact: true}"
             class="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
            Главная
          </a>
          
          <ng-container *ngIf="currentUser">
            <a routerLink="/test" 
               routerLinkActive="bg-indigo-50 border-indigo-500 text-indigo-700"
               class="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
              Пройти тест
            </a>
            
            <a routerLink="/results" 
               routerLinkActive="bg-indigo-50 border-indigo-500 text-indigo-700"
               class="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
              Мои результаты
            </a>
          </ng-container>
        </div>
        
        <div *ngIf="!currentUser" class="pt-4 pb-3 border-t border-gray-200">
          <div class="space-y-1">
            <a routerLink="/login" 
               class="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50">
              Войти
            </a>
            <a routerLink="/register" 
               class="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50">
              Регистрация
            </a>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: []
})
export class NavbarComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  showUserMenu = false;
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getUserInitials(): string {
    if (!this.currentUser) return '';
    
    const firstName = this.currentUser.firstName || '';
    const lastName = this.currentUser.lastName || '';
    
    if (firstName && lastName) {
      return (firstName[0] + lastName[0]).toUpperCase();
    } else if (firstName) {
      return firstName[0].toUpperCase();
    } else {
      return this.currentUser.username[0].toUpperCase();
    }
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  closeUserMenu(): void {
    this.showUserMenu = false;
  }

  logout(): void {
    this.authService.logout();
    this.showUserMenu = false;
    this.router.navigate(['/']);
  }
}
