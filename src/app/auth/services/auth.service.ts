import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { LoginResponse } from "../types/login-response.type";

const login = 'jp';
const senha = '1234';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  http = inject(HttpClient);

  constructor( http: HttpClient) {
    this.http = http;
    console.log('AuthService initialized');
  }

  login(email: string, password: string): Observable<any> {
    console.log('Login method called, email:', email, 'password:', password);

    return this.http.post<LoginResponse>('/api/login', { email, password }).pipe(
        tap(response => {
            sessionStorage.setItem('authToken', response.token);
            sessionStorage.setItem('username', response.username);
        })
    );
  }
}