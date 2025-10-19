import {Component, inject, OnInit, signal} from '@angular/core';
import {NavbarComponent} from '../../cliente/layout/navbar/navbar.component';
import {ActivatedRoute} from '@angular/router';
import {Producto} from '../../interface/producto/Producto';
import {ProductosService} from '../../services/Producto/productos.service';
import {catchError} from 'rxjs';
import {DomSanitizer} from '@angular/platform-browser';
import {MatTooltip} from '@angular/material/tooltip';
import {Location} from '@angular/common';

@Component({
  selector: 'app-detalles',
  imports: [
    NavbarComponent,
    MatTooltip,
  ],
  templateUrl: './detalles.component.html',
  styleUrl: './detalles.component.scss'
})
export class DetallesComponent implements OnInit {
  productId = signal(0);
  producto = signal<Producto>({} as Producto)

  private activatedRoute = inject(ActivatedRoute);
  productoService = inject(ProductosService);

  constructor(
    private sanitizer: DomSanitizer,
    private location: Location
  ) {
    this.activatedRoute.params.subscribe((params) => {
      this.productId.set(params['id']);
    });
  }

  ngOnInit(): void {
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

}
