import {Injectable} from '@angular/core';
import {Producto} from '../../interface/producto/Producto';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {FormGroup} from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class ProductosService {
    private API = 'http://localhost:8080/producto/producto';

    constructor(private httpClient: HttpClient) {
    }

    public obtenerProductos(): Observable<any> {
        return this.httpClient.get<Array<Producto>>(this.API + '/listar');
    }

    public obtenerImagenProducto(id: number): Observable<any> {
        return this.httpClient.get(this.API + '/obtenerImagen/' + id, {responseType: 'blob'});
    }

    public obtenerProductoPorID(id: number): Observable<any> {
        return this.httpClient.get(this.API + '/buscar', {params: {id: id.toString()}});
    }

    public guardarProducto(producto: FormGroup, file: File): Observable<any> {
      const formData = new FormData();
      const productoEntity = {
        nombre: producto.value.nombre,
        precio: producto.value.precio,
        stock: producto.value.stock,
        descripcion: producto.value.descripcion,
        idUsuario: 1
      }
      formData.append('productoRequestDTO', new Blob([JSON.stringify(productoEntity)], {type: 'application/json'}));
      if (file) {
        formData.append('imagen', file);
      }
      return this.httpClient.post(this.API + '/guardar', formData);
    }

}
