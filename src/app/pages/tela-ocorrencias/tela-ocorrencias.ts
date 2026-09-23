import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BottomNav } from '../../components/bottom-nav/bottom-nav';

@Component({
  imports: [RouterLink, BottomNav],
  selector: 'app-tela-ocorrencias',
  styleUrl: './tela-ocorrencias.css',
  templateUrl: './tela-ocorrencias.html',
})
export class TelaOcorrencias {}
