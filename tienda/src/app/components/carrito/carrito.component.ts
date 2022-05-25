import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBA';
import { GuestService } from 'src/app/services/guest.service';
declare var $:any;
declare var iziToast:any;
import { io } from "socket.io-client";

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {

  public carrito_arr : Array<any> = [];
  public carrito_logout :Array<any> = [];
  public url = GLOBAL.url;

  public geo : any = {};
  public country = '';
  public currency = 'USD';
  public token = localStorage.getItem('token')

  public user : any = undefined;
  public user_lc : any = undefined;  
  public subtotal = 0;

  public zonas:Array<any> = [];
  public str_pais = '';

  public regiones:Array<any> = [];
  public provincias:Array<any> = [];
  public distritos:Array<any> = [];

  public regiones_arr:Array<any> = [];
  public provincias_arr:Array<any> = [];
  public distritos_arr:Array<any> = [];

  public direccion : any = {
    pais: '',
    region: '',
    provincia: '',
    distrito: '',
    principal: false,
    zona: ''
  };
  public precio_envio_soles = 0;
  public precio_envio_dolares = 0;
  public socket = io(GLOBAL.socket);

  public total_pagar = 0;
  public subtotal_const = 0;

  constructor(
    private _guestService:GuestService,
    private _router:Router
  ) { 
    let lc_geo :any= localStorage.getItem('geo');
    this.geo = JSON.parse(lc_geo);
    this.country = this.geo.country_name;
    //this.currency = this.geo.currency;

    this.init_zonas();

    if(this.token){
      let obj_lc :any= localStorage.getItem('user_data');
      this.user_lc = JSON.parse(obj_lc);
      this.obtener_carrito();
    }

    if(this.user_lc == undefined){
      let ls_cart = localStorage.getItem('cart');
      if(ls_cart != null){
        this.carrito_logout = JSON.parse(ls_cart);
        this.calcular_carrito();
      }else{
        this.carrito_logout = [];
      }
      
    }

    
  }

  init_zonas(){
    this._guestService.get_Regiones().subscribe(
      response=>{
        this.regiones_arr = response;
      }
    );

    this._guestService.get_Procincias().subscribe(
      response=>{
        this.provincias_arr = response;
      }
    );

    this._guestService.get_Distritos().subscribe(
      response=>{
        this.distritos_arr = response;
      }
    );

    this._guestService.get_Zonas().subscribe(
      response=>{
        let respuesta :Array<any> = response;
        this.zonas = respuesta.sort(function (a, b) {
          if (a.country > b.country) {
            return 1;
          }
          if (a.country < b.country) {
            return -1;
          }
          // a must be equal to b
          return 0;
        }); 
      }
    );
  }

  ngOnInit(): void {
    
  }

  calcular_carrito(){
    this.subtotal = 0;
    if(this.user_lc != undefined){
      if(this.currency == 'PEN'){
        this.carrito_arr.forEach(element => {
            let sub_precio = parseInt(element.producto.precio) * element.cantidad;
            this.subtotal = this.subtotal + sub_precio;
        });
      }else{
        this.carrito_arr.forEach(element => {
          let sub_precio = parseInt(element.producto.precio_dolar) * element.cantidad;
          this.subtotal = this.subtotal + sub_precio;
      });
      }
    }else if(this.user_lc == undefined){
      if(this.currency == 'PEN'){
        this.carrito_logout.forEach(element => {
          let sub_precio = parseInt(element.producto.precio) * element.cantidad;
            this.subtotal = this.subtotal + sub_precio;
        });
      }else{
        this.carrito_logout.forEach(element => {
          let sub_precio = parseInt(element.producto.precio_dolar) * element.cantidad;
            this.subtotal = this.subtotal + sub_precio;
        });
      }
    }
    this.subtotal_const = this.subtotal;
  }

  eliminar_item_guest(item:any){
    this.total_pagar  = 0;
    this.carrito_logout.splice(item._id,1);
    localStorage.removeItem('cart');
    if(this.carrito_logout.length >= 1){
      localStorage.setItem('cart',JSON.stringify(this.carrito_logout));
    }
    if(this.currency == 'PEN'){
      let monto = item.producto.precio*item.cantidad;
      this.subtotal = this.subtotal -monto;
   
    } else if(this.currency != 'PEN'){
      let monto = item.producto.precio_dolar*item.cantidad;
      this.subtotal = this.subtotal -monto;
    }
    this.subtotal_const = this.subtotal;
  }

  select_pais(){
    let str_select_pais = this.str_pais.split('_');
    let pais =str_select_pais[0];
    this.direccion.zona = str_select_pais[1];
    this.direccion.pais = pais;

    if(pais == 'Ecuador'){
      setTimeout(() => {
        $('#sl-region').prop('disabled', false);
      }, 50);
      this._guestService.get_Regiones().subscribe(
        response=>{
          console.log(response);
          response.forEach((element:any) => {
            this.regiones.push({
              id: element.id,
              name: element.name
            });
          });

        }
      );
    }else{
      if(this.direccion.zona == 'Zona 1'){
        this.precio_envio_dolares = 12;
      }else if(this.direccion.zona == 'Zona 2'){
        this.precio_envio_dolares = 18;
      }else if(this.direccion.zona == 'Zona 3'){
        this.precio_envio_dolares = 24;
      }else if(this.direccion.zona == 'Zona 4'){
        this.precio_envio_dolares = 35;
      }
      this.total_pagar = this.subtotal_const + this.precio_envio_dolares;
      setTimeout(() => {
        $('#sl-region').prop('disabled', true);
        $('#sl-provincia').prop('disabled', true);
        $('#sl-distrito').prop('disabled', true);
      }, 50);
      this.regiones = [];
      this.provincias = [];
      this.distritos = [];

      this.direccion.region = '';
      this.direccion.provincia = '';
      this.direccion.distrito = '';
      
    }
  }

  select_region(){
    this.total_pagar  = 0;
    this.provincias = [];
    setTimeout(() => {
      $('#sl-provincia').prop('disabled', false);
      $('#sl-distrito').prop('disabled', true);
    }, 50);
    this.direccion.provincia = '';
    this.direccion.distrito = '';
    console.log(this.direccion.region);
    
    if(this.direccion.region >= 1 && this.direccion.region < 4){
      //this.precio_envio_soles = 10;
      this.precio_envio_dolares = 10;
    }else if(this.direccion.region == 4){
      //this.precio_envio_soles = 15;
      this.precio_envio_dolares = 15;
    }
    //this.total_pagar = this.subtotal_const + this.precio_envio_soles;
    this.total_pagar = this.subtotal_const + this.precio_envio_dolares;
  }

  obtener_carrito(){
    this._guestService.obtener_carrito_cliente(this.user_lc._id,this.token).subscribe(
      response=>{
        this.carrito_arr = response.data;
        this.calcular_carrito();
      }
    );
  }

  eliminar_item(id:any){
    this.total_pagar  = 0;
    this._guestService.eliminar_carrito_cliente(id,this.token).subscribe(
      response=>{
        iziToast.show({
            title: 'SUCCESS',
            titleColor: '#1DC74C',
            color: '#FFF',
            class: 'text-success',
            position: 'topRight',
            message: 'Se eliminó el producto correctamente.'
        });
        this.obtener_carrito();
        this.socket.emit('delete-carrito',{data:response.data});
      }
    );
  }
}
