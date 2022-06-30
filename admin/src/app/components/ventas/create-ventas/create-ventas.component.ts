import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/service/admin.service';
declare var $:any;
declare var iziToast:any;

@Component({
  selector: 'app-create-ventas',
  templateUrl: './create-ventas.component.html',
  styleUrls: ['./create-ventas.component.css']
})
export class CreateVentasComponent implements OnInit {

  public geo : any = {};
  public country = '';
  public currency = 'USD';

  public load_btn = false;

  public clientes_const:Array<any> = [];
  public load_data = false;
  public token = localStorage.getItem('token');

  public filtro_cliente = '';
  public clientes:Array<any> = [];
  public pageCliente = 1;
  public pageSizeCliente = 20;
  public load_clientes = false;

  public direcciones:Array<any> = [];
  public pageDireccion = 1;
  public pageSizeDireccion = 20;
  public load_direcciones = false;
  public direccion_select : any = {};

  
  public variedades:Array<any> = [];
  public variedades_const:Array<any> = [];
  public pageVariedad = 1;
  public pageSizeVariedad = 20;
  public load_variedades= false;
  public producto_select :any= undefined;
  public auxneto=0;
  public cantidad = 1;
  public venta :any = {
    metodo_pago: ''
  };
  public dventa:Array<any> = [];

  public total_pagar = 0;
  public envio_input = 0;
  public neto_pagar = 0;
  public filtro_producto = '';
  public descuento = 0;
  public descuento_aplicado = 0;
  constructor(
    private _adminService:AdminService,
    private _router:Router
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

    this.init_cliente();
    this.init_productos();
  }

  init_cliente(){
    this.load_clientes = true;
    this._adminService.listar_clientes_tienda(this.token).subscribe(
      response=>{
        
        this.clientes = response.data;
        this.clientes_const = this.clientes;

        this.load_clientes = false;
        
      },
      error=>{
        console.log(error);
        
      }
    );
  }

  func_filtro_cliente(){
    if(this.filtro_cliente){
      var term = new RegExp(this.filtro_cliente.toString().trim() , 'i');
      this.clientes = this.clientes_const.filter(item=>term.test(item.nombres)||term.test(item.apellidos)||term.test(item.email)||term.test(item.dni));
    }else{
      this.clientes = this.clientes_const;
    }
  }

  func_filtro_producto(){
    
    if(this.filtro_producto){
      var term = new RegExp(this.filtro_producto.toString().trim() , 'i');
      this.variedades = this.variedades_const.filter(item=>term.test(item.producto));
    }else{
      this.variedades = this.variedades_const;
    }
  }

  select_cliente(item:any){
    this.venta.cliente = item._id;
    $('#modalCliente').modal('hide');
    $('#input-cliente').val(item.nombres+' '+item.apellidos);
    this.init_direcciones(item._id);
  }

  init_direcciones(id:any){
    this.load_direcciones = true;
    this._adminService.obtener_direccion_todos_cliente(id,this.token).subscribe(
      response=>{
        this.direcciones = response.data;
        this.load_direcciones = false;
        console.log(this.direcciones);
      }
    );
  }

  select_direccion(item:any){
    this.direccion_select = item;
    this.venta.direccion = item._id;
    $('#modalDireccion').modal('hide');
    $('#input-direccion').val(item.direccion);
    this.calcular_envio();
  }

  init_productos(){
    this.load_variedades = true;
    this._adminService.listar_variedades_productos_admin(this.token).subscribe(
      response=>{
          
          response.data.forEach((element:any) => {
              this.variedades.push({
                idvariedad: element._id,
                idproducto: element.producto._id,
                producto:element.producto.titulo,
                categoria: element.producto.categoria,
                variedad: element.valor,
                cantidad: element.stock,
                precio_soles: element.producto.precio,
                precio_dolar: element.producto.precio_dolar,
                nventas : element.producto.nventas,
              })
          });     
          this.variedades_const = this.variedades;
          this.load_variedades = false;    
      },
      error=>{
        console.log(error);
        
      }
    )
  }

  select_producto(item:any){
    this.producto_select = item;
    console.log(this.producto_select);
    $('#modalProducto').modal('hide');
    $('#input-producto').val(item.producto);
  }

