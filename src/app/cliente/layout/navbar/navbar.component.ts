import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  rol: string | null = null;
  currentYear = new Date().getFullYear();

  constructor(private authService: AuthService,private router: Router) {}

  ngOnInit(): void {
    if (this.isAuthenticated()) {
      this.authService.rol$.subscribe((rol) => {
        this.rol = rol;
      });
    } else {
      this.rol = null;
    }
  }

  loginSuccessHandler(rol: string) {
  this.authService.setRol(rol);
}

  isAuthenticated(): boolean {
    return this.authService.isAutheticated()
  }

  logout(): void {
    this.authService.logout()
    this.router.navigate(['/login']);
  }

  sidebarClass(): string {
    if (!this.rol) return 'bg-warning'; 
    if (this.rol === 'CLIENTE') return 'bg-primary';
    if (this.rol === 'VETERINARIO') return 'bg-info'; 
    if (this.rol === 'ADMIN') return 'bg-success'; 
    return 'bg-secondary';
  }

  navbarClass(): string {
    // mismo color que sidebar pero más oscuro
    if (!this.rol) return 'bg-warning';
    if (this.rol === 'CLIENTE') return 'bg-primary';
    if (this.rol === 'VETERINARIO') return 'bg-info';
    if (this.rol === 'ADMIN') return 'bg-success';
    return 'bg-secondary';
  }


}
