import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Orden } from '../../../modelos/OrdenCompra/Orden';
import { DetalleProducto } from '../../../modelos/OrdenCompra/DetalleProducto';
import { DetalleServicio } from '../../../modelos/OrdenCompra/DetalleServicio';
import { OrdenCompraService } from '../../../services/orden-compra.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';
import { DetalleOrden } from '../../../modelos/OrdenCompra/DetalleOrden';

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

  llenar(){
    const idUsuario = 0//this.sesion.getUsuario();
    
    if (this.token === null || idUsuario===0) {
      this.router.navigate(['/login']);
      return;
    }
    this.serv.listarOrdenesPorUsuario(this.token, idUsuario).subscribe(data=>{
      this.ordenes=data
    })
  }

  verDetalle(ord: Orden) {
    this.ordenSeleccionada = ord;

    if (!this.token) {
      Swal.fire('Error', 'Sesión no válida.', 'error');
      return;
    }

    this.serv.listarDetalleOrden(this.token, ord.numeroOrden).subscribe({
      next: data => {
        this.detalleOrden = data;
        const primerElemento = data[0];

        if ('fechaCita' in primerElemento && 'idMascota' in primerElemento) {
          this.detalleServicio = this.detalleOrden as DetalleServicio[]; 
          this.detalleProducto = [];
        } else {
          this.detalleProducto = this.detalleOrden as DetalleProducto[];
          this.detalleServicio = []; 
        }
        this.abrirModalDetalle();
      },
      error: err => {
        console.error('Error al cargar detalle:', err);
        Swal.fire('Error', 'No se pudo cargar el detalle de la orden', 'error');
      }
    });
  }

  private abrirModalDetalle() {
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
