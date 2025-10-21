import { Component } from '@angular/core';
import { NavbarComponent } from "../layout/navbar/navbar.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [NavbarComponent, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
