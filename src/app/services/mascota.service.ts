import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Mascota, MascotaCreateRequest, MascotaUpdateRequest } from '../interface/Mascota/Mascota';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class MascotaService {

  private apiUrl = environment.gatewayUrl+'/mascota/mascotas'
  constructor(private httpClient: HttpClient) { }

  obtenerListaMascotas(): Observable<Mascota[]> {
    return this.httpClient.get<Mascota[]>(`${this.apiUrl}`)
  }

  // buscar mascota por usuario ID
  obtenerListaMascotasPorUsuarioID(idUsuario: number): Observable<Mascota[]> {
    return this.httpClient.get<Mascota[]>(`${this.apiUrl}/usuario/${idUsuario}`);
  }

  // buscar mascota por su ID
  obtenereMascotaPorId(id: number): Observable<Mascota> {
    return this.httpClient.get<Mascota>(`${this.apiUrl}/${id}`)
  }

  // agregar una nueva mascota
  agregarMascota(mascota: MascotaCreateRequest): Observable<Mascota> {
    return this.httpClient.post<Mascota>(`${this.apiUrl}`, mascota)
  }

  // editar una masota existente
  editarMascota(id: number, mascota: MascotaUpdateRequest): Observable<Mascota> {
    return this.httpClient.put<Mascota>(`${this.apiUrl}/${id}`, mascota)
  }

  // eliminar una mascota
  eliminarMascota(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`)
  }
}
