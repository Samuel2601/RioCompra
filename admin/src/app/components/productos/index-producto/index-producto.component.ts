import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/service/admin.service';
import { GLOBAL } from 'src/app/service/GLOBAL';
declare var iziToast:any;
declare var $:any;

@Component({
  selector: 'app-index-producto',
  templateUrl: './index-producto.component.html',
  styleUrls: ['./index-producto.component.css']
})
export class IndexProductoComponent implements OnInit {

  public productos :Array<any>= [];
  public productos_const  :Array<any>= [];
  public token = localStorage.getItem('token');
  public page = 1;
  public pageSize = 24;
  public filtro = '';

  public load_btn_etiqueta =false;
  public load_data_etiqueta =false;
  public nueva_etiqueta = '';
  public etiquetas : Array<any> = [];
  public load_del_etiqueta = false;
  public load_btn = false;
  public load = false;

  public load_estado = false;
  public url = GLOBAL.url;

  constructor(
    private _adminService:AdminService
  ) { }

  ngOnInit(): void {
    this.listar_etiquetas();
    this.init_data();
  }

  init_data(){
    this.load = true;
    this._adminService.listar_productos_admin(this.token).subscribe(
      response=>{
        this.productos_const = response.data;
        this.productos= this.productos_const;
        this.load = false;
      }
    );
  }

  listar_etiquetas(){
    this.load_data_etiqueta = true;
    this._adminService.listar_etiquetas_admin(this.token).subscribe(
      response=>{
        this.etiquetas = response.data;
        this.load_data_etiqueta = false;
      }
    );
  }

  eliminar_etiqueta(id:any){
    this.load_del_etiqueta = true;
    this._adminService.eliminar_etiqueta_admin(id,this.token).subscribe(
      response=>{
        iziToast.show({
            title: 'SUCCESS',
            titleColor: '#1DC74C',
            color: '#FFF',
            class: 'text-success',
            position: 'topRight',
            message: 'Se eliminó correctamente la etiqueta.'
        });
        this.load_del_etiqueta = false;
        this.listar_etiquetas();
      },
      error=>{
        iziToast.show({
            title: 'SUCCESS',
            titleColor: '#ff0000',
            color: '#FFF',
            class: 'text-success',
            position: 'topRight',
            message: 'Ocurrió un error en el servidor.'
        });
        this.load_del_etiqueta = false;
      }
    )
  }

  agregar_etiqueta(){
    if(this.nueva_etiqueta){
      this.load_btn_etiqueta = true;
      let data = {
        titulo: this.nueva_etiqueta,
      }
      this._adminService.agregar_etiqueta_admin(data,this.token).subscribe(
        response=>{
          if(response.data != undefined){
            iziToast.show({
                title: 'SUCCESS',
                titleColor: '#1DC74C',
                color: '#FFF',
                class: 'text-success',
                position: 'topRight',
                message: 'Se agregó la nueva etiqueta.'
            });
            this.nueva_etiqueta = '';
            this.load_btn_etiqueta = false;
            this.listar_etiquetas();
          }else{
            iziToast.show({
                title: 'DANGER',
                titleColor: '#FF0000',
                color: '#FFF',
                class: 'text-success',
                position: 'topRight',
                message: response.message
            });
            this.load_btn_etiqueta = false;
          }
        },
        error=>{
          iziToast.show({
              title: 'DANGER',
              titleColor: '#FF0000',
              color: '#FFF',
              class: 'text-success',
              position: 'topRight',
              message: 'Ocurrió un error en el servidor.'
          });
          this.load_btn_etiqueta = false;
        }
      )
    }else{
      iziToast.show({
        title: 'DANGER',
        titleColor: '#FF0000',
        color: '#FFF',
        class: 'text-success',
        position: 'topRight',
        message: 'Ingrese un valor a la etiqueta.'
    });
    }
  }

  filtrar_producto(){
    if(this.filtro){
      var term = new RegExp(this.filtro.toString().trim() , 'i');
      this.productos = this.productos_const.filter(item=>term.test(item.titulo)||term.test(item._id));
    }else{
      this.productos = this.productos_const;
    }
  }

  cambiar_vs(id:any,vs:any){
    this.load_estado = true;
    this._adminService.cambiar_vs_producto_admin(id,vs,this.token).subscribe(
      response=>{
        iziToast.show({
            title: 'SUCCESS',
            titleColor: '#1DC74C',
            color: '#FFF',
            class: 'text-success',
            position: 'topRight',
            message: 'Se cambió el estado correctamente el producto.'
        });

        $('#vs-'+id).modal('hide');
        $('.modal-backdrop').remove();
        this.load_estado = false;
        this.init_data();

      },
      error=>{
        iziToast.show({
            title: 'DANGER',
            titleColor: '#FF0000',
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
}
