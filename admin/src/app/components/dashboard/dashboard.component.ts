import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/service/admin.service';
import Chart from 'chart.js/auto';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public ventas : Array<any>=[];
  public const_ventas : Array<any>=[];
  public token = localStorage.getItem('token');
  public page = 1;
  public pageSize = 24;
  public filtro = '';
  public desde :any = undefined;
  public hasta :any = undefined;

  public load_ventas = false;
  public load_productos = false;
  public load_clientes = false;
  public load_cupones = false;
  public load_contacto = false;
  


  public factual = new Date().setMonth(new Date().getMonth() -1);
  public mactual= new Date().getMonth();
  public idmactual:Array<any>=[];
  public faux= new Date().setFullYear(new Date().getFullYear()-1);
  public totalfaux:Array<any>=[0,0,0];
  public totalfactual:Array<any>=[0,0,0];

  public datosventa = {};
  public anio:Array<any>=[];

  constructor(   
    private _adminService:AdminService
    ) {}

  ngOnInit(): void {
    

   this.estadoventas();
  }

  estadoventas(): void {
    this.load_ventas = true;
    this._adminService.obtener_ventas_admin(this.token).subscribe(
      response=>{
        this.ventas = response.data;
        console.log(this.ventas);
        if(this.ventas!=undefined){
        for(var i =0; i<this.ventas.length;i++){
          if((new Date(this.ventas[i].createdAt).getFullYear()) == new Date(this.faux).getFullYear() && this.ventas[i].estado == 'Finalizado'){
            
            if(this.ventas[i].currency=='USD'){
              this.totalfaux[0]=this.ventas[i].total_pagar+this.totalfactual[0];
              
            }else{
              if(this.ventas[i].currency=='PEN'){
                this.totalfaux[1]=this.ventas[i].total_pagar+this.totalfaux[1];
               
              }else{
                this.totalfaux[2]=this.ventas[i].total_pagar+this.totalfaux[2];
                              }
            }
          }

          if((new Date(this.ventas[i].createdAt).getFullYear()) == new Date(this.factual).getFullYear() && this.ventas[i].estado == 'Finalizado'){
           

            if(this.ventas[i].currency=='USD'){
              this.totalfactual[0]=this.ventas[i].total_pagar+this.totalfactual[0];
              
            }else{
              if(this.ventas[i].currency=='PEN'){
                this.totalfactual[1]=this.ventas[i].total_pagar+this.totalfactual[1];
                
              }else{
                this.totalfactual[2]=this.ventas[i].total_pagar+this.totalfactual[2];
                
              }
            }

           
          }
          if(i==0){
            
            this.anio.push({
              label:(new Date(this.ventas[i].createdAt).getFullYear()).toString()+' '+this.ventas[i].estado+' '+this.ventas[i].currency,
              data: [0,0,0,0,0,0,0,0,0,0,0,0],
              backgroundColor:'rgba(54,162,235,0.2)',
              borderColor:'rgba(54,162,235,1)',
              borderWidth:2
            });
            this.anio[0].data[(new Date(this.ventas[i].createdAt).getMonth())]=this.anio[0].data[(new Date(this.ventas[i].createdAt).getMonth())]+this.ventas[i].total_pagar;
           
          }else{
            let aux=(new Date(this.ventas[i].createdAt).getFullYear()).toString()+' '+this.ventas[i].estado+' '+this.ventas[i].currency;
            let con=-1;
            for(var j=0; j<this.anio.length;j++){
              if((this.anio[j].label).toString()==aux){
                con=j;
              }
            }
            if(con==-1){
              this.anio.push({
                label:(new Date(this.ventas[i].createdAt).getFullYear()).toString()+' '+this.ventas[i].estado+' '+this.ventas[i].currency,
                data: [0,0,0,0,0,0,0,0,0,0,0,0],
                backgroundColor:'rgba('+(36/(i+1)+54).toString()+','+(230/(i+1)).toString()+',233,0.2)',
                borderColor:'rgba('+(36/(i+1)+54).toString()+','+(230/(i+1)).toString()+',233,1)',
                borderWidth:2
              });
              this.anio[this.anio.length-1].data[(new Date(this.ventas[i].createdAt).getMonth())]=this.anio[this.anio.length-1].data[(new Date(this.ventas[i].createdAt).getMonth())]+this.ventas[i].total_pagar;
              
            }else{
              this.anio[con].data[(new Date(this.ventas[i].createdAt).getMonth())]=this.anio[con].data[(new Date(this.ventas[i].createdAt).getMonth())]+this.ventas[i].total_pagar;
              
            }
          }
      }
      for(var k=0; k<this.anio.length;k++){
        if(this.anio[k].label.toString()==(new Date(this.factual).getFullYear() + ' '+'Finalizado'+' '+'USD').toString()){
          this.idmactual.push({k,tipo:'USD'});
        }
        if(this.anio[k].label.toString()==(new Date(this.factual).getFullYear() + ' '+'Finalizado'+' '+'PEN').toString()){
          this.idmactual.push({k,tipo:'PEN'});
        }
        if(this.anio[k].label.toString()==(new Date(this.factual).getFullYear() + ' '+'Finalizado'+' '+'COP').toString()){
          this.idmactual.push({k,tipo:'COP'});
        }
      }
      
      
      console.log(this.totalfaux);
      console.log(this.totalfactual);
      console.log(this.mactual);


        console.log(this.anio);

        this.const_ventas = this.ventas;
        
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
    }
    );
  }


  estadoproductos():void {
    this.load_ventas=false;



  }




}

