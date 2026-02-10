import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/calendar',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'calendar',
    loadComponent: () =>
      import('./features/calendar/calendar.component').then(m => m.CalendarComponent),
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./features/admin/admin.component').then(m => m.AdminComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'session/create',
    loadComponent: () =>
      import('./features/sessions/session-form/session-form.component').then(m => m.SessionFormComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'session/edit/:id',
    loadComponent: () =>
      import('./features/sessions/session-form/session-form.component').then(m => m.SessionFormComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: '**',
    redirectTo: '/calendar'
  }
];
