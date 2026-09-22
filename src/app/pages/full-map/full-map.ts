import { Component } from '@angular/core';
import { MapaSeparado } from '../../components/mapa-separado/mapa-separado';
import { BottomNav } from '../../components/bottom-nav/bottom-nav';

@Component({
  imports: [MapaSeparado, BottomNav],
  selector: 'app-full-map',
  styleUrl: './full-map.css',
  templateUrl: './full-map.html',
})
export class FullMap {}
