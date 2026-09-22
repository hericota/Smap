import { Routes } from '@angular/router';
import { Header } from './component/header/header';
import { ContainerLogin } from './feats/container-login/container-login';
import { Hero } from './feats/home/hero/hero';
import { Home } from './feats/home/home';
import { ContainerCadastro } from './feats/container-cadastro/container-cadastro';

export const routes: Routes = [
  { path: 'header', component: Header },
  { path: 'home', component: Home },
  { path: 'hero', component: Hero },
  { path: 'login', component: ContainerLogin },
  { path: 'cadastro', component: ContainerCadastro },

  { path: '', redirectTo: 'mapa', pathMatch: 'full' },

  {
    path: 'mapa',
    title: 'Mapa | SMAP',
    loadComponent: () =>
      import('./pages/mapa/mapa').then((m) => m.Mapa),
  },

  {
    path: 'admin',
    loadComponent: () =>
      import('./admin/layouts/admin-layout/admin-layout').then(
        (m) => m.AdminLayout,
      ),

    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },

      {
        path: 'dashboard',
        title: 'Visão Geral | SMAP',
        loadComponent: () =>
          import('./admin/pages/dashboard-admin/dashboard-admin').then(
            (m) => m.DashboardAdmin,
          ),
      },

     
      {
        path: 'ocorrencias',
        title: 'Ocorrências | SMAP',
        loadComponent: () =>
          import(
            './admin/pages/ocorrencias-admin/ocorrencias-admin'
          ).then((m) => m.OcorrenciasAdmin),
      },

      
      {
        path: 'mapa',
        title: 'Mapa administrativo | SMAP',
        loadComponent: () =>
          import('./admin/pages/mapa-admin/mapa-admin').then(
            (m) => m.MapaAdmin,
          ),
      },

      
      {
        path: 'regioes',
        title: 'Regiões | SMAP',
        loadComponent: () =>
          import('./admin/pages/regioes-admin/regioes-admin').then(
            (m) => m.RegioesAdmin,
          ),
      },

     
      {
        path: 'configuracoes',
        title: 'Configurações | SMAP',
        loadComponent: () =>
          import(
            './admin/pages/configuracoes-admin/configuracoes-admin'
          ).then((m) => m.ConfiguracoesAdmin),
      },
    ],
  },
];