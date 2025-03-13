import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WebsocketsService } from '../service/websockets.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';

  constructor(private ws: WebsocketsService, private router:Router) {}

  onSubmit() {
    if (this.username.trim()) {
      this.ws.Connect(this.username);
      console.log(`Usuario ingresado: ${this.username}`);
      this.router.navigate(['/board'])
    } else {
      console.log('Nombre de usuario vacío');
    }
  }
}
