import {Injectable} from '@angular/core';
import {Producto} from '../../interface/producto/Producto';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {FormGroup} from '@angular/forms';
import {environment} from '../../../environments/environment';
import {apiResponse} from '../../interface/ApiResponse/api-response';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private API = environment.gatewayUrl + '/producto/producto';

  constructor(private httpClient: HttpClient) {
  }

  public obtenerProductos(): Observable<Array<Producto>> {
    return this.httpClient
      .get<apiResponse>(this.API + '/listar')
      .pipe(map((res) => (res?.data as Array<Producto>) ?? []));
  }

  public obtenerProductosJSON(): Observable<any> {
    return this.httpClient.get(this.API + '/listarJSON')
  }

  public obtenerProductosPorNombre(nombreProducto: string): Observable<any> {
    return this.httpClient
      .get<apiResponse>(this.API + '/buscar', {params: {nombre: nombreProducto}})
      .pipe(map((res) => (res?.data as Array<Producto>) ?? []));
  }

  public obtenerProductosPorVeterinario(id: number | null | string): Observable<any> {
    // @ts-ignore
    return this.httpClient.get<apiResponse>(this.API + '/buscar', {params: {veterinario: id.toString()}})
      .pipe(map((res) => (res?.data as Array<Producto>) ?? []));
  }

  public obtenerImagenProducto(id: number): Observable<any> {
    return this.httpClient.get(this.API + '/obtenerImagen/' + id, {responseType: 'blob'});
  }

  public obtenerProductoPorID(id: number): Observable<any> {
    return this.httpClient
      .get<apiResponse>(this.API + '/buscar', {params: {id: id.toString()}})
      .pipe(map((res) => (res?.data as Producto) ?? []));
  }

  public guardarProducto(producto: FormGroup, file: File): Observable<any> {
    const formData = new FormData();
    const productoEntity = {
      nombre: producto.value.nombre,
      precio: producto.value.precio,
      stock: producto.value.stock,
      descripcion: producto.value.descripcion,
      idUsuario: producto.value.idUsuario
    }
    formData.append('productoRequestDTO', new Blob([JSON.stringify(productoEntity)], {type: 'application/json'}));
    if (file) {
      formData.append('imagen', file);
    }
    return this.httpClient.post(this.API + '/guardar', formData);
  }

  public actualizarProducto(producto: FormGroup, file: File): Observable<any> {
    const formData = new FormData();
    const productoEntity = {
      idProducto: producto.value.idProducto,
      nombre: producto.value.nombre,
      precio: producto.value.precio,
      stock: producto.value.stock,
      descripcion: producto.value.descripcion,
      idUsuario: producto.value.idUsuario
    }
    formData.append('producto', new Blob([JSON.stringify(productoEntity)], {type: 'application/json'}));
    if (file && file.name !== '') {
      formData.append('imagen', file);
    }
    return this.httpClient.put(this.API + '/actualizar', formData, {
      params: {id: productoEntity.idProducto}
    });
  }

  public eliminarProductoPorID(id: number): Observable<any> {
    return this.httpClient.delete(this.API + '/eliminar', {
      params: {id: id.toString()},
      responseType: 'text',
    })
  }

}
