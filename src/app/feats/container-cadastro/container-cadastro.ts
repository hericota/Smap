import { Component } from '@angular/core';
import { FormCadastro } from './form-cadastro/form-cadastro';
import { RouterLink } from '@angular/router';


@Component({
  imports: [FormCadastro, RouterLink],
  selector: 'app-container-cadastro',
  styleUrl: './container-cadastro.css',
  templateUrl: './container-cadastro.html',
})
export class ContainerCadastro {}
