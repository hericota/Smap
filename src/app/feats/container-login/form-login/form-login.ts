import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LoginInterface } from './login-interface';
import { email, form, required, FormField, minLength, maxLength, pattern } from '@angular/forms/signals';
import { min } from 'rxjs';

@Component({
  imports: [RouterLink, FormField],
  selector: 'app-form-login',
  styleUrl: './form-login.css',
  templateUrl: './form-login.html',
})
export class FormLogin {
  loginModel = signal<LoginInterface>({
    email: '',
    password: '',
  });

  private router = inject(Router);

  loginForm = form(this.loginModel, (schemaPath) => {
    required(schemaPath.email, { message: '*' });
    email(schemaPath.email, { message: '*' });
    required(schemaPath.password, { message: '*' });
  });
  fazerLogin(event: SubmitEvent) {
    event.preventDefault();
    if (this.loginForm().invalid()) return;
    else {
      this.router.navigate(['/perfil-usuario']); //pagina principal de perfil do usuario
    }
  }
}
