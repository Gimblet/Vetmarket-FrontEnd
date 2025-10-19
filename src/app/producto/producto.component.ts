import {Component, inject, OnInit, signal} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {ProductosService} from '../services/Producto/productos.service';
import {Producto} from '../interface/producto/Producto';
import {catchError} from 'rxjs';
import {MatButton} from '@angular/material/button';
import {DomSanitizer} from '@angular/platform-browser';
import {NavbarComponent} from '../cliente/layout/navbar/navbar.component';
import {FooterComponent} from '../cliente/layout/footer/footer.component';
import {NgForOf, SlicePipe} from '@angular/common';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {RouterLink} from "@angular/router";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
    selector: 'app-producto',
    imports: [
        MatCardModule,
        MatButton,
        NavbarComponent,
        FooterComponent,
        RouterLink,
        MatPaginator,
        SlicePipe,
        NgForOf,
        MatProgressSpinner
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

    constructor(
        public sanitizer: DomSanitizer,
    ) {
    }

    ngOnInit(): void {
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

    public getPaginatorData(event: PageEvent): PageEvent {
        this.lowIndex = event.pageIndex * this.pageSize;
        this.highIndex = this.lowIndex + event.pageSize;
        return event;
    }

}
