import { Routes } from '@angular/router';
import { Header } from './component/header/header';
import { ContainerLogin } from './feats/container-login/container-login';
import { Hero } from './feats/home/hero/hero';
import { Home } from './feats/home/home';
import { ContainerCadastro } from './feats/container-cadastro/container-cadastro';




export const routes: Routes = [
  {path:'header', component:Header},
  {path:'home', component:Home},
  {path:'hero', component:Hero},
  {path: 'login' , component: ContainerLogin},
  {path: 'cadastro' , component: ContainerCadastro},
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'registrar-ocorrencia',
    title: 'Mapa | SMAP',
    loadComponent: () => import('./pages/mapa/mapa').then((m) => m.Mapa),
  },
];
