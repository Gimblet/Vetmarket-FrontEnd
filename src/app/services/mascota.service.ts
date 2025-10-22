import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Mascota, MascotaRequest } from '../interface/Mascota/Mascota';


@Injectable({
  providedIn: 'root'
})
export class MascotaService {

  private apiUrl = 'http://localhost:8080/mascota/mascotas'
  constructor(private httpClient: HttpClient) { }

  obtenerListaMascotas(): Observable<Mascota[]> {
    return this.httpClient.get<Mascota[]>(`${this.apiUrl}`)
  }

  // buscar mascota por usuario ID
  obtenerListaMascotasPorUsuarioID(idUsuario: number): Observable<Mascota[]> {
    return this.httpClient.get<Mascota[]>(`${this.apiUrl}/${idUsuario}`)
  }

  // buscar mascota por su ID
  obtenereMascotaPorId(id: number): Observable<Mascota> {
    return this.httpClient.get<Mascota>(`${this.apiUrl}/${id}`)
  }

  // agregar una nueva mascota
  agregarMascota(mascota: MascotaRequest): Observable<Mascota> {
    return this.httpClient.post<Mascota>(`${this.apiUrl}`, mascota)
  }

  // editar una masota existente
  editarMascota(id: number, mascota: MascotaRequest): Observable<Mascota> {
    return this.httpClient.put<Mascota>(`${this.apiUrl}/${id}`, mascota)
  }

  // eliminar una mascota
  eliminarMascota(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`)
  }
}
