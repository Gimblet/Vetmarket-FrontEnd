import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from '../interface/auth/login-request.interface';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { apiResponse } from '../interface/ApiResponse/api-response';
import { LoginResponse } from '../interface/auth/login-response.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private apiUrl = environment.gatewayUrl+'/autenticacion/auth'

  private rolSubject = new BehaviorSubject<string | null>(localStorage.getItem('rol'));
  rol$ = this.rolSubject.asObservable();

  constructor(private http: HttpClient) { }

  login(credentials: LoginRequest): Observable<LoginResponse> {
  return this.http.post<apiResponse>(`${this.apiUrl}/iniciarSesion`, credentials).pipe(
    map(res => res?.data as LoginResponse)
  );
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
