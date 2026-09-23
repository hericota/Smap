import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CadastroInterface } from './cadastro-interface';
import { email, form, maxLength, minLength, pattern, required } from '@angular/forms/signals';


@Component({
  imports: [RouterLink],
  selector: 'app-form-cadastro',
  styleUrl: './form-cadastro.css',
  templateUrl: './form-cadastro.html',
})
export class FormCadastro {
  cadastroModel = signal<CadastroInterface>({
    nome: '',
    sobreNome: '',
    email: '',
    cpf: '',
    telefone: '',
    cep: '',
    senha: '',
    check: false,
  });

  private router = inject(Router);

  cadastroForm = form(this.cadastroModel, (schemaPath) => {
    required(schemaPath.nome);
    required(schemaPath.sobreNome);
    required(schemaPath.email);
    required(schemaPath.cpf);
    required(schemaPath.telefone);
    required(schemaPath.cep);
    required(schemaPath.senha);
    required(schemaPath.check);
    email(schemaPath.email);
    maxLength(schemaPath.senha, 16, {
      message: '*A senha deve ter no máximo 16 caracteres!',
    });
    minLength(schemaPath.senha, 8, { message: '*Mínimo 8 caracteres!' });
    pattern(schemaPath.senha, /.*[A-Z].*/, {
      message: '*Ao menos 1 letra maiúscula!',
    });
    pattern(schemaPath.senha, /.*\d.*/, {
      message: '*Ao menos 1 número!',
    });
    pattern(schemaPath.senha, /.*[@$!%*?&].*/, {
      message: '*Ao menos 1 caractere especial!',
    });
    pattern(schemaPath.cpf, /^\d{3}\.\d{3}\.\d{3}-\d{2}$/, { message: '*CPF inválido!' });
    pattern(schemaPath.telefone, /^\(\d{2}\)\s\d{4,5}-\d{4}$/, { message: '*Telefone inválido!' });
    pattern(schemaPath.cep, /^\d{5}-\d{3}$/, { message: '*CEP inválido!' });
     
  });

  cadastrar(event: SubmitEvent){
     event.preventDefault();
    if (this.cadastroForm().invalid()) return;
    else {
      this.cadastroForm().reset();
      this.router.navigate(['/perfil-usuario']); //pagina principal de perfil do usuario
      
    }
  }
}
