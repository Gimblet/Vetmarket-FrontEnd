import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './cliente/home/home.component';

export const routes: Routes = [
    // Ruta inicial 
    { path: '', component: HomeComponent },
    // Auth
    { path: 'login', component: LoginComponent }
];
