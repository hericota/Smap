import { Component } from '@angular/core';
import { FormLogin } from './form-login/form-login';

@Component({
  imports: [FormLogin],
  selector: 'app-container-login',
  styleUrl: './container-login.css',
  templateUrl: './container-login.html',
})
export class ContainerLogin {}
