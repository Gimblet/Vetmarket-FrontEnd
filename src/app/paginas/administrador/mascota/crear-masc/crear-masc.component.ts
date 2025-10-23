import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Mascota, MascotaRequest } from '../../../../interface/Mascota/Mascota';
import { MascotaService } from '../../../../services/mascota.service';
import Swal from 'sweetalert2';
import { Modal } from 'bootstrap';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-crear-masc',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crear-masc.component.html',
  styleUrl: './crear-masc.component.scss'
})
export class CrearMascComponent implements OnInit, OnChanges{
  @Input() mascotaSeleccionado: Mascota | null = null
  @Output() mascotaCreado = new EventEmitter<void>()

  formMascota: FormGroup

  constructor(
    private fb: FormBuilder,
    private mascotaService: MascotaService,
    private authService: AuthService
  ) {
      this.formMascota = this.fb.group({
        nombre: ['', [Validators.required]],
        edad: ['', [Validators.required, Validators.min(0)]],
        peso: ['', [Validators.required, Validators.min(0.1)]],
        especie: ['', [Validators.required]],
        raza: ['', [Validators.required]],
        // idUsuario: [null, [Validators.required]]
      })
    }
  
  ngOnInit(): void {
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mascotaSeleccionado']) {
      if (this.mascotaSeleccionado) {
        // Editar: Cargar los datos en el formulario
        this.formMascota.patchValue({
          nombre: this.mascotaSeleccionado.nombre,
          edad: this.mascotaSeleccionado.edad,
          peso: this.mascotaSeleccionado.peso,
          especie: this.mascotaSeleccionado.especie,
          raza: this.mascotaSeleccionado.raza,
          // idUsuario: this.mascotaSeleccionado.idUsuario
        })
      } else {
        // Crear: limpiar formulario
        this.formMascota.reset()
      }
    }
  }

  guardarMascota() {
    if (this.formMascota.invalid) {
      this.formMascota.markAllAsTouched();
      Swal.fire('Error', 'Por favor, completa los campos obligatorios.', 'warning');
      return;
    }

    // Obtener el ID del usuario logueado
    const usuarioId = this.authService.getUserId();
    if (!usuarioId) {
      Swal.fire('Error', 'No se encontró el ID del usuario. Por favor, inicia sesión nuevamente.', 'error');
      return;
    }

    const request: MascotaRequest = {
    ...this.formMascota.value,
    idUsuario: +usuarioId // convertir a número
  };

  const accion = this.mascotaSeleccionado
    ? this.mascotaService.editarMascota(this.mascotaSeleccionado.idMascota, request)
    : this.mascotaService.agregarMascota(request);

    accion.subscribe({
      next: (mascotaGuardado) => {
        // Mostrar SweetAlert de éxito
        Swal.fire(
          '¡Éxito!',
          `Mascota "${mascotaGuardado.nombre}" se guardó correctamente.`,
          'success'
        )
        this.mascotaCreado.emit()
        this.cerrarModal()
      },
      error: (err) => {
        console.error('Error al guardar mascota:', err);
        Swal.fire(
          'Error',
          'No se pudo guardar la mascota. Revisa los datos e intenta de nuevo.',
          'error'
        )
      }
    })
  }

  cerrarModal(): void {
    const modalElement = document.getElementById('nuevaMascotaModal')
    if (modalElement) {
      const modal = Modal.getInstance(modalElement)
      modal?.hide()
    }
    this.resetFormulario()
  }


  // Metodo para resetear completamente el formulario
  public resetFormulario(): void {
    this.mascotaSeleccionado = null
    this.formMascota.reset()
  }
}
