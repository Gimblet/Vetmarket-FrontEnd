import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from '../interface/auth/login-request.interface';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private apiUrl = 'http://localhost:8080/autenticacion/auth'

  private rolSubject = new BehaviorSubject<string | null>(localStorage.getItem('rol'));
  rol$ = this.rolSubject.asObservable();

  constructor(private http: HttpClient) { }

  login(credentials: LoginRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/iniciarSesion`, credentials)
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('usuarioId');
    localStorage.removeItem('usuarioNombre');
    this.rolSubject.next(null);
  }

  setRol(rol: string) {
    localStorage.setItem('rol', rol);
    this.rolSubject.next(rol);
  }

  isAutheticated(): boolean {
    return !!localStorage.getItem('token');
  }
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserId(): string | null {
    return localStorage.getItem('usuarioId');
  }
}
