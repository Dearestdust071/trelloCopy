import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WebsocketsService } from '../service/websockets.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { AutoFocusModule } from 'primeng/autofocus';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, Toast, AutoFocusModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [MessageService]
})
export class LoginComponent {
  username: string = '';

  constructor(private ws: WebsocketsService, private router: Router, private messageService: MessageService) {
    this.ws.CloseConn()
    localStorage.removeItem("token_Trello")
    this.router.navigate(['/login'])
   }

  onSubmit() {
    if (this.username.trim()) {
      try {
        this.ws.Connect(this.username);
      } catch (error) {
        console.log(error)
        //Esto no funciona :( no puedo activarlo con el try para que mande un toast)
        this.messageService.add({ severity: 'warn', summary: 'Error!', detail: `No se pudo conectar con el servidor!` });
      }
      localStorage.setItem("token_Trello", this.username)
      this.router.navigate(['/board'])
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Error!', detail: `Ingrese su nombre en el login` });
    }
  }
}
