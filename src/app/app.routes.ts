import { Routes } from '@angular/router';
import { Header } from './component/header/header';
import { ContainerLogin } from './feats/container-login/container-login';
import { Hero } from './feats/home/hero/hero';
import { Home } from './feats/home/home';
import { ContainerCadastro } from './feats/container-cadastro/container-cadastro';
import { ConfirmacaoPost } from './feats/posts/confirmacao-post/confirmacao-post';
import { ProfileHome } from './feats/profile user/profile-home/profile-home';
import { ProfileConfig } from './feats/profile user/profile-config/profile-config';
import { TelaOcorrencias } from './pages/tela-ocorrencias/tela-ocorrencias';
import { OcorrenciasRegistradas } from './feats/ocorrencias-registradas/ocorrencias-registradas';
import { DetalheOcorrecia } from './feats/detalhe-ocorrecia/detalhe-ocorrecia';
import { FullMap } from './pages/full-map/full-map';
import { LoginComponente } from './admin/pages/login-componente/login-componente';

export const routes: Routes = [
  { path: 'home', component: Home },
  { path: 'header', component: Header },
  { path: 'hero', component: Hero },
  { path: 'login', component: ContainerLogin },
  { path: 'loginAdmin', component: LoginComponente },
  { path: 'perfil-usuario', component: ProfileHome },
  { path: 'perfil-config', component: ProfileConfig },
  { path: 'cadastro', component: ContainerCadastro },
  { path: 'confirmacao-ocorrencia', component: ConfirmacaoPost },
  { path: 'ocorrenciasRegistrada', component: OcorrenciasRegistradas },
  { path: 'detalheOcorrencia/:id', component: DetalheOcorrecia },
  { path: 'confirmacao-ocorrencia/:id', component: ConfirmacaoPost },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'registrar-ocorrencia',
    title: 'Mapa | SMAP',
    loadComponent: () => import('./pages/mapa/mapa').then((m) => m.Mapa),
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./admin/layouts/admin-layout/admin-layout').then((m) => m.AdminLayout),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        title: 'Visão Geral | SMAP',
        loadComponent: () =>
          import('./admin/pages/dashboard-admin/dashboard-admin').then((m) => m.DashboardAdmin),
      },
      {
        path: 'ocorrencias',
        title: 'Ocorrências | SMAP',
        loadComponent: () =>
          import('./admin/pages/ocorrencias-admin/ocorrencias-admin').then((m) => m.OcorrenciasAdmin),
      },
      {
        path: 'ocorrencias/:id',
        title: 'Detalhe da ocorrência | SMAP',
        loadComponent: () =>
          import('./admin/pages/ocorrencia-detalhe-admin/ocorrencia-detalhe-admin').then(
            (m) => m.OcorrenciaDetalhes,
          ),
      },
      {
        path: 'mapa',
        title: 'Mapa administrativo | SMAP',
        loadComponent: () =>
          import('./admin/pages/mapa-admin/mapa-admin').then((m) => m.MapaAdmin),
      },
      {
        path: 'regioes',
        title: 'Regiões | SMAP',
        loadComponent: () =>
          import('./admin/pages/regioes-admin/regioes-admin').then((m) => m.RegioesAdmin),
      },
      {
        path: 'configuracoes',
        title: 'Configurações | SMAP',
        loadComponent: () =>
          import('./admin/pages/configuracoes-admin/configuracoes-admin').then(
            (m) => m.ConfiguracoesAdmin,
          ),
      },
    ],
  },
  { path: 'ocorrencias', component: TelaOcorrencias },
  { path: 'mapa', component: FullMap },
];
