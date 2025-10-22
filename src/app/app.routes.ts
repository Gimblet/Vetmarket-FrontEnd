import {Routes} from '@angular/router';
import {ProductoComponent} from './producto/producto.component'
import {LoginComponent} from './auth/login/login.component';
import {DetallesComponent} from './producto/detalles/detalles.component';
import {AgregarComponent} from './producto/agregar/agregar.component';
import {ProductosComponent} from './paginas/veterinarios/productos/productos.component';
import {ActualizarComponent} from './producto/actualizar/actualizar.component';
import { ListaMascComponent } from './paginas/administrador/mascota/lista-masc/lista-masc.component';

export const routes: Routes = [

  // Auth
  { path: 'login', component: LoginComponent },
  // Producto -- Producto sera la ruta inicial
  {
    path: 'producto',
    children: [
      {
        path: '',
        component: ProductoComponent
      },
      {
        path: 'agregar',
        component: AgregarComponent
      },
      {
        path: 'actualizar/:id',
        component: ActualizarComponent
      },
      {
        path: ':id',
        component: DetallesComponent
      },

    ]
  },
  // AgendarCita
  {
    path: 'agendarCita',
    loadComponent: () => import('./paginas/clientes/agendar-cita/agendar-cita.component')
  },
  // OrdenCompra - Cliente
  {
    path: 'ordenCompra',
    loadComponent: () => import('./paginas/clientes/orden-compra/orden-compra.component')
  },
  {
    path: 'misproductos',
    component: ProductosComponent,
  },
  // Ventas  - Veterinarios
  {
    path: 'misventas',
    loadComponent: () => import('./paginas/veterinarios/ventas/ventas.component')
  },
  // Ordenes de comrpa - Admin
  {
    path: 'ordenes',
    loadComponent: () => import('./paginas/administrador/ordenes/ordenes.component')
  },
  // Listar mascotas - Admin
  { path: 'mascotas', component: ListaMascComponent}
];
