import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ServicioResponseDTO } from '../../../../interface/Servicio/Servicio';
import { ServiciosService } from '../../../../services/servicios.service';
import Swal from 'sweetalert2';
import { Modal } from 'bootstrap';
import { CrearServicioComponent } from "../crear-servicio/crear-servicio.component";


@Component({
  selector: 'app-lista-servicio',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CrearServicioComponent],
  templateUrl: './lista-servicio.component.html',
  styleUrl: './lista-servicio.component.scss'
})
export class ListaServicioComponent {

servicios: ServicioResponseDTO[] = []
  servicioSeleccionado: ServicioResponseDTO | null = null

  constructor(private servicioService: ServiciosService) {}

  ngOnInit(): void {
    this.cargarServicio()
  }

  cargarServicio() {
    this.servicioService.obtenerListaServicios().subscribe({
      next: (data) => (this.servicios = data),
      error: (err) => {
        console.error('Error al obtener servicios:', err);
        Swal.fire('Error', 'No se pudo cargar la lista de servicios', 'error')
      }
    })
  }

  abrirModal() {
    this.servicioSeleccionado = null
    const modalElement = document.getElementById('nuevoServicioModal')
    if(modalElement) {
      const modal = new Modal(modalElement)
      modal.show()
    }
  }

  editarServicio(servicio: ServicioResponseDTO) {
    this.servicioSeleccionado = {...servicio}
    const modalElement = document.getElementById('nuevoServicioModal')
    if(modalElement) {
      const modal = new Modal(modalElement)
      modal.show()
    }
  }

  eliminarServicio(idServicio: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el servicio de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if(result.isConfirmed) {
        this.servicioService.eliminarServicio(idServicio).subscribe(() => {
          Swal.fire('¡Eliminado!', 'El servicio ha sido eliminado.', 'success')
          this.cargarServicio()
        })
      }
    })
  }

  // Dentro de ListaServicioComponent
onServicioGuardado(): void {
  // Cierra el modal
  const modalElement = document.getElementById('nuevoServicioModal');
  if (modalElement) {
    const modal = Modal.getInstance(modalElement);
    if (modal) {
      modal.hide();
    }
  }

  // Recarga la lista
  this.cargarServicio();
}

}
