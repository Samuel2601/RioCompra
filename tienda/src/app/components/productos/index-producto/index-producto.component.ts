import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

declare var noUiSlider:any;
declare var $:any;
import { io } from "socket.io-client";
import { GLOBAL } from 'src/app/services/GLOBA';
import { GuestService } from 'src/app/services/guest.service';
declare var iziToast:any;

@Component({
  selector: 'app-index-producto',
  templateUrl: './index-producto.component.html',
  styleUrls: ['./index-producto.component.css']
})
export class IndexProductoComponent implements OnInit {

  //GEO
  public geo : any = {};
  public country = '';
  public currency = 'USD';
  public user_lc : any = undefined;

  public token :any = '';

  public categorias :Array<any> = [];
  public filter_cat_tallas = 'todos';
  public mas_vendidos :Array<any> =[];
  public url =GLOBAL.url;

  public productos : Array<any> =[];
  public productos_const : Array<any> =[];
  public sort_by = 'Defecto';
  public page = 1;
  public pageSize = 15;

  public route_categoria = '';
  public filtro_search = '';
  public load_data = false;

  constructor(
    private _guestService:GuestService,
    private _route:ActivatedRoute,
    private _router:Router
  ) { 
    let obj_lc :any= localStorage.getItem('user_data');
    this.user_lc = JSON.parse(obj_lc);

    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;

    let lc_geo :any= localStorage.getItem('geo');
    this.geo = JSON.parse(lc_geo);
    this.country = this.geo.country_name;
    //this.currency = this.geo.currency;

    this._guestService.get_categorias().subscribe(
      response=>{
        this.categorias = response;
        console.log(response);
        
      }
    );
  }

  ngOnInit(): void {
    setTimeout(() => {
      var slider : any = document.getElementById('ps-sliderr');

      noUiSlider.create(slider, {
          start: [0, 1000],
          connect: true,
          range: {
              'min': 0,
              'max': 300
          },
          tooltips: [true,true],
       
      })

      slider.noUiSlider.on('update', function (values:any) {
          $('.ps-slider__min').text(values[0]);
          $('.ps-slider__max').text(values[1]);
      });
      $('.noUi-tooltip').css('font-size','11px');
    }, 150);

    this._guestService.listar_productos_destacados_publico().subscribe(
      response=>{
        this.mas_vendidos = response.data;

      }
    );

    this._route.params.subscribe(
      params=>{
        this.route_categoria = params['categoria'];
        
        if(this.route_categoria){
          this.productos = [];
          this._guestService.listar_productos_publico().subscribe(
            response=>{
              for(var item of response.data){
                item.producto.variedades = item.variedades,
                this.productos.push(item.producto);
              }
              this.productos_const = this.productos;

              let categoria = this.categorias.filter(item=>item.slug==this.route_categoria);

              this.productos = this.productos_const.filter(item=>item.categoria==categoria[0]._id);
              this.load_data = false;

            }
          );
        }else{
          this._route.queryParams.subscribe(
            (params: Params)=>{
              this.filtro_search = params.filter;

              if(this.filtro_search){
                console.log(1);
                this.productos = [];
                this._guestService.listar_productos_publico().subscribe(
                  response=>{
                    
                    for(var item of response.data){
                      item.producto.variedades = item.variedades,
                      this.productos.push(item.producto);
                    }
                    this.productos_const = this.productos;
                    
                    var term = new RegExp(this.filtro_search.toString().trim() , 'i');
                    this.productos = this.productos_const.filter(item=>term.test(item.titulo));
                    this.load_data = false;

                  }
                );
              }else{
                console.log(2);
                this.productos = [];
                this._guestService.listar_productos_publico().subscribe(
                  response=>{
        
                    for(var item of response.data){
                      item.producto.variedades = item.variedades,
                      this.productos.push(item.producto);
                    }
                 
                    this.productos_const = this.productos;
                    this.load_data = false;
                  }
                );
              }
            }
          )
         
        }
        
      }
    );
  }

  buscar_por_categoria(cat:any){
    if(cat == 'todos'){
      this.productos = this.productos_const;
      this._router.navigate(['/productos']);
    }else{
      this.productos = this.productos_const.filter(item=>item.categoria==cat);
    }
  }

  buscar_precios(){
    let min =  parseInt($('.ps-slider__min').text());
    let max = parseInt($('.ps-slider__max').text());
    this.productos = this.productos_const.filter((item)=>{
      return item.precio >= min &&
              item.precio <= max
    });

  }

  buscar_por_talla(){
    if(this.filter_cat_tallas == 'todos'){
      this.productos = this.productos_const;
    }else{
      this.productos = [];
      for(var item of this.productos_const){

        for(var subitem of item.variedades){
          if(subitem.valor == this.filter_cat_tallas){
            this.productos.push(item);
          }
        }
      }
    }
  }

  orden_por(){
    if(this.sort_by == 'Defecto'){

      this.productos = this.productos_const;
    }else if(this.sort_by == '+-Precio'){
      this.productos.sort(function (a, b) {
        
        if (a.precio < b.precio) {
          return 1;
        }
        if (a.precio > b.precio) {
          return -1;
        }
        // a must be equal to b
        return 0;
      });
    }else if(this.sort_by == '-+Precio'){
      this.productos.sort(function (a, b) {
        
        if (a.precio > b.precio) {
          return 1;
        }
        if (a.precio < b.precio) {
          return -1;
        }
        // a must be equal to b
        return 0;
      });
    }else if(this.sort_by == 'azTitulo'){
      this.productos.sort(function (a, b) {
        
        if (a.titulo > b.titulo) {
          return 1;
        }
        if (a.titulo < b.titulo) {
          return -1;
        }
        // a must be equal to b
        return 0;
      });
    }else if(this.sort_by == 'zaTitulo'){
      this.productos.sort(function (a, b) {
        
        if (a.titulo < b.titulo) {
          return 1;
        }
        if (a.titulo > b.titulo) {
          return -1;
        }
        // a must be equal to b
        return 0;
      });
    }
  }

  agregar_producto(producto:any){}

  agregar_producto_guest(producto:any){}
}
