import {Injectable} from '@angular/core';
import {Producto} from '../../interface/producto/Producto';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

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

}
