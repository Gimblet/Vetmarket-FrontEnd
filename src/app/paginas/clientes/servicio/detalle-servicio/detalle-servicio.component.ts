import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ServiciosService } from '../../../../services/servicios.service';
import { ServicioResponseDTO } from '../../../../interface/Servicio/Servicio';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-detalle-servicio',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatProgressSpinnerModule, RouterModule],
  templateUrl: './detalle-servicio.component.html',
  styleUrl: './detalle-servicio.component.scss'
})
export class DetalleServicioComponent implements OnInit {
servicio = signal<ServicioResponseDTO & { imagenUrl?: string } | null>(null);

  rol:string | null=null
  constructor(
    private route: ActivatedRoute,
    private serviciosService: ServiciosService,
    private authService:AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.rol$.subscribe((rol) => {
      this.rol = rol;
    });
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.serviciosService.obtenerServicioPorId(+id).subscribe({
        next: (data) => {
          this.servicio.set({
            ...data,
            imagenUrl: `http://localhost:8080/servicio/servicios/imagen/${data.idServicio}`
          });
        },
        error: () => {
          this.servicio.set(null);
        }
      });
    }
  }

  agendarCita(): void {
    const idServicio = this.servicio()?.idServicio;
    if (idServicio) {
      // se toma el id del servicio y se refirige
      this.router.navigate(['/agendarCita', idServicio]);
    }
  }

  onImageError(event: Event): void {
  const img = event.target as HTMLImageElement;
  img.src = 'images/default.jpg';
}
}
