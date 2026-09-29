import { Component, inject, signal } from '@angular/core';
import { LoginInterface } from '../../../../feats/container-login/form-login/login-interface';
import { UserService } from '../../../../feats/profile user/user-service/user-service';
import { Router } from '@angular/router';
import { email, form, required, FormField } from '@angular/forms/signals';

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
    required(schemaPath.senha, { message: '*' });
  });

  fazerLogin(event: SubmitEvent) {
    event.preventDefault();
    if (this.loginForm().invalid()) return;
   
    const resultado = this.usuarioService.login(
      this.loginModel().email,
      this.loginModel().senha
    )
    if (resultado){this.router.navigate(['/perfil-usuario']);}//pagina principal de perfil do usuario
  }
}
