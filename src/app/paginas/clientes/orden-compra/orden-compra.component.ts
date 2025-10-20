import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Orden } from '../../../interface/OrdenCompra/Orden';
import { DetalleProducto } from '../../../interface/OrdenCompra/DetalleProducto';
import { DetalleServicio } from '../../../interface/OrdenCompra/DetalleServicio';
import { OrdenCompraService } from '../../../services/orden-compra.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';
import { DetalleOrden } from '../../../interface/OrdenCompra/DetalleOrden';

@Component({
  selector: 'app-orden-compra',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './orden-compra.component.html',
  styleUrl: './orden-compra.component.scss'
})
export default class OrdenCompraComponent {

  ordenes:Orden[]=[]
  detalleOrden:DetalleOrden[]=[]
  detalleProducto:DetalleProducto[]=[]
  detalleServicio:DetalleServicio[]=[]
  ordenSeleccionada:Orden | null = null

  token: string | null = null;

  cargando = false;

  constructor(
    private serv:OrdenCompraService,
    private route:ActivatedRoute,
    private sesion:AuthService,
    private router:Router
  ){}

  ngOnInit():void{
    this.token = this.sesion.getToken();
    this.llenar()
  }
  private validarSesion(): boolean {
    this.token = this.sesion.getToken();
    const idUsuario = Number(this.sesion.getUserId());
    
    if (!this.token || idUsuario === 0) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }

  llenar() {
    if (!this.validarSesion()) return;
    const idUsuario = Number(this.sesion.getUserId());
    this.cargando = true;
    this.serv.listarOrdenesPorUsuario(this.token!, idUsuario).subscribe({
      next: data => { 
        this.ordenes = data;
        this.cargando = false;
        },
      error: err => { 
        this.cargando = false; 
        console.error('Error detallado al cargar órdenes:', err);
        Swal.fire('Error', 'No se pudieron cargar las órdenes', 'error');
      }
    });
  }

  verDetalle(ord: Orden) {
    this.ordenSeleccionada = ord;

    if (!this.token) {
      Swal.fire('Error', 'Sesión no válida.', 'error');
      return;
    }

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
    this.detalleOrden = [];
    this.detalleProducto = [];
    this.detalleServicio = [];
    this.ordenSeleccionada = null;
  }
}
