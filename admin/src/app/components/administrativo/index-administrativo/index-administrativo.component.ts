import { Component, OnInit } from "@angular/core";
import { AdminService } from "src/app/service/admin.service";

declare var iziToast: {
	show: (arg0: {
		title: string;
		titleColor: string;
		color: string;
		class: string;
		position: string;
		message: string;
	}) => void;
};
declare var $: any;
declare var jQuery: any;
@Component({
	selector: "app-index-administrativo",
	templateUrl: "./index-administrativo.component.html",
	styleUrls: ["./index-administrativo.component.css"]
})
export class IndexAdminComponent implements OnInit {
	public estudiantes: Array<any> = [];
	public estudiantes_const: Array<any> = [];
	public token = localStorage.getItem("token");
	public rol: any;
	public yo = 0;
	public page = 1;
	public pageSize = 24;
	public filtro = "";
	public config = {
		licenciacvs: ""
	};
	constructor(private _adminService: AdminService) {}

	ngOnInit(): void {
		let aux = localStorage.getItem("identity");
		this._adminService.obtener_admin(aux, this.token).subscribe((response) => {
			this.rol = response.data.rol;
			if (response.data.email == "samuel.arevalo@espoch.edu.ec") {
				this.yo = 1;
			}
			//console.log(this.yo);
		});

		this._adminService.listar_admin(this.token).subscribe((response) => {
			//console.log(response);

			this.estudiantes_const = response.data;
			this.estudiantes = this.estudiantes_const;
		});
		this._adminService.obtener_config_admin().subscribe((response) => {
			this.config = response.data;
			//console.log(this.config);
		});
	}

	filtrar_estudiante() {
		if (this.filtro) {
			var term = new RegExp(this.filtro.toString().trim(), "i");
			this.estudiantes = this.estudiantes_const.filter(
				(item) =>
					term.test(item.nombres) ||
					term.test(item.apellidos) ||
					term.test(item.nombres+' '+item.apellidos) ||
					term.test(item.email) ||
					term.test(item.dni) ||
					term.test(item.telefono) ||
					term.test(item._id)
			);
		} else {
			this.estudiantes = this.estudiantes_const;
		}
	}
	eliminar(id: any) {
		//console.log(id);
		this._adminService.eliminar_admin(id, this.token).subscribe(
			(response) => {
				iziToast.show({
					title: "SUCCESS",
					titleColor: "#1DC74C",
					color: "#FFF",
					class: "text-success",
					position: "topRight",
					message: "Se eliminó correctamente este usuario."
				});

				$("#delete-" + id).modal("hide");
				$(".modal-backdrop").removeClass("show");

				this.ngOnInit();
			},
			(error) => {
				//console.log(error);
			}
		);
	}
}
