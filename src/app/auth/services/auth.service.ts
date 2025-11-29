import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable, of, throwError, delay, tap, catchError } from "rxjs";
import { LoginResponse } from "../types/login-response.type";

const login = 'Administrador';
const senha = 'admin';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  http = inject(HttpClient);

  constructor( http: HttpClient) {
    this.http = http;
    console.log('AuthService initialized');
  }

  login(email: string, password: string): Observable<LoginResponse> {
    // Primary: validate with backend
    return this.http.post<LoginResponse>('/api/login', { email, password }).pipe(
      tap(res => {
        sessionStorage.setItem('authToken', res.token);
        sessionStorage.setItem('username', res.username ?? email);
      }),
      // Fallback: if backend unavailable, allow fake login for Administrador/admin only
      catchError(err => {
        const ok = email === login && password === senha;
        if (!ok) {
          return throwError(() => err);
        }
        const mock: LoginResponse = {
          token: 'fake-token-' + Math.random().toString(36).slice(2),
          username: email
        } as LoginResponse;
        return of(mock).pipe(
          delay(200),
          tap(res => {
            sessionStorage.setItem('authToken', res.token);
            sessionStorage.setItem('username', res.username ?? email);
          })
        );
      })
    );
  }

  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('authToken');
  }
}