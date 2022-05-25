import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/service/admin.service';
declare var iziToast:any;

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {

  public config: any = {
    envio_activacion : 'Desactivado',
  };
  public load_btn = false;
  public token = localStorage.getItem('token');
  public load_data = true;

  constructor(
    private _adminService:AdminService,
  
  ) { }

  ngOnInit(): void {
    
    this.init_data();
  }

  init_data(){
    this.load_data = true;
    this._adminService.obtener_config_admin().subscribe(
      response=>{
        this.config = response.data;
        this.load_data = false;
      }
    );
  }

  actualizar(actualizarForm:any){
    console.log(actualizarForm);
    
    if(actualizarForm.valid){
      this.load_btn = true;
      console.log(this.config);
      
      this._adminService.actualizar_config_admin(this.config,this.token).subscribe(
        response=>{
          iziToast.show({
              title: 'SUCCESS',
              titleColor: '#1DC74C',
              color: '#FFF',
              class: 'text-success',
              position: 'topRight',
              message: 'Se actualizó correctamente las configuraciones.'
          });
          this.load_btn = false;

          this.init_data();
        },
        error=>{
          this.load_btn = false;
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
