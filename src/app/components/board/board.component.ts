import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { CommonModule, JsonPipe } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { AvatarModule } from 'primeng/avatar'; import { WebsocketsService } from '../../service/websockets.service';
import { AvatarGroup } from 'primeng/avatargroup';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { DatePickerModule } from 'primeng/datepicker';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
interface Talk {
  text: string;
}

interface Track {
  title: string;
  talks: Talk[];
}

interface Board {
  title: string;
  tracks: Track[];
}
// Interface general para el modelo de entrada
export interface EntryModel {
  Action_Type: string;
  Message: UsuariosMessage | ActividadMessage[] | RemoveMessage;
}

// Interface cuando Action_Type es "Usuarios"
export interface UsuariosMessage {
  nombres: string[]; // Lista de nombres de los usuarios, puede ser null o estar ausente
}

// Interface cuando Action_Type es "Eliminar Usuario"
export interface RemoveMessage {
  usuario_eliminado: string;
}

// Interface para actividades individuales
export interface ActividadMessage {
  nombre?: string;         // Nombre de la actividad
  fecha_creacion?: string; // Fecha de creación de la actividad
  estado?: string;         // Estado de la actividad
  responsables?: string[]; // Lista de responsables, puede ser null o estar ausente
}



@Component({
  selector: 'app-board',
  imports: [
    CommonModule,
    ToastModule,
    Menubar,
    AvatarModule,
    AvatarGroup,
    DialogModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    DatePickerModule,
    FormsModule,
    ReactiveFormsModule,
    MultiSelectModule,
    CardModule
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css',
  providers: [MessageService]
})
export class BoardComponent {

  items: MenuItem[] | undefined;
  boards: Board[] = []
  users: string[] = [];

  actividades: ActividadMessage[] = [];
  usersDropDown:any = [];
  nombreUsuario: any;
  visible = false;
  Formulario: FormGroup;



  estados = [
    { label: "Iniciado", value: "Iniciado" },
    { label: "En desarrollo", value: "En desarrollo" },
    { label: "Completado", value: "Completado" }
  ]

  // estados = [
  //   { label: "Iniciado", value: "Iniciado" },
  //   { label: "En desarrollo", value: "En desarrollo" },
  //   { label: "Completado", value: "Completado" }
  // ]


  constructor(private msg: MessageService, private ws: WebsocketsService, private fb: FormBuilder, private cdr: ChangeDetectorRef, private router: Router) {
    console.log("Entro en el construcotr");
    this.nombreUsuario = localStorage.getItem("token_Trello");

    this.Formulario = this.fb.group({
      nombre: ['', Validators.required],
      fecha_creacion: ['', Validators.required],
      estado: ['', Validators.required],
      responsables: [, Validators.required]
    })
    this.ListenUsers();  
    this.ListenRemove();
    this.ListenActividades();
  }


  cambiarEstado(actividad: ActividadMessage) {
    var x = {
      Estado : actividad.estado,
      fecha_creacion : actividad.fecha_creacion,
      nombre : actividad.nombre,
      responsables : actividad.responsables,
    }

    this.ws.Emit(x); // Enviar como string válido
    console.log("Actividad: " + actividad);
  
    this.router.navigateByUrl('/board', { skipLocationChange: true }).then(() => {
      this.router.navigate(['board']);
    }); 
  }
  
async ngAfterViewInit() {
  this.msg.add({
    severity: 'success',
    summary: 'Conectado!',
    detail: `${this.nombreUsuario}, se conectó al servidor websocket!`,
    life: 3000
  });


  console.log("Cargaron los componentes?");
}



  ngOnInit() {


  

    this.items = [{
      label: 'Salir',
      icon: 'pi pi-sign-out',
      command: () => this.LogOut(),
      iconStyle: {
        color: "slateblue"
      }
    },
    {
      label: 'Agregar actividad',
      icon: 'pi pi-plus',
      command: () => this.showDialog(),
    }
    ]

  }

  LogOut() {
    this.ws.CloseConn()
  }

  showDialog() {
    this.visible = true;
  }

  onSubmit() {
    if (this.Formulario.invalid) {
      this.msg.add({
        severity: 'warn',
        summary: 'Formulario invalido~',
        detail: 'Porfavor rellene todos los campos'
      });
      return
    }
    this.Formulario.value.responsables.map((dato:any) => {
      return dato.nombre
    })
    console.log("Responsables" + this.Formulario.value.responsables)
    this.ws.Emit(this.Formulario.value)

    this.msg.add({
      severity: 'success',
      summary: 'Actividad agregada',
      detail: 'La actividad se agrego al board con exito'
    });
    
    this.visible = false;
  }

  ListenUsers() {
    this.ws.Listen('Usuarios').subscribe((msg: UsuariosMessage) => {
      this.users = msg.nombres
      console.log(this.usersDropDown);
      // this.usersDropDown = msg.nombres.map((dato) => {
      //   return {
      //     label: dato,
      //   };
      // });
      this.usersDropDown = msg.nombres;
      console.log("Desde el listen users: " + msg.nombres);
      this.cdr.detectChanges();
    })
  }

  ListenRemove() {
    this.ws.Listen('SalidaUsuario').subscribe((msg: any) => {
      let user_out: string = msg.usuario_eliminado;
      console.log("Desde el remove users: " + msg.usuario_eliminado);

      // Encontrar el índice del usuario que se desconectó
      const index = this.users.indexOf(user_out);

      // Comprobar si el usuario se encontró en el arreglo
      if (index !== -1) {
        // Eliminar el usuario del arreglo
        this.users.splice(index, 1);

        // Mostrar el mensaje de notificación
        this.msg.add({
          severity: 'error',
          summary: 'Usuario desconectado!',
          detail: `${msg.usuario_eliminado}, se desconecto del servidor websocket!`
        });
      } else {
        console.log(`El usuario ${user_out} no se encontró en el arreglo.`);
      }
    });
  }

  ListenActividades() {
  this.ws.Listen('Actividades').subscribe((msg: ActividadMessage[]) => {
    this.actividades = msg;
    console.log("Desde listen actividades: ", msg);
    this.ngOnInit();
    this.cdr.detectChanges();

  });
}


}
