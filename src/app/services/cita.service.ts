import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DetalleDto } from '../interface/ServicioCita/DetalleDto';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CitaService {

  private apiUrl = environment.gatewayUrl+'/serviciocita'; 

  constructor(private http: HttpClient) { }

  nuevaCita(token: string | null, idUsuario: number, idServicio: number, 
    idMascota: number, fechaCita: string):Observable<DetalleDto> {
    
    const headers = new HttpHeaders({
      'Authorization': 'Bearer '+token
    });

    return this.http.get<DetalleDto>(this.apiUrl+'/cita/nuevo', { headers, params:{idUsuario,idServicio,idMascota,fechaCita} });
  }
}
