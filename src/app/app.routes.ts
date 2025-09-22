import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: '',
    loadComponent: () => import('./components/layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'assistidos',
        loadComponent: () => import('./components/assistidos/assistido-list/assistido-list.component').then(m => m.AssistidoListComponent)
      },
      {
        path: 'assistidos/novo',
        loadComponent: () => import('./components/assistidos/assistido-form/assistido-form.component').then(m => m.AssistidoFormComponent)
      },
      {
        path: 'assistidos/editar/:id',
        loadComponent: () => import('./components/assistidos/assistido-form/assistido-form.component').then(m => m.AssistidoFormComponent)
      },
      {
        path: 'calendario',
        loadComponent: () => import('./components/calendario/calendario.component').then(m => m.CalendarioComponent)
      },
      {
        path: 'usuarios',
        loadComponent: () => import('./components/usuarios/usuario-list/usuario-list.component').then(m => m.UsuarioListComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
