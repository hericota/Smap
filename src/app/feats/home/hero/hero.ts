import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MapaSeparado } from '../../../components/mapa-separado/mapa-separado';

@Component({
  imports: [RouterLink, MapaSeparado],
  selector: 'app-hero',
  styleUrl: './hero.css',
  templateUrl: './hero.html',
})
export class Hero {}
