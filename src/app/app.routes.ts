import { Routes } from '@angular/router';
import { Header } from './component/header/header';
import { ContainerLogin } from './feats/container-login/container-login';
import { Hero } from './feats/home/hero/hero';
import { Home } from './feats/home/home';


export const routes: Routes = [
  {path: 'login' , component: ContainerLogin, title:"login"},
  {path:"home", component:Home, title:"Home"},
  {path: 'mapa', title: 'Mapa',loadComponent: () => import('./pages/mapa/mapa').then((m) => m.Mapa),},
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];
