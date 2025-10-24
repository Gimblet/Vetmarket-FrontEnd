import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Orden } from '../../../interface/OrdenCompra/Orden';
import { DetalleProducto } from '../../../interface/OrdenCompra/DetalleProducto';
import { DetalleServicio } from '../../../interface/OrdenCompra/DetalleServicio';
import { OrdenCompraService } from '../../../services/orden-compra.service';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ordenes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ordenes.component.html',
  styleUrl: './ordenes.component.scss'
})
export default class OrdenesComponent {

  ordenes: Orden[] = [];
  detalleProducto: DetalleProducto[] = [];
  detalleServicio: DetalleServicio[] = [];
  ordenSeleccionada: Orden | null = null;

  token: string | null = null;
  cargando = false;

  constructor(
    private serv: OrdenCompraService,
    private sesion: AuthService
  ) {}

  ngOnInit(): void {
    this.token = this.sesion.getToken();
    if (!this.token) {
      Swal.fire('Error', 'Sesión no válida', 'error');
      return;
    }
    this.listarTodasOrdenes();
  }

  listarTodasOrdenes() {
    this.cargando = true;
    this.serv.listarTodasOrdenes(this.token!).subscribe({
      next: data => {
        this.ordenes = data;
        this.cargando = false;
      },
      error: err => {
        console.error('Error al obtener órdenes:', err);
        this.cargando = false;
        Swal.fire('Error', 'No se pudieron cargar las órdenes', 'error');
      }
    });
  }

  verDetalle(ord: Orden) {
    if (!this.token) {
      Swal.fire('Error', 'Sesión no válida.', 'error');
      return;
    }
    this.ordenSeleccionada = ord;
    this.serv.listarDetalleOrden(this.token, ord.numeroOrden).subscribe({
      next: data => {
        this.detalleServicio = data.filter((d: any) => 'fechaCita' in d && 'mascota' in d) as DetalleServicio[];
        this.detalleProducto = data.filter((d: any) => !('fechaCita' in d && 'mascota' in d)) as DetalleProducto[];
        this.abrirModalDetalle();
      },
      error: err => {
        console.error('Error al cargar detalle:', err);
        Swal.fire('Error', 'No se pudo cargar el detalle de la orden', 'error');
      }
    });
  }
  abrirModalDetalle() {
    const modalEl = document.getElementById('modalDetalleOrden');
    if (!modalEl) return;
    // @ts-ignore
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();
  }

  cerrarModalDetalle() {
    const modalEl = document.getElementById('modalDetalleOrden');
    if (!modalEl) return;
    // @ts-ignore
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.hide();
    this.detalleProducto = [];
    this.detalleServicio = [];
    this.ordenSeleccionada = null;
  }

  obtenerTotalGanancias(): number {
    return this.ordenes?.reduce((total, ord) => total + (ord.comisionTotal || 0), 0) || 0;
  }

}
