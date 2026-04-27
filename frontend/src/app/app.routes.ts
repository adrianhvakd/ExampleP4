import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login';
import { DashboardComponent } from './features/dashboard/dashboard';
import { LayoutComponent } from './features/main/layout';
import { authGuard } from './core/guards/authGuards';
import { JardinComponent } from './features/jardin/jardin';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'jardin',
        component: JardinComponent,
      },
    ],
  },
];
