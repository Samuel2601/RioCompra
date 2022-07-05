import { Component, OnInit } from '@angular/core';
import { GLOBAL } from 'src/app/services/GLOBA';
import { GuestService } from 'src/app/services/guest.service';
declare function navigateCarousel():any;

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  public geo : any = {};
  public country = '';
  public currency = 'USD';

  public mas_vendidos : Array<any> = [];
  public producto_destacado_uno :any = null;
  public producto_destacado_dos :any = null;
  public producto_destacado_tres :any = null;
  public producto_destacado_cuatro :any = null;
  public url = GLOBAL.url;

  public new_productos : Array<any> = [];

  constructor(
    private _guestService:GuestService
  ) { 
    let lc_geo :any= localStorage.getItem('geo');
    this.geo = JSON.parse(lc_geo);
    this.country = this.geo.country_name;
    //this.currency = this.geo.currency;
  }

  ngOnInit(): void {
    var head= document.getElementsByTagName('head')[0];
    var script= document.createElement('script');
    script.src= 'assets/js/main.js';
    head.appendChild(script);
    
    this.init_productos_destacados();
    this.init_productos_nuevos();
  }

  init_productos_destacados(){
    this._guestService.listar_productos_destacados_publico().subscribe(
      response=>{
        this.mas_vendidos = response.data;
        console.log(this.mas_vendidos);


          if(this.mas_vendidos[0] != undefined && this.mas_vendidos[0].producto.estado!="Edicion"){
            this.producto_destacado_uno =this.mas_vendidos[0];
          }else{
            this.producto_destacado_uno = null;
          }
          if(this.mas_vendidos[1] != undefined && this.mas_vendidos[1].producto.estado!="Edicion"){
            this.producto_destacado_dos =this.mas_vendidos[1];
          }else{
            this.producto_destacado_dos = null;
          }
          if(this.mas_vendidos[2] != undefined && this.mas_vendidos[2].producto.estado!="Edicion"){
            this.producto_destacado_tres =this.mas_vendidos[2];
          }else{
            this.producto_destacado_tres = null;
          }
          if(this.mas_vendidos[3] != undefined && this.mas_vendidos[3].producto.estado!="Edicion"){
            this.producto_destacado_cuatro =this.mas_vendidos[3];
          }else{
            this.producto_destacado_cuatro = null;
          }

        
       
      }
    );
  }

  init_productos_nuevos(){
    this._guestService.listar_productos_nuevos_publico().subscribe(
      response=>{
        console.log(response);
        
        this.new_productos = response.data;
      }
    );
  }

}
