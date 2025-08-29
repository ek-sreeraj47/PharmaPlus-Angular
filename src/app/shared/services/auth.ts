import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

type LoginBody = { email?: string; username?: string; password: string };
type RegisterBody = { name: string; email: string; username?: string; password: string };
type AuthResponse = { token: string; user: any };

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Use relative base so the interceptor adds API_BASE_URL for you
  private readonly base = '/api/auth';

  constructor(private http: HttpClient) {}

  /** prefer /register to avoid browser blockers on /signup */
  register(body: RegisterBody) {
    return this.http.post<AuthResponse>(`${this.base}/register`, body).pipe(
      tap(res => this.storeToken(res?.token))
    );
  }

  /** still works with either email or username + password */
  login(body: LoginBody) {
    return this.http.post<AuthResponse>(`${this.base}/login`, body).pipe(
      tap(res => this.storeToken(res?.token))
    );
  }

  logout() {
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    // read fresh each time (don’t rely on a cached property)
    return !!localStorage.getItem('token');
  }

  private storeToken(token?: string) {
    if (token) localStorage.setItem('token', token);
  }
}
