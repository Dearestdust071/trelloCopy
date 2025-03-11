import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebsocketsService {


  private socket!: WebSocket;
  private socketOpenPromise: Promise<void>;
  private platform_id: Object = Inject(PLATFORM_ID);
  constructor(private usuario: string) {
    if (isPlatformBrowser(this.platform_id) && typeof window != undefined)


      this.socket = new WebSocket(`0.0.0.0:9001/`)

    this.socketOpenPromise = new Promise<void>((resolve, reject) => {

      if (this.socket != undefined) {
        this.socket.onopen = () => {
          console.log('Se conecto a el websocket exitosamente!');
          resolve();
        };
        this.socket.onerror = (event) => {
          reject(event);
        };
      }
    });


  }


  public async Emit(content: string) {
    try {
      await this.socketOpenPromise;
      this.socket.send(content)
    }
    catch (error) {
      console.error("Error al conectarse fallo promesa")
    }
  }



























}
