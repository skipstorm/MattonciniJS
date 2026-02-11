import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  
  {
    path: 'home',
    loadComponent: () => import('./builder/pages/home.component')
      .then(m => m.HomeComponent)
  },
  {
    path: 'editor',
    loadComponent: () => import('./builder/pages/editor.component')
      .then(m => m.EditorComponent)
  },
  {
    path: 'editor/:templateId',
    loadComponent: () => import('./builder/pages/editor.component')
      .then(m => m.EditorComponent)
  },

  { path: '**', redirectTo: '/home' }
];