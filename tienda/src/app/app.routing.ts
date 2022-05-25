import { Routes, RouterModule } from "@angular/router";
import { ModuleWithProviders } from "@angular/core";
import { InicioComponent } from "./components/inicio/inicio.component";
import { LoginComponent } from "./components/login/login.component";
import { CuentaComponent } from "./components/perfil/cuenta/cuenta.component";
import { DireccionesComponent } from "./components/perfil/direcciones/direcciones.component";
import { IndexProductoComponent } from "./components/productos/index-producto/index-producto.component";
import { ShowProductoComponent } from "./components/productos/show-producto/show-producto.component";
import { CarritoComponent } from "./components/carrito/carrito.component";
import { CheckoutComponent } from "./components/checkout/checkout.component";
import { PedidosComponent } from "./components/perfil/pedidos/pedidos.component";
import { DpedidosComponent } from "./components/perfil/dpedidos/dpedidos.component";
import { VerifyPagoComponent } from "./components/verify-pago/verify-pago.component";
import { ReviewsComponent } from "./components/perfil/reviews/reviews.component";
import { EmbajadorasComponent } from "./components/static/embajadoras/embajadoras.component";
import { ImpactoComponent } from "./components/static/impacto/impacto.component";
import { NosotrosComponent } from "./components/static/nosotros/nosotros.component";
import { PoliticasEnvioComponent } from "./components/static/politicas-envio/politicas-envio.component";
import { TerminosCondicionesComponent } from "./components/static/terminos-condiciones/terminos-condiciones.component";
import { ContactoComponent } from "./components/static/contacto/contacto.component";
import { NotfoundComponent } from "./components/notfound/notfound.component";
import { AuthGuard } from "../app/guards/auth.guard";

const appRoute : Routes = [
    {path: '', component: InicioComponent},
    {path: 'login', component: LoginComponent},

    {path: 'cuenta/perfil', component: CuentaComponent, canActivate:[AuthGuard]},
    {path: 'cuenta/direcciones', component: DireccionesComponent, canActivate:[AuthGuard]},
    {path: 'cuenta/pedidos', component: PedidosComponent, canActivate:[AuthGuard]},
    {path: 'cuenta/pedidos/:id', component: DpedidosComponent, canActivate:[AuthGuard]},
    {path: 'cuenta/reviews', component: ReviewsComponent, canActivate:[AuthGuard]},

    {path: 'verificar-pago/:tipo/:direccion/:cupon/:envio/:tipo_descuento/:valor_descuento/:total_pagar/:subtotal', component: VerifyPagoComponent},

    {path: 'carrito', component: CarritoComponent},
    {path: 'checkout', component: CheckoutComponent, canActivate:[AuthGuard]},

    {path: 'productos', component: IndexProductoComponent},
    {path: 'productos/categoria/:categoria', component: IndexProductoComponent},
    {path: 'productos/:slug', component: ShowProductoComponent},

    {path: 'contacto', component: ContactoComponent},
    {path: 'embajadoras', component: EmbajadorasComponent},
    {path: 'impacto-social', component: ImpactoComponent},
    {path: 'nosotros', component: NosotrosComponent},
    {path: 'politicas-envio', component: PoliticasEnvioComponent},
    {path: 'terminos-condiciones', component: TerminosCondicionesComponent},
    {path: '**', component: NotfoundComponent}
]

export const appRoutingPorviders : any[]=[];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoute, { onSameUrlNavigation: 'reload' });