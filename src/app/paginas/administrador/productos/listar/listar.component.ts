import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable, MatTableDataSource
} from '@angular/material/table';
import {Producto} from '../../../../interface/producto/Producto';
import {DomSanitizer} from '@angular/platform-browser';
import {ProductosService} from '../../../../services/Producto/productos.service';
import {catchError} from 'rxjs';
import {MatPaginator} from '@angular/material/paginator';
import {MatButton} from '@angular/material/button';
import {Modal} from 'bootstrap';
import {ToastrService} from 'ngx-toastr';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-listar',
  imports: [
    MatTable,
    MatHeaderCell,
    MatCell,
    MatColumnDef,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    MatButton,
    MatPaginator,
    RouterLink
  ],
  templateUrl: './listar.component.html',
  styleUrl: './listar.component.scss'
})
export class ListarComponent implements OnInit, AfterViewInit {

  dataSource = new MatTableDataSource<Producto>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  columns = [
    'ID',
    'Imagen',
    'Nombre',
    'Precio',
    'Stock',
    'Veterinario',
    'Acciones',
  ];

  constructor(
    private productoService: ProductosService,
    public sanitizer: DomSanitizer,
    private toastr: ToastrService,
  ) {
  }

  ngOnInit(): void {
    this.obtenerProductos()
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
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
        this.dataSource.data = productos;
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
      next: (resp) => {
        this.toastr.success('Producto Eliminado con exito', 'ESTADO');
        this.obtenerProductos();
        new Modal(resp);
      }
    });
  }

}
