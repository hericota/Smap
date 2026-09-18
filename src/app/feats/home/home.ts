import { Component } from '@angular/core';
import { Hero } from './hero/hero';
import { Footer } from '../../components/footer/footer';
import { BottomNav } from '../../components/bottom-nav/bottom-nav';
@Component({
  imports: [Hero, Footer, BottomNav],
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {}
