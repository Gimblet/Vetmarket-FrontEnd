import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {map, Observable} from 'rxjs';
import {ServicioRequestDTO, ServicioResponseDTO} from '../interface/Servicio/Servicio';
import {environment} from '../../environments/environment';
import {apiResponse} from '../interface/ApiResponse/api-response';

@Injectable({
  providedIn: 'root'
})
export class ServiciosService {
  private apiUrl = environment.gatewayUrl + '/servicio/servicios'

  constructor(private httpClient: HttpClient) {
  }

  obtenerListaServicios(): Observable<ServicioResponseDTO[]> {
    return this.httpClient
      .get<apiResponse>(`${this.apiUrl}`)
      .pipe(map((res) => (res?.data as ServicioResponseDTO[]) ?? []));

  }

  obtenerServicioPorId(id: number): Observable<ServicioResponseDTO> {
    return this.httpClient
      .get<apiResponse>(`${this.apiUrl}/${id}`)
      .pipe(map((res) => (res?.data as ServicioResponseDTO) ?? []));

  }

  /*agregarServicio(servicio: ServicioRequestDTO): Observable<ServicioResponseDTO> {
    return this.httpClient.post<ServicioResponseDTO>(`${this.apiUrl}`, servicio)
  }

  editarServicio(id: number, servicio: ServicioRequestDTO): Observable<ServicioResponseDTO> {
    return this.httpClient.put<ServicioResponseDTO>(`${this.apiUrl}/${id}`, servicio)
  }  */

  eliminarServicio(id: number): Observable<string> {
    return this.httpClient
      .delete<apiResponse>(`${this.apiUrl}/${id}`)
      .pipe(map((res) => (res?.data as string) ?? []));
  }

  obtenerImagen(id: number): Observable<Blob> {
    return this.httpClient.get(`${this.apiUrl}/imagen/${id}`, {responseType: 'blob'});
  }

// NUEVO: para crear con imagen
  agregarServicioConImagen(formData: FormData): Observable<ServicioResponseDTO> {
    return this.httpClient
      .post<apiResponse>(this.apiUrl, formData)
      .pipe(map((res) => (res?.data as ServicioResponseDTO) ?? []));;
  }

  // NUEVO: para editar con imagen
  editarServicioConImagen(id: number, formData: FormData): Observable<ServicioResponseDTO> {
    return this.httpClient
      .put<apiResponse>(`${this.apiUrl}/${id}`, formData)
      .pipe(map((res) => (res?.data as ServicioResponseDTO) ?? []));;
  }

  obtenerListaServiciosPorVeterinario(usuarioId: number): Observable<ServicioResponseDTO[]> {
    return this.httpClient
      .get<apiResponse>(`${this.apiUrl}/usuario/${usuarioId}`)
      .pipe(map((res) => (res?.data as ServicioResponseDTO[]) ?? []));

  }

}
