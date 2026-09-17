
import { Routes } from '@angular/router';
import { ContainerLogin } from './feats/container-login/container-login';


export const routes: Routes = [
     {path: 'login' , component: ContainerLogin},
  { path: '', redirectTo: 'mapa', pathMatch: 'full' },
  {
    path: 'mapa',
    title: 'Mapa | SMAP',
    loadComponent: () => import('./pages/mapa/mapa').then((m) => m.Mapa),
  },
];
