import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  Mascota,
  MascotaCreateRequest,
  MascotaUpdateRequest,
} from '../interface/Mascota/Mascota';
import { environment } from '../../environments/environment';
import { apiResponse } from '../interface/ApiResponse/api-response';

@Injectable({
  providedIn: 'root',
})
export class MascotaService {
  private apiUrl = environment.gatewayUrl + '/mascota/mascotas';
  constructor(private httpClient: HttpClient) {}

  obtenerListaMascotas(): Observable<Mascota[]> {
    return this.httpClient
      .get<apiResponse>(`${this.apiUrl}`)
      .pipe(map((res) => (res?.data as Mascota[]) ?? []));
  }

  // buscar mascota por usuario ID
  obtenerListaMascotasPorUsuarioID(idUsuario: number): Observable<Mascota[]> {
    return this.httpClient
      .get<apiResponse>(`${this.apiUrl}/usuario/${idUsuario}`)
      .pipe(map((res) => (res?.data as Mascota[]) ?? []));
  }

  // buscar mascota por su ID
  obtenereMascotaPorId(id: number): Observable<Mascota> {
    return this.httpClient
      .get<apiResponse>(`${this.apiUrl}/${id}`)
      .pipe(map((res) => (res?.data as Mascota) ?? null));
  }

  // agregar una nueva mascota
  agregarMascota(mascota: MascotaCreateRequest): Observable<Mascota> {
    return this.httpClient
      .post<apiResponse>(`${this.apiUrl}`, mascota)
      .pipe(map((res) => res?.data as Mascota));
  }

  // editar una masota existente
  editarMascota(
    id: number,
    mascota: MascotaUpdateRequest
  ): Observable<Mascota> {
    return this.httpClient
      .put<apiResponse>(`${this.apiUrl}/${id}`, mascota)
      .pipe(map((res) => res?.data as Mascota));
  }

  // eliminar una mascota
  eliminarMascota(id: number): Observable<void> {
    return this.httpClient.delete<apiResponse>(`${this.apiUrl}/${id}`).pipe(
      map(() => {}) // devuelve void
    );
  }
}
