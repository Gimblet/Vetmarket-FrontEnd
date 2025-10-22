import {Component, inject, OnInit, signal} from '@angular/core';
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
import {ActivatedRoute, Router} from '@angular/router';
import {Producto} from '../../interface/producto/Producto';
import {catchError} from 'rxjs';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-actualizar',
  imports: [
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './actualizar.component.html',
  styleUrl: './actualizar.component.scss'
})
export class ActualizarComponent implements OnInit {

  productoService = inject(ProductosService)
  authService = inject(AuthService)

  private activatedRoute = inject(ActivatedRoute);
  productId = signal(0);

  producto = signal<Producto>({} as Producto)

  productoForm = new FormGroup({
    idProducto: new FormControl(-1, Validators.required),
    nombre: new FormControl(this.producto().nombre, Validators.required),
    precio: new FormControl(this.producto().precio, Validators.required),
    stock: new FormControl(this.producto().stock, Validators.required),
    descripcion: new FormControl(this.producto().descripcion, Validators.required),
    imagen: new FormControl(this.producto().imagen, Validators.required),
    idUsuario: new FormControl(0, Validators.required),
  });

  imageFile: File = new File([new Blob([])], '');
  imagePreview: string | ArrayBuffer | null = ''
  rol: string | null = null;

  constructor(
    private location: Location,
    private toastr: ToastrService,
    private router: Router,
    private sanitizer: DomSanitizer,
  ) {
    this.activatedRoute.params.subscribe((params) => {
      this.productId.set(params['id']);
    });
  }

  ngOnInit(): void {
    this.authService.rol$.subscribe((rol) => {
      this.rol = rol;
    });

    if (!this.authService.isAutheticated()) {
      this.router.navigate(['/login']);
    } else if (this.rol !== 'VETERINARIO' || this.rol == null) {
      this.router.navigate(['/']);
    }

    this.obtenerDetalles(this.productId());
  }

  obtenerDetalles(id: number): void {
    this.productoService.obtenerProductoPorID(id)
      .pipe(
        catchError((err) => {
          console.log(err);
          throw err;
        })
      )
      .subscribe((entity: Producto) => {
        this.obtenerImagen(entity);
        this.producto.set(entity);
      })
  }

  obtenerImagen(entity: Producto) {
    this.productoService.obtenerImagenProducto(entity.idProducto)
      .pipe(
        catchError((err) => {
          console.log(err);
          throw err;
        })
      )
      .subscribe((blob: Blob) => {
        const url = URL.createObjectURL(blob);
        entity.imagen = this.sanitizer.bypassSecurityTrustUrl(url);
      });
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

  patchValues() {
    if(this.productoForm.value.nombre == null) {
      this.productoForm.patchValue({
        nombre: this.producto().nombre
      });
    }
    if(this.productoForm.value.precio == null) {
      this.productoForm.patchValue({
        precio: this.producto().precio
      });
    }
    if(this.productoForm.value.stock == null) {
      this.productoForm.patchValue({
        stock: this.producto().stock
      });
    }
    if(this.productoForm.value.descripcion == null) {
      this.productoForm.patchValue({
        descripcion: this.producto().descripcion
      });
    }
    this.productoForm.patchValue({
      idProducto: this.productId(),
      idUsuario: this.producto().idUsuario
    });
  }

  //TODO: Validar correctamente
  actualizar(): void {
    this.patchValues();
    this.productoService.actualizarProducto(this.productoForm, this.imageFile)
      .pipe(
        catchError((err) => {
          console.log(err);
          Swal.fire({
            title: "ERROR AL Actualizar PRODUCTO",
            text: "Por favor intentelo de nuevo. Si el error persiste contacte al administrador del sistema",
            icon: "error",
            confirmButtonText: "Cerrar"
          })
          throw err;
        })
      ).subscribe(resp => {
        this.productoForm.setErrors(null);
        this.toastr.success('Producto actualizado con exito', 'Regresando al listado...');
        setTimeout(() => {
          this.location.back();
        }, 2000);
      }
    );
  }

  retroceder(): void {
    this.location.back();
  }

}
