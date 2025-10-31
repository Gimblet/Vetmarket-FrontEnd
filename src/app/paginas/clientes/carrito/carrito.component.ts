import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {CarritoCompra} from '../../../interface/CarritoCompras/CarritoCompra';
import {CarritoService} from '../../../services/carrito.service';
import {OrdenCompraService} from '../../../services/orden-compra.service';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';
import {DetalleDto} from '../../../interface/ServicioCita/DetalleDto';
import {catchError} from 'rxjs';

@Component({
  selector: 'app-carrito',
  imports: [CommonModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.scss'
})
export default class CarritoComponent {

  carrito: DetalleDto[] = [];
  token: string | null = '';
  idUsuario: number | null = null;
  totalGeneral: number = 0;

  constructor(
    private carritoService: CarritoService,
    private ordenService: OrdenCompraService,
    private auth: AuthService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.token = this.auth.getToken();
    this.idUsuario = Number(this.auth.getUserId());

    if (this.token && this.idUsuario) {
      this.obtenerCarrito();
    } else {
      Swal.fire('Error', 'No se pudo validar la sesión', 'error');
    }
  }

  obtenerCarrito(): void {
    this.carritoService.obtenerCarrito(this.token!, this.idUsuario!)
      .pipe(
        catchError((err) => {
          console.log(err);
          Swal.fire('Error', 'No se pudo obtener el carrito', 'error')
          throw err;
        })
      )
      .subscribe((detalle: DetalleDto[]) => {
        this.carrito = detalle;
        this.calcularTotal();
      });
  }


  calcularTotal(): void {
    this.totalGeneral = this.carrito.reduce((acc, item) => acc + (item.total || 0), 0);
  }

  eliminarProducto(idProducto: number, nombre: string): void {
    Swal.fire({
      title: '¿Eliminar producto?',
      text: `¿Desea eliminar ${nombre} del carrito?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.carritoService.eliminarProducto(this.token!, this.idUsuario!, idProducto).subscribe({
          next: () => {
            Swal.fire('Eliminado', `${nombre} fue eliminado del carrito`, 'success');
            this.obtenerCarrito();
          },
          error: () => Swal.fire('Error', 'No se pudo eliminar el producto', 'error')
        });
      }
    });
  }

  generarOrden(): void {
    if (this.carrito.length === 0) {
      Swal.fire('Aviso', 'El carrito está vacío', 'info');
      return;
    }

    Swal.fire({
      title: 'Confirmar orden',
      text: '¿Desea generar la orden de compra?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, generar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {

        this.ordenService.procesarOrdenCarrito(this.token!, this.idUsuario!).subscribe({
          next: () => {
            Swal.fire('Éxito', 'Orden generada correctamente', 'success').then(() => {
              this.router.navigate(['/ordenCompra']);
            });
          },
          error: () => Swal.fire('Error', 'No se pudo generar la orden', 'error')
        });
      }
    });
  }

}
