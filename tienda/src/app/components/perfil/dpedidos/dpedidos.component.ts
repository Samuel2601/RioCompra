import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StarRatingComponent } from 'ng-starrating';
import { GLOBAL } from 'src/app/services/GLOBA';
import { GuestService } from 'src/app/services/guest.service';
declare var iziToast:any;

@Component({
  selector: 'app-dpedidos',
  templateUrl: './dpedidos.component.html',
  styleUrls: ['./dpedidos.component.css']
})
export class DpedidosComponent implements OnInit {

  public url = GLOBAL.url;
  public token = localStorage.getItem('token');
  public orden : any = {};
  public detalles : Array<any> = [];
  public load_data = true;
  public id = '';

  public totalstar = 5;

  public review : any = {};

  constructor(
    private _guestService:GuestService,
    private _route:ActivatedRoute,
    private _router:Router
  ) { 
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;
    this._route.params.subscribe(
      params=>{
        this.id = params['id'];
        this.init_data();
      }
    );
  }

  ngOnInit(): void {
  }

  init_data(){
    this._guestService.obtener_detalles_ordenes_cliente(this.id,this.token).subscribe(
      response=>{
        console.log(response);
        
        if(response.data != undefined){
          this.orden = response.data;
     
          response.detalles.forEach((element:any) => {
              this._guestService.obtener_review_producto_cliente(element.producto._id).subscribe(
                response=>{
                 
                  let emitido = false;
                  response.data.forEach((element_:any) => {
                     if(element_.cliente == localStorage.getItem('_id')){
                      emitido = true;
                     }
                  });
                  element.estado = emitido;
                }
              );
          });
          this.detalles = response.detalles;
          this.load_data = false;
        }else{
          this.orden = undefined;
        }
       
        

      }
    );
  }

  openModal(item:any){
    this.review = {};
    this.review.producto = item.producto._id;
    this.review.cliente = item.cliente;
    this.review.venta = this.id;

}

  onRate($event:{oldValue:number, newValue:number, starRating:StarRatingComponent}){
    console.log($event.newValue);
    this.review.estrellas = $event.newValue;
    console.log(this.review.estrellas);
    
  }

  emitir(id:any){
    if(this.review.review){
      if(this.review.estrellas && this.review.estrellas >= 0){
        console.log(this.review);
        
        this._guestService.emitir_review_producto_cliente(this.review,this.token).subscribe(
          response=>{
            console.log(response);
            
            iziToast.show({
                title: 'SUCCESS',
                titleColor: '#1DC74C',
                color: '#FFF',
                class: 'text-success',
                position: 'topRight',
                message: 'Se emitio correctamente la reseña.'
            });
            window.location.reload();
          }
        );
        
      }else{
        iziToast.show({
            title: 'ERROR',
            titleColor: '#FF0000',
            color: '#FFF',
            class: 'text-danger',
            position: 'topRight',
            message: 'Seleccione el numero de estrellas'
        });
      }
    }else{
      iziToast.show({
          title: 'ERROR',
          titleColor: '#FF0000',
          color: '#FFF',
          class: 'text-danger',
          position: 'topRight',
          message: 'Ingrese un mensaje de la reseña'
      });
    }
  }
}
