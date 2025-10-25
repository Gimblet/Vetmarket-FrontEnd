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
    const fechaCita =
      venta.tipoItem.toLowerCase() === 'servicio'
        ? new Date(venta.fecha).toLocaleDateString('es-PE', opcionesFecha)
        : null;

    const textoCondicional = fechaCita
      ? `<p><strong>Fecha de cita:</strong> ${fechaCita}</p>`
      : '';

    // Cálculos de subtotal, comisión y total neto
    const subtotal = venta.total;
    const comision = subtotal * 0.15;
    const totalNeto = subtotal - comision;

    const descripcionExtra =
      venta.tipoItem.toLowerCase() === 'servicio'
        ? `<p>Este servicio forma parte de nuestra gama de atenciones veterinarias, como consultas médicas, vacunaciones, desparasitación y peluquería canina, diseñadas para el bienestar de su mascota.</p>`
        : `<p>VetMarket también ofrece servicios veterinarios complementarios que garantizan el cuidado integral de su mascota.</p>`;

    const contenidoHTML = `
      <html>
        <head>
          <title>Comprobante de Venta</title>
          <style>
            body { font-family:'Segoe UI', Arial, sans-serif; margin: 40px; color: #333; font-size: 15px; line-height: 1.6;}
            h1 { text-align: center; color: #1e6091; font-size: 26px; margin-bottom: 5px;}
            h2 { text-align: center; color: #555; font-size: 18px; margin-top: 0;}
            hr { border: none; border-top: 2px solid #ccc; margin: 20px 0; }
            .section { margin: 20px 0; }
            .total { text-align: right; font-size: 18px; font-weight: bold; color: #2a6f97; }
            .footer { text-align: center; margin-top: 50px; font-size: 13px; color: #777; }
            .resumen { text-align: right; margin-top: 15px; }
            .resumen p { margin: 4px 0; font-size: 16px; }
          </style>
        </head>
        <body>
          <h1>VetMarket</h1>
          <h2>Comprobante de Venta</h2>
          <p style="text-align:right;"><strong>Fecha de emisión:</strong> ${fechaActual}</p>
          <hr>

          <div class="section">
            ${textoCondicional}
            <p><strong>Detalle del ${venta.tipoItem.toLowerCase()}:</strong> ${venta.nombreItem}</p>
            <p><strong>Cantidad:</strong> ${venta.cantidad}</p>
            <p><strong>Precio unitario:</strong> S/. ${venta.precio}</p>

            <div class="resumen">
              <p><strong>Subtotal:</strong> S/. ${subtotal.toFixed(2)}</p>
              <p><strong>Comisión (15%):</strong> S/. ${comision.toFixed(2)}</p>
              <p class="total">Total neto: S/. ${totalNeto.toFixed(2)}</p>
            </div>
          </div>

          <hr>

          <div class="section">
            <h3>Gracias por confiar en VetMarket 🐾</h3>
            ${descripcionExtra}
            <p>Recuerde que puede agendar próximas citas o adquirir más productos desde nuestro sistema web.</p>
          </div>

          <div class="footer">
            © ${new Date().getFullYear()} VetMarket — Sistema de Gestión de Ventas y Servicios Veterinarios
          </div>
        </body>
      </html>
    `;

    const ventana = window.open('', '_blank', 'width=800,height=600');
    if (ventana) {
      ventana.document.open();
      ventana.document.write(contenidoHTML);
      ventana.document.close();

      ventana.onload = () => {
        ventana.print();
        ventana.close();
      };
    } else {
      Swal.fire('Error', 'No se pudo abrir la ventana para generar el PDF', 'error');
    }
  }


}
