import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../../interface/Usuario/Usuario';
import { Mascota } from '../../../interface/Mascota/Mascota';
import { Router } from '@angular/router';
import { CitaService } from '../../../services/cita.service';
import { AuthService } from '../../../services/auth.service';
import { DetalleDto } from '../../../interface/ServicioCita/DetalleDto';

@Component({
  selector: 'app-agendar-cita',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './agendar-cita.component.html',
  styleUrl: './agendar-cita.component.scss'
})
export default class AgendarCitaComponent {
  token: string | null = null;
  idUsuario: number = 0;
  
  idServicio: number = 1; // debo obtener el id del servicio
  idMascota: number = 101;// obtener la mascota con el servicio macota
  fechaCitaString: string = '';
  minDate:string;
  
  usuario: Usuario | null = null;
  mascotasDisponibles: Mascota[] = [];

  mascotaForm = {
    nombre: '',
    especie: '',
    edad: 0,
    peso: 0
  };


  constructor(
    private serv:CitaService,
    private sesion:AuthService,
    private router:Router
    //servicio mascota
    //servicio usuario
    //servicio Servicio
  ){this.minDate=this.fechaActual()}

  ngOnInit():void{
    if (!this.sesion.isAutheticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.token = this.sesion.getToken();
    this.idUsuario = Number(this.sesion.getUserId());

    if (this.idUsuario > 0) {
      this.cargarDatosIniciales(this.idUsuario);
    }
  }

    cargarDatosIniciales(id: number): void {
      //llamar a los servicios de usuarios y mascota
     console.log("Cargando datos para el usuario: " + id);
     this.usuario = { idUsuario: id, nombre: "Usuario Test" };
  }

  agendarCita(): void {
    if (!this.token || this.idUsuario <= 0 || !this.fechaCitaString) {
      alert("Faltan datos de sesión o la fecha es obligatoria.");
      return;
    }

    this.serv.nuevaCita(this.token, this.idUsuario,
      this.idServicio, this.idMascota, this.fechaCitaString 
      ).subscribe({

        next: (response: DetalleDto) => {
          alert('Cita Agendada. Detalle: ' + JSON.stringify(response));
          this.router.navigate(['/ordenes-cliente']);
        },
        error: (err) => {
          const errorMessage = err.error?.message || err.message || 'Error desconocido.';
          alert(`Error al agendar: ${errorMessage}`);
        }
      });
  }

  fechaActual():string{
    const fecha = new Date();
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return anio+"-"+mes+"-"+dia;
  }

  seleccionarMascota() {
    console.log('Lista de Mascota');
  }


}
