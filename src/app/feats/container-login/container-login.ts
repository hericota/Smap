import { Component } from '@angular/core';
import { FormLogin } from './form-login/form-login';
import { RouterLink } from '@angular/router';

@Component({
  imports: [FormLogin, RouterLink],
  selector: 'app-container-login',
  styleUrl: './container-login.css',
  templateUrl: './container-login.html',
})
export class ContainerLogin {}
