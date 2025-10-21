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
    const opcionesFecha: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    };

    const fechaActual = new Date().toLocaleDateString('es-PE', opcionesFecha);
    const fechaVenta = new Date(venta.fecha).toLocaleDateString('es-PE', opcionesFecha);

    const textoCondicional =
      venta.tipoItem.toLowerCase() === 'servicio'
        ? '<p><strong>Fecha de la cita:</strong> ${fechaVenta}</p>'
        : '';

    const contenidoHTML = `
      <html>
        <head>
          <title>Reporte de venta</title>
          <style>
            body { font-family:'Segoe UI', Arial, sans-serif; margin: 50px; color: #333; font-size: 15px;line-height: 1.6;}
            h1 { text-align: center; color: #2a6f97; font-size: 26px;margin-bottom: 10px;}
            h2 { text-align: center; margin: 30px 0 25px 0; font-size: 20px;}
            p { font-size: 16px; margin: 8px 0; }
            .footer { text-align: center; margin-top: 40px; font-size: 13px; color: #777; }
          </style>
        </head>
        <body>
          <h1>VetMarket</h1>
          <p style="text-align:right;"><strong>Fecha de emisión:</strong> ${fechaActual}</p>
          <h2>Reporte de venta de ${venta.tipoItem}</h2>

          <br><br><br>
          <p>Por el valor de <strong>S/. ${venta.total}</strong></p>
          <p>Se ha adquirido <strong>${venta.cantidad}</strong> ${venta.tipoItem.toLowerCase()}(s): 
            "<strong>${venta.nombreItem}</strong>" por el valor unitario de 
            <strong>S/. ${venta.precio}</strong>.</p>
          ${textoCondicional}
          <p><strong>Total pagado:</strong> S/. ${venta.total}</p>
          
          <br><br><br><br>
          <div class="footer">
            © ${new Date().getFullYear()} VetMarket — Sistema de Gestión de Ventas
          </div>
        </body>
      </html>
    `;

    // Crear una nueva ventana para imprimir
    const ventana = window.open('', '_blank', 'width=800,height=600');
    if (ventana) {
      ventana.document.open();
      ventana.document.write(contenidoHTML);
      ventana.document.close();

      // Esperar a que cargue y luego abrir diálogo de impresión
      ventana.onload = () => {
        ventana.print();
        ventana.close();
      };
    } else {
      Swal.fire('Error', 'No se pudo abrir la ventana para generar el PDF', 'error');
    }
  }
}
