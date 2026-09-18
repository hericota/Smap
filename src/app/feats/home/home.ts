import { Component } from '@angular/core';
import { Footer } from '../../components/footer/footer';
import { Header } from '../../component/header/header';
import { Hero } from './hero/hero';

@Component({
  imports: [Footer, Header, Hero],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {}
