import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';

// Interface general para el modelo de entrada
export interface EntryModel {
  Action_Type: string;
  Message: UsuariosMessage | ActividadesMessage | RemoveMessage;
}

// Interface para el caso cuando el Action_Type es "Usuarios"
export interface UsuariosMessage {
  nombres?: string[]; // Lista de nombres de los usuarios, puede ser null o estar ausente
}

export interface RemoveMessage {
  usuario_eliminado: string;
}


// Interface para el caso cuando el Action_Type es "Actividades"
export interface ActividadesMessage {
  nombre?: string;         // Nombre de la actividad
  fecha_creacion?: string; // Fecha de creación de la actividad
  estado?: string;         // Estado de la actividad
  responsables?: string[]; // Lista de responsables, puede ser null o estar ausente
}


@Injectable({
  providedIn: 'root'
})
export class WebsocketsService {
  private socket!: WebSocket;
  private socketOpenPromise!: Promise<void>;
  public observableWS: Subject<EntryModel> = new Subject<EntryModel>();

  constructor(@Inject(PLATFORM_ID) private platform_id: Object, private router: Router,
  ) { }

  public Connect(usuario: string) {
    if (isPlatformBrowser(this.platform_id)) {
      this.socket = new WebSocket(`ws://localhost:9001/${usuario}`);

      this.socketOpenPromise = new Promise<void>((resolve, reject) => {
        this.socket.onopen = () => {
          console.log('Se conectó al websocket exitosamente!');
          resolve();
        };

        this.socket.onerror = (event) => {
          console.error('Error de conexión:', event);
          reject(event);
        };

        this.socket.onclose = () => {
          console.log('Desconectado del WebSocket');
          localStorage.removeItem("token_Trello")
          this.router.navigate(["/login"])
        };

        this.socket.onmessage = (event) => {
          console.log('Mensaje recibido:', event.data);
          try {
            const jsonObject: EntryModel = JSON.parse(event.data);
            console.log(jsonObject)
            this.observableWS.next(jsonObject)
          }
          catch (error) {
            console.log(error)
          }
        };
      });
    }
  }

  public async Emit(content: string) {
    try {
      await this.socketOpenPromise;
      this.socket.send(JSON.stringify(content));
    } catch (error) {
      console.error('[WebSocket.service.ts] Error al enviar el mensaje:', error);
    }
  }

  public async CloseConn() {
    try {
      await this.socketOpenPromise;
      this.socket.close();
    }
    catch (error) {
      console.log("Error al cerrar la conexion con el ws [WebSocket.service.ts]")
    }
  }


  public Listen(eventName: string): Observable<any> {
    return new Observable<any>((observer) => {
      this.observableWS.subscribe((entry: EntryModel) => {
        switch (entry.Action_Type) {
          case 'Usuarios':
            if (entry.Action_Type === eventName) {
              observer.next(entry.Message)
            }
            break;
          case 'SalidaUsuario':
            if (entry.Action_Type === eventName) {
              observer.next(entry.Message)
            }
            break;
          case 'Actividades':
            if (entry.Action_Type === eventName) {
              observer.next(entry.Message)
            }
            break;
          default:
            console.log("Error [websockets.service]")
            break;
        }
      })
    })
  }


}
