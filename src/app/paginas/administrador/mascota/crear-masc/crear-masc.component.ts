import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Mascota } from '../../../../interface/Mascota/Mascota';

@Component({
  selector: 'app-crear-masc',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crear-masc.component.html',
  styleUrl: './crear-masc.component.scss'
})
export class CrearMascComponent implements OnInit{
  @Input() mascotaSeleccionado: Mascota | null = null
  @Output() mascotaCreado = new EventEmitter<void>()

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

}
