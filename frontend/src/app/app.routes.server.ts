import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'login',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'grupos/nuevo',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'usuarios/nuevo',
    renderMode: RenderMode.Prerender
  },
  {
    path: '**',
    renderMode: RenderMode.Server
  }
];
