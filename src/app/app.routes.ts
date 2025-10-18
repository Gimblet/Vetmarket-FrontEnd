import {Routes} from '@angular/router';
import {ProductoComponent} from './producto/producto.component'
import {LoginComponent} from './auth/login/login.component';
import {HomeComponent} from './cliente/home/home.component';

export const routes: Routes = [
  // Ruta inicial
  {
    path: '',
    component: HomeComponent
  },
  // Auth
  {
    path: 'login',
    component: LoginComponent
  },
  // Producto
  {
    path: 'producto',
    component: ProductoComponent
  }
];
