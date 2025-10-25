import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../interface/Usuario/Usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private baseUrl = 'http://localhost:8080/usuario/usuario'

  constructor(private http: HttpClient) { }

    // Listar todos los usuarios
  listarUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.baseUrl);
  }

  // Buscar usuario por ID
  buscarPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(this.baseUrl+"/"+id);
  }

  // Crear usuario
  crearUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.baseUrl, usuario);
  }

  // Actualizar usuario
  actualizarUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(this.baseUrl, usuario);
  }

  // Eliminar usuario
  eliminarUsuario(id: number): Observable<string> {
    return this.http.delete(this.baseUrl+"/"+id, { responseType: 'text' });
  }

  // Buscar usuarios por rol
  buscarPorRol(idRol: number): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.baseUrl+'/rol?idRol='+idRol);
  }
}
