import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { waitingForConnectionGuard } from './waiting-for-connection.guard';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

export const routes: Routes = [


  { path: '', redirectTo: "/login", pathMatch: 'full' },
  { path: "login", component: LoginComponent },
  {
    path: 'board',
    loadComponent: () => import('./components/board/board.component').then(b => b.BoardComponent),
    canActivate: [waitingForConnectionGuard]
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];
