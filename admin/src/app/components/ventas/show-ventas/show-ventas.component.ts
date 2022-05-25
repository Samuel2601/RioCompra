import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/service/admin.service';
import { GLOBAL } from 'src/app/service/GLOBAL';
declare var iziToast:any;
declare var $:any;

@Component({
  selector: 'app-show-ventas',
  templateUrl: './show-ventas.component.html',
  styleUrls: ['./show-ventas.component.css']
})
export class ShowVentasComponent implements OnInit {

  public venta : any={};
  public id = '';
  public token = localStorage.getItem('token');
  public load = false;

  public url = GLOBAL.url;
  public detalles : Array<any> = [];
  public load_data = true;

  public totalstar = 5;

  public review : any = {};
  public load_send = false;
  public load_conf_pago = false;
  public load_final= false;
  public load_del= false;
  public tracking = '';
  public pago : any = {};

  constructor(
    private _route:ActivatedRoute,
    private _adminService:AdminService,
    private _router:Router
    ) { 
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;
    
  }


  ngOnInit(): void {
    this._route.params.subscribe(
      params=>{
        this.id = params['id'];

        this.init_data();
      }
    );
  }

  init_data(){
    this._adminService.obtener_detalles_ordenes_cliente(this.id,this.token).subscribe(
      response=>{
        console.log(response);
        if(response.data != undefined){
          this.venta = response.data;

          if(this.venta.metodo_pago=='Tarjeta de crédito'){
            this._adminService.obtenerPago(this.venta.transaccion).subscribe(
              response=>{
                this.pago = response;
              }
            );
          }
      
          this.detalles = response.detalles;
          this.load_data = false;
        }else{
          this.venta = undefined;
          this.load_data = false;
        }
       
        console.log(this.detalles);
      }
    );
  }
  
  finalzar(id:any){
    this.load_final = true;
    this._adminService.marcar_finalizado_orden(id,{data:''},this.token).subscribe(
      response=>{
        iziToast.show({
            title: 'SUCCESS',
            titleColor: '#1DC74C',
            color: '#FFF',
            class: 'text-success',
            position: 'topRight',
            message: 'La venta fue cerrada correctamente.'
        });
        $('#openConfirmarPago').modal('hide');
        $('.modal-backdrop').remove();
        this.load_final = false;
        this.init_data();
      }
    );
  }

  enviar(id:any){
    if(this.tracking){
      this.load_send = true;
      this._adminService.marcar_envio_orden(id,{tracking:this.tracking},this.token).subscribe(
        response=>{
          iziToast.show({
              title: 'SUCCESS',
              titleColor: '#1DC74C',
              color: '#FFF',
              class: 'text-success',
              position: 'topRight',
              message: 'La orden fue marcada como enviada.'
          });
          $('#openEnviado').modal('hide');
          $('.modal-backdrop').remove();
          this.load_send = false;
          this.init_data();
        }
      );
    }else{
      iziToast.show({
        title: 'DANGER',
        titleColor: '#FF0000',
        color: '#FFF',
        class: 'text-success',
        position: 'topRight',
        message: 'Ingrese el numero de seguimiento.'
    });
    }
  }

  eliminar(id:any){
    this.load_del = true;
    this._adminService.eliminar_orden_admin(id,this.token).subscribe(
      response=>{
        iziToast.show({
            title: 'SUCCESS',
            titleColor: '#1DC74C',
            color: '#FFF',
            class: 'text-success',
            position: 'topRight',
            message: 'El pedido fue eliminada correctamente.'
        });
        $('#openEliminar').modal('hide');
        $('.modal-backdrop').remove();
        this._router.navigate(['/ventas']);
        this.load_del = false;
      }
    );
  }

  confirmar_pago(id:any){
    this.load_conf_pago = true;
    this._adminService.confirmar_pago_orden(id,{data:''},this.token).subscribe(
      response=>{
        iziToast.show({
            title: 'SUCCESS',
            titleColor: '#1DC74C',
            color: '#FFF',
            class: 'text-success',
            position: 'topRight',
            message: 'El pago fue confirmado correctamente.'
        });
        $('#openConfirmarPago').modal('hide');
        $('.modal-backdrop').remove();
        this.load_conf_pago = false;
        this.init_data();
      }
    );
  }
}
