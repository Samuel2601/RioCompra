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

  public datosventa = {};
  public anio:Array<any>=[];
  constructor(
    private _adminService:AdminService
  ) { }

  ngOnInit(): void { 
    this.load = true;
    this._adminService.obtener_ventas_admin(this.token).subscribe(
      response=>{
        this.ventas = response.data;
        console.log(this.ventas);
        //36.230.233//36.131.233//138.36.233//233.40.36//233.138.36
        for(var i =0; i<this.ventas.length;i++){
          if(i==0){
            
            this.anio.push({
              label:(new Date(this.ventas[i].createdAt).getFullYear()).toString()+' '+this.ventas[i].estado,
              data: [0,0,0,0,0,0,0,0,0,0,0,0],
              backgroundColor:'rgba(54,162,235,0.2)',
              borderColor:'rgba(54,162,235,1)',
              borderWidth:2
            });
            this.anio[0].data[(new Date(this.ventas[i].createdAt).getMonth()-1)]=this.anio[0].data[(new Date(this.ventas[i].createdAt).getMonth()-1)]+this.ventas[i].total_pagar;
           
          }else{
            let aux=(new Date(this.ventas[i].createdAt).getFullYear()).toString()+' '+this.ventas[i].estado;
            let con=-1;
            for(var j=0; j<this.anio.length;j++){
              if((this.anio[j].label).toString()==aux){
                con=j;
              }
            }
            if(con==-1){
              this.anio.push({
                label:(new Date(this.ventas[i].createdAt).getFullYear()).toString()+' '+this.ventas[i].estado,
                data: [0,0,0,0,0,0,0,0,0,0,0,0],
                backgroundColor:'rgba('+(36/(i+1)+54).toString()+','+(230/(i+1)).toString()+',233,0.2)',
                borderColor:'rgba('+(36/(i+1)+54).toString()+','+(230/(i+1)).toString()+',233,1)',
                borderWidth:2
              });
              this.anio[this.anio.length-1].data[(new Date(this.ventas[i].createdAt).getMonth()-1)]=this.anio[this.anio.length-1].data[(new Date(this.ventas[i].createdAt).getMonth()-1)]+this.ventas[i].total_pagar;
              
            }else{
              this.anio[con].data[(new Date(this.ventas[i].createdAt).getMonth()-1)]=this.anio[con].data[(new Date(this.ventas[i].createdAt).getMonth()-1)]+this.ventas[i].total_pagar;
              
            }
          }
      }
        console.log(this.anio);

        this.const_ventas = this.ventas;
        this.load = false;
        var canvas = <HTMLCanvasElement> document.getElementById('myChart');
        var ctx:CanvasRenderingContext2D|any;
        ctx = canvas.getContext('2d');

        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Dicembre'],
                datasets: [
                ]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        this.anio.forEach(element => {    
        myChart.data.datasets.push(element);
        });
        console.log(myChart);
        myChart.update();
       



      }
    );
  }

  filtrar_ventas(){
    if(this.filtro){
      var term = new RegExp(this.filtro.toString().trim() , 'i');
      this.ventas = this.const_ventas.filter(item=>term.test(item._id)||term.test(item.cliente.email)||term.test(item.cliente.apellidos)||term.test(item.dni));
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

