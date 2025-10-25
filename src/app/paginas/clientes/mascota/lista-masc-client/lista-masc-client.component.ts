import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CrearMascComponent } from '../../../administrador/mascota/crear-masc/crear-masc.component';
import { Mascota } from '../../../../interface/Mascota/Mascota';
import { MascotaService } from '../../../../services/mascota.service';
import { AuthService } from '../../../../services/auth.service';
import Swal from 'sweetalert2';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-lista-masc-client',
  standalone: true,
  imports: [CommonModule, CrearMascComponent],
  templateUrl: './lista-masc-client.component.html',
  styleUrl: './lista-masc-client.component.scss'
})
export class ListaMascClientComponent implements OnInit {
  mascotas: Mascota[] = []
  mascotaSeleccionado: Mascota | null = null

  constructor(
    private mascotaService: MascotaService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarMascotas()
  }

  cargarMascotas() {
    const usuarioId = this.authService.getUserId();
    if (!usuarioId) {
      Swal.fire('Error', 'Debes iniciar sesión para ver tus mascotas.', 'error');
      return;
    }

    this.mascotaService.obtenerListaMascotasPorUsuarioID(+usuarioId).subscribe({
      next: (data) => (this.mascotas = data),
      error: (err) => {
        console.error('Error al cargar mascotas:', err);
        Swal.fire('Error', 'No se pudieron cargar tus mascotas.', 'error');
      }
    });
  }

  abrirModal() {
    this.mascotaSeleccionado = null;
    const modalElement = document.getElementById('nuevaMascotaModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  }

  editarMascota(mascota: Mascota) {
    this.mascotaSeleccionado = {...mascota}
    const modalElement = document.getElementById('nuevaMascotaModal')
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  }

  eliminarMascota(idMascota: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará tu mascota permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.mascotaService.eliminarMascota(idMascota).subscribe({
          next: () => {
            Swal.fire('¡Eliminado!', 'Tu mascota ha sido eliminada.', 'success');
            this.cargarMascotas();
          },
          error: () => {
            Swal.fire('Error', 'No se pudo eliminar la mascota.', 'error');
          }
        })
      }
    })
  }

}
