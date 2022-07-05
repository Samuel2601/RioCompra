import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/service/admin.service';
import Chart from 'chart.js/auto';
import { TableUtil } from "./tableUtil";
declare var iziToast:any;
declare var $:any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public ventas : Array<any>=[];
  public datos: Array<any>=[];
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
  public mtablap=false;
  public filtro_p='Publicado';

  public factual = new Date().setMonth(new Date().getMonth() -1);
  public fanio=(new Date().getFullYear()).toString();
  public mactual= new Date().getMonth();
  public idmactual:Array<any>=[];
  public faux= new Date().setFullYear(new Date().getFullYear()-1);
  public totalfaux:any;
  public totalfactual:any;
  public totales:Array<any>=[];
  public datosventa = {};
  public anio:Array<any>=[];
  public mensajes:Array<any>=[];
  public myChart:any;
  public productos_const: Array<any> = [];
  public productos : Array<any> = [];
  inventario_const: any;
  categorias: any;
  myChart2: any;
  myChart3: any;
  variedad: any;
  public idp=-1;
  public mensajes_const: Array<any> = [];
  public fventas: Array<any> = [];
  public venta_act="";
  cupones_const: any;
  cupones: any;

  constructor(   
    private _adminService:AdminService
    ) {}

  ngOnInit(): void {
    

   this.estadoventas();
  }

  estadoventas(): void {
    this.load_ventas=true;
    this.load_productos=false;
    this.load_contacto=false;
    this.totalfaux=0;
    this.anio=[];
    this.totalfactual=0;
    this.load_ventas = true;

    this.fventas=[];
    this._adminService.obtener_ventas_admin(this.token).subscribe(
      response=>{
        this.ventas = response.data;
        console.log(this.ventas);
        if(this.ventas!=undefined){
        for(var i =0; i<this.ventas.length;i++){
          if(i==0){
              this.fventas.push(new Date(this.ventas[i].createdAt).getFullYear());
          }else{
            var con=-1;
            for(var k=0;k<this.fventas.length;k++){
              if((new Date(this.ventas[i].createdAt).getFullYear()) == this.fventas[k]){
                con=k;
              }
            }
            if(con==-1){
              this.fventas.push(new Date(this.ventas[i].createdAt).getFullYear());
            }
          }
        }
          this.fventas.sort(function (a,b){
            if (a > b) {
              return -1;
            }
            if (a < b) {
              return 1;
            }
            // a must be equal to b
            return 0;
          });
          console.log(this.fventas);
          this.armado_ventas(this.fventas[0]);

      

    }}
    );
  }
  armado_ventas(val:any){
    this.venta_act="";
    this.venta_act=val;
    this.totalfaux=0;
    this.anio=[];
    this.totalfactual=0;
    this.totales=[];
    this.factual = new Date().setMonth(new Date().getMonth() -1);
    this.factual = new Date(this.factual).setFullYear(val);
    this.faux= new Date().setFullYear(val-1);

  
        console.log(this.ventas);
        if(this.ventas!=undefined){
        for(var i =0; i<this.ventas.length;i++){
          
          if((new Date(this.ventas[i].createdAt).getFullYear()) == new Date(this.faux).getFullYear() && this.ventas[i].estado == 'Finalizado'){
            
            if(this.ventas[i].currency=='USD'){
              this.totalfaux=this.ventas[i].total_pagar+this.totalfaux;
              
            }
          }

          if((new Date(this.ventas[i].createdAt).getFullYear()) == new Date(this.factual).getFullYear() && this.ventas[i].estado == 'Finalizado'){
           

            if(this.ventas[i].currency=='USD'){
              this.totalfactual=this.ventas[i].total_pagar+this.totalfactual;
              
            }

           
          }
          if((new Date(this.ventas[i].createdAt).getFullYear()) == new Date(this.factual).getFullYear()){
            if(i==0){
              var r = Math.floor(Math.random() * 256);
              var g = Math.floor(Math.random() * 256);
              var b = Math.floor(Math.random() * 256);
              this.anio.push({
                label:(new Date(this.ventas[i].createdAt).getFullYear()).toString()+' '+this.ventas[i].estado,
                data: [0,0,0,0,0,0,0,0,0,0,0,0],
                backgroundColor:'rgba('+r+','+g+','+b+',0.2)',
                borderColor:'rgba('+r+','+g+','+b+',1)',
                borderWidth:2
              });
              this.anio[0].data[(new Date(this.ventas[i].createdAt).getMonth())]=this.anio[0].data[(new Date(this.ventas[i].createdAt).getMonth())]+this.ventas[i].total_pagar;
             
            }else{
              let aux=(new Date(this.ventas[i].createdAt).getFullYear()).toString()+' '+this.ventas[i].estado;
              let con=-1;
              for(var j=0; j<this.anio.length;j++){
                if((this.anio[j].label).toString()==aux){
                  con=j;
                  j=this.anio.length;
                }
              }
              if(con==-1){
                var r = Math.floor(Math.random() * 256);
                var g = Math.floor(Math.random() * 256);
                var b = Math.floor(Math.random() * 256);
                this.anio.push({
                  label:(new Date(this.ventas[i].createdAt).getFullYear()).toString()+' '+this.ventas[i].estado,
                  data: [0,0,0,0,0,0,0,0,0,0,0,0],
                  backgroundColor:'rgba('+r+','+g+','+b+',0.2)',
                  borderColor:'rgba('+r+','+g+','+b+',1)',
                  borderWidth:2
                });
                this.anio[this.anio.length-1].data[(new Date(this.ventas[i].createdAt).getMonth())]=this.anio[this.anio.length-1].data[(new Date(this.ventas[i].createdAt).getMonth())]+this.ventas[i].total_pagar;
                
              }else{
                this.anio[con].data[(new Date(this.ventas[i].createdAt).getMonth())]=this.anio[con].data[(new Date(this.ventas[i].createdAt).getMonth())]+this.ventas[i].total_pagar;
                
              }
            }
          }
          

      }
      for(var k=0; k<this.anio.length;k++){
        if(this.anio[k].label.toString()==(new Date(this.factual).getFullYear() + ' '+'Finalizado'+' '+'USD').toString()){
          this.idmactual.push({k,tipo:'USD'});
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
        if(this.myChart){
          this.myChart.destroy();
        }
        this.myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
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
        console.log(this.anio);
        this.anio.forEach(element => {    
        this.myChart.data.datasets.push(element);
        var aux=0;
        element.data.forEach((sum:any) => {
          aux+=sum;
        });
        this.totales.push({label:element.label,total:aux});
        });
       // console.log(myChart);
        console.log(this.totales);


        this.myChart.update();
       



      }

  }
  
  exportTable(val:any){
    TableUtil.exportToPdf(val.toString(),val);
  }


  estadoproductos():void {
    this.load_ventas=false;
    this.load_productos=true;
    this.load_contacto=false;
    this.mtablap=true;
    this.idp=-1;
    this.anio=[];
    this.totales=[];
    this._adminService.get_categorias().subscribe(
      response=>{
        this.categorias = response;
        console.log(this.categorias);
        this._adminService.listar_productos_admin(this.token).subscribe(
          response=>{
            this.productos_const = response.data;
            this.productos= this.productos_const;
            console.log(this.productos);
            for(var i=0; i<this.productos.length;i++){
              var cat:any;
              for(var j=0; j< this.categorias.length;j++){
                console.log(this.productos[i].categoria);
                if(this.categorias[j]._id==
                  this.productos[i].categoria){
                  cat=this.categorias[j].titulo;
                  j=this.categorias.length;
                }
              }
              
             // if(new Date(this.productos[i].createdAt).getFullYear()==new Date().getFullYear()){
              if(i==0){
                var r = Math.floor(Math.random() * 256);
                var g = Math.floor(Math.random() * 256);
                var b = Math.floor(Math.random() * 256);
               
                this.anio.push({
                  label:cat+' '+this.productos[i].estado,
                  data: [0,0,0,0,0,0,0,0,0,0,0,0],
                  backgroundColor:'rgba('+r+','+g+','+b+',0.2)',
                  borderColor:'rgba('+r+','+g+','+b+',1)',
                  borderWidth:2
                });
                this.anio[0].data[(new Date(this.productos[i].createdAt).getMonth())]=this.anio[0].data[(new Date(this.productos[i].createdAt).getMonth())]+this.productos[i].nventas;
               
              }else {
                let aux=cat+' '+this.productos[i].estado;
                let con=-1;
                for(var j=0; j<this.anio.length;j++){
                  if((this.anio[j].label).toString()==aux){
                    con=j;
                    j=this.anio.length;
                  }
                }
                if(con==-1){
                  var r = Math.floor(Math.random() * 256);
                  var g = Math.floor(Math.random() * 256);
                  var b = Math.floor(Math.random() * 256);
                  this.anio.push({
                    label:cat+' '+this.productos[i].estado,
                    data: [0,0,0,0,0,0,0,0,0,0,0,0],
                    backgroundColor:'rgba('+r+','+g+','+b+',0.2)',
                    borderColor:'rgba('+r+','+g+','+b+',1)',
                    borderWidth:2
                  });
                  this.anio[this.anio.length-1].data[(new Date(this.productos[i].createdAt).getMonth())]=this.anio[this.anio.length-1].data[(new Date(this.productos[i].createdAt).getMonth())]+this.productos[i].nventas;
                  
                }else{
                  this.anio[con].data[(new Date(this.productos[i].createdAt).getMonth())]=this.anio[con].data[(new Date(this.productos[i].createdAt).getMonth())]+this.productos[i].nventas;
                  
                }
              }
             // }
            }
            var canvas = <HTMLCanvasElement> document.getElementById('myChart2');
            var ctx:CanvasRenderingContext2D|any;
            ctx = canvas.getContext('2d');
            if(this.myChart2){
              this.myChart2.destroy();
            }
            this.myChart2 = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
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
            console.log(this.anio);
            this.anio.forEach(element => {    
            this.myChart2.data.datasets.push(element);
            var aux=0;
            element.data.forEach((sum:any) => {
              aux+=sum;
            });
            this.totales.push({label:element.label,total:aux});
            });
           // console.log(myChart);
            console.log(this.totales);
    
    
            this.myChart2.update();
    
            this._adminService.listar_inventario_admin(this.token).subscribe(
              response=>{
                this.variedad=[];
                this.inventario_const=response.data;
                console.log(this.inventario_const);
                this.inventario_const.forEach((element:any) => {              
                  if(element.producto!=null){
                    var id:string=element.producto._id;
                  //console.log(id);
                    this._adminService.listar_inventario_producto_admin(id,this.token).subscribe(response=>{
                      this.variedad.push(response.data);
                    }); 
                  }
                });
    
                console.log( this.variedad);
              }
            );
          }
        );
      }
    );
   


  }
  devolver(){
    this.mtablap=true;
    if(this.myChart3){
    this.myChart3.destroy();
    }
    var nproducto=document.getElementById("nproducto");
    if(nproducto){
      nproducto.style.display="";
    }

    
  }
  armado_inventario(val:number){
    var nproducto=document.getElementById("nproducto");
    if(nproducto){
      nproducto.style.display="none";
    }
  this.mtablap=false;

      this.idp=val;
     this.datos=[];
      var labels:any=[]=[];
      var ver:any=[]=[];
      console.log(this.variedad);
      this.variedad.forEach((element:any) => {
        //console.log('Elementos:'+element);
      element.forEach((element2:any) => {
      console.log('Elemento2'+element2);
      
        //console.log((labels.find((elementl:any)=>elementl==element2.variedad.valor)==undefined)==true);
        if(element2.variedad!=null&& this.productos[val]._id==element2.producto&&(labels==undefined||labels.find((elementl:any)=>elementl==element2.variedad.valor)==undefined)){
        // console.log('Variedad',element2.variedad.valor);
          labels.push(element2.variedad.valor);
        }
      });
      });

      
      this.variedad.forEach((element:any) => {
        //console.log('Elementos:'+element);
      element.forEach((element2:any) => {
      // console.log('Elemento2'+element2);
        
        
        if(this.productos[val]._id==element2.producto&&(ver.find((elementver:any)=>elementver==element2._id)==undefined)){
          ver.push(element2._id);
          var r = 137;
          var g = 19;
          var b =218;

          if(this.datos==undefined||this.datos.find((elementb:any)=>elementb.label==element2.variedad.valor+" Stock")==undefined){
            var data1:any=[]=[];
            var data2:any=[]=[];
            
            labels.forEach((element:any) => {
              data1.push(0);
              data2.push(0);
            });
            this.datos.push({
              label:element2.variedad.valor+" Stock",
              data: data1,
              backgroundColor:'rgba(17,249,164,0.2)',
              borderColor:'rgba(17,249,164,1)',
              borderWidth:2
              });
            
              this.datos.push({
                label:element2.variedad.valor+" Inventario",
                data: data2,
                backgroundColor:'rgba('+r+','+g+','+b+',0.2)',
                borderColor:'rgba('+r+','+g+','+b+',1)',
                borderWidth:2
                });
          }
          var con=-1;
            for(var k=0;k<labels.length;k++){
              if(labels[k]==element2.variedad.valor){
                  con=k;
              }
            }
            console.log("Variedad:",element2.variedad.valor,"Encontrado",con,"Cantidad: ",element2.cantidad );
            if(con!=-1){
              for(var l=0;l<this.datos.length;l++){
                
                if(this.datos[l].label==element2.variedad.valor+" Stock"){
                this.datos[l].data[con]=element2.variedad.stock;
                if(this.datos[l+1].label==element2.variedad.valor+" Inventario"){
                  // console.log("Variedad:",element2.variedad.valor,"Valor: ",element2.cantidad);
                  this.datos[l+1].data[con]+=element2.cantidad;
                  }
                l=this.datos.length;
                }
            } 
            }

        }
      });
      });
      /*
      datos.forEach((element:any) => {
        //console.log(element.label.includes('Inventario'));
        if(element.label.includes('Inventario')){
          element.data.forEach((element2:any) => {
            console.log("Antes",element2);
            element2=element2/5;
            console.log("Despues",element2);
          });
        }
      });
  */

      console.log(labels);
      console.log(this.datos);
      var canvas = <HTMLCanvasElement> document.getElementById('myChart3');
      var ctx:CanvasRenderingContext2D|any;
      ctx = canvas.getContext('2d');
      if(this.myChart3){
        this.myChart3.destroy();
      }
      this.myChart3 = new Chart(ctx, {
          type: 'bar',
          data: {
              labels: labels,
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
      this.datos.forEach((element:any) => {    
        this.myChart3.data.datasets.push(element);

        });
        this.myChart3.update();

    
  }
  filtro_producto(){
    if(this.filtro_p=='Publicado'){
      this.filtro_p='Edicion';
    }else{
      this.filtro_p='Publicado';
    }
  }
  filtrar_producto(){
    if(this.filtro){
      var term = new RegExp(this.filtro.toString().trim() , 'i');
      this.productos = this.productos_const.filter(item=>term.test(item.titulo)||term.test(item.slug)||term.test(item._id));
    }else{
      this.productos = this.productos_const;
    }
  }
  estadocontacto(){
    this.load_ventas=false
    this.load_productos=false;
    this.load_contacto=true;
    this._adminService.listar_mensaje_contacto(this.token).subscribe(response=>{
      this.mensajes_const=response.data;
      console.log(this.mensajes_const);
      this.abierto();
    });
  }
  abierto(){
    var b = document.getElementById('mabierto');
    var a = document.getElementById('mcerrado');
    
    if(a){
      a.style.display="";
    }
    if(b){
      b.style.display="none";
    }
    this.mensajes=[];
    this.mensajes_const.forEach((element:any) => {
      if(element.estado=='Abierto'){
        this.mensajes.push(element);
      }
    });
  }
  cerrado(){
  
    var a = document.getElementById('mabierto');
    var b = document.getElementById('mcerrado');
    
    if(a){
      a.style.display="";
    }
    if(b){
      b.style.display="none";
    }
    this.mensajes=[];
    this.mensajes_const.forEach((element:any) => {
      if(element.estado=='Cerrado'){
        this.mensajes.push(element);
      }
    });
  }
  finalizarcontacto(val:any){
    this._adminService.cerrar_mensaje_contacto(this.mensajes[val]._id,this.token).subscribe(response=>{
      if(response.message=='Cerrado con Exito'){
        iziToast.show({
          title: 'SUCCESS',
          titleColor: '#1DC74C',
          color: '#FFF',
          class: 'text-success',
          position: 'topRight',
          message: response.message
      });
      this.estadocontacto();
      }
    });
  }



}

