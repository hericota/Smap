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
    required(schemaPath.email, { message: '*obrigatório!' });
    email(schemaPath.email, { message: '*Insira um email válido!' });
    required(schemaPath.password, { message: '*obrigatório!' });
    maxLength(schemaPath.password, 16, { 
  message: '*A senha deve ter no máximo 16 caracteres!' 
});
    // pattern(schemaPath.password, /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    //   message:
    //     '*Mínimo 8 caracteres, 1 letra maiúscula, 1 número e 1 caractere especial!',
    // });
    minLength(schemaPath.password, 8, { message: '*Mínimo 8 caracteres!' })
     pattern(schemaPath.password, /.*[A-Z].*/, {
      message: '*Ao menos 1 letra maiúscula!',
    });

    pattern(schemaPath.password, /.*\d.*/, {
      message: '*Ao menos 1 número!',
    });

    pattern(schemaPath.password, /.*[@$!%*?&].*/, {
      message: '*Ao menos 1 caractere especial!',
    });
  
  });
  fazerLogin(event: SubmitEvent) {
    event.preventDefault();
    if (this.loginForm().invalid()) return;
    else {
      this.router.navigate(['/perfil-usuario']); //pagina principal de perfil do usuario
    }
  }
}
