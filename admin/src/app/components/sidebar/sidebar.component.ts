import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AdminService } from "src/app/service/admin.service";
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  public rol: any;
	public nombres: any;
	public estado: any;
	public aux: any;
	public id: any;
	public config: any = {};
	public token = localStorage.getItem("token");
	constructor(private _router: Router, private _adminService: AdminService) {
		let aux = localStorage.getItem("identity");
		this._adminService.obtener_admin(aux, this.token).subscribe((response) => {
			this.rol = response.data.rol;
			this.id = response.data._id;
			this.nombres = response.data.nombres + " " + response.data.apellidos;
			this.aux = response.data.email;
			if (response.data.estado != undefined) {
				this.estado = response.data.estado;
			}
		});
		this._adminService.obtener_config_admin().subscribe((response) => {
			this.config = response.data;

			this._adminService.actualizar_config_admin(this.config, this.token).subscribe();
		});
	}

	ngOnInit(): void {
		//console.log(this.rol);
		if (this.estado == "Fuera" || this.estado == "deshabilitado") {
			this.logout();
		}
	}
  logout(){
    window.location.reload();
    localStorage.removeItem('token');
    localStorage.removeItem('_id');
    localStorage.removeItem('user_data');
    this._router.navigate(['/']).then(() => {
      window.location.reload();
    });;
  }
}
