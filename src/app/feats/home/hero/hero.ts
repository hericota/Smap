import { Component } from '@angular/core';
import { Header } from '../../../component/header/header';
import { RouterLink } from '@angular/router';

@Component({
  imports: [Header, RouterLink],
  selector: 'app-hero',
  styleUrl: './hero.css',
  templateUrl: './hero.html',
})
export class Hero {}
