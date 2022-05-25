import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from './service/admin.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'admin';
  public geo = localStorage.getItem('geo');

  constructor(
    private _adminService:AdminService,
    private _router:Router
  ){
  }

  ngOnInit(): void {

    if(localStorage.getItem('token') != null){
      this._adminService.verificar_token(localStorage.getItem('token')).subscribe(
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
      this._adminService.obtener_ip_admin().subscribe(
        response=>{
          this._adminService.obtener_data_admin(response.ip).subscribe(
            response=>{
              localStorage.setItem('geo',JSON.stringify(response));
              window.location.reload();
              
            }
          );
        }
      );
    }

    
    
  }

}
