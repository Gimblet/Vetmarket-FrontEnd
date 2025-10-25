import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServiciosService } from '../../../../services/servicios.service';
import Swal from 'sweetalert2';
import { ServicioResponseDTO } from '../../../../interface/Servicio/Servicio';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-crear-servicio',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crear-servicio.component.html',
  styleUrls: ['./crear-servicio.component.scss']
})
export class CrearServicioComponent implements OnInit {
  @Input() servicioSeleccionado: ServicioResponseDTO | null = null;
  @Output() servicioGuardado = new EventEmitter<void>(); //


  formServicio: FormGroup;
  selectedFile: File | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private serviciosService: ServiciosService
  ) {
    this.formServicio = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      precio: [null, [Validators.required, Validators.min(0.01)]],
      descripcion: ['']
    });
  }

  ngOnInit(): void {
    // Inicialización básica (aunque ngOnChanges hará el trabajo principal)
  }

  // 👇 Este método se ejecuta cada vez que cambia @Input()
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['servicioSeleccionado'] && this.servicioSeleccionado) {
      this.formServicio.patchValue({
        nombre: this.servicioSeleccionado.nombre || '',
        precio: this.servicioSeleccionado.precio || null,
        descripcion: this.servicioSeleccionado.descripcion || ''
      });
      // Resetear archivo seleccionado (no se precarga imagen)
      this.selectedFile = null;
    } else if (!this.servicioSeleccionado) {
      this.formServicio.reset();
      this.selectedFile = null;
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  guardarServicio(): void {
    if (this.formServicio.invalid) {
      this.formServicio.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const formData = new FormData();
    formData.append('nombre', this.formServicio.get('nombre')?.value);
    formData.append('descripcion', this.formServicio.get('descripcion')?.value);
    formData.append('precio', this.formServicio.get('precio')?.value.toString());
    const usuarioId = 1; // 🔥 Reemplaza con el ID real del usuario autenticado
    formData.append('usuarioId', usuarioId.toString());

    if (this.selectedFile) {
      formData.append('img', this.selectedFile);
    }

    const request$ = this.servicioSeleccionado
      ? this.serviciosService.editarServicioConImagen(this.servicioSeleccionado.idServicio, formData)
      : this.serviciosService.agregarServicioConImagen(formData);

    request$.pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: () => {
        const mensaje = this.servicioSeleccionado ? 'actualizado' : 'creado';
        Swal.fire('¡Éxito!', `Servicio ${mensaje} correctamente.`, 'success');
        this.resetFormulario();
        this.servicioGuardado.emit(); // Notifica al padre
      },
      error: (err) => {
        console.error('Error al guardar el servicio:', err);
        Swal.fire('Error', 'No se pudo guardar el servicio.', 'error');
      }
    });
  }

  resetFormulario(): void {
    this.formServicio.reset();
    this.selectedFile = null;
    this.servicioSeleccionado = null;
    this.formServicio.markAsPristine();
    this.formServicio.markAsUntouched();
  }
}
