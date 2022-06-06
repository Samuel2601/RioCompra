import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { GLOBAL } from "./GLOBAL";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  public url;

  constructor(
    private _http : HttpClient,
  ) {
    this.url = GLOBAL.url;
  }

  login_admin(data:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.post(this.url + 'login_admin',data,{headers:headers});
  }

  listar_clientes_tienda(token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    console.log(headers);
    return this._http.get(this.url + 'listar_clientes_tienda',{headers:headers});
  }

  get_categorias():Observable<any>{
    return this._http.get('./assets/categorias.json');
  }

  listar_etiquetas_admin(token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url + 'listar_etiquetas_admin',{headers:headers});
  }

  eliminar_etiqueta_admin(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.delete(this.url + 'eliminar_etiqueta_admin/'+id,{headers:headers});
  }

  agregar_etiqueta_admin(data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.post(this.url+'agregar_etiqueta_admin',data,{headers:headers});
  }

  registro_producto_admin(data:any,file:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Authorization':token});
    const fd = new FormData();
    fd.append('titulo',data.titulo);
    fd.append('etiquetas',JSON.stringify(data.etiquetas));
    fd.append('precio',data.precio);
    fd.append('precio_dolar',data.precio_dolar);
    fd.append('peso',data.peso);
    fd.append('sku',data.sku);
    fd.append('descripcion',data.descripcion);
    fd.append('contenido',data.contenido);
    fd.append('categoria',data.categoria);
    fd.append('visibilidad',data.visibilidad);
    fd.append('tallas_str','');
    fd.append('portada',file);
    return this._http.post(this.url+'registro_producto_admin',fd,{headers:headers});
  }

  listar_productos_admin(token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url + 'listar_productos_admin',{headers:headers});
  }

  obtener_producto_admin(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url + 'obtener_producto_admin/'+id,{headers:headers});
  }

  listar_etiquetas_producto_admin(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url + 'listar_etiquetas_producto_admin/'+id,{headers:headers});
  }

  eliminar_etiqueta_producto_admin(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.delete(this.url + 'eliminar_etiqueta_producto_admin/'+id,{headers:headers});
  }

  agregar_etiqueta_producto_admin(data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.post(this.url+'agregar_etiqueta_producto_admin',data,{headers:headers});
  }

  actualizar_producto_admin(data:any,id:any,token:any):Observable<any>{
    if(data.portada){
      let headers = new HttpHeaders({'Authorization':token});

      const fd = new FormData();
      fd.append('titulo',data.titulo);
      fd.append('stock',data.stock);
      fd.append('precio_antes_soles',data.precio_antes_soles);
      fd.append('precio_antes_dolares',data.precio_antes_dolares);
      fd.append('precio',data.precio);
      fd.append('precio_dolar',data.precio_dolar);
      fd.append('peso',data.peso);
      fd.append('sku',data.sku);
      fd.append('descripcion',data.descripcion);
      fd.append('contenido',data.contenido);
      fd.append('categoria',data.categoria);
      fd.append('portada',data.portada);

      return this._http.put(this.url+'actualizar_producto_admin/'+id,fd,{headers:headers});
    }else{
      let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
      return this._http.put(this.url+'actualizar_producto_admin/'+id,data,{headers:headers});
    }
  }

  listar_variedades_admin(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url + 'listar_variedades_admin/'+id,{headers:headers});
  }

  actualizar_producto_variedades_admin(data:any,id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.put(this.url+'actualizar_producto_variedades_admin/'+id,data,{headers:headers});
  }

  eliminar_variedad_admin(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.delete(this.url+'eliminar_variedad_admin/'+id,{headers:headers});
  }

  agregar_nueva_variedad_admin(data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.post(this.url+'agregar_nueva_variedad_admin',data,{headers:headers});
  }

  listar_inventario_producto_admin(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'listar_inventario_producto_admin/'+id,{headers:headers});
  }

  registro_inventario_producto_admin(data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.post(this.url+'registro_inventario_producto_admin',data,{headers:headers});
  }

  agregar_imagen_galeria_admin(id:any,data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Authorization':token});

    const fd = new FormData();
    fd.append('_id',data._id);
    fd.append('imagen',data.imagen);
    return this._http.put(this.url+'agregar_imagen_galeria_admin/'+id,fd,{headers:headers});
  }

  eliminar_imagen_galeria_admin(id:any,data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.put(this.url+'eliminar_imagen_galeria_admin/'+id,data,{headers:headers});
  }

  verificar_token(token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'verificar_token',{headers:headers});
  }
  obtener_ip_admin():Observable<any>{
    return this._http.get('https://api.ipify.org/?format=json');
  }
  obtener_data_admin(ip:any):Observable<any>{
    return this._http.get('https://ipapi.co/'+ip+'/json');
  }

  registro_cupon_admin(data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.post(this.url+'registro_cupon_admin',data,{headers:headers});
  }

  listar_cupones_admin(token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url + 'listar_cupones_admin',{headers:headers});
  }

  obtener_cupon_admin(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url + 'obtener_cupon_admin/'+id,{headers:headers});
  }

  actualizar_cupon_admin(id:any,data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.put(this.url+'actualizar_cupon_admin/'+id,data,{headers:headers});
  }

  eliminar_cupon_admin(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.delete(this.url + 'eliminar_cupon_admin/'+id,{headers:headers});
  }

  cambiar_vs_producto_admin(id:any,estado:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'cambiar_vs_producto_admin/'+id+'/'+estado,{headers:headers});
  }

  obtener_config_admin():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url + 'obtener_config_admin',{headers:headers});
  }

  actualizar_config_admin(data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.put(this.url + 'actualizar_config_admin',data,{headers:headers});
  }

  isAuthenticate(){
    const token : any = localStorage.getItem('token');
  
    try {
      const helper = new JwtHelperService();
      var decodedToken = helper.decodeToken(token);

      if(!token){
        localStorage.clear();
        return false;
      }

      if(!decodedToken){
        localStorage.clear();
        return false;
      }
    
      if(helper.isTokenExpired(token)){
        localStorage.clear();
        return false;
      }

    } catch (error) {
      console.log(error);
      
      localStorage.clear();
      return false;
    }

    return true;
  }

  obtener_ventas_admin(token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'obtener_ventas_admin',{headers:headers});
  }

  obtener_detalles_ordenes_cliente(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'obtener_detalles_ordenes_cliente/'+id,{headers:headers});
  }

  obtenerPago(id:any):Observable<any>{
    let headers = new HttpHeaders()
    .set('Content-Type','application/json')
    .set('Authorization','Bearer TEST-1565437970717712-100416-3da5767dad6b8dfef6c0563925dadf81-612621626');
    return this._http.get('https://api.mercadopago.com/v1/payments/'+id,{headers:headers});
  }

  marcar_finalizado_orden(id:any,data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.put(this.url+'marcar_finalizado_orden/'+id,data,{headers:headers});
  }

  eliminar_orden_admin(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.delete(this.url+'eliminar_orden_admin/'+id,{headers:headers});
  }
  marcar_envio_orden(id:any,data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.put(this.url+'marcar_envio_orden/'+id,data,{headers:headers});
  }

  confirmar_pago_orden(id:any,data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.put(this.url+'confirmar_pago_orden/'+id,data,{headers:headers});
  }

  obtener_direccion_todos_cliente(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'obtener_direccion_todos_cliente/'+id,{headers:headers});
  }

  registro_compra_manual_cliente(data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.post(this.url+'registro_compra_manual_cliente',data,{headers:headers});
  }

  listar_variedades_productos_admin(token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'listar_variedades_productos_admin',{headers:headers});
  }
}
