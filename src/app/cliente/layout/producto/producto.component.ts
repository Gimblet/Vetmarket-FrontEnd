import {Component, inject, OnInit, signal} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {ProductosService} from '../../../services/Producto/productos.service';
import {Producto} from '../../../interface/producto/Producto';
import {catchError} from 'rxjs';
import {MatButton} from '@angular/material/button';
import {DomSanitizer} from '@angular/platform-browser';
import {NgForOf, SlicePipe} from '@angular/common';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {RouterLink} from "@angular/router";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import { CarritoService } from '../../../services/carrito.service';
import { AuthService } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-producto',
  imports: [
    MatCardModule,
    MatButton,
    RouterLink,
    MatPaginator,
    SlicePipe,
    NgForOf,
    MatProgressSpinner,
    FormsModule,
  ],
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.scss'
})

export class ProductoComponent implements OnInit {
  productoService = inject(ProductosService)
  listaProductos = signal<Array<Producto>>([])

  // Pagination
  public pageSize = 8;
  public lowIndex = 0;
  public highIndex = 8;

  rol: string | null = null;

  constructor(
    public sanitizer: DomSanitizer,
    //Add al carrito
    private carrito:CarritoService,
    private auth:AuthService
  ) {
  }

  ngOnInit(): void {
    this.auth.rol$.subscribe((r) => this.rol = r);
    this.obtenerProductos();
  }

  obtenerProductos() {
    this.productoService.obtenerProductos()
      .pipe(
        catchError((err) => {
          console.log(err);
          throw err;
        })
      )
      .subscribe((productos: Array<Producto>) => {
        productos.forEach(producto => {
          this.obtenerImagen(producto);
        })
        this.listaProductos.set(productos);
      })
  }

  obtenerImagen(producto: Producto) {
    this.productoService.obtenerImagenProducto(producto.idProducto)
      .pipe(
        catchError((err) => {
          console.log(err);
          throw err;
        })
      )
      .subscribe((blob: Blob) => {
        const url = URL.createObjectURL(blob);
        producto.imagen = this.sanitizer.bypassSecurityTrustUrl(url);
      });
  }

  buscarProducto(nombre: string) {
    this.productoService.obtenerProductosPorNombre(nombre)
      .pipe(
        catchError((err) => {
          console.log(err);
          throw err;
        })
      )
      .subscribe((productos: Array<Producto>) => {
        productos.forEach(producto => {
          this.obtenerImagen(producto);
        })
        this.listaProductos.set(productos);
      })
  }

  public getPaginatorData(event: PageEvent): PageEvent {
    this.lowIndex = event.pageIndex * this.pageSize;
    this.highIndex = this.lowIndex + event.pageSize;
    return event;
  }

  //metodo para agregar al carrito
  agregarAlCarrito(producto: Producto, cantidad:number) {
    const token = this.auth.getToken();
    const idUsuario = Number(this.auth.getUserId());

    if (!token || !idUsuario) {
      alert('Por favor inicia sesión para agregar productos al carrito.');
      return;
    }

    this.carrito.agregarProducto(token, idUsuario, producto.idProducto, cantidad).subscribe({
      next: () => alert(`"${producto.nombre}" fue añadido al carrito 🛒`),
      error: (err) => console.error('Error al agregar al carrito:', err)
    });
  }

  reload() {
    window.location.reload();
  }
}
