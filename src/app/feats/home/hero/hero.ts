import { Component } from '@angular/core';
import { Header } from '../../../component/header/header';

@Component({
  imports: [Header],
  selector: 'app-hero',
  styleUrl: './hero.css',
  templateUrl: './hero.html',
})
export class Hero {}
