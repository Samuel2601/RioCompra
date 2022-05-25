import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { GuestService } from '../services/guest.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private _router:Router,
    private _guestService:GuestService
  ){

  }

  canActivate():any{
    let access:any = this._guestService.isAuthenticate();

    if(!access){
      this._router.navigate(['/']);
    }
    return true;
  }
}
