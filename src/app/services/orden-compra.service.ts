import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Orden } from '../modelos/OrdenCompra/Orden';
import { DetalleVentaDTO } from '../modelos/OrdenCompra/DetalleVentaDto';
import { DetalleDto } from '../modelos/OrdenCompra/DetalleDto';

@Injectable({
  providedIn: 'root'
})
export class OrdenCompraService {

  private apiUrl = 'http://localhost:8080/OrdenComrpa'; 

  constructor(private http: HttpClient) { }

  private getAuthHeaders(token: string): HttpHeaders {
    return new HttpHeaders({ 'Authorization': 'Bearer' +token });
  }

  //Todas las órdenes para el administrador
  listarTodasOrdenes(token: string): Observable<Orden[]> {
    const headers = this.getAuthHeaders(token);
    return this.http.get<Orden[]>(this.apiUrl+'/ordenCompra/ordenes', { headers });
  }
  
  //Órdenes de un cliente específico
  listarOrdenesPorUsuario(token: string, idUsuario: number): Observable<Orden[]> {
    const headers = this.getAuthHeaders(token);
    const params = new HttpParams().set('idUsuario', idUsuario.toString());
    
    return this.http.get<Orden[]>(this.apiUrl+'/ordenCompra/ordenesClientes', { headers, params });
  }

  //Detalle de una orden
  listarDetalleOrden(token: string, idOrden: number): Observable<any> { 
    const headers = this.getAuthHeaders(token);
    return this.http.get<any>(this.apiUrl+'/ordenCompra/detalleOrden/'+idOrden, { headers });
  }

  //Detalle de Ventas para veterinarios
  listarVentasVeterinarios(token: string, idUsuario: number): Observable<DetalleVentaDTO[]> {
    const headers = this.getAuthHeaders(token);
    const params = new HttpParams().set('idUsuario', idUsuario.toString());
    
    return this.http.get<DetalleVentaDTO[]>(this.apiUrl+'/ordenCompra/listaVentas', { headers, params });
  }
  
  //Procesar la orden de compra
  procesarOrden(token: string, detalles: DetalleDto[]): Observable<string> { 
    const headers = this.getAuthHeaders(token);
    
    return this.http.post(this.apiUrl+'/ordenCompra/procesar', detalles, { 
      headers, 
      responseType: 'text' 
    });
  }
}
