import { Component, inject, signal } from '@angular/core';
import { LoginInterface } from '../../../../feats/container-login/form-login/login-interface';
import { UserService } from '../../../../feats/profile user/user-service/user-service';
import { Router } from '@angular/router';
import { email, form, required, FormField, maxLength, minLength, pattern } from '@angular/forms/signals';

@Component({
  imports: [FormField],
  selector: 'app-login-form',
  styleUrl: './login-form.css',
  templateUrl: './login-form.html',
})
export class LoginForm {
  loginModel = signal<LoginInterface>({
    email: '',
    senha: '',
  });

  private usuarioService = inject(UserService);
  private router = inject(Router);

  loginForm = form(this.loginModel, (schemaPath) => {
    required(schemaPath.email, { message: '*' });
    email(schemaPath.email, { message: '*' });
  

    maxLength(schemaPath.senha, 16, { message: '*A senha deve ter no máximo 16 caracteres!' });
    minLength(schemaPath.senha, 8, { message: '*Mínimo 8 caracteres!' });
    pattern(schemaPath.senha, /.*[A-Z].*/, { message: '*Ao menos 1 letra maiúscula!' });
    pattern(schemaPath.senha, /.*\d.*/, { message: '*Ao menos 1 número!' });
    pattern(schemaPath.senha, /.*[@$!%*?&].*/, { message: '*Ao menos 1 caractere especial!' });
  });

  fazerLogin(event: SubmitEvent) {
    event.preventDefault();
    if (this.loginForm().invalid()) return;
   
    const resultado = this.usuarioService.login(
      this.loginModel().email,
      this.loginModel().senha
    )
    if (resultado){this.router.navigate(['/admin']);}
  }
}
