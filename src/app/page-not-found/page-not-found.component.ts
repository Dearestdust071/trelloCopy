import { Component } from '@angular/core';

@Component({
  selector: 'app-page-not-found',
  template: `
    <div class="flex flex-col items-center justify-center min-h-screen bg-blue-100">
      <div class="text-center">
        <h1 class="text-9xl font-bold text-blue-600">404</h1>
        <h2 class="text-3xl font-semibold text-blue-800 mt-4">Página no encontrada</h2>
        <p class="text-gray-600 mt-2">Lo sentimos, la página que buscas no existe.</p>
        <button
          pButton
          label="Volver al inicio"
          class="p-button-primary mt-6 px-6 py-3"
          routerLink="/">
        </button>
      </div>
    </div>
  `,
  styles: [``]
})
export class PageNotFoundComponent { }
