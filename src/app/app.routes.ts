import { Routes } from '@angular/router';
import { Header } from './component/header/header';
import { ContainerLogin } from './feats/container-login/container-login';
import { Hero } from './feats/home/hero/hero';
import { Home } from './feats/home/home';
import { FormCadastro } from './feats/form-cadastro/form-cadastro';




export const routes: Routes = [
  {path:'header', component:Header},
  {path:'home', component:Home},
  {path:'hero', component:Hero},
  {path: 'login' , component: ContainerLogin},
  {path: 'cadastro' , component: FormCadastro},
  { path: '', redirectTo: 'mapa', pathMatch: 'full' },
  {
    path: 'mapa',
    title: 'Mapa | SMAP',
    loadComponent: () => import('./pages/mapa/mapa').then((m) => m.Mapa),
  },
];
