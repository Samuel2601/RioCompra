import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/service/admin.service';
declare var iziToast:any;


@Component({
  selector: 'app-edit-cupon',
  templateUrl: './edit-cupon.component.html',
  styleUrls: ['./edit-cupon.component.css']
})
export class EditCuponComponent implements OnInit {

  public cupon : any = {
    disponibilidad: '',
    tipo: ''
  };
  public token = localStorage.getItem('token');
  public load_btn = false;
  public id = '';
  public load_data = true;

  constructor(
    private _adminService:AdminService,
    private _router:Router,
    private _route:ActivatedRoute
  ) { }

  ngOnInit(): void {
    this._route.params.subscribe(
      params=>{
        this.id = params['id'];
        console.log(this.id);
        
        this._adminService.obtener_cupon_admin(this.id,this.token).subscribe(
          response=>{
            if(response.data == undefined){
                this.cupon = undefined;
                this.load_data =false;
            }else{
              this.cupon= response.data;
              this.load_data =false;
            }

          }
        )
      }
    )
  }

  registro(registroForm:any){
    if(registroForm.valid){
      this.load_btn = true;
      this._adminService.actualizar_cupon_admin(this.id,this.cupon,this.token).subscribe(
        response=>{  
          iziToast.show({
            title: 'SUCCESS',
            titleColor: '#1DC74C',
            color: '#FFF',
            class: 'text-success',
            position: 'topRight',
            message: 'Se actualizó correctamente el cupón.'
        });

          this.load_btn = false;

          this._router.navigate(['/cupones']);

        }
      );
      
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
