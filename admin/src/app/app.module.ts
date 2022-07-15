import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { routing } from "./app.routing";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { NgbModule,NgbPaginationModule  } from "@ng-bootstrap/ng-bootstrap";
import { NgxTinymceModule } from 'ngx-tinymce';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TopnavComponent } from './components/topnav/topnav.component';
import { IndexClientesComponent } from './components/clientes/index-clientes/index-clientes.component';
import { DetalleClientesComponent } from './components/clientes/detalle-clientes/detalle-clientes.component';
import { IndexProductoComponent } from './components/productos/index-producto/index-producto.component';
import { CreateProductoComponent } from './components/productos/create-producto/create-producto.component';
import { EditProductoComponent } from './components/productos/edit-producto/edit-producto.component';
import { VariedadesProductoComponent } from './components/productos/variedades-producto/variedades-producto.component';
import { InventarioProductoComponent } from './components/productos/inventario-producto/inventario-producto.component';
import { GaleriaProductoComponent } from './components/productos/galeria-producto/galeria-producto.component';
import { IndexCuponComponent } from './components/cupones/index-cupon/index-cupon.component';
import { CreateCuponComponent } from './components/cupones/create-cupon/create-cupon.component';
import { EditCuponComponent } from './components/cupones/edit-cupon/edit-cupon.component';
import { ConfigComponent } from './components/config/config.component';
import { IndexVentasComponent } from './components/ventas/index-ventas/index-ventas.component';
import { ShowVentasComponent } from './components/ventas/show-ventas/show-ventas.component';
import { CreateVentasComponent } from './components/ventas/create-ventas/create-ventas.component';

import { CreateAdminComponent } from "./components/administrativo/create-administrativo/create-administrativo.component";
import { EditAdminComponent } from "./components/administrativo/edit-administrativo/edit-administrativo.component";
import { IndexAdminComponent } from "./components/administrativo/index-administrativo/index-administrativo.component";

import localeES from '@angular/common/locales/es';
import {registerLocaleData} from '@angular/common';
registerLocaleData(localeES,'es');

@NgModule({
  exports:[

  ],
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    SidebarComponent,
    TopnavComponent,
    IndexClientesComponent,
    DetalleClientesComponent,
    IndexProductoComponent,
    CreateProductoComponent,
    EditProductoComponent,
    VariedadesProductoComponent,
    InventarioProductoComponent,
    GaleriaProductoComponent,
    IndexCuponComponent,
    CreateCuponComponent,
    EditCuponComponent,
    ConfigComponent,
    IndexVentasComponent,
    ShowVentasComponent,
    CreateVentasComponent,
    CreateAdminComponent,
		EditAdminComponent,
		IndexAdminComponent,
  ],
  imports: [
    
    BrowserModule,
    AppRoutingModule,
    routing,
    FormsModule,
    HttpClientModule,
    NgbPaginationModule,
    NgxTinymceModule.forRoot({
      baseURL: '//cdnjs.cloudflare.com/ajax/libs/tinymce/5.7.1/',
    }),
  ],
  providers: [{provide:LOCALE_ID,useValue:'es'}],
  bootstrap: [AppComponent]
})
export class AppModule { }
