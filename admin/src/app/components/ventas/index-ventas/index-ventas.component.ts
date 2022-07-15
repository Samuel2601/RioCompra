import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/service/admin.service';
import Chart from 'chart.js/auto';
@Component({
  selector: 'app-index-ventas',
  templateUrl: './index-ventas.component.html',
  styleUrls: ['./index-ventas.component.css']
})
export class IndexVentasComponent implements OnInit {

  public ventas : Array<any>=[];
  public const_ventas : Array<any>=[];
  public token = localStorage.getItem('token');
  public page = 1;
  public pageSize = 24;
  public filtro = '';
  public desde :any = undefined;
  public hasta :any = undefined;
  public load = false;
  public encargado:any;
  public datosventa = {};
  public anio:Array<any>=[];
  public rol: any;
  public idp: any;
  public yo: number=0;
  constructor(
    private _adminService:AdminService
  ) { }

  ngOnInit(): void { 
    this.yo = 0;
    this.load = true;
    this._adminService.obtener_ventas_admin(this.token).subscribe(
      response=>{
        this.ventas = response.data;
        console.log(this.ventas);
        //36.230.233//36.131.233//138.36.233//233.40.36//233.138.36
       

        this.const_ventas = this.ventas;
        let aux = localStorage.getItem("identity");
        this._adminService.obtener_admin(aux, this.token).subscribe((response) => {
          this.rol = response.data.rol;
          this.idp = response.data._id;
          if (response.data.email == "samuel.arevalo@espoch.edu.ec") {
            this.yo = 1;
          }
        });
        this.load = false;
        


      }
    );
  }

  filtrar_ventas(){
    if(this.filtro){
      var term = new RegExp(this.filtro.toString().trim() , 'i');
      this.ventas = this.const_ventas.filter(
        item=>term.test(item._id)||
        term.test(item.cliente.email)||
        term.test(item.cliente.nombres+' '+item.cliente.apellidos)||
        term.test(item.cliente.apellidos+' '+item.cliente.nombres.nombres)||
        term.test(item.cliente.nombres)||
        term.test(item.cliente.apellidos)||
        term.test(item.estado)||
        term.test(item.metodo_pago)||
        term.test(item.dni));
    }else{
      this.ventas = this.const_ventas;
    }
  }

  filtrar_fechas(){

    if(this.desde||this.hasta){
      this.ventas = [];
      let tt_desde = Date.parse(new Date(this.desde+'T00:00:00').toString())/1000;
      let tt_hasta = Date.parse(new Date(this.hasta+'T23:59:59').toString())/1000;

      for(var item of this.const_ventas){
          var tt_created = Date.parse(new Date(item.createdAt).toString())/1000;
          if(tt_created >= tt_desde && tt_created <= tt_hasta){
              this.ventas.push(item);
          }
      }

    }else{
      this.ventas = this.const_ventas;
    }
  }

  reset_data(){
    this.desde = '';
    this.hasta = '';
    this.ventas = this.const_ventas;
  }

  eliminar(id:any){}
  /* if(desde == 'undefined' && hasta == 'undefined'){
                
  }else{
      let tt_desde = Date.parse(new Date(desde+'T00:00:00'))/1000;
      let tt_hasta = Date.parse(new Date(hasta+'T23:59:59'))/1000;

      let tem_ventas = await Venta.find().populate('cliente').populate('direccion').sort({createdAt:-1});

      for(var item of tem_ventas){
          var tt_created = Date.parse(new Date(item.createdAt))/1000;
          if(tt_created >= tt_desde && tt_created <= tt_hasta){
              ventas.push(item);
          }
      }

      res.status(200).send({data:ventas});
  } */
}

