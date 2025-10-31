import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {map, Observable} from 'rxjs';
import { CarritoCompra } from '../interface/CarritoCompras/CarritoCompra';
import { DetalleDto } from '../interface/ServicioCita/DetalleDto';
import { environment } from '../../environments/environment';
import {apiResponse} from '../interface/ApiResponse/api-response';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private apiUrl = environment.gatewayUrl+'/carritocompra/carrito';
  constructor(private http: HttpClient) { }

  private getAuthHeaders(token: string): HttpHeaders {
    return new HttpHeaders({ 'Authorization': 'Bearer ' + token });
  }

  // Obtener carrito del usuario
  obtenerCarrito(token: string, idUsuario: number): Observable<DetalleDto[]> {
    const headers = this.getAuthHeaders(token);
    return this.http
      .get<DetalleDto[]>(this.apiUrl + '/usuario', { headers, params: { idUsuario } })
  }

  // Agregar producto al carrito
  agregarProducto(token: string, idUsuario: number, idProducto: number, cantidad: number): Observable<DetalleDto> {
    const headers = this.getAuthHeaders(token);
    return this.http
      .post<apiResponse>(this.apiUrl + '/agregar', null, { headers, params: { idUsuario, idProducto, cantidad } })
      .pipe(map((res) => (res?.data as DetalleDto) ?? []));
  }

  // Eliminar producto del carrito
  eliminarProducto(token: string, idUsuario: number, idProducto: number): Observable<string> {
    const headers = this.getAuthHeaders(token);
    return this.http
      .delete(this.apiUrl + '/eliminar', { headers, params: { idUsuario, idProducto }, responseType: 'text' });
  }
}