  addProducto(){
    var con=0;
    if(this.geo.currency!="USD"){
      if(this.producto_select != undefined){
        if(this.cantidad >= 1){
          con=0;
          this.dventa.forEach((element:any) => {
            if(element.titulo_producto==this.producto_select.producto && element.variedad == this.producto_select.idvariedad){
              con=element.cantidad+con;
            }
          });
          console.log(con);
          if((this.cantidad+con)<= this.producto_select.cantidad){
            
            this.dventa.push({
              titulo_producto: this.producto_select.producto,
              precio_und: this.producto_select.precio_soles,
              titulo_variedad: this.producto_select.variedad,
              producto: this.producto_select.idproducto,
              subtotal: this.producto_select.precio_soles * this.cantidad,
              variedad: this.producto_select.idvariedad,
              cantidad: this.cantidad
            });
            console.log( this.dventa);
            this.total_pagar = this.total_pagar + (this.producto_select.precio_soles * this.cantidad);
            this.neto_pagar = this.neto_pagar + (this.producto_select.precio_soles * this.cantidad);
          }else{
            iziToast.show({
                title: 'ERROR',
                titleColor: '#FF0000',
                color: '#FFF',
                class: 'text-danger',
                position: 'topRight',
                message: 'La cantidad sobrepasa el stock'
            });
          }
        }else{
          iziToast.show({
              title: 'ERROR',
              titleColor: '#FF0000',
              color: '#FFF',
              class: 'text-danger',
              position: 'topRight',
              message: 'Ingrese un valor valido en la cantidad'
          });
        }
      }else{
        iziToast.show({
          title: 'ERROR',
          titleColor: '#FF0000',
          color: '#FFF',
          class: 'text-danger',
          position: 'topRight',
          message: 'Seleccione el producto'
      });
      }
    }else{
      if(this.producto_select != undefined){
        if(this.cantidad >= 1){
          console.log("Producto ingresado:",this.producto_select.producto);
          con=0;
          this.dventa.forEach((element:any) => {
            if(element.titulo_producto==this.producto_select.producto && element.variedad == this.producto_select.idvariedad){
              con=element.cantidad+con;
            }
          });
          console.log(con);
          if((this.cantidad+con)<= this.producto_select.cantidad){
            this.dventa.push({
              titulo_producto: this.producto_select.producto,
              precio_und: this.producto_select.precio_dolar,
              titulo_variedad: this.producto_select.variedad,
              producto: this.producto_select.idproducto,
              subtotal: this.producto_select.precio_dolar * this.cantidad,
              variedad: this.producto_select.idvariedad,
              cantidad: this.cantidad
            });
            console.log( this.dventa);
            this.total_pagar = this.total_pagar + (this.producto_select.precio_dolar * this.cantidad);
            this.neto_pagar = this.neto_pagar + (this.producto_select.precio_dolar * this.cantidad);
          }else{
            iziToast.show({
                title: 'ERROR',
                titleColor: '#FF0000',
                color: '#FFF',
                class: 'text-danger',
                position: 'topRight',
                message: 'La cantidad sobrepasa el stock'
            });
          }
        }else{
          iziToast.show({
              title: 'ERROR',
              titleColor: '#FF0000',
              color: '#FFF',
              class: 'text-danger',
              position: 'topRight',
              message: 'Ingrese un valor valido en la cantidad'
          });
        }
      }else{
        iziToast.show({
          title: 'ERROR',
          titleColor: '#FF0000',
          color: '#FFF',
          class: 'text-danger',
          position: 'topRight',
          message: 'Seleccione el producto'
      });
      }
    }
        


  }

  calcular_envio(){
    this.neto_pagar = this.neto_pagar - this.envio_input;
    if(this.direccion_select.pais != 'Ecuador'){
      if(this.direccion_select.zona == 'Zona 1'){
        this.envio_input = 12;
      }else if(this.direccion_select.zona == 'Zona 2'){
        this.envio_input = 18;
      }else if(this.direccion_select.zona == 'Zona 3'){
        this.envio_input = 24;
      }else if(this.direccion_select.zona == 'Zona 4'){
        this.envio_input = 35;
      }
    }else if(this.direccion_select.pais == 'Ecuador'){
      if(this.direccion_select.region == 'Lima'){
        this.envio_input = 10;
      }else if(this.direccion_select.region != 'Lima'){
        this.envio_input = 15;
      }
    }

    this.neto_pagar = this.neto_pagar + this.envio_input;
  }

  quitar(id:any,precio:any){
    this.dventa.splice(id,1);
    this.total_pagar = this.total_pagar - precio;
    this.neto_pagar = this.neto_pagar - precio;
  }

  registrar_venta(){
    this.venta.envio_precio = this.envio_input;
    this.venta.subtotal = this.neto_pagar - this.venta.envio_precio;
    this.venta.total_pagar = this.neto_pagar;
    this.venta.currency = 'USD'
    //this.venta.currency = this.geo.currency;
    this.venta.transaccion = 'VENTAMANUAL';

    this.venta.detalles = this.dventa;
    this.venta.valor_descuento = this.descuento;
    if(this.descuento != 0){
      this.venta.tipo_descuento = 'Valor fijo';
    }else{
      this.venta.tipo_descuento = '';
    }
    
    if(!this.venta.cliente){
      iziToast.show({
          title: 'ERROR',
          titleColor: '#FF0000',
          color: '#FFF',
          class: 'text-danger',
          position: 'topRight',
          message: 'Debe seleccionar al cliente.'
      });
    }else if(!this.venta.direccion){
      iziToast.show({
          title: 'ERROR',
          titleColor: '#FF0000',
          color: '#FFF',
          class: 'text-danger',
          position: 'topRight',
          message: 'Debe seleccionar la dirección.'
      });
    }else if(!this.venta.metodo_pago){
      iziToast.show({
          title: 'ERROR',
          titleColor: '#FF0000',
          color: '#FFF',
          class: 'text-danger',
          position: 'topRight',
          message: 'Debe seleccionar el metodo de pago.'
      });
    }
    else if(this.dventa.length == 0){
      iziToast.show({
          title: 'ERROR',
          titleColor: '#FF0000',
          color: '#FFF',
          class: 'text-danger',
          position: 'topRight',
          message: 'Debe agregar al menos un producto a la venta.'
      });
    }else{
      this.load_btn = true;
      //console.log(this.venta);

      this._adminService.registro_compra_manual_cliente(this.venta,this.token).subscribe(
        response=>{
          this.load_btn = false;
          this._router.navigate(['/ventas']);
        }
      );
      
    }

  }

  aplicarDescuento(){

    if(this.neto_pagar >= 0){
      if(this.descuento_aplicado==0){
        this.auxneto=this.neto_pagar;
      }else{
        this.neto_pagar=this.auxneto;
      }

      if(this.descuento <= this.neto_pagar){
          if(this.descuento!=this.descuento_aplicado){

            this.descuento_aplicado=this.descuento;
            this.neto_pagar = this.neto_pagar - this.descuento;
          }

      }else{
        this.descuento=0;
        iziToast.show({
            title: 'ERROR',
            titleColor: '#FF0000',
            color: '#FFF',
            class: 'text-danger',
            position: 'topRight',
            message: 'El descuento no debe superar el monto total.'
        });
      }
    }
  }

}
