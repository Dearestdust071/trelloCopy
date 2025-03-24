import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router'; export const waitingForConnectionGuard: CanActivateFn = () => {
  if (localStorage.getItem("token_Trello"))
    return true;
  else {
    console.log("Entro en el false de guard")
    let router = inject(Router)
    router.navigate(['/login'])
    return false;


  }

};
