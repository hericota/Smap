import { Component } from '@angular/core';
import { FormCadastro } from './form-cadastro/form-cadastro';
import { RouterLink } from '@angular/router';
import { inject } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  imports: [FormCadastro, RouterLink],
  selector: 'app-container-cadastro',
  styleUrl: './container-cadastro.css',
  templateUrl: './container-cadastro.html',
})
export class ContainerCadastro {
  private location = inject(Location);
  voltar() {
  this.location.back();
}
}
