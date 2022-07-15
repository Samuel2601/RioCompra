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
  public prod :Array<any> = [];
  public nueva_variedad = '';
  public load_btn = false;
  public load_data = true;
  public load_agregar = false;
  public load_del = false;
  public url = '';
  public rol: any;
  public idp: any;
  public yo: number=0;
  constructor(
    private _route:ActivatedRoute,
    private _adminService : AdminService
  ) { 
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;
    
  }

  ngOnInit(): void {
    let aux = localStorage.getItem("identity");
    this._adminService.obtener_admin(aux, this.token).subscribe((response) => {
      this.rol = response.data.rol;
      this.idp = response.data._id;
      if (response.data.email == "samuel.arevalo@espoch.edu.ec") {
        this.yo = 1;
      }
    });
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
        this.prod=response.producto;
        console.log(this.prod);
        console.log(this.variedades);
        this.load_data = false;
      }
    );
  }

  eliminar_variedad(id:any){
    this.load_del = true;
    this._adminService.eliminar_variedad_admin(id,this.token).subscribe(
      response=>{
        if(response.message=="Variedad eliminada"){
          iziToast.show({
            title: 'SUCCESS',
            titleColor: '#1DC74C',
            color: '#FFF',
            class: 'text-success',
            position: 'topRight',
            message: 'Se eliminó correctamente la variedad.'
        });
        }else{
          iziToast.show({
            title: 'ERROR',
            titleColor: '#1DC74C',
            color: '#FFF',
            class: 'text-info',
            position: 'topRight',
            message: response.message
        });
        }
        

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
      this.nueva_variedad=this.nueva_variedad.toUpperCase();
      let data = {
        producto: this.id,
        valor:this.nueva_variedad,
      }
      this.load_agregar = true;
      this._adminService.agregar_nueva_variedad_admin(data,this.token).subscribe(
        response=>{
          console.log(data);
          if(response.message==undefined){
            iziToast.show({
              title: 'SUCCESS',
              titleColor: '#1DC74C',
              color: '#FFF',
              class: 'text-success',
              position: 'topRight',
              message: 'Se agrego la nueva variedad.'
          });
          }else{
            iziToast.show({
              title: 'ERROR',
              titleColor: '#1DC74C',
              color: '#FFF',
              class: 'text-info',
              position: 'topRight',
              message: 'Se agrego la nueva variedad.'
          });
          }
         
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
