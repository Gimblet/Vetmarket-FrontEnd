import { Component } from '@angular/core';
import { DetalleVentaDTO } from '../../../interface/OrdenCompra/DetalleVentaDto';
import { OrdenCompraService } from '../../../services/orden-compra.service';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ventas.component.html',
  styleUrl: './ventas.component.scss'
})
export default class VentasComponent {

  ventas: DetalleVentaDTO[] = [];
  token: string | null = '';
  usuarioId: number | null = null;

  constructor(
    private serv: OrdenCompraService,
    private sesion: AuthService,
  ) {}

  ngOnInit(): void {
    this.token = this.sesion.getToken();
    this.usuarioId = Number(this.sesion.getUserId());

    if(this.token && this.usuarioId !== null){
      this.listarVentas();
    } else {
      Swal.fire('Error', 'No se pudo validar autorizacion', 'error');
    }
  }

  listarVentas() {
    this.serv.listarVentasVeterinarios(this.token!, this.usuarioId!).subscribe({
      next: (data) => this.ventas = data,
      error: (err) => Swal.fire('Error', 'Error al obtener ventas', 'error')
    });
  }

  descargarPDF(venta: DetalleVentaDTO) {
    // Aquí pondremos la lógica para generar PDF
    Swal.fire('PDF', `Generando PDF para el detalle de orden ${venta.detalleId}`, 'info');
  }

}
