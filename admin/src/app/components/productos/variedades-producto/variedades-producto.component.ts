import { Component, OnInit } from '@angular/core';
import { GLOBAL } from 'src/app/service/GLOBAL';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/service/admin.service';
declare var iziToast:any;
declare var $:any;

@Component({
  selector: 'app-variedades-producto',
  templateUrl: './variedades-producto.component.html',
  styleUrls: ['./variedades-producto.component.css']
})
export class VariedadesProductoComponent implements OnInit {

  public producto :any = {};
  public id = '';
  public token :any = '';
  public variedades :Array<any> = [];

  public nueva_variedad = '';
  public load_btn = false;
  public load_data = true;
  public load_agregar = false;
  public load_del = false;
  public url = '';

  constructor(
    private _route:ActivatedRoute,
    private _adminService : AdminService
  ) { 
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;
    
  }

  ngOnInit(): void {
    this._route.params.subscribe(
      params=>{
        this.id = params['id'];
        this.load_data = true;
        this.listar_variedades();
        
      }
    );
  }

  listar_variedades(){
    this._adminService.listar_variedades_admin(this.id,this.token).subscribe(
      response=>{
        this.variedades = response.data;
        this.load_data = false;
      }
    );
  }

  eliminar_variedad(id:any){
    this.load_del = true;
    this._adminService.eliminar_variedad_admin(id,this.token).subscribe(
      response=>{
        iziToast.show({
            title: 'SUCCESS',
            titleColor: '#1DC74C',
            color: '#FFF',
            class: 'text-success',
            position: 'topRight',
            message: 'Se eliminó correctamente la variedad.'
        });

        $('#delete-'+id).modal('hide');
        $('.modal-backdrop').remove();
        this.load_del = false;
        this.listar_variedades();

      },
      error=>{
        iziToast.show({
            title: 'SUCCESS',
            titleColor: '#1DC74C',
            color: '#FFF',
            class: 'text-success',
            position: 'topRight',
            message: 'Ocurrió un error en el servidor.'
        });
        console.log(error);
        this.load_btn = false;
      }
    )
  }

  actualizar(){
    if(this.producto.titulo_variedad){
      //actualizar
      this.load_btn = true;
      this._adminService.actualizar_producto_variedades_admin({
        titulo_variedad: this.producto.titulo_variedad
      },this.id,this.token).subscribe(
        response=>{
          iziToast.show({
              title: 'SUCCESS',
              titleColor: '#1DC74C',
              color: '#FFF',
              class: 'text-success',
              position: 'topRight',
              message: 'Se actualizó correctamente las variedades.'
          });
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
          message: 'Debe completar el titulo de la variedad'
      });
      this.load_btn = false;
    }
  }

  agregar_variedad(){
    if(this.nueva_variedad){

      let data = {
        producto: this.id,
        valor:this.nueva_variedad,
      }
      this.load_agregar = true;
      this._adminService.agregar_nueva_variedad_admin(data,this.token).subscribe(
        response=>{
          console.log(data);
          iziToast.show({
              title: 'SUCCESS',
              titleColor: '#1DC74C',
              color: '#FFF',
              class: 'text-success',
              position: 'topRight',
              message: 'Se agrego la nueva variedad.'
          });
          this.load_agregar = false;
          this.listar_variedades();
        }
      );

      this.nueva_variedad = '';
    }else{
      iziToast.show({
          title: 'ERROR',
          titleColor: '#FF0000',
          color: '#FFF',
          class: 'text-danger',
          position: 'topRight',
          message: 'El campo de la variedad debe ser completada'
      });
   
    }
  }


}
