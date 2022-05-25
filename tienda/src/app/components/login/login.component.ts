import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GuestService } from 'src/app/services/guest.service';
declare var iziToast:any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public user : any = {};
  public usuario : any = {};
  public token = localStorage.getItem('token');

  public new_user : any = {};
  public op = 1;
  public carrito_logout :Array<any> = [];

  constructor(
    private _guestService:GuestService,
    private _router:Router
  ) { }

  ngOnInit(): void {
    if(this.token){
      this._router.navigate(['/']);
    }
  }

  changeOp(op:any){
    this.op = op;
  }

  func_login(loginForm:any){
    if(loginForm.valid){
      
      this.login(this.user.email,this.user.password);
      
    }else{
      iziToast.show({
          title: 'ERROR',
          titleColor: '#FF0000',
          color: '#FFF',
          class: 'text-danger',
          position: 'topRight',
          message: 'Los datos del formulario no son validos'
      });
    }
  }

  login(email:any,password:any){
    let data : any= {
      email: email,
      password: password
    }

    let ls_cart = localStorage.getItem('cart');
    if(ls_cart != null){
      this.carrito_logout = JSON.parse(ls_cart);
    }else{
      this.carrito_logout = [];
    }

    data.carrito = this.carrito_logout;
    
    this._guestService.login_cliente(data).subscribe(
      response=>{
        if(response.data == undefined){
          iziToast.show({
              title: 'ERROR',
              titleColor: '#FF0000',
              color: '#FFF',
              class: 'text-danger',
              position: 'topRight',
              message: response.message
          });
        }else{
          this.usuario = response.data;
          localStorage.removeItem('cart');
          localStorage.setItem('token',response.token);
          localStorage.setItem('_id',response.data._id);
          localStorage.setItem('user_data',JSON.stringify(response.data));
          this._router.navigate(['/']).then(() => {
            window.location.reload();
          })
        }
       
      },
      error=>{
        console.log(error);
      }
    );
  }

  registro(registroForm:any){
    if(registroForm.valid){
     
      if(this.new_user.password.length <=5){
        iziToast.show({
            title: 'ERROR',
            titleColor: '#FF0000',
            color: '#FFF',
            class: 'text-danger',
            position: 'topRight',
            message: 'La contraseña debe tener mas de 5 caracteres'
        });
      }else{
        console.log(this.new_user);
        
        this._guestService.registro_cliente(this.new_user).subscribe(
          response=>{
            console.log(response);
            
            if(response.data != undefined){
              iziToast.show({
                  title: 'SUCCESS',
                  titleColor: '#1DC74C',
                  color: '#FFF',
                  class: 'text-success',
                  position: 'topRight',
                  message: 'Se registro correctamente en Prágol.'
              });
              this.user.email = this.new_user.email;
              this.user.password = this.new_user.password;
              this.login(this.user.email,this.user.password);
            }else{
              iziToast.show({
                title: 'ERROR',
                titleColor: '#FF0000',
                color: '#FFF',
                class: 'text-danger',
                position: 'topRight',
                message: response.message
            });
            }
          }
        );
      }
            
    }else{
      iziToast.show({
          title: 'ERROR',
          titleColor: '#FF0000',
          color: '#FFF',
          class: 'text-danger',
          position: 'topRight',
          message: 'Los datos del formulario no son validos'
      });
    }
  }
}
