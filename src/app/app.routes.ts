import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [


    { path: '', redirectTo: "/login", pathMatch: 'full' },
    { path: "login", component: LoginComponent },
  
    {
      path: 'board',
      loadComponent: () => import('./components/board/board.component').then(b => b.BoardComponent)
    },

];
