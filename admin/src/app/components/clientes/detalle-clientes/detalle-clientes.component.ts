import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/service/admin.service';
import Chart from 'chart.js/auto';
@Component({
  selector: 'app-detalle-clientes',
  templateUrl: './detalle-clientes.component.html',
  styleUrls: ['./detalle-clientes.component.css']
})
export class DetalleClientesComponent implements OnInit {

  public clientes :Array<any>= [];
  public clientes_const  :Array<any>= [];
  public token = localStorage.getItem('token');
  public page = 1;
  public pageSize = 24;
  public filtro = '';
  public id:any;
  public myChart:any;
  public data:Array<any> = [];
  public totales:Array<any>= [];
  public gasto:any;
  public datos_cliente: Array<any>= [];
  constructor(
    private _route:ActivatedRoute,
    private _adminService:AdminService
  ) { }

  ngOnInit(): void {
    this.datos_cliente=[];
    this._route.params.subscribe(
      params=>{
        this.id = params['id'];
        this._adminService.listar_clientes_tienda(this.token).subscribe(
          response=>{
            console.log(response.data);
            for(var i=0; i<response.data.length;i++){
              if(this.id==response.data[i]._id){
                this.datos_cliente = response.data;
                i=response.data.length;
              }
            }
            console.log(this.datos_cliente);
            this._adminService.obtener_ordenes_cliente(this.id,this.token).subscribe(
              response=>{
                console.log(response);
                
                this.clientes_const = response.data;
                this.clientes= this.clientes_const;
                console.log(this.clientes);
                this.armado();
              }
            );
          }
        );
        
        
      }
    );

    
  }
  armado(){
    this.gasto=0;
    this.data=[];
    this.totales=[];
    for(var i=0;i<this.clientes.length;i++){
      if(i==0){
        var r = Math.floor(Math.random() * 256);
              var g = Math.floor(Math.random() * 256);
              var b = Math.floor(Math.random() * 256);
              this.data.push({
                label:(new Date(this.clientes[i].createdAt).getFullYear()).toString()+' '+this.clientes[i].estado,
                data: [0,0,0,0,0,0,0,0,0,0,0,0],
                backgroundColor:'rgba('+r+','+g+','+b+',0.2)',
                borderColor:'rgba('+r+','+g+','+b+',1)',
                borderWidth:2
              });
              this.data[0].data[(new Date(this.clientes[i].createdAt).getMonth())]=this.data[0].data[(new Date(this.clientes[i].createdAt).getMonth())]+this.clientes[i].total_pagar;
             
      }else{
        let aux=(new Date(this.clientes[i].createdAt).getFullYear()).toString()+' '+this.clientes[i].estado;
              let con=-1;
              for(var j=0; j<this.data.length;j++){
                if((this.data[j].label).toString()==aux){
                  con=j;
                  j=this.data.length;
                }
              }
              if(con==-1){
                var r = Math.floor(Math.random() * 256);
                var g = Math.floor(Math.random() * 256);
                var b = Math.floor(Math.random() * 256);
                this.data.push({
                  label:(new Date(this.clientes[i].createdAt).getFullYear()).toString()+' '+this.clientes[i].estado,
                  data: [0,0,0,0,0,0,0,0,0,0,0,0],
                  backgroundColor:'rgba('+r+','+g+','+b+',0.2)',
                  borderColor:'rgba('+r+','+g+','+b+',1)',
                  borderWidth:2
                });
                this.data[this.data.length-1].data[(new Date(this.clientes[i].createdAt).getMonth())]=this.data[this.data.length-1].data[(new Date(this.clientes[i].createdAt).getMonth())]+this.clientes[i].total_pagar;
                
              }else{
                this.data[con].data[(new Date(this.clientes[i].createdAt).getMonth())]=this.data[con].data[(new Date(this.clientes[i].createdAt).getMonth())]+this.clientes[i].total_pagar;
                
              }
      }
      
    }

    var canvas = <HTMLCanvasElement> document.getElementById('myChart');
        var ctx:CanvasRenderingContext2D|any;
        ctx = canvas.getContext('2d');
        if(this.myChart){
          this.myChart.destroy();
        }
        this.myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                datasets: [ ]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        console.log(this.data);
        console.log(this.myChart.data);
        this.data.forEach((element:any) => {    
        this.myChart.data.datasets.push(element);
        var aux=0;
        element.data.forEach((sum:any) => {
          aux+=sum;
        });
        this.totales.push({label:element.label,total:aux});
        });
       // console.log(myChart);
        console.log(this.totales);
        this.totales.forEach((element:any) => {
          this.gasto+=element.total;
        });

        this.myChart.update();
  }

  filtrar_cliente(){
    if(this.filtro){
      var term = new RegExp(this.filtro.toString().trim() , 'i');
      this.clientes = this.clientes_const.filter(
        item=>term.test(item.estado)||
        term.test(item.metodo_pago)||
        term.test(item.tracking)||
        term.test(item._id)||
        term.test(item.createdAt)
        );
    }else{
      this.clientes = this.clientes_const;
    }
    this.armado();
  }

}
