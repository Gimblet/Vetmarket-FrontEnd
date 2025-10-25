import {Component, inject, OnInit, signal} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {catchError} from 'rxjs';
import {MatButton} from '@angular/material/button';
import {DomSanitizer} from '@angular/platform-browser';
import {NgForOf, SlicePipe} from '@angular/common';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {Router, RouterLink} from "@angular/router";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {AuthService} from '../../../services/auth.service';
import {ProductosService} from '../../../services/Producto/productos.service';
import {Producto} from '../../../interface/producto/Producto';
import {ToastrService} from 'ngx-toastr';
@Component({
  selector: 'app-productos',
  imports: [
    MatCardModule,
    MatButton,
    RouterLink,
    MatPaginator,
    SlicePipe,
    NgForOf,
    MatProgressSpinner,
  ],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.scss'
})
export class ProductosComponent implements OnInit {
  productoService = inject(ProductosService)
  authService = inject(AuthService)
  listaProductos = signal<Array<Producto>>([])

  public userId: string | null | number = -1;
  rol: string | null = null;

  // Pagination
  public pageSize = 12;
  public lowIndex = 0;
  public highIndex = 12;

  constructor(
    public sanitizer: DomSanitizer,
    private router: Router,
    private toastr: ToastrService,
  ) {
  }

  ngOnInit(): void {
    this.authService.rol$.subscribe((rol) => {
      this.rol = rol;
    });

    if (!this.authService.isAutheticated()) {
      this.router.navigate(['/login']);
    } else if (this.rol !== 'VETERINARIO' || this.rol == null) {
      this.router.navigate(['/']);
    }

    this.userId = this.authService.getUserId()

    if (this.userId != null && this.userId !== "") {
      this.obtenerProductos();
    } else {
      this.router.navigate(['/login']);
    }
  }

  obtenerProductos() {
    this.productoService.obtenerProductosPorVeterinario(this.userId)
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

  eliminarProducto(id: number) {
    this.productoService.eliminarProductoPorID(id)
      .pipe(
        catchError((err) => {
          console.log(err);
          throw err;
        })
      ).subscribe({
      next: () => {
        this.toastr.success('Producto Eliminado con exito', 'ESTADO');
        this.obtenerProductos();
      }
    });
  }

  public getPaginatorData(event: PageEvent): PageEvent {
    this.lowIndex = event.pageIndex * this.pageSize;
    this.highIndex = this.lowIndex + event.pageSize;
    return event;
  }
}
