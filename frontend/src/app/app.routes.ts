import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login';
import { LayoutComponent } from './features/main/layout';
import { GruposListComponent } from './features/grupos/grupos-list/grupos-list';
import { GruposFormComponent } from './features/grupos/grupos-form/grupos-form';
import { GruposDetailComponent } from './features/grupos/grupos-detail/grupos-detail';
import { DeudoresListComponent } from './features/deudores/deudores-list/deudores-list';
import { PerfilComponent } from './features/perfil/perfil';
import { UsuariosListComponent } from './features/usuarios/usuarios-list/usuarios-list';
import { UsuariosFormComponent } from './features/usuarios/usuarios-form/usuarios-form';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'grupos', pathMatch: 'full' },
      { path: 'grupos', component: GruposListComponent },
      { path: 'grupos/nuevo', component: GruposFormComponent },
      { path: 'grupos/:id', component: GruposDetailComponent },
      { path: 'grupos/:id/editar', component: GruposFormComponent },
      { path: 'usuarios', component: UsuariosListComponent },
      { path: 'usuarios/nuevo', component: UsuariosFormComponent },
      { path: 'deudores', component: DeudoresListComponent },
      { path: 'perfil', component: PerfilComponent },
    ],
  },
];
