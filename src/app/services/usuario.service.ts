import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {map, Observable} from 'rxjs';
import { Usuario } from '../interface/Usuario/Usuario';
import { environment } from '../../environments/environment';
import {apiResponse} from '../interface/ApiResponse/api-response';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private baseUrl = environment.gatewayUrl+'/usuario/usuario'

  constructor(private http: HttpClient) { }

    // Listar todos los usuarios
  listarUsuarios(): Observable<Usuario[]> {
    return this.http
      .get<apiResponse>(this.baseUrl)
      .pipe(map((res) => (res?.data as Array<Usuario>) ?? []));

  }

  // Buscar usuario por ID
  buscarPorId(id: number): Observable<Usuario> {
    return this.http
      .get<apiResponse>(this.baseUrl+"/"+id)
      .pipe(map((res) => (res?.data as Usuario) ?? []));;
  }

  // Crear usuario
  crearUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http
      .post<apiResponse>(this.baseUrl, usuario)
      .pipe(map((res) => (res?.data as Usuario) ?? []));;
  }

  // Actualizar usuario
  actualizarUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http
      .put<apiResponse>(this.baseUrl, usuario)
      .pipe(map((res) => (res?.data as Usuario) ?? []));
  }

  // Eliminar usuario
  eliminarUsuario(id: number): Observable<string> {
    return this.http
      .delete<apiResponse>(this.baseUrl+"/"+id)
      .pipe(map((res) => (res?.data as string) ?? []))
  }

  // Buscar usuarios por rol
  // buscarPorRol(idRol: number): Observable<Usuario[]> {
  //   return this.http.get<Usuario[]>(this.baseUrl+'/rol?idRol='+idRol);
  // }

  // Buscar usuarios por rol (1=ADMIN, 2=VETERINARIO, 3=CLIENTE)
  buscarPorRol(idRol: number): Observable<Usuario[]> {
    return this.http
      .get<apiResponse>(`${this.baseUrl}/rol/${idRol}`) 
      .pipe(map(res => (res?.data as Usuario[]) ?? []));
  }

  obtenerClientes(): Observable<Usuario[]> {
    return this.buscarPorRol(3); // 3 = CLIENTE
  }
}
