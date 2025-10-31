import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Mascota, MascotaCreateRequest, MascotaUpdateRequest,  } from '../../../../interface/Mascota/Mascota';
import { MascotaService } from '../../../../services/mascota.service';
import Swal from 'sweetalert2';
import { Modal } from 'bootstrap';
import { AuthService } from '../../../../services/auth.service';
import { UsuarioService } from '../../../../services/usuario.service';
import { Usuario } from '../../../../interface/Usuario/Usuario';

@Component({
  selector: 'app-crear-masc',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crear-masc.component.html',
  styleUrl: './crear-masc.component.scss',
})
export class CrearMascComponent implements OnInit, OnChanges {
  @Input() mascotaSeleccionado: Mascota | null = null;
  @Output() mascotaCreado = new EventEmitter<void>();

  formMascota: FormGroup;
  rolUsuario: string | null = null;

  clientes: Usuario[] = []
  nombreClienteLogueado: string = ''

  constructor(
    private fb: FormBuilder,
    private mascotaService: MascotaService,
    private authService: AuthService,
    private usuarioService: UsuarioService
  ) {
    this.formMascota = this.fb.group({
      nombre: ['', [Validators.required]],
      edad: ['', [Validators.required, Validators.min(0)]],
      peso: ['', [Validators.required, Validators.min(0.1)]],
      especie: ['', [Validators.required]],
      raza: ['', [Validators.required]],
      // idUsuario: [{ value: '', disabled: true }, [Validators.required]],
      idUsuario: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.rolUsuario = localStorage.getItem('rol');
    this.inicializarFormulario()

      // Cargar clientes solo si es ADMIN y estamos en modo creación
    if (this.rolUsuario === 'ADMIN' && !this.mascotaSeleccionado) {
      this.usuarioService.obtenerClientes().subscribe({
        next: (clientes) => {
          this.clientes = clientes;
        },
        error: (err) => {
          console.error('Error al cargar clientes:', err);
          Swal.fire('Error', 'No se pudieron cargar los clientes.', 'error');
        }
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
  if (changes['mascotaSeleccionado']) {
    this.inicializarFormulario(); // Se ejecuta al cambiar de crear ↔ editar
  }
}

private inicializarFormulario(): void {
  const usuarioId = this.authService.getUserId();
  const rol = this.rolUsuario;
  const idUsuarioControl = this.formMascota.get('idUsuario');

  if (this.mascotaSeleccionado) {
    // Modo edición
    idUsuarioControl?.clearValidators();
    idUsuarioControl?.updateValueAndValidity();

    this.formMascota.patchValue({
      nombre: this.mascotaSeleccionado.nombre,
      edad: this.mascotaSeleccionado.edad,
      peso: this.mascotaSeleccionado.peso,
      especie: this.mascotaSeleccionado.especie,
      raza: this.mascotaSeleccionado.raza
    });
  } else {
    // Modo creación
    idUsuarioControl?.setValidators([Validators.required, Validators.min(1)]);
    idUsuarioControl?.updateValueAndValidity();
    this.formMascota.reset();

    if (rol === 'ADMIN') {
      idUsuarioControl?.enable();
    } else if (rol === 'CLIENTE' && usuarioId) {
      idUsuarioControl?.setValue(+usuarioId);
      idUsuarioControl?.disable();

      // Obtener y mostrar el nombre del cliente logueado
      this.usuarioService.buscarPorId(+usuarioId).subscribe({
        next: (usuario) => {
          this.nombreClienteLogueado = `${usuario.nombre} ${usuario.apellido}`;
        },
        error: (err) => {
          console.error('Error al cargar datos del usuario:', err);
          this.nombreClienteLogueado = 'Usuario desconocido';
        }
      });
    } else {
      idUsuarioControl?.enable();
    }
  }
}

  guardarMascota() {
  if (this.formMascota.invalid) {
    this.formMascota.markAllAsTouched();
    Swal.fire('Error', 'Por favor, completa los campos obligatorios.', 'warning');
    return;
  }

  const formValue = this.formMascota.getRawValue();

  if (this.mascotaSeleccionado) {
    // EDITAR: usar MascotaUpdateRequest (sin idUsuario)
    const request: MascotaUpdateRequest = {
      nombre: formValue.nombre,
      edad: formValue.edad,
      peso: formValue.peso,
      especie: formValue.especie,
      raza: formValue.raza
    };

    this.mascotaService.editarMascota(this.mascotaSeleccionado.idMascota, request).subscribe({
      next: (mascotaGuardado) => {
        Swal.fire('¡Éxito!', `Mascota "${mascotaGuardado.nombre}" se actualizó correctamente.`, 'success');
        this.mascotaCreado.emit();
        this.cerrarModal();
      },
      error: (err) => {
        console.error('Error al actualizar mascota:', err);
        Swal.fire('Error', 'No se pudo actualizar la mascota. Revisa los datos e intenta de nuevo.', 'error');
      }
    });
  } else {
    // CREAR: usar MascotaCreateRequest
    const request: MascotaCreateRequest = {
      nombre: formValue.nombre,
      edad: formValue.edad,
      peso: formValue.peso,
      especie: formValue.especie,
      raza: formValue.raza,
      idUsuario: formValue.idUsuario
    };

    this.mascotaService.agregarMascota(request).subscribe({
      next: (mascotaGuardado) => {
        Swal.fire('¡Éxito!', `Mascota "${mascotaGuardado.nombre}" se guardó correctamente.`, 'success');
        this.mascotaCreado.emit();
        this.cerrarModal();
      },
      error: (err) => {
        console.error('Error al guardar mascota:', err);
        Swal.fire('Error', 'No se pudo guardar la mascota. Revisa los datos e intenta de nuevo.', 'error');
      }
    });
  }
}

  cerrarModal(): void {
    const modalElement = document.getElementById('nuevaMascotaModal');
    if (modalElement) {
      const modal = Modal.getInstance(modalElement);
      modal?.hide();
    }
    this.resetFormulario();
  }

  // Metodo para resetear completamente el formulario
  public resetFormulario(): void {
    this.mascotaSeleccionado = null;
    this.inicializarFormulario()
  }
}
