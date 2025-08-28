import {
  ApplicationConfig,
  InjectionToken,
  inject,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, HttpInterceptorFn } from '@angular/common/http';
import { routes } from './app.routes';

// Base URL token for your backend
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');

// Interceptor to prefix relative /api requests with the base URL
export const apiBaseInterceptor: HttpInterceptorFn = (req, next) => {
  const base = inject(API_BASE_URL);
  if (req.url.startsWith('/api')) {
    const url = base.replace(/\/$/, '') + req.url; // ensure no double slashes
    return next(req.clone({ url }));
  }
  return next(req);
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([apiBaseInterceptor])),

    // 👉 Set your deployed backend URL here
    { provide: API_BASE_URL, useValue: 'https://pharmaplus-angular-backend.onrender.com' }
  ]
};
