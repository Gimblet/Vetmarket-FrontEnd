import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DetalleDto } from '../modelos/OrdenCompra/DetalleDto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CitaService {

  private apiUrl = 'http://localhost:8080/ServicioCita'; 

  constructor(private http: HttpClient) { }

  nuevaCita(token: string | null, idUsuario: number, idServicio: number, 
    idMascota: number, fechaCita: string):Observable<DetalleDto> {
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const params = new HttpParams()
      .set('idUsuario', idUsuario.toString())
      .set('idServicio', idServicio.toString())
      .set('idMascota', idMascota.toString())
      .set('fechaCita', fechaCita.toString()); 

    return this.http.get<DetalleDto>(this.apiUrl+'cita/nuevo', { headers, params });
  }
}
