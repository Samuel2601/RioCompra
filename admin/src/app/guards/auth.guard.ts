import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AdminService } from '../service/admin.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private _router:Router,
    private _adminService:AdminService
  ){

  }

  canActivate():any{
    let access:any = this._adminService.isAuthenticate();

    if(!access){
      this._router.navigate(['login']);
    }
    return true;
  }
  
}
