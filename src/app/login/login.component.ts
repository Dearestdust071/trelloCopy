import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'
@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  username: string = '';

  onSubmit() {
    if (this.username.trim()) {
      console.log(`Usuario ingresado: ${this.username}`);
      // Aquí iría la lógica para redirigir a la aplicación o realizar alguna acción
    } else {
      console.log("Nombre de usuario vacío");
    }
  }

}
