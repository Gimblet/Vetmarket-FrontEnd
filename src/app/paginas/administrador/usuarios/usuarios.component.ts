import { Component } from '@angular/core';
import { Usuario } from '../../../interface/Usuario/Usuario';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../../services/usuario.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

declare var bootstrap: any;

@Component({
  selector: 'app-usuarios',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export default class UsuariosComponent {

  usuarios: Usuario[] = [];
  formUsuario!: FormGroup;
  cargando = false;
  mostrandoFormulario = false;
  editandoUsuario: Usuario | null = null;
  modalUsuario: any;

  tipoUsuarioRegistro: 'cliente' | 'veterinario' = 'cliente';

  constructor(private usuarioService: UsuarioService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.cargarUsuarios();
    this.crearFormulario();
  }

  cargarUsuarios() {
    this.usuarioService.listarUsuarios().subscribe({
      next: data => this.usuarios = data,
      error: err => console.error(err)
    });
  }

  crearFormulario() {
    this.formUsuario = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      numeroDocumento: ['', Validators.required],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      ruc: [''],
      username: ['', Validators.required],
      password: ['']
    });
  }

  abrirModal(usuario?: Usuario) {
    this.editandoUsuario = usuario || null;
    if (usuario) {
      this.tipoUsuarioRegistro = usuario.rol?.idRol === 2 ? 'veterinario' : 'cliente';
      this.formUsuario.patchValue({...usuario, password: ''});
    } else {
      this.tipoUsuarioRegistro = 'cliente';
      this.formUsuario.reset();
    }

    if (!this.modalUsuario) {
      const modalEl = document.getElementById('usuarioModal');
      this.modalUsuario = new bootstrap.Modal(modalEl);
    }
    this.modalUsuario.show();
  }

  cerrarModal() {
    if (this.modalUsuario) this.modalUsuario.hide();
  }

  guardarUsuario() {
    if (this.tipoUsuarioRegistro === 'veterinario' && !this.formUsuario.value.ruc) {
      Swal.fire('Error', 'El RUC es obligatorio para veterinario', 'warning');
      return;
    }

    if (this.formUsuario.invalid) {
      Swal.fire('Error', 'Complete los campos obligatorios', 'warning');
      return;
    }

    const usuario: Usuario = { 
      ...this.editandoUsuario, 
      ...this.formUsuario.value 
    };

    this.cargando = true;

    if (this.editandoUsuario) {
      if (!usuario.password) delete usuario.password;

      this.usuarioService.actualizarUsuario(usuario).subscribe({
        next: () => {
          this.cargando = false;
          Swal.fire('Éxito', 'Usuario actualizado', 'success');
          this.cerrarModal();
          this.cargarUsuarios();
        },
        error: (err) => {
          this.cargando = false;
          Swal.fire('Error', err.error?.message || 'No se pudo actualizar', 'error');
        }
      });
    } else {
      this.usuarioService.crearUsuario(usuario).subscribe({
        next: () => {
          this.cargando = false;
          Swal.fire('Éxito', 'Usuario creado', 'success');
          this.cerrarModal();
          this.cargarUsuarios();
        },
        error: (err) => {
          this.cargando = false;
          Swal.fire('Error', err.error?.message || 'No se pudo crear', 'error');
        }
      });
    }
  }

  eliminarUsuario(usuario: Usuario) {
    Swal.fire({
      title: '¿Desea eliminar al usuario?',
      text: usuario.nombre + ' ' + usuario.apellido,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.eliminarUsuario(usuario.idUsuario).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'Usuario eliminado correctamente', 'success');
            this.cargarUsuarios();
          },
          error: () => Swal.fire('Error', 'No se pudo eliminar', 'error')
        });
      }
    });
  }

}
