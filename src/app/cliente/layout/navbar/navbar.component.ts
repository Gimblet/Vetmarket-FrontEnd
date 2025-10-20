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

  constructor(private authService: AuthService,private router: Router) {}

  ngOnInit(): void {
    if (this.isAuthenticated()) {
      this.rol = localStorage.getItem('rol');
    } else {
      this.rol = null;
    }
  }

  isAuthenticated(): boolean {
    return this.authService.isAutheticated()
  }

  logout(): void {
    this.authService.logout()
    this.router.navigate(['/login']);
  }

}
