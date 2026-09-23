import { Component } from '@angular/core';
import { Header } from '../../../component/header/header';
import { RouterLink } from '@angular/router';
import { MapaSeparado } from '../../../components/mapa-separado/mapa-separado';

@Component({
  imports: [Header, RouterLink, MapaSeparado],
  selector: 'app-hero',
  styleUrl: './hero.css',
  templateUrl: './hero.html',
})
export class Hero {}
