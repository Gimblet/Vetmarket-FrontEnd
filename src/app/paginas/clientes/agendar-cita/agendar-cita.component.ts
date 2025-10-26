import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../../interface/Usuario/Usuario';
import { Mascota } from '../../../interface/Mascota/Mascota';
import { ActivatedRoute, Router } from '@angular/router';
import { CitaService } from '../../../services/cita.service';
import { AuthService } from '../../../services/auth.service';
import { DetalleDto } from '../../../interface/ServicioCita/DetalleDto';
import { UsuarioService } from '../../../services/usuario.service';
import { MascotaService } from '../../../services/mascota.service';
import Swal from 'sweetalert2';
import { Servicio } from '../../../interface/Servicio/Servicio';
import { ServiciosService } from '../../../services/servicios.service';
import { OrdenCompraService } from '../../../services/orden-compra.service';

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
  
  idServicio: number = 0;
  idMascota: number = 0;
  fechaCitaString: string = '';
  minDate:string;
  
  usuario: Usuario | null = null;
  mascota: Mascota[] = [];

  servicio: Servicio | null = null;

  fechaCitaVisual: string = '';

  mascotaForm = {
    nombre: '',
    especie: '',
    edad: 0,
    peso: 0,
    raza: ''
  };

  constructor(
    private serv:CitaService,
    private sesion:AuthService,
    private usuarioService: UsuarioService,
    private mascotaService: MascotaService,
    private serviciosService: ServiciosService,
    private ordenCompra: OrdenCompraService,
    private route: ActivatedRoute,
    private router:Router
  ){this.minDate=this.fechaActual()}

  ngOnInit():void{
    if (!this.sesion.isAutheticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.token = this.sesion.getToken();
    this.idUsuario = Number(this.sesion.getUserId());

    const id = this.route.snapshot.paramMap.get('idServicio');
    if (id) {
      this.idServicio = +id;
      this.cargarServicio(this.idServicio);
    }

    if (this.idUsuario > 0) {
      this.cargarDatosIniciales(this.idUsuario);
    }
  }

  cargarServicio(id: number): void {
    this.serviciosService.obtenerServicioPorId(id).subscribe({
      next: (data) => {
        this.servicio = data;
      },
      error: () => {
        Swal.fire('Error', 'No se pudo cargar la información del servicio.', 'error');
      }
    });
  }

  cargarDatosIniciales(id: number): void {
    this.usuarioService.buscarPorId(id).subscribe({
      next: data => this.usuario = data,
      error: err => {
        const msg = err.error?.message || err.message || 'No se pudo obtener los datos del usuario.';
        Swal.fire('Error', msg, 'error');
      }
    });
  }

  listarMascotas(): void {
    if (this.idUsuario <= 0) {
      Swal.fire('Aviso', 'Usuario no válido para listar mascotas.', 'warning');
      return;
    }
    this.mascotaService.obtenerListaMascotasPorUsuarioID(this.idUsuario).subscribe({
      next: data => this.mascota = data,
      error: err => {
        const msg = err.error?.message || err.message || 'Error al listar las mascotas.';
        Swal.fire('Error', msg, 'error');
      }
    });
  }

  crearMascota(): void {
    if (!this.mascotaForm.nombre || !this.mascotaForm.especie) {
      Swal.fire('Aviso', 'Complete todos los campos de la mascota.', 'warning');
      return;
    }

    const nuevaMascota = {
      ...this.mascotaForm,
      idUsuario: this.idUsuario
    };

    this.mascotaService.agregarMascota(nuevaMascota).subscribe({
      next: (mascota: Mascota) => {
        Swal.fire('Éxito', 'Mascota '+mascota.nombre+' registrada correctamente.', 'success');
        this.mascota.push(mascota);
        this.idMascota = mascota.idMascota;
        this.mascotaForm = { nombre: '', especie: '', edad: 0, peso: 0, raza: '' };
      },
      error: err => {
        const msg = err.error?.message || err.message || 'Error al registrar la mascota.';
        Swal.fire('Error', msg, 'error');
      }
    });
  }
  actualizarMascota(): void {
    if (!this.idMascota || this.idMascota <= 0) {
      Swal.fire('Aviso', 'Seleccione una mascota válida para actualizar.', 'warning');
      return;
    }

    const mascotaActualizada = {
      idMascota: this.idMascota,
      nombre: this.mascotaForm.nombre,
      especie: this.mascotaForm.especie,
      edad: this.mascotaForm.edad,
      peso: this.mascotaForm.peso,
      raza: this.mascotaForm.raza
    };

    this.mascotaService.editarMascota(this.idMascota, mascotaActualizada).subscribe({
      next: (mascota: Mascota) => {
        Swal.fire('Éxito', 'Mascota '+mascota.nombre+' actualizada correctamente.', 'success');
        this.listarMascotas();
      },
      error: err => {
        const msg = err.error?.message || err.message || 'Error al actualizar la mascota.';
        Swal.fire('Error', msg, 'error');
      }
    });
  }

  agendarCita(): void {
    if (!this.token || this.idUsuario <= 0 || !this.fechaCitaString) {
      Swal.fire('Aviso', 'Debe seleccionar una fecha válida antes de continuar.', 'info');
      return;
    }
    if (this.idMascota <= 0) {
      Swal.fire('Aviso', 'Debe seleccionar o registrar una mascota antes de agendar la cita.', 'info');
      return;
    }

    Swal.fire({
      title: 'Procesando...',
      text: 'Por favor espere mientras se agenda su cita.',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    this.ordenCompra.procesarOrdenCita(
      this.token,
      this.idUsuario,
      this.idServicio,
      this.idMascota,
      this.fechaCitaString
    ).subscribe({
      next: (mensaje: string) => {
        Swal.close();
        Swal.fire('Cita registrada', mensaje, 'success').then(() => {
          this.router.navigate(['/ordenCompra']);
        });
      },
      error: err => {
        Swal.close();
        if (err.status === 400) {
          Swal.fire('Fecha no disponible', 'El veterinario estará ocupado el día seleccionado, por favor escoja otra fecha.', 'warning');
        } else if (err.status === 401) {
          Swal.fire('Sesión expirada', 'Por favor vuelva a iniciar sesión.', 'info');
          this.router.navigate(['/login']);
        } else if (err.status === 409) {
          Swal.fire('Datos incompletos', err.error || 'Complete los campos requeridos.', 'warning');
        } else if (err.status === 500) {
          Swal.fire('Error interno', 'Ocurrió un error al procesar la cita. Intente nuevamente.', 'error');
        } else {
          Swal.fire('Error', err.error?.message || 'No se pudo conectar con el servidor.', 'error');
        }
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
  mascotaSeleccionada(m: Mascota): void {
    this.mascotaForm = { ...m };
    this.mascotaForm = { ...m };
    this.idMascota = m.idMascota;
    Swal.fire('Mascota seleccionada', 'Has seleccionado a '+m.nombre+'.', 'info');
  }

  vaciarFormulario(): void {
    this.mascotaForm = { nombre: '', especie: '', edad: 0, peso: 0, raza: '' };
    this.idMascota = 0; // Limpia la selección de mascota
    Swal.fire('Formulario limpio', 'Puede registrar una nueva mascota.', 'success');
  }

  formatearFechaVisual(): void {
    if (!this.fechaCitaString) {
      this.fechaCitaVisual = '';
      return;
    }

    const partes = this.fechaCitaString.split('-');
    const anio = Number(partes[0]);
    const mes = Number(partes[1]) - 1;
    const dia = Number(partes[2]);

    const fecha = new Date(anio, mes, dia);
    const opciones: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    this.fechaCitaVisual = fecha.toLocaleDateString('es-PE', opciones);
  }

}
