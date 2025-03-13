import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebsocketsService {
  private socket!: WebSocket;
  private socketOpenPromise!: Promise<void>;

  constructor(@Inject(PLATFORM_ID) private platform_id: Object) {}

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
        };

        this.socket.onmessage = (event) => {
          console.log('Mensaje recibido:', event.data);
        };
      });
    }
  }

  public async Emit(content: string) {
    try {
      await this.socketOpenPromise;
      this.socket.send(content);
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
    }
  }




}
