import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GuestService } from './services/guest.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'tienda';
  public geo = localStorage.getItem('geo');
  

  constructor(
    private _guestService:GuestService,
    private _router:Router
  ){
    if(localStorage.getItem('token') != null){
      this._guestService.verificar_token(localStorage.getItem('token')).subscribe(
        response=>{
        },
        error=>{
          localStorage.removeItem('token');
          localStorage.removeItem('_id');
          localStorage.removeItem('user');
          this._router.navigate(['/login']);
        }
      );
    }
    if(this.geo == null){
      this._guestService.obtener_ip_cliente().subscribe(
        response=>{
          this._guestService.obtener_data_cliente(response.ip).subscribe(
            response=>{
              localStorage.setItem('geo',JSON.stringify(response));
              window.location.reload();
              
            }
          );
        }
      );
    }

    
  }

  onActivate(event:any) {
    window.scroll(0,0);

  }
}
