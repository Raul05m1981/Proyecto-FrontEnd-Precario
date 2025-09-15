import { Routes } from '@angular/router';

export const routes: Routes = [

  // 1) Raíz → Login
  { path: '', pathMatch: 'full', redirectTo: 'auth/login' },

  // 2) Públicas (fuera del layout)
  { path: 'auth/login', loadComponent: () => import('./infrastructure/modules/auth/pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'auth/forgot', loadComponent: () => import('./infrastructure/modules/auth/pages/forgot/forgot.component').then(m => m.ForgotComponent) },
  
  //path: 'home', loadComponent: () => import('./infrastructure/modules/home/pages/home/home.component').then(m => m.HomeComponent) },
  //path: 'civil', loadComponent: () => import('./infrastructure/modules/civil/pages/civil-menu/civil-menu.component').then(m => m.CivilMenuComponent) },
  //path: 'generador', loadComponent: () => import('./infrastructure/modules/generador/pages/generador/generador.component').then(m => m.GeneradorComponent) },
  //path: 'bandeja', loadComponent: () => import('./infrastructure/modules/bandeja/pages/bandeja/bandeja.component').then(m => m.BandejaComponent) },
  
  // 3) Layout + páginas internas
  {
    path: '',
    loadComponent: () => import('./infrastructure/layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      { path: 'home',       loadComponent: () => import('./infrastructure/modules/home/pages/home/home.component').then(m => m.HomeComponent) },
      { path: 'generador',  loadComponent: () => import('./infrastructure/modules/generador/pages/generador/generador.component').then(m => m.GeneradorComponent) },
      { path: 'bandeja',    loadComponent: () => import('./infrastructure/modules/bandeja/pages/bandeja/bandeja.component').then(m => m.BandejaComponent) },
      // (Opcional) ruta /civil para abrir una página/landing del módulo civil
      { path: 'civil',      loadComponent: () => import('./infrastructure/modules/civil/pages/civil-menu/civil-menu.component').then(m => m.CivilMenuComponent) },
    ]
  },

  // Redirect raíz
  { path: '', pathMatch: 'full', redirectTo: 'auth/login' },

  // 4) 404
  { path: '**', loadComponent: () => import('./infrastructure/shared/pages/not-found/not-found.component').then(m => m.NotFoundComponent) }
];
