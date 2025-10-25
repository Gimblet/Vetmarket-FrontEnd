import {Component, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Producto} from '../../../../interface/producto/Producto';
import {ProductosService} from '../../../../services/Producto/productos.service';
import {catchError} from 'rxjs';
import {DomSanitizer} from '@angular/platform-browser';
import {MatTooltip} from '@angular/material/tooltip';
import {Location} from '@angular/common';
import {AuthService} from '../../../../services/auth.service';
import {MatButton} from '@angular/material/button';
import { CarritoService } from '../../../../services/carrito.service';

@Component({
  selector: 'app-detalles',
  imports: [
    MatTooltip,
    MatButton,
  ],
  templateUrl: './detalles.component.html',
  styleUrl: './detalles.component.scss'
})
export class DetallesComponent implements OnInit {
  productId = signal(0);
  producto = signal<Producto>({} as Producto)

  private activatedRoute = inject(ActivatedRoute);
  productoService = inject(ProductosService);
  authService = inject(AuthService)

  rol: string | null = null;

  constructor(
    private sanitizer: DomSanitizer,
    private location: Location,
    private carrito:CarritoService,
    private auth:AuthService
  ) {
    this.activatedRoute.params.subscribe((params) => {
      this.productId.set(params['id']);
    });
  }

  ngOnInit(): void {
    this.authService.rol$.subscribe((rol) => {
      this.rol = rol;
    });
    this.obtenerDetalles(this.productId());
  }

  obtenerDetalles(id: number): void {
    this.productoService.obtenerProductoPorID(id)
      .pipe(
        catchError((err) => {
          console.log(err);
          throw err;
        })
      )
      .subscribe((entity: Producto) => {
        this.obtenerImagen(entity);
        this.producto.set(entity);
      })
  }

  obtenerImagen(entity: Producto) {
    this.productoService.obtenerImagenProducto(entity.idProducto)
      .pipe(
        catchError((err) => {
          console.log(err);
          throw err;
        })
      )
      .subscribe((blob: Blob) => {
        const url = URL.createObjectURL(blob);
        entity.imagen = this.sanitizer.bypassSecurityTrustUrl(url);
      });
  }

  retroceder(): void {
    this.location.back();
  }


  agregarAlCarrito(cantidad: number) {
    const token = this.auth.getToken();
    const idUsuario = Number(this.auth.getUserId());

    if (!token || !idUsuario) {
      alert('Por favor inicia sesión para agregar productos al carrito.');
      return;
    }

    this.carrito.agregarProducto(token, idUsuario, this.producto().idProducto, cantidad)
      .subscribe({
        next: () => alert(`"${this.producto().nombre}" fue añadido al carrito 🛒`),
        error: (err) => console.error('Error al agregar al carrito:', err)
      });
  }

}
