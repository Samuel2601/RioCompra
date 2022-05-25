import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AdminService } from 'src/app/service/admin.service';
declare var iziToast:any;
declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-inventario-producto',
  templateUrl: './inventario-producto.component.html',
  styleUrls: ['./inventario-producto.component.css']
})
export class InventarioProductoComponent implements OnInit {

  public id = '';
  public token :any= '';
  public producto : any  = {};
  public inventarios : Array<any>=[];
  public variedades : Array<any>=[];
  public arr_inventario: Array<any>=[];
  public inventario : any = {
    variedad: ''
  }

  public load_btn = false;

  public page = 1;
  public pageSize = 40;

  public load_del = false;
  public load_data = true;

  constructor(
    private _route: ActivatedRoute,
    private _adminService: AdminService
  ) { 
    this.token = localStorage.getItem('token');

  }

  ngOnInit(): void {
    this._route.params.subscribe(
      params=>{
        this.id = params['id'];

        this.load_data = true;
        this.listar_variedades();
        this._adminService.obtener_producto_admin(this.id,this.token).subscribe(
          response=>{
           if(response.data == undefined){
            this.producto = undefined;
            this.load_data = false;
           }else{
             this.producto = response.data;
             
            
             this._adminService.listar_inventario_producto_admin(this.producto._id,this.token).subscribe(
               response=>{
                  this.inventarios = response.data;
                  
               }
             )
             this.load_data = false;
           }
            
          }
        );
        
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

  registro_inventario(inventarioForm:any){
    if(inventarioForm.valid){
       
      let data = {
        producto: this.producto._id,
        variedad: this.inventario.variedad,
        cantidad: inventarioForm.value.cantidad,
      }

      console.log(data);
      

      this._adminService.registro_inventario_producto_admin(data,this.token).subscribe(
        response=>{
          iziToast.show({
              title: 'SUCCESS',
              titleColor: '#1DC74C',
              color: '#FFF',
              class: 'text-success',
              position: 'topRight',
              message: 'Se agrego el nuevo stock al producto.'
          });

          this._adminService.listar_inventario_producto_admin(this.producto._id,this.token).subscribe(
            response=>{
               this.inventarios = response.data;
            }
          )
          
        },
        error=>{
          console.log(error);
          
        }
      )
        
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
