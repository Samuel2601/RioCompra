import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GuestService } from 'src/app/services/guest.service';

@Component({
  selector: 'app-verify-pago',
  templateUrl: './verify-pago.component.html',
  styleUrls: ['./verify-pago.component.css']
})
export class VerifyPagoComponent implements OnInit {

  public geo : any = {};
  public country = '';
  public currency = 'USD';

  public tipo = '';
  public cupon = '';
  public load = true;

  public venta : any = {};
  public dventa : Array<any> = [];
  public carrito_arr:Array<any> = [];
  public payment_id = '';
  public subtotal = 0;
  public total_pagar = 0;
 
  public idcliente :any = '';
  public token :any  = '';
  public direccion_principal : any = {};
  public direccion = '';
  public envio = 0;
  public tipo_descuento = 0;
  public valor_descuento = 0;

  constructor(
    private _route:ActivatedRoute,
    private _guestService:GuestService,
    private _router:Router
  ) {
    let lc_geo :any= localStorage.getItem('geo');
    this.geo = JSON.parse(lc_geo);
    this.country = this.geo.country_name;
    //this.currency = this.geo.currency;
    this.idcliente = localStorage.getItem('_id');
    this.venta.cliente = this.idcliente;
    this.token = localStorage.getItem('token');
   }

  ngOnInit(): void {
    this._route.params.subscribe(
      params=>{
        this.tipo = params['tipo'];
        this.direccion = params['direccion'];
        this.cupon = params['cupon'];
        this.envio = parseInt(params['envio']);
        this.tipo_descuento = params['tipo_descuento'];
        this.valor_descuento = parseInt(params['valor_descuento']);
        this.total_pagar = parseInt(params['total_pagar']);
        this.subtotal = parseInt(params['subtotal']);
        
        if(this.tipo == 'success'){
          this._route.queryParams.subscribe(
            (params: Params)=>{
              this.payment_id = params.payment_id;
              this._guestService.consultarIDPago(this.payment_id,this.token).subscribe(
                response=>{
                  console.log(response);
                    if(response.data.length == 0){
                      this._guestService.obtener_carrito_cliente(this.idcliente,this.token).subscribe(
                        response=>{
                          this.carrito_arr = response.data;
                          console.log(this.carrito_arr);

                          this.carrito_arr.forEach(element => {  
                            this.dventa.push({
                              producto: element.producto._id,
                              subtotal: element.producto.precio,
                              variedad: element.variedad._id,
                              cantidad: element.cantidad,
                              cliente: localStorage.getItem('_id')
                            });
                          });

                          this.venta.tipo_descuento = this.tipo_descuento;
                          this.venta.valor_descuento = this.valor_descuento;
                          this.venta.direccion = this.direccion;
                          this.venta.cupon = this.cupon;
                          this.venta.transaccion = this.payment_id;
                          this.venta.currency = 'PEN';
                          this.venta.subtotal = this.subtotal;
                          this.venta.total_pagar = this.total_pagar;
                          this.venta.envio_precio = this.envio;
                          this.venta.detalles = this.dventa;
                          this.venta.metodo_pago = 'Tarjeta de crédito';


                          this._guestService.registro_compra_cliente(this.venta,this.token).subscribe(
                            response=>{
                              console.log(response);
                              this._router.navigate(['/cuenta/pedidos',response.data._id]);
                            }
                          );

                        }
                      );

                      
                      
                    }
                    else{
                      this.tipo = 'failure';
                      this.load = false;
                    }
                }
              );
            }
          )
        }else{
          this.load = false;
        }
      }
    );
  }

}
