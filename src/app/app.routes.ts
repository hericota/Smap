import { Routes } from '@angular/router';
import { Header } from './component/header/header';
import { ContainerLogin } from './feats/container-login/container-login';
import { Hero } from './feats/home/hero/hero';
import { Home } from './feats/home/home';
import { ContainerCadastro } from './feats/container-cadastro/container-cadastro';
import { ConfirmacaoPost } from './feats/posts/confirmacao-post/confirmacao-post';
import { MapaSeparado } from './components/mapa-separado/mapa-separado';
import { ProfileHome } from './feats/profile user/profile-home/profile-home';
import { ProfileConfig } from './feats/profile user/profile-config/profile-config';
import { TelaOcorrencias } from './pages/tela-ocorrencias/tela-ocorrencias';
import { OcorrenciasRegistradas } from './feats/ocorrencias-registradas/ocorrencias-registradas';


export const routes: Routes = [
  {path:'header', component:Header},
  {path:'home', component:Home},
  {path:'hero', component:Hero},
  {path: 'login' , component: ContainerLogin},
  {path: 'perfil-usuario' , component: ProfileHome},
  {path: 'perfil-config' , component: ProfileConfig},
  {path: 'cadastro' , component: ContainerCadastro},
  {path:'ocorrenciasRegistrada', component:OcorrenciasRegistradas},
  {path:'confirmacao-ocorrencia/:id' , component:ConfirmacaoPost},
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'registrar-ocorrencia',
    title: 'Mapa | SMAP',
    loadComponent: () =>
      import('./pages/mapa/mapa').then((m) => m.Mapa)
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
        path: 'ocorrencias/:codigo',
        title: 'Detalhe da ocorrência | SMAP',
        loadComponent: () =>
          import(
            './admin/pages/ocorrencia-detalhe-admin/ocorrencia-detalhe-admin'
          ).then((m) => m.OcorrenciaDetalheAdmin),
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
  {path:'ocorrencias', component: TelaOcorrencias},
  {path:"mapa-separado", component:MapaSeparado}
];