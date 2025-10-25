import { Component, computed, OnInit, signal } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ServiciosService } from '../../../../services/servicios.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ServicioResponseDTOWithImage } from '../../../../interface/Servicio/Servicio';

@Component({
  selector: 'app-listar-servicio-cliente',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatProgressSpinnerModule, MatPaginator],
  templateUrl: './listar-servicio-cliente.component.html',
  styleUrl: './listar-servicio-cliente.component.scss'
})
export class ListarServicioClienteComponent implements OnInit {
serviciosSignal = signal<ServicioResponseDTOWithImage[]>([]);
  servicios = computed(() => this.serviciosSignal());

  // Pagination
  public pageSize = 6;
  public lowIndex = 0;
  public highIndex = 6;


  constructor(private serviciosService: ServiciosService) {}

  ngOnInit(): void {
    this.cargarServicios();
  }

  cargarServicios(): void {
    this.serviciosService.obtenerListaServicios().subscribe({
  next: (data) => {
    this.serviciosSignal.set(
      data.map(servicio => ({
        ...servicio,
        imagenUrl: servicio.idServicio
          ? `http://localhost:8080/servicio/servicios/imagen/${servicio.idServicio}`
          : 'images/default.jpg'
      }))
    );
  },
  error: (err) => {
    console.error('Error al cargar servicios:', err);
    this.serviciosSignal.set([]);
  }
});
  }

  onImageError(event: Event): void {
  const img = event.target as HTMLImageElement;
  img.src = 'images/default.jpg';
}

public getPaginatorData(event: PageEvent): PageEvent {
  this.lowIndex = event.pageIndex * this.pageSize;
  this.highIndex = this.lowIndex + this.pageSize;
  return event;
}
}
