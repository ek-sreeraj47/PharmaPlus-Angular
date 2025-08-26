import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = 'http://localhost:5000/api/auth';
  token: string | null = localStorage.getItem('token');

  constructor(private http: HttpClient) {}

  signup(data: any) {
    return this.http.post(`${this.api}/signup`, data);
  }

  login(data: any) {
    return this.http.post<{ token: string; user: any }>(`${this.api}/login`, data).pipe(
      tap(res => {
        this.token = res.token;
        localStorage.setItem('token', res.token);
      })
    );
  }

  logout() {
    this.token = null;
    localStorage.removeItem('token');
  }

  isLoggedIn() {
    return !!this.token;
  }
}
