import {Component, inject, OnInit} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {ProductosService} from '../../services/Producto/productos.service';
import {Location} from '@angular/common';
import {ToastrService} from 'ngx-toastr';
import Swal from 'sweetalert2';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-agregar',
  imports: [
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './agregar.component.html',
  styleUrl: './agregar.component.scss'
})

export class AgregarComponent implements OnInit {
  productoService = inject(ProductosService)
  authService = inject(AuthService)

  productoForm = new FormGroup({
    nombre: new FormControl('', Validators.required),
    precio: new FormControl('', Validators.required),
    stock: new FormControl('', Validators.required),
    descripcion: new FormControl('', Validators.required),
    idUsuario: new FormControl('', Validators.required),
  });

  imageFile: File = new File([new Blob([])], '');
  imagePreview: string | ArrayBuffer | null = ''
  rol: string | null = null;

  constructor(
    private location: Location,
    private toastr: ToastrService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.authService.rol$.subscribe((rol) => {
      this.rol = rol;
    });

    if(!this.authService.isAutheticated()) {
      this.router.navigate(['/login']);
    } else if(this.rol !== 'VETERINARIO' || this.rol == null ) {
      this.router.navigate(['/']);
    }

    this.productoForm.controls['idUsuario'].setValue(this.authService.getUserId());

  }

  // @ts-ignore
  onFileSelected(event) {
    this.imageFile = event.target.files[0];
    {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.imagePreview = reader.result;

      reader.readAsDataURL(file);
    }
  }

  //TODO: Validar correctamente
  guardar(): void {
    this.productoService.guardarProducto(this.productoForm, this.imageFile)
      .subscribe(resp => {
          this.productoForm.reset();
          this.productoForm.setErrors(null);
          this.toastr.success('Producto Agregado con exito', 'Regresando al listado...');
          setTimeout(() => {
            this.location.back();
          }, 2000);
        },
        error => {
          console.error(error);
          Swal.fire({
            title: "ERROR AL AGREGAR PRODUCTO",
            text: "Por favor intentelo de nuevo. Si el error persiste contacte al administrador del sistema",
            icon: "error",
            confirmButtonText: "Cerrar"
          })
        }
      );
  }

  retroceder(): void {
    this.location.back();
  }

}
