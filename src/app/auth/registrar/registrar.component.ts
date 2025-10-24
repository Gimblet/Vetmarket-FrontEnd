import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Usuario } from '../../interface/Usuario/Usuario';

@Component({
  selector: 'app-registrar',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registrar.component.html',
  styleUrl: './registrar.component.scss'
})
export default class RegistrarComponent {

  formUsuario!: FormGroup;
  cargando = false;
  tipoUsuario: 'cliente' | 'veterinario' = 'cliente';

  constructor(
    private fb: FormBuilder,
    private serv: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.formUsuario = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      numeroDocumento: ['', Validators.required],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      ruc: [''],
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  seleccionarTipo(tipo: 'cliente' | 'veterinario') {
    this.tipoUsuario = tipo;

    if (tipo === 'veterinario') {
      this.formUsuario.get('ruc')?.setValidators([Validators.required]);
    } else {
      this.formUsuario.get('ruc')?.clearValidators();
      this.formUsuario.get('ruc')?.setValue('');
    }

    this.formUsuario.get('ruc')?.updateValueAndValidity();
  }

  registrarUsuario() {
    if (this.formUsuario.invalid) {
      Swal.fire('Error', 'Complete los campos obligatorios', 'warning');
      return;
    }

    const usuario: Partial<Usuario> = {
      nombre: this.formUsuario.value.nombre,
      apellido: this.formUsuario.value.apellido,
      numeroDocumento: this.formUsuario.value.numeroDocumento,
      telefono: this.formUsuario.value.telefono,
      direccion: this.formUsuario.value.direccion,
      correo: this.formUsuario.value.correo,
      username: this.formUsuario.value.username,
      password: this.formUsuario.value.password,
      ruc: this.tipoUsuario === 'veterinario' ? this.formUsuario.value.ruc : undefined
    };

    this.cargando = true;

    this.serv.crearUsuario(usuario as Usuario).subscribe({
      next: data => {
        this.cargando = false;
        Swal.fire('Éxito', 'Usuario registrado correctamente', 'success');
        this.router.navigate(['/login']);
      },
      error: err => {
        this.cargando = false;
        console.error('Error al registrar usuario:', err);
        const msg = err.error?.message || 'No se pudo registrar el usuario';
        Swal.fire('Error', msg, 'error');
      }
    });
  }

  volverLogin() {
    this.router.navigate(['/login']); 
  }

}
