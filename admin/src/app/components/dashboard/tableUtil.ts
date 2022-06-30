
export class TableUtil {
    static exportToPdf(tableId: string, name: string) {
       let printContents:any, popupWin:any;

      printContents = document.getElementById(tableId)!.innerHTML;
      
      popupWin = window.open('', '_blank', 'top=0,left=0,height=auto,width=auto');
      popupWin.document.open();
      popupWin.document.write(`
    <html>
      <head>
        <title>DETALLE ECONOMICO DE VENTAS`+name+`</title>
       <style>
      
      td {
        border:  1px solid;
      }
      tr {
        border:  1px solid;
      }
      th {
        border:  1px solid;
      }
      thead.th {
        border:  1px solid;
      }
       </style>
      </head>
        <body onload="window.print();window.close()">
        <div style="margin-right: auto;
       margin-left: auto;  >
           <div style="margin-top: 70px; margin-left:5% ;">
           <img _ngcontent-twf-c49="" src="https://i.postimg.cc/R0xRWpTc/Logo-Rojo.png" alt="..." 
               class="navbar-brand-img mx-auto" style="max-height: 4rem !important;" style="">
           </div>

           <div style="margin-top: -70px ; margin-left:-10%;text-align:center;">
           <h2><b>
           CENTRO COMERCIAL CONDAMINE <br>"RIOCOMPRAS"</b>
           <h4 style=" text-align:center;">
           Dirección: Carabobo y Colombia<br>

           Teléfono: 0995767887<br>

      
           </h4>

           </h2>
           
           </div>
          <div>
          <b>Ventas: `+name+`</b> 
          </div>
           <div style="margin-top: -150px; margin-left:80% ;display: none;">
           <img _ngcontent-twf-c49="" src="https://i.postimg.cc/ThvxfG15/nuevo-logo-Mineduc.jpg" alt="..." 
               class="navbar-brand-img mx-auto" style="max-height: 4rem !important;" style="display: none;"><br>
               <img _ngcontent-twf-c49="" src="https://i.postimg.cc/ZYBybc0J/Politics-of-Ecuador-Guillermo-Lasso-Administration-logo-svg.png" alt="..." 
               class="navbar-brand-img mx-auto" style="max-height: 4rem !important;" style="display: none;">
           </div>

           
       </div>
       
     
     
      <table style="border: 1px solid black;text-align:center; margin-top: 7%;margin-right: auto;
      margin-left: auto; width: 100%;" >
        ${printContents}
       </table>
            
        </body>
        
    </html>`
      );
      popupWin.document.close();
    }
    static exportToPdfTotal(tableId: string, name: string) {
      let printContents:any, popupWin:any;

     printContents = document.getElementById(tableId)!.innerHTML;
     
     popupWin = window.open('', '_blank', 'top=0,left=0,height=auto,width=auto');
     popupWin.document.open();
     popupWin.document.write(`
   <html>
     <head>
       <title>DETALLE ECONOMICO DE VENTAS`+name+`</title>
      <style>
     
     td {
       border:  1px solid;
     }
     tr {
       border:  1px solid;
     }
     th {
       border:  1px solid;
     }
     thead.th {
       border:  1px solid;
     }
      </style>
     </head>
       <body onload="window.print();window.close()">
       <div style="margin-right: auto;
      margin-left: auto;  >
          <div style="margin-top: 70px; margin-left:5% ;">
          <img _ngcontent-twf-c49="" src="https://i.postimg.cc/R0xRWpTc/Logo-Rojo.png" alt="..." 
              class="navbar-brand-img mx-auto" style="max-height: 4rem !important;" style="">
          </div>

          <div style="margin-top: -70px ; margin-left:-10%;text-align:center;">
          <h2><b>
          CENTRO COMERCIAL CONDAMINE <br>"RIOCOMPRAS"</b>
          <h4 style=" text-align:center;">
          Dirección: Carabobo y Colombia<br>

          Teléfono: 062712968<br>

          Año lectivo `+name+`
          </h4>

          </h2>
          
          </div>
         <div>
         <b>Ventas: `+name+`</b> 
         </div>
          <div style="margin-top: -150px; margin-left:80% ;display: none;">
          <img _ngcontent-twf-c49="" src="https://i.postimg.cc/ThvxfG15/nuevo-logo-Mineduc.jpg" alt="..." 
              class="navbar-brand-img mx-auto" style="max-height: 4rem !important;" style="display: none;"><br>
              <img _ngcontent-twf-c49="" src="https://i.postimg.cc/ZYBybc0J/Politics-of-Ecuador-Guillermo-Lasso-Administration-logo-svg.png" alt="..." 
              class="navbar-brand-img mx-auto" style="max-height: 4rem !important;" style="display: none;">
          </div>

          
      </div>
      
    
    
     <table style="border: 1px solid black;text-align:center; margin-top: 7%;margin-right: auto;
     margin-left: auto; width: 100%;" >
       ${printContents}
      </table>
           
       </body>
       
   </html>`
     );
     popupWin.document.close();
   }


  }