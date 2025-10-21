import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { NavbarComponent } from './cliente/layout/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'VetMarket';

  private router = inject(Router);
  mostrarMenu: boolean = true;

  constructor() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.mostrarMenu = event.url !== '/login';
      });
  }
}
