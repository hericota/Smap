import { Routes } from '@angular/router';
import { Header } from './component/header/header';
import { ContainerLogin } from './feats/container-login/container-login';
import { Hero } from './feats/home/hero/hero';


export const routes: Routes = [
  {path:'header', component:Header},
  {path:'hero', component:Hero},
  {path: 'login' , component: ContainerLogin},
  { path: '', redirectTo: 'mapa', pathMatch: 'full' },
  {
    path: 'mapa',
    title: 'Mapa | SMAP',
    loadComponent: () => import('./pages/mapa/mapa').then((m) => m.Mapa),
  },
];
