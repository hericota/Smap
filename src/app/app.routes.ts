import { Routes } from '@angular/router';
import { Header } from './component/header/header';

export const routes: Routes = [
    {path:'header', component:Header},
  { path: '', redirectTo: 'mapa', pathMatch: 'full' },
  {
    path: 'mapa',
    title: 'Mapa | SMAP',
    loadComponent: () => import('./pages/mapa/mapa').then((m) => m.Mapa),
  },
];
