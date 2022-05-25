import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/service/admin.service';
declare var $:any;
declare var iziToast:any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public token : any = '';
  public admin = {
    email :'',
    password: ''
  }

  constructor(
    private _adminService:AdminService,
    private _router:Router
  ) { 
    this.token =localStorage.getItem('token');
  }

  ngOnInit(): void {
    $('body').addClass('align-items-center');
    if(this.token){
      this._router.navigate(['/clientes']);
    }else{
      //MANTENER EN EL COMPONENTE
    }
  }

  login(loginForm:any){
    
    if(loginForm.valid){
      let email = loginForm.value.email;
      let password = loginForm.value.password;

      if(email == '' && password == ''){
        iziToast.show({
          title: 'ERROR DATA',
          class:'iziToast-danger',
          position: 'topRight',
          message: 'Todos los campos son requeridos, vuelva a intentar.'
        });
      }else{
        this._adminService.login_admin({email,password}).subscribe(
          response =>{
            console.log(response);
            
            if(response.data != null){
              this.token = response.jwt;
              localStorage.setItem('token',response.token);
              localStorage.setItem('identity',response.data._id);
              localStorage.setItem('user_data',JSON.stringify(response.data));
              this._router.navigate(['/clientes']);
            }else{
              iziToast.show({
                  title: 'ERROR USER',
                  class:'iziToast-danger',
                  position: 'topRight',
                  message: response.message
              });
            }
            
          },
          error=>{
            iziToast.show({
                title: 'ERROR SERVER',
                class:'iziToast-danger',
                position: 'topRight',
                message: 'Ocurrió un error en el servidor, intente mas nuevamente.'
            });
          }
        );
      }
    }else{
      iziToast.show({
          title: 'ERROR DATA',
          class:'iziToast-danger',
          position: 'topRight',
          message: 'Complete correctamente el formulario.'
      });
    }
  }

  view_password(){
    let type = $('#password').attr('type');

    if(type == 'text'){
      $('#password').attr('type','password');
      
    }else if(type == 'password'){
      $('#password').attr('type','text');
    }
  }

}
