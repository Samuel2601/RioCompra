import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { GuestService } from 'src/app/services/guest.service';
declare var Slick:any;
declare var lightGallery:any;
declare var iziToast:any;
import { io } from "socket.io-client";
import { GLOBAL } from 'src/app/services/GLOBA';
declare var $:any;
declare function productLightbox():any;
declare function slickConfig():any;

@Component({
  selector: 'app-show-producto',
  templateUrl: './show-producto.component.html',
  styleUrls: ['./show-producto.component.css']
})
export class ShowProductoComponent implements OnInit {

  //GEO
  public geo : any = {};
  public country = '';
  public currency = 'USD';
  public user_lc : any = undefined;
  public token :any = '';

  public data = false;
  public load_producto = true;
  public producto : any = {};
  public url = GLOBAL.url;
  public reviews :Array<any> = [];

  public select_variedad_lbl = '';
  public obj_variedad_select : any= {
    id: '',
    stock: 0,
    variedad: ''
  }
  public variedades :Array<any> = [];
  public carrito_data : any = {
    variedad: '',
    cantidad: 0
  };
  public btn_cart = false;

  public page = 1;
  public pageSize = 15;
  public productos_rec : Array<any> = [];
  public slug = '';

  public categoria_producto : any= {};
  public option_nav = 1;
  public socket = io(GLOBAL.socket);

  constructor(
    private _guestService:GuestService,
    private _route:ActivatedRoute
  ) { 
    let obj_lc :any= localStorage.getItem('user_data');
    this.user_lc = JSON.parse(obj_lc);

    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;

    let lc_geo :any= localStorage.getItem('geo');
    this.geo = JSON.parse(lc_geo);
    this.country = this.geo.country_name;
    //this.currency = this.geo.currency;

  }

  ngOnInit(): void {

    this._route.params.subscribe(
      params=>{
        this.slug = params['slug'];
        this.load_producto = true;
        this._guestService.obtener_productos_slug_publico(this.slug).subscribe(
          response=>{
            console.log(response);
            
            if(response.data != undefined){
              this.producto = response.data;
              this.init_productos_recomendados();
              this._guestService.get_categorias().subscribe(
                response=>{
                  for(var item of response){
                    if(item._id == this.producto.categoria){
                      this.categoria_producto = item;
                    }
                  }
                  console.log(this.categoria_producto);
                }
              );
             
              
              setTimeout(() => {
                productLightbox();
                slickConfig();
              }, 100);

              this._guestService.obtener_reviews_producto_publico(this.producto._id).subscribe(
                response=>{
                  this.reviews = response.data;
                }
              );


              /* this._guestService.listar_productos_recomendados_publico(this.producto.categoria).subscribe(
                response=>{
                  this.productos_rec = response.data;

                }
              ); */
              this.init_variedades();
              this.data = true;
              this.load_producto = false;
            }else{
              this.data = false;
              this.load_producto = false;
            }
            console.log(this.data);

          }
        );

      }
    );
  }

  init_variedades(){
    this._guestService.obtener_variedades_productos_cliente(this.producto._id).subscribe(
      response=>{
        this.variedades = response.data;
      }
    );
  }

  select_variedad(){
    let arr_variedad = this.select_variedad_lbl.split('_');
    this.obj_variedad_select.id = arr_variedad[0];
    this.obj_variedad_select.variedad = arr_variedad[1];
    this.obj_variedad_select.stock = arr_variedad[2];

    console.log(this.obj_variedad_select);

  }

  SumCant(){
    this.carrito_data.cantidad = this.carrito_data.cantidad + 1;
  }

  RestCant(){
    if(this.carrito_data.cantidad >= 1){
      this.carrito_data.cantidad = this.carrito_data.cantidad - 1;
    }
  }

  init_productos_recomendados(){
    this._guestService.listar_productos_recomendados_publico(this.producto.categoria).subscribe(
      response=>{
        this.productos_rec = response.data;
      }
    );
  }

  agregar_producto(){
    if(this.obj_variedad_select.variedad){
      if(this.carrito_data.cantidad >= 1){

        if(this.carrito_data.cantidad <= this.obj_variedad_select.stock){
          let data = {
            producto: this.producto._id,
            cliente: localStorage.getItem('_id'),
            cantidad: this.carrito_data.cantidad,
            variedad: this.obj_variedad_select.id,
          }
          this.btn_cart =true;
          this._guestService.agregar_carrito_cliente(data,this.token).subscribe(
            response=>{
              console.log(response);
              if(response.data == undefined){
                iziToast.show({
                    title: 'ERROR',
                    titleColor: '#FF0000',
                    color: '#FFF',
                    class: 'text-danger',
                    position: 'topRight',
                    message: response.message
                });
                this.btn_cart =false;
              }else{

                iziToast.show({
                    title: 'SUCCESS',
                    titleColor: '#1DC74C',
                    color: '#FFF',
                    class: 'text-success',
                    position: 'topRight',
                    message: 'Se agregó el producto al carrito.'
                });
                this.socket.emit('add-carrito-add',{data:true});
                this.btn_cart =false;
              }
            }
          );
        }else{
          iziToast.show({
              title: 'ERROR',
              titleColor: '#FF0000',
              color: '#FFF',
              class: 'text-danger',
              position: 'topRight',
              message: 'La cantidad máxima del producto es.' + this.obj_variedad_select.stock
          });
        }
      }else{
        iziToast.show({
            title: 'ERROR',
            titleColor: '#FF0000',
            color: '#FFF',
            class: 'text-danger',
            position: 'topRight',
            message: 'Ingrese una cantidad válida por favor.'
        });
      }
   }else{
    iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        color: '#FFF',
        class: 'text-danger',
        position: 'topRight',
        message: 'Seleccione una variedad de producto'
    });
  }
  }

  agregar_producto_guest(){
    if(this.obj_variedad_select.variedad){
     

      if(this.carrito_data.cantidad >= 1){
        if(this.carrito_data.cantidad <= this.obj_variedad_select.stock){
          let data = {
            producto: this.producto,
            variedad: this.obj_variedad_select,
            cantidad: this.carrito_data.cantidad,
          }
          let ls_carrito_guest = localStorage.getItem('cart');
          if(ls_carrito_guest == null){
            let arr_carrito = [];
            arr_carrito.push(data);
            localStorage.setItem('cart',JSON.stringify(arr_carrito));
          }else{
            let arr_carrito = JSON.parse(ls_carrito_guest);
            localStorage.removeItem('cart');
            arr_carrito.push(data);
            localStorage.setItem('cart',JSON.stringify(arr_carrito));
          }
  
          iziToast.show({
              title: 'SUCCESS',
              titleColor: '#1DC74C',
              color: '#FFF',
              class: 'text-success',
              position: 'topRight',
              message: 'Se agregó el producto a tu carrito.'
          });
  
          this.obj_variedad_select= {
            id: '',
            stock: 0,
            variedad: ''
          }
          this.carrito_data.cantidad = 0;
          this.select_variedad_lbl = '';
          this.socket.emit('add-carrito-add',{data:true});
        }else{
          iziToast.show({
              title: 'ERROR',
              titleColor: '#FF0000',
              color: '#FFF',
              class: 'text-danger',
              position: 'topRight',
              message: 'La cantidad máxima del producto es.' + this.obj_variedad_select.stock
          });
        }
      }else{
        iziToast.show({
            title: 'ERROR',
            titleColor: '#FF0000',
            color: '#FFF',
            class: 'text-danger',
            position: 'topRight',
            message: 'Ingrese una cantidad valida.'
        });
      }
    }else{
      iziToast.show({
          title: 'ERROR',
          titleColor: '#FF0000',
          color: '#FFF',
          class: 'text-danger',
          position: 'topRight',
          message: 'Seleccione una variedad de producto.'
      });
    }
  }

  change_option(op:any){
    this.option_nav = op;
  }
}
